/** @type {import('next').NextConfig} */
const { execSync } = require('child_process');
const path = require('path');

// Check if we're in the root directory and redirect to frontend build
if (process.cwd() !== path.join(__dirname, 'frontend')) {
  // If building from root, execute the frontend build
  try {
    console.log('Building from root - redirecting to frontend...');
    process.chdir(path.join(__dirname, 'frontend'));
  } catch (error) {
    console.error('Could not change to frontend directory:', error);
  }
}

// Use the frontend's next config
const frontendConfig = require('./frontend/next.config.js');
module.exports = frontendConfig;
