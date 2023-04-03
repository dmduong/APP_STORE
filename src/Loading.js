import React from "react";
import PropTypes from "prop-types";
import { Spinner } from "react-bootstrap";
import "./App.css";

const Loading = (props) => {
  return (
    <div id="loading" className="loading">
      <div className="content-loading">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </div>
  );
};

Loading.propTypes = {};

export default Loading;
