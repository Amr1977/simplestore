import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCJYcpfmocD87Xs3F7KiANGxqvN9Fmoelo",
  authDomain: "simplestore77.firebaseapp.com",
  projectId: "simplestore77",
  storageBucket: "simplestore77.firebasestorage.app",
  messagingSenderId: "280172044461",
  appId: "1:280172044461:web:5b847764b40cc2ca9da624",
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

if (import.meta.env.VITE_USE_FIRESTORE_EMULATOR === 'true') {
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
}
