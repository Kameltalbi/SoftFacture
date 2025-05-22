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
  Grid,
} from "antd";
import ActionsDropdown from "../../components/common/ActionsDropdown";
import { CheckCircleOutlined, CopyOutlined, DeleteOutlined, EditOutlined, FilePdfFilled, FilePdfOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteInvoice, fetchInvoices } from "../../container/redux/slices/invoicesSlice";
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
  BLACK,
} from "../../utils/constants/colors";
import { useTranslation } from "react-i18next";
import PreviewInvoiceModal from "../../components/invoices/PreviewInvoiceModal";

const { useBreakpoint } = Grid;

dayjs.extend(isBetween);

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const InvoicesScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isTablet = screens.md && !screens.lg;

  const invoices = useSelector((state) => state.invoices.invoices);
  const loading = useSelector((state) => state.invoices.loading);
  const error = useSelector((state) => state.invoices.error);

  const [searchText, setSearchText] = useState("");
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [filteredDates, setFilteredDates] = useState([]);

  useEffect(() => {
    dispatch(fetchInvoices());
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

  const handleDelete = (id) => {
    dispatch(deleteInvoice(id));
    message.success(t("screens.invoice.messages.deleteSuccess", { id }));
  };

  const filteredData = invoices.filter((invoice) => {
    const clientName =
      typeof invoice?.client === "string"
        ? invoice.client
        : invoice?.client?.nom || invoice?.client?.fullName || invoice?.client?.name || "";

    const matchesSearch =
      (invoice?.invoice_number?.toLowerCase().includes(searchText) ||
        clientName.toLowerCase().includes(searchText));

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
      dataIndex: "invoice_number",
      key: "invoice_number",
      sorter: (a, b) => (a.invoice_number || "").localeCompare(b.invoice_number || ""),
    },
    {
      title: t("screens.invoice.columns.issueDate"),
      dataIndex: "issueDate",
      key: "issueDate",
      sorter: (a, b) => new Date(a.issueDate) - new Date(b.issueDate),
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: t("screens.invoice.columns.client"),
      dataIndex: "client",
      key: "client",
      sorter: (a, b) => {
        const clientNameA = typeof a.client === "string" ? a.client : a.client?.nom || a.client?.fullName || a.client?.name || "";
        const clientNameB = typeof b.client === "string" ? b.client : b.client?.nom || b.client?.fullName || b.client?.name || "";
        return clientNameA.localeCompare(clientNameB);
      },
      render: (client) => {
        if (typeof client === "string") return client;
        return client?.nom || client?.fullName || client?.name || "-";
      },
    },
    {
      title: t("screens.invoice.columns.amount"),
      dataIndex: "total_amount",
      key: "total_amount",
      sorter: (a, b) => (a.total_amount || 0) - (b.total_amount || 0),
      render: (amount) => amount ? `${Number(amount).toFixed(3)} DT` : '0.000 DT',
    },
    {
      title: t("screens.invoice.columns.status"),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = BLACK;
        let backgroundColor = WHITE;

        if (status === t("screens.invoice.status.paid")) {
          color = BLACK;
          backgroundColor = LIGHT_GREEN;
        } else if (status === t("screens.invoice.status.unpaid")) {
          color = BLACK;
          backgroundColor = WHITE;
        } else if (status === t("screens.invoice.status.overdue")) {
          color = BLACK;
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
              key: "duplicate",
              label: t("screens.invoice.menu.duplicate"),
              icon: <CopyOutlined />,
              onClick: () => handleDuplicate(record),
            },
            {
              key: "markAsPaid",
              label: t("screens.invoice.menu.markAsPaid"),
              icon: <CheckCircleOutlined />,
              onClick: () => handleMarkAsPaid(record.id),
            },
            {
              key: "downloadPdf",
              label: t("screens.invoice.menu.downloadPdf"),
              icon: <FilePdfOutlined />,
              onClick: () => handleDownloadPDF(record.id),
            },
            {
              key: "sendEmail",
              label: t("screens.invoice.menu.sendEmail"),
              icon: <MailOutlined />,
              onClick: () => handleSendEmail(record.id),
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

  const handleDuplicate = (invoice) => {
    const newInvoice = {
      ...invoice,
      id: undefined, // or null, depending on backend
      status: "DRAFT",
      invoiceNumber: `COPY-${invoice.invoiceNumber}`,
    };
    navigate("/invoices/new", { state: { invoice: newInvoice } });
  };

  const handleMarkAsPaid = async (id) => {
    message.success(t("screens.invoice.messages.markedAsPaid"));
  };

  const handleDownloadPDF = async (id) => {
    try {
      // Make a GET request to the download PDF endpoint
      const response = await fetch(`https://fa33-2c0f-f698-c237-9b5e-bd97-b055-f3dc-4700.ngrok-free.app/api/invoices/${id}/download-pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      
      // Set the filename using the invoice number if available
      const invoice = invoices.find(inv => inv.id === id);
      const filename = invoice ? `invoice_${invoice.invoice_number}.pdf` : `invoice_${id}.pdf`;
      link.setAttribute('download', filename);
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      
      message.success(t("screens.invoice.messages.downloadSuccess"));
    } catch (error) {
      console.error('Error downloading PDF:', error);
      message.error(t("screens.invoice.messages.downloadError"));
    }
  };

  const handleSendEmail = async (id) => {
    //await api.sendInvoiceEmail(id);
    message.success(t("screens.invoice.messages.emailSent"));
  };

  return (
    <div style={{ padding: isMobile ? 16 : 24, backgroundColor: WHITE }}>
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <h1 style={{ 
            margin: 0, 
            color: PRIMARY,
            fontSize: isMobile ? '1.5rem' : '2rem'
          }}>
            {t("screens.invoice.title")}
          </h1>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ textAlign: isMobile ? 'left' : 'right' }}>
          <Button
            type="primary"
            size={isMobile ? "middle" : "large"}
            onClick={() => navigate("/invoices/new")}
            style={{
              backgroundColor: PRIMARY,
              borderColor: PRIMARY,
              width: isMobile ? '100%' : 'auto'
            }}
          >
            {t("screens.invoice.newInvoiceButton")}
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16, marginBottom: 16 }}>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <RangePicker 
            onChange={handleDateChange} 
            size={isMobile ? "middle" : "large"}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Space 
            direction={isMobile ? "vertical" : "horizontal"} 
            style={{ width: '100%' }}
            size={isMobile ? 8 : 16}
          >
            <Search
              placeholder={t("screens.invoice.searchPlaceholder")}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              style={{ width: isMobile ? '100%' : 250 }}
              size={isMobile ? "middle" : "large"}
            />
            <Select
              placeholder={t("screens.invoice.filterStatusPlaceholder")}
              onChange={handleStatusChange}
              allowClear
              style={{ width: isMobile ? '100%' : 180 }}
              size={isMobile ? "middle" : "large"}
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
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <Spin>
            <div style={{ height: '200px' }} />
          </Spin>
        </div>
      ) : error ? (
        <Alert message={error} type="error" />
      ) : (
        <Table 
          columns={columns.map(col => ({
            ...col,
            ellipsis: true,
            width: isMobile ? undefined : col.width,
            responsive: ['xs', 'sm', 'md', 'lg', 'xl']
          }))} 
          dataSource={filteredData} 
          rowKey="id"
          scroll={{ x: isMobile ? 'max-content' : undefined }}
          pagination={{
            responsive: true,
            showSizeChanger: !isMobile,
            showTotal: (total) => t("common.totalItems", { total }),
            pageSize: isMobile ? 10 : 20,
            pageSizeOptions: ['10', '20', '50', '100']
          }}
        />
      )}
    </div>
  );
};

export default InvoicesScreen;
