import React, { useState, useEffect } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setCompanyInfo, setLoading, selectCompanyInfo } from '../../container/redux/slices/settingsSlice';
import { PRIMARY } from "../../utils/constants/colors";

const { TextArea } = Input;

const CompanyInfoSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const companyInfo = useSelector(selectCompanyInfo);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Populate form with company data from Redux store when the component is mounted
    form.setFieldsValue(companyInfo);
  }, [companyInfo, form]);

  const onFinish = (values) => {
    setIsLoading(true);
    dispatch(setLoading(true));

    // Simulate an API call to save company data
    setTimeout(() => {
      dispatch(setCompanyInfo(values));
      dispatch(setLoading(false));
      setIsLoading(false);
      message.success(t("components.companySettings.saveSuccess"));
      console.log("Company data updated:", values);
    }, 1000);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={t("components.companySettings.cardTitle")}
        style={{
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          padding: 16,
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={companyInfo}
          onFinish={onFinish}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <Form.Item
              name="name"
              label={t("components.companySettings.nameLabel")}
              rules={[{ required: true, message: t("components.companySettings.nameRequired") }]}
            >
              <Input placeholder={t("components.companySettings.namePlaceholder")} />
            </Form.Item>

            <Form.Item
              name="vatNumber"
              label={t("components.companySettings.vatNumberLabel")}
            >
              <Input placeholder={t("components.companySettings.vatNumberPlaceholder")} />
            </Form.Item>

            <Form.Item
              name="email"
              label={t("components.companySettings.emailLabel")}
              rules={[{ type: "email", message: t("components.companySettings.emailInvalid") }]}
            >
              <Input placeholder={t("components.companySettings.emailPlaceholder")} />
            </Form.Item>

            <Form.Item
              name="phone"
              label={t("components.companySettings.phoneLabel")}
            >
              <Input placeholder={t("components.companySettings.phonePlaceholder")} />
            </Form.Item>
          </div>

          <Form.Item
            name="address"
            label={t("components.companySettings.addressLabel")}
          >
            <TextArea
              placeholder={t("components.companySettings.addressPlaceholder")}
              rows={4}
            />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              style={{ backgroundColor: PRIMARY }}
              icon={<SaveOutlined />}
            >
              {t("components.companySettings.saveButton")}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CompanyInfoSettings;
