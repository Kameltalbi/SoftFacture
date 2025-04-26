import React, { useEffect } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import authIllustration from "../../assets/images/auth.svg";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../container/redux/slices/authSlice";

const { Title } = Typography;

const LoginScreen = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    console.info("user", user);
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const onFinish = async (values) => {
    try {
      await dispatch(loginUser(values)).unwrap();
      message.success("Login successful!");
    } catch (error) {
      const errMsg =
        error?.message || "Login failed. Please check your credentials.";
      message.error(errMsg);
    }
  };

  const onFinishFailed = () => {
    message.error("Please fill out all required fields.");
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <img src={authIllustration} alt="auth Illustration" />
      </div>

      <div className="login-right">
        <div className="login-box">
          <Title level={2} style={{ textAlign: "center" }}>
            Log in
          </Title>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
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
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password placeholder="password" size="large" />
            </Form.Item>

            <div className="forgot-pass">
              <Link to="/forgot">Forgot your password?</Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                {loading ? "Logging in..." : "Log in"}
              </Button>
            </Form.Item>

            <div className="signup-link">
              Don’t have any account? <Link to="/signup">Sign Up</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
