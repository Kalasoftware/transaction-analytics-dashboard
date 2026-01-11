#!/bin/bash
cd /home/kaliya/Server/jenkins/transaction-analytics-dashboard
pkill -f "node server.js" || echo "No process found"
sleep 2
nohup node server.js > /tmp/app.log 2>&1 &
echo "App started with PID: $!"
sleep 3
curl -f http://localhost:3000 && echo "✅ App is running" || echo "❌ App failed to start"
