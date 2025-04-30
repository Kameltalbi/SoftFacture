import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Radio,
  Button,
  message
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useWatch } from "antd/es/form/Form";

import {
  setInvoiceNumbering,
  selectInvoiceNumbering,
  setLoading
} from "../../container/redux/slices/settingsSlice";

const { Option } = Select;

const InvoiceNumberSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const invoiceNumbering = useSelector(selectInvoiceNumbering);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  // Watch all form fields for live preview updates
  const watchedValues = useWatch([], form);

  useEffect(() => {
    form.setFieldsValue(invoiceNumbering);
  }, [invoiceNumbering, form]);

  const onFinish = (values) => {
    setIsLoading(true);
    dispatch(setLoading(true));

    // Simulate API call
    setTimeout(() => {
      dispatch(setInvoiceNumbering(values));
      dispatch(setLoading(false));
      setIsLoading(false);
      message.success(t("components.invoiceNumberSettings.saveSuccess"));
      console.log("Updated invoice numbering settings:", values);
    }, 1000);
  };

  const previewText = useMemo(() => {
    const { prefix, nextNumber, numberOfDigits, suffix } = watchedValues || {};
    const padded = String(nextNumber || 1).padStart(numberOfDigits || 4, "0");
    return `${prefix || ""}${padded}${suffix || ""}`;
  }, [watchedValues]);

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={t("components.invoiceNumberSettings.cardTitle")}
        style={{
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          padding: 16
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={invoiceNumbering}
          onFinish={onFinish}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
          >
            <Form.Item
              name="prefix"
              label={t("components.invoiceNumberSettings.prefixLabel")}
            >
              <Input placeholder="FACT-" />
            </Form.Item>

            <Form.Item
              name="suffix"
              label={t("components.invoiceNumberSettings.suffixLabel")}
            >
              <Input placeholder="-FR" />
            </Form.Item>

            <Form.Item
              name="numberOfDigits"
              label={t("components.invoiceNumberSettings.digitsLabel")}
              rules={[
                {
                  required: true,
                  message: t("components.invoiceNumberSettings.digitsRequired")
                }
              ]}
            >
              <Select placeholder="Select number of digits">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <Option key={num} value={num}>
                    {num}{" "}
                    {num > 1
                      ? t("components.invoiceNumberSettings.digits")
                      : t("components.invoiceNumberSettings.digit")}{" "}
                    – Ex: {String(1).padStart(num, "0")}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="nextNumber"
              label={t("components.invoiceNumberSettings.nextNumberLabel")}
              rules={[
                {
                  required: true,
                  type: "number",
                  min: 1,
                  message: t(
                    "components.invoiceNumberSettings.nextNumberRequired"
                  )
                }
              ]}
            >
              <InputNumber style={{ width: "100%" }} min={1} />
            </Form.Item>
          </div>

          <Form.Item
            name="resetPeriod"
            label={t("components.invoiceNumberSettings.resetPeriodLabel")}
          >
            <Radio.Group>
              <Radio value="annual">
                {t("components.invoiceNumberSettings.annual")}
              </Radio>
              <Radio value="monthly">
                {t("components.invoiceNumberSettings.monthly")}
              </Radio>
            </Radio.Group>
          </Form.Item>

          <div
            style={{
              background: "#f5f5f5",
              padding: 16,
              borderRadius: 6,
              marginTop: 16
            }}
          >
            <p style={{ fontWeight: 500 }}>
              {t("components.invoiceNumberSettings.previewLabel")}
            </p>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{previewText}</div>
            <p style={{ color: "#999", marginTop: 4 }}>
              {t("components.invoiceNumberSettings.previewDescription")}
            </p>
          </div>

          <div
            style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              icon={<SaveOutlined />}
            >
              {t("components.invoiceNumberSettings.saveButton")}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default InvoiceNumberSettings;
