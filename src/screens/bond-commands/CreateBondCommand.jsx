import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Form, Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import BondCommandForm from "../../components/bond-commands/BondCommandForm";

const CreateBondCommand = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleCancel = () => navigate(-1);
  const handleSave = () => form.submit();

  const handleSubmit = (values) => {
    // TODO: Implement bond command submission logic
    console.log('Form values:', values);
    navigate("/bond-commands");
  };

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
          <h1 style={{ fontSize: "24px", fontWeight: "bold", marginLeft: "16px" }}>{t("screens.bondCommand.createTitle")}</h1>
        </div>
        <div>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>{t("Annuler")}</Button>
          <Button type="primary" onClick={handleSave}>{t("Enregistrer")}</Button>
        </div>
      </div>
      <Row gutter={24}>
        <Col span={24}>
          <Card style={{ width: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <BondCommandForm form={form} onFinish={handleSubmit} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateBondCommand; 