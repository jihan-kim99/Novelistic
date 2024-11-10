"use client";

// page.tsx
import { useAuth } from "@/context/auth";
import { useEffect } from "react";
import { db } from "@/utils/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const LoginPage = () => {
  const { user, login, logout } = useAuth();

  useEffect(() => {
    if (user) {
      const saveUserToFirestore = async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              sessions: [],
            });
          }
        } catch (error) {
          console.error(error);
        }
      };
      saveUserToFirestore();
    }
  }, [user]);

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.displayName}</h1>
          <img src={user.photoURL} alt={user.displayName} />
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Sign in with Google</button>
      )}
    </div>
  );
};

export default LoginPage;
