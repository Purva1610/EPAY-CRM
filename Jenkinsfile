pipeline {
    agent { label 'epay' }

    environment {
        NODE_VERSION = '20'
        FIREBASE_PROJECT_ID = credentials('firebase-project-id')
        FIREBASE_TOKEN = credentials('firebase-token')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
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
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Installs modules needed for testing and building
                sh 'npm ci' 
            }
            // REMOVED early cleanWs() from here so files aren't wiped prematurely
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
                    "FIREBASE_PROJECT_ID=${env.FIREBASE_PROJECT_ID}",
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
            steps {
                sh '''
                    npm install -g firebase-tools
                    firebase use "${FIREBASE_PROJECT_ID}" --non-interactive
                    firebase deploy --only hosting --token "${FIREBASE_TOKEN}" --non-interactive
                '''
            }
        }

        stage('Deploy Firebase Rules') {
            steps {
                sh '''
                    firebase deploy --only firestore:rules,database:rules --token "${FIREBASE_TOKEN}" --non-interactive
                '''
            }
        }
    }

    post {
        success {
            catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                emailext(
                    subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: "Build ${env.BUILD_URL} succeeded.",
                    to: "${env.CHANGE_AUTHOR_EMAIL ?: 'team@epaycrm.com'}"
                )
            }
        }
        failure {
            catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                emailext(
                    subject: "FAILURE: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: "Build ${env.BUILD_URL} failed.",
                    to: "${env.CHANGE_AUTHOR_EMAIL ?: 'team@epaycrm.com'}"
                )
            }
        }
        always {
            // Cleans up the agent workspace safely after everything completes
            cleanWs() 
        }
    }
}
