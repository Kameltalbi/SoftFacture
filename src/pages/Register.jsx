import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Card, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authAPI } from "../services/api";

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Prepare data for the API
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
        company_name: values.company_name,
        company_email: values.company_email,
        company_vat_number: values.company_vat_number,
        company_phone: values.company_phone,
        company_address: values.company_address,
      };

      await authAPI.register(userData);
      message.success(t("auth.registerSuccess"));
      navigate("/login");
    } catch (error) {
      message.error(
        error?.response?.data?.message || t("auth.registerError")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
      <Card style={{ width: 600, boxShadow: "0 2px 8px #f0f1f2" }}>
        <Title level={2} style={{ textAlign: "center" }}>{t("auth.registerTitle")}</Title>
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Title level={4}>{t("auth.personalInfo")}</Title>
          <Form.Item name="name" label={t("auth.name")}
            rules={[{ required: true, message: t("auth.nameRequired") }]}
          >
            <Input placeholder={t("auth.namePlaceholder")} />
          </Form.Item>
          <Form.Item name="email" label={t("auth.email")}
            rules={[{ required: true, type: "email", message: t("auth.emailRequired") }]}
          >
            <Input placeholder={t("auth.emailPlaceholder")} />
          </Form.Item>
          <Form.Item name="password" label={t("auth.password")}
            rules={[{ required: true, min: 8, message: t("auth.passwordRequired") }]}
          >
            <Input.Password placeholder={t("auth.passwordPlaceholder")} />
          </Form.Item>
          <Form.Item name="password_confirmation" label={t("auth.passwordConfirmation")}
            rules={[
              { required: true, message: t("auth.passwordConfirmationRequired") },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t("auth.passwordMismatch")));
                },
              }),
            ]}
          >
            <Input.Password placeholder={t("auth.passwordConfirmationPlaceholder")} />
          </Form.Item>

          <Divider>{t("auth.companyInfo")}</Divider>

          <Form.Item name="company_name" label={t("auth.companyName")}
            rules={[{ required: true, message: t("auth.companyNameRequired") }]}
          >
            <Input placeholder={t("auth.companyNamePlaceholder")} />
          </Form.Item>
          <Form.Item name="company_email" label={t("auth.companyEmail")}
            rules={[{ required: true, type: "email", message: t("auth.companyEmailRequired") }]}
          >
            <Input placeholder={t("auth.companyEmailPlaceholder")} />
          </Form.Item>
          <Form.Item name="company_vat_number" label={t("auth.companyVatNumber")}
            rules={[{ required: true, message: t("auth.companyVatNumberRequired") }]}
          >
            <Input placeholder={t("auth.companyVatNumberPlaceholder")} />
          </Form.Item>
          <Form.Item name="company_phone" label={t("auth.companyPhone")}
            rules={[{ required: true, message: t("auth.companyPhoneRequired") }]}
          >
            <Input placeholder={t("auth.companyPhonePlaceholder")} />
          </Form.Item>
          <Form.Item name="company_address" label={t("auth.companyAddress")}
            rules={[{ required: true, message: t("auth.companyAddressRequired") }]}
          >
            <Input.TextArea rows={3} placeholder={t("auth.companyAddressPlaceholder")} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {t("auth.register")}
            </Button>
          </Form.Item>
          <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
            <a href="/login">{t("auth.alreadyHaveAccount")}</a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 