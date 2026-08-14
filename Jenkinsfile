pipeline {
    agent { label 'epay' }

    environment {
        NODE_VERSION = '20'
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
                    if (!sh(script: 'which node', returnStatus: true).equals(0)) {
                        sh '''
                            echo "Node.js not found. Installing via NodeSource..."
                            curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
                            apt-get install -y nodejs
                        '''
                    }
                }
                sh 'node --version'
                sh 'npm --version'
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
