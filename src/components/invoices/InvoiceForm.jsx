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
import { LIGHT_GRAY, PRIMARY } from "../../utils/constants/colors";

const { Option } = Select;

const InvoiceForm = ({ form, onFinish }) => {
  const { t } = useTranslation();
  const clients = useSelector((state) => state.clients.clients);
  const products = useSelector((state) => state.products.products);

  const [selectedClient, setSelectedClient] = useState(null);

  // Set default invoice number
  form.setFieldsValue({ invoiceNumber: "INV-0004-01" });

  const handleClientChange = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      form.setFieldsValue({
        clientId: client.id,
        fullName: client.fullName,
        taxNumber: client.taxNumber,
      });
    }
  };

  const handleProductSelect = (productId, index) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const currentProducts = form.getFieldValue("products") || [];
    currentProducts[index] = {
      ...currentProducts[index],
      reference: product.id,
      productName: product.name,
      unitPrice: product.unitPrice,
      vat: product.vat || 0,
      discount: product.discount || 0,
      quantity: 1,
    };
    form.setFieldsValue({ products: currentProducts });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={t("components.invoiceForm.client")}
            name="clientId"
            rules={[
              {
                required: true,
                message: t("components.invoiceForm.clientRequired"),
              },
            ]}
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

          {selectedClient && (
            <div
              style={{
                backgroundColor: LIGHT_GRAY,
                padding: "8px",
                borderRadius: "12px",
                border: "1px solid #d9d9d9",
                marginTop: "16px",
              }}
            >
              <p>
                <strong>{t("components.invoiceForm.email")}:</strong>{" "}
                {selectedClient.email}
              </p>
              <p>
                <strong>{t("components.invoiceForm.phone")}:</strong>{" "}
                {selectedClient.phone}
              </p>
              <p>
                <strong>{t("components.invoiceForm.address")}:</strong>{" "}
                {selectedClient.address}
              </p>
              <p>
                <strong>{t("components.invoiceForm.taxNumber")}:</strong>{" "}
                {selectedClient.taxNumber}
              </p>
            </div>
          )}
        </Col>

        <Col span={12}>
          <Form.Item
            label={t("components.invoiceForm.invoiceNumber")}
            name="invoiceNumber"
          >
            <Input
              placeholder={t("components.invoiceForm.invoiceNumberPlaceholder")}
              size="large"
              disabled
            />
          </Form.Item>
        </Col>
      </Row>

      <h3>{t("components.invoiceForm.products")}</h3>

      <Form.List name="products">
        {(fields, { add }) => (
          <>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => add()}
              style={{ marginBottom: 16 }}
            >
              {t("components.invoiceForm.addProducts")}
            </Button>

            <Table
              dataSource={fields}
              pagination={false}
              rowKey={(field) => field.key}
              columns={[
                {
                  title: t("components.invoiceForm.product"),
                  dataIndex: "reference",
                  render: (_, __, index) => (
                    <Form.Item
                      name={[index, "reference"]}
                      noStyle
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder={t(
                          "components.invoiceForm.selectReference"
                        )}
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
                  title: t("components.invoiceForm.quantity"),
                  dataIndex: "quantity",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "quantity"]} noStyle>
                      <InputNumber min={1} />
                    </Form.Item>
                  ),
                },
                {
                  title: t("components.invoiceForm.unitPrice"),
                  dataIndex: "unitPrice",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "unitPrice"]} noStyle>
                      <InputNumber min={0} />
                    </Form.Item>
                  ),
                },
                {
                  title: t("components.invoiceForm.discount"),
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
                  title: t("components.invoiceForm.vat"),
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
                  title: t("components.invoiceForm.totalHT"),
                  dataIndex: "total",
                  render: (_, __, index) => (
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const items = form.getFieldValue("products") || [];
                        const item = items[index];
                        const price =
                          (item?.unitPrice || 0) * (item?.quantity || 1);
                        const discount = (item?.discount || 0) / 100;
                        const total = price - price * discount;
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
          {t("components.invoiceForm.previewButton")}
        </Button>
      </div>
    </Form>
  );
};

export default InvoiceForm;
