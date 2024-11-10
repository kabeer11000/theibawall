// Import the necessary functions from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Use getAuth from 'firebase/auth'

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKKcUfAo7gyfUBNoLloHVj3Oez9lXG-Yk",
  authDomain: "theibawall.firebaseapp.com",
  projectId: "theibawall",
  storageBucket: "theibawall.firebasestorage.app",
  messagingSenderId: "959275083143",
  appId: "1:959275083143:web:3fe893ba2b103a94665f22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Google Auth provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account',  // Optional, forces user to select a Google account
});

// Log the environment (if needed for development)
console.log("kn.theibawall.env: ", process.env.NODE_ENV);

// Uncomment this section if you want to use Firestore emulator with Firebase SDK v9+
// const db = getFirestore(app);
// if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR) {
//   const [host, port] = process.env.NEXT_PUBLIC_EMULATOR_ADDRESS.split(':');
//   console.log('Using Emulator:', host, port);
//   db.useEmulator(host, parseInt(port));
// }

// Export auth and provider for use in other parts of your app
export { auth, provider };
