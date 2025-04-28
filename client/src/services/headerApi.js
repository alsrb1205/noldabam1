import { toggleHeaderMenu, openHeaderMenu, closeHeaderMenu, toggleHeaderSearch,openHeaderSearch,closeHeaderSearch } from "../features/header/headerSlice";

export const toggleMenu = () => async (dispatch) => {
  dispatch(toggleHeaderMenu());
};

export const openMenu = () => async (dispatch) => {
  dispatch(openHeaderMenu());
};

export const closeMenu = () => async (dispatch) => {
  dispatch(closeHeaderMenu());
};

export const toggleSearch = () => async (dispatch) => {
    dispatch(toggleHeaderSearch());
  };
  
  export const openSearch = () => async (dispatch) => {
    dispatch(openHeaderSearch());
  };
  
  export const closeSearch = () => async (dispatch) => {
    dispatch(closeHeaderSearch());
  };
  