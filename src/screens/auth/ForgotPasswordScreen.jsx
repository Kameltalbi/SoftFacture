import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Card } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authAPI } from "../../services/api";
import { UserOutlined } from "@ant-design/icons";
import "./style.css";

const { Title } = Typography;

const ForgotPasswordScreen = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await authAPI.forgotPassword(values.email);
      message.success(t("auth.resetLinkSent"));
    } catch (error) {
      message.error(error?.response?.data?.message || t("auth.resetLinkError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-left">
          <img 
            src="/auth-illustration.svg" 
            alt="Authentication" 
            className="auth-illustration"
          />
        </div>
        <div className="auth-right">
          <Card className="auth-card">
            <div className="auth-header">
              <Title level={2} style={{ marginBottom: '24px', textAlign: 'center' }}>
                {t("auth.forgotPasswordTitle")}
              </Title>
              <p style={{ textAlign: 'center', color: '#666', marginBottom: '32px' }}>
                {t("auth.forgotPasswordSubtitle")}
              </p>
            </div>

            <Form
              name="forgot-password"
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: t("auth.emailRequired"),
                  },
                  {
                    type: 'email',
                    message: t("auth.emailInvalid"),
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder={t("auth.emailPlaceholder")}
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                >
                  {t("auth.sendResetLink")}
                </Button>
              </Form.Item>

              <div className="auth-links">
                <Link to="/login">
                  {t("auth.backToLogin")}
                </Link>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen; 