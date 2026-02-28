const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = 3000;
const TARGET = 'https://www.draftly.space';

// Keep local index.html updated with live
const downloadIndex = () => {
    return new Promise((resolve, reject) => {
        https.get(TARGET, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Save it locally so user can see it
                fs.writeFileSync(path.join(__dirname, 'index.html'), data);
                resolve();
            });
        }).on('error', reject);
    });
};

// First, download the pristine HTML
downloadIndex().then(() => {
    // Serve any local statically saved files first (like index.html)
    app.use(express.static(__dirname, { index: ['index.html'] }));

    // Proxy everything else to draftly.space (API, images, fonts, Next.js chunks, router data)
    app.use('/', createProxyMiddleware({
        target: TARGET,
        changeOrigin: true,
        secure: false,
        ws: true,
        // Override the referer to trick the target if necessary
        onProxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader('origin', TARGET);
            proxyReq.setHeader('referer', TARGET + req.url);
        }
    }));

    app.listen(PORT, () => {
        console.log(`100% Accurate Draftly Clone running at http://localhost:${PORT}`);
        console.log(`Any local changes to index.html will be served, and missing assets proxy to ${TARGET}`);
    });
}).catch(err => {
    console.error('Failed to download initial index.html for clone:', err);
});
