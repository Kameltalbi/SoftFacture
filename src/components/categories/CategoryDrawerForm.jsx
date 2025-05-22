import React, { useEffect } from "react";
import { Drawer, Form, Input, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { createCategory, updateCategory, clearError } from "../../container/redux/slices/categoriesSlice";
import { PRIMARY } from "../../utils/constants/colors";

const CategoryDrawerForm = ({ open, onClose, initialValues }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
      }
    }
  }, [open, initialValues, form]);

  const handleSubmit = async (values) => {
    try {
      if (initialValues) {
        await dispatch(updateCategory({ id: initialValues.id, data: values })).unwrap();
        message.success(t("screens.categories.messages.updateSuccess"));
      } else {
        await dispatch(createCategory(values)).unwrap();
        message.success(t("screens.categories.messages.createSuccess"));
      }
      onClose();
    } catch (error) {
      message.error(error || (initialValues 
        ? t("screens.categories.messages.updateError")
        : t("screens.categories.messages.createError")));
    }
  };

  return (
    <Drawer
      title={initialValues 
        ? t("screens.categories.editTitle")
        : t("screens.categories.createTitle")}
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={loading}
            style={{ backgroundColor: PRIMARY }}
          >
            {initialValues 
              ? t("common.update")
              : t("common.create")}
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label={t("screens.categories.name")}
          rules={[
            { required: true, message: t("screens.categories.validation.nameRequired") },
            { max: 255, message: t("screens.categories.validation.nameMaxLength") },
          ]}
        >
          <Input placeholder={t("screens.categories.namePlaceholder")} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t("screens.categories.description")}
          rules={[
            { max: 1000, message: t("screens.categories.validation.descriptionMaxLength") },
          ]}
        >
          <Input.TextArea
            placeholder={t("screens.categories.descriptionPlaceholder")}
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CategoryDrawerForm;
