def loadEnvFromFile(String envFile) {
    if (fileExists(envFile)) {
        echo "Loading environment variables from ${envFile}"
        def content = readFile(envFile)
        content.split('\n').each { line ->
            def trimmedLine = line.trim()
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                def parts = trimmedLine.split('=', 2)
                if (parts.size() == 2) {
                    def key = parts[0].trim()
                    def value = parts[1].trim()
                    env[key] = value
                }
            }
        }
    }
}

pipeline {
    agent { label 'epay' }

    tools {
        nodejs 'NodeJS-20' // Assumes a 'NodeJS-20' installation is configured in Jenkins Global Tool Configuration
    }

    environment {
        PATH = "${env.HOME}/.local/bin:${env.PATH}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        skipDefaultCheckout()
        timeout(time: 20, unit: 'MINUTES')
        timestamps()
    }

    parameters {
        booleanParam(name: 'DEPLOY_TO_PROD', defaultValue: false, description: 'Allow deploy to production')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Purva1610/EPAY-CRM.git'
            }
        }

        stage('Setup Node.js') {
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci --prefer-offline --no-audit'
            }
        }

        stage('Load Environment') {
            steps {
                script {
                    def envFile = fileExists('.env') ? '.env' : (fileExists('.env.production') ? '.env.production' : null)
                    if (!envFile) {
                        echo 'No .env or .env.production file found, using Jenkins environment variables'
                    }
                }
            }
        }

        stage('Load Firebase Credentials') {
            steps {
                withCredentials([string(credentialsId: 'firebase', variable: 'FIREBASE_CREDENTIALS_JSON')]) {
                    script {
                        def jsonFile = '/tmp/firebase-credentials.json'
                        writeFile file: jsonFile, text: env.FIREBASE_CREDENTIALS_JSON
                        sh '''
                            node -e "
                            const fs = require('fs');
                            const creds = JSON.parse(fs.readFileSync('/tmp/firebase-credentials.json','utf8'));
                            const lines = Object.entries(creds).map(([k,v]) => `${k}=${JSON.stringify(v)}`).join('\\n');
                            fs.writeFileSync('.env.production', lines);
                            "
                        '''
                        echo 'Created .env.production from Jenkins credentials. It will be loaded in the next stage.'
                    }
                }
            }
            post {
                always {
                    sh 'rm -f /tmp/firebase-credentials.json'
                }
            }
        }

        stage('Validate Environment') {
            steps {
                script {
                    loadEnvFromFile('.env.production')
                }
                script {
                    def required = [
                        'FIREBASE_API_KEY',
                        'FIREBASE_AUTH_DOMAIN',
                        'FIREBASE_PROJECT_ID',
                        'FIREBASE_STORAGE_BUCKET',
                        'FIREBASE_MESSAGING_SENDER_ID',
                        'FIREBASE_APP_ID'
                    ]
                    def missing = []
                    for (int i = 0; i < required.size(); i++) {
                        def key = required[i]
                        if (!env[key]) {
                            missing.add(required[i])
                        }
                    }
                    if (missing.size() > 0) {
                        error("Missing required Firebase environment variables: ${missing.join(', ')}. Add them to .env, .env.production, or Jenkins environment.")
                    }
                    echo 'All required Firebase environment variables are present'
                }
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: '**/test-results/*.xml'

                    script {
                        if (fileExists('coverage/index.html')) {
                            publishHTML(target: [
                                reportDir: 'coverage',
                                reportFiles: 'index.html',
                                reportName: 'Coverage Report'
                            ])
                        }
                    }
                }
            }
        }

        stage('Build Application') {
            steps {
                script {
                    sh 'npm run build:prod'

                    // Resolve the Firebase project ID once here, right after the build,
                    // while dist/BUILD_MANIFEST.json is guaranteed to exist. Both deploy
                    // stages below just read env.RESOLVED_PROJECT_ID instead of re-deriving it.
                    def resolvedProjectId = env.FIREBASE_PROJECT_ID
                    if (!resolvedProjectId && fileExists('dist/BUILD_MANIFEST.json')) {
                        resolvedProjectId = sh(
                            script: "node -e \"console.log(JSON.parse(require('fs').readFileSync('dist/BUILD_MANIFEST.json','utf8')).firebaseProject)\"",
                            returnStdout: true
                        ).trim()
                    }
                    if (!resolvedProjectId) {
                        error('FIREBASE_PROJECT_ID is not set and could not be read from BUILD_MANIFEST.json')
                    }
                    env.RESOLVED_PROJECT_ID = resolvedProjectId
                }
            }
        }

        stage('Deploy Firebase Hosting') {
            when {
                expression { params.DEPLOY_TO_PROD == true }
            }
            steps {
                script {
                    withCredentials([string(credentialsId: 'firebase', variable: 'FIREBASE_TOKEN')]) {
                        sh '''
                            npm install -g firebase-tools
                            firebase use "${RESOLVED_PROJECT_ID}" --non-interactive
                            firebase deploy --only hosting --token "${FIREBASE_TOKEN}" --non-interactive
                        '''
                    }
                }
            }
        }

        stage('Deploy Firebase Rules') {
            steps {
                script {
                    echo "Skipping rules deployment as it's handled by a separate, manual process or a different pipeline."
                }
            }
        }
    }

    // Single cleanup point at the very end, after both deploy stages have had
    // a chance to run — instead of wiping the workspace between them.
    post {
        always {
            cleanWs()
        }
    }
}