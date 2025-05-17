import React, { useEffect } from "react";
import { Drawer, Form, Input, Button } from "antd";
import { useTranslation } from "react-i18next";
import { PRIMARY } from "../../utils/constants/colors";

const CategoryDrawerForm = ({ open, onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

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
          ? t("screens.categories.editTitle")
          : t("screens.categories.addTitle")
      }
      onClose={onClose}
      open={open}
      width={400}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label={t("screens.categories.name")}
          rules={[
            { required: true, message: t("screens.categories.nameRequired") },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label={t("screens.categories.description")}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: PRIMARY }}
          >
            {t("screens.categories.save")}
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={onClose}>
            {t("screens.categories.cancel")}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CategoryDrawerForm;
