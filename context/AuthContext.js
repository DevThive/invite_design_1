import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import auth from "@config/auth";
import { useRouter } from "next/router"; // useRouter를 import 추가

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  error: null, // 에러 상태 추가
  setUser: () => null,
  setLoading: () => Boolean,
  setError: () => {}, // 에러 상태 설정 함수 추가
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};
const AuthContext = createContext(defaultProvider);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(defaultProvider.error); // 에러 상태 관리

  const router = useRouter(); // useRouter를 여기서 정의

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(auth.meEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser({ ...response.data });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // 토큰이 만료된 경우
        const newToken = await refreshToken();

        // 갱신된 토큰으로 다시 시도
        await fetchUserData(newToken);
      } else {
        console.error(error);
        setError("로그인 정보를 가져오는데 실패했습니다.");
        handleLogout();
      }
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(auth.storageTokenKeyName);
      // const urlParams = new URLSearchParams(window.location.search);
      const token = storedToken; // URL의 token이 우선순위를 가짐

      if (token) {
        setLoading(true);
        await fetchUserData(token);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    initAuth();
  }, [router]);

  // const handleLogin = async (email, password) => {
  //   try {
  //     const response = await axios.post("/api/login", { email, password });
  //     setUser(response.data.user);
  //     router.push("/"); // 로그인 성공 시 리디렉션
  //   } catch (error) {
  //     console.error("로그인 실패:", error);
  //   }
  // };

  const handleLogin = async (event, params, errorCallback) => {
    event.preventDefault();
    alert(params.username, params.password);

    try {
      const response = await axios.post("http://localhost:4001/auth/login", {
        params,
      });

      if (response.status === 201) {
        const data = response.data;

        // alert("로그인 성공: " + JSON.stringify(data));
        // 로컬 스토리지에 액세스 토큰과 사용자 데이터 저장
        localStorage.setItem("access_token", data.accessToken);
        localStorage.setItem("user_data", JSON.stringify(data.userData));

        // 로그인 성공 후 필요한 동작을 여기에 추가하세요
        // router.push("/"); // 메인 페이지로 이동
      }
    } catch (error) {
      alert("로그인 실패: " + error.response.data.message);
      // console.error(err)
      // setError('로그인에 실패했습니다.')
      errorCallback && errorCallback(error);
    }
  };

  const handleLogout = () => {
    // 로컬 스토리지에서 액세스 토큰과 사용자 데이터 삭제
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");

    // 로그아웃 후 필요한 동작 추가 (예: 메인 화면으로 리다이렉트)
    window.location.href = "/"; // 또는 React Router를 사용하는 경우 navigate('/') 사용
  };

  const values = {
    user,
    loading,
    error, // 에러 상태 전달
    setUser,
    setLoading,
    setError, // 에러 상태 설정 함수 전달
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
