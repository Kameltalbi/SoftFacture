import React from "react";
import { Layout, Menu, Grid } from "antd";
import {
  ShopOutlined,
  DollarOutlined,
  FileTextOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import * as Colors from "../../utils/constants/colors";

const { useBreakpoint } = Grid;
const { Sider, Content } = Layout;

const SettingsLayout = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const menuItems = [
    {
      key: "company",
      icon: <ShopOutlined />,
      label: t("components.settingsLayout.company"),
    },
    {
      key: "currency",
      icon: <DollarOutlined />,
      label: t("components.settingsLayout.currency"),
    },
    {
      key: "invoice",
      icon: <FileTextOutlined />,
      label: t("components.settingsLayout.invoice"),
    },
    {
      key: "tax",
      icon: <PercentageOutlined />,
      label: t("components.settingsLayout.tax"),
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(`/settings/${key}`);
  };

  const getSelectedKey = () => {
    const path = location.pathname;
    const match = path.match(/\/settings\/([^/]+)/);
    return match ? match[1] : "company";
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: Colors.WHITE }}>
      <Sider
        width={isMobile ? "100%" : 250}
        style={{
          backgroundColor: Colors.WHITE,
          borderRight: `1px solid ${Colors.LIGHT_GRAY}`,
          position: isMobile ? "static" : "fixed",
          height: isMobile ? "auto" : "100vh",
          left: 0,
          top: 0,
          zIndex: 1000,
        }}
      >
        <Menu
          mode={isMobile ? "horizontal" : "inline"}
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            border: "none",
            backgroundColor: Colors.WHITE,
            fontSize: isMobile ? 14 : 16,
          }}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: isMobile ? 0 : 250,
          backgroundColor: Colors.WHITE,
          minHeight: "100vh",
        }}
      >
        <Content
          style={{
            padding: isMobile ? 0 : 24,
            backgroundColor: Colors.WHITE,
            minHeight: "100vh",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SettingsLayout; 