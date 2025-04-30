// SettingsScreen.jsx
import React, { useState } from "react";
import { Card, Tabs } from "antd";
import { SettingOutlined, BankOutlined, DollarOutlined, GlobalOutlined, FileTextOutlined } from "@ant-design/icons";
import CompanySettings from "../../components/settings/CompanySettings";
import TaxSettings from "../../components/settings/TaxSettings";
import CurrencySettings from "../../components/settings/CurrencySettings";
import InvoiceNumberSettings from "../../components/settings/InvoiceNumberSettings";

const { TabPane } = Tabs;

const SettingsScreen = () => {
  const [activeKey, setActiveKey] = useState("company");

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Settings</h1>
      </div>

      <Card
        style={{
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          padding: 16,
        }}
      >
        <Tabs
          activeKey={activeKey}
          onChange={(key) => setActiveKey(key)}
          tabBarGutter={32}
          size="large"
        >
          <TabPane
            tab={
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BankOutlined />
                Company
              </span>
            }
            key="company"
          >
            <div style={{ marginTop: 16 }}>
              <CompanySettings />
            </div>
          </TabPane>

          <TabPane
            tab={
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <DollarOutlined />
                Taxes
              </span>
            }
            key="taxes"
          >
            <div style={{ marginTop: 16 }}>
              <TaxSettings />
            </div>
          </TabPane>

          <TabPane
            tab={
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <GlobalOutlined />
                Currencies
              </span>
            }
            key="currencies"
          >
            <div style={{ marginTop: 16 }}>
              <CurrencySettings />
            </div>
          </TabPane>

          <TabPane
            tab={
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FileTextOutlined />
                Invoice Numbers
              </span>
            }
            key="invoice-numbers"
          >
            <div style={{ marginTop: 16 }}>
              <InvoiceNumberSettings />
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SettingsScreen;
