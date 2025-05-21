import React, { useState } from "react";
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
  addCurrency,
  updateCurrency,
  deleteCurrency,
  selectCurrencies,
} from "../../container/redux/slices/settingsSlice";
import * as Colors from "../../utils/constants/colors";

const CurrencySettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currencies = useSelector(selectCurrencies);

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(null);
  const [addFormVisible, setAddFormVisible] = useState(false);

  const isEditing = (key) => editingKey === key;

  const handleAddCurrency = (values) => {
    const newKey = Date.now().toString();
    const newCurrency = {
      key: newKey,
      name: values.name,
      code: values.code,
      symbol: values.symbol,
      exchangeRate: values.exchangeRate,
    };
    dispatch(addCurrency(newCurrency));
    message.success(t("components.currencySettings.addSuccess"));
    form.resetFields();
    setAddFormVisible(false);
  };

  const handleUpdateCurrency = (key, values) => {
    const updatedCurrency = {
      key,
      name: values.name,
      code: values.code,
      symbol: values.symbol,
      exchangeRate: values.exchangeRate,
    };
    dispatch(updateCurrency(updatedCurrency));
    message.success(t("components.currencySettings.updateSuccess"));
    setEditingKey(null);
  };

  const handleDeleteCurrency = (key) => {
    dispatch(deleteCurrency(key));
    message.success(t("components.currencySettings.deleteSuccess"));
  };

  const renderCurrencyCard = (currency) => {
    if (isEditing(currency.key)) {
      return (
        <Form
          initialValues={{
            name: currency.name,
            code: currency.code,
            symbol: currency.symbol,
            exchangeRate: currency.exchangeRate,
          }}
          onFinish={(values) => handleUpdateCurrency(currency.key, values)}
          layout="vertical"
        >
          <Card
            bordered
            style={{
              borderRadius: 12,
              marginBottom: 16,
              padding: 12,
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
              <Input placeholder={t("components.currencySettings.namePlaceholder")} />
            </Form.Item>

            <Form.Item
              name="code"
              label={t("components.currencySettings.codeLabel")}
              rules={[
                { required: true, message: t("components.currencySettings.codeRequired") },
              ]}
            >
              <Input placeholder={t("components.currencySettings.codePlaceholder")} />
            </Form.Item>

            <Form.Item
              name="symbol"
              label={t("components.currencySettings.symbolLabel")}
              rules={[
                { required: true, message: t("components.currencySettings.symbolRequired") },
              ]}
            >
              <Input placeholder={t("components.currencySettings.symbolPlaceholder")} />
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
              />
            </Form.Item>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit" style={{backgroundColor: Colors.PRIMARY}}>
                {t("components.currencySettings.save")}
              </Button>
              <Button icon={<CloseOutlined />} onClick={() => setEditingKey(null)}>
                {t("components.currencySettings.cancel")}
              </Button>
            </div>
          </Card>
        </Form>
      );
    } else {
      return (
        <Card
          bordered
          style={{
            borderRadius: 12,
            padding: 16,
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
              fontSize: 18,
              fontWeight: 600,
              margin: 0,
              color: Colors.SECONDARY,
            }}>
              {currency.name}
            </h3>

            <div style={{ display: "flex", gap: 8 }}>
              <Button
                type="text"
                icon={<EditOutlined />}
                size="small"
                onClick={() => setEditingKey(currency.key)}
                style={{ width: 28, height: 28, color: Colors.PRIMARY }}
              />
              <Popconfirm
                title={t("components.currencySettings.confirmDelete")}
                onConfirm={() => handleDeleteCurrency(currency.key)}
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
            </div>
          </div>

          <div style={{ fontSize: 15, color: Colors.DARK_GRAY }}>
            <p><strong>{t("components.currencySettings.codeLabel")}:</strong> {currency.code}</p>
            <p><strong>{t("components.currencySettings.symbolLabel")}:</strong> {currency.symbol}</p>
            <p><strong>{t("components.currencySettings.exchangeRateLabel")}:</strong> {currency.exchangeRate}</p>
          </div>
        </Card>
      );
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={t("components.currencySettings.cardTitle")}
        style={{
          borderRadius: 8,
          backgroundColor: Colors.WHITE,
          boxShadow: `0 2px 8px ${Colors.LIGHT_GRAY}`,
          marginBottom: 24,
        }}
      >
        {!addFormVisible ? (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddFormVisible(true)}
            style={{backgroundColor: Colors.PRIMARY}}
          >
            {t("components.currencySettings.addButton")}
          </Button>
        ) : (
          <Form form={form} onFinish={handleAddCurrency} layout="vertical">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label={t("components.currencySettings.nameLabel")}
                  rules={[
                    { required: true, message: t("components.currencySettings.nameRequired") },
                  ]}
                >
                  <Input placeholder={t("components.currencySettings.namePlaceholder")} />
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
                  <Input placeholder={t("components.currencySettings.codePlaceholder")} />
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
                  <Input placeholder={t("components.currencySettings.symbolPlaceholder")} />
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
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} style={{backgroundColor: Colors.PRIMARY}}>
                {t("components.currencySettings.save")}
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                icon={<CloseOutlined />}
                onClick={() => setAddFormVisible(false)}
              >
                {t("components.currencySettings.cancel")}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>

      <Row gutter={[16, 16]}>
        {currencies.map((currency) => (
          <Col xs={24} sm={12} md={8} lg={6} key={currency.key}>
            {renderCurrencyCard(currency)}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CurrencySettings;
