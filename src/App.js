import "./App.css";
import Show from "./components/Pacientes/Show";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Create from "./components/Pacientes/Create";
import Edit from "./components/Pacientes/Edit";
import Login from "./components/Login";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Agenda from "./components/Agenda/Agenda";
import Tarifario from "./components/Tarifario/Tarifario";
import CreateTarifa from "./components/Tarifario/CreateTarifa";
import Tratamientos from "./components/Tratamientos/Tratamientos";
import History from "./components/Historia Clinica/History.jsx";

function App() {
  const {currentUser} = useContext(AuthContext)
  
  const RequireAuth = ({children}) => {
    return currentUser ? children : <Navigate to="/"/>
  };
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />}/>
            <Route index path="clients" element={<RequireAuth><Show/></RequireAuth>}/>
            <Route path="create" element={<RequireAuth><Create /></RequireAuth>}/>
            <Route path="edit/:id" element={<RequireAuth><Edit /></RequireAuth>}/>
            <Route path="Agenda" element={<RequireAuth><Agenda /></RequireAuth>}/>
            <Route path="tarifas" element={<RequireAuth><Tarifario /></RequireAuth>}/>
            <Route path="CreateTarifa" element={<RequireAuth><CreateTarifa /></RequireAuth>}/>
            <Route path="tratamientos" element={<RequireAuth><Tratamientos /></RequireAuth>}/>
            <Route path="history" element={<RequireAuth><History /></RequireAuth>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
