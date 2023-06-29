import "./App.css";
import Show from "./components/Pacientes/Show";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Create from "./components/Pacientes/Create";
import Edit from "./components/Pacientes/Edit";
import Login from "./components/Login";
import { useContext} from "react";
import { AuthContext } from "./context/AuthContext";
import Agenda from "./components/Agenda/Agenda";
import Tarifario from "./components/Tarifario/Tarifario";
import CreateTarifa from "./components/Tarifario/CreateTarifa";
import Tratamientos from "./components/Tratamientos/Tratamientos";
import PanelAdmin from "./components/Admin/PanelAdmin";
import MiPerfil from "./components/Admin/MiPerfil";
import History from "./components/HistoriaClinica/History.jsx";
import Ingresos from "./components/Ingresos/Ingresos";
import Gastos from "./components/Gastos/Gastos";
import Materiales from "./components/Gastos/Parametros/Materiales";
import Proveedores from "./components/Gastos/Parametros/Proveedores";
import ControlEvolucion from "./components/ControlEvolucion/ControlEvolucion";
import Dashboard from "./components/Dashboard/Dashboard";
import Navigation from "./components/Navigation"
import UpNav from "./components/UpNav"

function App() {
  const { currentUser } = useContext(AuthContext)
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/" />
  };

  function RequireAdmin({ children }) {
    const storedRole = localStorage.getItem('rol');

    if (storedRole === process.env.REACT_APP_rolAdCon) {
      return children;
    } else {
      return <Navigate to="/pacientes" />;
    }
  }

  return (
    <div className="App mainpage">
      <BrowserRouter>
      <Navigation />
      <UpNav />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route index path="/admin" element={<RequireAuth><RequireAdmin><PanelAdmin /></RequireAdmin></RequireAuth>} />
          <Route index path="/miPerfil" element={<RequireAuth><MiPerfil /></RequireAuth>} />
          <Route index path="/pacientes" element={<RequireAuth><Show /></RequireAuth>} />
          <Route path="/create" element={<RequireAuth><Create /></RequireAuth>} />
          <Route path="/edit/:id" element={<RequireAuth><Edit /></RequireAuth>} />
          <Route path="/agenda" element={<RequireAuth><Agenda /></RequireAuth>} />
          <Route path="/tarifario" element={<RequireAuth><Tarifario /></RequireAuth>} />
          <Route path="/CreateTarifa" element={<RequireAuth><CreateTarifa /></RequireAuth>} />
          <Route path="/tratamientos" element={<RequireAuth><Tratamientos /></RequireAuth>} />
          <Route path="/historias" element={<RequireAuth><History /></RequireAuth>} />
          <Route path="/controlEvoluciones" element={<RequireAuth><ControlEvolucion /></RequireAuth>} />
          <Route path="/historias/:id" element={<RequireAuth><History /></RequireAuth>} />
          <Route path="/ventas" element={<RequireAuth><Ingresos /></RequireAuth>} />
          <Route path="/compras" element={<RequireAuth><Gastos /></RequireAuth>} />
          <Route path="/materiales" element={<RequireAuth><Materiales /></RequireAuth>} />
          <Route path="/proveedores" element={<RequireAuth><Proveedores /></RequireAuth>} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
