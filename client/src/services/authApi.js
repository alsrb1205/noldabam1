import axios from "axios";
import {
  setIsLoggedIn,
  setIsLogout,
  setLoginReset,
  setUser,
  setNaverLogout,
  resetRecaptchaToken,
  setAllMembers,
  setMembersError,
} from "../features/auth/authSlice.js";
import { axiosPost } from "./api.js";

export const getAllMembers = async () => {
  try {
    const response = await axios.get("http://localhost:9000/member/list");
    return response.data;
  } catch (err) {
    console.error("회원 목록 가져오기 실패:", err);
    throw err;
  }
};

export const fetchAllMembers = () => async (dispatch) => {
  try {
    const members = await getAllMembers();
    dispatch(setAllMembers(members));
  } catch (err) {
    dispatch(setMembersError(true));
  }
};

export const getLoginReset = () => (dispatch) => {
  dispatch(setLoginReset());
};

export const getLogout = () => (dispatch) => {
  dispatch(setIsLogout());
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user");
  localStorage.removeItem("reduxState");

  // reCAPTCHA 토큰도 초기화
  dispatch(resetRecaptchaToken());
};

export const getLogin = (formData) => async (dispatch) => {
  const url = "http://localhost:9000/member/login";
  const data = formData;

  try {
    const loginResult = await axiosPost({ url, data });

    if (loginResult?.token) {
      localStorage.setItem("token", loginResult.token);
      localStorage.setItem("user_id", formData.id);
      dispatch(setIsLoggedIn({ result_rows: 1 }));
      return true;
    } else {
      dispatch(setIsLoggedIn({ result_rows: 0 }));
      return false;
    }
  } catch (error) {
    console.error("로그인 오류:", error);
    dispatch(setIsLoggedIn({ result_rows: 0 }));
    return false;
  }
};

/**
 * 네이버 로그인 API
 */
// 토큰 요청
export const fetchNaverToken = async ({ code, state }) => {
  const response = await axios.post(
    "http://localhost:9000/member/naver/token",
    {
      code,
      state,
    }
  );
  return response.data.access_token;
};

// 유저 정보 요청
export const fetchNaverUserInfo = async (token) => {
  const response = await axios.post(
    "http://localhost:9000/member/naver/userinfo",
    {
      token,
    }
  );
  return response.data;
};

// 로그인 처리 함수
export const naverLoginFlow =
  ({ code, state }) =>
  async (dispatch) => {
    try {
      const tokenFromServer = await fetchNaverToken({ code, state });
      const response = await fetchNaverUserInfo(tokenFromServer);
      const user = response.user;
      const token = response.token;

      dispatch(setUser({ user, token }));

      localStorage.setItem("user_id", user.ID);  // user 객체의 ID 값 직접 사용
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.error("네이버 로그인 에러:", err);
      dispatch(setNaverLogout());
    }
  };

/** 카카오 로그인 API */
export const fetchKakaoToken = async ({ code }) => {
  try {
    const response = await axios.post(
      "http://localhost:9000/member/kakao/token",
      { code }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("카카오 토큰 요청 실패:", error);
    throw error;
  }
};

export const fetchKakaoUserInfo = async (token) => {
  try {
    const response = await axios.post(
      "http://localhost:9000/member/kakao/userinfo",
      { token }
    );
    return response.data;
  } catch (error) {
    console.error("카카오 유저 정보 요청 실패:", error);
    throw error;
  }
};

export const kakaoLoginFlow =
  ({ code }) =>
  async (dispatch) => {
    try {
      const tokenFromServer = await fetchKakaoToken({ code });
      if (!tokenFromServer) {
        throw new Error("카카오 토큰을 받지 못했습니다.");
      }

      const response = await fetchKakaoUserInfo(tokenFromServer);
      if (!response || !response.user) {
        throw new Error("카카오 유저 정보를 받지 못했습니다.");
      }

      const { user, token } = response;
      dispatch(setUser({ user, token }));

      // user_id는 항상 sns_id를 사용
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user.sns_id);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.error("카카오 로그인 에러:", err);
      throw err;
    }
  };

/**
 * 구글 토큰 요청
 */
export const fetchGoogleToken = async ({ code }) => {
  try {
    const response = await axios.post(
      "http://localhost:9000/member/google/token",
      { code }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("구글 토큰 요청 실패:", error);
    throw error;
  }
};

/**
 * 구글 유저 정보 요청
 */
export const fetchGoogleUserInfo = async (token) => {
  try {
    const response = await axios.post(
      "http://localhost:9000/member/google/userinfo",
      { token }
    );
    return response.data;
  } catch (error) {
    console.error("구글 유저 정보 요청 실패:", error);
    throw error;
  }
};

/**
 * 구글 로그인 전체 플로우
 */
export const googleLoginFlow =
  ({ code }) =>
  async (dispatch) => {
    try {
      const tokenFromServer = await fetchGoogleToken({ code });
      if (!tokenFromServer) {
        throw new Error("구글 토큰을 받지 못했습니다.");
      }

      const response = await fetchGoogleUserInfo(tokenFromServer);
      if (!response || !response.user) {
        throw new Error("구글 유저 정보를 받지 못했습니다.");
      }

      const { user, token } = response;
      dispatch(setUser({ user, token }));

      // user_id는 항상 sns_id를 사용
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user.sns_id);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.error("구글 로그인 에러:", err);
      throw err;
    }
  };
