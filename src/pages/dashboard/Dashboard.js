import React from "react";

const Dashboard = (props) => {
  const { token } = props;
  return (
    <>
      <h2>Dashboard (Protected)</h2>
      <div>Authenticated as {token}</div>
    </>
  );
};

export default Dashboard;
