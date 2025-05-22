import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Drawer, Button, Select, InputNumber, message } from "antd";
import { createProduct, updateProduct } from "../../container/redux/slices/productsSlice";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { PRIMARY } from "../../utils/constants/colors";

const { Option } = Select;
const { TextArea } = Input;

export const ProductDrawerForm = ({ visible, onClose, product, categories }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { categories: reduxCategories } = useSelector((state) => state.categories);

  useEffect(() => {
    if (visible) {
      if (product) {
        console.log('ProductDrawerForm - Setting form values for product:', product);
        setTimeout(() => {
          form.setFieldsValue({
            name: product.name,
            description: product.description,
            category_id: product.category_id,
            price: product.price,
            TVA: product.TVA,
          });
        }, 0);
      } else {
        console.log('ProductDrawerForm - Resetting form for new product');
        form.resetFields();
      }
    }
  }, [form, product, visible]);

  const handleSubmit = async (values) => {
    try {
      if (product) {
        await dispatch(updateProduct({ id: product.id, data: values })).unwrap();
        message.success(t("screens.products.messages.updateSuccess"));
      } else {
        await dispatch(createProduct(values)).unwrap();
        message.success(t("screens.products.messages.createSuccess"));
      }
      onClose();
    } catch (error) {
      message.error(error || (product 
        ? t("screens.products.messages.updateError")
        : t("screens.products.messages.createError")));
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title={product ? t("screens.products.editTitle") : t("screens.products.createTitle")}
      placement="right"
      onClose={handleClose}
      open={visible}
      width={500}
      destroyOnClose={false}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={handleClose} style={{ marginRight: 8 }}>
            {t("common.cancel")}
          </Button>
          <Button type="primary" onClick={() => form.submit()}>
            {product ? t("common.update") : t("common.create")}
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        preserve={true}
        initialValues={product ? {
          name: product.name,
          description: product.description,
          category_id: product.category_id,
          price: product.price,
          TVA: product.TVA,
        } : {
          TVA: 0,
          price: 0,
        }}
      >
        <Form.Item
          name="name"
          label={t("screens.products.name")}
          rules={[{ required: true, message: t("screens.products.validation.nameRequired") }]}
        >
          <Input placeholder={t("screens.products.namePlaceholder")} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t("screens.products.description")}
          rules={[{ required: true, message: t("screens.products.validation.descriptionRequired") }]}
        >
          <TextArea
            placeholder={t("screens.products.descriptionPlaceholder")}
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>

        <Form.Item
          name="category_id"
          label={t("screens.products.category")}
          rules={[{ required: true, message: t("screens.products.validation.categoryRequired") }]}
        >
          <Select placeholder={t("screens.products.categoryPlaceholder")}>
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="price"
          label={t("screens.products.price")}
          rules={[{ required: true, message: t("screens.products.validation.priceRequired") }]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder={t("screens.products.pricePlaceholder")}
            formatter={(value) => `${value} DT`}
            parser={(value) => value.replace(' DT', '')}
          />
        </Form.Item>

        <Form.Item
          name="TVA"
          label={t("screens.products.tva")}
          rules={[{ required: true, message: t("screens.products.validation.tvaRequired") }]}
        >
          <InputNumber
            min={0}
            max={100}
            style={{ width: "100%" }}
            placeholder={t("screens.products.tvaPlaceholder")}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ProductDrawerForm;
