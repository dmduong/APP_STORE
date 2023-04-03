import React from "react";
import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";

const StatusDetail = (props) => {
  console.log("helli");
  return <div>{<Outlet></Outlet>}</div>;
};

StatusDetail.propTypes = {};

export default StatusDetail;
