// AppRoutes.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "../screens/auth/LoginScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import ClientScreen from "../screens/clients/ClientScreen";
import CreateClient from "../screens/clients/CreateClient";
import EditClient from "../screens/clients/EditClient";
import NotFoundPage from "../screens/notfound/NotFoundScreen";
import PrivateLayout from "../navigation/PrivateLayout";
import SettingsScreen from "../screens/settings/SettingsScreen";
import InvoiceScreen from "../screens/Invoice/InvoiceScreen";
import CreateInvoice from "../screens/Invoice/CreateInvoice";
import SupplierScreen from "../screens/suppliers/SupplierScreen";
import CreateSupplier from "../screens/suppliers/CreateSupplier";
import EditSupplier from "../screens/suppliers/EditSupplier";
import CategoriesScreen from "../screens/category/CategoriesScreen";
import ProductsScreen from "../screens/products/ProductsScreen";
import QuotesScreen from "../screens/quotes/QuoteScreen";
import CreateQuotes from "../screens/quotes/CreateQuotes";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginScreen />} />

        <Route
          path="/dashboard"
          element={
            <PrivateLayout>
              <DashboardScreen />
            </PrivateLayout>
          }
        />
        <Route
          path="/clients"
          element={
            <PrivateLayout>
              <ClientScreen />
            </PrivateLayout>
          }
        />
        <Route
          path="/clients/create"
          element={
            <PrivateLayout>
              <CreateClient />
            </PrivateLayout>
          }
        />

        <Route
          path="/clients/edit/:id"
          element={
            <PrivateLayout>
              <EditClient />
            </PrivateLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <PrivateLayout>
              <SettingsScreen />
            </PrivateLayout>
          }
        />

        <Route
          path="/invoices"
          element={
            <PrivateLayout>
              <InvoiceScreen />
            </PrivateLayout>
          }
        />
        <Route
          path="/quotes"
          element={
            <PrivateLayout>
              <QuotesScreen />
            </PrivateLayout>
          }
        />
        <Route
          path="/quotes/new"
          element={
            <PrivateLayout>
              <CreateQuotes />
            </PrivateLayout>
          }
        />
        <Route
          path="/invoices/new"
          element={
            <PrivateLayout>
              <CreateInvoice />
            </PrivateLayout>
          }
        />
        <Route
          path="/suppliers"
          element={
            <PrivateLayout>
              <SupplierScreen />
            </PrivateLayout>
          }
        />
        <Route
          path="/suppliers/create"
          element={
            <PrivateLayout>
              <CreateSupplier />
            </PrivateLayout>
          }
        />

        <Route
          path="/suppliers/edit/:id"
          element={
            <PrivateLayout>
              <EditSupplier />
            </PrivateLayout>
          }
        />

        <Route
          path="/categories"
          element={
            <PrivateLayout>
              <CategoriesScreen />
            </PrivateLayout>
          }
        />

        <Route
          path="/products"
          element={
            <PrivateLayout>
              <ProductsScreen />
            </PrivateLayout>
          }
        />

        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
