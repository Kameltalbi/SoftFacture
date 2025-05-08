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
          path="/invoices/new"
          element={
            <PrivateLayout>
              <CreateInvoice />
            </PrivateLayout>
          }
        />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
