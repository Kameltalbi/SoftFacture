import React, { useEffect } from "react";
import { Form, Input, Button, Typography, message, Card } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import authIllustration from "../../assets/images/auth.svg";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../container/redux/slices/authSlice";
import * as colors from "../../utils/constants/colors";
import { useTranslation } from 'react-i18next';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

const LoginScreen = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const translation = t('screens.auth',{ returnObjects: true })

  const { loading, user, error, token } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log('Auth state updated:', { 
      user, 
      loading, 
      error, 
      token,
      hasUser: !!user,
      hasToken: !!token
    });

    if (user && token) {
      console.log('User and token present, attempting navigation');
      navigate("/dashboard", { replace: true });
    } else if (user && !token) {
      console.log('User present but no token');
    } else if (!user && token) {
      console.log('Token present but no user');
    }
  }, [user, loading, error, token, navigate]);

  const onFinish = async (values) => {
    console.log('Login form submitted with values:', values);
    try {
      const result = await dispatch(loginUser(values)).unwrap();
      console.log('Login dispatch result:', result);
      message.success(t("screens.auth.loginSuccess"));
    } catch (error) {
      console.error('Login dispatch error:', error);
      message.error(error || t("screens.auth.loginError"));
    }
  };

  const onFinishFailed = () => {
    message.error(translation.fillAllFields);
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
                {t("screens.auth.welcome")}
              </Title>
              <p style={{ textAlign: 'center', color: '#666', marginBottom: '32px' }}>
                {t("screens.auth.loginSubtitle")}
              </p>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
              initialValues={{
                email: "",
                password: "",
              }}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: t("screens.auth.emailRequired"),
                  },
                  {
                    type: 'email',
                    message: t("screens.auth.emailInvalid"),
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder={t("screens.auth.emailPlaceholder")}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: t("screens.auth.passwordRequired"),
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder={t("screens.auth.passwordPlaceholder")}
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
                  {t("screens.auth.loginButton")}
                </Button>
              </Form.Item>

              <div className="auth-links">
                <Link to="/forgot-password">
                  {t("screens.auth.forgotPassword")}
                </Link>
                <Link to="/register">
                  {t("screens.auth.createAccount")}
                </Link>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
