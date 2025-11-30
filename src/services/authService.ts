/**
 * Pulse HR - Authentication Service
 * 
 * Handles Firebase authentication and user management
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import type { PulseUser, CreateUserInput } from '@/types/pulse-hr';
import { DEFAULT_LEAVE_QUOTAS } from '@/types/pulse-hr';

const USERS_COLLECTION = 'users';

/**
 * Sign in user with email and password
 */
export async function signIn(
  email: string,
  password: string
): Promise<PulseUser> {
  if (!isFirebaseConfigured || !auth || !db) {
    // Demo mode - return mock user
    return getMockUser(email);
  }

  const credential = await signInWithEmailAndPassword(auth, email, password);
  const userData = await getUserData(credential.user.uid);
  
  if (!userData) {
    throw new Error('User data not found');
  }
  
  return userData;
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
  if (!isFirebaseConfigured || !auth) {
    return;
  }
  await signOut(auth);
}

/**
 * Create a new user (admin only)
 */
export async function createUser(input: CreateUserInput): Promise<PulseUser> {
  if (!isFirebaseConfigured || !auth || !db) {
    // Demo mode - return mock user
    return getMockUser(input.email, input.role === 'admin');
  }

  // Create Firebase auth user
  const credential = await createUserWithEmailAndPassword(
    auth,
    input.email,
    input.password
  );

  const now = new Date().toISOString();
  const userData: PulseUser = {
    id: credential.user.uid,
    email: input.email,
    displayName: input.displayName,
    role: input.role,
    department: input.department,
    position: input.position,
    createdAt: now,
    updatedAt: now,
    isActive: true,
    leaveQuotas: { ...DEFAULT_LEAVE_QUOTAS },
  };

  // Save user data to Firestore
  await setDoc(doc(db, USERS_COLLECTION, credential.user.uid), userData);

  return userData;
}

/**
 * Get user data from Firestore
 */
export async function getUserData(userId: string): Promise<PulseUser | null> {
  if (!isFirebaseConfigured || !db) {
    return null;
  }

  const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
  
  if (!userDoc.exists()) {
    return null;
  }

  return userDoc.data() as PulseUser;
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<PulseUser[]> {
  if (!isFirebaseConfigured || !db) {
    return getMockUsers();
  }

  const snapshot = await getDocs(collection(db, USERS_COLLECTION));
  return snapshot.docs.map((doc) => doc.data() as PulseUser);
}

/**
 * Get active employees
 */
export async function getActiveEmployees(): Promise<PulseUser[]> {
  if (!isFirebaseConfigured || !db) {
    return getMockUsers().filter((u) => u.role === 'employee');
  }

  const q = query(
    collection(db, USERS_COLLECTION),
    where('isActive', '==', true),
    where('role', '==', 'employee')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as PulseUser);
}

/**
 * Update user data
 */
export async function updateUser(
  userId: string,
  updates: Partial<PulseUser>
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  await updateDoc(doc(db, USERS_COLLECTION, userId), {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Reset yearly leave balance for a user
 */
export async function resetYearlyBalance(userId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  await updateDoc(doc(db, USERS_COLLECTION, userId), {
    'leaveQuotas.usedSickDays': 0,
    'leaveQuotas.usedVacationDays': 0,
    'leaveQuotas.usedPersonalDays': 0,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(
  callback: (user: FirebaseUser | null) => void
): () => void {
  if (!isFirebaseConfigured || !auth) {
    // Call callback with null immediately in demo mode
    setTimeout(() => callback(null), 0);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}

// Mock data for demo mode
function getMockUser(email: string, isAdmin = false): PulseUser {
  const id = `mock-${Date.now()}`;
  const now = new Date().toISOString();
  
  return {
    id,
    email,
    displayName: isAdmin ? 'Admin User' : 'Demo Employee',
    role: isAdmin ? 'admin' : 'employee',
    department: 'Engineering',
    position: isAdmin ? 'System Administrator' : 'Software Developer',
    createdAt: now,
    updatedAt: now,
    isActive: true,
    leaveQuotas: {
      sickDays: 12,
      vacationDays: 15,
      personalDays: 5,
      usedSickDays: 3,
      usedVacationDays: 5,
      usedPersonalDays: 1,
    },
  };
}

function getMockUsers(): PulseUser[] {
  const now = new Date().toISOString();
  
  return [
    {
      id: 'mock-admin-1',
      email: 'admin@pulsehr.com',
      displayName: 'Admin User',
      role: 'admin',
      department: 'Management',
      position: 'HR Manager',
      createdAt: now,
      updatedAt: now,
      isActive: true,
      leaveQuotas: {
        sickDays: 12,
        vacationDays: 15,
        personalDays: 5,
        usedSickDays: 0,
        usedVacationDays: 0,
        usedPersonalDays: 0,
      },
    },
    {
      id: 'mock-employee-1',
      email: 'john.doe@pulsehr.com',
      displayName: 'John Doe',
      role: 'employee',
      department: 'Engineering',
      position: 'Senior Developer',
      createdAt: now,
      updatedAt: now,
      isActive: true,
      leaveQuotas: {
        sickDays: 12,
        vacationDays: 15,
        personalDays: 5,
        usedSickDays: 2,
        usedVacationDays: 8,
        usedPersonalDays: 1,
      },
    },
    {
      id: 'mock-employee-2',
      email: 'jane.smith@pulsehr.com',
      displayName: 'Jane Smith',
      role: 'employee',
      department: 'Design',
      position: 'UX Designer',
      createdAt: now,
      updatedAt: now,
      isActive: true,
      leaveQuotas: {
        sickDays: 12,
        vacationDays: 15,
        personalDays: 5,
        usedSickDays: 1,
        usedVacationDays: 3,
        usedPersonalDays: 0,
      },
    },
  ];
}
