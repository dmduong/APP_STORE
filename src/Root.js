import React from "react";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "react-bootstrap/Spinner";
import {useSelector } from "react-redux";
import App from "./App";

const Root = (props) => {

  const isLoading = useSelector(state => state.isLoading);
  return (
    <div className="page">
      <App />
      {isLoading ? (
        <div className="loading">
          <div className="content-loading">
            <Spinner animation="grow" variant="success" size="sm" />
            <Spinner animation="grow" variant="danger" size="sm" />
            <Spinner animation="grow" variant="warning" size="sm" />
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
        limit={1}
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

export default Root;
