import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, message, Spin, Alert } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateClient, fetchClients } from "../../container/redux/slices/clientsSlice";
import { useTranslation } from "react-i18next";
import { ArrowLeftOutlined } from "@ant-design/icons";

const EditClient = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const { clients, error: clientsError } = useSelector((state) => state.clients);

  useEffect(() => {
    const loadClient = async () => {
      try {
        setLoading(true);
        await dispatch(fetchClients()).unwrap();
      } catch (error) {
        message.error(error || t("screens.client.messages.loadError"));
        navigate("/clients");
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [dispatch, navigate, t]);

  const client = clients.find((c) => c.id === parseInt(id));

  useEffect(() => {
    if (client) {
      form.setFieldsValue(client);
    }
  }, [client, form]);

  const onFinish = async (values) => {
    try {
      const clientData = {
        ...values,
        company_id: user.company_id,
      };
      await dispatch(updateClient({ id: parseInt(id), data: clientData })).unwrap();
      message.success(t("screens.client.messages.updateSuccess"));
      navigate("/clients");
    } catch (error) {
      message.error(error || t("screens.client.messages.updateError"));
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip={t("common.loading")} />
      </div>
    );
  }

  if (clientsError) {
    return (
      <Alert
        message={t("common.error")}
        description={clientsError}
        type="error"
        showIcon
        action={
          <Button size="small" type="primary" onClick={() => dispatch(fetchClients())}>
            {t("common.retry")}
          </Button>
        }
      />
    );
  }

  if (!client) {
    return (
      <div>
        <Alert
          message={t("common.error")}
          description={t("screens.client.messages.notFound")}
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={() => navigate("/clients")}>
              {t("common.back")}
            </Button>
          }
        />
      </div>
    );
  }

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

      <Card title={t("screens.client.editTitle")}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={client}
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

export default EditClient;
