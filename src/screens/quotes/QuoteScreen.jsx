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
import { deleteQuote } from "../../container/redux/slices/quotesSlice";
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

dayjs.extend(isBetween);

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const QuotesScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const quotes = useSelector((state) => state.quotes.quotes);
  const loading = useSelector((state) => state.quotes.loading);
  const error = useSelector((state) => state.quotes.error);

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
    dispatch(deleteQuote(id));
    message.success(t("screens.quote.messages.deleteSuccess", { id }));
  };

  const filteredData = quotes.filter((quote) => {
    const matchesSearch =
      quote?.number?.toLowerCase().includes(searchText) ||
      quote?.client?.toLowerCase().includes(searchText);

    const matchesStatus = filteredStatus
      ? quote.status === filteredStatus
      : true;

    const matchesDates =
      filteredDates?.length === 2
        ? dayjs(quote.issueDate).isBetween(
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
      title: t("screens.quote.columns.number"),
      dataIndex: "number",
      key: "number",
      sorter: (a, b) => a.number.localeCompare(b.number),
    },
    {
      title: t("screens.quote.columns.client"),
      dataIndex: "client",
      key: "client",
      sorter: (a, b) => a.client.localeCompare(b.client),
    },
    {
      title: t("screens.quote.columns.issueDate"),
      dataIndex: "issueDate",
      key: "issueDate",
      sorter: (a, b) => new Date(a.issueDate) - new Date(b.issueDate),
    },
    {
      title: t("screens.quote.columns.dueDate"),
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    },
    {
      title: t("screens.quote.columns.amount"),
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: t("screens.quote.columns.status"),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = WHITE;
        let backgroundColor = WHITE;

        if (status === t("screens.quote.status.accepted")) {
          color = SUCCESS;
          backgroundColor = LIGHT_GREEN;
        } else if (status === t("screens.quote.status.pending")) {
          color = WARNING;
          backgroundColor = WHITE;
        } else if (status === t("screens.quote.status.rejected")) {
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
              label: t("screens.quote.menu.edit"),
              icon: <EditOutlined />,
              onClick: () => navigate(`/quotes/edit/${record.id}`),
            },
            {
              key: "delete",
              label: t("screens.quote.menu.delete"),
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
            {t("screens.quote.title")}
          </h1>
        </Col>
        <Col>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/quotes/new")}
            style={{
              backgroundColor: PRIMARY,
              borderColor: PRIMARY,
            }}
          >
            {t("screens.quote.newQuoteButton")}
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
              placeholder={t("screens.quote.searchPlaceholder")}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              style={{ width: 250 }}
              size="large"
            />
            <Select
              placeholder={t("screens.quote.filterStatusPlaceholder")}
              onChange={handleStatusChange}
              allowClear
              style={{ width: 180 }}
              size="large"
            >
              <Option value={t("screens.quote.status.accepted")}>
                {t("screens.quote.status.accepted")}
              </Option>
              <Option value={t("screens.quote.status.pending")}>
                {t("screens.quote.status.pending")}
              </Option>
              <Option value={t("screens.quote.status.rejected")}>
                {t("screens.quote.status.rejected")}
              </Option>
            </Select>
          </Space>
        </Col>
      </Row>

      {loading ? (
        <Spin tip={t("screens.quote.loading")} />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : (
        <Table columns={columns} dataSource={filteredData} rowKey="id" />
      )}
    </div>
  );
};

export default QuotesScreen;
