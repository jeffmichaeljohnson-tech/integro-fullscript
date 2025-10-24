#!/usr/bin/env node

/**
 * Webhook Simulation Script
 * Simulates different webhook verification scenarios that Fullscript might use
 */

const https = require('https');

const WEBHOOK_URL = 'https://89dd1ca29b35.ngrok-free.app/fs/webhook';

// Test scenarios
const testScenarios = [
    {
        name: 'POST with challenge in body',
        method: 'POST',
        data: { challenge: 'fullscript-challenge-123' },
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: 'POST with verification_token in body',
        method: 'POST',
        data: { verification_token: 'fullscript-verification-456' },
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: 'GET with challenge in query',
        method: 'GET',
        url: `${WEBHOOK_URL}?challenge=fullscript-query-challenge-789`
    },
    {
        name: 'POST with custom header',
        method: 'POST',
        data: {},
        headers: { 
            'Content-Type': 'application/json',
            'X-Challenge': 'fullscript-header-challenge-101'
        }
    }
];

function makeRequest(scenario) {
    return new Promise((resolve, reject) => {
        const options = {
            method: scenario.method,
            headers: scenario.headers || {}
        };

        const req = https.request(scenario.url || WEBHOOK_URL, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: data
                });
            });
        });

        req.on('error', reject);

        if (scenario.data && Object.keys(scenario.data).length > 0) {
            req.write(JSON.stringify(scenario.data));
        }

        req.end();
    });
}

async function runTests() {
    console.log('🧪 Testing Webhook Verification Scenarios\n');
    
    for (const scenario of testScenarios) {
        try {
            console.log(`Testing: ${scenario.name}`);
            const response = await makeRequest(scenario);
            
            console.log(`✅ Status: ${response.status}`);
            console.log(`📝 Response: ${response.body}`);
            console.log(`📋 Content-Type: ${response.headers['content-type']}`);
            console.log('---\n');
            
        } catch (error) {
            console.log(`❌ Error: ${error.message}\n`);
        }
    }
}

runTests();
