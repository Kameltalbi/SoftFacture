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
    <Layout style={{ minHeight: '100vh', margin: 0, padding: 0 }}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <Content style={{ 
          flex: 1, 
          padding: '20px', 
          backgroundColor: LIGHT_GRAY,
          overflow: 'auto'
        }}>
          {children}
        </Content>
      </div>
    </Layout>
  );
};

export default PrivateLayout;
