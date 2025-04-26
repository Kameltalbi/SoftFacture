import React from "react";
import { Menu } from "antd";
import {
  SECONDARY,
  DARK_GRAY,
  PRIMARY,
  WHITE,
} from "../../utils/constants/colors";
import "./style.css";
import { COMPANY_NAME, TAX_ID } from "../../utils/constants/constants";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div
      className="sidebar"
      style={{ backgroundColor: SECONDARY, color: WHITE }}
    >
      {/* Header */}
      <div className="sidebar-header">
        <h1 className="sidebar-title">{COMPANY_NAME}</h1>
        <div className="sidebar-subtitle">
          <span className="sidebar-icon">🏠</span>
          <h2 className="sidebar-mainlink">Tableau de bord</h2>
        </div>
      </div>

      {/* Documents Section */}
      <Menu
        theme="dark"
        mode="vertical"
        style={{ backgroundColor: SECONDARY, border: "none", color: WHITE }}
        onClick={({ key }) => {
          navigate(`/${key}`);
        }}
        items={[
          {
            key: "documents",
            label: (
              <h3
                style={{
                  color: DARK_GRAY,
                  fontSize: "14px",
                  fontWeight: "700",
                  margin: "8px 0",
                }}
              >
                DOCUMENTS
              </h3>
            ),
            type: "group",
            children: [
              {
                key: "factures",
                label: <span className="sidebar-item">💵 Factures</span>,
              },
              {
                key: "devis",
                label: <span className="sidebar-item">📝 Devis</span>,
              },
              {
                key: "bons",
                label: (
                  <span className="sidebar-item">📦 Bons de livraison</span>
                ),
              },
            ],
          },
          {
            key: "fiches",
            label: (
              <h3
                style={{
                  color: DARK_GRAY,
                  fontSize: "14px",
                  fontWeight: "700",
                  margin: "8px 0",
                }}
              >
                FICHES
              </h3>
            ),
            type: "group",
            children: [
              {
                key: "clients",
                label: <span className="sidebar-item">👥 Clients</span>,
              },
              {
                key: "fournisseurs",
                label: (
                  <div
                    className="sidebar-item"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>🏢 Fournisseurs</span>
                  </div>
                ),
              },
            ],
          },
          {
            key: "parametres",
            label: <span className="sidebar-item">⚙️ Paramètres</span>,
          },
        ]}
      />

      {/* Business Info Section */}
      <div
        className="sidebar-support"
        style={{ textAlign: "center", padding: "16px" }}
      >
        <h3
          className="sidebar-business-name"
          style={{
            color: WHITE,
            fontSize: "16px",
            fontWeight: "600",
            marginBottom: "4px",
          }}
        >
          {COMPANY_NAME}
        </h3>
        <p
          className="sidebar-business-id"
          style={{ color: DARK_GRAY, fontSize: "12px" }}
        >
          Matricule Fiscal: {TAX_ID}
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
