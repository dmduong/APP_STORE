import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Login.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { showToast } from "../../component/toast/Toast";
import { useDispatch, useSelector } from "react-redux";
import {
  showLoading,
  loginIn,
  act_setUser,
  act_activeMenu,
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

const Login = (props) => {
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

  const listMenu = useSelector((state) => {
    if (!getItem("listMenu")) {
      return state.listMenu;
    } else {
      return getItem("listMenu");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(showLoading(true));
    const response = await api.axios_login(text);
    if (!response) {
      showToast("__ERROR_TYPE", response.messages);
      dispatch(showLoading(false));
    } else if (response.status == 200) {
      showToast("__SUCCESS_TYPE", response.messages);
      dispatch(loginIn(response.token, response.resfreshToken));
      setCookie("token", response.token, { path: "/" });
      setCookie("user", response.data, { path: "/" });
      setCookie("refreshToken", response.resfreshToken, { path: "/" });
      dispatch(act_setUser(response.data));
      const list = [...listMenu];
      list[0].active = true;
      setItem("listMenu", list);
      dispatch(act_activeMenu(list));
      navigate("/dashboard", { replace: true });
      dispatch(showLoading(false));
    } else if (response.status == 401) {
      navigate("/login", { replace: true });
      showToast("__ERROR_TYPE", response.messages);
      dispatch(showLoading(false));
    } else {
      navigate("/login", { replace: true });
      showToast("__ERROR_TYPE", response.data);
      dispatch(showLoading(false));
    }
  };

  return (
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
              <Form.Group
                className="mb-3 text-white w-100"
                controlId="formBasicEmail"
              >
                <Form.Label>Account</Form.Label>
                <Form.Control
                  className="text-input-css"
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
                <Form.Label>Password</Form.Label>
                <Form.Control
                  className="text-input-css"
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
              <Button className="bg-none w-100 mt-4 btn" type="submit">
                Đăng nhập
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {};

export default Login;
