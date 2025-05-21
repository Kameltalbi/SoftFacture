import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogoutOutlined } from "@ant-design/icons";
import {
  Grid,
  Home,
  FileText,
  FileSpreadsheet,
  Package2,
  Boxes,
  Package,
  Warehouse,
  Users,
  Settings,
  Menu as MenuIcon,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector to access Redux state
import "./style.css";
import { logout } from "../../container/redux/slices/authSlice";

const Sidebar = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Access the company info from the Redux store
  const companyInfo = useSelector((state) => state.settings.company);

  // Fallback to default values if company info is not available
  const companyName = companyInfo?.name || "InvoiceFlow SARL";
  const taxId = companyInfo?.vatNumber || "FR12345678900";

  const menuGroups = [
    {
      items: [
        {
          key: "dashboard",
          label: t("components.sidebar.dashboard"), // Assuming you have the translation for 'dashboard'
          icon: LayoutDashboard, // You can choose an icon for the dashboard
        },
      ],
    },
    {
      title: t("components.sidebar.documents"),
      items: [
        {
          key: "invoices",
          label: t("components.sidebar.invoices"),
          icon: FileText,
        },
        {
          key: "quotes",
          label: t("components.sidebar.quotes"),
          icon: FileSpreadsheet,
        },
        {
          key: "deliveryNotes",
          label: t("components.sidebar.deliveryNotes"),
          icon: Package2,
        },
      ],
    },
    {
      title: t("components.sidebar.sheets"),
      items: [
        { key: "clients", label: t("components.sidebar.clients"), icon: Users },
        {
          key: "suppliers",
          label: t("components.sidebar.suppliers"),
          icon: Users,
        },
      ],
    },
    {
      title: t("components.sidebar.products"),
      items: [
        {
          key: "categories",
          label: t("components.sidebar.categories"),
          icon: Boxes,
        },
        {
          key: "products",
          label: t("components.sidebar.products"),
          icon: Package,
        },
        {
          key: "stock",
          label: t("components.sidebar.stock"),
          icon: Warehouse,
        },
      ],
    },
    {
      title: t("components.sidebar.settings"),
      items: [
        {
          key: "settings",
          label: t("components.sidebar.settingsLabel"),
          icon: Settings,
        },
      ],
    },
  ];

  const toggleSidebar = () => setExpanded((prev) => !prev);
  const isActive = (path) => location.pathname === `/${path}`;

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // Navigate to login page (or wherever you want)
  };

  return (
    <div
      className={`sidebar ${
        expanded ? "sidebar-expanded" : "sidebar-collapsed"
      }`}
    >
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-header-content">
          {expanded && (
            <>
              <Home className="sidebar-icon" />
              <span className="sidebar-title">{companyName}</span>
            </>
          )}
        </div>
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          {expanded ? <ChevronRight /> : <MenuIcon />}
        </button>
      </div>

      {/* Menu */}
      <div className="sidebar-menu">
        {menuGroups.map((group, index) => (
          <div key={index}>
            {expanded && (
              <div className="sidebar-group-title">{group.title}</div>
            )}
            <ul className="sidebar-menu-list">
              {group.items.map(({ key, label, icon: Icon }) => (
                <li
                  key={key}
                  className={`sidebar-menu-item ${
                    isActive(key) ? "active" : ""
                  }`}
                  onClick={() => navigate(`/${key}`)}
                >
                  <Icon className="sidebar-item-icon" />
                  {expanded && <span>{label}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        {expanded ? (
          <>
            <div style={{ textAlign: "left" }}>
              <div className="sidebar-footer-company">{companyName}</div>
              <div className="sidebar-footer-id">
                {t("components.sidebar.taxId")}: {taxId}
              </div>
            </div>
            <button
              className="sidebar-logout-button"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogoutOutlined style={{ fontSize: "20px" }} />
            </button>
          </>
        ) : (
          <button
            className="sidebar-logout-button"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogoutOutlined style={{ fontSize: "22px" }} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
