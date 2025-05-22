import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createInvoice } from "../../container/redux/slices/invoicesSlice";
import InvoiceForm from "../../components/invoices/InvoiceForm";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Form, Row, Col } from "antd";
import { useTranslation } from "react-i18next";

const CreateInvoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const productsList = useSelector((state) => state.products.products);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  const handleSubmit = (values) => {
    const items = (values.products || []).map((prod) => {
      const productObj = productsList.find((p) => p.id === prod.reference);
      return {
        produit_id: prod.reference,
        name: productObj ? productObj.name : '',
        quantity: prod.quantity,
        unit_price: prod.unitPrice,
      };
    });
    const invoice = {
      ...values,
      client_id: values.clientId,
      items,
    };
    delete invoice.clientId;
    delete invoice.products;
    dispatch(createInvoice(invoice));
    navigate("/invoices");
  };

  const handlePreview = () => {
    const values = form.getFieldsValue();

    setInvoiceData(values);
    setPreviewVisible(true);
  };

  const handleCancel = () => navigate(-1);
  const handleSave = () => form.submit();

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
          <h1 style={{ fontSize: "24px", fontWeight: "bold", marginLeft: "16px" }}>{t("screens.invoice.createTitle")}</h1>
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

export default CreateInvoice;
