import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Clients from './pages/Clients';
import FleetManagement from './pages/FleetManagement';
import NDTInspection from './pages/NDTInspection';
import Accreditations from './pages/Accreditations';
import About from './pages/About';
import BusinessEthics from './pages/BusinessEthics';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
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
            <Route path="/services/fleet-management" element={<FleetManagement />} />
            <Route path="/services/ndt-inspection" element={<NDTInspection />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
