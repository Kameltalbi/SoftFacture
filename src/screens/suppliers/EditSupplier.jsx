import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ClientForm from "../../components/clients/ClientForm";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

const EditSupplier = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const supplier = useSelector((state) =>
    state.supplier.supplier.find((supplier) => supplier.id === id)
  );

  const handleSubmit = (values) => {
    dispatch(updateClient({ id, ...values }));
    navigate("/clients");
  };

  if (!supplier) return <div style={{ padding: "24px" }}>{t("screens.supplier.notFound")}</div>;

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
          {t("screens.supplier.editTitle")}
        </h1>
      </div>
      <ClientForm initialValues={supplier} onFinish={handleSubmit} />
    </div>
  );
};

export default EditSupplier;
