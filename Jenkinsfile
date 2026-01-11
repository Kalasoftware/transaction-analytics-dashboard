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
                            /home/kaliya/Server/jenkins/transaction-analytics-dashboard/start-app.sh
                        '''
                    } else if (params.ACTION == 'deploy') {
                        sh '''
                            echo "🚀 Deploying application..."
                            cd /home/kaliya/Server/jenkins/transaction-analytics-dashboard
                            npm install
                            /home/kaliya/Server/jenkins/transaction-analytics-dashboard/start-app.sh
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
