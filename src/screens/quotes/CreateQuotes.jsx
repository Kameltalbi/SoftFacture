import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addQuote } from "../../container/redux/slices/quotesSlice";
import QuoteForm from "../../components/quotes/QuoteForm";
import PreviewQuoteModal from "../../components/quotes/PreviewQuoteModal";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Form } from "antd";
import { useTranslation } from "react-i18next";

const CreateQuotes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [previewVisible, setPreviewVisible] = useState(false);
  const [quoteData, setQuoteData] = useState(null);

  const handleSubmit = (values) => {
    const quote = { ...values, id: Date.now() };
    dispatch(addQuote(quote));
    navigate("/quotes");
  };

  const handlePreview = () => {
    const values = form.getFieldsValue();
    setQuoteData(values);
    setPreviewVisible(true);
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
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            border: "none",
          }}
        />
        <h1
          style={{ fontSize: "24px", fontWeight: "bold", marginLeft: "16px" }}
        >
          {t("screens.quote.createTitle")}
        </h1>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Card
          style={{
            width: "100%",
            maxWidth: 900,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <QuoteForm form={form} onFinish={handlePreview} />
        </Card>
      </div>

      <PreviewQuoteModal
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        quote={quoteData}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreateQuotes;
