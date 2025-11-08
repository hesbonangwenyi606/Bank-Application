import React from 'react';
import { Route, Routes} from 'react-router-dom';
import SignUpForm from './components/signUpForm';
import LoginForm from './components/login';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginPage from './components/AdminLoginPage';
import AdminSignupPage from './components/AdminSignupPage';
import HomePage from './components/HomePage';
import UserAccountsPage from './components/UserAccountsPage';
import CreateAccount from './components/CreateAccount';
import TransactionsPage from './components/TransactionForm';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AboutUsPage from './components/AboutUsPage';
import ServicesPage from './components/ServicesPage';



function App() {
  return (
    <>
    <Navbar/>
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard/:userId" element={<UserDashboard />} />
        <Route path="/user/:userId/accounts" element={<UserAccountsPage />} />
        <Route path="/user/:userId/create-account" element={<CreateAccount />} />
        <Route path="/user/:userId/accounts/:accountId/transactions" element={<TransactionsPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/signup" element={<AdminSignupPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/services" element={<ServicesPage />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
