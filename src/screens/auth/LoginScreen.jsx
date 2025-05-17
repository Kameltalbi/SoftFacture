import React, { useEffect } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import authIllustration from "../../assets/images/auth.svg";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../container/redux/slices/authSlice";
import * as colors from "../../utils/constants/colors";
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const LoginScreen = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const translation = t('screens.auth',{ returnObjects: true })

  const { loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const onFinish = async (values) => {
    try {
      await dispatch(loginUser(values)).unwrap();
      message.success(translation.loginSuccess);
    } catch (error) {
      const errMsg = error?.message || translation.loginError;
      message.error(errMsg);
    }
  };

  const onFinishFailed = () => {
    message.error(translation.fillAllFields);
  };

  return (
    <div className="login-wrapper">
      {/* Left side */}
      <div className="login-left" style={{ backgroundColor: colors.WHITE }}>
        <img src={authIllustration} alt="auth Illustration" />
      </div>

      {/* Right side */}
      <div className="login-right" style={{ backgroundColor: colors.LIGHT_GRAY }}>
        <div className="login-box" style={{ backgroundColor: colors.WHITE }}>
          <Title level={2} style={{ textAlign: "center", color: colors.SECONDARY }}>
            {translation.title}
          </Title>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              email: "yassinhakiri@gmail.com",
              password: "Cbcd328!",
            }}
            onFinishFailed={onFinishFailed}
            style={{ marginTop: 24 }}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: translation.error.email }]}
            >
              <Input placeholder={translation.placeholder.email} size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: translation.error.password }]}
            >
              <Input.Password placeholder={translation.placeholder.password} size="large" />
            </Form.Item>

            <div className="forgot-pass">
              <Link to="/forgot" style={{ color: colors.PRIMARY }}>
                {translation.forgetPassword}
              </Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                style={{ backgroundColor: colors.PRIMARY, borderColor: colors.PRIMARY }}
              >
                {loading ? translation.loginInProgress : translation.login}
              </Button>
            </Form.Item>

            <div className="signup-link">
              {translation.dontHaveAccount} {"  "}
              <Link to="/signup" style={{ color: colors.PRIMARY }}>
                {translation.signup}
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
