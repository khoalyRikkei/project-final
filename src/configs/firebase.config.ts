// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqEzRC2kkYO2FxOU-fUecI4b8S9uhxxXk",
  authDomain: "react-app-test-ae2aa.firebaseapp.com",
  projectId: "react-app-test-ae2aa",
  storageBucket: "react-app-test-ae2aa.appspot.com",
  messagingSenderId: "310766783155",
  appId: "1:310766783155:web:9bf76452595593a8137ec6",
};

// Initialize Firebase
// Khởi tạo app cho firebase
const appFirebase = initializeApp(firebaseConfig);

// configure OAuth
export const authFirebase = getAuth(appFirebase);

// Tạo provider cho Google Auth
export const googleProvider = new GoogleAuthProvider();

// Hàm đăng nhập bằng Google

