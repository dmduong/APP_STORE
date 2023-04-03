import {
  LOGININ,
  LOGOUT,
  REFRESHTOKEN,
  SHOWLOADING,
  SETUSER,
  SETPAGINATION,
  SETUNIT,
  SETRESFRESHTOKEN,
  SETTOKEN,
  ACTIVEMENU,
  SETSUPPLIER,
  SETPRODUCT,
  SETISCHECK,
  SETISCHECKALL,
  SETHID,
} from "./actionType";

const arr_menu = [
  {
    _id: 1,
    name: "Dashboard",
    link: "dashboard",
    active: false,
  },
  {
    _id: 2,
    name: "Status",
    link: "status",
    active: false,
  },
  {
    _id: 3,
    name: "Category",
    link: "category",
    active: false,
  },
  {
    _id: 4,
    name: "Unit",
    link: "unit",
    active: false,
  },
  {
    _id: 5,
    name: "Supplier",
    link: "supplier",
    active: false,
  },
  {
    _id: 6,
    name: "Products",
    link: "product",
    active: false,
  },
];

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
  listUnit: [],
  listMenu: [...arr_menu],
  listSupplier: [],
  listProduct: [],
  objectsValue: {
    isCheck: [],
    isCheckAll: false,
    h_id: "",
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
    case SETTOKEN:
      return {
        ...state,
        userToken: action.payLoad ? action.payLoad : "",
      };
    case SETRESFRESHTOKEN:
      return {
        ...state,
        refreshToken: action.payLoad ? action.payLoad : "",
      };
    case SETPAGINATION:
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

    case SETUNIT:
      return {
        ...state,
        listUnit: [...action.payLoad],
      };

    case ACTIVEMENU:
      return {
        ...state,
        listMenu: [...action.payLoad],
      };

    case SETSUPPLIER:
      return {
        ...state,
        listSupplier: [...action.payLoad],
      };

    case SETPRODUCT:
      return {
        ...state,
        listProduct: [...action.payLoad],
      };

    case SETISCHECK:
      return {
        ...state,
        objectsValue: {
          isCheck: [...action.payLoad],
          isCheckAll: state.objectsValue.isCheckAll,
        },
      };

    case SETISCHECKALL:
      return {
        ...state,
        objectsValue: {
          isCheckAll: action.payLoad,
          isCheck: [...state.objectsValue.isCheck],
        },
      };

    case SETHID:
      return {
        ...state,
        objectsValue: {
          isCheckAll: state.objectsValue.isCheckAll,
          isCheck: [...state.objectsValue.isCheck],
          h_id: action.payLoad,
        },
      };

    default:
      return state;
  }
};
