import {setPinList} from '../features/kakaoMapPins/kakaoMapPinsSlice.js';
export const kakaoMapPins = (dispatch, { locations }) => {
  if (locations !== undefined) dispatch(setPinList(locations)); // 카카오맵 핀들 ( 주소들 ) [{ name, address }]

};
