import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Spin,
  Alert,
  Grid,
  Space,
  Upload,
} from "antd";
import {
  SaveOutlined,
  UploadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompanyInfo,
  updateCompanyInfo,
  selectCompanyInfo,
  selectLoading,
  selectError,
  clearError,
} from "../../container/redux/slices/settingsSlice";
import * as Colors from "../../utils/constants/colors";

const { useBreakpoint } = Grid;
const { TextArea } = Input;

const CompanySettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const company = useSelector(selectCompanyInfo);
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [form] = Form.useForm();
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchCompanyInfo());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (company) {
      form.setFieldsValue({
        name: company.name,
        address: company.address,
        postalCode: company.postalCode,
        city: company.city,
        country: company.country,
        phone: company.phone,
        email: company.email,
        website: company.website,
        siret: company.siret,
        tvaNumber: company.tvaNumber,
        capital: company.capital,
        legalForm: company.legalForm,
        rcs: company.rcs,
        iban: company.iban,
        bic: company.bic,
      });
      if (company.logo) {
        setLogoPreview(company.logo);
      }
    }
  }, [company, form]);

  const handleUpdateCompany = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined) {
          formData.append(key, values[key]);
        }
      });
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      await dispatch(updateCompanyInfo(formData)).unwrap();
      message.success(t("components.companySettings.updateSuccess"));
      setLogoFile(null);
    } catch (error) {
      message.error(error || t("components.companySettings.updateError"));
    }
  };

  const handleLogoChange = (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }
    if (info.file.status === "done") {
      setUploading(false);
      setLogoFile(info.file.originFileObj);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <UploadOutlined />}
      <div style={{ marginTop: 8 }}>{t("components.companySettings.upload")}</div>
    </div>
  );

  if (isLoading && !company) {
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
        onFinish={handleUpdateCompany}
        layout="vertical"
        initialValues={company}
      >
        <Card
          title={t("components.companySettings.cardTitle")}
          style={{
            borderRadius: 8,
            backgroundColor: Colors.WHITE,
            boxShadow: `0 2px 8px ${Colors.LIGHT_GRAY}`,
            marginBottom: isMobile ? 16 : 24,
            padding: isMobile ? 12 : 16,
          }}
        >
          <Row gutter={[isMobile ? 0 : 24, isMobile ? 16 : 24]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label={t("components.companySettings.nameLabel")}
                rules={[
                  {
                    required: true,
                    message: t("components.companySettings.nameRequired"),
                  },
                ]}
              >
                <Input 
                  placeholder={t("components.companySettings.namePlaceholder")}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="legalForm"
                label={t("components.companySettings.legalFormLabel")}
                rules={[
                  {
                    required: true,
                    message: t("components.companySettings.legalFormRequired"),
                  },
                ]}
              >
                <Input 
                  placeholder={t("components.companySettings.legalFormPlaceholder")}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="address"
                label={t("components.companySettings.addressLabel")}
                rules={[
                  {
                    required: true,
                    message: t("components.companySettings.addressRequired"),
                  },
                ]}
              >
                <TextArea 
                  placeholder={t("components.companySettings.addressPlaceholder")}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="postalCode"
                label={t("components.companySettings.postalCodeLabel")}
                rules={[
                  {
                    required: true,
                    message: t("components.companySettings.postalCodeRequired"),
                  },
                ]}
              >
                <Input 
                  placeholder={t("components.companySettings.postalCodePlaceholder")}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="city"
                label={t("components.companySettings.cityLabel")}
                rules={[
                  {
                    required: true,
                    message: t("components.companySettings.cityRequired"),
                  },
                ]}
              >
                <Input 
                  placeholder={t("components.companySettings.cityPlaceholder")}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="country"
                label={t("components.companySettings.countryLabel")}
                rules={[
                  {
                    required: true,
                    message: t("components.companySettings.countryRequired"),
                  },
                ]}
              >
                <Input 
                  placeholder={t("components.companySettings.countryPlaceholder")}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="phone"
                label={t("components.companySettings.phoneLabel")}
                rules={[
                  {
                    required: true,
                    message: t("components.companySettings.phoneRequired"),
                  },
                ]}
              >
                <Input 
                  placeholder={t("components.companySettings.phonePlaceholder")}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="email"
                label={t("components.companySettings.emailLabel")}
                rules={[
                  {
                    required: true,
                    message: t("components.companySettings.emailRequired"),
                  },
                  {
                    type: "email",
                    message: t("components.companySettings.emailInvalid"),
                  },
                ]}
              >
                <Input 
                  placeholder={t("components.companySettings.emailPlaceholder")}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="website"
                label={t("components.companySettings.websiteLabel")}
              >
                <Input 
                  placeholder={t("components.companySettings.websitePlaceholder")}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="siret"
                label={t("components.companySettings.siretLabel")}
                rules={[
                  {
                    required: true,
                    message: t("components.companySettings.siretRequired"),
                  },
                ]}
              >
                <Input 
                  placeholder={t("components.companySettings.siretPlaceholder")}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="tvaNumber"
                label={t("components.companySettings.tvaNumberLabel")}
                rules={[
                  {
                    required: true,
                    message: t("components.companySettings.tvaNumberRequired"),
                  },
                ]}
              >
                <Input 
                  placeholder={t("components.companySettings.tvaNumberPlaceholder")}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="capital"
                label={t("components.companySettings.capitalLabel")}
                rules={[
                  {
                    required: true,
                    message: t("components.companySettings.capitalRequired"),
                  },
                ]}
              >
                <Input 
                  placeholder={t("components.companySettings.capitalPlaceholder")}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="rcs"
                label={t("components.companySettings.rcsLabel")}
                rules={[
                  {
                    required: true,
                    message: t("components.companySettings.rcsRequired"),
                  },
                ]}
              >
                <Input 
                  placeholder={t("components.companySettings.rcsPlaceholder")}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="iban"
                label={t("components.companySettings.ibanLabel")}
                rules={[
                  {
                    required: true,
                    message: t("components.companySettings.ibanRequired"),
                  },
                ]}
              >
                <Input 
                  placeholder={t("components.companySettings.ibanPlaceholder")}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="bic"
                label={t("components.companySettings.bicLabel")}
                rules={[
                  {
                    required: true,
                    message: t("components.companySettings.bicRequired"),
                  },
                ]}
              >
                <Input 
                  placeholder={t("components.companySettings.bicPlaceholder")}
                  size={isMobile ? "middle" : "large"}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={t("components.companySettings.logoLabel")}
                name="logo"
              >
                <Upload
                  name="logo"
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleLogoChange}
                >
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="logo"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
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
              {t("components.companySettings.save")}
            </Button>
          </Form.Item>
        </Card>
      </Form>
    </div>
  );
};

export default CompanySettings;
