import styled from "@emotion/styled";
import { Card, Tabs, Grid } from "antd";
import {
  BankOutlined,
  DollarOutlined,
  GlobalOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import CompanySettings from "../../components/settings/CompanySettings";
import TaxSettings from "../../components/settings/TaxSettings";
import CurrencySettings from "../../components/settings/CurrencySettings";
import InvoiceNumberSettings from "../../components/settings/InvoiceNumberSettings";
import { PRIMARY } from "../../utils/constants/colors";

const { useBreakpoint } = Grid;
const { TabPane } = Tabs;

const StyledTabsWrapper = styled.div`
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: ${PRIMARY} !important;
  }
  .ant-tabs-tab:hover .ant-tabs-tab-btn {
    color: ${PRIMARY} !important;
  }
  .ant-tabs-ink-bar {
    background-color: ${PRIMARY} !important;
  }
`;

const SettingsScreen = () => {
  const [activeKey, setActiveKey] = useState("company");
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <div style={{ padding: isMobile ? 16 : 24 }}>
      <div style={{ marginBottom: isMobile ? 16 : 24 }}>
        <h1 style={{ 
          fontSize: isMobile ? 20 : 24, 
          fontWeight: "bold",
          margin: 0 
        }}>
          Settings
        </h1>
      </div>

      <Card
        style={{
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          padding: isMobile ? 12 : 16,
        }}
      >
        <StyledTabsWrapper>
          <Tabs 
            activeKey={activeKey} 
            onChange={setActiveKey} 
            size={isMobile ? "middle" : "large"}
            tabPosition={isMobile ? "top" : "left"}
            style={{ 
              minHeight: isMobile ? 'auto' : 400,
              overflow: isMobile ? 'visible' : 'hidden'
            }}
          >
            <TabPane
              tab={
                <span style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 8,
                  fontSize: isMobile ? 14 : 16
                }}>
                  <BankOutlined />
                  Company
                </span>
              }
              key="company"
            >
              <div style={{ marginTop: isMobile ? 12 : 16 }}>
                <CompanySettings />
              </div>
            </TabPane>

            <TabPane
              tab={
                <span style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 8,
                  fontSize: isMobile ? 14 : 16
                }}>
                  <DollarOutlined />
                  Taxes
                </span>
              }
              key="taxes"
            >
              <div style={{ marginTop: isMobile ? 12 : 16 }}>
                <TaxSettings />
              </div>
            </TabPane>

            <TabPane
              tab={
                <span style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 8,
                  fontSize: isMobile ? 14 : 16
                }}>
                  <GlobalOutlined />
                  Currencies
                </span>
              }
              key="currencies"
            >
              <div style={{ marginTop: isMobile ? 12 : 16 }}>
                <CurrencySettings />
              </div>
            </TabPane>

            <TabPane
              tab={
                <span style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 8,
                  fontSize: isMobile ? 14 : 16
                }}>
                  <FileTextOutlined />
                  Invoice Numbers
                </span>
              }
              key="invoice-numbers"
            >
              <div style={{ marginTop: isMobile ? 12 : 16 }}>
                <InvoiceNumberSettings />
              </div>
            </TabPane>
          </Tabs>
        </StyledTabsWrapper>
      </Card>
    </div>
  );
};

export default SettingsScreen;
