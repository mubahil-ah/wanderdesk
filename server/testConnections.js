import dotenv from 'dotenv';
import mongoose from 'mongoose';
import admin from 'firebase-admin';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function testConnection() {
  console.log("--- TESTING MONGODB ---");
  try {
    const uri = process.env.MONGO_URI;
    console.log("URI starting with:", uri ? uri.substring(0, 15) + "..." : "UNDEFINED");
    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected successfully");
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
  }

  console.log("\n--- TESTING FIREBASE ---");
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };
    
    console.log("Project ID:", serviceAccount.projectId);
    console.log("Has Private Key:", !!serviceAccount.privateKey);
    console.log("Client Email:", serviceAccount.clientEmail);
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("✅ Firebase initialized successfully");
    }
  } catch (error) {
    console.error("❌ Firebase Error:", error.message);
  }
  
  process.exit(0);
}

testConnection();
