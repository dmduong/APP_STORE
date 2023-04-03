import React, { useEffect, useState } from "react";
import "../../App.css";
import "../home/Home.css";
import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Spinners from "../../component/spinner/Spinners";
import { getItem, isset, setItem } from "../../config/utill";
import {
  Container,
  Dropdown,
  DropdownButton,
  Nav,
  Navbar,
} from "react-bootstrap";
import { FiClock, FiInfo, FiLogOut } from "react-icons/fi";
import { Url } from "../../config/route";
import { AiOutlineMenu } from "react-icons/ai";
import {
  act_activeMenu,
  act_setRefreshToken,
  act_setToken,
  act_setUser,
  loginIn,
  logout,
} from "../../redux/action";
import { api } from "../../config/axios";
import { showToast } from "../../component/toast/Toast";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import Menu from "../../pages/menu/Menu";
import Status from "../../pages/status/Status";
import Dashboard from "../dashboard/Dashboard";
import ProtectedRoute from "../../ProtectedRoute";
import Unit from "../unit/Unit";
import Category from "../category/Category";
import Product from "../product/Product";
import Home from "../home/Home";
import ProtectedRouteAdmin from "../../ProtectedRouteAdmin";

const router = createBrowserRouter([
  {
    path: "dashboard",
    element: <Dashboard />,
  },
]);

function Admin(props) {
  const isLoading = useSelector((state) => state.isLoading);
  const [user1, setUser1] = useState(null);
  const location = useLocation();
  const [cookies, setCookie] = useCookies(["token", "user", "refreshToken"]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(() => {
    if (isset(getItem("openMenu"))) {
      const status = getItem("openMenu");
      return status.open;
    } else {
      return false;
    }
  });

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

  //   useEffect(() => {
  // const get_user = async (token) => {
  //   const response = await api.axios_infor_user(token);
  //   if (response.status == 200) {
  //     setCookie("user", response.data, { path: "/" });
  //     document.title = response.data.storeId.nameStore;
  //     dispatch(act_setUser(response.data));
  //     dispatch(act_setToken(userToken));
  //     dispatch(act_setRefreshToken(refreshToken));
  //   } else {
  //     dispatch(act_setUser({}));
  //     document.title = "Thông tin tạm thời chưa có.";
  //     dispatch(act_setToken(""));
  //     dispatch(act_setRefreshToken(""));
  //   }
  // };
  // if (!userToken) {
  //   dispatch(logout());
  //   navigate("/login");
  // } else {
  //   get_user(userToken);
  // }
  //   }, [dispatch]);

  const listMenu = useSelector((state) => {
    if (!getItem("listMenu")) {
      return state.listMenu;
    } else {
      return getItem("listMenu");
    }
  });

  const handleLogout = async (token, refreshToken) => {
    props.handleLogout(token, refreshToken);
  };

  const handleLogoutAll = async (token, refreshToken) => {
    props.handleLogoutAll(token, refreshToken);
  };

  return (
    <div className="page">
      <>
        {
          <>
            <div className="App">
              <div className="container-home">
                {
                  <>
                    <div
                      className="left-home"
                      style={{
                        width: open ? "23%" : "0%",
                        opacity: open ? "1" : "0.5",
                      }}
                    >
                      <div
                        className="top-tabar"
                        style={{ opacity: open ? "1" : "0" }}
                      >
                        <div>
                          {user ? (
                            user.storeId.imageStore.length > 0 ? (
                              <img
                                src={Url + user.storeId.imageStore[0].nameImage}
                              />
                            ) : (
                              <img />
                            )
                          ) : (
                            <Spinners></Spinners>
                          )}
                        </div>
                        <p
                          className="text-top-page"
                          style={{ opacity: open ? "1" : "0" }}
                        >
                          {user ? (
                            user.storeId.nameStore
                          ) : (
                            <Spinners></Spinners>
                          )}
                        </p>
                      </div>
                      <div className="center-tabar">
                        <div
                          style={{ paddingLeft: "5px", paddingRight: "10px" }}
                        >
                          <Menu></Menu>
                        </div>
                      </div>
                    </div>
                    <div
                      className="right-home"
                      style={{ width: open ? "77%" : "100%" }}
                    >
                      <div className="top-right-pages">
                        <Navbar className="h-100" bg="light" expand="lg">
                          <Container fluid>
                            <Navbar.Brand>
                              <div
                                onClick={() => {
                                  setOpen(!open);
                                  setItem("openMenu", { open: !open });
                                }}
                                className={
                                  !open ? "icon-open-tab" : "icon-close-tab"
                                }
                              >
                                {!open ? (
                                  <AiOutlineMenu></AiOutlineMenu>
                                ) : (
                                  <AiOutlineMenu></AiOutlineMenu>
                                )}
                              </div>
                            </Navbar.Brand>
                            <Navbar.Brand>
                              <Link className="custom-link" to={"home"}>
                                {" "}
                                {user ? user.storeId.nameStore : "Của hàng 1"}
                              </Link>
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="navbarScroll" />
                            <Navbar.Collapse id="navbarScroll">
                              <Nav
                                className="me-auto my-2 my-lg-0"
                                style={{ maxHeight: "100px" }}
                                navbarScroll
                              >
                                <Nav.Link
                                  as={Link}
                                  className="custom-link"
                                  to={"/"}
                                >
                                  Notice
                                </Nav.Link>
                              </Nav>
                              <div className="d-flex">
                                <DropdownButton
                                  className="border rounded"
                                  key="start"
                                  id="dropdown-button-drop-start"
                                  drop="start"
                                  variant="white"
                                  title={user ? user.name : "Người dùng 1"}
                                >
                                  <Dropdown.Item eventKey="1">
                                    <FiInfo style={{ color: "green" }}></FiInfo>{" "}
                                    Thông tin cá nhân.
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="2">
                                    <FiClock
                                      style={{ color: "gray" }}
                                    ></FiClock>{" "}
                                    Lịch sử thao tác.
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    eventKey="4"
                                    onClick={() =>
                                      handleLogout(userToken, refreshToken)
                                    }
                                  >
                                    <div className="custom-link">
                                      <FiLogOut
                                        style={{ color: "red" }}
                                      ></FiLogOut>{" "}
                                      Đăng xuất
                                    </div>
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    eventKey="5"
                                    onClick={() =>
                                      handleLogoutAll(userToken, refreshToken)
                                    }
                                  >
                                    <div className="custom-link">
                                      <FiLogOut
                                        style={{ color: "red" }}
                                      ></FiLogOut>{" "}
                                      Đăng xuất tất cả.
                                    </div>
                                  </Dropdown.Item>
                                </DropdownButton>
                              </div>
                            </Navbar.Collapse>
                          </Container>
                        </Navbar>
                      </div>
                      <div className="content-pages">
                        {
                          <Outlet></Outlet>
                          //   <Routes>
                          //     <Route
                          //       element={
                          //         <ProtectedRouteAdmin
                          //           isAllowed={!!props.checkToken}
                          //         />
                          //       }
                          //     >
                          //       <Route
                          //         path="/home"
                          //         element={<Home />}
                          //         title={"Trang chủ"}
                          //       />
                          //       <Route index element={<Dashboard />} />
                          //       <Route path="dashboard" element={<Dashboard />} />
                          //       <Route
                          //         path="status"
                          //         element={<Status />}
                          //         title={"Trạng thái"}
                          //       />
                          //       <Route path="unit" element={<Unit />} />
                          //       <Route path="category" element={<Category />} />
                          //       <Route path="product" element={<Product />} />
                          //     </Route>
                          //     <Route path="roles" element={<>Không có quyền</>} />
                          //     <Route
                          //       path="*"
                          //       element={<p>There's nothing here: 404 new!</p>}
                          //     />
                          //   </Routes>
                        }
                      </div>
                    </div>
                  </>
                }
              </div>
            </div>
          </>
        }
      </>
    </div>
  );
}

export default Admin;
