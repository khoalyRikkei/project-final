import { loginApi } from "../api/auth.api";
import { authFirebase, googleProvider } from "../configs/firebase.config";
import { LoginRequest } from "../types/request.type";
import { signInWithPopup, signOut } from "firebase/auth";

// Function xử lý nghiệp vụ login
export const loginService = async (userLogin: LoginRequest) => {
  try {
    const data = await loginApi(userLogin);

    // Process the data, e.g., save token to local storage
    localStorage.setItem("authToken", data.token);

    // Return the user data or token
    return data;
  } catch (error) {
    // Handle or throw error
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(authFirebase, googleProvider);

    // Kiểm tra email đã tồn tại hay chưa --> chưa thì lưu email vào như một người dùng mới

    console.log(result);

    return result.user;
  } catch (error) {
    // Xử lý lỗi ở đây
    console.error("Error during signInWithGoogle", error);
  }
};

export const logoutGoogleService = () => {
  console.log("111111");
  signOut(authFirebase)
    .then(() => {
      // Sign-out successful.
      console.log("Logout successful");
    })
    .catch((error) => {
      // An error happened.
    });
};
