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

        stage('Run Tests') {
            steps {
                sh 'npm test -- --passWithNoTests || true'
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
                withEnv([
                    "FIREBASE_API_KEY=${env.FIREBASE_API_KEY ?: ''}",
                    "FIREBASE_AUTH_DOMAIN=${env.FIREBASE_AUTH_DOMAIN ?: ''}",
                    "FIREBASE_PROJECT_ID=${env.FIREBASE_PROJECT_ID ?: ''}",
                    "FIREBASE_STORAGE_BUCKET=${env.FIREBASE_STORAGE_BUCKET ?: ''}",
                    "FIREBASE_MESSAGING_SENDER_ID=${env.FIREBASE_MESSAGING_SENDER_ID ?: ''}",
                    "FIREBASE_APP_ID=${env.FIREBASE_APP_ID ?: ''}",
                    "FIREBASE_MEASUREMENT_ID=${env.FIREBASE_MEASUREMENT_ID ?: ''}",
                    "FIREBASE_DATABASE_URL=${env.FIREBASE_DATABASE_URL ?: ''}"
                ]) {
                    sh 'npm run build:prod'
                }
            }
        }

        stage('Deploy Firebase Hosting') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([string(credentialsId: 'firebase-token', variable: 'FIREBASE_TOKEN')]) {
                    sh '''
                        npm install -g firebase-tools
                        firebase use "${FIREBASE_PROJECT_ID}" --non-interactive
                        firebase deploy --only hosting --token "${FIREBASE_TOKEN}" --non-interactive
                    '''
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
                branch 'main'
            }
            steps {
                withCredentials([string(credentialsId: 'firebase-token', variable: 'FIREBASE_TOKEN')]) {
                    sh '''
                        firebase deploy --only firestore:rules,database:rules --token "${FIREBASE_TOKEN}" --non-interactive
                    '''
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
