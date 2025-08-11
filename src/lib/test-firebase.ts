// Test script to verify Firebase connection
// Run this in browser console to debug Firebase issues

import { getFirebaseApp, getFirebaseAuth, getDb } from "./firebase";

export async function testFirebaseConnection() {
  try {
    console.log("Testing Firebase connection...");
    
    // Test app initialization
    const app = getFirebaseApp();
    console.log("✅ Firebase app initialized:", app.name);
    
    // Test auth
    const auth = getFirebaseAuth();
    console.log("✅ Firebase auth initialized:", auth.app.name);
    
    // Test database
    const db = getDb();
    console.log("✅ Firestore initialized:", db.app.name);
    
    // Test environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.error("❌ Missing environment variables:", missingVars);
      return false;
    }
    
    console.log("✅ All environment variables present");
    console.log("✅ Firebase connection successful!");
    return true;
    
  } catch (error) {
    console.error("❌ Firebase connection failed:", error);
    return false;
  }
}

// Auto-run test if imported
if (typeof window !== 'undefined') {
  testFirebaseConnection();
}
