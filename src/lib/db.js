/**
 * Firebase Configuration & Initialization
 * 
 * Konfigurasi Firebase untuk ZenithQueue.
 * Baca config dari environment variables (NEXT_PUBLIC_FIREBASE_*)
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Use initializeFirestore with long polling to prevent gRPC hangs in Next.js server runtime
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export { db };

export function getDBStatus() {
  const configured = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  return {
    configured,
    message: configured
      ? 'Firebase is configured and connected.'
      : 'Firebase is NOT configured. Set NEXT_PUBLIC_FIREBASE_* variables in .env.local',
  };
}
