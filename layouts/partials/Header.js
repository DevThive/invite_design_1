import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";
import Logo from "@components/Logo";
import menu from "@config/menu.json";
import SearchModal from "@layouts/partials/SearchModal";

// 로그인 및 회원가입 모달 컴포넌트
const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("login");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-auto max-w-xl rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl">로그인 / 회원가입</h2>
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
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">아이디</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded border-gray-300 p-2"
                  placeholder="아이디를 입력하세요"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">비밀번호</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded border-gray-300 p-2"
                  placeholder="비밀번호를 입력하세요"
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
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">아이디</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded border-gray-300 p-2"
                  placeholder="아이디를 입력하세요"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">이메일</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded border-gray-300 p-2"
                  placeholder="이메일을 입력하세요"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">닉네임</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded border-gray-300 p-2"
                  placeholder="닉네임을 입력하세요"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">비밀번호</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded border-gray-300 p-2"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">비밀번호 확인</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded border-gray-300 p-2"
                  placeholder="비밀번호를 다시 입력하세요"
                />
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
        <button className="mt-4 text-gray-600" onClick={onClose}>
          닫기
        </button>
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
              로그인
            </button>
            <button
              className="nav-link inline-flex items-center text-sm"
              onClick={() => setAuthModal(true)}
            >
              회원가입
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
