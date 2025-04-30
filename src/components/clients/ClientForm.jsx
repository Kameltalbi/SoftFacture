import React from 'react';
import { Form, Input, Button, Switch } from 'antd';
import { PRIMARY, DARK_GRAY } from '../../utils/constants/colors';

const ClientForm = ({ initialValues, onFinish, loading }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
      style={{ maxWidth: 600, margin: '0 auto', backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0px 0px 10px rgba(0,0,0,0.05)' }}
    >
      <Form.Item
        label="Full Name"
        name="fullName"
        rules={[{ required: true, message: 'Please enter full name' }]}
      >
        <Input placeholder="John Doe" size="large" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
      >
        <Input placeholder="example@email.com" size="large" />
      </Form.Item>

      <Form.Item
        label="Phone"
        name="phone"
        rules={[{ required: true, message: 'Please enter phone number' }]}
      >
        <Input placeholder="+1 234 567 890" size="large" />
      </Form.Item>

      <Form.Item
        label="Company Name"
        name="company"
        rules={[{ required: false, message: 'Please enter company name' }]}
      >
        <Input placeholder="Awesome Company" size="large" />
      </Form.Item>

      <Form.Item
        label="Fiscal ID (Matricule Fiscal)"
        name="fiscalId"
        rules={[{ required: false, message: 'Please enter fiscal ID' }]}
      >
        <Input placeholder="MF123456789" size="large" />
      </Form.Item>

      <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true, message: 'Please enter address' }]}
      >
        <Input.TextArea placeholder="123 Main St, City, Country" size="large" autoSize />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" size="large" loading={loading} block style={{ backgroundColor: PRIMARY }}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ClientForm;
