import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Clients from './pages/Clients';
import ServiceDetail from './pages/ServiceDetail';
import Accreditations from './pages/Accreditations';
import About from './pages/About';
import BusinessEthics from './pages/BusinessEthics';
import Contact from './pages/Contact';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/admin/Dashboard';
import ServicesAdmin from './pages/admin/ServicesAdmin';
import AccreditationsAdmin from './pages/admin/AccreditationsAdmin';
import PoliciesAdmin from './pages/admin/PoliciesAdmin';
import ProductsAdmin from './pages/admin/ProductsAdmin';
import UsersAdmin from './pages/admin/UsersAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/services" element={<ProtectedRoute><ServicesAdmin /></ProtectedRoute>} />
        <Route path="/admin/accreditations" element={<ProtectedRoute><AccreditationsAdmin /></ProtectedRoute>} />
        <Route path="/admin/policies" element={<ProtectedRoute><PoliciesAdmin /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute><ProductsAdmin /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><UsersAdmin /></ProtectedRoute>} />

        {/* Public Routes */}
        <Route path="/*" element={
          <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/accreditations" element={<Accreditations />} />
                <Route path="/business-ethics" element={<BusinessEthics />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
