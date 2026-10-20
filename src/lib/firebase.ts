import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import firebaseConfig from "@/firebase-applet-config.json";

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export Firestore with specific database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.warn("Firestore Error Handled:", JSON.stringify(errInfo));
  return errInfo;
}

// Test initial connection as required by Firebase skill
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firebase client is currently in offline mode.");
    }
  }
}

// Helper: Sign in with Google Popup
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      // Save or update user profile
      const userRef = doc(db, "users", result.user.uid);
      await setDoc(
        userRef,
        {
          id: result.user.uid,
          email: result.user.email || "",
          displayName: result.user.displayName || "Explorer",
          photoURL: result.user.photoURL || "",
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
    return result.user;
  } catch (error) {
    console.error("Sign-in error:", error);
    throw error;
  }
}

export async function logOut() {
  return signOut(auth);
}

testConnection();
