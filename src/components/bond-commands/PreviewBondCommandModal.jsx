import React from "react";
import { Modal, Descriptions, Table, Row, Col, Typography } from "antd";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const { Text } = Typography;

const PreviewBondCommandModal = ({ visible, onClose, command }) => {
  const { t } = useTranslation();

  if (!command) return null;

  const itemColumns = [
    {
      title: t("screens.bondCommand.form.items.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("screens.bondCommand.form.items.description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t("screens.bondCommand.form.items.quantity"),
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: t("screens.bondCommand.form.items.unit"),
      dataIndex: "unit",
      key: "unit",
      width: 100,
    },
    {
      title: t("screens.bondCommand.form.items.unitPrice"),
      dataIndex: "unit_price",
      key: "unit_price",
      width: 120,
      render: (value) => `${value.toFixed(2)} ${command.currency?.code || ""}`,
    },
    {
      title: t("screens.bondCommand.form.items.tax"),
      dataIndex: "tax",
      key: "tax",
      width: 120,
      render: (_, record) => {
        if (!record.tax) return "-";
        return `${record.tax.name} (${record.tax.rate}%)`;
      },
    },
    {
      title: t("screens.bondCommand.form.items.total"),
      key: "total",
      width: 120,
      render: (_, record) => {
        const total = record.quantity * record.unit_price;
        const tax = record.tax
          ? total * (record.tax.rate / 100)
          : 0;
        return `${(total + tax).toFixed(2)} ${command.currency?.code || ""}`;
      },
    },
  ];

  return (
    <Modal
      title={t("screens.bondCommand.preview.title")}
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={null}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label={t("screens.bondCommand.form.commandNumber")} span={2}>
          {command.command_number}
        </Descriptions.Item>
        <Descriptions.Item label={t("screens.bondCommand.form.client")} span={2}>
          {command.client?.name}
        </Descriptions.Item>
        <Descriptions.Item label={t("screens.bondCommand.form.commandDate")}>
          {dayjs(command.command_date).format("DD/MM/YYYY")}
        </Descriptions.Item>
        <Descriptions.Item label={t("screens.bondCommand.form.dueDate")}>
          {command.due_date ? dayjs(command.due_date).format("DD/MM/YYYY") : "-"}
        </Descriptions.Item>
        <Descriptions.Item label={t("screens.bondCommand.form.status")} span={2}>
          <Text
            style={{
              color:
                command.status === "paid"
                  ? "green"
                  : command.status === "sent"
                  ? "blue"
                  : "orange",
            }}
          >
            {t(`screens.bondCommand.status.${command.status}`)}
          </Text>
        </Descriptions.Item>
      </Descriptions>

      <Table
        columns={itemColumns}
        dataSource={command.items}
        rowKey="id"
        pagination={false}
        style={{ marginTop: 24 }}
      />

      <Row justify="end" style={{ marginTop: 24 }}>
        <Col span={8}>
          <Descriptions bordered size="small">
            <Descriptions.Item label={t("screens.bondCommand.form.subtotal")}>
              {command.total_amount.toFixed(2)} {command.currency?.code || ""}
            </Descriptions.Item>
            <Descriptions.Item label={t("screens.bondCommand.form.tax")}>
              {command.total_tax.toFixed(2)} {command.currency?.code || ""}
            </Descriptions.Item>
            {(command.discount_amount > 0 || command.discount_percentage > 0) && (
              <Descriptions.Item label={t("screens.bondCommand.form.discount")}>
                {command.discount_amount > 0
                  ? `-${command.discount_amount.toFixed(2)} ${command.currency?.code || ""}`
                  : `-${command.discount_percentage}%`}
              </Descriptions.Item>
            )}
            <Descriptions.Item label={t("screens.bondCommand.form.total")}>
              <Text strong>
                {(command.total_amount + command.total_tax - (command.discount_amount || 0)).toFixed(2)}{" "}
                {command.currency?.code || ""}
              </Text>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      {command.notes && (
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Descriptions bordered>
              <Descriptions.Item label={t("screens.bondCommand.form.notes")}>
                {command.notes}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      )}
    </Modal>
  );
};

export default PreviewBondCommandModal; 