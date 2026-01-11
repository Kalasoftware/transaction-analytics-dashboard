pipeline {
    agent any
    
    parameters {
        choice(
            name: 'ACTION',
            choices: ['deploy', 'stop', 'restart'],
            description: 'Choose action to perform'
        )
    }
    
    stages {
        stage('Execute Action') {
            steps {
                script {
                    if (params.ACTION == 'stop') {
                        sh '''
                            echo "🛑 Stopping application..."
                            pkill -f "node server.js" || echo "No process found"
                            sleep 2
                            echo "✅ Application stopped"
                        '''
                    } else if (params.ACTION == 'restart') {
                        sh '''
                            echo "🔄 Restarting application..."
                            pkill -f "node server.js" || echo "No process found"
                            sleep 2
                            nohup node server.js > /var/log/jenkins/app.log 2>&1 &
                            sleep 3
                            curl -f http://localhost:3000 || exit 1
                            echo "✅ Application restarted successfully"
                        '''
                    } else if (params.ACTION == 'deploy') {
                        sh '''
                            echo "🚀 Deploying application..."
                            # Install dependencies
                            npm install
                            
                            # Stop existing process
                            pkill -f "node server.js" || echo "No process found"
                            sleep 2
                            
                            # Start new process
                            nohup node server.js > /var/log/jenkins/app.log 2>&1 &
                            sleep 3
                            
                            # Verify it's running
                            curl -f http://localhost:3000 || exit 1
                            echo "✅ Application deployed successfully"
                        '''
                    }
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}
