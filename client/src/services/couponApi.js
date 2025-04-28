// features/coupon/couponApi.js
import { setCoupon } from "../features/coupons/couponSlice.js"

export const giveCouponToMember = (dispatch, member) => {
    if (!member) return;
  
    const { ID, NAME, GRADE } = member;
  
    if (GRADE === "GOLD") {
      alert(`${NAME}님에게 GOLD 쿠폰이 발급되었습니다.`);
      dispatch(setCoupon({ id: ID, grade: "GOLD", amount: 10000 }));
    } else if (GRADE === "SILVER") {
      alert(`${NAME}님에게 SILVER 쿠폰이 발급되었습니다.`);
      dispatch(setCoupon({ id: ID, grade: "SILVER", amount: 5000 }));
    } else {
      alert(`${NAME}님은 BRONZE 등급으로 쿠폰 발급 대상이 아닙니다.`);
    }
  };
  
  /**
   * 
   * 같은 인원한테 반복적으로 쿠폰을 줬을 때
   *  로그에 
   *  A non-serializable value was detected in the state, in the path: userInfo.firstDate.
   *  Value: Wed Apr 23 2025 11:45:55 GMT+0900 (한국 표준시) 이런 메시지가 발생
   */

/**
 * 해당 메시지의 원인은 store.js에서 preloadedState에 Date 객체를 그대로 넣었기 때문입니다:

    userInfo: {
    ...state.userInfo,
    firstDate: today.toISOString(),     // ✅ 이렇게 바꿔야 함
    lastDate: tomorrow.toISOString(),   // ✅
    }
 */

    /**
     * ✅ 새로운 인물 (처음으로 쿠폰 지급받은 사람)
        새롭게 state에 추가된 사용자

        쿠폰 발급 시 dispatch(setCoupon(...))으로 상태에 추가됨

        이 때 상태 구조는 모두 serializable 하게 작성된 최신 코드로 반영됨

        그래서 문제가 없음 ✅

        ❌ 기존 인물 (이미 localStorage에 저장된 사람)
        이전에 firstDate, lastDate에 Date 객체 그대로 저장되어 있었음

        앱 새로고침 후에도 그 Date 객체가 다시 불려옴 (localStorage → preloadedState)

        Date 객체는 직렬화 불가능하므로 Redux Toolkit이 경고를 띄움 ⚠️
     */

        /** 결론 - 자동적으로 중복되어 들어가지 않는다. */