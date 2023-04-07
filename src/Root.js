import React, { useEffect, useState } from "react";
import "./App.css";
import "../src/pages/home/Home.css";
import {
  Routes,
  Route,
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Spinners from "./component/spinner/Spinners";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getItem, isset, remoteItem, setItem } from "./config/utill";
import {
  Container,
  Dropdown,
  DropdownButton,
  Nav,
  Navbar,
  Spinner,
} from "react-bootstrap";
import { FiClock, FiInfo, FiLogOut } from "react-icons/fi";
import { Url } from "./config/route";
import { AiOutlineMenu } from "react-icons/ai";
import {
  act_activeMenu,
  act_setRefreshToken,
  act_setToken,
  act_setUser,
  loginIn,
  logout,
  showLoading,
} from "./redux/action";
import { api } from "./config/axios";
import { showToast } from "./component/toast/Toast";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import Menu from "./pages/menu/Menu";
import Status from "./pages/status/Status";
import Login from "./pages/login/Login";
import Admin from "./pages/Admin/Admin";
import ProtectedRoute from "./ProtectedRoute";
import Loading from "./Loading";
import Home from "./pages/home/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import Unit from "./pages/unit/Unit";
import Category from "./pages/category/Category";
import Product from "./pages/product/Product";
import ProtectedRouteAdmin from "./ProtectedRouteAdmin";
import StatusDetail from "./pages/status/StatusDetail";
import Load from "./Load";
import Supplier from "./pages/supplier/Supplier";

function Root() {
  const isLoading_redux = useSelector((state) => state.isLoading);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [cookies, setCookie] = useCookies(["token", "user", "refreshToken"]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userToken = useSelector((state) => {
    if (cookies.token != "") {
      return cookies.token;
    } else {
      return state.userToken;
    }
  });

  const user = useSelector((state) => {
    if (cookies.user != "") {
      return cookies.user;
    } else {
      return state.user;
    }
  });

  const refreshToken = useSelector((state) => {
    if (cookies.refreshToken != "") {
      return cookies.refreshToken;
    } else {
      return state.refreshToken;
    }
  });

  useEffect(() => {
    const get_user = async (token) => {
      const response = await api.axios_infor_user(token);
      if (response.status == 200) {
        setCookie("user", response.data, { path: "/" });
        document.title = response.data.storeId.nameStore;
        dispatch(act_setUser(response.data));
        dispatch(act_setToken(userToken));
        dispatch(act_setRefreshToken(refreshToken));
      } else {
        dispatch(act_setUser({}));
        document.title = "Thông tin tạm thời chưa có.";
        dispatch(act_setToken(""));
        dispatch(act_setRefreshToken(""));
      }
    };

    // if (!userToken) {
    //   dispatch(logout());
    //   navigate("/login");
    // } else {
    //   get_user(userToken);
    // }
    // setInterval(() => {
    //   setIsLoading(false);
    // }, 2000);
  }, [dispatch]);

  const listMenu = useSelector((state) => {
    if (!getItem("listMenu")) {
      return state.listMenu;
    } else {
      return getItem("listMenu");
    }
  });

  const fncLoginAccount = async (text) => {
    const response = await api.axios_login(text);
    if (!response) {
      showToast("__ERROR_TYPE", response.messages);
    } else if (response.status == 200) {
      showToast("__SUCCESS_TYPE", response.messages);
      dispatch(loginIn(response.token, response.resfreshToken));
      setCookie("token", response.token, { path: "/" });
      setCookie("user", response.data, { path: "/" });
      setCookie("refreshToken", response.resfreshToken, { path: "/" });
      document.title = response.data.storeId.nameStore;
      dispatch(act_setUser(response.data));
      const list = [...listMenu];
      list[0].active = true;
      setItem("listMenu", list);
      dispatch(act_activeMenu(list));

      let origin = "/quanly/dashboard";
      if (location.state) {
        if (location.state.from) {
          origin = location.state.from.pathname;
        } else {
          origin = "/quanly/dashboard";
        }
      } else {
        origin = "/quanly/dashboard";
      }
      navigate(origin);
    } else if (response.status == 401) {
      showToast("__ERROR_TYPE", response.messages);
    } else {
      showToast("__ERROR_TYPE", response.data);
    }
  };

  const handleLogout = async (token, refreshToken) => {
    const res = await api.axios_logout(token, refreshToken);
    if (res.status == 200) {
      dispatch(showLoading(true));
      remoteItem("listMenu");
      remoteItem("openMenu");
      dispatch(logout());
      setCookie("token", "", { path: "/" });
      setCookie("user", "", { path: "/" });
      setCookie("refreshToken", "", { path: "/" });
      showToast("__SUCCESS_TYPE", res.messages);
    } else {
      showToast("__ERROR_TYPE", res.messages);
    }
  };

  const handleLogoutAll = async (token, refreshToken) => {
    const res = await api.axios_logout_all(token, refreshToken);
    if (res.status == 200) {
      dispatch(showLoading(true));
      setCookie("token", "", { path: "/" });
      setCookie("user", "", { path: "/" });
      setCookie("refreshToken", "", { path: "/" });
      dispatch(logout());
      remoteItem("listMenu");
      remoteItem("openMenu");
      showToast("__SUCCESS_TYPE", res.messages);
    } else {
      showToast("__ERROR_TYPE", res.messages);
    }
  };

  return (
    <div className="page">
      {/* {isLoading ? (
        // <Loading></Loading>
        <></>
      ) : ( */}
      <>
        <Routes>
          <Route index element={<Login submitLogin={fncLoginAccount} />} />
          <Route
            path="login"
            element={<Login submitLogin={fncLoginAccount} />}
          />
          <Route
            path="quanly/*"
            element={
              <ProtectedRoute redirectPath="/login" isAllowed={!!userToken}>
                <Admin
                  checkToken={userToken}
                  handleLogout={handleLogout}
                  handleLogoutAll={handleLogoutAll}
                />
              </ProtectedRoute>
            }
          >
            <Route element={<ProtectedRouteAdmin isAllowed={!!userToken} />}>
              <Route path="home" element={<Home />} title={"Trang chủ"} />
              <Route
                index
                element={<Dashboard user={user} title={"Dashboard"} />}
              />
              <Route
                path="dashboard"
                element={<Dashboard user={user} title={"Dashboard"} />}
              />
              <Route
                path="status"
                element={<Status user={user} title={"Trạng thái"} />}
              >
                <Route path=":id" element={<StatusDetail />} />
              </Route>
              <Route path="unit" element={<Unit />} />
              <Route path="category" element={<Category />} />
              <Route path="supplier" element={<Supplier />} />
              <Route path="product" element={<Product />} />
            </Route>
            <Route path="roles" element={<>Không có quyền</>} />
            <Route path="*" element={<p>There's nothing here: 404 new!</p>} />
          </Route>
          <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Routes>
      </>
      {/* )} */}
      {isLoading_redux && <Loading></Loading>}
      {<Load></Load>}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        transition={Slide}
        limit={10}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default Root;
