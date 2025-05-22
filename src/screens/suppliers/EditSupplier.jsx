import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Card, Spin, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSuppliers, updateSupplier } from "../../container/redux/slices/supplierSlice";
import { PRIMARY } from "../../utils/constants/colors";

const EditSupplier = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { suppliers, error } = useSelector((state) => state.suppliers);
  const [initialLoading, setInitialLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [supplierData, setSupplierData] = useState(null);

  useEffect(() => {
    const loadSupplier = async () => {
      try {
        await dispatch(fetchSuppliers()).unwrap();
        const supplier = suppliers.find((s) => s.id === parseInt(id));
        if (supplier) {
          setSupplierData(supplier);
          form.setFieldsValue({
            name: supplier.name,
            email: supplier.email,
            phone: supplier.phone,
            adress: supplier.adress,
            code_tva: supplier.code_tva,
          });
        } else {
          message.error("Supplier not found");
          navigate("/suppliers");
        }
      } catch (error) {
        message.error(error || "Failed to load supplier data");
      } finally {
        setInitialLoading(false);
      }
    };

    loadSupplier();
  }, [dispatch, id, form, navigate]);

  const onFinish = async (values) => {
    try {
      setUpdateLoading(true);
      await dispatch(updateSupplier({ id: parseInt(id), data: values })).unwrap();
      message.success("Supplier updated successfully");
      navigate("/suppliers");
    } catch (error) {
      message.error(error || "Failed to update supplier");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" type="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Card title="Edit Supplier" style={{ maxWidth: 800, margin: "0 auto" }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={supplierData}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please enter the supplier name" },
              { max: 255, message: "Name cannot exceed 255 characters" },
            ]}
          >
            <Input placeholder="Enter supplier name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: "email", message: "Please enter a valid email" },
              { max: 255, message: "Email cannot exceed 255 characters" },
            ]}
          >
            <Input placeholder="Enter supplier email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please enter the supplier phone number" },
              { max: 20, message: "Phone number cannot exceed 20 characters" },
              {
                pattern: /^[0-9+\-\s()]*$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input placeholder="Enter supplier phone number" />
          </Form.Item>

          <Form.Item
            name="adress"
            label="Address"
            rules={[{ max: 255, message: "Address cannot exceed 255 characters" }]}
          >
            <Input.TextArea
              placeholder="Enter supplier address"
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>

          <Form.Item
            name="code_tva"
            label="VAT Code"
            rules={[{ max: 50, message: "VAT code cannot exceed 50 characters" }]}
          >
            <Input placeholder="Enter supplier VAT code" />
          </Form.Item>

          <Form.Item>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <Button onClick={() => navigate("/suppliers")}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updateLoading}
                style={{ backgroundColor: PRIMARY }}
              >
                Update Supplier
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditSupplier;
