import React from "react";
import PropTypes from "prop-types";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRouteAdmin = ({
  isAllowed,
  redirectPath = "roles",
  children,
}) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

ProtectedRouteAdmin.propTypes = {};

export default ProtectedRouteAdmin;
