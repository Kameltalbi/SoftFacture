import React from "react";
import { useDispatch } from "react-redux";
import ClientForm from "../../components/clients/ClientForm";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { addSupplier } from "../../container/redux/slices/supplierSlice";

const CreateSupplier = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = (values) => {
    dispatch(addSupplier(values));
    navigate("/suppliers");
  };

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}
      >
        <Button
          type="default"
          shape="circle"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{
            width: "48px",
            height: "48px",
            fontSize: "20px",
            marginBottom: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            border: "none",
          }}
        />
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginLeft: "16px" }}>
          {t("screens.supplier.createTitle")}
        </h1>
      </div>
      <ClientForm onFinish={handleSubmit} />
    </div>
  );
};

export default CreateSupplier;
