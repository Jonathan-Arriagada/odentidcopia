import "./App.css";
import Show from "./components/Pacientes/Show";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Create from "./components/Pacientes/Create";
import Edit from "./components/Pacientes/Edit";
import Login from "./components/Login";
import { useContext, } from "react";
import { AuthContext } from "./context/AuthContext";
import Agenda from "./components/Agenda/Agenda";
import Tarifario from "./components/Tarifario/Tarifario";
import CreateTarifa from "./components/Tarifario/CreateTarifa";
import Tratamientos from "./components/Tratamientos/Tratamientos";
import PanelAdmin from "./components/Admin/PanelAdmin";
import MiPerfil from "./components/Admin/MiPerfil";


function App() {
  const {currentUser} = useContext(AuthContext)
  const RequireAuth = ({children}) => {
    return currentUser ? children : <Navigate to="/"/>
  };

  /*//HAY QUE VALIDAR ESTO CON EL ROL NO CON MAIL
  function RequireAdmin({ children }) {
    const { currentUser } = useContext(AuthContext);
    if (currentUser && currentUser.email === "test@hotmail.com") { 
      return children;
    } else {
      return <Navigate to="/agenda" />;
    }
  }*/

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />}/>
            <Route index path="admin" element={<RequireAuth><PanelAdmin/></RequireAuth>}/>
            <Route index path="miPerfil" element={<RequireAuth><MiPerfil/></RequireAuth>}/>
            <Route index path="clients" element={<RequireAuth><Show/></RequireAuth>}/>
            <Route path="create" element={<RequireAuth><Create /></RequireAuth>}/>
            <Route path="edit/:id" element={<RequireAuth><Edit /></RequireAuth>}/>
            <Route path="Agenda" element={<RequireAuth><Agenda /></RequireAuth>}/>
            <Route path="tarifas" element={<RequireAuth><Tarifario /></RequireAuth>}/>
            <Route path="CreateTarifa" element={<RequireAuth><CreateTarifa /></RequireAuth>}/>
            <Route path="tratamientos" element={<RequireAuth><Tratamientos /></RequireAuth>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
