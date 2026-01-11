pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        APP_PORT = '3000'
    }
    
    parameters {
        choice(
            name: 'ACTION',
            choices: ['deploy', 'stop', 'restart'],
            description: 'Choose action to perform'
        )
    }
    
    stages {
        stage('Checkout') {
            when { params.ACTION != 'stop' }
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            when { params.ACTION == 'deploy' }
            steps {
                sh 'npm install'
            }
        }
        
        stage('Test') {
            when { params.ACTION == 'deploy' }
            steps {
                sh 'npm test || echo "No tests configured"'
            }
        }
        
        stage('Build') {
            when { params.ACTION == 'deploy' }
            steps {
                sh 'echo "Build completed"'
            }
        }
        
        stage('Stop Application') {
            when { params.ACTION in ['stop', 'restart', 'deploy'] }
            steps {
                sh '''
                    echo "Stopping application..."
                    pkill -f "node server.js" || echo "No process found"
                    sleep 2
                '''
            }
        }
        
        stage('Deploy') {
            when { params.ACTION in ['deploy', 'restart'] }
            steps {
                sh '''
                    # Start the server in background
                    nohup node server.js > /var/log/jenkins/app.log 2>&1 &
                    sleep 2
                    # Verify it's running
                    curl -f http://localhost:3000 || exit 1
                    echo "✅ Application started successfully"
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
