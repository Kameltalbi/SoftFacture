import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Row,
  Col,
  Spin,
  Alert,
  Grid,
  Space,
  Switch,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInvoiceSettings,
  updateInvoiceSettings,
  selectInvoiceSettings,
  selectLoading,
  selectError,
  clearError,
} from "../../container/redux/slices/settingsSlice";
import * as Colors from "../../utils/constants/colors";

const { useBreakpoint } = Grid;
const { TextArea } = Input;

const InvoiceSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const invoiceSettings = useSelector(selectInvoiceSettings);
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchInvoiceSettings());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (invoiceSettings) {
      form.setFieldsValue({
        prefix: invoiceSettings.prefix,
        nextNumber: invoiceSettings.nextNumber,
        defaultDueDays: invoiceSettings.defaultDueDays,
        defaultNotes: invoiceSettings.defaultNotes,
        defaultTerms: invoiceSettings.defaultTerms,
        showLogo: invoiceSettings.showLogo,
        showPaymentInfo: invoiceSettings.showPaymentInfo,
        showCompanyInfo: invoiceSettings.showCompanyInfo,
        showCustomerInfo: invoiceSettings.showCustomerInfo,
        showInvoiceNumber: invoiceSettings.showInvoiceNumber,
        showInvoiceDate: invoiceSettings.showInvoiceDate,
        showDueDate: invoiceSettings.showDueDate,
        showPaymentStatus: invoiceSettings.showPaymentStatus,
        showTaxDetails: invoiceSettings.showTaxDetails,
        showSubtotal: invoiceSettings.showSubtotal,
        showTotal: invoiceSettings.showTotal,
      });
    }
  }, [invoiceSettings, form]);

  const handleUpdateSettings = async (values) => {
    try {
      await dispatch(updateInvoiceSettings(values)).unwrap();
      message.success(t("components.invoiceSettings.updateSuccess"));
    } catch (error) {
      message.error(error || t("components.invoiceSettings.updateError"));
    }
  };

  if (isLoading && !invoiceSettings) {
    return (
      <div style={{ padding: isMobile ? 16 : 24, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? 0 : 24 }}>
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: isMobile ? 16 : 24 }}
          closable
          onClose={() => dispatch(clearError())}
        />
      )}

      <Form
        form={form}
        onFinish={handleUpdateSettings}
        layout="vertical"
        initialValues={invoiceSettings}
      >
        <Card
          title={t("components.invoiceSettings.cardTitle")}
          style={{
            borderRadius: 8,
            backgroundColor: Colors.WHITE,
            boxShadow: `0 2px 8px ${Colors.LIGHT_GRAY}`,
            marginBottom: isMobile ? 16 : 24,
            padding: isMobile ? 12 : 16,
          }}
        >
          <Row gutter={[isMobile ? 0 : 24, isMobile ? 16 : 24]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="prefix"
                label={t("components.invoiceSettings.prefixLabel")}
                rules={[
                  {
                    required: true,
                    message: t("components.invoiceSettings.prefixRequired"),
                  },
                ]}
              >
                <Input 
                  placeholder={t("components.invoiceSettings.prefixPlaceholder")}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="nextNumber"
                label={t("components.invoiceSettings.nextNumberLabel")}
                rules={[
                  {
                    required: true,
                    message: t("components.invoiceSettings.nextNumberRequired"),
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  placeholder={t("components.invoiceSettings.nextNumberPlaceholder")}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="defaultDueDays"
                label={t("components.invoiceSettings.defaultDueDaysLabel")}
                rules={[
                  {
                    required: true,
                    message: t("components.invoiceSettings.defaultDueDaysRequired"),
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder={t("components.invoiceSettings.defaultDueDaysPlaceholder")}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="defaultNotes"
                label={t("components.invoiceSettings.defaultNotesLabel")}
              >
                <TextArea
                  placeholder={t("components.invoiceSettings.defaultNotesPlaceholder")}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="defaultTerms"
                label={t("components.invoiceSettings.defaultTermsLabel")}
              >
                <TextArea
                  placeholder={t("components.invoiceSettings.defaultTermsPlaceholder")}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Card
                title={t("components.invoiceSettings.displayOptionsTitle")}
                style={{
                  backgroundColor: Colors.LIGHT_GRAY,
                  borderRadius: 8,
                }}
              >
                <Row gutter={[isMobile ? 0 : 24, isMobile ? 16 : 24]}>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="showLogo"
                      label={t("components.invoiceSettings.showLogoLabel")}
                      valuePropName="checked"
                    >
                      <Switch size={isMobile ? "small" : "default"} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="showPaymentInfo"
                      label={t("components.invoiceSettings.showPaymentInfoLabel")}
                      valuePropName="checked"
                    >
                      <Switch size={isMobile ? "small" : "default"} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="showCompanyInfo"
                      label={t("components.invoiceSettings.showCompanyInfoLabel")}
                      valuePropName="checked"
                    >
                      <Switch size={isMobile ? "small" : "default"} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="showCustomerInfo"
                      label={t("components.invoiceSettings.showCustomerInfoLabel")}
                      valuePropName="checked"
                    >
                      <Switch size={isMobile ? "small" : "default"} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="showInvoiceNumber"
                      label={t("components.invoiceSettings.showInvoiceNumberLabel")}
                      valuePropName="checked"
                    >
                      <Switch size={isMobile ? "small" : "default"} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="showInvoiceDate"
                      label={t("components.invoiceSettings.showInvoiceDateLabel")}
                      valuePropName="checked"
                    >
                      <Switch size={isMobile ? "small" : "default"} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="showDueDate"
                      label={t("components.invoiceSettings.showDueDateLabel")}
                      valuePropName="checked"
                    >
                      <Switch size={isMobile ? "small" : "default"} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="showPaymentStatus"
                      label={t("components.invoiceSettings.showPaymentStatusLabel")}
                      valuePropName="checked"
                    >
                      <Switch size={isMobile ? "small" : "default"} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="showTaxDetails"
                      label={t("components.invoiceSettings.showTaxDetailsLabel")}
                      valuePropName="checked"
                    >
                      <Switch size={isMobile ? "small" : "default"} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="showSubtotal"
                      label={t("components.invoiceSettings.showSubtotalLabel")}
                      valuePropName="checked"
                    >
                      <Switch size={isMobile ? "small" : "default"} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      name="showTotal"
                      label={t("components.invoiceSettings.showTotalLabel")}
                      valuePropName="checked"
                    >
                      <Switch size={isMobile ? "small" : "default"} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: isMobile ? 16 : 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoading}
              style={{
                backgroundColor: Colors.PRIMARY,
                width: isMobile ? '100%' : 'auto'
              }}
              size={isMobile ? "middle" : "large"}
            >
              {t("components.invoiceSettings.save")}
            </Button>
          </Form.Item>
        </Card>
      </Form>
    </div>
  );
};

export default InvoiceSettings; 