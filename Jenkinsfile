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
                    def envFile = fileExists('.env') ? '.env' : (fileExists('.env.production') ? '.env.production' : null)
                    if (envFile) {
                        def content = readFile envFile
                        def lines = content.split('\n')
                        for (int i = 0; i < lines.length; i++) {
                            def line = lines[i].trim()
                            if (line && !line.startsWith('#')) {
                                def idx = line.indexOf('=')
                                if (idx > 0) {
                                    def key = line.substring(0, idx).trim()
                                    def value = line.substring(idx + 1).trim()
                                    env.setProperty(key, value)
                                }
                            }
                        }
                        echo "Loaded environment variables from ${envFile}"
                    } else {
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
                            const lines = Object.entries(creds).map(([k,v]) => k+'='+v).join('\\n');
                            fs.writeFileSync('.env', lines);
                            "
                        '''
                        def content = readFile '.env'
                        def lines = content.split('\n')
                        for (int i = 0; i < lines.length; i++) {
                            def line = lines[i].trim()
                            if (line && !line.startsWith('#')) {
                                def idx = line.indexOf('=')
                                if (idx > 0) {
                                    def key = line.substring(0, idx).trim()
                                    def value = line.substring(idx + 1).trim()
                                    env.setProperty(key, value)
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
                    def content = readFile '.env'
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
                        if (!content.contains(key + '=')) {
                            missing.add(key)
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
                sh 'npm run build:prod'
            }
        }

        stage('Deploy Firebase Hosting') {
            when {
                expression { params.DEPLOY_TO_PROD == true }
            }
            steps {
                script {
                    def projectId = null
                    def envContent = readFile '.env'
                    def lines = envContent.split('\n')
                    for (int i = 0; i < lines.length; i++) {
                        def line = lines[i].trim()
                        if (line.startsWith('FIREBASE_PROJECT_ID=')) {
                            projectId = line.substring(line.indexOf('=') + 1).trim()
                            break
                        }
                    }
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
        }

        stage('Deploy Firebase Rules') {
            when {
                expression { params.DEPLOY_TO_PROD == true }
            }
            steps {
                script {
                    def projectId = null
                    def envContent = readFile '.env'
                    def lines = envContent.split('\n')
                    for (int i = 0; i < lines.length; i++) {
                        def line = lines[i].trim()
                        if (line.startsWith('FIREBASE_PROJECT_ID=')) {
                            projectId = line.substring(line.indexOf('=') + 1).trim()
                            break
                        }
                    }
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