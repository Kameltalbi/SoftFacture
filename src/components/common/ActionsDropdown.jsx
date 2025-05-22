import React from "react";
import { Dropdown, Button, Space, Grid } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

const ActionsDropdown = ({ menuItems }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const items = menuItems.map((item) => ({
    key: item.key,
    label: (
      <span
        onClick={item.onClick}
        style={{ 
          color: item.danger ? "red" : "inherit",
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 0'
        }}
      >
        {item.icon && <span>{item.icon}</span>}
        {item.label}
      </span>
    ),
  }));

  // For mobile, show a horizontal button group instead of dropdown
  if (isMobile) {
    return (
      <Space size={8} style={{ width: '100%', justifyContent: 'flex-end' }}>
        {menuItems.slice(0, 3).map((item) => (
          <Button
            key={item.key}
            type="text"
            icon={item.icon}
            onClick={item.onClick}
            danger={item.danger}
            style={{ padding: '4px 8px' }}
          />
        ))}
        {menuItems.length > 3 && (
          <Dropdown
            menu={{ items: items.slice(3) }}
            trigger={["click"]}
          >
            <Button
              type="text"
              icon={<MoreOutlined style={{ fontSize: "20px" }} />}
            />
          </Dropdown>
        )}
      </Space>
    );
  }

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <Button
        type="text"
        icon={<MoreOutlined style={{ fontSize: "20px" }} />}
      />
    </Dropdown>
  );
};

export default ActionsDropdown;
