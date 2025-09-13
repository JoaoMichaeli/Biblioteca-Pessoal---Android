import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

interface User {
  id: string;
  name?: string;
  email: string;
  token: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (userData: LoginData) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const storedUser = await AsyncStorage.getItem('@App:user');
      if (storedUser) setUser(JSON.parse(storedUser));
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = useCallback(async ({ email, password }: LoginData) => {
    if (!email || !password) throw new Error("Email e senha são obrigatórios.");

    const response = await auth().signInWithEmailAndPassword(email, password);
    const token = await response.user.getIdToken();

    const newUser: User = {
      id: response.user.uid,
      name: response.user.displayName || "",
      email: response.user.email || "",
      token,
    };

    setUser(newUser);
    await AsyncStorage.setItem('@App:user', JSON.stringify(newUser));
  }, []);

  const register = useCallback(async ({ email, password, name }: RegisterData) => {
    if (!email || !password) throw new Error("Email e senha são obrigatórios.");

    try {
      const response = await auth().createUserWithEmailAndPassword(email, password);
      const token = await response.user.getIdToken();

      const newUser: User = {
        id: response.user.uid,
        name: name || response.user.displayName || "",
        email: response.user.email || "",
        token,
      };

      setUser(newUser);
      await AsyncStorage.setItem('@App:user', JSON.stringify(newUser));

      console.log("Criando usuário no Firestore com ID:", newUser.id);
      await firestore()
        .collection('users')
        .doc(newUser.id)
        .set({
          email: newUser.email,
          name: newUser.name,
          isActive: true,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log("Documento do usuário criado com sucesso no Firestore!");
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      throw error;
    }
  }, []);



  const logout = useCallback(async () => {
    await auth().signOut();
    setUser(null);
    await AsyncStorage.removeItem('@App:user');
  }, []);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    await AsyncStorage.setItem('@App:user', JSON.stringify(updatedUser));

    await firestore()
      .collection('users')
      .doc(user.id)
      .update(userData);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn: !!user, login, logout, updateUser, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
