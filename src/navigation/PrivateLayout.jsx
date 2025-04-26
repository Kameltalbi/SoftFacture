// components/PrivateLayout.jsx
import React, { useState } from "react";
import { Layout } from "antd";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

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
            height: 100%;
          }
        `}
      </style>
      <div
        style={{
          display: "flex",
          height: "100vh",
          margin: 0,
          backgroundColor: "red",
        }}
      >
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div style={{ flex: 1, padding: "20px", backgroundColor: "#F0F2F5" }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default PrivateLayout;
