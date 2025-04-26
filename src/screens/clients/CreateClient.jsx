import React from "react";
import { useDispatch } from "react-redux";
import { addClient } from "../../container/redux/slices/clientsSlice";
import ClientForm from "../../components/clients/ClientForm";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";

const CreateClient = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    dispatch(addClient(values));
    navigate("/clients");
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
            fontSize: "20px", // make the arrow icon bigger
            marginBottom: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            border: "none",
          }}
        />
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginLeft:"16px" }}>Create Client</h1>
      </div>
      <ClientForm onFinish={handleSubmit} />
    </div>
  );
};

export default CreateClient;
