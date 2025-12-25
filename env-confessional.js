#!/usr/bin/env node

// Env Var Confessional - Where your environment variables come to confess their sins
// Because "it works on my machine" isn't a valid deployment strategy

const fs = require('fs');
const path = require('path');

// The sacred ritual begins
const envPath = path.join(process.cwd(), '.env');
const examplePath = path.join(process.cwd(), '.env.example');

// Check if the sinner (.env) exists
if (!fs.existsSync(envPath)) {
    console.log('\x1b[33m%s\x1b[0m', '⚠️  No .env found to confess. Are you hiding your sins elsewhere?');
    process.exit(1);
}

// Read the sinner's secrets
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));

// Extract the guilty parties (env vars)
const envVars = envLines.map(line => {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=/);
    return match ? match[1] : null;
}).filter(Boolean);

console.log('\x1b[36m%s\x1b[0m', '\n📖 ENVIRONMENT VARIABLE CONFESSIONAL 📖');
console.log('\x1b[90m%s\x1b[0m', 'Your .env has come to confess its secrets...\n');

// Display the confessions
envVars.forEach((varName, i) => {
    console.log(`  ${i + 1}. ${varName}`);
});

console.log('\n\x1b[32m%s\x1b[0m', `✅ Total sins confessed: ${envVars.length}`);

// Check if there's a .env.example to compare against
if (fs.existsSync(examplePath)) {
    const exampleContent = fs.readFileSync(examplePath, 'utf8');
    const exampleVars = exampleContent.split('\n')
        .filter(line => line.trim() && !line.startsWith('#'))
        .map(line => line.match(/^([A-Z_][A-Z0-9_]*)=/))
        .filter(Boolean)
        .map(match => match[1]);
    
    // Find missing confessions (vars in .env but not in .env.example)
    const missingVars = envVars.filter(varName => !exampleVars.includes(varName));
    
    if (missingVars.length > 0) {
        console.log('\n\x1b[33m%s\x1b[0m', '⚠️  Unconfessed sins (missing from .env.example):');
        missingVars.forEach(varName => {
            console.log(`  - ${varName}`);
        });
        console.log('\n\x1b[33m%s\x1b[0m', '💡 Pro tip: Update your .env.example before your teammates revolt!');
    } else {
        console.log('\n\x1b[32m%s\x1b[0m', '🎉 All sins properly documented! You\'re a saint!');
    }
} else {
    console.log('\n\x1b[33m%s\x1b[0m', '⚠️  No .env.example found. Your sins remain undocumented!');
    console.log('\x1b[33m%s\x1b[0m', '💡 Run: cp .env .env.example && sed -i \'s/=.*$/=/\' .env.example');
}

console.log('\n\x1b[90m%s\x1b[0m', 'Confession complete. Go forth and document! 🙏');
