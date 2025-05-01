import React from "react";
import { Table, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { deleteClient } from "../../container/redux/slices/clientsSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ActionsDropdown from "../../components/common/ActionsDropdown";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { PRIMARY } from "../../utils/constants/colors";

const ClientScreen = () => {
  const { t } = useTranslation();
  const { clients } = useSelector((state) => state.clients);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = (id) => {
    dispatch(deleteClient(id));
  };

  const columns = [
    { title: t("components.clientForm.fullNameLabel"), dataIndex: "fullName", key: "fullName" },
    { title: t("components.clientForm.emailLabel"), dataIndex: "email", key: "email" },
    { title: t("components.clientForm.phoneLabel"), dataIndex: "phone", key: "phone" },
    { title: t("components.clientForm.companyLabel"), dataIndex: "company", key: "company" },
    { title: t("components.clientForm.fiscalIdLabel"), dataIndex: "fiscalId", key: "fiscalId" },
    {
      title: t("screens.client.actions.edit"),
      key: "actions",
      render: (_, record) => (
        <ActionsDropdown
          menuItems={[
            {
              key: "edit",
              label: t("screens.client.actions.edit"),
              icon: <EditOutlined />,
              onClick: () => navigate(`/clients/edit/${record.id}`),
            },
            {
              key: "delete",
              label: t("screens.client.actions.delete"),
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => handleDelete(record.id),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>{t("screens.client.title")}</h1>
        <Button type="primary"  onClick={() => navigate("/clients/create")} style={{
          backgroundColor: PRIMARY,
        }}>
          {t("screens.client.addNew")}
        </Button>
      </div>

      <Table dataSource={clients} columns={columns} rowKey="id" />
    </div>
  );
};

export default ClientScreen;
