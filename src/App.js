import "./App.css";
import Show from "./components/Show";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Create from "./components/Create";
import Edit from "./components/Edit";
import Login from "./components/Login";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import CreateCita from "./components/CreateCita";
import Agenda from "./components/Agenda";
import Tarifario from "./components/Tarifario";
import CreateTarifa from "./components/CreateTarifa";

function App() {
  const {currentUser} = useContext(AuthContext)
  
  const RequireAuth = ({children}) => {
    return currentUser ? children : <Navigate to="/"/>
  };
  
  console.log(currentUser)
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
