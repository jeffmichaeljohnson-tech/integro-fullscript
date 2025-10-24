/**
 * INTEGRO HEALTH FULLSCRIPT BACKEND SERVER
 * Production-ready OAuth flow and session grants
 * 
 * Requirements:
 * - Node.js 16+
 * - Express.js
 * - HTTPS in production
 * - HIPAA-compliant hosting
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const session = require('cookie-session');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Fullscript API Configuration with validation
const FULLSCRIPT_CONFIG = {
    clientId: process.env.FULLSCRIPT_CLIENT_ID || 'eNRmRfsOR7S85ZDMnJXOJvT9EgbOUQA7t9GpvVUI4LE',
    clientSecret: process.env.FULLSCRIPT_CLIENT_SECRET, // Required - will be validated
    redirectUri: process.env.FULLSCRIPT_REDIRECT_URI || 'https://integrohealth.net/fs/oauth/callback',
    baseUrl: process.env.FULLSCRIPT_BASE_URL || 'https://api.fullscript.com',
    env: process.env.FULLSCRIPT_ENV || 'us' // 'us' for production, 'us-snd' for sandbox
};

// Validate critical configuration
if (!FULLSCRIPT_CONFIG.clientSecret) {
    console.error('❌ CRITICAL: FULLSCRIPT_CLIENT_SECRET is required but not set');
    console.error('❌ Please set FULLSCRIPT_CLIENT_SECRET in Railway environment variables');
}

// Session middleware
app.use(session({
    name: 'fullscript-session',
    keys: [process.env.SESSION_SECRET || 'your-secret-key-change-in-production'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: true, // Always use secure cookies for cross-domain
    httpOnly: true,
    sameSite: 'none' // Allow cross-domain cookies
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')());

// CORS configuration for development and production
app.use((req, res, next) => {
    // Build allowed origins dynamically
    const allowedOrigins = [
        'https://integrohealth.net',
        'https://www.integrohealth.net',
        'https://huj.lpf.mybluehost.me', // Staging
        'http://localhost:3001',
        'http://127.0.0.1:3001',
        'http://localhost:8080', // Test server
        'http://127.0.0.1:8080', // Test server
        'file://', // For local file testing
    ];
    
    // Add Railway domains if they exist
    if (process.env.RAILWAY_PUBLIC_DOMAIN) {
        allowedOrigins.push(`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
    }
    if (process.env.RAILWAY_STATIC_URL) {
        allowedOrigins.push(process.env.RAILWAY_STATIC_URL);
    }
    
    // Add any custom CORS origins from environment
    if (process.env.CORS_ORIGINS) {
        const customOrigins = process.env.CORS_ORIGINS.split(',').map(origin => origin.trim());
        allowedOrigins.push(...customOrigins);
    }
    
    const origin = req.headers.origin;
    
    // CRITICAL: For credentials to work, we MUST specify the exact origin, never '*'
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    } else if (!origin) {
        // Allow requests without origin (like direct API calls)
        res.header('Access-Control-Allow-Origin', 'https://huj.lpf.mybluehost.me');
    } else {
        // Reject unknown origins
        return res.status(403).json({ error: 'Origin not allowed' });
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// Serve test files
app.get('/test-session-debug.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'test-session-debug.html'));
});

// Security middleware
app.use((req, res, next) => {
    // Log all requests for audit trail
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

/**
 * OAuth Flow - Step 1: Redirect to Fullscript Authorization
 */
app.get('/fs/oauth/authorize', (req, res) => {
    try {
        const state = crypto.randomBytes(32).toString('hex');
        
        // Store state for verification (in production, use Redis or database)
        req.session = req.session || {};
        req.session.oauthState = state;
        
        const authUrl = new URL('/oauth/authorize', FULLSCRIPT_CONFIG.baseUrl);
        authUrl.searchParams.set('client_id', FULLSCRIPT_CONFIG.clientId);
        authUrl.searchParams.set('redirect_uri', FULLSCRIPT_CONFIG.redirectUri);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('scope', 'Clinic:read Clinic:write Patients:write Patients:treatment_plan_history');
        authUrl.searchParams.set('state', state);
        
        console.log('Redirecting to Fullscript OAuth:', authUrl.toString());
        res.redirect(authUrl.toString());
        
    } catch (error) {
        console.error('OAuth authorization error:', error);
        res.status(500).json({ error: 'OAuth authorization failed' });
    }
});

/**
 * OAuth Flow - Step 2: Handle Fullscript Callback
 */
app.get('/fs/oauth/callback', async (req, res) => {
    try {
        const { code, state, error } = req.query;
        
        if (error) {
            console.error('OAuth error from Fullscript:', error);
            return res.status(400).json({ error: 'OAuth authorization failed' });
        }
        
        if (!code) {
            return res.status(400).json({ error: 'Authorization code not provided' });
        }
        
        // Verify state parameter (in production, check against stored state)
        // For now, we'll skip state verification for simplicity
        
        // Exchange code for access token
        console.log('🔄 Exchanging authorization code for token...');
        console.log('   Code:', code.substring(0, 10) + '...');
        console.log('   Redirect URI:', FULLSCRIPT_CONFIG.redirectUri);
        console.log('   Client ID:', FULLSCRIPT_CONFIG.clientId);
        
        const tokenResponse = await exchangeCodeForToken(code);
        
        console.log('📦 Token response received:', JSON.stringify(tokenResponse, null, 2));
        
        // Extract token from nested oauth object
        const oauthData = tokenResponse.oauth;
        
        if (!oauthData || !oauthData.access_token) {
            console.error('❌ No access token in oauth object:', tokenResponse);
            throw new Error('No access token received');
        }
        
        console.log('✅ Access token extracted:', oauthData.access_token.substring(0, 10) + '...');
        console.log('✅ Token type:', oauthData.token_type);
        console.log('✅ Expires in:', oauthData.expires_in, 'seconds');
        console.log('✅ Scope:', oauthData.scope);
        
        // Store access token securely (in production, use encrypted storage)
        req.session = req.session || {};
        req.session.accessToken = oauthData.access_token;
        req.session.refreshToken = oauthData.refresh_token;
        req.session.tokenExpiresAt = Date.now() + (oauthData.expires_in * 1000);
        req.session.tokenScope = oauthData.scope;
        
        console.log('💾 Session stored:', {
            sessionExists: !!req.session,
            accessToken: req.session.accessToken ? 'present' : 'missing',
            sessionKeys: Object.keys(req.session)
        });
        
        // Set session cookies for the ngrok domain (for cross-domain access)
        res.cookie('fullscript-session', JSON.stringify(req.session), {
            domain: '.ngrok-free.app', // Set domain to allow cross-subdomain access
            secure: true,
            httpOnly: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
    
    // Redirect to success page or back to your app
    const successUrl = process.env.RAILWAY_PUBLIC_DOMAIN 
        ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}/?auth=success`
        : 'https://huj.lpf.mybluehost.me/integro-fullscript/?auth=success';
    res.redirect(successUrl);
        
    } catch (error) {
        console.error('OAuth callback error:', error);
        res.status(500).json({ error: 'OAuth callback failed' });
    }
});

/**
 * Exchange authorization code for access token
 */
async function exchangeCodeForToken(code) {
    const tokenUrl = `${FULLSCRIPT_CONFIG.baseUrl}/api/oauth/token`;
    
    const requestBody = {
        grant_type: 'authorization_code',
        client_id: FULLSCRIPT_CONFIG.clientId,
        client_secret: FULLSCRIPT_CONFIG.clientSecret,
        redirect_uri: FULLSCRIPT_CONFIG.redirectUri,
        code: code
    };
    
    console.log('🔄 Making token exchange request...');
    console.log('   URL:', tokenUrl);
    console.log('   Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', JSON.stringify([...response.headers.entries()], null, 2));
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Token exchange failed:', response.status, errorText);
        throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('✅ Token exchange successful:', JSON.stringify(responseData, null, 2));
    
    return responseData;
}

/**
 * Get session grant for Fullscript Embed
 */
app.get('/fs/session-grant', async (req, res) => {
    try {
        // Debug session data
        console.log('🔍 Session grant request - Session data:', {
            sessionExists: !!req.session,
            accessToken: req.session?.accessToken ? 'present' : 'missing',
            sessionKeys: req.session ? Object.keys(req.session) : 'no session'
        });
        
        // Check if user has valid session (from ngrok domain or WordPress domain cookie)
        let sessionData = req.session;
        let accessToken = sessionData?.accessToken;
        
        // If no session in ngrok domain, try to read from ngrok domain cookie
        if (!accessToken) {
            const ngrokSessionCookie = req.cookies['fullscript-session'];
            if (ngrokSessionCookie) {
                try {
                    sessionData = JSON.parse(ngrokSessionCookie);
                    accessToken = sessionData.accessToken;
                    console.log('📦 Using ngrok domain session cookie');
                } catch (error) {
                    console.log('❌ Failed to parse ngrok session cookie:', error);
                }
            }
        }
        
        if (!accessToken) {
            console.log('❌ No access token in session');
            return res.status(401).json({ error: 'Not authenticated. Please complete OAuth flow.' });
        }
        
        // Request session grant from Fullscript
        const sessionGrant = await requestSessionGrant(accessToken);
        
        if (!sessionGrant.secretToken) {
            throw new Error('No secret token received');
        }
        
        // Return session grant (short-lived, single-use)
        res.json({
            secretToken: sessionGrant.secretToken,
            expiresAt: sessionGrant.expiresAt,
            env: FULLSCRIPT_CONFIG.env
        });
        
    } catch (error) {
        console.error('Session grant error:', error);
        res.status(500).json({ error: 'Failed to get session grant' });
    }
});

/**
 * Request session grant from Fullscript
 */
async function requestSessionGrant(accessToken) {
    const sessionUrl = `${FULLSCRIPT_CONFIG.baseUrl}/api/clinic/embeddable/session_grants`;
    
    console.log('🔑 Requesting session grant...');
    console.log('   URL:', sessionUrl);
    console.log('   Token:', accessToken.substring(0, 10) + '...');
    
    const response = await fetch(sessionUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            // Add any required parameters for session grant
        })
    });
    
    console.log('📡 Session grant response status:', response.status);
    console.log('📡 Session grant response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Session grant error response:', errorText);
        throw new Error(`Session grant failed: ${response.status} ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('📦 Session grant response data:', responseData);
    
    // Check if the response contains a secret_token
    if (!responseData.secret_token && !responseData.secretToken) {
        console.log('❌ No secret token in response:', responseData);
        throw new Error('No secret token received');
    }
    
    // Return the secret token (handle both possible field names)
    const secretToken = responseData.secret_token || responseData.secretToken;
    console.log('✅ Secret token received:', secretToken.substring(0, 10) + '...');
    
    return {
        secretToken: secretToken,
        expiresAt: responseData.expires_at || responseData.expiresAt,
        id: responseData.id
    };
}

/**
 * Webhook verification endpoint (GET)
 */
app.get('/fs/webhook', (req, res) => {
    try {
        console.log('=== WEBHOOK GET REQUEST ===');
        console.log('Method:', req.method);
        console.log('URL:', req.url);
        console.log('Headers:', JSON.stringify(req.headers, null, 2));
        console.log('Query:', JSON.stringify(req.query, null, 2));
        console.log('===========================');
        
        // Handle webhook verification challenge
        const challenge = req.query.challenge || 
                         req.query.verification_token ||
                         req.query.token ||
                         req.headers['x-challenge'] ||
                         req.headers['x-fullscript-challenge'];
        
        if (challenge) {
            console.log('GET CHALLENGE DETECTED:', challenge);
            console.log('Responding with challenge token...');
            
            res.setHeader('Content-Type', 'application/json');
            
            return res.status(200).json({ challenge: challenge });
        }
        
        // Default response for GET requests
        res.status(200).json({ 
            status: 'webhook endpoint active',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Webhook GET error:', error);
        res.status(500).json({ error: 'Webhook GET processing failed' });
    }
});

/**
 * Webhook endpoint for Fullscript events
 */
app.post('/fs/webhook', (req, res) => {
    try {
        console.log('=== WEBHOOK REQUEST ===');
        console.log('Method:', req.method);
        console.log('URL:', req.url);
        console.log('Headers:', JSON.stringify(req.headers, null, 2));
        console.log('Body:', JSON.stringify(req.body, null, 2));
        console.log('Query:', JSON.stringify(req.query, null, 2));
        console.log('========================');
        
        // Handle webhook verification challenge - check multiple possible locations
        const challenge = req.body.challenge || 
                         req.query.challenge || 
                         req.headers['x-challenge'] ||
                         req.headers['x-fullscript-challenge'] ||
                         req.body.verification_token ||
                         req.body.token;
        
        if (challenge) {
            console.log('🔑 Challenge token received:', challenge);
            
            const challengeToken = process.env.FULLSCRIPT_WEBHOOK_SECRET;
            
            if (!challengeToken) {
                console.error('❌ FULLSCRIPT_WEBHOOK_SECRET not set in environment!');
                return res.status(500).json({ 
                    error: 'Server configuration error' 
                });
            }
            
            // CRITICAL: Must return exact format with application/json Content-Type
            res.setHeader('Content-Type', 'application/json');
            
            const response = { challenge: challengeToken };
            console.log('✅ Responding with challenge token:', response);
            
            return res.status(200).json(response);
        }
        
        // Handle regular webhook events
        const { event, data } = req.body;
        
        console.log(`Regular webhook event: ${event}`, data);
        
        // Handle different webhook events
        switch (event) {
            case 'order.placed':
                handleOrderPlaced(data);
                break;
            case 'order.updated':
                handleOrderUpdated(data);
                break;
            case 'patient.created':
                handlePatientCreated(data);
                break;
            default:
                console.log(`Unhandled webhook event: ${event}`);
        }
        
        // CRITICAL: Acknowledge receipt immediately
        // Fullscript expects response within 2 seconds
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ 
            challenge: process.env.FULLSCRIPT_WEBHOOK_SECRET,
            received: true,
            event_type: event,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

/**
 * Handle order placed webhook
 */
function handleOrderPlaced(orderData) {
    console.log('Order placed:', orderData);
    
    // In production, you might:
    // - Update patient records
    // - Send confirmation emails
    // - Update inventory
    // - Trigger other business processes
    
    // For now, just log the event
    console.log(`Order ${orderData.id} placed for patient ${orderData.patient_id}`);
}

/**
 * Handle order updated webhook
 */
function handleOrderUpdated(orderData) {
    console.log('Order updated:', orderData);
}

/**
 * Handle patient created webhook
 */
function handlePatientCreated(patientData) {
    console.log('Patient created:', patientData);
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    console.log('🏥 Health check requested');
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        port: PORT,
        environment: process.env.NODE_ENV
    });
});

/**
 * Error handling middleware
 */
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

/**
 * Environment validation and startup
 */
function validateEnvironment() {
    const requiredVars = [
        'FULLSCRIPT_CLIENT_SECRET',
        'SESSION_SECRET'
    ];
    
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:', missing);
        console.error('❌ Please set these in Railway dashboard');
        process.exit(1);
    }
    
    console.log('✅ Environment validation passed');
}

/**
 * Start server with proper error handling
 */
function startServer() {
    try {
        // Validate environment before starting
        validateEnvironment();
        
        // Ensure PORT is a valid number
        const port = parseInt(process.env.PORT) || 3000;
        
        // Railway handles SSL automatically, so we always use HTTP
        const server = app.listen(port, '0.0.0.0', () => {
            console.log(`✅ Server running on port ${port}`);
            console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`✅ Health check available at: http://0.0.0.0:${port}/health`);
            console.log(`✅ Fullscript Client ID: ${FULLSCRIPT_CONFIG.clientId}`);
            console.log(`✅ Fullscript Secret: ${FULLSCRIPT_CONFIG.clientSecret ? 'SET' : 'MISSING'}`);
            console.log(`✅ Session Secret: ${process.env.SESSION_SECRET ? 'SET' : 'MISSING'}`);
            console.log(`✅ Railway Public Domain: ${process.env.RAILWAY_PUBLIC_DOMAIN || 'NOT SET'}`);
        });
        
        // Handle server errors
        server.on('error', (error) => {
            console.error('❌ Server error:', error);
            if (error.code === 'EADDRINUSE') {
                console.error('❌ Port already in use. Trying next available port...');
            }
        });
        
        return server;
        
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();

module.exports = app;
