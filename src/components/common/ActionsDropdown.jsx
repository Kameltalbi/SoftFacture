// src/components/common/ActionsDropdown.jsx
import { Dropdown, Menu, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const ActionsDropdown = ({ menuItems }) => {
  const menu = (
    <Menu
      items={menuItems.map((item) => ({
        key: item.key,
        label: (
          <span
            onClick={item.onClick}
            style={{ color: item.danger ? 'red' : 'inherit' }}
          >
            {item.icon && (
              <span style={{ marginRight: 8 }}>
                {item.icon}
              </span>
            )}
            {item.label}
          </span>
        ),
      }))}
    />
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button type="text" icon={<MoreOutlined style={{ fontSize: '20px' }} />} />
    </Dropdown>
  );
};

export default ActionsDropdown;
