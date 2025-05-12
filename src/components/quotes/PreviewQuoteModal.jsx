import React from "react";
import { Card, Modal, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import "./style.css";

import {
  LIGHT_GRAY,
  WHITE,
  BLACK,
  GRAY,
  DARK_GRAY,
  DARK_BLUE,
  PRIMARY,
} from "../../utils/constants/colors";

const PreviewQuoteModal = ({ visible, onClose, quote, onSubmit }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!quote) return null;

  const articles = quote.articles || [];

  const totalHT = articles.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    const unitPrice = item.unitPrice || 0;
    const discount = (item.discount || 0) / 100;
    const price = unitPrice * quantity;
    return sum + price * (1 - discount);
  }, 0);

  const vatRate = 0.19;
  const totalTVA = totalHT * vatRate;
  const netToPay = totalHT + totalTVA;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width="900px"
      centered
      modalRender={(modalContent) => (
        <div style={{ padding: 0, margin: 0 }}>{modalContent}</div>
      )}
    >
      <Card
        style={{
          backgroundColor: LIGHT_GRAY,
          borderRadius: 12,
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          maxHeight: "80vh",
        }}
        bodyStyle={{
          padding: 0,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Header Buttons */}
        <div
          style={{
            padding: 16,
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <Button onClick={() => navigate("/quotes")}>
            {t("components.quotePreview.cancel")}
          </Button>
          <Button onClick={onClose}>
            {t("components.quotePreview.edit")}
          </Button>
          <Button
            type="primary"
            onClick={onSubmit}
            style={{ backgroundColor: PRIMARY, width: 150 }}
          >
            {t("components.quotePreview.save")}
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="invoice-preview-scrollable">
          <div
            style={{
              backgroundColor: WHITE,
              borderRadius: 8,
              padding: 32,
              margin: "0 16px 24px",
              fontFamily: "Arial, sans-serif",
              color: BLACK,
              flexGrow: 1,
            }}
          >
            {/* Header */}
            <div
              className="invoice-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: `2px solid ${BLACK}`,
                paddingBottom: 12,
              }}
            >
              <h2>{quote.quoteNumber}</h2>
              <span
                style={{ textAlign: "right", fontSize: 14, color: DARK_GRAY }}
              >
                {t("components.quotePreview.date")}
                {dayjs().format("D/M/YYYY")}
              </span>
            </div>

            {/* Client Info */}
            <div
              className="invoice-client-info"
              style={{ marginTop: 24, fontSize: 14, color: DARK_BLUE }}
            >
              <strong>{t("components.quotePreview.billedTo")}</strong>
              <p>{quote.fullName || "Client Name"}</p>
              <p>Email: {quote.email || "-"}</p>
              <p>Mobile: {quote.phone || "-"}</p>
            </div>

            {/* Articles Table */}
            <table
              className="invoice-table"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: 24,
                fontSize: 14,
              }}
            >
              <thead>
                <tr style={{ backgroundColor: LIGHT_GRAY, color: BLACK }}>
                  <th>#</th>
                  <th>{t("components.quotePreview.reference")}</th>
                  <th>{t("components.quotePreview.description")}</th>
                  <th>{t("components.quotePreview.quantity")}</th>
                  <th>{t("components.quotePreview.unitPrice")}</th>
                  <th>{t("components.quotePreview.discount")}</th>
                  <th>{t("components.quotePreview.vat")}</th>
                  <th>{t("components.quotePreview.totalHT")}</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((item, i) => {
                  const price = (item.unitPrice || 0) * (item.quantity || 1);
                  const discount = (item.discount || 0) / 100;
                  const total = price * (1 - discount);

                  return (
                    <tr key={i} style={{ borderColor: GRAY }}>
                      <td>{i + 1}</td>
                      <td>{item.reference}</td>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{(item.unitPrice || 0).toFixed(3)} DT</td>
                      <td>{item.discount || 0}%</td>
                      <td>{item.vat || 19}%</td>
                      <td>{total.toFixed(3)} DT</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Totals */}
            <div
              className="invoice-summary"
              style={{
                marginTop: 48,
                width: "50%",
                fontSize: 14,
                marginLeft: "auto",
                color: BLACK,
              }}
            >
              <div
                className="summary-line"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderTop: `1px solid ${GRAY}`,
                }}
              >
                <span>{t("components.quotePreview.totalHTLabel")}</span>
                <span>{totalHT.toFixed(3)} DT</span>
              </div>
              <div
                className="summary-line"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderTop: `1px solid ${GRAY}`,
                }}
              >
                <span>{t("components.quotePreview.baseVatLabel")}</span>
                <span>{totalHT.toFixed(3)} DT</span>
              </div>
              <div
                className="summary-line"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderTop: `1px solid ${GRAY}`,
                }}
              >
                <span>{t("components.quotePreview.totalVatLabel")}</span>
                <span>{totalTVA.toFixed(3)} DT</span>
              </div>
              <div
                className="summary-line bold"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  fontWeight: "bold",
                  borderTop: `2px solid ${BLACK}`,
                }}
              >
                <span>{t("components.quotePreview.netToPayLabel")}</span>
                <span>{netToPay.toFixed(3)} DT</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Modal>
  );
};

export default PreviewQuoteModal;
