import React from 'react'
import { Table, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ActionsDropdown from "../../components/common/ActionsDropdown";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { PRIMARY } from "../../utils/constants/colors";
import { deleteSupplier } from '../../container/redux/slices/supplierSlice';

const SupplierScreen = () => {
    const { t } = useTranslation();
    const { supplier } = useSelector((state) => state.supplier);
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const handleDelete = (id) => {
      dispatch(deleteSupplier(id));
    };
  
    const columns = [
      { title: t("components.clientForm.fullNameLabel"), dataIndex: "fullName", key: "fullName" },
      { title: t("components.clientForm.emailLabel"), dataIndex: "email", key: "email" },
      { title: t("components.clientForm.phoneLabel"), dataIndex: "phone", key: "phone" },
      { title: t("components.clientForm.companyLabel"), dataIndex: "company", key: "company" },
      { title: t("components.clientForm.fiscalIdLabel"), dataIndex: "fiscalId", key: "fiscalId" },
      {
        title: "",
        key: "actions",
        width:50,
        render: (_, record) => (
          <ActionsDropdown
            menuItems={[
              {
                key: "edit",
                label: t("screens.supplier.actions.edit"),
                icon: <EditOutlined />,
                onClick: () => navigate(`/suppliers/edit/${record.id}`),
              },
              {
                key: "delete",
                label: t("screens.supplier.actions.delete"),
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
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>{t("screens.supplier.title")}</h1>
          <Button type="primary"  onClick={() => navigate("/suppliers/create")} style={{
            backgroundColor: PRIMARY,
          }}>
            {t("screens.supplier.addNew")}
          </Button>
        </div>
  
        <Table dataSource={supplier} columns={columns} rowKey="id" />
      </div>
    );
  };
  

export default SupplierScreen