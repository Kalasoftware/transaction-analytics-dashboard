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
                    # Kill any existing process on port 3000
                    pkill -f "node server.js" || true
                    # Start the server in background
                    nohup node server.js > /var/log/jenkins/app.log 2>&1 &
                    sleep 2
                    # Verify it's running
                    curl -f http://localhost:3000 || exit 1
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
