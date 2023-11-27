import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import HeaderApp from "./components/Header";
import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/Auth/Login";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { authFirebase } from "./configs/firebase.config";
import Product from "./pages/Products";

function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFirebase, (user) => {
      if (user) {
        console.log(user);
      } else {
      }
    });

    // Cleanup
    return () => unsubscribe();
  }, []);
  return (
    <>
      <HeaderApp />
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/product" element={<Product />} />
      </Routes>
    </>
  );
}

export default App;
