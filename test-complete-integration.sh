#!/bin/bash

echo "🧪 Complete Fullscript Integration Test"
echo "======================================="

echo ""
echo "1. Testing Backend Health..."
curl -s http://localhost:3001/health | jq '.'

echo ""
echo "2. Testing Session Grant (should be 401 - not authenticated)..."
curl -s http://localhost:3001/fs/session-grant | jq '.'

echo ""
echo "3. Testing OAuth Authorization..."
echo "   OAuth URL:"
curl -s "http://localhost:3001/fs/oauth/authorize" | head -1

echo ""
echo "4. Testing Webhook Endpoint..."
curl -X POST http://localhost:3001/fs/webhook \
  -H "Content-Type: application/json" \
  -d '{"challenge":"test-challenge-token"}' | jq '.'

echo ""
echo "5. Testing ngrok Tunnel..."
curl -s https://cbf72ec799a1.ngrok-free.app/health | jq '.'

echo ""
echo "✅ Backend Tests Complete!"
echo ""
echo "📋 Next Steps for Full Integration Test:"
echo "1. Open browser: https://huj.lpf.mybluehost.me/integro-fullscript/"
echo "2. Click 'Connect to Fullscript' button"
echo "3. Complete OAuth flow in new window"
echo "4. Verify you're redirected back to staging site"
echo "5. Check that the Fullscript store loads"
echo ""
echo "🔧 If you see 'Session grant failed: 401' errors:"
echo "   - The OAuth flow needs to be completed first"
echo "   - Click the 'Connect to Fullscript' button"
echo "   - Complete the authentication process"
echo ""
echo "📊 Expected Flow:"
echo "   1. User visits staging site"
echo "   2. Frontend requests session grant → 401 (not authenticated)"
echo "   3. Frontend shows 'Connect to Fullscript' button"
echo "   4. User clicks button → OAuth flow starts"
echo "   5. User completes OAuth → redirected back"
echo "   6. Frontend requests session grant → 200 (authenticated)"
echo "   7. Fullscript store loads successfully"
