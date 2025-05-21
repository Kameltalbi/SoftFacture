import React, { useState } from "react";
import { Table, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteProduct,
  addProduct,
  updateProduct,
} from "../../container/redux/slices/productsSlice";
import { useTranslation } from "react-i18next";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ProductDrawerForm from "../../components/products/ProductDrawerForm";
import ActionsDropdown from "../../components/common/ActionsDropdown";
import { PRIMARY } from "../../utils/constants/colors";

const ProductsScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAdd = () => {
    setSelectedProduct(null);
    setDrawerOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedProduct(record);
    setDrawerOpen(true);
  };

  const handleSubmit = (values) => {
    if (selectedProduct) {
      dispatch(updateProduct({ id: selectedProduct.id, ...values }));
    } else {
      dispatch(addProduct(values));
    }
    setDrawerOpen(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  const columns = [
    { title: t("screens.products.name"), dataIndex: "name", key: "name" },
    {
      title: t("screens.products.description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t("screens.products.category"),
      dataIndex: "categoryId",
      key: "categoryId",
      render: (id) => categories.find((c) => c.id === id)?.name || "--",
    },
    {
      title: t("screens.products.unitPrice"),
      dataIndex: "unitPrice",
      key: "unitPrice",
    },
    {
      title: t("screens.products.taxRate"),
      dataIndex: "vat",
      key: "vat",
      render: (rate) => `${rate}%`,
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
              label: t("screens.products.actions.edit"),
              icon: <EditOutlined />,
              onClick: () => handleEdit(record),
            },
            {
              key: "delete",
              label: t("screens.products.actions.delete"),
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
          {t("screens.products.title")}
        </h1>
        <Button
          type="primary"
          onClick={handleAdd}
          style={{ backgroundColor: PRIMARY }}
        >
          {t("screens.products.addNew")}
        </Button>
      </div>

      <Table dataSource={products} columns={columns} rowKey="id" />

      <ProductDrawerForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        initialValues={selectedProduct}
      />
    </div>
  );
};

export default ProductsScreen;
