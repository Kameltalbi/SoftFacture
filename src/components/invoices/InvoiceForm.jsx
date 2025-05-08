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

const InvoiceForm = ({ form, onFinish }) => {
  const { t } = useTranslation();
  const clients = useSelector((state) => state.clients.clients);

  const addArticle = () => {
    const articles = form.getFieldValue("articles") || [];
    form.setFieldsValue({
      articles: [...articles, { key: Date.now() }],
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

  const columns = [
    {
      title: t("components.invoiceForm.reference"),
      dataIndex: "reference",
      render: (_, __, index) => (
        <Form.Item name={["articles", index, "reference"]} noStyle>
          <Select
            placeholder={t("components.invoiceForm.selectReference")}
            style={{ width: "100%" }}
          >
            <Option value="ref1">Ref 1</Option>
            <Option value="ref2">Ref 2</Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      title: t("components.invoiceForm.description"),
      dataIndex: "description",
      render: (_, __, index) => (
        <Form.Item name={["articles", index, "description"]} noStyle>
          <Input placeholder={t("components.invoiceForm.description")} />
        </Form.Item>
      ),
    },
    {
      title: t("components.invoiceForm.quantity"),
      dataIndex: "quantity",
      render: (_, __, index) => (
        <Form.Item name={["articles", index, "quantity"]} noStyle initialValue={1}>
          <InputNumber min={1} />
        </Form.Item>
      ),
    },
    {
      title: t("components.invoiceForm.unitPrice"),
      dataIndex: "unitPrice",
      render: (_, __, index) => (
        <Form.Item name={["articles", index, "unitPrice"]} noStyle initialValue={0}>
          <InputNumber min={0} />
        </Form.Item>
      ),
    },
    {
      title: t("components.invoiceForm.discount"),
      dataIndex: "discount",
      render: (_, __, index) => (
        <Form.Item name={["articles", index, "discount"]} noStyle initialValue={0}>
          <InputNumber min={0} max={100} formatter={(v) => `${v}%`} />
        </Form.Item>
      ),
    },
    {
      title: t("components.invoiceForm.vat"),
      dataIndex: "vat",
      render: (_, __, index) => (
        <Form.Item name={["articles", index, "vat"]} noStyle initialValue={19}>
          <Select>
            <Option value={19}>19%</Option>
            <Option value={7}>7%</Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      title: t("components.invoiceForm.totalHT"),
      dataIndex: "total",
      render: (_, __, index) => (
        <Form.Item shouldUpdate noStyle>
          {() => {
            const articles = form.getFieldValue("articles") || [];
            const item = articles[index];
            const price = (item?.unitPrice || 0) * (item?.quantity || 1);
            const discount = (item?.discount || 0) / 100;
            const total = price - price * discount;
            return <span>{total.toFixed(3)} DT</span>;
          }}
        </Form.Item>
      ),
    },
  ];

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={t("components.invoiceForm.client")}
            name="clientId"
            rules={[{ required: true, message: t("components.invoiceForm.clientRequired") }]}
          >
            <Select
              placeholder={t("components.invoiceForm.selectClient")}
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

          <Form.Item label={t("components.invoiceForm.email")} name="email">
            <Input placeholder={t("components.invoiceForm.emailPlaceholder")} size="large" />
          </Form.Item>

          <Form.Item label={t("components.invoiceForm.address")} name="address">
            <Input.TextArea
              rows={2}
              placeholder={t("components.invoiceForm.addressPlaceholder")}
              size="large"
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label={t("components.invoiceForm.invoiceNumber")} name="invoiceNumber">
            <Input placeholder={t("components.invoiceForm.invoiceNumberPlaceholder")} size="large" />
          </Form.Item>

          <Form.Item label={t("components.invoiceForm.phone")} name="phone">
            <Input placeholder={t("components.invoiceForm.phonePlaceholder")} size="large" />
          </Form.Item>

          <Form.Item label={t("components.invoiceForm.taxNumber")} name="taxNumber">
            <Input placeholder={t("components.invoiceForm.taxNumberPlaceholder")} size="large" />
          </Form.Item>
        </Col>
      </Row>

      <h3>{t("components.invoiceForm.articles")}</h3>

      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={addArticle}
        style={{ marginBottom: 16 }}
      >
        {t("components.invoiceForm.addArticle")}
      </Button>

      <Table
        dataSource={form.getFieldValue("articles")}
        columns={columns}
        pagination={false}
        rowKey={(record) => record.key}
      />

      <div style={{ textAlign: "right", marginTop: 24 }}>
        <Button type="primary" htmlType="submit" size="large" style={{backgroundColor: PRIMARY}}>
          {t("components.invoiceForm.previewButton")}
        </Button>
      </div>
    </Form>
  );
};

export default InvoiceForm;
