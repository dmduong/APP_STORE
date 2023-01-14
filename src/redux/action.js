import {
  LOGININ,
  LOGOUT,
  REFRESHTOKEN,
  SHOWLOADING,
  SETUSER,SETPAGINATION
} from "./actionType";

export const loginIn = (token,refreshToken) => ({
  type: LOGININ,
  token: token,
  refreshToken: refreshToken,
});

export const logout = () => ({
  type: LOGOUT,
});

export const freshToken = (token) => ({
  type: REFRESHTOKEN,
  payLoad: token,
});

export const showLoading = (status) => ({
  type: SHOWLOADING,
  payLoad: status,
});

export const act_setUser = (user) => ({
  type: SETUSER,
  payLoad: user,
});

export const act_setPagination = (pagination) => ({
  type: SETPAGINATION,
  payLoad: pagination,
});
