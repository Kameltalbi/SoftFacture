import React, { useState } from "react";
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
  const products = useSelector((state) => state.products.products);

  const [selectedClient, setSelectedClient] = useState(null);

  const handleClientChange = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      form.setFieldsValue({
        clientId: client.id,
        fullName: client.fullName,
        phone: client.phone,
        email: client.email,
        address: client.address,
        taxNumber: client.taxNumber,
      });
    }
  };

  const handleProductSelect = (productId, index) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const currentArticles = form.getFieldValue("articles") || [];
    currentArticles[index] = {
      ...currentArticles[index],
      reference: product.id,
      description: product.name,
      unitPrice: product.unitPrice,
      vat: product.vat || 0,
      discount: product.discount || 0,
      quantity: 1,
    };
    form.setFieldsValue({ articles: currentArticles });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={t("components.quoteForm.client")}
            name="clientId"
            rules={[
              {
                required: true,
                message: t("components.quoteForm.clientRequired"),
              },
            ]}
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

          {selectedClient && (
            <div
              style={{
                backgroundColor: "#f5f5f5",
                padding: "8px",
                borderRadius: "12px",
                border: "1px solid #d9d9d9",
                marginTop: "16px",
              }}
            >
              <p>
                <strong>{t("components.quoteForm.email")}:</strong>{" "}
                {selectedClient.email}
              </p>
              <p>
                <strong>{t("components.quoteForm.phone")}:</strong>{" "}
                {selectedClient.phone}
              </p>
              <p>
                <strong>{t("components.quoteForm.address")}:</strong>{" "}
                {selectedClient.address}
              </p>
              <p>
                <strong>{t("components.quoteForm.taxNumber")}:</strong>{" "}
                {selectedClient.taxNumber}
              </p>
            </div>
          )}
        </Col>

        <Col span={12}>
          <Form.Item
            label={t("components.quoteForm.quoteNumber")}
            name="quoteNumber"
          >
            <Input
              placeholder={t("components.quoteForm.quoteNumberPlaceholder")}
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>

      <h3>{t("components.quoteForm.articles")}</h3>

      <Form.List name="articles">
        {(fields, { add }) => (
          <>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => add()}
              style={{ marginBottom: 16 }}
            >
              {t("components.quoteForm.addArticle")}
            </Button>

            <Table
              dataSource={fields}
              pagination={false}
              rowKey={(field) => field.key}
              columns={[
                {
                  title: t("components.quoteForm.product"),
                  dataIndex: "product",
                  render: (_, __, index) => (
                    <Form.Item
                      name={[index, "product"]}
                      noStyle
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder={t("components.quoteForm.selectProduct")}
                        onChange={(value) => handleProductSelect(value, index)}
                        style={{ width: "100%" }}
                      >
                        {products.map((product) => (
                          <Option key={product.id} value={product.id}>
                           {product.name} -  {product.id} 
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ),
                },
                {
                  title: t("components.quoteForm.quantity"),
                  dataIndex: "quantity",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "quantity"]} noStyle>
                      <InputNumber min={1} />
                    </Form.Item>
                  ),
                },
                {
                  title: t("components.quoteForm.unitPrice"),
                  dataIndex: "unitPrice",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "unitPrice"]} noStyle>
                      <InputNumber min={0} />
                    </Form.Item>
                  ),
                },
                {
                  title: t("components.quoteForm.discount"),
                  dataIndex: "discount",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "discount"]} noStyle>
                      <InputNumber
                        min={0}
                        max={100}
                        formatter={(v) => `${v}%`}
                      />
                    </Form.Item>
                  ),
                },
                {
                  title: t("components.quoteForm.vat"),
                  dataIndex: "vat",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "vat"]} noStyle>
                      <InputNumber
                        min={0}
                        max={100}
                        formatter={(v) => `${v}%`}
                      />
                    </Form.Item>
                  ),
                },
                {
                  title: t("components.quoteForm.totalHT"),
                  dataIndex: "total",
                  render: (_, __, index) => (
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const items = form.getFieldValue("articles") || [];
                        const item = items[index];
                        const price =
                          (item?.unitPrice || 0) * (item?.quantity || 1);
                        const discount = (item?.discount || 0) / 100;
                        const vat = price * (item?.vat || 0) / 100;
                        const total = price - price * discount+ vat;
                        return <span>{total.toFixed(3)} DT</span>;
                      }}
                    </Form.Item>
                  ),
                },
              ]}
            />
          </>
        )}
      </Form.List>

      <div style={{ textAlign: "right", marginTop: 24 }}>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          style={{ backgroundColor: PRIMARY }}
        >
          {t("components.quoteForm.previewButton")}
        </Button>
      </div>
    </Form>
  );
};

export default QuoteForm;
