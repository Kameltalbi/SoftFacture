import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createClient } from "../../container/redux/slices/clientsSlice";
import { useTranslation } from "react-i18next";
import { ArrowLeftOutlined } from "@ant-design/icons";

const CreateClient = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.auth);

  const onFinish = async (values) => {
    try {
      // Add company_id from the authenticated user
      const clientData = {
        ...values,
        company_id: user.company_id,
      };
      await dispatch(createClient(clientData)).unwrap();
      message.success(t("screens.client.messages.createSuccess"));
      navigate("/clients");
    } catch (error) {
      message.error(error || t("screens.client.messages.createError"));
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/clients")}
        >
          {t("common.back")}
        </Button>
      </div>

      <Card title={t("screens.client.createTitle")}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            nom: "",
            email: "",
            telephone: "",
            adresse: "",
            n_fiscal: "",
          }}
        >
          <Form.Item
            name="nom"
            label={t("components.clientForm.nameLabel")}
            rules={[
              {
                required: true,
                message: t("components.clientForm.nameRequired"),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="telephone"
            label={t("components.clientForm.phoneLabel")}
            rules={[
              {
                required: true,
                message: t("components.clientForm.phoneRequired"),
              },
              {
                pattern: /^[+]?[0-9]{8,15}$/,
                message: t("components.clientForm.phoneInvalid"),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label={t("components.clientForm.emailLabel")}
            rules={[
              {
                type: "email",
                message: t("components.clientForm.emailInvalid"),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="n_fiscal"
            label={t("components.clientForm.fiscalIdLabel")}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="adresse"
            label={t("components.clientForm.addressLabel")}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t("common.save")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateClient;
