import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  TeamOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = ({ collapsed }) => {
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        background: "#001529",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 20,
          fontWeight: "bold",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <img
          src="../../assets/images/logo.png"
          alt="logo"
          style={{ height: 32 }}
        />
      </div>

      {/* Menu Section */}
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["dashboard"]}>
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          Dashboard
        </Menu.Item>
        <SubMenu key="users" icon={<UserOutlined />} title="Users">
          <Menu.Item key="users:1">All Users</Menu.Item>
          <Menu.Item key="users:2">Add User</Menu.Item>
        </SubMenu>
        <SubMenu key="settings" icon={<SettingOutlined />} title="Settings">
          <Menu.Item key="settings:1">Profile</Menu.Item>
          <Menu.Item key="settings:2">Preferences</Menu.Item>
        </SubMenu>
        <SubMenu key="apps" icon={<AppstoreOutlined />} title="Apps">
          <Menu.Item key="apps:1">CRM</Menu.Item>
          <Menu.Item key="apps:2">Analytics</Menu.Item>
        </SubMenu>
        <Menu.Item key="team" icon={<TeamOutlined />}>
          Team
        </Menu.Item>
      </Menu>

      {/* Footer Section */}
      <div
        style={{
          padding: "16px",
          color: "#fff",
          textAlign: "center",
          fontSize: 12,
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        © 2025 MyCompany
      </div>
    </Sider>
  );
};

export default Sidebar;
