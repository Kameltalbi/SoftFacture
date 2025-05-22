import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateInvoice, fetchInvoice } from "../../container/redux/slices/invoicesSlice";
import InvoiceForm from "../../components/invoices/InvoiceForm";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Form, Row, Col, Spin, Alert } from "antd";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const EditInvoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const productsList = useSelector((state) => state.products.products);
  const { currentInvoice: invoice, loading, error } = useSelector((state) => state.invoices);
  const clients = useSelector((state) => state.clients.clients);

  useEffect(() => {
    dispatch(fetchInvoice(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (invoice) {
      console.log('Raw invoice date:', invoice.issue_date); // Debug log
      
      // Transform the data to match the form structure
      const formData = {
        ...invoice,
        clientId: invoice.client_id,
        invoiceNumber: invoice.invoice_number,
        // Ensure the date is properly formatted for the DatePicker
        invoiceDate: invoice.issue_date ? dayjs(invoice.issue_date).startOf('day') : null,
        products: invoice.items?.map(item => ({
          reference: item.produit_id,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          discount: item.discount || 0,
          vat: item.vat || 19,
        })) || [],
      };
      
      console.log('Formatted date:', formData.invoiceDate); // Debug log
      console.log('Form data:', formData); // Debug log
      
      // Set the form values
      form.setFieldsValue(formData);

      // If we have client information, trigger the client selection
      if (invoice.client_id) {
        const client = clients.find(c => c.id === invoice.client_id);
        if (client) {
          // Use fallback keys for each field
          const fullName = client.fullName || client.name || client.nom || '';
          const email = client.email || client.mail || '';
          const phone = client.phone || client.telephone || client.tel || '';
          const address = client.address || client.adresse || '';
          const fiscalId = client.fiscalId || client.fiscal_id || client.taxNumber || client.tax_number || client.fiscal || client.n_fiscal || '';
          
          // Update the form with client details
          form.setFieldsValue({
            fullName,
            fiscalId,
            email,
            phone,
            address,
          });
        }
      }
    }
  }, [invoice, form, clients]);

  const handleSubmit = (values) => {
    const items = (values.products || []).map((prod) => {
      const productObj = productsList.find((p) => p.id === prod.reference);
      return {
        produit_id: prod.reference,
        name: productObj ? productObj.name : '',
        quantity: prod.quantity,
        unit_price: prod.unitPrice,
        discount: prod.discount || 0,
        vat: prod.vat || 19,
      };
    });

    const invoice = {
      ...values,
      client_id: values.clientId,
      items,
    };
    delete invoice.clientId;
    delete invoice.products;

    dispatch(updateInvoice({ id, data: invoice }));
    navigate("/invoices");
  };

  const handleCancel = () => navigate(-1);
  const handleSave = () => form.submit();

  if (loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message={t("Error")}
          description={error}
          type="error"
          showIcon
        />
        <Button onClick={handleCancel} style={{ marginTop: 16 }}>
          {t("Back to Invoices")}
        </Button>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message={t("Error")}
          description={t("Invoice not found")}
          type="error"
          showIcon
        />
        <Button onClick={handleCancel} style={{ marginTop: 16 }}>
          {t("Back to Invoices")}
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            type="default"
            shape="circle"
            icon={<ArrowLeftOutlined />}
            onClick={handleCancel}
            style={{ width: "48px", height: "48px", fontSize: "20px", backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", border: "none" }}
          />
          <h1 style={{ fontSize: "24px", fontWeight: "bold", marginLeft: "16px" }}>{t("screens.invoice.editTitle")}</h1>
        </div>
        <div>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>{t("Annuler")}</Button>
          <Button type="primary" onClick={handleSave}>{t("Enregistrer")}</Button>
        </div>
      </div>
      <Row gutter={24}>
        <Col span={24}>
          <Card style={{ width: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <InvoiceForm form={form} onFinish={handleSubmit} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EditInvoice; 