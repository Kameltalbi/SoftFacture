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
  Spin,
  Alert,
  Grid,
  Space,
} from "antd";
import {
  PlusOutlined,
  SaveOutlined,
  EditOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrencies,
  createCurrency,
  updateCurrency,
  deleteCurrency,
  selectCurrencies,
  selectLoading,
  selectError,
  clearError,
} from "../../container/redux/slices/settingsSlice";
import * as Colors from "../../utils/constants/colors";

const { useBreakpoint } = Grid;

const CurrencySettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const currencies = useSelector(selectCurrencies);
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(null);
  const [addFormVisible, setAddFormVisible] = useState(false);

  useEffect(() => {
    // Fetch currencies when component mounts
    dispatch(fetchCurrencies());

    // Clear error when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const isEditing = (id) => editingKey === id;

  const handleAddCurrency = async (values) => {
    try {
      const currencyData = {
        name: values.name,
        code: values.code,
        symbole: values.symbol,
        taux: values.exchangeRate,
      };
      await dispatch(createCurrency(currencyData)).unwrap();
      message.success(t("components.currencySettings.addSuccess"));
      form.resetFields();
      setAddFormVisible(false);
    } catch (error) {
      message.error(error || t("components.currencySettings.addError"));
    }
  };

  const handleUpdateCurrency = async (id, values) => {
    try {
      const currencyData = {
        name: values.name,
        code: values.code,
        symbole: values.symbol,
        taux: values.exchangeRate,
      };
      await dispatch(updateCurrency({ id, currencyData })).unwrap();
      message.success(t("components.currencySettings.updateSuccess"));
      setEditingKey(null);
    } catch (error) {
      message.error(error || t("components.currencySettings.updateError"));
    }
  };

  const handleDeleteCurrency = async (id) => {
    try {
      await dispatch(deleteCurrency(id)).unwrap();
      message.success(t("components.currencySettings.deleteSuccess"));
    } catch (error) {
      message.error(error || t("components.currencySettings.deleteError"));
    }
  };

  const renderCurrencyCard = (currency) => {
    if (isEditing(currency.id)) {
      return (
        <Form
          initialValues={{
            name: currency.name,
            code: currency.code,
            symbol: currency.symbole,
            exchangeRate: currency.taux,
          }}
          onFinish={(values) => handleUpdateCurrency(currency.id, values)}
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
              label={t("components.currencySettings.nameLabel")}
              rules={[
                { required: true, message: t("components.currencySettings.nameRequired") },
              ]}
            >
              <Input 
                placeholder={t("components.currencySettings.namePlaceholder")}
                size={isMobile ? "middle" : "large"}
              />
            </Form.Item>

            <Form.Item
              name="code"
              label={t("components.currencySettings.codeLabel")}
              rules={[
                { required: true, message: t("components.currencySettings.codeRequired") },
              ]}
            >
              <Input 
                placeholder={t("components.currencySettings.codePlaceholder")}
                size={isMobile ? "middle" : "large"}
              />
            </Form.Item>

            <Form.Item
              name="symbol"
              label={t("components.currencySettings.symbolLabel")}
              rules={[
                { required: true, message: t("components.currencySettings.symbolRequired") },
              ]}
            >
              <Input 
                placeholder={t("components.currencySettings.symbolPlaceholder")}
                size={isMobile ? "middle" : "large"}
              />
            </Form.Item>

            <Form.Item
              name="exchangeRate"
              label={t("components.currencySettings.exchangeRateLabel")}
              rules={[
                { required: true, message: t("components.currencySettings.exchangeRateRequired") },
              ]}
            >
              <InputNumber
                min={0}
                step={0.01}
                style={{ width: "100%" }}
                placeholder={t("components.currencySettings.exchangeRatePlaceholder")}
                size={isMobile ? "middle" : "large"}
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
                style={{
                  backgroundColor: Colors.PRIMARY,
                  width: isMobile ? '100%' : 'auto'
                }}
                size={isMobile ? "middle" : "large"}
              >
                {t("components.currencySettings.save")}
              </Button>
              <Button 
                icon={<CloseOutlined />} 
                onClick={() => setEditingKey(null)}
                size={isMobile ? "middle" : "large"}
                style={{ width: isMobile ? '100%' : 'auto' }}
              >
                {t("components.currencySettings.cancel")}
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
            borderRadius: 12,
            padding: isMobile ? 12 : 16,
            backgroundColor: Colors.WHITE,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            marginBottom: 24,
          }}
        >
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}>
            <h3 style={{
              fontSize: isMobile ? 16 : 18,
              fontWeight: 600,
              margin: 0,
              color: Colors.SECONDARY,
            }}>
              {currency.name}
            </h3>

            <Space size={8}>
              <Button
                type="text"
                icon={<EditOutlined />}
                size="small"
                onClick={() => setEditingKey(currency.id)}
                style={{ width: 28, height: 28, color: Colors.PRIMARY }}
              />
              <Popconfirm
                title={t("components.currencySettings.confirmDelete")}
                onConfirm={() => handleDeleteCurrency(currency.id)}
                okText={t("components.currencySettings.yes")}
                cancelText={t("components.currencySettings.no")}
              >
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  danger
                  size="small"
                  style={{ width: 28, height: 28 }}
                />
              </Popconfirm>
            </Space>
          </div>

          <div style={{ 
            fontSize: isMobile ? 14 : 15, 
            color: Colors.DARK_GRAY 
          }}>
            <p><strong>{t("components.currencySettings.codeLabel")}:</strong> {currency.code}</p>
            <p><strong>{t("components.currencySettings.symbolLabel")}:</strong> {currency.symbole}</p>
            <p><strong>{t("components.currencySettings.exchangeRateLabel")}:</strong> {currency.taux}</p>
          </div>
        </Card>
      );
    }
  };

  if (isLoading && !currencies.length) {
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
        title={t("components.currencySettings.cardTitle")}
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
            {t("components.currencySettings.addButton")}
          </Button>
        ) : (
          <Form form={form} onFinish={handleAddCurrency} layout="vertical">
            <Row gutter={[isMobile ? 0 : 16, isMobile ? 16 : 24]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label={t("components.currencySettings.nameLabel")}
                  rules={[
                    { required: true, message: t("components.currencySettings.nameRequired") },
                  ]}
                >
                  <Input 
                    placeholder={t("components.currencySettings.namePlaceholder")}
                    size={isMobile ? "middle" : "large"}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="code"
                  label={t("components.currencySettings.codeLabel")}
                  rules={[
                    { required: true, message: t("components.currencySettings.codeRequired") },
                  ]}
                >
                  <Input 
                    placeholder={t("components.currencySettings.codePlaceholder")}
                    size={isMobile ? "middle" : "large"}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="symbol"
                  label={t("components.currencySettings.symbolLabel")}
                  rules={[
                    { required: true, message: t("components.currencySettings.symbolRequired") },
                  ]}
                >
                  <Input 
                    placeholder={t("components.currencySettings.symbolPlaceholder")}
                    size={isMobile ? "middle" : "large"}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="exchangeRate"
                  label={t("components.currencySettings.exchangeRateLabel")}
                  rules={[
                    { required: true, message: t("components.currencySettings.exchangeRateRequired") },
                  ]}
                >
                  <InputNumber
                    min={0}
                    step={0.01}
                    style={{ width: "100%" }}
                    placeholder={t("components.currencySettings.exchangeRatePlaceholder")}
                    size={isMobile ? "middle" : "large"}
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
                {t("components.currencySettings.save")}
              </Button>
              <Button
                style={{ width: isMobile ? '100%' : 'auto' }}
                icon={<CloseOutlined />}
                onClick={() => setAddFormVisible(false)}
                disabled={isLoading}
                size={isMobile ? "middle" : "large"}
              >
                {t("components.currencySettings.cancel")}
              </Button>
            </Space>
          </Form>
        )}
      </Card>

      <Row gutter={[isMobile ? 0 : 16, isMobile ? 16 : 24]}>
        {currencies.map((currency) => (
          <Col xs={24} sm={12} md={8} lg={6} key={currency.id}>
            {renderCurrencyCard(currency)}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CurrencySettings;
