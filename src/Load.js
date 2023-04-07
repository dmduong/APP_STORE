import React from "react";
import PropTypes from "prop-types";
import { Spinner } from "react-bootstrap";
import "./App.css";

const Load = (props) => {
  return (
    <div id="load" className="loading hide">
      <div className="content-loading">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </div>
  );
};

Load.propTypes = {};

export default Load;
