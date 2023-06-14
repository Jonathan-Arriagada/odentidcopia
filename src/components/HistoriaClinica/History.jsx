import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState, useEffect, useCallback, useContext } from "react";
import { query, collection, onSnapshot, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "../Navigation";
import { FaSignOutAlt, FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Filiacion from "./Filiacion";
import Antecedentes from "./Antecedentes";
import Odontograma from "./Odontograma/Odontograma";
import TratamientosEspecif from "./TratamientosEspecif";
import AgendaEspecif from "./AgendaEspecif";
import IngresosEspecif from "./IngresosEspecif";
import ControlEvolucionEspecif from "./ControlEvolucionEspecif";
import profile from "../../img/profile.png";
import { AuthContext } from "../../context/AuthContext";
import "../../style/Main.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function History() {
  const [apellidoConNombre, setApellidoConNombre] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const { currentUser, } = useContext(AuthContext);

  const [opcionesDePacientes, setOpcionesDePacientes] = useState([]);

  const navigate = useNavigate();

  const openControlYEvolucion = (nro, tratamiento) => {
    setValue(nro);
    setTratamiento(tratamiento)
  };

  const updateOpcionesPacientes = useCallback(snapshot => {
    const pacientesOptions = snapshot.docs.map((doc,) => ({
      valorBusqueda: doc.data().valorBusqueda,
      id: doc.id
    }));
    setOpcionesDePacientes(pacientesOptions);
    setIsLoading(false)
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "clients"), orderBy("valorBusqueda")), updateOpcionesPacientes);
    return unsubscribe;
  }, [updateOpcionesPacientes]);


  const logout = useCallback(() => {
    localStorage.setItem("user", JSON.stringify(null));
    navigate("/");
    window.location.reload();
  }, [navigate]);

  const confirmLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: '¿Desea cerrar sesión?',
      showDenyButton: true,
      confirmButtonText: 'Cerrar sesión',
      confirmButtonColor: '#00C5C1',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  const getClientById = async (id) => {
    if (id) {
      const clientF = await getDoc(doc(db, "clients", id));
      if (clientF.exists()) {
        setApellidoConNombre(clientF.data().apellidoConNombre);
        setIsLoading(false);
      }
    } else {
      setApellidoConNombre("");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getClientById(id);
  }, [id]);

  const handleChange = (_, newValue) => {
    setValue(newValue);
    setTratamiento("")
  };

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    const pacienteSeleccionado = opcionesDePacientes.find(
      (opcion) => opcion.valorBusqueda === search
    );
    if (pacienteSeleccionado) {
      navigate(`/historial/${pacienteSeleccionado.id}`)
    }
  };

  const handleLimpiar = () => {
    setSearch("")
    navigate("/historial");
  };


  return (
    <div className="mainpage">
      <Navigation />
      {isLoading ? (
        <span className="loader position-absolute start-50 top-50 mt-3"></span>
      ) : (
        <div className="w-100">
          <nav className="navbar">
            <div className="d-flex justify-content-between w-100 px-2">
              <>
                {!id ? (
                  <div className="search-bar w-25">
                    <input
                      value={search}
                      onChange={searcher}
                      type="text"
                      placeholder="Buscador de Pacientes..."
                      className="form-control m-2"
                      list="pacientes-list"
                    />
                    <datalist id="pacientes-list">
                      {opcionesDePacientes.map((opcion, index) => (
                        <option key={`pacientes-${index}`} value={opcion.valorBusqueda} />
                      ))}
                    </datalist>
                    <button
                      onClick={handleSearch}
                      className="btn"
                      id="boton-main"
                      style={{ margin: "3px" }}
                    >
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                  </div>
                ) : (
                  <div className="search-bar w-25">
                    <input
                      value={apellidoConNombre}
                      onChange={searcher}
                      type="text"
                      placeholder="Buscador de Pacientes..."
                      className="form-control m-2"
                      list="pacientes-list"
                    />
                    <datalist id="pacientes-list">
                      {opcionesDePacientes.map((opcion, index) => (
                        <option key={`pacientes-${index}`} value={opcion.valorBusqueda} />
                      ))}
                    </datalist>
                    <button
                      className="btn btn-secondary"
                      style={{ margin: "3px" }}
                      disabled
                    >
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                    <button
                      onClick={handleLimpiar}
                      className="btn"
                      id="boton-main"
                      style={{ margin: "3px" }}
                    >
                      <i className="fa-regular fa-circle-xmark"></i>
                    </button>
                  </div>
                )}
              </>

              <div className="col d-flex justify-content-end align-items-center right-navbar">
                <p className="fw-bold mb-0" style={{ marginRight: "20px" }}>
                  Bienvenido {currentUser.displayName}
                </p>
                <div className="d-flex">
                  <div className="notificacion">
                    <Link
                      to="/miPerfil"
                      className="text-decoration-none"
                    >
                      <img src={currentUser.photoURL || profile} alt="profile" className="profile-picture" />
                    </Link>
                  </div>
                  <div className="notificacion">
                    <FaBell className="icono" />
                    <span className="badge rounded-pill bg-danger">5</span>
                  </div>
                </div>
                <div className="notificacion">
                  <Link
                    to="/"
                    className="text-decoration-none"
                    style={{ color: "#8D93AB" }}
                    onClick={confirmLogout}
                  >
                    <FaSignOutAlt className="icono" />
                    <span>Logout</span>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <Box sx={{ width: "100%" }} >
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={value} onChange={handleChange} >
                <Tab label="Filiacion" />
                <Tab label="Antecedentes" />
                <Tab label="Odontograma" />
                <Tab label="Tratamientos" />
                <Tab label="Control y Evolución" />
                <Tab label="Citas" />
                <Tab label="Ingresos" />

              </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
              <Filiacion id={id} />
            </TabPanel >

            < TabPanel value={value} index={1} >
              <Antecedentes id={id} />
            </TabPanel >

            < TabPanel value={value} index={2} >
              <Odontograma id={id} />
            </TabPanel >

            < TabPanel value={value} index={3} >
              <TratamientosEspecif id={id} openControlYEvolucion={openControlYEvolucion} />
            </TabPanel >

            < TabPanel value={value} index={4} >
              <ControlEvolucionEspecif id={id} tratamiento={tratamiento} />
            </TabPanel >

            < TabPanel value={value} index={5} >
              <AgendaEspecif id={id} />
            </TabPanel >

            < TabPanel value={value} index={6} >
              <IngresosEspecif id={id} />
            </TabPanel >
          </Box >
        </div>
      )};
    </div >
  );
}
