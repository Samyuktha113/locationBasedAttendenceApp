import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebaseAuth'; // Import your Firebase auth and Firestore
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const email = currentUser.email;
        if (email) {
          try {
            const userData = await fetchUserDataByEmail(email);
            if (userData) {
              setUser(userData);
            }
          } catch (error) {
            console.error("Error fetching user data on auth state change:", error);
          }
        } else {
          console.error("Email is undefined for the current user.");
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (!email || !password) {
      console.error("Email or password is missing");
      return;
    }

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      if (!userCredential || !userCredential.user) {
        console.error("User credential is undefined or invalid");
        return;
      }
      const userEmail = userCredential.user.email;
      if (!userEmail) {
        console.error("User email is undefined");
        return;
      }
      
      const userData = await fetchUserDataByEmail(userEmail);
      if (userData) {
        setUser(userData);
      } else {
        console.error("User data could not be fetched");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const fetchUserDataByEmail = async (email) => {
    if (!email) {
      console.error("Email is undefined or null");
      return null;
    }
    
    try {
      const docRef = doc(db, "employees", email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { email, ...docSnap.data() }; // Include all user data
      } else {
        console.log("No document found for the provided email!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
