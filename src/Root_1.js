import React, { useEffect, useState } from "react";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";
import App from "./App";
import "./App.css";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  Routes,
  useNavigate,
} from "react-router-dom";
import PageError from "./pageError";
import Status from "./pages/status/Status";
import Home from "./pages/home/Home";
import Category from "./pages/category/Category";
import Unit from "./pages/unit/Unit";
import Supplier from "./pages/supplier/Supplier";
import Product from "./pages/product/Product";
import Login from "./pages/login/Login";
import { getItem, isset, remoteItem, setItem } from "./config/utill";
import { useCookies } from "react-cookie";
import { api } from "./config/axios";
import Dashboard from "./pages/dashboard/Dashboard";
import Spinners from "./component/spinner/Spinners";
import Menu from "./pages/menu/Menu";
import {
  Container,
  Dropdown,
  DropdownButton,
  Nav,
  Navbar,
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
import { showToast } from "./component/toast/Toast";
import ProtectedRoute from "./ProtectedRoute";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     errorElement: <PageError></PageError>,
//     children: [
//       {
//         path: "dashboard/",
//         element: <Home />,
//       },
//       {
//         path: "status/",
//         element: <Status />,
//       },
//       {
//         path: "category/",
//         element: <Category />,
//       },
//       {
//         path: "unit/",
//         element: <Unit />,
//       },
//       {
//         path: "supplier/",
//         element: <Supplier />,
//       },
//       {
//         path: "product/",
//         element: <Product />,
//       },
//       {
//         path: "login",
//         element: <Login />,
//         errorElement: <PageError></PageError>,
//       },
//     ],
//   },
// ]);

const Root = (props) => {
  const isLoading = useSelector((state) => state.isLoading);
  const [user1, setUser1] = useState(null);

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
  }, [dispatch]);

  // const handleLogout = () => setUser1(null);
  const handleLogin = () => {
    setUser1({
      id: "1",
      name: "robin",
      permissions: ["analyze"],
      roles: ["admin"],
    });
    console.log("hello");
  };

  const listMenu = useSelector((state) => {
    if (!getItem("listMenu")) {
      return state.listMenu;
    } else {
      return getItem("listMenu");
    }
  });

  const fncLoginAccount = async (text) => {
    const response = await api.axios_login(text);
    console.log(response);
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
      // navigate("/dashboard", { replace: true });
    } else if (response.status == 401) {
      // navigate("/login", { replace: true });
      showToast("__ERROR_TYPE", response.messages);
    } else {
      // navigate("/login", { replace: true });
      showToast("__ERROR_TYPE", response.data);
    }
  };

  const handleLogout = async (token, refreshToken) => {
    const res = await api.axios_logout(token, refreshToken);
    if (res.status == 200) {
      setCookie("token", "", { path: "/" });
      setCookie("user", "", { path: "/" });
      setCookie("refreshToken", "", { path: "/" });
      dispatch(logout());
      remoteItem("listMenu");
      remoteItem("openMenu");
      // navigate("/login");
      showToast("__SUCCESS_TYPE", res.messages);
    } else {
      showToast("__ERROR_TYPE", res.messages);
    }
  };

  const handleLogoutAll = async (token, refreshToken) => {
    const res = await api.axios_logout_all(token, refreshToken);
    if (res.status == 200) {
      setCookie("token", "", { path: "/" });
      setCookie("user", "", { path: "/" });
      setCookie("refreshToken", "", { path: "/" });
      dispatch(logout());
      remoteItem("listMenu");
      remoteItem("openMenu");
      // navigate("/login");
      showToast("__SUCCESS_TYPE", res.messages);
    } else {
      showToast("__ERROR_TYPE", res.messages);
    }
  };

  console.log(userToken);

  return (
    <div className="page">
      {
        // <>
        //   <div className="App">
        //     <div className="container-home">
        //       {
        //         <>
        //           <div
        //             className="left-home"
        //             style={{
        //               width: open ? "23%" : "0%",
        //               opacity: open ? "1" : "0.5",
        //             }}
        //           >
        //             <div
        //               className="top-tabar"
        //               style={{ opacity: open ? "1" : "0" }}
        //             >
        //               <div>
        //                 {user ? (
        //                   user.storeId.imageStore.length > 0 ? (
        //                     <img
        //                       src={Url + user.storeId.imageStore[0].nameImage}
        //                     />
        //                   ) : (
        //                     <img />
        //                   )
        //                 ) : (
        //                   <Spinners></Spinners>
        //                 )}
        //               </div>
        //               <p
        //                 className="text-top-page"
        //                 style={{ opacity: open ? "1" : "0" }}
        //               >
        //                 {user ? user.storeId.nameStore : <Spinner></Spinner>}
        //               </p>
        //             </div>
        //             <div className="center-tabar">
        //               <div style={{ paddingLeft: "5px", paddingRight: "10px" }}>
        //                 <Menu></Menu>
        //               </div>
        //             </div>
        //           </div>
        //           <div
        //             className="right-home"
        //             style={{ width: open ? "77%" : "100%" }}
        //           >
        //             <div className="top-right-pages">
        //               <Navbar className="h-100" bg="light" expand="lg">
        //                 <Container fluid>
        //                   <Navbar.Brand>
        //                     <div
        //                       onClick={() => {
        //                         setOpen(!open);
        //                         setItem("openMenu", { open: !open });
        //                       }}
        //                       className={
        //                         !open ? "icon-open-tab" : "icon-close-tab"
        //                       }
        //                     >
        //                       {!open ? (
        //                         <AiOutlineMenu></AiOutlineMenu>
        //                       ) : (
        //                         <AiOutlineMenu></AiOutlineMenu>
        //                       )}
        //                     </div>
        //                   </Navbar.Brand>
        //                   <Navbar.Brand>
        //                     <Link className="custom-link" to={"/"}>
        //                       {" "}
        //                       {user ? user.storeId.nameStore : "Của hàng 1"}
        //                     </Link>
        //                   </Navbar.Brand>
        //                   <Navbar.Toggle aria-controls="navbarScroll" />
        //                   <Navbar.Collapse id="navbarScroll">
        //                     <Nav
        //                       className="me-auto my-2 my-lg-0"
        //                       style={{ maxHeight: "100px" }}
        //                       navbarScroll
        //                     >
        //                       <Nav.Link
        //                         as={Link}
        //                         className="custom-link"
        //                         to={"/"}
        //                       >
        //                         Notice
        //                       </Nav.Link>
        //                     </Nav>
        //                     <div className="d-flex">
        //                       <DropdownButton
        //                         className="border rounded"
        //                         key="start"
        //                         id="dropdown-button-drop-start"
        //                         drop="start"
        //                         variant="white"
        //                         title={user ? user.name : "Người dùng 1"}
        //                       >
        //                         <Dropdown.Item eventKey="1">
        //                           <FiInfo style={{ color: "green" }}></FiInfo>{" "}
        //                           Thông tin cá nhân.
        //                         </Dropdown.Item>
        //                         <Dropdown.Item eventKey="2">
        //                           <FiClock style={{ color: "gray" }}></FiClock>{" "}
        //                           Lịch sử thao tác.
        //                         </Dropdown.Item>
        //                         <Dropdown.Item
        //                           eventKey="4"
        //                           onClick={() =>
        //                             handleLogout(userToken, refreshToken)
        //                           }
        //                         >
        //                           <div className="custom-link">
        //                             <FiLogOut
        //                               style={{ color: "red" }}
        //                             ></FiLogOut>{" "}
        //                             Đăng xuất
        //                           </div>
        //                         </Dropdown.Item>
        //                         <Dropdown.Item
        //                           eventKey="5"
        //                           onClick={() =>
        //                             handleLogoutAll(userToken, refreshToken)
        //                           }
        //                         >
        //                           <div className="custom-link">
        //                             <FiLogOut
        //                               style={{ color: "red" }}
        //                             ></FiLogOut>{" "}
        //                             Đăng xuất tất cả.
        //                           </div>
        //                         </Dropdown.Item>
        //                       </DropdownButton>
        //                     </div>
        //                   </Navbar.Collapse>
        //                 </Container>
        //               </Navbar>
        //             </div>
        //             <div className="content-pages">
        //               <Routes>
        //                 <Route
        //                   element={<ProtectedRoute isAllowed={!!userToken} />}
        //                 >
        //                   <Route
        //                     index
        //                     path="dashboard"
        //                     element={<Dashboard />}
        //                   />
        //                   <Route path="/" element={<Home />} />
        //                   <Route path="status" element={<Status />} />
        //                   <Route path="category" element={<Category />} />
        //                   <Route path="unit" element={<Unit />} />
        //                 </Route>
        //                 <Route
        //                   path="login"
        //                   element={
        //                     <Login submitLogin={fncLoginAccount}></Login>
        //                   }
        //                 />
        //                 {/* <Route
        //                   path="dashboard"
        //                   element={
        //                     <ProtectedRoute
        //                       redirectPath="/dashboard"
        //                       isAllowed={!!userToken}
        //                     >
        //                       <Dashboard />
        //                     </ProtectedRoute>
        //                   }
        //                 /> */}
        //                 <Route
        //                   path="*"
        //                   element={<p>There's nothing here: 404!</p>}
        //                 />
        //               </Routes>
        //             </div>
        //           </div>
        //         </>
        //       }
        //     </div>
        //   </div>
        // </>
      }
      {true ? (
        <div id="loading" className="loading">
          <div className="content-loading">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </div>
      ) : (
        ""
      )}
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
};

// const Navigation = () => (
//   <nav>
//     <Link to="/">Home</Link>
//     <Link to="/dashboard">dashboard</Link>
//     <Link to="/status">status</Link>
//     <Link to="/category">status</Link>
//     <Link to="/unit">status</Link>
//   </nav>
// );

export default Root;
