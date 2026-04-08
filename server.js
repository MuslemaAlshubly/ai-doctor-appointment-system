#!/usr/bin/env node

/**
 * Development Server for AI Doctor Appointment System Frontend
 * 
 * Usage:
 *   node server.js              # Run on default port 3000
 *   node server.js 8080         # Run on custom port 8080
 * 
 * Then open: http://localhost:3000 (or your custom port)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.md': 'text/markdown'
};

const server = http.createServer((req, res) => {
    // Map URL path to file
    let filePath = path.join(PUBLIC_DIR, req.url);
    
    // Handle root request
    if (req.url === '/') {
        filePath = path.join(PUBLIC_DIR, 'index.html');
    }
    
    // Get file extension
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';

    // Check if file exists
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // File not found - try index.html for SPA routing
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1><p>' + req.url + '</p>');
                return;
            }
            
            // Server error
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server Error: ' + err);
            return;
        }

        // Success
        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache'
        });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║   AI Doctor Appointment System - Frontend Development        ║
╚══════════════════════════════════════════════════════════════╝

✅ Server running on: http://localhost:${PORT}

📁 Public directory: ${PUBLIC_DIR}

🔍 Features:
   • Serves frontend files from public/ directory
   • Auto-detects MIME types
   • No external dependencies
   • Perfect for development

⚠️  Important:
   • Make sure Flask backend is running on http://localhost:5000
   • Check backend/app.py for API endpoints
   • See FRONTEND_DEV_GUIDE.md for documentation

💡 Tips:
   • Use browser DevTools (F12) for debugging
   • Check Network tab for API calls
   • View Application > Local Storage for auth data

🚀 Next Steps:
   1. Open http://localhost:${PORT} in your browser
   2. Register a new account or login
   3. Explore all features
   4. Check console for any errors

Press Ctrl+C to stop the server
    `);
});
