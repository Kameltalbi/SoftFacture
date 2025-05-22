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
  Divider,
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
import { bondCommandAPI, clientAPI, currencyAPI, taxAPI, productAPI } from "../../services/api";
import { fetchClients } from "../../container/redux/slices/clientsSlice";
import { fetchProducts } from "../../container/redux/slices/productsSlice";
import { createBondCommand, updateBondCommand } from "../../container/redux/slices/bondCommandsSlice";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";

const { Option } = Select;
const { Text } = Typography;

const BondCommandForm = ({ form, onFinish }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [currencies, setCurrencies] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [commandNumber, setCommandNumber] = useState("");
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
    // Fetch currencies and taxes
    fetchCurrencies();
    fetchTaxes();
  }, [dispatch, clients.length, products.length, company]);

  useEffect(() => {
    const fetchCommandNumber = async () => {
      if (requestInProgress.current) return;

      try {
        requestInProgress.current = true;
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.error('No access token found. Please log in.');
          return;
        }

        const response = await bondCommandAPI.generateNumber();
        if (response?.data?.data?.command_number) {
          setCommandNumber(response.data.data.command_number);
          form.setFieldsValue({ commandNumber: response.data.data.command_number });
        } else {
          console.error('Invalid response format:', response);
          form.setFieldsValue({ commandNumber: 'Loading...' });
        }
      } catch (error) {
        console.error('Error fetching command number:', error);
        form.setFieldsValue({ commandNumber: 'Error generating number' });
      } finally {
        requestInProgress.current = false;
      }
    };

    if (!id) {
      fetchCommandNumber();
    }

    return () => {
      requestInProgress.current = false;
    };
  }, [form, id]);

  const fetchCurrencies = async () => {
    try {
      const response = await currencyAPI.getAll();
      setCurrencies(response.data.data);
    } catch (error) {
      console.error('Failed to fetch currencies:', error);
    }
  };

  const fetchTaxes = async () => {
    try {
      const response = await taxAPI.getAll();
      setTaxes(response.data.data);
    } catch (error) {
      console.error('Failed to fetch taxes:', error);
    }
  };

  const handleClientSearch = (value) => {
    setClientSearchValue(value);
  };

  const handleClientChange = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
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
      form.setFieldsValue({
        client_id: client.id,
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

    const currentProducts = form.getFieldValue("items") || [];
    const existingProduct = currentProducts.find(p => p.produit_id === productId);
    
    if (existingProduct) {
      const updatedProducts = currentProducts.map(p => {
        if (p.produit_id === productId) {
          return {
            ...p,
            quantity: (p.quantity || 1) + 1,
            unit_price: product.price || 0,
            name: product.name,
            description: product.description || product.name,
            tax_id: product.tax_id || null
          };
        }
        return p;
      });
      form.setFieldsValue({ items: updatedProducts });
    } else {
      const newProduct = {
        produit_id: product.id,
        name: product.name,
        description: product.description || product.name,
        unit_price: product.price || 0,
        quantity: 1,
        tax_id: product.tax_id || null,
        unit: product.unit || ''
      };
      
      const updatedProducts = [...currentProducts];
      updatedProducts[index] = newProduct;
      form.setFieldsValue({ items: updatedProducts });
    }
  };

  const handleQuantityChange = (value, index) => {
    const currentProducts = form.getFieldValue("items") || [];
    currentProducts[index] = {
      ...currentProducts[index],
      quantity: value
    };
    form.setFieldsValue({ items: currentProducts });
  };

  const handlePriceChange = (value, index) => {
    const currentProducts = form.getFieldValue("items") || [];
    currentProducts[index] = {
      ...currentProducts[index],
      unit_price: value
    };
    form.setFieldsValue({ items: currentProducts });
  };

  const handleTaxChange = (value, index) => {
    const currentProducts = form.getFieldValue("items") || [];
    currentProducts[index] = {
      ...currentProducts[index],
      tax_id: value
    };
    form.setFieldsValue({ items: currentProducts });
  };

  const calculateLineTotal = (item) => {
    if (!item) return 0;
    const price = Number(item.unit_price || 0) * Number(item.quantity || 1);
    const tax = item.tax_id ? price * (taxes.find(t => t.id === item.tax_id)?.rate / 100) : 0;
    return price + tax;
  };

  const calculateTotalHT = () => {
    const items = form.getFieldValue("items") || [];
    return items.reduce((sum, item) => {
      if (!item) return sum;
      return sum + (Number(item.unit_price || 0) * Number(item.quantity || 1));
    }, 0);
  };

  const calculateTotalTVA = () => {
    const items = form.getFieldValue("items") || [];
    return items.reduce((sum, item) => {
      if (!item) return sum;
      const lineTotal = Number(item.unit_price || 0) * Number(item.quantity || 1);
      const tax = item.tax_id ? lineTotal * (taxes.find(t => t.id === item.tax_id)?.rate / 100) : 0;
      return sum + tax;
    }, 0);
  };

  const calculateTotalTTC = () => {
    const totalHT = calculateTotalHT();
    const totalTVA = calculateTotalTVA();
    return totalHT + totalTVA;
  };

  const handleSubmit = async (values) => {
    try {
      const totalHT = calculateTotalHT();
      const totalTVA = calculateTotalTVA();
      const totalTTC = calculateTotalTTC();
      
      const formData = {
        ...values,
        command_number: commandNumber,
        items: values.items.map(({ id, ...item }) => item),
        total_amount: totalHT,
        total_tax: totalTVA,
        total: totalTTC,
        status: values.status || 'draft'
      };

      if (id) {
        await dispatch(updateBondCommand({ id: parseInt(id), commandData: formData })).unwrap();
        message.success(t("screens.bondCommand.messages.updateSuccess"));
      } else {
        await dispatch(createBondCommand(formData)).unwrap();
        message.success(t("screens.bondCommand.messages.createSuccess"));
      }
      
      if (onFinish) {
        onFinish(formData);
      } else {
        navigate("/bond-commands");
      }
    } catch (error) {
      message.error(error.message || t("screens.bondCommand.messages.error"));
    }
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

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      {/* Top section: two columns for company/client info and command number/date */}
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
              label={t("screens.bondCommand.form.client")}
              name="client_id"
              rules={[{ required: true, message: t("screens.bondCommand.form.clientRequired") }]}
            >
              <Select
                showSearch
                placeholder={t("screens.bondCommand.form.selectClient")}
                size="large"
                onChange={handleClientChange}
                onSearch={handleClientSearch}
                loading={clientsLoading}
                filterOption={false}
                notFoundContent={clientsLoading ? <Spin size="small" /> : <Text type="secondary">{t("screens.bondCommand.form.noClientsFound")}</Text>}
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
          {/* Command number and date fields */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("screens.bondCommand.form.commandNumber")} name="commandNumber">
                <Input placeholder={t("screens.bondCommand.form.commandNumberPlaceholder")} size="large" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label={t("screens.bondCommand.form.commandDate")}
                name="command_date"
                rules={[{ required: true, message: t("screens.bondCommand.form.commandDateRequired") }]}
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label={t("screens.bondCommand.form.currency")}
                name="currency_id"
                rules={[{ required: true, message: t("screens.bondCommand.form.currencyRequired") }]}
              >
                <Select size="large">
                  {currencies.map((currency) => (
                    <Option key={currency.id} value={currency.id}>
                      {currency.code} - {currency.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label={t("screens.bondCommand.form.status")}
                name="status"
                initialValue="draft"
              >
                <Select size="large">
                  <Option value="draft">{t("screens.bondCommand.status.draft")}</Option>
                  <Option value="sent">{t("screens.bondCommand.status.sent")}</Option>
                  <Option value="paid">{t("screens.bondCommand.status.paid")}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Product table section */}
      <Card 
        title={t("screens.bondCommand.form.items.title")}
        style={{ marginTop: 24 }}
        extra={
          <Form.List name="items">
            {(_, { add }) => (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => add()}
                style={{ backgroundColor: PRIMARY }}
              >
                {t("screens.bondCommand.form.items.addItem")}
              </Button>
            )}
          </Form.List>
        }
      >
        {productsError && (
          <Alert
            message={t("screens.bondCommand.form.items.loadError")}
            description={productsError}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form.List name="items">
          {(fields, { add, remove }) => (
            <Table
              dataSource={fields}
              pagination={false}
              rowKey={(field) => field.key}
              columns={[
                {
                  title: t("screens.bondCommand.form.items.product"),
                  dataIndex: "produit_id",
                  width: "30%",
                  render: (_, __, index) => (
                    <Form.Item
                      name={[index, "produit_id"]}
                      noStyle
                      rules={[{ required: true, message: t("screens.bondCommand.form.items.productRequired") }]}
                    >
                      <Select
                        showSearch
                        placeholder={t("screens.bondCommand.form.items.selectProduct")}
                        onChange={(value) => handleProductSelect(value, index)}
                        onSearch={handleProductSearch}
                        loading={productsLoading}
                        filterOption={false}
                        notFoundContent={
                          productsLoading ? (
                            <Spin size="small" />
                          ) : (
                            <Text type="secondary">{t("screens.bondCommand.form.items.noProductsFound")}</Text>
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
                  title: t("screens.bondCommand.form.items.quantity"),
                  dataIndex: "quantity",
                  width: "10%",
                  render: (_, __, index) => (
                    <Form.Item 
                      name={[index, "quantity"]} 
                      noStyle
                      rules={[{ required: true, message: t("screens.bondCommand.form.items.quantityRequired") }]}
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
                  title: t("screens.bondCommand.form.items.unitPrice"),
                  dataIndex: "unit_price",
                  width: "15%",
                  render: (_, __, index) => (
                    <Form.Item 
                      name={[index, "unit_price"]} 
                      noStyle
                      rules={[{ required: true, message: t("screens.bondCommand.form.items.priceRequired") }]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        onChange={(value) => handlePriceChange(value, index)}
                        formatter={(value) => `${value} DT`}
                        parser={(value) => value.replace(' DT', '')}
                      />
                    </Form.Item>
                  ),
                },
                {
                  title: t("screens.bondCommand.form.items.tax"),
                  dataIndex: "tax_id",
                  width: "15%",
                  render: (_, __, index) => (
                    <Form.Item 
                      name={[index, "tax_id"]} 
                      noStyle
                    >
                      <Select
                        allowClear
                        style={{ width: "100%" }}
                        onChange={(value) => handleTaxChange(value, index)}
                      >
                        {taxes.map((tax) => (
                          <Option key={tax.id} value={tax.id}>
                            {tax.name} ({tax.rate}%)
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ),
                },
                {
                  title: t("screens.bondCommand.form.items.total"),
                  dataIndex: "total",
                  width: "15%",
                  render: (_, __, index) => (
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const items = form.getFieldValue("items") || [];
                        const item = items[index];
                        const total = calculateLineTotal(item);
                        return (
                          <Tooltip title={t("screens.bondCommand.form.items.lineTotalTooltip")}>
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
                      {t("screens.bondCommand.form.items.remove")}
                    </Button>
                  ),
                },
              ]}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4}>
                      <Text strong>{t("screens.bondCommand.form.totalHT")}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong>{calculateTotalHT().toFixed(3)} DT</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} />
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4}>
                      <Text strong>{t("screens.bondCommand.form.totalTVA")}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong>{calculateTotalTVA().toFixed(3)} DT</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} />
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4}>
                      <Text strong>{t("screens.bondCommand.form.totalTTC")}</Text>
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

      {/* Notes and totals section */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={16}>
          <Form.Item 
            label={t("screens.bondCommand.form.notes")}
            name="notes"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Row justify="space-between">
              <Col>{t("screens.bondCommand.form.totalHT")}:</Col>
              <Col>
                {calculateTotalHT().toFixed(3)} DT
              </Col>
            </Row>
            <Row justify="space-between">
              <Col>{t("screens.bondCommand.form.totalTVA")}:</Col>
              <Col>
                {calculateTotalTVA().toFixed(3)} DT
              </Col>
            </Row>
            <Divider style={{ margin: "8px 0" }} />
            <Row justify="space-between" style={{ fontWeight: "bold" }}>
              <Col>{t("screens.bondCommand.form.totalTTC")}:</Col>
              <Col>
                {calculateTotalTTC().toFixed(3)} DT
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default BondCommandForm;
