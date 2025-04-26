// AppRoutes.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "../screens/auth/LoginScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import ClientScreen from "../screens/clients/ClientScreen";
import NotFoundPage from "../screens/notfound/NotFoundScreen";
import PrivateLayout from "../navigation/PrivateLayout";

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

        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;