import React from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Table,
  Select,
  InputNumber,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { PRIMARY } from "../../utils/constants/colors";

const { Option } = Select;

const QuoteForm = ({ form, onFinish }) => {
  const { t } = useTranslation();
  const clients = useSelector((state) => state.clients.clients);

  const addArticle = () => {
    const articles = form.getFieldValue("articles") || [];
    form.setFieldsValue({
      articles: [...articles, { key: Date.now(), quantity: 1, unitPrice: 0, discount: 0, vat: 19 }],
    });
  };

  const handleClientChange = (clientId) => {
    const selectedClient = clients.find((c) => c.id === clientId);
    if (selectedClient) {
      form.setFieldsValue({
        clientId: selectedClient.id,
        fullName: selectedClient.fullName,
        phone: selectedClient.phone,
        email: selectedClient.email,
        address: selectedClient.address,
        taxNumber: selectedClient.taxNumber,
      });
    }
  };

  const articles = form.getFieldValue("articles") || [];

  const columns = [
    {
      title: t("components.quoteForm.reference"),
      dataIndex: "reference",
      render: (_, __, index) => (
        <Form.Item name={["articles", index, "reference"]} noStyle>
          <Select placeholder={t("components.quoteForm.selectReference")} style={{ width: "100%" }}>
            <Option value="ref1">Ref 1</Option>
            <Option value="ref2">Ref 2</Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      title: t("components.quoteForm.description"),
      dataIndex: "description",
      render: (_, __, index) => (
        <Form.Item name={["articles", index, "description"]} noStyle>
          <Input placeholder={t("components.quoteForm.description")} />
        </Form.Item>
      ),
    },
    {
      title: t("components.quoteForm.quantity"),
      dataIndex: "quantity",
      render: (_, __, index) => (
        <Form.Item name={["articles", index, "quantity"]} noStyle>
          <InputNumber min={1} />
        </Form.Item>
      ),
    },
    {
      title: t("components.quoteForm.unitPrice"),
      dataIndex: "unitPrice",
      render: (_, __, index) => (
        <Form.Item name={["articles", index, "unitPrice"]} noStyle>
          <InputNumber min={0} />
        </Form.Item>
      ),
    },
    {
      title: t("components.quoteForm.discount"),
      dataIndex: "discount",
      render: (_, __, index) => (
        <Form.Item name={["articles", index, "discount"]} noStyle>
          <InputNumber min={0} max={100} formatter={(v) => `${v}%`} />
        </Form.Item>
      ),
    },
    {
      title: t("components.quoteForm.vat"),
      dataIndex: "vat",
      render: (_, __, index) => (
        <Form.Item name={["articles", index, "vat"]} noStyle>
          <Select>
            <Option value={19}>19%</Option>
            <Option value={7}>7%</Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      title: t("components.quoteForm.totalHT"),
      dataIndex: "total",
      render: (_, __, index) => {
        const item = articles[index] || {};
        const price = (item.unitPrice || 0) * (item.quantity || 1);
        const discount = ((item.discount || 0) / 100) * price;
        const total = price - discount;
        return <span>{total.toFixed(3)} DT</span>;
      },
    },
  ];

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={t("components.quoteForm.client")}
            name="clientId"
            rules={[{ required: true, message: t("components.quoteForm.clientRequired") }]}
          >
            <Select
              placeholder={t("components.quoteForm.selectClient")}
              size="large"
              onChange={handleClientChange}
            >
              {clients.map((client) => (
                <Option key={client.id} value={client.id}>
                  {client.fullName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label={t("components.quoteForm.email")} name="email">
            <Input placeholder={t("components.quoteForm.emailPlaceholder")} size="large" />
          </Form.Item>

          <Form.Item label={t("components.quoteForm.address")} name="address">
            <Input.TextArea
              rows={2}
              placeholder={t("components.quoteForm.addressPlaceholder")}
              size="large"
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label={t("components.quoteForm.quoteNumber")} name="quoteNumber">
            <Input placeholder={t("components.quoteForm.quoteNumberPlaceholder")} size="large" />
          </Form.Item>

          <Form.Item label={t("components.quoteForm.phone")} name="phone">
            <Input placeholder={t("components.quoteForm.phonePlaceholder")} size="large" />
          </Form.Item>

          <Form.Item label={t("components.quoteForm.taxNumber")} name="taxNumber">
            <Input placeholder={t("components.quoteForm.taxNumberPlaceholder")} size="large" />
          </Form.Item>
        </Col>
      </Row>

      <h3>{t("components.quoteForm.articles")}</h3>

      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={addArticle}
        style={{ marginBottom: 16 }}
      >
        {t("components.quoteForm.addArticle")}
      </Button>

      <Table
        dataSource={articles}
        columns={columns}
        pagination={false}
        rowKey={(record) => record.key || record.reference || Math.random()}
      />

      <div style={{ textAlign: "right", marginTop: 24 }}>
        <Button type="primary" htmlType="submit" size="large" style={{ backgroundColor: PRIMARY }}>
          {t("components.quoteForm.previewButton")}
        </Button>
      </div>
    </Form>
  );
};

export default QuoteForm;
