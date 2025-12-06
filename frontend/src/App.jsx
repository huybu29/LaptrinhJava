import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './services/AuthContext';

// Components & Layouts
import Navbar from './components/NavBar';
import CustomerLayout from './components/CustomerLayout';

// Common pages
import Homepage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Customer pages
import CustomerDashboard from './pages/customer/CustomerDashBoard';
import MyVehicles from './pages/customer/CustomerVehicle';
import BookingPage from './pages/customer/CustomerBooking';
import PaymentPage from './pages/customer/CustomerPayment';
import CustomerTicketPage from './pages/customer/CustomerSupport';
import CustomerBookingDetail from './pages/customer/CustomerBookingDetail';
import CustomerPaymentDetail from './pages/customer/CustomerPaymentDetail';
import SubscriptionPlans from './pages/customer/CustomerSubsciptionList';
// Admin pages
import AdminPage from './pages/admin/AdminPage';
import AdminAppointments from './pages/admin/AdBookingManagement';
import AdminNotifications from './pages/admin/AdNotification';
import AdminBatteryPackages from './pages/admin/AdBatteryPackageManagement';
import AdminUsers from './pages/admin/AdUserManagement';
import AdminVehicles from './pages/admin/AdVehicleManagement';
import AdminStations from './pages/admin/AdCenterManagement';
import AdminEditStation from './pages/admin/AdCenterEdit';
import AdminParts from './pages/admin/AdBatteryManagement';
import AdminTickets from './pages/admin/AdTicketManagement';
import AdminReportPage from './pages/admin/AdReport';
import AdminDashboard from './pages/admin/AdDashboard';
// Staff pages
import StaffPage from "./pages/staff/StaffPage";
import StaffInvetoryPage from './pages/staff/StaffBatteryManagement';
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffTransactionPage from './pages/staff/StaffTransactionPage';
import StationAppointmentManager from './pages/staff/StaffBookingManagement';

import UserLocation from "./components/UserLocation";
import SubscriptionCheckout from './pages/customer/CustomerPlanRegister';

function App() {
  return (
    <AuthProvider>
      <Router>
       
        <Routes>

          {/* Trang chủ & Auth */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Customer (Driver) Routes — nằm trong CustomerLayout */}
          <Route path="/driver" element={<CustomerLayout />}>
            <Route index element={<CustomerDashboard />} />
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="my-vehicle" element={<MyVehicles />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="support-center" element={<CustomerTicketPage />} />
            <Route path="location" element={<UserLocation />} />
            <Route path="booking/:id" element={<CustomerBookingDetail />} />
            <Route path="payment/:id" element={<CustomerPaymentDetail />} />
            <Route path="rental-packages" element={<SubscriptionPlans />} />
            <Route path="checkout" element={<SubscriptionCheckout />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminPage />}>
            <Route path="users" element={<AdminUsers />} />
            <Route path="vehicles" element={<AdminVehicles />} />
            <Route path="tickets" element={<AdminTickets />} />
            <Route path="bookings" element={<AdminAppointments />} />
            <Route path="stations" element={<AdminStations />} />
            <Route path="stations/:id" element={<AdminEditStation />} />
            <Route path="batteries" element={<AdminParts />} />
            <Route path="notification" element={<AdminNotifications />} />
            <Route path="battery-packages" element={<AdminBatteryPackages />} />
            <Route path="reports" element={<AdminReportPage />} />
            <Route path='dashboard' element={<AdminDashboard />} />
          </Route>

          {/* Staff Routes */}
          <Route path="/staff" element={<StaffPage />}>
            <Route path='dashboard' element={<StaffDashboard />} />
            <Route path="inventory" element={<StaffInvetoryPage />} />
            <Route path="swap-process/:id" element={<StaffTransactionPage />} />
            <Route path="bookings" element={<StationAppointmentManager />} />
            
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
