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
                script {
                    def firebaseConfig = [
                        apiKey:         env.FIREBASE_API_KEY         ?: '',
                        authDomain:     env.FIREBASE_AUTH_DOMAIN     ?: '',
                        projectId:      env.FIREBASE_PROJECT_ID      ?: '',
                        storageBucket:  env.FIREBASE_STORAGE_BUCKET  ?: '',
                        messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID ?: '',
                        appId:          env.FIREBASE_APP_ID          ?: '',
                        measurementId:  env.FIREBASE_MEASUREMENT_ID  ?: '',
                        databaseUrl:    env.FIREBASE_DATABASE_URL    ?: ''
                    ]

                    withEnv([
                        "FIREBASE_API_KEY=${firebaseConfig.apiKey}",
                        "FIREBASE_AUTH_DOMAIN=${firebaseConfig.authDomain}",
                        "FIREBASE_PROJECT_ID=${firebaseConfig.projectId}",
                        "FIREBASE_STORAGE_BUCKET=${firebaseConfig.storageBucket}",
                        "FIREBASE_MESSAGING_SENDER_ID=${firebaseConfig.messagingSenderId}",
                        "FIREBASE_APP_ID=${firebaseConfig.appId}",
                        "FIREBASE_MEASUREMENT_ID=${firebaseConfig.measurementId}",
                        "FIREBASE_DATABASE_URL=${firebaseConfig.databaseUrl}"
                    ]) {
                        sh 'npm run build:prod'
                    }
                }
            }
        }

        stage('Deploy Firebase Hosting') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([string(credentialsId: 'firebase-token', variable: 'FIREBASE_TOKEN')]) {
                    script {
                        def projectId = env.FIREBASE_PROJECT_ID
                        if (!projectId && fileExists('dist/BUILD_MANIFEST.json')) {
                            def manifest = readJSON file: 'dist/BUILD_MANIFEST.json'
                            projectId = manifest.firebaseProject
                        }

                        if (!projectId) {
                            error('FIREBASE_PROJECT_ID is not set and could not be read from BUILD_MANIFEST.json')
                        }

                        sh '''
                            npm install -g firebase-tools
                            firebase use "${PROJECT_ID}" --non-interactive
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
                branch 'main'
            }
            steps {
                withCredentials([string(credentialsId: 'firebase-token', variable: 'FIREBASE_TOKEN')]) {
                    script {
                        def projectId = env.FIREBASE_PROJECT_ID
                        if (!projectId && fileExists('dist/BUILD_MANIFEST.json')) {
                            def manifest = readJSON file: 'dist/BUILD_MANIFEST.json'
                            projectId = manifest.firebaseProject
                        }

                        if (!projectId) {
                            error('FIREBASE_PROJECT_ID is not set and could not be read from BUILD_MANIFEST.json')
                        }

                        sh '''
                            firebase use "${PROJECT_ID}" --non-interactive
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
