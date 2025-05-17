import React, { useState } from "react";
import {
  Table,
  Tag,
  Space,
  Input,
  Select,
  DatePicker,
  message,
  Row,
  Col,
  Button,
  Spin,
  Alert,
} from "antd";
import ActionsDropdown from "../../components/common/ActionsDropdown";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteInvoice } from "../../container/redux/slices/invoicesSlice";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {
  PRIMARY,
  SUCCESS,
  WARNING,
  ERROR,
  WHITE,
  LIGHT_GREEN,
  LIGHT_RED,
} from "../../utils/constants/colors";
import { useTranslation } from "react-i18next";
import PreviewInvoiceModal from "../../components/invoices/PreviewInvoiceModal";

dayjs.extend(isBetween);

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const InvoicesScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const invoices = useSelector((state) => state.invoices.invoices);
  const loading = useSelector((state) => state.invoices.loading);
  const error = useSelector((state) => state.invoices.error);

  const [searchText, setSearchText] = useState("");
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [filteredDates, setFilteredDates] = useState([]);

  const handleSearch = (value) => {
    setSearchText(value.trim().toLowerCase());
  };

  const handleStatusChange = (value) => {
    setFilteredStatus(value);
  };

  const handleDateChange = (dates) => {
    setFilteredDates(dates);
  };

  const handleDelete = (id) => {
    dispatch(deleteInvoice(id));
    message.success(t("screens.invoice.messages.deleteSuccess", { id }));
  };

  const filteredData = invoices.filter((invoice) => {
    const matchesSearch =
      invoice?.number?.toLowerCase().includes(searchText) ||
      invoice?.client?.toLowerCase().includes(searchText);

    const matchesStatus = filteredStatus
      ? invoice.status === filteredStatus
      : true;

    const matchesDates =
      filteredDates?.length === 2
        ? dayjs(invoice.issueDate).isBetween(
            filteredDates[0],
            filteredDates[1],
            "day",
            "[]"
          )
        : true;

    return matchesSearch && matchesStatus && matchesDates;
  });

  const columns = [
    {
      title: t("screens.invoice.columns.number"),
      dataIndex: "number",
      key: "number",
      sorter: (a, b) => a.number.localeCompare(b.number),
    },
    {
      title: t("screens.invoice.columns.client"),
      dataIndex: "client",
      key: "client",
      sorter: (a, b) => a.client.localeCompare(b.client),
    },
    {
      title: t("screens.invoice.columns.issueDate"),
      dataIndex: "issueDate",
      key: "issueDate",
      sorter: (a, b) => new Date(a.issueDate) - new Date(b.issueDate),
    },
    {
      title: t("screens.invoice.columns.dueDate"),
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    },
    {
      title: t("screens.invoice.columns.amount"),
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: t("screens.invoice.columns.status"),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = WHITE;
        let backgroundColor = WHITE;

        if (status === t("screens.invoice.status.paid")) {
          color = SUCCESS;
          backgroundColor = LIGHT_GREEN;
        } else if (status === t("screens.invoice.status.unpaid")) {
          color = WARNING;
          backgroundColor = WHITE;
        } else if (status === t("screens.invoice.status.overdue")) {
          color = ERROR;
          backgroundColor = LIGHT_RED;
        }

        return (
          <Tag
            style={{
              color,
              backgroundColor,
              borderColor: color,
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "",
      key: "actions",
      width: 50,
      render: (_, record) => (
        <ActionsDropdown
          menuItems={[
            {
              key: "edit",
              label: t("screens.invoice.menu.edit"),
              icon: <EditOutlined />,
              onClick: () => navigate(`/invoices/edit/${record.id}`),
            },
            {
              key: "delete",
              label: t("screens.invoice.menu.delete"),
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => handleDelete(record.id),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24, backgroundColor: WHITE }}>
      <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <h1 style={{ margin: 0, color: PRIMARY }}>
            {t("screens.invoice.title")}
          </h1>
        </Col>
        <Col>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/invoices/new")}
            style={{
              backgroundColor: PRIMARY,
              borderColor: PRIMARY,
            }}
          >
            {t("screens.invoice.newInvoiceButton")}
          </Button>
        </Col>
      </Row>

      <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
        <Col flex="auto" style={{ textAlign: "center" }}>
          <RangePicker onChange={handleDateChange} size="large" />
        </Col>
        <Col>
          <Space>
            <Search
              placeholder={t("screens.invoice.searchPlaceholder")}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              style={{ width: 250 }}
              size="large"
            />
            <Select
              placeholder={t("screens.invoice.filterStatusPlaceholder")}
              onChange={handleStatusChange}
              allowClear
              style={{ width: 180 }}
              size="large"
            >
              <Option value={t("screens.invoice.status.paid")}>
                {t("screens.invoice.status.paid")}
              </Option>
              <Option value={t("screens.invoice.status.unpaid")}>
                {t("screens.invoice.status.unpaid")}
              </Option>
              <Option value={t("screens.invoice.status.overdue")}>
                {t("screens.invoice.status.overdue")}
              </Option>
            </Select>
          </Space>
        </Col>
      </Row>

      {loading ? (
        <Spin tip="Loading invoices..." />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : (
        <Table columns={columns} dataSource={filteredData} rowKey="id" />
      )}
    
    </div>
  );
};

export default InvoicesScreen;
