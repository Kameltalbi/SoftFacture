import React, { useEffect } from "react";
import { Table, Button, message, Spin, Alert, Grid, Row, Col, Space } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { deleteClient, fetchClients } from "../../container/redux/slices/clientsSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ActionsDropdown from "../../components/common/ActionsDropdown";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { PRIMARY } from "../../utils/constants/colors";

const { useBreakpoint } = Grid;

const ClientScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const { clients, loading, error } = useSelector((state) => state.clients);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteClient(id)).unwrap();
      message.success(t("screens.client.messages.deleteSuccess"));
    } catch (error) {
      message.error(error || t("screens.client.messages.deleteError"));
    }
  };

  const columns = [
    { 
      title: t("components.clientForm.nameLabel"), 
      dataIndex: "nom", 
      key: "nom",
      sorter: (a, b) => a.nom.localeCompare(b.nom),
      ellipsis: true,
      width: isMobile ? undefined : 200,
    },
    { 
      title: t("components.clientForm.emailLabel"), 
      dataIndex: "email", 
      key: "email",
      sorter: (a, b) => (a.email || '').localeCompare(b.email || ''),
      ellipsis: true,
      width: isMobile ? undefined : 200,
    },
    { 
      title: t("components.clientForm.phoneLabel"), 
      dataIndex: "telephone", 
      key: "telephone",
      sorter: (a, b) => a.telephone.localeCompare(b.telephone),
      ellipsis: true,
      width: isMobile ? undefined : 150,
    },
    { 
      title: t("components.clientForm.fiscalIdLabel"), 
      dataIndex: "n_fiscal", 
      key: "n_fiscal",
      sorter: (a, b) => (a.n_fiscal || '').localeCompare(b.n_fiscal || ''),
      ellipsis: true,
      width: isMobile ? undefined : 150,
    },
    { 
      title: t("components.clientForm.addressLabel"), 
      dataIndex: "adresse", 
      key: "adresse",
      ellipsis: true,
      width: isMobile ? undefined : 250,
    },
    {
      title: "",
      key: "actions",
      width: isMobile ? 80 : 100,
      fixed: 'right',
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

  if (loading && !clients.length) {
    return (
      <div style={{ textAlign: 'center', padding: isMobile ? 24 : 50 }}>
        <Spin size="large" tip={t("common.loading")} />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message={t("common.error")}
        description={error}
        type="error"
        showIcon
        action={
          <Button size={isMobile ? "small" : "middle"} type="primary" onClick={() => dispatch(fetchClients())}>
            {t("common.retry")}
          </Button>
        }
        style={{ margin: isMobile ? 16 : 24 }}
      />
    );
  }

  return (
    <div style={{ padding: isMobile ? 16 : 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: isMobile ? 16 : 24 }}>
        <Col>
          <h1 style={{ 
            fontSize: isMobile ? 20 : 24, 
            fontWeight: "bold",
            margin: 0 
          }}>
            {t("screens.client.title")}
          </h1>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/clients/create')}
            style={{ backgroundColor: PRIMARY }}
            size={isMobile ? "middle" : "large"}
          >
            {t("screens.client.actions.create")}
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={clients}
        rowKey="id"
        loading={loading}
        scroll={{ x: isMobile ? 'max-content' : undefined }}
        pagination={{
          showSizeChanger: !isMobile,
          showTotal: (total) => t("common.totalItems", { total }),
          pageSize: isMobile ? 10 : 20,
          pageSizeOptions: ['10', '20', '50', '100'],
          size: isMobile ? "small" : "default",
        }}
        size={isMobile ? "small" : "middle"}
      />
    </div>
  );
};

export default ClientScreen;
