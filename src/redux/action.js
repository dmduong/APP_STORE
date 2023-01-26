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
} from "./actionType";

export const loginIn = (token, refreshToken) => ({
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

export const act_setToken = (token) => ({
  type: SETTOKEN,
  payLoad: token,
});

export const act_setRefreshToken = (refreshToken) => ({
  type: SETRESFRESHTOKEN,
  payLoad: refreshToken,
});

export const act_setUser = (user) => ({
  type: SETUSER,
  payLoad: user,
});

export const act_setPagination = (pagination) => ({
  type: SETPAGINATION,
  payLoad: pagination,
});

export const act_setUnit = (unit) => ({
  type: SETUNIT,
  payLoad: unit,
});

export const act_activeMenu = (active) => ({
  type: ACTIVEMENU,
  payLoad: active,
});

export const act_setSupplier = (supplier) => ({
  type: SETSUPPLIER,
  payLoad: supplier,
});
