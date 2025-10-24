#!/bin/bash

echo "🧪 Testing Fullscript Integration"
echo "================================="

echo "1. Testing Health Check..."
curl -s http://localhost:3001/health | jq '.'

echo -e "\n2. Testing OAuth Authorization..."
curl -s "http://localhost:3001/fs/oauth/authorize" | head -1

echo -e "\n3. Testing Session Grant (should be 401)..."
curl -s http://localhost:3001/fs/session-grant | jq '.'

echo -e "\n4. Testing Webhook Endpoint..."
curl -X POST http://localhost:3001/fs/webhook \
  -H "Content-Type: application/json" \
  -d '{"challenge":"test-challenge-token"}' | jq '.'

echo -e "\n5. Testing ngrok Tunnel..."
curl -s https://cbf72ec799a1.ngrok-free.app/health | jq '.'

echo -e "\n✅ All tests completed!"
echo -e "\nNext steps:"
echo "1. Update your Fullscript app dashboard with the URLs"
echo "2. Test the OAuth flow in browser: http://localhost:3001/fs/oauth/authorize"
echo "3. Test WordPress integration: https://huj.lpf.mybluehost.me/integro-fullscript/"
