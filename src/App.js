// import React, { useEffect, useState } from "react";
// import "./App.css";
// import "../src/pages/home/Home.css";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link,
//   Navigate,
//   useNavigate,
//   Outlet,
//   NavLink,
//   useLocation,
// } from "react-router-dom";
// import Login from "./pages/login/Login";
// // import Home from "./pages/home/Home";
// import {
//   act_setUser,
//   freshToken,
//   loginIn,
//   logout,
//   showLoading,
//   act_setToken,
//   act_setRefreshToken,
// } from "../src/redux/action";
// import Container from "react-bootstrap/Container";
// import Nav from "react-bootstrap/Nav";
// import Navbar from "react-bootstrap/Navbar";
// import Dropdown from "react-bootstrap/Dropdown";
// import DropdownButton from "react-bootstrap/DropdownButton";
// import { FiLogOut, FiClock, FiInfo } from "react-icons/fi";
// import { AiOutlineMenu } from "react-icons/ai";
// import { useDispatch, useSelector } from "react-redux";
// import { useCookies } from "react-cookie";
// import { api } from "./config/axios";
// import { Url } from "../src/config/route";
// import { showToast } from "../src/component/toast/Toast";
// import Spinner from "./component/spinner/Spinners";
// import Menu from "./pages/menu/Menu";
// import { remoteItem, setItem, getItem, isset } from "./config/utill";
// // import ProtectedRoute from "./ProtectedRoute";
// // import Dashboard from "./pages/dashboard/Dashboard";
// import Status from "./pages/status/Status";
// import Category from "./pages/category/Category";
// import Unit from "./pages/unit/Unit";

// const fakeAuth = () =>
//   new Promise((resolve) => {
//     setTimeout(() => resolve("2342f2f1d131rf12"), 250);
//   });

// const AuthContext = React.createContext(null);

// function App() {
//   const [cookies, setCookie] = useCookies(["token", "user", "refreshToken"]);
//   const dispatch = useDispatch();
//   // const navigate = useNavigate();
//   const [open, setOpen] = useState(() => {
//     if (isset(getItem("openMenu"))) {
//       const status = getItem("openMenu");
//       return status.open;
//     } else {
//       return false;
//     }
//   });

//   const userToken = useSelector((state) => {
//     if (cookies.token != "") {
//       return cookies.token;
//     } else {
//       return state.userToken;
//     }
//   });

//   const user = useSelector((state) => {
//     if (cookies.user != "") {
//       return cookies.user;
//     } else {
//       return state.user;
//     }
//   });

//   const refreshToken = useSelector((state) => {
//     if (cookies.refreshToken != "") {
//       return cookies.refreshToken;
//     } else {
//       return state.refreshToken;
//     }
//   });

//   const isSignout = useSelector((state) => state.isSignout);

//   // useEffect(() => {
//   //   const get_user = async (token) => {
//   //     // dispatch(showLoading(true));
//   //     const response = await api.axios_infor_user(token);
//   //     if (response.status == 200) {
//   //       setCookie("user", response.data, { path: "/" });
//   //       document.title = response.data.storeId.nameStore;
//   //       dispatch(act_setUser(response.data));
//   //       dispatch(act_setToken(userToken));
//   //       dispatch(act_setRefreshToken(refreshToken));
//   //       // dispatch(showLoading(false));
//   //     } else {
//   //       dispatch(act_setUser({}));
//   //       document.title = "Thông tin tạm thời chưa có.";
//   //       // dispatch(showLoading(false));
//   //       dispatch(act_setToken(""));
//   //       dispatch(act_setRefreshToken(""));
//   //     }
//   //   };

//   //   if (!userToken) {
//   //     dispatch(logout());
//   //     navigate("/login");
//   //   } else {
//   //     get_user(userToken);
//   //   }
//   // }, [dispatch]);

//   const handleLogout = async (token, refreshToken) => {
//     dispatch(showLoading(true));
//     const res = await api.axios_logout(token, refreshToken);
//     if (res.status == 200) {
//       setCookie("token", "", { path: "/" });
//       setCookie("user", "", { path: "/" });
//       setCookie("refreshToken", "", { path: "/" });
//       dispatch(logout());
//       remoteItem("listMenu");
//       remoteItem("openMenu");
//       //   navigate("/login");
//       dispatch(showLoading(false));
//       showToast("__SUCCESS_TYPE", res.messages);
//     } else {
//       dispatch(showLoading(false));
//       showToast("__ERROR_TYPE", res.messages);
//     }
//   };

//   const handleLogoutAll = async (token, refreshToken) => {
//     dispatch(showLoading(true));
//     const res = await api.axios_logout_all(token, refreshToken);
//     if (res.status == 200) {
//       setCookie("token", "", { path: "/" });
//       setCookie("user", "", { path: "/" });
//       setCookie("refreshToken", "", { path: "/" });
//       dispatch(logout());
//       remoteItem("listMenu");
//       remoteItem("openMenu");
//       //   navigate("/login");
//       dispatch(showLoading(false));
//       showToast("__SUCCESS_TYPE", res.messages);
//     } else {
//       dispatch(showLoading(false));
//       showToast("__ERROR_TYPE", res.messages);
//     }
//   };

//   return (
//     // <div className="App">
//     //   <div className="container-home">
//     //     {
//     //       <>
//     //         <div
//     //           className="left-home"
//     //           style={{
//     //             width: open ? "23%" : "0%",
//     //             opacity: open ? "1" : "0.5",
//     //           }}
//     //         >
//     //           <div className="top-tabar" style={{ opacity: open ? "1" : "0" }}>
//     //             <div>
//     //               {user ? (
//     //                 user.storeId.imageStore.length > 0 ? (
//     //                   <img src={Url + user.storeId.imageStore[0].nameImage} />
//     //                 ) : (
//     //                   <img />
//     //                 )
//     //               ) : (
//     //                 <Spinner></Spinner>
//     //               )}
//     //             </div>
//     //             <p
//     //               className="text-top-page"
//     //               style={{ opacity: open ? "1" : "0" }}
//     //             >
//     //               {user ? user.storeId.nameStore : <Spinner></Spinner>}
//     //             </p>
//     //           </div>
//     //           <div className="center-tabar">
//     //             <div style={{ paddingLeft: "5px", paddingRight: "10px" }}>
//     //               <Menu></Menu>
//     //             </div>
//     //           </div>
//     //         </div>
//     //         <div
//     //           className="right-home"
//     //           style={{ width: open ? "77%" : "100%" }}
//     //         >
//     //           <div className="top-right-pages">
//     //             <Navbar className="h-100" bg="light" expand="lg">
//     //               <Container fluid>
//     //                 <Navbar.Brand>
//     //                   <div
//     //                     onClick={() => {
//     //                       setOpen(!open);
//     //                       setItem("openMenu", { open: !open });
//     //                     }}
//     //                     className={!open ? "icon-open-tab" : "icon-close-tab"}
//     //                   >
//     //                     {!open ? (
//     //                       <AiOutlineMenu></AiOutlineMenu>
//     //                     ) : (
//     //                       <AiOutlineMenu></AiOutlineMenu>
//     //                     )}
//     //                   </div>
//     //                 </Navbar.Brand>
//     //                 <Navbar.Brand>
//     //                   <Link className="custom-link" to={"/"}>
//     //                     {" "}
//     //                     {user ? user.storeId.nameStore : "Của hàng 1"}
//     //                   </Link>
//     //                 </Navbar.Brand>
//     //                 <Navbar.Toggle aria-controls="navbarScroll" />
//     //                 <Navbar.Collapse id="navbarScroll">
//     //                   <Nav
//     //                     className="me-auto my-2 my-lg-0"
//     //                     style={{ maxHeight: "100px" }}
//     //                     navbarScroll
//     //                   >
//     //                     <Nav.Link as={Link} className="custom-link" to={"/"}>
//     //                       Notice
//     //                     </Nav.Link>
//     //                   </Nav>
//     //                   <div className="d-flex">
//     //                     <DropdownButton
//     //                       className="border rounded"
//     //                       key="start"
//     //                       id="dropdown-button-drop-start"
//     //                       drop="start"
//     //                       variant="white"
//     //                       title={user ? user.name : "Người dùng 1"}
//     //                     >
//     //                       <Dropdown.Item eventKey="1">
//     //                         <FiInfo style={{ color: "green" }}></FiInfo> Thông
//     //                         tin cá nhân.
//     //                       </Dropdown.Item>
//     //                       <Dropdown.Item eventKey="2">
//     //                         <FiClock style={{ color: "gray" }}></FiClock> Lịch
//     //                         sử thao tác.
//     //                       </Dropdown.Item>
//     //                       <Dropdown.Item
//     //                         eventKey="4"
//     //                         onClick={() =>
//     //                           handleLogout(userToken, refreshToken)
//     //                         }
//     //                       >
//     //                         <div className="custom-link">
//     //                           <FiLogOut style={{ color: "red" }}></FiLogOut>{" "}
//     //                           Đăng xuất
//     //                         </div>
//     //                       </Dropdown.Item>
//     //                       <Dropdown.Item
//     //                         eventKey="5"
//     //                         onClick={() =>
//     //                           handleLogoutAll(userToken, refreshToken)
//     //                         }
//     //                       >
//     //                         <div className="custom-link">
//     //                           <FiLogOut style={{ color: "red" }}></FiLogOut>{" "}
//     //                           Đăng xuất tất cả.
//     //                         </div>
//     //                       </Dropdown.Item>
//     //                     </DropdownButton>
//     //                   </div>
//     //                 </Navbar.Collapse>
//     //               </Container>
//     //             </Navbar>
//     //           </div>
//     //           <div className="content-pages">{<Outlet></Outlet>}</div>
//     //         </div>
//     //       </>
//     //     }
//     //   </div>
//     // </div>
//     <div className="page">
//       <>
//         <AuthProvider>
//           {token && (
//             <>
//               {/* <button type="button" onClick={onLogout}>
//             Sign Out
//           </button> */}
//               <NavLink to="/home">Home</NavLink>
//               <NavLink to="/dashboard">Dashboard</NavLink>
//           <NavLink to="/admin">Admin</NavLink>
//             </>
//           )}
//           <Routes>
//             <Route index element={<Home />} />
//             <Route path="login" element={<Home />} />
//             <Route
//               path="dashboard"
//               element={
//                 <ProtectedRoute>
//                   <Dashboard />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="*" element={<>Lôi</>} />
//           </Routes>
//         </AuthProvider>
//       </>
//     </div>
//   );
// }

// const Navigation = () => {
//   const { onLogout, token } = useAuth();
//   console.log(token, 2);
//   return (
//     <nav>
//       {token && (
//         <>
//           {/* <button type="button" onClick={onLogout}>
//             Sign Out
//           </button> */}
//           {/* <NavLink to="/home">Home</NavLink> */}
//           {/* <NavLink to="/dashboard">Dashboard</NavLink>
//           <NavLink to="/admin">Admin</NavLink> */}
//         </>
//       )}
//     </nav>
//   );
// };

// const Admin = () => {
//   return (
//     <>
//       <h2>Admin (Protected)</h2>
//     </>
//   );
// };

// const Home = () => {
//   const { onLogin } = useAuth();
//   return (
//     <>
//       <Login submitLogin={onLogin}></Login>
//     </>
//   );
// };

// const Dashboard = () => {
//   const { token } = useAuth();
//   return (
//     <>
//       <h2>Dashboard (Protected)</h2>
//       <div>Authenticated as {token}</div>
//     </>
//   );
// };

// const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [token, setToken] = useState(null);

//   const handleLogin = async () => {
//     const token = await fakeAuth();
//     console.log(token);
//     console.log(token);
//     setToken(token);

//     let origin = "/dashboard";
//     if (location.state) {
//       if (location.state.from) {
//         origin = location.state.from.pathname;
//       } else {
//         origin = "/dashboard";
//       }
//     } else {
//       origin = "/dashboard";
//     }
//     navigate(origin);
//   };

//   const handleLogout = () => {
//     setToken(null);
//   };

//   const value = {
//     token,
//     onLogin: handleLogin,
//     onLogout: handleLogout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// const useAuth = () => {
//   return React.useContext(AuthContext);
// };

// const ProtectedRoute = ({ children }) => {
//   const location = useLocation();
//   const { token } = useAuth();

//   if (!token) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   return children;
// };

// export default App;
