import React, { useEffect } from "react";
import { Drawer, Form, Input, Button, InputNumber, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { PRIMARY } from "../../utils/constants/colors";

const ProductDrawerForm = ({ open, onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    if (initialValues) form.setFieldsValue(initialValues);
    else form.resetFields();
  }, [initialValues, form]);

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Drawer
      title={
        initialValues
          ? t("screens.products.editTitle")
          : t("screens.products.addTitle")
      }
      onClose={onClose}
      open={open}
      width={420}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label={t("screens.products.name")}
          rules={[
            { required: true, message: t("screens.products.nameRequired") },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label={t("screens.products.description")}
          rules={[
            {
              required: true,
              message: t("screens.products.descriptionRequired"),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="categoryId"
          label={t("screens.products.category")}
          rules={[
            { required: true, message: t("screens.products.categoryRequired") },
          ]}
        >
          <Select placeholder={t("screens.products.selectCategory")}>
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="unitPrice" label={t("screens.products.unitPrice")}>
          <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
        </Form.Item>

        <Form.Item name="taxRate" label={t("screens.products.taxRate")}>
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            max={100}
            formatter={(val) => `${val}%`}
            parser={(val) => val.replace("%", "")}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: PRIMARY }}
          >
            {t("screens.products.save")}
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={onClose}>
            {t("screens.products.cancel")}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ProductDrawerForm;
