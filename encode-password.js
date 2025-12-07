#!/usr/bin/env node

/**
 * URL Encode Password for Database Connection
 * 
 * This script helps you properly encode your database password
 * for use in a PostgreSQL connection string.
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔐 Database Password URL Encoder\n');
console.log('This tool will help you encode your Supabase password for the DATABASE_URL.\n');

rl.question('Enter your database password: ', (password) => {
  const encodedPassword = encodeURIComponent(password);
  
  console.log('\n✅ Encoded Password:');
  console.log(encodedPassword);
  
  console.log('\n📋 Your DATABASE_URL should be:');
  console.log(`DATABASE_URL="postgresql://postgres:${encodedPassword}@db.eqbgnlkgasmjbgodekdq.supabase.co:5432/postgres"`);
  
  console.log('\n💡 Copy the DATABASE_URL above and paste it into your backend/.env file\n');
  
  rl.close();
});
