import React, { useState } from "react";
import { Table, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteCategory,
  addCategory,
  updateCategory,
} from "../../container/redux/slices/categoriesSlice";
import { useTranslation } from "react-i18next";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CategoryDrawerForm from "../../components/categories/CategoryDrawerForm";
import ActionsDropdown from "../../components/common/ActionsDropdown";
import { PRIMARY } from "../../utils/constants/colors";

const CategoriesScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleAdd = () => {
    setSelectedCategory(null);
    setDrawerOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedCategory(record);
    setDrawerOpen(true);
  };

  const handleSubmit = (values) => {
    if (selectedCategory) {
      dispatch(updateCategory({ id: selectedCategory.id, ...values }));
    } else {
      dispatch(addCategory(values));
    }
    setDrawerOpen(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteCategory(id));
  };

  const columns = [
    {
      title: t("screens.categories.name"),
      dataIndex: "name",
      key: "name",
      width: 250,
    },
    {
      title: t("screens.categories.description"),
      dataIndex: "description",
      key: "description",
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
              label: t("screens.categories.actions.edit"),
              icon: <EditOutlined />,
              onClick: () => handleEdit(record),
            },
            {
              key: "delete",
              label: t("screens.categories.actions.delete"),
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
          onClick={handleAdd}
          style={{ backgroundColor: PRIMARY }}
        >
          {t("screens.categories.addNew")}
        </Button>
      </div>

      <Table dataSource={categories} columns={columns} rowKey="id" />

      <CategoryDrawerForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        initialValues={selectedCategory}
      />
    </div>
  );
};

export default CategoriesScreen;
