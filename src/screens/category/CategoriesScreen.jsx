import React, { useState, useEffect } from "react";
import { Table, Button, message, Spin, Alert, Popconfirm } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCategories,
  deleteCategory,
  clearError,
} from "../../container/redux/slices/categoriesSlice";
import { useTranslation } from "react-i18next";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import CategoryDrawerForm from "../../components/categories/CategoryDrawerForm";
import { PRIMARY } from "../../utils/constants/colors";

const CategoriesScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleAdd = () => {
    setSelectedCategory(null);
    setDrawerOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedCategory(record);
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
      message.success(t("screens.categories.messages.deleteSuccess"));
    } catch (error) {
      message.error(error || t("screens.categories.messages.deleteError"));
    }
  };

  const columns = [
    {
      title: t("screens.categories.name"),
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ellipsis: true,
    },
    {
      title: t("screens.categories.description"),
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: t("screens.categories.actions"),
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title={t("screens.categories.deleteConfirm.title")}
            description={t("screens.categories.deleteConfirm.description")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("common.yes")}
            cancelText={t("common.no")}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (loading && !categories.length) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          {t("screens.categories.title")}
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={{ backgroundColor: PRIMARY }}
        >
          {t("screens.categories.addNew")}
        </Button>
      </div>

      {error && (
        <Alert
          message={t("common.error")}
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => dispatch(clearError())}
          style={{ marginBottom: "16px" }}
        />
      )}

      <Table
        dataSource={categories}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: "max-content" }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
      />

      <CategoryDrawerForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initialValues={selectedCategory}
      />
    </div>
  );
};

export default CategoriesScreen;
