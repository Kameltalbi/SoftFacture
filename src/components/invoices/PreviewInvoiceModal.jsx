import React from "react";
import { Card, Modal, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./style.css";
import dayjs from "dayjs";
import {
  LIGHT_GRAY,
  WHITE,
  BLACK,
  GRAY,
  DARK_GRAY,
  DARK_BLUE,
  PRIMARY,
} from "../../utils/constants/colors";

const PreviewInvoiceModal = ({ visible, onClose, invoice, onSave }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!invoice) return null;

  const articles = invoice.articles || [];

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
        {/* Header buttons */}
        <div
          style={{
            padding: 16,
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <Button onClick={() => navigate("/invoices")}>
            {t("components.invoicePreview.cancel")}
          </Button>
          <Button onClick={onClose}>
            {t("components.invoicePreview.edit")}
          </Button>
          <Button
            type="primary"
            onClick={onSave}
            style={{ backgroundColor: PRIMARY, width: 150 }}
          >
            {t("components.invoicePreview.save")}
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
              <h2>{invoice.invoiceNumber}</h2>
              <span
                style={{ textAlign: "right", fontSize: 14, color: DARK_GRAY }}
              >
                {t("components.invoicePreview.date")}
                {dayjs().format("D/M/YYYY")}
              </span>
            </div>

            {/* Client Info */}
            <div
              className="invoice-client-info"
              style={{ marginTop: 24, fontSize: 14, color: DARK_BLUE }}
            >
              <strong>{t("components.invoicePreview.billedTo")}</strong>
              <p>{invoice.fullName || "SOCIETE EXEMPLE"}</p>
              <p>Email: {invoice.email || "-"}</p>
              <p>Mobile: {invoice.phone || "-"}</p>
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
                  <th>{t("components.invoicePreview.reference")}</th>
                  <th>{t("components.invoicePreview.description")}</th>
                  <th>{t("components.invoicePreview.quantity")}</th>
                  <th>{t("components.invoicePreview.unitPrice")}</th>
                  <th>{t("components.invoicePreview.discount")}</th>
                  <th>{t("components.invoicePreview.vat")}</th>
                  <th>{t("components.invoicePreview.totalHT")}</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((item, i) => {
                  const price = item.unitPrice * item.quantity;
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

            {/* Summary */}
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
                <span>{t("components.invoicePreview.totalHTLabel")}</span>
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
                <span>{t("components.invoicePreview.baseVatLabel")}</span>
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
                <span>{t("components.invoicePreview.totalVatLabel")}</span>
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
                <span>{t("components.invoicePreview.netToPayLabel")}</span>
                <span>{netToPay.toFixed(3)} DT</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Modal>
  );
};

export default PreviewInvoiceModal;
