import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Departments from "./pages/Departments";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import Categories from "./pages/Categories";
import Locations from "./pages/Locations";
import Assets from "./pages/Assets";
import Login from "./pages/Login";
import Employees from "./pages/Employees";
import PurchaseOrders from "./pages/PurchaseOrders";
import PurchaseRequests from "./pages/PurchaseRequests";
import Invoices from "./pages/Invoices";
import AmcManagement from "./pages/AmcManagement";
import Helpdesk from "./pages/Helpdesk";
import AssetDetails from "./pages/AssetDetails";
import ScanAsset from "./pages/ScanAsset";

function App() {
  return (
    <Routes>

      {/* Login Page */}
      <Route path="/" element={<Login />} />

      {/* Protected Routes */}
      <Route
  element={
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  }
>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/vendors" element={<Vendors />} />
  <Route path="/categories" element={<Categories />} />
  <Route path="/locations" element={<Locations />} />
  <Route path="/assets" element={<Assets />} />
  <Route path="/departments" element={<Departments />} />
  <Route path="/employees" element={<Employees />} />
  <Route path="/purchase-orders" element={<PurchaseOrders />} />
  <Route path="/purchase-requests" element={<PurchaseRequests />} />
  <Route path="/invoices" element={<Invoices />} />
  <Route path="/amc" element={<AmcManagement />} />
  <Route path="/helpdesk" element={<Helpdesk />} />
  <Route
    path="/assets/:assetCode"
    element={<AssetDetails />}
/>
</Route>
<Route
    path="/scan"
    element={<ScanAsset />}
/>



      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
      <Route
    path="/purchase-orders"
    element={<PurchaseOrders />}
/>

    </Routes>
  );
}

export default App;
