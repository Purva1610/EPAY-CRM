pipeline {
    agent { label 'epay' }

    environment {
        NODE_VERSION = '20'
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
                script {
                    def nodeBin = sh(script: 'which node || echo ""', returnStdout: true).trim()
                    if (!nodeBin) {
                        sh '''
                            echo "Node.js not found. Installing to ~/.local ..."
                            NODE_VERSION=20.15.1
                            curl -fsSL https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz -o /tmp/node.tar.xz
                            mkdir -p ~/.local
                            tar -xJf /tmp/node.tar.xz -C ~/.local --strip-components=1
                            echo 'export PATH=~/.local/bin:$PATH' >> ~/.bashrc
                            export PATH=~/.local/bin:$PATH
                        '''
                    }
                }
                sh 'export PATH=~/.local/bin:$PATH && node --version'
                sh 'export PATH=~/.local/bin:$PATH && npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Load Environment') {
            steps {
                script {
                    def loadEnvFromFile(String filename) {
                        def content = readFile(filename).trim()
                        content.split('\n').each { line ->
                            line = line.trim()
                            if (line && !line.startsWith('#')) {
                                def parts = line.split('=', 2)
                                if (parts.length == 2) {
                                    env[parts[0].trim()] = parts[1].trim()
                                }
                            }
                        }
                    }

                    if (!fileExists('.env') && !fileExists('.env.production')) {
                        echo 'No .env or .env.production file found, using Jenkins environment variables'
                    } else {
                        if (fileExists('.env.production')) {
                            loadEnvFromFile('.env.production')
                        } else if (fileExists('.env')) {
                            loadEnvFromFile('.env')
                        }
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
                            const lines = Object.entries(creds).map(([k,v]) => k+'='+v).join('\\n');
                            fs.writeFileSync('.env.production', lines);
                            "
                        '''
                        def content = readFile('.env.production').trim()
                        content.split('\n').each { line ->
                            line = line.trim()
                            if (line && !line.startsWith('#')) {
                                def parts = line.split('=', 2)
                                if (parts.length == 2) {
                                    env[parts[0].trim()] = parts[1].trim()
                                }
                            }
                        }
                        echo 'Loaded Firebase configuration from Jenkins credentials'
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
                        def val = env.getProperty(required[i])
                        if (!val) {
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
                    // Directly use the environment variables loaded in previous stages.
                    // The build process (e.g., Vite, Webpack) should be configured
                    // to pick up these env vars (e.g., process.env.FIREBASE_API_KEY).
                    sh 'npm run build:prod'
                }
            }
        }

        stage('Deploy Firebase Hosting') {
            when {
                allOf {
                    branch 'main'
                    expression { params.DEPLOY_TO_PROD == true }
                }
            }
            steps {
                script {
                    def projectId = env.FIREBASE_PROJECT_ID
                    if (!projectId && fileExists('dist/BUILD_MANIFEST.json')) {
                        projectId = sh(script: "node -e \"console.log(JSON.parse(require('fs').readFileSync('dist/BUILD_MANIFEST.json','utf8')).firebaseProject)\"", returnStdout: true).trim()
                    }

                    if (!projectId) {
                        error('FIREBASE_PROJECT_ID is not set and could not be read from BUILD_MANIFEST.json')
                    }

                    input message: 'Deploy to production?', okText: 'Deploy'

                    withCredentials([string(credentialsId: 'firebase', variable: 'FIREBASE_TOKEN')]) {
                        sh '''
                            npm install -g firebase-tools
                            firebase use "${projectId}" --non-interactive
                            firebase deploy --only hosting --token "${FIREBASE_TOKEN}" --non-interactive
                        '''
                    }
                }
            }
            post {
                always {
                    cleanWs()
                }
            }
        }

        stage('Deploy Firebase Rules') {
            when {
                allOf {
                    branch 'main'
                    expression { params.DEPLOY_TO_PROD == true }
                }
            }
            steps {
                script {
                    def projectId = env.FIREBASE_PROJECT_ID
                    if (!projectId && fileExists('dist/BUILD_MANIFEST.json')) {
                        projectId = sh(script: "node -e \"console.log(JSON.parse(require('fs').readFileSync('dist/BUILD_MANIFEST.json','utf8')).firebaseProject)\"", returnStdout: true).trim()
                    }

                    if (!projectId) {
                        error('FIREBASE_PROJECT_ID is not set and could not be read from BUILD_MANIFEST.json')
                    }

                    input message: 'Deploy Firebase Rules to production?', okText: 'Deploy'

                    withCredentials([string(credentialsId: 'firebase', variable: 'FIREBASE_TOKEN')]) {
                        sh '''
                            firebase use "${projectId}" --non-interactive
                            firebase deploy --only firestore:rules,database:rules --token "${FIREBASE_TOKEN}" --non-interactive
                        '''
                    }
                }
            }
            post {
                always {
                    cleanWs()
                }
            }
        }
    }
}
