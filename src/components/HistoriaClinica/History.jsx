import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState, useEffect, useCallback } from "react";
import { query, collection, onSnapshot, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { useNavigate, useParams } from "react-router-dom";
import Filiacion from "./Filiacion";
import Antecedentes from "./Antecedentes";
import Odontograma from "./Odontograma/Odontograma";
import TratamientosEspecif from "./TratamientosEspecif";
import AgendaEspecif from "./AgendaEspecif";
import IngresosEspecif from "./IngresosEspecif";
import ControlEvolucionEspecif from "./ControlEvolucionEspecif";
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

  const [opcionesDePacientes, setOpcionesDePacientes] = useState([]);

  const navigate = useNavigate();

  function quitarAcentos(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  const openControlYEvolucion = (nro, tratamiento) => {
    setValue(nro);
    setTratamiento(tratamiento)
  };

  const updateOpcionesPacientes = useCallback(snapshot => {
    const pacientesOptions = snapshot.docs.map((doc,) => ({
      valorBusqueda: quitarAcentos(doc.data().valorBusqueda),
      id: doc.id
    }));
    setOpcionesDePacientes(pacientesOptions);
    setIsLoading(false)
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "clients"), orderBy("valorBusqueda")), updateOpcionesPacientes);
    return unsubscribe;
  }, [updateOpcionesPacientes]);


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
      navigate(`/historias/${pacienteSeleccionado.id}`)
    }
  };

  const handleLimpiar = () => {
    setSearch("")
    navigate("/historias");
  };


  return (
    <>
      {isLoading ? (
        <div className="w-100">
          <span className="loader position-absolute start-50 top-50 mt-3"></span>
        </div>
      ) : (
        <div className="w-100">
          <>
            {!id ? (
              <div className="search-bar d-flex col-2 m-2 ms-3 w-50">
                <input
                  value={search}
                  onChange={searcher}
                  type="text"
                  placeholder="Buscar..."
                  className="form-control-upNav  m-2"
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
                  <i className="fa-solid fa-magnifying-glass" id="historyi"></i>
                </button>
              </div>
            ) : (
              <div className="search-bar d-flex col-2 m-2 ms-3 w-50">
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
                  <i className="fa-solid fa-magnifying-glass" id="historyi"></i>
                </button>
                <button
                  onClick={handleLimpiar}
                  className="btn"
                  id="boton-main"
                  style={{ margin: "3px" }}
                >
                  <i className="fa-regular fa-circle-xmark" id="historyi"></i>
                </button>
              </div>
            )}
          </>

          <Box className="container mw-100" sx={{ width: "100%" }} >
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
    </>
  );
}
