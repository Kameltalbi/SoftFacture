import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogoutOutlined } from "@ant-design/icons";
import { Grid } from "antd";
import {
  LayoutDashboard,
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
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../container/redux/slices/authSlice";
import { fetchCompanyInfo, selectCompanyInfo } from "../../container/redux/slices/settingsSlice";
import "./style.css";

const { useBreakpoint } = Grid;

const Sidebar = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isTablet = screens.md && !screens.lg;

  const companyInfo = useSelector(selectCompanyInfo);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.company_id && !companyInfo) {
      dispatch(fetchCompanyInfo());
    }
  }, [user, companyInfo, dispatch]);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  }, [isMobile]);

  const companyName = companyInfo?.name || user?.company?.name || "Loading...";
  const taxId = companyInfo?.vatNumber || user?.company?.vat_number || "Loading...";

  const menuGroups = [
    {
      items: [
        {
          key: "dashboard",
          label: t("components.sidebar.dashboard"),
          icon: LayoutDashboard,
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
          key: "bond-commands",
          label: t("components.sidebar.bondCommands"),
          icon: FileText,
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

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={`sidebar ${expanded ? "sidebar-expanded" : "sidebar-collapsed"}`}
      style={{
        height: '100%',
        backgroundColor: '#fff',
        borderRight: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        width: expanded ? (isMobile ? '100%' : isTablet ? '200px' : '250px') : '80px',
        transition: 'width 0.3s ease',
        position: isMobile ? (expanded ? 'fixed' : 'relative') : 'relative',
        zIndex: isMobile ? 1000 : 1,
        top: 0,
        left: 0,
        bottom: 0,
      }}
    >
      {/* Header */}
      <div className="sidebar-header" style={{ 
        padding: isMobile ? '12px' : '16px', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgb(75, 112, 144)',
        color: '#FFFFFF'
      }}>
        <div className="sidebar-header-content" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          overflow: 'hidden',
          color: '#FFFFFF'
        }}>
          {expanded && (
            <span className="sidebar-title" style={{ 
              fontSize: isMobile ? '14px' : '16px', 
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: '#FFFFFF'
            }}>
              {companyName}
            </span>
          )}
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            flexShrink: 0,
            color: '#FFFFFF'
          }}
        >
          {expanded ? <ChevronRight size={isMobile ? 16 : 20} /> : <MenuIcon size={isMobile ? 16 : 20} />}
        </button>
      </div>

      {/* Menu */}
      <div className="sidebar-menu" style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: isMobile ? '12px 0' : '16px 0',
        fontSize: isMobile ? '14px' : '16px'
      }}>
        {menuGroups.map((group, index) => (
          <div key={index}>
            {expanded && group.title && (
              <div className="sidebar-group-title" style={{ 
                padding: isMobile ? '6px 12px' : '8px 16px',
                fontSize: isMobile ? '11px' : '12px',
                color: '#666',
                textTransform: 'uppercase',
                fontWeight: 'bold',
              }}>
                {group.title}
              </div>
            )}
            <ul className="sidebar-menu-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {group.items.map(({ key, label, icon: Icon }) => (
                <li
                  key={key}
                  className={`sidebar-menu-item ${isActive(key) ? "active" : ""}`}
                  onClick={() => {
                    navigate(`/${key}`);
                    if (isMobile) setExpanded(false);
                  }}
                  style={{
                    padding: isMobile ? '6px 12px' : '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '8px' : '12px',
                    cursor: 'pointer',
                    color: isActive(key) ? '#1890ff' : '#666',
                    backgroundColor: isActive(key) ? '#e6f7ff' : 'transparent',
                    transition: 'all 0.3s',
                  }}
                >
                  <Icon size={isMobile ? 16 : 20} />
                  {expanded && <span>{label}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="sidebar-footer" style={{ 
        padding: isMobile ? '12px' : '16px',
        borderTop: '1px solid #f0f0f0',
        backgroundColor: 'rgb(75, 112, 144)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: expanded ? 'column' : 'row',
        justifyContent: expanded ? 'flex-start' : 'center',
        alignItems: expanded ? 'flex-start' : 'center',
        gap: isMobile ? '6px' : '8px'
      }}>
        {expanded ? (
          <>
            <div style={{ 
              width: '100%',
              overflow: 'hidden',
              color: '#FFFFFF'
            }}>
              <div style={{ 
                fontSize: isMobile ? '12px' : '14px', 
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: '#FFFFFF'
              }}>
                {companyName}
              </div>
              <div style={{ 
                fontSize: isMobile ? '10px' : '12px', 
                color: '#FFFFFF',
                opacity: 0.8,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {t("components.sidebar.taxId")}: {taxId}
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#FFFFFF',
                padding: '4px',
                alignSelf: 'flex-end'
              }}
            >
              <LogoutOutlined style={{ fontSize: isMobile ? '16px' : '20px' }} />
            </button>
          </>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#FFFFFF',
              padding: '4px',
            }}
          >
            <LogoutOutlined style={{ fontSize: isMobile ? '16px' : '20px' }} />
          </button>
        )}
      </div>

      {/* Mobile overlay */}
      {isMobile && expanded && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
          onClick={() => setExpanded(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
