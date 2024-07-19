import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";
import Logo from "@components/Logo";
import menu from "@config/menu.json";
import SearchModal from "@layouts/partials/SearchModal";
import axios from "axios";

// 로그인 및 회원가입 모달 컴포넌트
const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [username, setUsername] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  // const [checkpassword, setcheckPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(null);

  const checkUsernameAvailability = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4001/users/checkid?username=${username}`
      );
      setIsUsernameAvailable(response.data.available);
    } catch (error) {
      console.error("아이디 중복 검사 오류:", error);
      setIsUsernameAvailable(false);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4001/auth/signup", {
        username,
        email,
        nickname,
        password,
        checkPassword: confirmPassword,
      });

      if (response.status === 200) {
        const data = response.data;
        alert("회원가입 성공: " + JSON.stringify(data));
        // 회원가입 성공 후 필요한 동작을 여기에 추가하세요
      }
    } catch (error) {
      alert("회원가입 실패: " + error.message);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === password);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:4001/auth/login", {
        username,
        password,
      });

      if (response.status === 200) {
        const data = response.data;
        alert("로그인 성공: " + JSON.stringify(data));
        // 로그인 성공 후 필요한 동작을 여기에 추가하세요
      }
    } catch (error) {
      alert("로그인 실패: " + error.response?.statusText || error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="mx-auto rounded-lg bg-white p-6"
        style={{ width: "60%", maxWidth: "800px" }} // 여기서 너비와 최대 너비를 설정
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl">로그인 / 회원가입</h2>
          <button className="text-gray-600" onClick={onClose}>
            닫기
          </button>
        </div>
        <div className="mb-4 flex justify-center">
          <button
            className={`mr-2 px-4 py-2 ${
              activeTab === "login"
                ? "bg-yellow-400 text-black"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => setActiveTab("login")}
          >
            로그인
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "signup"
                ? "bg-yellow-400 text-black"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            회원가입
          </button>
        </div>
        {activeTab === "login" && (
          <div>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700">아이디</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded border-gray-300 p-2"
                  placeholder="아이디를 입력하세요"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">비밀번호</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded border-gray-300 p-2"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="mb-4 w-full rounded bg-yellow-400 px-4 py-2 text-black"
              >
                로그인
              </button>
            </form>
            <button
              className="w-full rounded bg-yellow-400 px-4 py-2 text-black"
              onClick={() => {
                // 여기에 카카오 로그인 로직을 추가하세요
                alert("카카오 로그인");
              }}
            >
              카카오 로그인하기
            </button>
          </div>
        )}
        {activeTab === "signup" && (
          <div>
            <form onSubmit={handleSignup}>
              <div className="mb-4">
                <label className="block text-gray-700">아이디</label>
                <div className="flex">
                  <input
                    type="text"
                    className="mr-2 mt-1 w-full rounded border-gray-300 p-2"
                    placeholder="아이디를 입력하세요"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <button
                    type="button"
                    className="mt-1 rounded bg-blue-500 px-4 py-2 text-white"
                    onClick={checkUsernameAvailability}
                  >
                    중복검사
                  </button>
                </div>
                {isUsernameAvailable !== null && (
                  <p
                    className={`mt-1 text-sm ${
                      isUsernameAvailable ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isUsernameAvailable
                      ? "사용 가능한 아이디입니다."
                      : "이미 사용 중인 아이디입니다."}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">이메일</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded border-gray-300 p-2"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">닉네임</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded border-gray-300 p-2"
                  placeholder="닉네임을 입력하세요"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">비밀번호</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded border-gray-300 p-2"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">비밀번호 확인</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded border-gray-300 p-2"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
                {passwordMatch !== null && (
                  <p
                    className={`mt-1 text-sm ${
                      passwordMatch ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {passwordMatch
                      ? "비밀번호가 일치합니다."
                      : "비밀번호가 일치하지 않습니다."}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full rounded bg-yellow-400 px-4 py-2 text-black"
              >
                회원가입
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const Header = () => {
  const { main } = menu;

  const [navFixed, setNavFixed] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [authModal, setAuthModal] = useState(false);

  useEffect(() => {
    const changeNavbarBackground = () => {
      if (window.pageYOffset >= 1) {
        setNavFixed(true);
      } else {
        setNavFixed(false);
      }
    };
    window.addEventListener("scroll", changeNavbarBackground);
  });

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white py-2 transition-all ${
          navFixed ? "shadow" : "pt-8 md:pt-16"
        }`}
      >
        <nav className="navbar container">
          <div className="order-0">
            <Logo />
          </div>
          <input id="nav-toggle" type="checkbox" className="hidden" />
          <label
            id="show-button"
            htmlFor="nav-toggle"
            className="order-2 flex cursor-pointer items-center md:order-1 md:hidden"
          >
            <svg className="h-6 fill-current" viewBox="0 0 20 20">
              <title>Menu Open</title>
              <path d="M0 3h20v2H0V3z m0 6h20v2H0V9z m0 6h20v2H0V0z" />
            </svg>
          </label>
          <label
            id="hide-button"
            htmlFor="nav-toggle"
            className="order-2 hidden cursor-pointer items-center md:order-1"
          >
            <svg className="h-6 fill-current" viewBox="0 0 20 20">
              <title>Menu Close</title>
              <polygon
                points="11 9 22 9 22 11 11 11 11 22 9 22 9 11 -2 11 -2 9 9 9 9 -2 11 -2"
                transform="rotate(45 10 10)"
              />
            </svg>
          </label>

          <ul
            id="nav-menu"
            className="navbar-nav order-3 hidden w-full md:order-1 md:flex md:w-auto md:space-x-2"
          >
            {main.map((menu, i) => (
              <React.Fragment key={`menu-${i}`}>
                {menu.hasChildren ? (
                  <li className="nav-item nav-dropdown group relative">
                    <span className="nav-link inline-flex items-center">
                      {menu.name}
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </span>
                    <ul className="nav-dropdown-list hidden group-hover:block md:invisible md:absolute md:block md:opacity-0 md:group-hover:visible md:group-hover:opacity-100">
                      {menu.children.map((child, i) => (
                        <li className="nav-dropdown-item" key={`children-${i}`}>
                          <Link
                            href={child.url}
                            className="nav-dropdown-link block"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link href={menu.url} className="nav-link block">
                      {menu.name}
                    </Link>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
          <div className="order-1 ml-auto flex items-center md:order-2 md:ml-0">
            <div
              className="cursor-pointer p-2 text-xl text-dark hover:text-primary"
              onClick={() => {
                setSearchModal(true);
              }}
            >
              <IoSearch />
            </div>
            <button
              className="nav-link inline-flex items-center text-sm"
              onClick={() => setAuthModal(true)}
            >
              로그인/회원가입
            </button>
          </div>

          <SearchModal
            searchModal={searchModal}
            setSearchModal={setSearchModal}
          />
          <AuthModal isOpen={authModal} onClose={() => setAuthModal(false)} />
        </nav>
      </header>
    </>
  );
};

export default Header;
