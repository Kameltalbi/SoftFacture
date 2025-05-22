import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Table,
  Select,
  InputNumber,
  Card,
  Spin,
  Alert,
  Typography,
  Tooltip,
  Checkbox,
  DatePicker,
} from "antd";
import { 
  PlusOutlined, 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  IdcardOutlined,
  ShoppingOutlined,
  TagOutlined,
  DollarOutlined,
  PercentageOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { LIGHT_GRAY, PRIMARY, DARK_BLUE } from "../../utils/constants/colors";
import { invoiceAPI } from "../../services/api";
import { fetchClients } from "../../container/redux/slices/clientsSlice";
import { fetchProducts } from "../../container/redux/slices/productsSlice";
import dayjs from "dayjs";

const { Option } = Select;
const { Text } = Typography;

const InvoiceForm = ({ form, onFinish }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clients.clients);
  const clientsLoading = useSelector((state) => state.clients.loading);
  const clientsError = useSelector((state) => state.clients.error);
  const products = useSelector((state) => state.products.products);
  const productsLoading = useSelector((state) => state.products.loading);
  const productsError = useSelector((state) => state.products.error);
  const company = useSelector((state) => state.settings.company);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSearchValue, setClientSearchValue] = useState("");
  const [productSearchValue, setProductSearchValue] = useState("");
  const requestInProgress = useRef(false);

  useEffect(() => {
    // Fetch clients and products if not already loaded
    if (clients.length === 0) {
      dispatch(fetchClients());
    }
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
    // Fetch company info if not already loaded
    if (!company) {
      dispatch({ type: 'settings/fetchCompanyInfo' });
    }
  }, [dispatch, clients.length, products.length, company]);

  useEffect(() => {
    const fetchInvoiceNumber = async () => {
      // Prevent duplicate requests
      if (requestInProgress.current) {
        return;
      }

      try {
        requestInProgress.current = true;
        
        // Check if we have a token
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.error('No access token found. Please log in.');
          return;
        }

        const response = await invoiceAPI.generateInvoiceNumber();
        
        // Check if we have a valid response with invoice number
        if (response?.data?.data?.invoice_number) {
          form.setFieldsValue({ invoiceNumber: response.data.data.invoice_number });
        } else {
          console.error('Invalid response format:', response);
          // Set a default value if needed
          form.setFieldsValue({ invoiceNumber: 'Loading...' });
        }
      } catch (error) {
        console.error('Error fetching invoice number:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        // Handle specific error cases
        if (error.response?.status === 401) {
          console.error('Authentication error. Please log in again.');
          // You might want to redirect to login or show a message
        } else if (error.response?.status === 403) {
          console.error('You do not have permission to generate invoice numbers.');
        } else if (error.response?.status === 500) {
          console.error('Server error while generating invoice number:', error.response?.data);
        }
        
        // Set a default value or error message
        form.setFieldsValue({ invoiceNumber: 'Error generating number' });
      } finally {
        requestInProgress.current = false;
      }
    };

    fetchInvoiceNumber();

    // Cleanup function
    return () => {
      requestInProgress.current = false;
    };
  }, [form]); // Only depend on form

  const handleClientSearch = (value) => {
    setClientSearchValue(value);
  };

  const handleClientChange = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      // Use fallback keys for each field
      const fullName = client.fullName || client.name || client.nom || '';
      const email = client.email || client.mail || '';
      const phone = client.phone || client.telephone || client.tel || '';
      const address = client.address || client.adresse || '';
      const fiscalId = client.fiscalId || client.fiscal_id || client.taxNumber || client.tax_number || client.fiscal || client.n_fiscal || '';
      const selected = {
        ...client,
        fullName,
        email,
        phone,
        address,
        fiscalId,
      };
      setSelectedClient(selected);
      console.log('Selected client:', selected);
      form.setFieldsValue({
        clientId: client.id,
        fullName,
        fiscalId,
        email,
        phone,
        address,
      });
    }
  };

  const handleProductSearch = (value) => {
    setProductSearchValue(value);
  };

  const handleProductSelect = (productId, index) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const currentProducts = form.getFieldValue("products") || [];
    const existingProduct = currentProducts.find(p => p.reference === productId);
    
    if (existingProduct) {
      // If product already exists, increment quantity
      const updatedProducts = currentProducts.map(p => {
        if (p.reference === productId) {
          return {
            ...p,
            quantity: (p.quantity || 1) + 1,
            unitPrice: product.price || 0,
            originalPrice: product.price || 0
          };
        }
        return p;
      });
      form.setFieldsValue({ products: updatedProducts });
    } else {
      // Add new product with original price stored
      const newProduct = {
        reference: product.id,
        productName: product.name,
        description: product.description || product.name,
        unitPrice: product.price || 0,
        originalPrice: product.price || 0,
        vat: product.TVA || 0,
        discount: product.discount || 0,
        quantity: 1,
      };
      
      // Update the form with the new product
      const updatedProducts = [...currentProducts];
      updatedProducts[index] = newProduct;
      form.setFieldsValue({ products: updatedProducts });
      
      // Force update the specific field to ensure the input shows the value
      form.setFieldValue(['products', index, 'unitPrice'], product.price || 0);
    }
  };

  const handleQuantityChange = (value, index) => {
    const currentProducts = form.getFieldValue("products") || [];
    currentProducts[index] = {
      ...currentProducts[index],
      quantity: value
    };
    form.setFieldsValue({ products: currentProducts });
  };

  const handlePriceChange = (value, index) => {
    const currentProducts = form.getFieldValue("products") || [];
    currentProducts[index] = {
      ...currentProducts[index],
      unitPrice: value
    };
    form.setFieldsValue({ products: currentProducts });
  };

  const handleDiscountChange = (value, index) => {
    const currentProducts = form.getFieldValue("products") || [];
    currentProducts[index] = {
      ...currentProducts[index],
      discount: value
    };
    form.setFieldsValue({ products: currentProducts });
  };

  const handleVatChange = (value, index) => {
    const currentProducts = form.getFieldValue("products") || [];
    currentProducts[index] = {
      ...currentProducts[index],
      vat: value
    };
    form.setFieldsValue({ products: currentProducts });
  };

  const filteredClients = clients.filter(client => {
    if (!client) return false;
    
    const searchValue = clientSearchValue.toLowerCase().trim();
    if (!searchValue) return true;

    const fullName = (client.fullName || '').toLowerCase();
    const email = (client.email || '').toLowerCase();
    const phone = (client.phone || '').toString();
    const taxNumber = (client.taxNumber || '').toString();

    return (
      fullName.includes(searchValue) ||
      email.includes(searchValue) ||
      phone.includes(searchValue) ||
      taxNumber.includes(searchValue)
    );
  });

  const filteredProducts = products.filter(product => {
    if (!product) return false;
    
    const searchValue = productSearchValue.toLowerCase().trim();
    if (!searchValue) return true;

    const name = (product.name || '').toLowerCase();
    const description = (product.description || '').toLowerCase();
    const reference = (product.id || '').toString();

    return (
      name.includes(searchValue) ||
      description.includes(searchValue) ||
      reference.includes(searchValue)
    );
  });

  const calculateLineTotal = (item) => {
    if (!item) return 0;
    const price = Number(item.unitPrice || 0) * Number(item.quantity || 1);
    const discount = Number(item.discount || 0) / 100;
    return price - (price * discount);
  };

  const calculateTotalHT = () => {
    const items = form.getFieldValue("products") || [];
    return items.reduce((sum, item) => {
      if (!item) return sum;
      return sum + calculateLineTotal(item);
    }, 0);
  };

  const calculateTotalTVA = () => {
    const items = form.getFieldValue("products") || [];
    return items.reduce((sum, item) => {
      if (!item) return sum;
      const lineTotal = calculateLineTotal(item);
      const vatRate = Number(item.vat || 0) / 100;
      return sum + (lineTotal * vatRate);
    }, 0);
  };

  const calculateTotalTTC = () => {
    const totalHT = calculateTotalHT();
    const totalTVA = calculateTotalTVA();
    return totalHT + totalTVA;
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      {/* Top section: two columns for company/client info and invoice number/date */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          {/* Company and client info card */}
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{company?.name || t("Votre Entreprise")}</div>
            <div style={{ fontSize: 14, color: '#555' }}>
              {company?.address || t("Adresse de l'entreprise")}
              <br />
              {company?.phone ? `Tél: ${company.phone}` : ''}
              {company?.email ? ` | Email: ${company.email}` : ''}
              <br />
              {company?.website ? company.website : ''}
              <br />
              {company?.vatNumber ? `MF: ${company.vatNumber}` : ''}
            </div>
          </Card>
          <Card style={{ marginBottom: 16 }}>
            <Form.Item
              label={t("components.invoiceForm.client")}
              name="clientId"
              rules={[{ required: true, message: t("components.invoiceForm.clientRequired") }]}
            >
              <Select
                showSearch
                placeholder={t("components.invoiceForm.selectClient")}
                size="large"
                onChange={handleClientChange}
                onSearch={handleClientSearch}
                loading={clientsLoading}
                filterOption={false}
                notFoundContent={clientsLoading ? <Spin size="small" /> : <Text type="secondary">{t("components.invoiceForm.noClientsFound")}</Text>}
              >
                {filteredClients.map((client) => (
                  <Option key={client.id} value={client.id}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{client.fullName}</div>
                      {client.email && <div style={{ fontSize: '12px', color: '#666' }}>{client.email}</div>}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {selectedClient && (
              <Card size="small" style={{ marginTop: 12, backgroundColor: LIGHT_GRAY, border: "1px solid #d9d9d9" }}>
                <div style={{ color: DARK_BLUE }}>
                  <div style={{ marginBottom: 8 }}>
                    <UserOutlined style={{ marginRight: 8 }} />
                    <Text strong>{selectedClient.fullName}</Text>
                  </div>
                  {selectedClient.email && (
                    <div style={{ marginBottom: 8 }}>
                      <MailOutlined style={{ marginRight: 8 }} />
                      <Text>{selectedClient.email}</Text>
                    </div>
                  )}
                  {selectedClient.phone && (
                    <div style={{ marginBottom: 8 }}>
                      <PhoneOutlined style={{ marginRight: 8 }} />
                      <Text>{selectedClient.phone}</Text>
                    </div>
                  )}
                  {selectedClient.address && (
                    <div style={{ marginBottom: 8 }}>
                      <EnvironmentOutlined style={{ marginRight: 8 }} />
                      <Text>{selectedClient.address}</Text>
                    </div>
                  )}
                  {/* Always show Fiscal ID if available, with label */}
                  {selectedClient.fiscalId && (
                    <div style={{ marginBottom: 8 }}>
                      <IdcardOutlined style={{ marginRight: 8 }} />
                      <Text strong>Fiscal ID:</Text> <Text>{selectedClient.fiscalId}</Text>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </Card>
        </Col>
        <Col span={12}>
          {/* Invoice number and date fields */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("components.invoiceForm.invoiceNumber")} name="invoiceNumber">
                <Input placeholder={t("components.invoiceForm.invoiceNumberPlaceholder")} size="large" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t("Date")}
                name="invoiceDate"
                rules={[{ required: true, message: t("Date is required") }]}
              >
                <DatePicker 
                  style={{ width: "100%" }} 
              size="large"
                  format="YYYY-MM-DD"
                  allowClear={false}
            />
          </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* Product table section (keep as is) */}
      <Card 
        title={t("components.invoiceForm.products")}
        style={{ marginTop: 24 }}
        extra={
          <Form.List name="products">
            {(_, { add }) => (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => add()}
                style={{ backgroundColor: PRIMARY }}
              >
                {t("components.invoiceForm.addProducts")}
              </Button>
            )}
          </Form.List>
        }
      >
        {productsError && (
          <Alert
            message={t("components.invoiceForm.productLoadError")}
            description={productsError}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form.List name="products">
          {(fields, { add, remove }) => (
            <Table
              dataSource={fields}
              pagination={false}
              rowKey={(field) => field.key}
              columns={[
                {
                  title: t("components.invoiceForm.product"),
                  dataIndex: "reference",
                  width: "30%",
                  render: (_, __, index) => (
                    <Form.Item
                      name={[index, "reference"]}
                      noStyle
                      rules={[{ required: true, message: t("components.invoiceForm.productRequired") }]}
                    >
                      <Select
                        showSearch
                        placeholder={t("components.invoiceForm.selectProduct")}
                        onChange={(value) => handleProductSelect(value, index)}
                        onSearch={handleProductSearch}
                        loading={productsLoading}
                        filterOption={false}
                        notFoundContent={
                          productsLoading ? (
                            <Spin size="small" />
                          ) : (
                            <Text type="secondary">{t("components.invoiceForm.noProductsFound")}</Text>
                          )
                        }
                        style={{ width: "100%" }}
                      >
                        {filteredProducts.map((product) => (
                          <Option key={product.id} value={product.id}>
                            <div>
                              <div style={{ fontWeight: 500 }}>
                                <ShoppingOutlined style={{ marginRight: 8 }} />
                                {product.name}
                              </div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                <TagOutlined style={{ marginRight: 4 }} />
                                {product.id}
                                {product.description && (
                                  <>
                                    <br />
                                    {product.description}
                                  </>
                                )}
                              </div>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ),
                },
                {
                  title: t("components.invoiceForm.quantity"),
                  dataIndex: "quantity",
                  width: "10%",
                  render: (_, __, index) => (
                    <Form.Item 
                      name={[index, "quantity"]} 
                      noStyle
                      rules={[{ required: true, message: t("components.invoiceForm.quantityRequired") }]}
                    >
                      <InputNumber 
                        min={1} 
                        style={{ width: "100%" }}
                        onChange={(value) => handleQuantityChange(value, index)}
                      />
                    </Form.Item>
                  ),
                },
                {
                  title: t("components.invoiceForm.unitPrice"),
                  dataIndex: "unitPrice",
                  width: "15%",
                  render: (_, __, index) => (
                    <Form.Item 
                      name={[index, "unitPrice"]} 
                      noStyle
                      rules={[{ required: true, message: t("components.invoiceForm.priceRequired") }]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        onChange={(value) => handlePriceChange(value, index)}
                        formatter={(value) => `${value} DT`}
                        parser={(value) => value.replace(' DT', '')}
                        defaultValue={form.getFieldValue(['products', index, 'unitPrice'])}
                        addonAfter={
                          <Tooltip title={t("components.invoiceForm.priceFromProduct")}>
                            <InfoCircleOutlined style={{ color: PRIMARY }} />
                          </Tooltip>
                        }
                      />
                    </Form.Item>
                  ),
                },
                {
                  title: t("components.invoiceForm.discount"),
                  dataIndex: "discount",
                  width: "10%",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "discount"]} noStyle>
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ width: "100%" }}
                        onChange={(value) => handleDiscountChange(value, index)}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value.replace('%', '')}
                        prefix={<PercentageOutlined />}
                      />
                    </Form.Item>
                  ),
                },
                {
                  title: t("components.invoiceForm.vat"),
                  dataIndex: "vat",
                  width: "10%",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "vat"]} noStyle>
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ width: "100%" }}
                        onChange={(value) => handleVatChange(value, index)}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value.replace('%', '')}
                        prefix={<PercentageOutlined />}
                      />
                    </Form.Item>
                  ),
                },
                {
                  title: t("components.invoiceForm.totalHT"),
                  dataIndex: "total",
                  width: "15%",
                  render: (_, __, index) => (
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const items = form.getFieldValue("products") || [];
                        const item = items[index];
                        const total = calculateLineTotal(item);
                        return (
                          <Tooltip title={t("components.invoiceForm.lineTotalTooltip")}>
                            <div style={{ textAlign: "right", padding: "4px 11px" }}>
                              <DollarOutlined style={{ marginRight: 4 }} />
                              {total.toFixed(3)} DT
                            </div>
                          </Tooltip>
                        );
                      }}
                    </Form.Item>
                  ),
                },
                {
                  title: "",
                  dataIndex: "action",
                  width: "10%",
                  render: (_, __, index) => (
                    <Button 
                      type="text" 
                      danger 
                      onClick={() => remove(index)}
                    >
                      {t("components.invoiceForm.remove")}
                    </Button>
                  ),
                },
              ]}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={5}>
                      <Text strong>{t("components.invoiceForm.totalHT")}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong>{calculateTotalHT().toFixed(3)} DT</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} />
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={5}>
                      <Text strong>{t("components.invoiceForm.totalTVA")}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong>{calculateTotalTVA().toFixed(3)} DT</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} />
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={5}>
                      <Text strong>{t("components.invoiceForm.totalTTC")}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong>{calculateTotalTTC().toFixed(3)} DT</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} />
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          )}
        </Form.List>
      </Card>
      {/* Fiscal stamp, discounts, advance, totals, and total in words fields */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Form.Item name="fiscalStamp" valuePropName="checked" initialValue={true}>
            <Checkbox>{t("Ajouter Timbre Fiscal (1.000 DT)")}</Checkbox>
          </Form.Item>
          <Form.Item name="enableDiscounts" valuePropName="checked">
            <Checkbox>{t("Activer les remises")}</Checkbox>
          </Form.Item>
          <Form.Item label={t("Avance")}
            name="advanceAmount"
            extra={t("Montant de l'avance (DT)")}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={8} offset={8}>
          <div style={{ textAlign: "right", fontWeight: 500, fontSize: 16 }}>
            <div>{t("Total HT:")} <span style={{ fontWeight: 700 }}>{calculateTotalHT().toFixed(3)} DT</span></div>
            <div>{t("Total TVA:")} <span style={{ fontWeight: 700 }}>{calculateTotalTVA().toFixed(3)} DT</span></div>
            <div>{t("Timbre Fiscal:")} <span style={{ fontWeight: 700 }}>1.000 DT</span></div>
            <div style={{ fontSize: 18, marginTop: 8 }}>{t("Total TTC:")} <span style={{ fontWeight: 700 }}>{(calculateTotalTTC() + 1).toFixed(3)} DT</span></div>
      </div>
        </Col>
      </Row>
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Form.Item label={t("Montant en toutes lettres")}
            name="totalInWords"
          >
            <Input.TextArea rows={2} placeholder={t("Nombre complexe dinars et 500 millimes")}/>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default InvoiceForm;
