import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Navigation from "../Navigation";
import { useState, useEffect, useCallback } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

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
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Formulario(props) {
  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [apellidoConNombre, setApellidoConNombre] = useState("");
  const [idc, setIdc] = useState("");
  const [numero, setNumero] = useState("");
  const [fecha, setFecha] = useState("");
  const [sexo, setSexo] = useState("");
  const [lugarNacimiento, setLugarNacimiento] = useState("");
  const [procedencia, setProcedencia] = useState("");
  const [editable, setEditable] = useState(true);
  const [direccion, setDireccion] = useState("");
  const [ocupacion, setOcupacion] = useState("");
  const [correo, setCorreo] = useState("");
  const [valorBusquedaOptions, setValorBusquedaOptions] = useState([]);

  const citasCollection = collection(db, "citas");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const updateOptionsPacientes = useCallback((snapshot) => {
    const options = snapshot.docs.map((doc) => doc.data().valorBusqueda);
    options.unshift("<---Ingreso manual--->");
    setValorBusquedaOptions(options);
  }, []);

  //Render:

  const valorBusquedaOptionsJSX = valorBusquedaOptions.map((option, index) => (
    <option key={`valorBusqueda-${index}`} value={option}>
      {option}
    </option>
  ));

  useEffect(() => {
    const unsubscribe = [
      onSnapshot(
        query(collection(db, "clients"), orderBy("valorBusqueda")),
        updateOptionsPacientes
      ),
    ];

    return () => unsubscribe.forEach((fn) => fn());
  }, [updateOptionsPacientes]);

  useEffect(() => {
    if (props.client) {
      setApellidoConNombre(props.client.apellidoConNombre);
      setIdc(props.client.idc);
      setNumero(props.client.numero);
      setEditable(false);
    } else {
      setApellidoConNombre("");
      setIdc("");
      setNumero("");
    }
  }, [props.client]);

  const store = async (e) => {
    e.preventDefault();
    await addDoc(citasCollection, {
      apellidoConNombre: apellidoConNombre,
      idc: idc,
      numero: numero,
      fecha: fecha,
    });
  };

  const manejarValorSeleccionado = async (suggestion) => {
    if (suggestion === "<---Ingreso manual--->" || suggestion === "") {
      setApellidoConNombre("");
      setIdc("");
      setNumero("");
      setEditable(true);
      return;
    }

    const querySnapshot = await getDocs(
      query(collection(db, "clients"), where("valorBusqueda", "==", suggestion))
    );

    const doc = querySnapshot.docs[0];

    if (doc) {
      const data = doc.data();
      setApellidoConNombre(data.apellidoConNombre);
      setIdc(data.idc);
      setNumero(data.numero);
      setEditable(false);
    }
  };

  return (
    <div className="mainpage">
      <Navigation />
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Filiación" />
            <Tab label="Antecedentes" />
            <Tab label="Control y Evolución" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
            <div className="container d-flex mb-3">
          <h1>Filiación</h1>
          </div>
          <div className="container">
            <div className="col">
              <div
                className="col mb-3"
                style={{
                  background: "#23C9FF",
                  padding: "6px",
                  borderRadius: "20px",
                }}
              >
                <label
                  className="form-label"
                  style={{ marginLeft: "15px", fontWeight: "bold" }}
                >
                  Buscador por Apellido, Nombre o DNI:
                </label>
                <input
                  style={{ borderRadius: "100px" }}
                  type="text"
                  className="form-control"
                  onChangeCapture={(e) =>
                    manejarValorSeleccionado(e.target.value)
                  }
                  list="pacientes-list"
                  multiple={false}
                />
                <datalist id="pacientes-list">
                  <option value="">Ingreso manual</option>
                  {valorBusquedaOptionsJSX}
                </datalist>
              </div>

              <form onSubmit={store}>
                <div className="row">
                  <div className="col mb-3">
                    <label className="form-label">Apellido y Nombres:</label>
                    <input
                      value={apellidoConNombre || ""}
                      onChange={(e) => setApellidoConNombre(e.target.value)}
                      type="text"
                      className="form-control"
                      disabled={!editable}
                    />
                  </div>
                  <div className="col mb-3">
                    <label className="form-label">DNI:</label>
                    <input
                      value={idc || ""}
                      onChange={(e) => setIdc(e.target.value)}
                      type="number"
                      className="form-control"
                      disabled={!editable}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col mb-6">
                    <label className="form-label">Fecha de Nacimiento:</label>
                    <input
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      type="date"
                      className="form-control"
                    />
                  </div>
                  <div className="col mb-3">
                    <label className="form-label">Sexo:</label>
                    <select
                      value={sexo}
                      onChange={(e) => setSexo(e.target.value)}
                      multiple={false}
                      className="form-control"
                    >
                      <option value="">Selecciona un genero</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </select>
                  </div>
                </div>
                <hr />
                <h3>Informacion del Contacto:</h3>
                <div className="row">
                  <div className="col mb-3">
                    <label className="form-label">Lugar Nacimiento:</label>
                    <input
                      value={lugarNacimiento}
                      onChange={(e) => setLugarNacimiento(e.target.value)}
                      type="text"
                      className="form-control"
                    />
                  </div>

                  <div className="col mb-3">
                    <label className="form-label">Procedencia:</label>
                    <input
                      value={procedencia}
                      onChange={(e) => setProcedencia(e.target.value)}
                      type="text"
                      className="form-control"
                    />
                  </div>

                  <div className="col mb-3">
                    <label className="form-label">Teléfono:</label>
                    <input
                      value={numero || ""}
                      onChange={(e) => setNumero(e.target.value)}
                      type="number"
                      className="form-control"
                      disabled={!editable}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col mb-3">
                    <label className="form-label">Direccion:</label>
                    <input
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      type="text"
                      className="form-control"
                    />
                  </div>

                  <div className="col mb-3">
                    <label className="form-label">Ocupacion:</label>
                    <input
                      value={ocupacion}
                      onChange={(e) => setOcupacion(e.target.value)}
                      type="text"
                      className="form-control"
                    />
                  </div>

                  
                  <div className="col mb-3">
                    <label className="form-label">Correo:</label>
                    <input
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      type="text"
                      className="form-control"
                    />
                  </div>

                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ margin: "1px" }}
                >
                  Actualizar
                </button>
              </form>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <h1>Antecedentes</h1>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <h1>Control y Evolucion</h1>
        </TabPanel>
      </Box>
    </div>
  );
}
