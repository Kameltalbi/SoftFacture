import React from "react";
import { Form, Input, Button } from "antd";
import { PRIMARY } from "../../utils/constants/colors";
import { useTranslation } from "react-i18next";

const ClientForm = ({ initialValues, onFinish, loading }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
      style={{
        maxWidth: 600,
        margin: "0 auto",
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.05)",
      }}
    >
      <Form.Item
        label={t("components.clientForm.fullNameLabel")}
        name="fullName"
        rules={[{ required: true, message: t("components.clientForm.fullNameRequired") }]}
      >
        <Input placeholder={t("components.clientForm.fullNamePlaceholder")} size="large" />
      </Form.Item>

      <Form.Item
        label={t("components.clientForm.emailLabel")}
        name="email"
        rules={[{ required: true, type: "email", message: t("components.clientForm.emailRequired") }]}
      >
        <Input placeholder={t("components.clientForm.emailPlaceholder")} size="large" />
      </Form.Item>

      <Form.Item
        label={t("components.clientForm.phoneLabel")}
        name="phone"
        rules={[{ required: true, message: t("components.clientForm.phoneRequired") }]}
      >
        <Input placeholder={t("components.clientForm.phonePlaceholder")} size="large" />
      </Form.Item>

      <Form.Item
        label={t("components.clientForm.companyLabel")}
        name="company"
      >
        <Input placeholder={t("components.clientForm.companyPlaceholder")} size="large" />
      </Form.Item>

      <Form.Item
        label={t("components.clientForm.fiscalIdLabel")}
        name="fiscalId"
      >
        <Input placeholder={t("components.clientForm.fiscalIdPlaceholder")} size="large" />
      </Form.Item>

      <Form.Item
        label={t("components.clientForm.addressLabel")}
        name="address"
        rules={[{ required: true, message: t("components.clientForm.addressRequired") }]}
      >
        <Input.TextArea placeholder={t("components.clientForm.addressPlaceholder")} size="large" autoSize />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" size="large" loading={loading} block style={{ backgroundColor: PRIMARY }}>
          {t("components.clientForm.submitButton")}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ClientForm;
