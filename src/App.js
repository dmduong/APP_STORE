import React, { useEffect, useState } from "react";
import "./App.css";
import "../src/pages/home/Home.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import {
  act_setUser,
  freshToken,
  loginIn,
  logout,
  showLoading,
  act_setToken,
  act_setRefreshToken,
} from "../src/redux/action";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import SplitButton from "react-bootstrap/SplitButton";
import { FiGrid, FiXCircle, FiLogOut, FiClock, FiInfo } from "react-icons/fi";
import { AiOutlineMenu } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useCookies, removeCookie } from "react-cookie";
import { api } from "./config/axios";
import Status from "./pages/status/Status";
import { Url } from "../src/config/route";
import { showToast } from "../src/component/toast/Toast";
import Spinner from "./component/spinner/Spinners";
import Dashboard from "./pages/dashboard/Dashboard";
import Spinners from "./component/spinner/Spinners";
import Category from "./pages/category/Category";
import Unit from "./pages/unit/Unit";
import Menu from "./pages/menu/Menu";
import { remoteItem } from "./config/utill";
import Supplier from "./pages/supplier/Supplier";
import Product from "./pages/product/Product";
import AddProduct from "./pages/product/AddProduct";
import Index from "./pages/product/Index";

function App() {
  const [cookies, setCookie] = useCookies(["token", "user", "refreshToken"]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

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

  const isSignout = useSelector((state) => state.isSignout);

  useEffect(() => {
    const get_user = async (token) => {
      // dispatch(showLoading(true));
      const response = await api.axios_infor_user(token);
      if (response.status == 200) {
        setCookie("user", response.data, { path: "/" });
        document.title = response.data.storeId.nameStore;
        dispatch(act_setUser(response.data));
        dispatch(act_setToken(userToken));
        dispatch(act_setRefreshToken(refreshToken));
        // dispatch(showLoading(false));
      } else {
        dispatch(act_setUser({}));
        document.title = "Thông tin tạm thời chưa có.";
        // dispatch(showLoading(false));
        dispatch(act_setToken(""));
        dispatch(act_setRefreshToken(""));
      }
    };

    if (!userToken) {
      dispatch(logout());
      navigate("/login");
    } else {
      get_user(userToken);
    }
  }, [dispatch]);

  const handleLogout = async (token, refreshToken) => {
    dispatch(showLoading(true));
    const res = await api.axios_logout(token, refreshToken);
    if (res.status == 200) {
      setCookie("token", "", { path: "/" });
      setCookie("user", "", { path: "/" });
      setCookie("refreshToken", "", { path: "/" });
      dispatch(logout());
      remoteItem("listMenu");
      navigate("/login");
      dispatch(showLoading(false));
      showToast("__SUCCESS_TYPE", res.messages);
    } else {
      dispatch(showLoading(false));
      showToast("__ERROR_TYPE", res.messages);
    }
  };

  const handleLogoutAll = async (token, refreshToken) => {
    dispatch(showLoading(true));
    const res = await api.axios_logout_all(token, refreshToken);
    if (res.status == 200) {
      setCookie("token", "", { path: "/" });
      setCookie("user", "", { path: "/" });
      setCookie("refreshToken", "", { path: "/" });
      dispatch(logout());
      remoteItem("listMenu");
      navigate("/login");
      dispatch(showLoading(false));
      showToast("__SUCCESS_TYPE", res.messages);
    } else {
      dispatch(showLoading(false));
      showToast("__ERROR_TYPE", res.messages);
    }
  };

  return (
    <div className="App">
      <div className="container-home">
        {isSignout ? (
          <>
            <Routes>
              <Route path="/login" element={<Login></Login>}></Route>
              <Route
                path="*"
                element={
                  <main style={{ padding: "1rem" }}>
                    <p className="text-danger text-center">
                      There's nothing here!
                    </p>
                  </main>
                }
              />
              <Route
                path="/logout"
                element={
                  <main style={{ padding: "1rem" }}>
                    <p className="text-danger text-center mt-1">
                      <Spinners></Spinners>
                    </p>
                  </main>
                }
              ></Route>
            </Routes>
          </>
        ) : userToken !== "" ? (
          <>
            <div
              className="left-home"
              style={{
                width: open ? "23%" : "0%",
                opacity: open ? "1" : "0.5",
              }}
            >
              <div className="top-tabar" style={{ opacity: open ? "1" : "0" }}>
                <div>
                  {user ? (
                    user.storeId.imageStore.length > 0 ? (
                      <img src={Url + user.storeId.imageStore[0].nameImage} />
                    ) : (
                      <img />
                    )
                  ) : (
                    <Spinner></Spinner>
                  )}
                </div>
                <p
                  className="text-top-page"
                  style={{ opacity: open ? "1" : "0" }}
                >
                  {user ? user.storeId.nameStore : <Spinner></Spinner>}
                </p>
              </div>
              <div className="center-tabar">
                <div style={{ paddingLeft: "5px", paddingRight: "10px" }}>
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
                        }}
                        className={!open ? "icon-open-tab" : "icon-close-tab"}
                      >
                        {!open ? (
                          <AiOutlineMenu></AiOutlineMenu>
                        ) : (
                          <AiOutlineMenu></AiOutlineMenu>
                        )}
                      </div>
                    </Navbar.Brand>
                    <Navbar.Brand>
                      <Link className="custom-link" to={"/"}>
                        {" "}
                        {user ? user.storeId.nameStore : <Spinner></Spinner>}
                      </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                      <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: "100px" }}
                        navbarScroll
                      >
                        <Nav.Link as={Link} className="custom-link" to={"/"}>
                          Notice
                        </Nav.Link>
                        {/* <Nav.Link href="#action2">Link</Nav.Link>
                        <NavDropdown title="Link" id="navbarScrollingDropdown">
                          <NavDropdown.Item href="#action3">
                            Action
                          </NavDropdown.Item>
                          <NavDropdown.Item href="#action4">
                            Another action
                          </NavDropdown.Item>
                          <NavDropdown.Divider />
                          <NavDropdown.Item href="#action5">
                            Something else here
                          </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="#" disabled>
                          Link
                        </Nav.Link> */}
                      </Nav>
                      <div className="d-flex">
                        <DropdownButton
                          className="border rounded"
                          key="start"
                          id="dropdown-button-drop-start"
                          drop="start"
                          variant="white"
                          title={user ? user.name : <Spinner></Spinner>}
                        >
                          <Dropdown.Item eventKey="1">
                            <FiInfo style={{ color: "green" }}></FiInfo>{" "}
                            Informations
                          </Dropdown.Item>
                          <Dropdown.Item eventKey="2">
                            <FiClock style={{ color: "gray" }}></FiClock>{" "}
                            History
                          </Dropdown.Item>
                          <Dropdown.Item
                            eventKey="4"
                            onClick={() =>
                              handleLogout(userToken, refreshToken)
                            }
                          >
                            <div className="custom-link">
                              <FiLogOut style={{ color: "red" }}></FiLogOut>{" "}
                              Logout
                            </div>
                          </Dropdown.Item>
                          <Dropdown.Item
                            eventKey="5"
                            onClick={() =>
                              handleLogoutAll(userToken, refreshToken)
                            }
                          >
                            <div className="custom-link">
                              <FiLogOut style={{ color: "red" }}></FiLogOut>{" "}
                              Logout all devices
                            </div>
                          </Dropdown.Item>
                        </DropdownButton>
                      </div>
                    </Navbar.Collapse>
                  </Container>
                </Navbar>
              </div>
              <div className="content-pages">
                <Routes>
                  <Route
                    path="/dashboard"
                    element={<Dashboard></Dashboard>}
                  ></Route>
                  <Route path="/" element={<Home></Home>}></Route>
                  <Route path="/status" element={<Status></Status>}></Route>
                  <Route
                    path="/category"
                    element={<Category></Category>}
                  ></Route>
                  <Route path="/unit" element={<Unit></Unit>}></Route>
                  <Route
                    path="/supplier"
                    element={<Supplier></Supplier>}
                  ></Route>
                  <Route path="/product" element={<Index></Index>}>
                    <Route path="" element={<Product />} />{" "}
                    <Route path="add" element={<AddProduct />} />{" "}
                    <Route path="edit/:id" element={<AddProduct />} />{" "}
                  </Route>
                  <Route
                    path="/login"
                    element={<Dashboard></Dashboard>}
                  ></Route>
                  <Route
                    path="/logout"
                    element={
                      <main style={{ padding: "1rem" }}>
                        <p className="text-danger text-center mt-1">
                          <Spinners></Spinners>
                        </p>
                      </main>
                    }
                  ></Route>
                  <Route
                    path="*"
                    element={
                      <main style={{ padding: "1rem" }}>
                        <p className="text-danger">There's nothing here!</p>
                      </main>
                    }
                  />
                </Routes>
              </div>
            </div>
          </>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default App;
