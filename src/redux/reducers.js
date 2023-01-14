import {
  LOGININ,
  LOGOUT,
  REFRESHTOKEN,
  SHOWLOADING,
  SETUSER,
  SETPAGINATION,
} from "./actionType";

const initialState = {
  isLoading: false,
  isSignout: false,
  userToken: "",
  refreshToken: "",
  user: "",
  pagination: {
    page: 0,
    limit: 5,
    pages: 0,
    total: 0,
    dataOfPage: 0,
  },
};

export const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGININ:
      return {
        ...state,
        isSignout: false,
        userToken: action.token,
        refreshToken: action.refreshToken,
      };

    case LOGOUT:
      return {
        ...state,
        isSignout: true,
        userToken: "",
        refreshToken: "",
        user: "",
      };

    case REFRESHTOKEN:
      return {
        ...state,
        userToken: action.payLoad,
        isLoading: false,
      };

    case SHOWLOADING:
      return {
        ...state,
        isLoading: action.payLoad,
      };

    case SETUSER:
      return {
        ...state,
        user: action.payLoad ? action.payLoad : {},
      };
    case SETPAGINATION:

      // let dataOfPage = action.payLoad.dataOfPage;
      // let page = action.payLoad.page;
      // if (dataOfPage == 0) {
      //   page = page - 1;
      // }
      
      return {
        ...state,
        pagination: {
          page: action.payLoad ? action.payLoad.page : 0,
          pages: action.payLoad ? action.payLoad.pages : 0,
          limit: action.payLoad ? action.payLoad.limit : 5,
          total: action.payLoad ? action.payLoad.total : 0,
          dataOfPage: action.payLoad ? action.payLoad.dataOfPage : 0,
        },
      };

    default:
      return state;
  }
};
