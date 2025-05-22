import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Popconfirm,
  message,
  Row,
  Col,
  Switch,
  Spin,
  Alert,
  Grid,
  Space,
} from "antd";
import {
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTaxes,
  createTax,
  updateTax,
  deleteTax,
  selectTaxes,
  selectLoading,
  selectError,
  clearError,
} from "../../container/redux/slices/settingsSlice";
import * as Colors from "../../utils/constants/colors";

const { useBreakpoint } = Grid;

const TaxSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const taxes = useSelector(selectTaxes);
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(null);
  const [addFormVisible, setAddFormVisible] = useState(false);

  useEffect(() => {
    // Fetch taxes when component mounts
    dispatch(fetchTaxes());

    // Clear error when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const isEditing = (id) => editingKey === id;

  const handleAddTax = async (values) => {
    try {
      await dispatch(createTax(values)).unwrap();
      message.success(t("components.taxSettings.addSuccess"));
      form.resetFields();
      setAddFormVisible(false);
    } catch (error) {
      message.error(error || t("components.taxSettings.addError"));
    }
  };

  const handleUpdateTax = async (id, values) => {
    try {
      await dispatch(updateTax({ id, data: values })).unwrap();
      message.success(t("components.taxSettings.updateSuccess"));
      setEditingKey(null);
    } catch (error) {
      message.error(error || t("components.taxSettings.updateError"));
    }
  };

  const handleDeleteTax = async (id) => {
    try {
      await dispatch(deleteTax(id)).unwrap();
      message.success(t("components.taxSettings.deleteSuccess"));
    } catch (error) {
      message.error(error || t("components.taxSettings.deleteError"));
    }
  };

  const renderTaxCard = (tax) => {
    if (isEditing(tax.id)) {
      return (
        <Form
          initialValues={{
            name: tax.name,
            value: tax.taux || tax.value,
            type: tax.type === 'Pourcentage (%)',
          }}
          onFinish={(values) => handleUpdateTax(tax.id, values)}
          layout="vertical"
        >
          <Card
            bordered
            style={{
              borderRadius: 12,
              marginBottom: 16,
              padding: isMobile ? 8 : 12,
              backgroundColor: Colors.LIGHT_GRAY,
            }}
          >
            <Form.Item
              name="name"
              label={t("components.taxSettings.nameColumn")}
              rules={[
                {
                  required: true,
                  message: t("components.taxSettings.nameRequired"),
                },
              ]}
            >
              <Input 
                placeholder={t("components.taxSettings.namePlaceholder")}
                size={isMobile ? "middle" : "large"}
              />
            </Form.Item>

            <Form.Item
              name="value"
              label={t("components.taxSettings.valueColumn")}
              rules={[
                {
                  required: true,
                  message: t("components.taxSettings.valueRequired"),
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder={t("components.taxSettings.valuePlaceholder")}
                size={isMobile ? "middle" : "large"}
              />
            </Form.Item>

            <Form.Item
              name="type"
              label={t("components.taxSettings.typeColumn")}
              valuePropName="checked"
            >
              <Switch
                checkedChildren={t("components.taxSettings.percentage")}
                unCheckedChildren={t("components.taxSettings.fixed")}
                size={isMobile ? "small" : "default"}
              />
            </Form.Item>

            <Space 
              direction={isMobile ? "vertical" : "horizontal"} 
              style={{ width: '100%', justifyContent: 'flex-end' }}
              size={isMobile ? 8 : 16}
            >
              <Button
                type="primary"
                icon={<SaveOutlined />}
                htmlType="submit"
                loading={isLoading}
                style={{ 
                  backgroundColor: Colors.PRIMARY,
                  width: isMobile ? '100%' : 'auto'
                }}
                size={isMobile ? "middle" : "large"}
              >
                {t("components.taxSettings.save")}
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={() => setEditingKey(null)}
                disabled={isLoading}
                size={isMobile ? "middle" : "large"}
                style={{ width: isMobile ? '100%' : 'auto' }}
              >
                {t("components.taxSettings.cancel")}
              </Button>
            </Space>
          </Card>
        </Form>
      );
    } else {
      return (
        <Card
          bordered
          style={{
            borderRadius: 10,
            padding: isMobile ? 12 : 16,
            backgroundColor: Colors.WHITE,
            boxShadow: `0 2px 8px ${Colors.LIGHT_GRAY}`,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <h3
              style={{
                fontSize: isMobile ? 16 : 18,
                fontWeight: 500,
                margin: 0,
                color: Colors.SECONDARY,
              }}
            >
              {tax.name}
            </h3>
            <Space size={8}>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => setEditingKey(tax.id)}
                disabled={isLoading}
                style={{ width: 28, height: 28, color: Colors.PRIMARY }}
              />
              <Popconfirm
                title={t("components.taxSettings.confirmDelete")}
                onConfirm={() => handleDeleteTax(tax.id)}
                okText={t("components.taxSettings.yes")}
                cancelText={t("components.taxSettings.no")}
                disabled={isLoading}
              >
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  danger
                  disabled={isLoading}
                  style={{ width: 28, height: 28 }}
                />
              </Popconfirm>
            </Space>
          </div>

          <div style={{ 
            fontSize: isMobile ? 14 : 16, 
            color: Colors.DARK_GRAY 
          }}>
            <p style={{ marginBottom: 4 }}>
              <strong>{t("components.taxSettings.valueLabel")}:</strong>{" "}
              {tax.taux || tax.value} {tax.type === 'Pourcentage (%)' ? '%' : '€'}
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>{t("components.taxSettings.typeLabel")}:</strong>{" "}
              {tax.type === 'Pourcentage (%)'
                ? t("components.taxSettings.percentage")
                : t("components.taxSettings.fixed")}
            </p>
          </div>
        </Card>
      );
    }
  };

  if (isLoading && !taxes.length) {
    return (
      <div style={{ padding: isMobile ? 16 : 24, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? 0 : 24 }}>
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: isMobile ? 16 : 24 }}
          closable
          onClose={() => dispatch(clearError())}
        />
      )}

      <Card
        title={t("components.taxSettings.cardTitle")}
        style={{
          borderRadius: 8,
          backgroundColor: Colors.WHITE,
          boxShadow: `0 2px 8px ${Colors.LIGHT_GRAY}`,
          marginBottom: isMobile ? 16 : 24,
          padding: isMobile ? 12 : 16,
        }}
      >
        {!addFormVisible ? (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddFormVisible(true)}
            loading={isLoading}
            style={{ 
              backgroundColor: Colors.PRIMARY,
              width: isMobile ? '100%' : 'auto'
            }}
            size={isMobile ? "middle" : "large"}
          >
            {t("components.taxSettings.addButton")}
          </Button>
        ) : (
          <Form form={form} onFinish={handleAddTax} layout="vertical">
            <Row gutter={[isMobile ? 0 : 16, isMobile ? 16 : 24]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label={t("components.taxSettings.nameColumn")}
                  rules={[
                    {
                      required: true,
                      message: t("components.taxSettings.nameRequired"),
                    },
                  ]}
                >
                  <Input 
                    placeholder={t("components.taxSettings.namePlaceholder")}
                    size={isMobile ? "middle" : "large"}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="value"
                  label={t("components.taxSettings.valueColumn")}
                  rules={[
                    {
                      required: true,
                      message: t("components.taxSettings.valueRequired"),
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    placeholder={t("components.taxSettings.valuePlaceholder")}
                    size={isMobile ? "middle" : "large"}
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  name="type"
                  label={t("components.taxSettings.typeColumn")}
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Switch
                    checkedChildren={t("components.taxSettings.percentage")}
                    unCheckedChildren={t("components.taxSettings.fixed")}
                    size={isMobile ? "small" : "default"}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Space 
              direction={isMobile ? "vertical" : "horizontal"} 
              style={{ width: '100%', justifyContent: 'flex-end' }}
              size={isMobile ? 8 : 16}
            >
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={isLoading}
                style={{ 
                  backgroundColor: Colors.PRIMARY,
                  width: isMobile ? '100%' : 'auto'
                }}
                size={isMobile ? "middle" : "large"}
              >
                {t("components.taxSettings.save")}
              </Button>
              <Button
                style={{ width: isMobile ? '100%' : 'auto' }}
                icon={<CloseOutlined />}
                onClick={() => setAddFormVisible(false)}
                disabled={isLoading}
                size={isMobile ? "middle" : "large"}
              >
                {t("components.taxSettings.cancel")}
              </Button>
            </Space>
          </Form>
        )}
      </Card>

      <Row gutter={[isMobile ? 0 : 16, isMobile ? 16 : 24]}>
        {taxes.map((tax) => (
          <Col xs={24} sm={12} md={8} lg={6} key={tax.id}>
            {renderTaxCard(tax)}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TaxSettings;
