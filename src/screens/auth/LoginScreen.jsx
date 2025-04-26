import React, { useEffect } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import authIllustration from "../../assets/images/auth.svg";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../container/redux/slices/authSlice";
import * as colors from "../../utils/constants/colors";

const { Title } = Typography;

const LoginScreen = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const onFinish = async (values) => {
    try {
      await dispatch(loginUser(values)).unwrap();
      message.success("Login successful!");
    } catch (error) {
      const errMsg = error?.message || "Login failed. Please check your credentials.";
      message.error(errMsg);
    }
  };

  const onFinishFailed = () => {
    message.error("Please fill out all required fields.");
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
            Log in
          </Title>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              email: "admin",
              password: "admin",
            }}
            onFinishFailed={onFinishFailed}
            style={{ marginTop: 24 }}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input placeholder="Email" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password placeholder="Password" size="large" />
            </Form.Item>

            <div className="forgot-pass">
              <Link to="/forgot" style={{ color: colors.PRIMARY }}>
                Forgot your password?
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
                {loading ? "Logging in..." : "Log in"}
              </Button>
            </Form.Item>

            <div className="signup-link">
              Don’t have an account?{" "}
              <Link to="/signup" style={{ color: colors.PRIMARY }}>
                Sign Up
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
