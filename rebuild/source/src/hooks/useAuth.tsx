"use client";
import { useEffect, useState, createContext, useContext } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  UserCredential
} from 'firebase/auth';
import { auth as getAuth } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<UserCredential>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  login: async () => { throw new Error('AuthProvider not initialized'); },
  signup: async () => { throw new Error('AuthProvider not initialized'); },
  logout: async () => { throw new Error('AuthProvider not initialized'); },
  loginWithGoogle: async () => { throw new Error('AuthProvider not initialized'); }
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * تسجيل دخول المستخدم باستخدام البريد الإلكتروني وكلمة المرور
   * Login user with email and password
   * 
   * @param email - البريد الإلكتروني للمستخدم
   * @param password - كلمة المرور
   * @returns Promise<UserCredential> - بيانات المستخدم المسجل
   * @throws Error إذا فشل تسجيل الدخول
   */
  const login = async (email: string, password: string): Promise<UserCredential> => {
    const auth = getAuth();
    
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }

    return await signInWithEmailAndPassword(auth, email, password);
  };

  /**
   * إنشاء حساب جديد للمستخدم
   * Create new user account with email and password
   * 
   * @param email - البريد الإلكتروني للمستخدم الجديد
   * @param password - كلمة المرور
   * @returns Promise<UserCredential> - بيانات المستخدم المنشأ
   * @throws Error إذا فشل إنشاء الحساب
   */
  const signup = async (email: string, password: string): Promise<UserCredential> => {
    const auth = getAuth();
    
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }

    return await createUserWithEmailAndPassword(auth, email, password);
  };

  /**
   * تسجيل خروج المستخدم الحالي
   * Sign out current user
   * 
   * @returns Promise<void>
   * @throws Error إذا فشل تسجيل الخروج
   */
  const logout = async (): Promise<void> => {
    const auth = getAuth();
    
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }

    return await signOut(auth);
  };

  /**
   * تسجيل دخول المستخدم عبر Google OAuth
   * Sign in user with Google OAuth popup
   * 
   * @returns Promise<UserCredential> - بيانات المستخدم المسجل
   * @throws Error إذا فشل تسجيل الدخول عبر Google
   */
  const loginWithGoogle = async (): Promise<UserCredential> => {
    const auth = getAuth();
    
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }

    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading,
        login,
        signup,
        logout,
        loginWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);