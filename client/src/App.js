import "./App.css";
import "./style.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./page/Layout";
import Home from "./page/Home";
import Login from "./components/Login.jsx";
import Reservation from "./page/Reservation.jsx";
import Accommodation from "./page/Accommodation.jsx";
import Theme from "./page/Theme.jsx";
import NaverCallback from "./page/NaverCallback.jsx";
import KakaoCallback from "./page/KakaoCallback.jsx";
import GoogleCallback from "./page/GoogleCallback.jsx";
import MyPage from "./page/MyPage.jsx";
import PaymentComplete from "./page/PaymentComplete.jsx";
import PaymentFail from "./page/PaymentFail.jsx";

import { FilterProvider } from "./context/FiltersContext.jsx";
import { CategoryProvider } from "./context/CategoryContext.jsx";
import Admin from "./page/Admin.jsx";
import AdminLogin from "./page/AdminLogin.jsx";
import { FormProvider } from "./context/FormContext.jsx";
import { OrderProvider } from "./context/OrderContext.jsx";
import { ReviewProvider } from "./context/ReviewContext";
import Modal from "react-modal";
import MusicalSeatReservation from "./page/MusicalSeatReservation.jsx";

// react-modal 설정
Modal.setAppElement("#root");

function App() {
  return (
    <>
      <OrderProvider>
        <FormProvider>
          <FilterProvider>
            <CategoryProvider>
              <ReviewProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Home />} />
                      <Route path="/performancereservation" element={<MusicalSeatReservation />} />
                      <Route path="/mypage" element={<MyPage />} />
                      <Route path="/reservation" element={<Reservation />} />
                      <Route path="/accommodation" element={<Accommodation />} />
                      {/* 숙박일 때 공통컴포넌트*/}
                      <Route path="/theme" element={<Theme />} />
                      {/* 테마일 때 공통컴포넌스*/}
                      <Route path="/naver/callback" element={<NaverCallback />} />
                      <Route path="/kakao/callback" element={<KakaoCallback />} />
                      <Route path="/google/callback" element={<GoogleCallback />} />
                      {/** 관리자 페이지 */}
                      <Route path="/admin" element={<AdminLogin />} />
                      <Route path="/admin/active" element={<Admin />} />
                      {/* 결제 관련 라우트 */}
                      <Route path="/payment/complete" element={<PaymentComplete />} />
                      <Route path="/payment/fail" element={<PaymentFail />} />
                    </Route>
                  </Routes>
                  <Login />
                </BrowserRouter>
                <ToastContainer
                  position="top-right" // top-right, top-center, bottom-left 등
                  autoClose={1000} // 3초 후 자동 닫힘
                  hideProgressBar={false}
                  newestOnTop={true}
                  closeOnClick
                  pauseOnHover
                  draggable
                />
              </ReviewProvider>
            </CategoryProvider>
          </FilterProvider>
        </FormProvider>
      </OrderProvider>
    </>
  );
}

export default App;
