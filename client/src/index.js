import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./app/store.js";
import { Provider } from "react-redux";
import { setInitialLoginState } from "./features/auth/authSlice.js";

// 개발 시 전역 Promise 오류 잡기
// window.addEventListener("unhandledrejection", (e) => {
//   console.error("🔥 Promise reject:", e.reason);
// });

const root = ReactDOM.createRoot(document.getElementById("root"));
store.dispatch(setInitialLoginState());
root.render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
      <App />
    {/* </React.StrictMode> */}
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
