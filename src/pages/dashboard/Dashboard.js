import React, { useEffect } from "react";
import { setTitle, __showLoading } from "../../config/utill";

const Dashboard = (props) => {
  const { token } = props;

  useEffect(() => {
    setTitle(props.user.storeId.nameStore, props.title);
  }, []);

  return (
    <>
      <h2>Dashboard (Protected)</h2>
      <div>Authenticated as {token}</div>
    </>
  );
};

export default Dashboard;
