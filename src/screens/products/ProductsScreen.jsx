import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  message,
  Spin,
  Alert,
  Popconfirm,
  Select,
  Grid,
  Row,
  Col,
  Space,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { ProductDrawerForm } from "../../components/products/ProductDrawerForm";
import {
  fetchProducts,
  deleteProduct,
  clearError,
} from "../../container/redux/slices/productsSlice";
import { fetchCategories } from "../../container/redux/slices/categoriesSlice";
import { useTranslation } from "react-i18next";
import ActionsDropdown from "../../components/common/ActionsDropdown";
import { PRIMARY } from "../../utils/constants/colors";

const { useBreakpoint } = Grid;
const { Option } = Select;

const ProductsScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const { products, loading, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts(selectedCategory));
  }, [dispatch, selectedCategory]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsDrawerVisible(true);
  };

  const handleEdit = (product) => {
    console.log('Editing product - Full product data:', JSON.stringify(product, null, 2));
    console.log('Editing product - Required fields:', {
      name: product.name,
      description: product.description,
      category_id: product.category_id,
      TVA: product.TVA
    });
    setSelectedProduct(product);
    setIsDrawerVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      message.success("Product deleted successfully");
    } catch (error) {
      message.error(error || "Failed to delete product");
    }
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ellipsis: true,
      width: isMobile ? undefined : 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: isMobile ? undefined : 250,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_, record) => {
        const category = categories.find(cat => cat.id === record.category_id);
        return category ? category.name : "N/A";
      },
      sorter: (a, b) => {
        const categoryA = categories.find(cat => cat.id === a.category_id)?.name || "";
        const categoryB = categories.find(cat => cat.id === b.category_id)?.name || "";
        return categoryA.localeCompare(categoryB);
      },
      ellipsis: true,
      width: isMobile ? undefined : 150,
    },
    {
      title: "TVA",
      dataIndex: "TVA",
      key: "TVA",
      render: (value) => `${value}%`,
      sorter: (a, b) => a.TVA - b.TVA,
      width: isMobile ? undefined : 100,
    },
    {
      title: "Actions",
      key: "actions",
      width: isMobile ? 120 : 150,
      fixed: "right",
      render: (_, record) => (
        <Space size={isMobile ? 4 : 8}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size={isMobile ? "small" : "middle"}
          />
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              size={isMobile ? "small" : "middle"}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading && !products.length) {
    return (
      <div style={{ textAlign: "center", padding: isMobile ? 24 : 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? 16 : 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: isMobile ? 16 : 24 }}>
        <Col>
          <h1 style={{ 
            fontSize: isMobile ? 20 : 24, 
            fontWeight: "bold",
            margin: 0 
          }}>
            {t("screens.products.title")}
          </h1>
        </Col>
        <Col>
          <Space size={isMobile ? 8 : 16}>
            <Select
              style={{ width: isMobile ? 150 : 200 }}
              placeholder="Filter by category"
              allowClear
              onChange={handleCategoryChange}
              value={selectedCategory}
              size={isMobile ? "middle" : "large"}
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{ backgroundColor: PRIMARY }}
              size={isMobile ? "middle" : "large"}
            >
              Add Product
            </Button>
          </Space>
        </Col>
      </Row>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: isMobile ? 16 : 24 }}
          closable
          onClose={() => dispatch(clearError())}
        />
      )}

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        scroll={{ x: isMobile ? 'max-content' : undefined }}
        pagination={{
          showSizeChanger: !isMobile,
          showTotal: (total) => t("common.totalItems", { total }),
          pageSize: isMobile ? 10 : 20,
          pageSizeOptions: ['10', '20', '50', '100'],
          size: isMobile ? "small" : "default",
        }}
        size={isMobile ? "small" : "middle"}
      />

      <ProductDrawerForm
        visible={isDrawerVisible}
        onClose={() => {
          console.log('Closing drawer, selected product:', selectedProduct);
          setIsDrawerVisible(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        categories={categories}
      />
    </div>
  );
};

export default ProductsScreen;
