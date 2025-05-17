// components/PrivateLayout.jsx
import React, { useState } from "react";
import { Layout } from "antd";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import { LIGHT_BLUE, LIGHT_GRAY, WHITE } from "../utils/constants/colors";

const { Content } = Layout;

const PrivateLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <style>
        {`
          html, body, #root {
            margin: 0;
            padding: 0;

          }
        `}
      </style>
      <div
        style={{
          display: "flex",
          margin: 0,
          backgroundColor: "red",
          position:"absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div style={{ flex: 1, padding: "20px", backgroundColor : LIGHT_GRAY}}>
          {children}
        </div>
      </div>
    </>
  );
};

export default PrivateLayout;
