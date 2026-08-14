pipeline {
    agent any

    environment {
        NODE_VERSION = '20'
        FIREBASE_PROJECT_ID = credentials('firebase-project-id')
        FIREBASE_TOKEN = credentials('firebase-token')
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_IMAGE = "epaycrm/web:${env.BUILD_NUMBER}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
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
                sh 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    junit '**/test-results/*.xml'
                    publishHTML(target: [
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }

        stage('Build Application') {
            steps {
                sh 'npm run build:prod'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}")
                }
            }
        }

        stage('Push Docker Image') {
            when {
                branch 'main'
            }
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'dockerhub-credentials') {
                        docker.image("${DOCKER_IMAGE}").push()
                        docker.image("${DOCKER_IMAGE}").push('latest')
                    }
                }
            }
        }

        stage('Deploy to Firebase') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    npm install -g firebase-tools
                    firebase use ${FIREBASE_PROJECT_ID} --non-interactive
                    firebase deploy --only hosting --non-interactive
                '''
            }
        }

        stage('Deploy Firebase Rules') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    firebase deploy --only firestore:rules,database:rules --non-interactive
                '''
            }
        }
    }

    post {
        success {
            emailext(
                subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Build ${env.BUILD_URL} succeeded.",
                to: "${env.CHANGE_AUTHOR_EMAIL ?: 'team@epaycrm.com'}"
            )
        }
        failure {
            emailext(
                subject: "FAILURE: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Build ${env.BUILD_URL} failed.",
                to: "${env.CHANGE_AUTHOR_EMAIL ?: 'team@epaycrm.com'}"
            )
        }
        always {
            cleanWs()
        }
    }
}
