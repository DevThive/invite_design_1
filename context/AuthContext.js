import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 로그인 상태 확인
    const checkUserLoggedIn = async () => {
      try {
        const response = await axios.get("/api/auth/check"); // 로그인 상태 확인 API
        setUser(response.data.user);
      } catch (error) {
        console.error("로그인 상태 확인 에러:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/login", { email, password });
      setUser(response.data.user);
      router.push("/"); // 로그인 성공 시 리디렉션
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/logout");
      setUser(null);
      router.push("/login"); // 로그아웃 시 리디렉션
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
