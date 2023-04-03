import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./Login.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { showToast } from "../../component/toast/Toast";
import { useDispatch, useSelector } from "react-redux";
import images from "./pexels-francesco-ungaro-13817453.jpg";
import {
  showLoading,
  loginIn,
  act_setUser,
  act_activeMenu,
  act_setToken,
  act_setRefreshToken,
  logout,
} from "../../redux/action";
import { showConfirm } from "../../component/confirm/Confirm";
import { api } from "../../config/axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useCookies, removeCookie } from "react-cookie";
import { getItem, setItem } from "../../config/utill";
import ButtonCustom from "../../component/button/Button";
import Loading from "../../Loading";

const Login = (props) => {
  const { submitLogin } = props;
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [text, setText] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["token", "user", "refreshToken"]);

  const handleChange = (e) => {
    var target = e.target;
    var name = target.name;
    var value = target.type === "checkbox" ? target.checked : target.value;

    setText({
      ...text,
      [name]: value,
    });
  };

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
    if (!userToken) {
      dispatch(logout());
      navigate("/login");
    } else {
      navigate("/admin/dashboard");
    }

    setInterval(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  const listMenu = useSelector((state) => {
    if (!getItem("listMenu")) {
      return state.listMenu;
    } else {
      return getItem("listMenu");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    submitLogin(text);
  };

  return (
    <>
      {isLoading ? (
        <Loading></Loading>
      ) : (
        <>
          {" "}
          <div className="page-content-login">
            <div className="page-login">
              <div className="page_top">
                <Form className="form-login" onSubmit={handleSubmit}>
                  <div className="content-top">
                    <h2 className="opcity-content text-center text-white">
                      Đăng nhập vào hệ thống
                    </h2>
                  </div>
                  <div className="content-bottom">
                    <div className="content-input-login">
                      <div className="w-100 p-2">
                        <Form.Group
                          className="mb-3 text-white w-100"
                          controlId="formBasicEmail"
                        >
                          <Form.Label>
                            <b>Tên người dùng</b>
                          </Form.Label>
                          <Form.Control
                            className="text-input-css p-3"
                            type="text"
                            name="email"
                            onChange={handleChange}
                            value={text.email}
                            placeholder="Account"
                          />
                        </Form.Group>

                        <Form.Group
                          className="mb-3 text-white w-100"
                          controlId="formBasicPassword"
                        >
                          <Form.Label>
                            <b>Mật khẩu</b>
                          </Form.Label>
                          <Form.Control
                            className="text-input-css p-3"
                            type="password"
                            name="password"
                            onChange={handleChange}
                            value={text.password}
                            placeholder="Password"
                          />
                        </Form.Group>

                        <Form.Group
                          className="mb-3 text-white"
                          controlId="formBasicCheckbox"
                        >
                          <Form.Check
                            type="checkbox"
                            style={{
                              color: "white",
                            }}
                            label="Nhớ mật khẩu"
                          />
                        </Form.Group>
                        <ButtonCustom
                          title={"Đăng nhập"}
                          className={"p-3 w-100"}
                          color={""}
                          type={"submit"}
                          style={{
                            backgroundColor: " rgba(150, 150, 150, 0.5) ",
                            fontWeight: "bold",
                            color: "white",
                          }}
                        ></ButtonCustom>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

Login.propTypes = {
  submitLogin: PropTypes.func,
};

Login.defaultProps = {
  submitLogin: null,
};

export default Login;
