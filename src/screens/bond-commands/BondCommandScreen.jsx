import React, { useState, useEffect } from "react";
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
import { DeleteOutlined, EditOutlined, FilePdfOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBondCommands, deleteBondCommand, cancelBondCommand } from "../../container/redux/slices/bondCommandsSlice";
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
import axios from "axios";

dayjs.extend(isBetween);

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const BondCommandScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const commands = useSelector((state) => state.bondCommands?.commands || []);
  const loading = useSelector((state) => state.bondCommands?.loading);
  const error = useSelector((state) => state.bondCommands?.error);

  const [searchText, setSearchText] = useState("");
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [filteredDates, setFilteredDates] = useState([]);

  useEffect(() => {
    dispatch(fetchBondCommands());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchText(value.trim().toLowerCase());
  };

  const handleStatusChange = (value) => {
    setFilteredStatus(value);
  };

  const handleDateChange = (dates) => {
    setFilteredDates(dates);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteBondCommand(id)).unwrap();
    } catch (error) {
      message.error(error);
    }
  };

  const handleCancel = async (id) => {
    try {
      await dispatch(cancelBondCommand(id)).unwrap();
    } catch (error) {
      message.error(error);
    }
  };

  const handleDownloadPdf = async (id) => {
    try {
      const response = await axios.get(`/api/bond-commands/${id}/download-pdf`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bond-command-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      message.error("Failed to download PDF");
    }
  };

  const filteredData = (commands || []).filter((command) => {
    if (!command) return false;
    
    const matchesSearch =
      (command.command_number?.toLowerCase() || '').includes(searchText) ||
      (command.client?.name?.toLowerCase() || '').includes(searchText);

    const matchesStatus = filteredStatus
      ? command.status === filteredStatus
      : true;

    const matchesDates =
      filteredDates?.length === 2 && command.command_date
        ? dayjs(command.command_date).isBetween(
            filteredDates[0],
            filteredDates[1],
            "day",
            "[]"
          )
        : true;

    return matchesSearch && matchesStatus && matchesDates;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return { color: WARNING, backgroundColor: WHITE };
      case 'sent':
        return { color: PRIMARY, backgroundColor: WHITE };
      case 'paid':
        return { color: SUCCESS, backgroundColor: LIGHT_GREEN };
      case 'cancelled':
        return { color: ERROR, backgroundColor: LIGHT_RED };
      case 'overdue':
        return { color: ERROR, backgroundColor: LIGHT_RED };
      default:
        return { color: WHITE, backgroundColor: WHITE };
    }
  };

  const columns = [
    {
      title: t("screens.bondCommand.columns.commandNumber"),
      dataIndex: "command_number",
      key: "command_number",
      sorter: (a, b) => a.command_number.localeCompare(b.command_number),
    },
    {
      title: t("screens.bondCommand.columns.client"),
      dataIndex: "client",
      key: "client",
      sorter: (a, b) => {
        const nameA = a.client?.name || a.client?.fullName || '';
        const nameB = b.client?.name || b.client?.fullName || '';
        return nameA.localeCompare(nameB);
      },
      render: (client) => {
        if (!client) return '-';
        return client.name || client.fullName || client.nom || '-';
      }
    },
    {
      title: t("screens.bondCommand.columns.commandDate"),
      dataIndex: "command_date",
      key: "command_date",
      sorter: (a, b) => new Date(a.command_date) - new Date(b.command_date),
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: t("screens.bondCommand.columns.dueDate"),
      dataIndex: "due_date",
      key: "due_date",
      sorter: (a, b) => new Date(a.due_date) - new Date(b.due_date),
      render: (date) => date ? dayjs(date).format("YYYY-MM-DD") : "-",
    },
    {
      title: t("screens.bondCommand.columns.amount"),
      dataIndex: "total_after_discount_with_tax",
      key: "amount",
      sorter: (a, b) => (a.total_after_discount_with_tax || 0) - (b.total_after_discount_with_tax || 0),
      render: (amount, record) => {
        const value = amount || 0;
        return `${value.toFixed(2)} ${record.currency?.code || ""}`;
      },
    },
    {
      title: t("screens.bondCommand.columns.status"),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const { color, backgroundColor } = getStatusColor(status);
        return (
          <Tag
            style={{
              color,
              backgroundColor,
              borderColor: color,
            }}
          >
            {t(`screens.bondCommand.status.${status}`)}
          </Tag>
        );
      },
    },
    {
      title: "",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <ActionsDropdown
          menuItems={[
            {
              key: "edit",
              label: t("screens.bondCommand.menu.edit"),
              icon: <EditOutlined />,
              onClick: () => navigate(`/bond-commands/edit/${record.id}`),
            },
            {
              key: "pdf",
              label: t("screens.bondCommand.menu.downloadPdf"),
              icon: <FilePdfOutlined />,
              onClick: () => handleDownloadPdf(record.id),
            },
            ...(record.status !== 'cancelled' ? [{
              key: "cancel",
              label: t("screens.bondCommand.menu.cancel"),
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => handleCancel(record.id),
            }] : []),
            {
              key: "delete",
              label: t("screens.bondCommand.menu.delete"),
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
            {t("screens.bondCommand.title")}
          </h1>
        </Col>
        <Col>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/bond-commands/new")}
            style={{
              backgroundColor: PRIMARY,
              borderColor: PRIMARY,
            }}
          >
            {t("screens.bondCommand.newCommandButton")}
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
              placeholder={t("screens.bondCommand.searchPlaceholder")}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              style={{ width: 250 }}
              size="large"
            />
            <Select
              placeholder={t("screens.bondCommand.filterStatusPlaceholder")}
              onChange={handleStatusChange}
              allowClear
              style={{ width: 180 }}
              size="large"
            >
              <Option value="draft">{t("screens.bondCommand.status.draft")}</Option>
              <Option value="sent">{t("screens.bondCommand.status.sent")}</Option>
              <Option value="paid">{t("screens.bondCommand.status.paid")}</Option>
              <Option value="cancelled">{t("screens.bondCommand.status.cancelled")}</Option>
              <Option value="overdue">{t("screens.bondCommand.status.overdue")}</Option>
            </Select>
          </Space>
        </Col>
      </Row>

      {loading ? (
        <Spin tip={t("screens.bondCommand.loading")} />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : (
        <Table columns={columns} dataSource={filteredData} rowKey="id" />
      )}
    </div>
  );
};

export default BondCommandScreen; 