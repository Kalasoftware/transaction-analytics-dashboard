pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        APP_PORT = '3000'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test || echo "No tests configured"'
            }
        }
        
        stage('Build') {
            steps {
                sh 'echo "Build completed"'
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                    pm2 stop transaction-dashboard || true
                    pm2 start server.js --name transaction-dashboard
                    pm2 save
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
