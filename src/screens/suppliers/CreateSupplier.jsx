import React from "react";
import { Form, Input, Button, message, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSupplier } from "../../container/redux/slices/supplierSlice";
import { PRIMARY } from "../../utils/constants/colors";

const CreateSupplier = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.suppliers);

  const onFinish = async (values) => {
    try {
      await dispatch(createSupplier(values)).unwrap();
      message.success("Supplier created successfully");
      navigate("/suppliers");
    } catch (error) {
      message.error(error || "Failed to create supplier");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card title="Create Supplier" style={{ maxWidth: 800, margin: "0 auto" }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name: "",
            email: "",
            phone: "",
            adress: "",
            code_tva: "",
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please enter the supplier name" },
              { max: 255, message: "Name cannot exceed 255 characters" },
            ]}
          >
            <Input placeholder="Enter supplier name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: "email", message: "Please enter a valid email" },
              { max: 255, message: "Email cannot exceed 255 characters" },
            ]}
          >
            <Input placeholder="Enter supplier email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please enter the supplier phone number" },
              { max: 20, message: "Phone number cannot exceed 20 characters" },
              {
                pattern: /^[0-9+\-\s()]*$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input placeholder="Enter supplier phone number" />
          </Form.Item>

          <Form.Item
            name="adress"
            label="Address"
            rules={[{ max: 255, message: "Address cannot exceed 255 characters" }]}
          >
            <Input.TextArea
              placeholder="Enter supplier address"
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>

          <Form.Item
            name="code_tva"
            label="VAT Code"
            rules={[{ max: 50, message: "VAT code cannot exceed 50 characters" }]}
          >
            <Input placeholder="Enter supplier VAT code" />
          </Form.Item>

          <Form.Item>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <Button onClick={() => navigate("/suppliers")}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ backgroundColor: PRIMARY }}
              >
                Create Supplier
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateSupplier;
