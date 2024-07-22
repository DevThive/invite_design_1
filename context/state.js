import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Context 생성
const SearchContext = createContext();

// Provider 컴포넌트
export const JsonContext = ({ children }) => {
  const [posts, setPosts] = useState([]); // 초기값은 빈 배열
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 오류 상태 관리

  useEffect(() => {
    const controller = new AbortController(); // AbortController 생성
    const fetchPosts = async () => {
      try {
        const response = await axios.get("https://api.example.com/posts", {
          signal: controller.signal, // 요청에 signal 추가
        });
        console.log(controller.signal);
        setPosts(response.data); // API에서 받은 데이터를 상태에 저장
      } catch (err) {
        if (err.name === "CanceledError") {
          console.log("요청이 취소되었습니다.");
        } else {
          setError(err); // 오류 발생 시 오류 상태 업데이트
        }
      } finally {
        setLoading(false); // 데이터 로딩 완료
      }
    };

    fetchPosts();

    return () => {
      controller.abort(); // 컴포넌트 언마운트 시 요청 취소
    };
  }, []); // 컴포넌트가 마운트될 때 한 번만 호출

  return (
    <SearchContext.Provider value={{ posts, loading, error }}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom Hook
export const useSearchContext = () => {
  return useContext(SearchContext);
};
