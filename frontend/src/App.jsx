import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './services/AuthContext';
import Homepage from './pages/HomePage';
import Navbar from './components/NavBar';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CustomerDashboard from './pages/customer/CustomerDashBoard';
import AdminAppointments from './pages/admin/AdBookingManagement';
import AdminDashboard from './pages/admin/AdminPage';
import AdminNotifications from './pages/admin/AdNotification';
import AdminBatteryPackages from './pages/admin/AdBatteryPackageManagement';
import AdminUsers from './pages/admin/AdUserManagement';
import AdminVehicles from './pages/admin/AdVehicleManagement';
import AdminStations from './pages/admin/AdCenterManagement';
import AdminEditStation from './pages/admin/AdCenterEdit';
import AdminParts from './pages/admin/AdBatteryManagement';
import MyVehicles from './pages/customer/CustomerVehicle';
import BookingPage from './pages/customer/CustomerBooking';
import PaymentPage from './pages/customer/CustomerPayment';
import AdminTickets from './pages/admin/AdTicketManagement';
import CustomerTicketPage from './pages/customer/CustomerSupport';
import UserLocation from "./components/UserLocation";

function App() {
  return (
  <AuthProvider>
    <Router>
        <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/driver" element={<CustomerDashboard/>}/>
        <Route path="/my-vehicle" element={<MyVehicles/>}/>
        <Route path="/booking" element={<BookingPage/>}/>
        <Route path="/payment" element={<PaymentPage/>}/>
        <Route path="/support-center" element={<CustomerTicketPage/>}/>
        <Route path="/admin" element={<AdminDashboard/>}>
          <Route path="/admin/users" element={<AdminUsers/>}/>
          <Route path="/admin/vehicles" element={<AdminVehicles/>}/>
          <Route path='/admin/tickets' element={<AdminTickets/>}/>
          <Route path="/admin/bookings" element={<AdminAppointments/>}/>
          <Route path="/admin/stations" element={<AdminStations/>}/>
          <Route path="/admin/stations/:id" element={<AdminEditStation/>}/>
          <Route path="/admin/batteries" element={<AdminParts/>}/>
          <Route path="/admin/notification" element={<AdminNotifications/>}/>
        </Route>
      </Routes>
    </Router>
  </AuthProvider>
  );
}

export default App;
