// Firebase configuration for KobKlein

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase config (you'll replace these with your actual values)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser)
export const analytics = typeof window !== 'undefined' && isSupported() 
  ? getAnalytics(app) 
  : null;

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const isEmulatorAlreadyConnected = (service: any) => {
    return service._delegate?._settings?.host?.includes('localhost');
  };

  // Auth emulator
  if (!isEmulatorAlreadyConnected(auth)) {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  }

  // Firestore emulator
  if (!isEmulatorAlreadyConnected(db)) {
    connectFirestoreEmulator(db, 'localhost', 8080);
  }

  // Storage emulator
  if (!isEmulatorAlreadyConnected(storage)) {
    connectStorageEmulator(storage, 'localhost', 9199);
  }
}

export default app;