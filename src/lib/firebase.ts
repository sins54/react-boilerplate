/**
 * Firebase Configuration
 * 
 * This file initializes Firebase services for the Pulse HR application.
 * The app will gracefully handle missing environment variables and log
 * appropriate warnings without crashing during compilation.
 */

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, type Firestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if all required environment variables are present
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

const missingEnvVars = requiredEnvVars.filter(
  (key) => !import.meta.env[key]
);

// Track whether Firebase is properly configured
export const isFirebaseConfigured = missingEnvVars.length === 0;

// Log warning if env vars are missing (but don't crash)
if (!isFirebaseConfigured) {
  console.warn(
    '⚠️ Firebase Configuration Warning:\n' +
    'Missing environment variables:\n' +
    missingEnvVars.map((key) => `  - ${key}`).join('\n') +
    '\n\nThe app will run with mock/demo data until Firebase is configured.\n' +
    'Add these variables to your .env file to enable Firebase integration.'
  );
}

// Initialize Firebase app (will be null if not configured)
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // Connect to emulators in development if configured
    if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.log('🔧 Connected to Firebase Emulators');
    }

    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error);
  }
}

export { app, auth, db };

/**
 * Type-safe helper to get the Firebase Auth instance.
 * Throws an error if Firebase is not configured.
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    throw new Error(
      'Firebase Auth is not initialized. Please configure environment variables.'
    );
  }
  return auth;
}

/**
 * Type-safe helper to get the Firestore instance.
 * Throws an error if Firebase is not configured.
 */
export function getFirebaseDB(): Firestore {
  if (!db) {
    throw new Error(
      'Firestore is not initialized. Please configure environment variables.'
    );
  }
  return db;
}

// Export environment variable type for TypeScript
declare global {
  interface ImportMetaEnv {
    readonly VITE_FIREBASE_API_KEY: string;
    readonly VITE_FIREBASE_AUTH_DOMAIN: string;
    readonly VITE_FIREBASE_PROJECT_ID: string;
    readonly VITE_FIREBASE_STORAGE_BUCKET: string;
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
    readonly VITE_FIREBASE_APP_ID: string;
    readonly VITE_USE_FIREBASE_EMULATOR?: string;
  }
}
