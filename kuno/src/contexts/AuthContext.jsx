import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);

  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const userDocData = {
      uid: user.uid,
      displayName: displayName,
      email: email,
      createdAt: serverTimestamp(),
      lastReadSessionAt: serverTimestamp(),
      preferences: {
        notificationsEnabled: true,
        readingReminderIntervalHours: 4,
        theme: 'light'
      },
      stats: {
        totalRead: 0,
        currentlyReading: 0,
        wantToBuy: 0,
        boughtNotStarted: 0
      }
    };
    
    await setDoc(doc(db, 'users', user.uid), userDocData);
    setUserData(userDocData);
    return userCredential;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    let unsubscribeUserData;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        unsubscribeUserData = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.data());
          }
          setLoading(false);
        }, (error) => {
          console.error("Error listening to user data:", error);
          setLoading(false);
        });
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUserData) unsubscribeUserData();
    };
  }, []);

  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout,
    loading,
    selectedBook,
    setSelectedBook
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};