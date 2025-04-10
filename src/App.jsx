import React, { useCallback, useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import AuthContext from "./context/authContext";
import routes from "./routes/routes";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import "./styles/sweetalert.css";

import "./App.css";

export default function App() {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    token: null,
    userInfos: {},
  });

  const router = useRoutes(routes);

  // Login handler
  const login = useCallback((userInfos, token) => {
    try {
      setAuthState({
        isLoggedIn: true,
        token,
        userInfos,
      });
      localStorage.setItem("user", JSON.stringify({ token }));
    } catch (error) {
      Swal.fire({
        title: "خطا در ورود",
        text: "مشکلی در ذخیره‌سازی اطلاعات کاربر رخ داد",
        icon: "error",
        confirmButtonText: "تلاش مجدد",
      });
      console.error("Login Error:", error);
    }
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    try {
      setAuthState({
        isLoggedIn: false,
        token: null,
        userInfos: {},
      });
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }, []);

  // Check authentication status on mount and token change
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const localStorageData = JSON.parse(localStorage.getItem("user"));

        if (!localStorageData?.token) {
          logout();
          return;
        }

        const response = await fetch(`http://localhost:4000/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorageData.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();

        setAuthState((prev) => ({
          ...prev,
          isLoggedIn: true,
          userInfos: userData,
        }));
      } catch (error) {
        console.error("Auth Check Error:", error);

        if (error.message.includes("401")) {
          Swal.fire({
            title: "نشست شما منقضی شده است",
            text: "لطفاً مجدداً وارد شوید",
            icon: "warning",
            confirmButtonText: "باشه",
          });
          logout();
        } else {
          Swal.fire({
            title: "خطا در برقراری ارتباط",
            text: "مشکلی در ارتباط با سرور رخ داده است",
            icon: "error",
            confirmButtonText: "تلاش مجدد",
          });
        }
      }
    };

    checkAuth();
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      {router}
    </AuthContext.Provider>
  );
}
