import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Row,
  Col,
  Switch,
} from "antd";
import {
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  addTax,
  updateTax,
  deleteTax,
  selectTaxes,
} from "../../container/redux/slices/settingsSlice";
import * as Colors from "../../utils/constants/colors";

const TaxSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const taxes = useSelector(selectTaxes);

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(null);
  const [addFormVisible, setAddFormVisible] = useState(false);

  const isEditing = (key) => editingKey === key;

  const handleAddTax = (values) => {
    const newKey = Date.now().toString();
    const newTax = {
      key: newKey,
      name: values.name,
      value: values.value,
      type: values.type ? "percentage" : "fixed",
    };
    dispatch(addTax(newTax));
    message.success(t("components.taxSettings.addSuccess"));
    form.resetFields();
    setAddFormVisible(false);
  };

  const handleUpdateTax = (key, values) => {
    const updatedTax = {
      key,
      name: values.name,
      value: values.value,
      type: values.type ? "percentage" : "fixed",
    };
    dispatch(updateTax(updatedTax));
    message.success(t("components.taxSettings.updateSuccess"));
    setEditingKey(null);
  };

  const handleDeleteTax = (key) => {
    dispatch(deleteTax(key));
    message.success(t("components.taxSettings.deleteSuccess"));
  };

  const renderTaxCard = (tax) => {
    if (isEditing(tax.key)) {
      return (
        <Form
          initialValues={{
            name: tax.name,
            value: tax.value,
            type: tax.type === "percentage",
          }}
          onFinish={(values) => handleUpdateTax(tax.key, values)}
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
            actions={[
              <Button
                type="primary"
                icon={<SaveOutlined />}
                htmlType="submit"
                size="small"
                style={{ backgroundColor: Colors.PRIMARY }}
              >
                {t("components.taxSettings.save")}
              </Button>,
              <Button
                icon={<CloseOutlined />}
                onClick={() => setEditingKey(null)}
                size="small"
              >
                {t("components.taxSettings.cancel")}
              </Button>,
            ]}
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
              />
            </Form.Item>
          </Card>
        </Form>
      );
    } else {
      return (
        <Card
          bordered
          style={{
            borderRadius: 10,
            padding: 12,
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
                fontSize: 18,
                fontWeight: 500,
                margin: 0,
                color: Colors.SECONDARY,
              }}
            >
              {tax.name}
            </h3>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
              onClick={() => handleDeleteTax(tax.key)}
              style={{ width: 28, height: 28 }}
            />
          </div>

          <div style={{ fontSize: 16, color: Colors.DARK_GRAY }}>
            <p style={{ marginBottom: 4 }}>
              <strong>{t("components.taxSettings.valueLabel")}:</strong>{" "}
              {tax.value} {tax.type === "percentage" ? "%" : "€"}
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>{t("components.taxSettings.typeLabel")}:</strong>{" "}
              {tax.type === "percentage"
                ? t("components.taxSettings.percentage")
                : t("components.taxSettings.fixed")}
            </p>
          </div>
        </Card>
      );
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={t("components.taxSettings.cardTitle")}
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
            style={{
              backgroundColor: Colors.PRIMARY,
            }}
          >
            {t("components.taxSettings.addButton")}
          </Button>
        ) : (
          <Form form={form} onFinish={handleAddTax} layout="inline">
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: t("components.taxSettings.nameRequired"),
                },
              ]}
            >
              <Input
                placeholder={t("components.taxSettings.namePlaceholder")}
              />
            </Form.Item>

            <Form.Item
              name="value"
              rules={[
                {
                  required: true,
                  message: t("components.taxSettings.valueRequired"),
                },
              ]}
            >
              <InputNumber
                min={0}
                placeholder={t("components.taxSettings.valuePlaceholder")}
              />
            </Form.Item>

            <Form.Item name="type" valuePropName="checked" initialValue={false}>
              <Switch
                checkedChildren={t("components.taxSettings.percentage")}
                unCheckedChildren={t("components.taxSettings.fixed")}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                style={{
                  backgroundColor: Colors.PRIMARY,
                }}
              >
                {t("components.taxSettings.save")}
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                icon={<CloseOutlined />}
                onClick={() => setAddFormVisible(false)}
              >
                {t("components.taxSettings.cancel")}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>

      <Row gutter={[16, 16]}>
        {taxes.map((tax) => (
          <Col xs={24} sm={12} md={8} lg={6} key={tax.key}>
            {renderTaxCard(tax)}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TaxSettings;
