import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState, useEffect, useCallback } from "react";
import { getDoc, doc, updateDoc, getDocs, query, where, collection, addDoc, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "../Navigation";
import { FaSignOutAlt, FaUser, FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import TratamientosEspecif from "./TratamientosEspecif";
import AgendaEspecif from "./AgendaEspecif";
import IngresosEspecif from "./IngresosEspecif";
import ControlEvolucionEspecif from "./ControlEvolucionEspecif";
import moment from "moment";
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
  const [tipoIdc, setTipoIdc] = useState("dni");
  const [idc, setIdc] = useState("");
  const [numero, setNumero] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [sexo, setSexo] = useState("");
  const [edad, setEdad] = useState("");
  const [lugarNacimiento, setLugarNacimiento] = useState("");
  const [procedencia, setProcedencia] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ocupacion, setOcupacion] = useState("");
  const [correo, setCorreo] = useState("");
  const [responsable, setResponsable] = useState("");
  const [nombreResponsable, setNombreResponsable] = useState("");
  const [telefonoResponsable, setTelefonoResponsable] = useState("");
  const [tratamiento, setTratamiento] = useState("");

  const [error, setError] = useState("");
  const [editable,] = useState("");
  const [value, setValue] = useState(0);
  const [mostrarAntecedentes, setMostrarAntecedentes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [pregunta1, setPregunta1] = useState(["", false]);
  const [pregunta2, setPregunta2] = useState(["", false]);
  const [pregunta3, setPregunta3] = useState(["", false]);
  const [pregunta4, setPregunta4] = useState(["", false]);
  const [pregunta5, setPregunta5] = useState(["", false]);
  const [pregunta6, setPregunta6] = useState(["", false]);
  const [pregunta7, setPregunta7] = useState(["", false]);
  const [pregunta8, setPregunta8] = useState(["", false]);
  const [pregunta9, setPregunta9] = useState(["", false]);
  const [pregunta10, setPregunta10] = useState(["", false]);
  const [pregunta11, setPregunta11] = useState(["", false]);
  const [pregunta12, setPregunta12] = useState(["", false]);
  const [pregunta13, setPregunta13] = useState(["", false]);
  const [pregunta14, setPregunta14] = useState(["", false]);
  const [pregunta15, setPregunta15] = useState(["", false]);
  const [pregunta16, setPregunta16] = useState(["", false]);
  const [pregunta17, setPregunta17] = useState(["", false]);
  const [pregunta18, setPregunta18] = useState(["", false]);

  const { id } = useParams();
  const [opcionesDePacientes, setOpcionesDePacientes] = useState([]);

  const navigate = useNavigate();

  const clientsCollection = collection(db, "clients");

  const openControlYEvolucion = (nro, tratamiento) => {
    setValue(nro);
    setTratamiento(tratamiento)
  };

  const updateOpcionesPacientes = useCallback(snapshot => {
    const pacientesOptions = snapshot.docs.map((doc, index) => ({
      valorBusqueda: doc.data().valorBusqueda,
      id: doc.id
    }));
    setOpcionesDePacientes(pacientesOptions);
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
      confirmButtonText: 'Si, cerrar sesión',
      denyButtonText: `No, seguir logueado`,
    }).then((result) => {
      if (result.isConfirmed) {
        logout();         
      }
    });
  };

  const validateFields = async (e) => {
    e.preventDefault();
    if (
      apellidoConNombre.trim() === "" ||
      idc.trim() === "" ||
      fechaNacimiento.trim() === "" ||
      numero.trim() === ""
    ) {
      setError("Todos los campos son obligatorios");
      setTimeout(clearError, 2000);
      return false;
    } else {
      const querySnapshot = await getDocs(
        query(clientsCollection, where("idc", "==", idc))
      );
      if (!querySnapshot.empty) {
        setError("El IDC ya existe en la Base de Datos");
        setTimeout(clearError, 2000);
        return false;
      } else {
        setError("");
        await handleCrearClick();
        navigate("/clients");
      }
    }
    return true;
  };

  const clearError = () => {
    setError("");
  };

  const handleActualizarClick = async (e) => {
    e.preventDefault();
    const clientRef = doc(db, "clients", id);
    const clientDoc = await getDoc(clientRef);
    const clientData = clientDoc.data();

    const newData = {
      apellidoConNombre: apellidoConNombre || clientData.apellidoConNombre,
      tipoIdc: tipoIdc || clientData.tipoIdc,
      idc: idc || clientData.idc,
      fechaNacimiento: fechaNacimiento || clientData.fechaNacimiento,
      numero: numero || clientData.numero,
      edad: edad || clientData.edad,
      sexo: sexo || clientData.sexo,
      lugarNacimiento: lugarNacimiento || clientData.lugarNacimiento,
      procedencia: procedencia || clientData.procedencia,
      direccion: direccion || clientData.direccion,
      ocupacion: ocupacion || clientData.ocupacion,
      correo: correo || clientData.correo,
      responsable: responsable || clientData.responsable,
      telefonoResponsable: telefonoResponsable || clientData.telefonoResponsable,
      nombreResponsable: nombreResponsable || clientData.nombreResponsable,

      pregunta1: pregunta1 || clientData.pregunta1,
      pregunta2: pregunta2 || clientData.pregunta2,
      pregunta3: pregunta3 || clientData.pregunta3,
      pregunta4: pregunta4 || clientData.pregunta4,
      pregunta5: pregunta5 || clientData.pregunta5,
      pregunta6: pregunta6 || clientData.pregunta6,
      pregunta7: pregunta7 || clientData.pregunta7,
      pregunta8: pregunta8 || clientData.pregunta8,
      pregunta9: pregunta9 || clientData.pregunta9,
      pregunta10: pregunta10 || clientData.pregunta10,
      pregunta11: pregunta11 || clientData.pregunta11,
      pregunta12: pregunta12 || clientData.pregunta12,
      pregunta13: pregunta13 || clientData.pregunta13,
      pregunta14: pregunta14 || clientData.pregunta14,
      pregunta15: pregunta15 || clientData.pregunta15,
      pregunta16: pregunta16 || clientData.pregunta16,
      pregunta17: pregunta17 || clientData.pregunta17,
      pregunta18: pregunta18 || clientData.pregunta18,

    };
    await updateDoc(clientRef, newData);

    navigate("/clients");
  };

  const handleCrearClick = async () => {
    await addDoc(clientsCollection, {
      apellidoConNombre: apellidoConNombre,
      tipoIdc: tipoIdc,
      idc: idc,
      fechaNacimiento: fechaNacimiento,
      numero: numero,
      valorBusqueda: apellidoConNombre + " " + idc,
      edad: edad,
      sexo: sexo,
      lugarNacimiento: lugarNacimiento,
      procedencia: procedencia,
      direccion: direccion,
      ocupacion: ocupacion,
      correo: correo,
      responsable: responsable,
      nombreResponsable: nombreResponsable,
      telefonoResponsable: telefonoResponsable,
      pregunta1: pregunta1,
      pregunta2: pregunta2,
      pregunta3: pregunta3,
      pregunta4: pregunta4,
      pregunta5: pregunta5,
      pregunta6: pregunta6,
      pregunta7: pregunta7,
      pregunta8: pregunta8,
      pregunta9: pregunta9,
      pregunta10: pregunta10,
      pregunta11: pregunta11,
      pregunta12: pregunta12,
      pregunta13: pregunta13,
      pregunta14: pregunta14,
      pregunta15: pregunta15,
      pregunta16: pregunta16,
      pregunta17: pregunta17,
      pregunta18: pregunta18,
    });
  };

  const getClientById = async (id) => {
    if (id) {
      const clientF = await getDoc(doc(db, "clients", id));
      if (clientF.exists()) {
        setApellidoConNombre(clientF.data().apellidoConNombre);
        setTipoIdc(clientF.data().tipoIdc);
        setIdc(clientF.data().idc);
        setNumero(clientF.data().numero);
        setFechaNacimiento(clientF.data().fechaNacimiento);
        setSexo(clientF.data().sexo);
        setEdad(clientF.data().edad);
        setLugarNacimiento(clientF.data().lugarNacimiento);
        setProcedencia(clientF.data().procedencia);
        setDireccion(clientF.data().direccion);
        setOcupacion(clientF.data().ocupacion);
        setCorreo(clientF.data().correo);
        setResponsable(clientF.data().responsable);
        setNombreResponsable(clientF.data().nombreResponsable);
        setTelefonoResponsable(clientF.data().telefonoResponsable);
        setPregunta1(clientF.data().pregunta1 || ["", false]);
        setPregunta2(clientF.data().pregunta2 || ["", false]);
        setPregunta3(clientF.data().pregunta3 || ["", false]);
        setPregunta4(clientF.data().pregunta4 || ["", false]);
        setPregunta5(clientF.data().pregunta5 || ["", false]);
        setPregunta6(clientF.data().pregunta6 || ["", false]);
        setPregunta7(clientF.data().pregunta7 || ["", false]);
        setPregunta8(clientF.data().pregunta8 || ["", false]);
        setPregunta9(clientF.data().pregunta9 || ["", false]);
        setPregunta10(clientF.data().pregunta10 || ["", false]);
        setPregunta11(clientF.data().pregunta11 || ["", false]);
        setPregunta12(clientF.data().pregunta12 || ["", false]);
        setPregunta13(clientF.data().pregunta13 || ["", false]);
        setPregunta14(clientF.data().pregunta14 || ["", false]);
        setPregunta15(clientF.data().pregunta15 || ["", false]);
        setPregunta16(clientF.data().pregunta16 || ["", false]);
        setPregunta17(clientF.data().pregunta17 || ["", false]);
        setPregunta18(clientF.data().pregunta18 || ["", false]);
        setIsLoading(false);
      }
    } else {
      setApellidoConNombre("");
      setTipoIdc("dni")
      setIdc("");
      setNumero("");
      setFechaNacimiento("");
      setSexo("");
      setEdad("");
      setLugarNacimiento("");
      setProcedencia("");
      setDireccion("");
      setOcupacion("");
      setCorreo("");
      setResponsable("");
      setNombreResponsable("");
      setTelefonoResponsable("");
      setPregunta1(["", false]);
      setPregunta2(["", false]);
      setPregunta3(["", false]);
      setPregunta4(["", false]);
      setPregunta5(["", false]);
      setPregunta6(["", false]);
      setPregunta7(["", false]);
      setPregunta8(["", false]);
      setPregunta9(["", false]);
      setPregunta10(["", false]);
      setPregunta11(["", false]);
      setPregunta12(["", false]);
      setPregunta13(["", false]);
      setPregunta14(["", false]);
      setPregunta15(["", false]);
      setPregunta16(["", false]);
      setPregunta17(["", false]);
      setPregunta18(["", false]);
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
  const handleClickSiguiente = () => {
    setMostrarAntecedentes(!mostrarAntecedentes)
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

  const handleFechaNac = (event) => {
    const { value } = event.target;
    const edad = moment().diff(moment(value), "years");
    setFechaNacimiento(value);
    setEdad(edad)
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
                  Bienvenido al sistema Odentid
                </p>
                <div className="d-flex">
                  <div className="notificacion">
                    <Link
                      to="/miPerfil"
                      className="text-decoration-none"
                    >
                      <FaUser className="icono" />
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
                <Tab label="Historial Clinico" />
                <Tab label="Control y Evolución" />
                <Tab label="Citas" />
                <Tab label="Tratamientos" />
                <Tab label="Ingresos" />

              </Tabs>
            </Box>

            {/* FILIACION */}

            <TabPanel value={value} index={0}>
              <div id="formularios">
                <form>
                  {!mostrarAntecedentes && (
                    <div id="formFiliacion">
                      <div className="container d-flex mb-3">
                        <h1 id="tituloH1History">Historial Parte 1: Filiación</h1>
                      </div>

                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}
                      <div className="container">
                        <div className="col">
                          <div className="row">
                            <div className="col-md-3">
                              <label className="form-label">Apellido y Nombres:</label>
                              <input
                                value={apellidoConNombre || ""}
                                onChange={(e) => {
                                  setApellidoConNombre(e.target.value);
                                }}
                                type="text"
                                className="form-control m-1"
                                required
                              />
                            </div>

                            <div className="col-md-3">
                              <label className="form-label">IDC:</label>
                              <div style={{ display: "flex" }}>
                                <select
                                  value={tipoIdc}
                                  onChange={(e) => { setTipoIdc(e.target.value); setIdc("") }}
                                  className="form-control-tipoIDC m-1"
                                  multiple={false}
                                  style={{ width: "fit-content" }}
                                  required
                                >
                                  <option value="dni">DNI</option>
                                  <option value="ce">CE</option>
                                  <option value="ruc">RUC</option>
                                  <option value="pas">PAS</option>

                                </select>
                                <input
                                  value={idc || ""}
                                  onChange={(e) => {
                                    setIdc(e.target.value);
                                  }}
                                  type={tipoIdc === "dni" || tipoIdc === "ruc" ? "number" : "text"}
                                  minLength={tipoIdc === "dni" ? 8 : undefined}
                                  maxLength={tipoIdc === "dni" ? 8 : tipoIdc === "ruc" ? 11 : tipoIdc === "ce" || tipoIdc === "pas" ? 12 : undefined}
                                  onKeyDown={(e) => {
                                    const maxLength = e.target.maxLength;
                                    const currentValue = e.target.value;
                                    if (maxLength && currentValue.length >= maxLength) {
                                      e.preventDefault();
                                    }
                                  }}
                                  className="form-control m-1"
                                  required
                                />
                              </div>
                            </div>

                            <div className="col-md-3">
                              <label className="form-label">Edad*</label>
                              <input
                                value={edad || ""}
                                type="number"
                                className="form-control m-1"
                                disabled
                              />
                            </div>

                            <div className="col-md-3">
                              <label className="form-label">Sexo:</label>
                              <select
                                value={sexo}
                                onChange={(e) => setSexo(e.target.value)}
                                multiple={false}
                                className="form-control m-1"
                                required
                              >
                                <option value="" disabled>
                                  Selecciona un genero
                                </option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                              </select>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col mb-6">
                              <label className="form-label">Fecha de Nacimiento:</label>
                              <input
                                value={fechaNacimiento || ""}
                                onChange={handleFechaNac}
                                type="date"
                                className="form-control m-1"
                                required
                              />
                            </div>

                            <div className="col-md-4">
                              <label className="form-label">Lugar Nacimiento:</label>
                              <input
                                value={lugarNacimiento || ""}
                                onChange={(e) => setLugarNacimiento(e.target.value)}
                                type="text"
                                className="form-control m-1"
                                required
                              />
                            </div>

                            <div className="col-md-4">
                              <label className="form-label">Procedencia:</label>
                              <input
                                value={procedencia || ""}
                                onChange={(e) => setProcedencia(e.target.value)}
                                type="text"
                                className="form-control m-1"
                                required
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col">
                              <label className="form-label">Direccion:</label>
                              <input
                                value={direccion || ""}
                                onChange={(e) => setDireccion(e.target.value)}
                                type="text"
                                className="form-control m-1"
                                required
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-4">
                              <label className="form-label">Ocupacion:</label>
                              <input
                                value={ocupacion || ""}
                                onChange={(e) => setOcupacion(e.target.value)}
                                type="text"
                                className="form-control m-1"
                              />
                            </div>

                            <div className="col-md-4">
                              <label className="form-label">Correo:</label>
                              <input
                                value={correo || ""}
                                onChange={(e) => setCorreo(e.target.value)}
                                type="text"
                                className="form-control m-1"
                              />
                            </div>

                            <div className="col-md-4">
                              <label className="form-label">Teléfono:</label>
                              <input
                                value={numero || ""}
                                onChange={(e) => setNumero(e.target.value)}
                                type="number"
                                className="form-control m-1"
                              />
                            </div>
                          </div>

                          <hr />

                          <h3> En caso de emergencia comunicarse con:</h3>

                          <div className="row">
                            <div className="col-md-4">
                              <label className="form-label">Parentesco:</label>
                              <input
                                value={responsable || ""}
                                onChange={(e) => setResponsable(e.target.value)}
                                type="text"
                                className="form-control m-1"
                              />
                            </div>

                            <div className="col-md-4">
                              <label className="form-label">Nombre:</label>
                              <input
                                value={nombreResponsable || ""}
                                onChange={(e) => setNombreResponsable(e.target.value)}
                                type="text"
                                className="form-control m-1"
                              />
                            </div>

                            <div className="col-md-4">
                              <label className="form-label">Telefono:</label>
                              <input
                                value={telefonoResponsable || ""}
                                onChange={(e) => setTelefonoResponsable(e.target.value)}
                                type="number"
                                className="form-control m-1"
                              />
                            </div>
                          </div>
                          <button
                            className="btn"
                            id="boton-main"
                            style={{ margin: "3px" }}
                            onClick={handleClickSiguiente}

                          >
                            Siguiente
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ANTECEDENTES */}

                  {mostrarAntecedentes && (
                    <div id="formAntecedentes">
                      <div className="container d-flex mb-3">
                        <h1 id="tituloH1History">Historial Parte 2: Antecedentes</h1>
                      </div>
                      <div className="container">
                        <div className="d-flex">
                          <div className="w-50 me-5">
                            <label className="form-label">Apellido y Nombres:</label>
                            <input
                              value={apellidoConNombre || ""}
                              onChange={(e) => setApellidoConNombre(e.target.value)}
                              type="text"
                              className="form-control m-1"
                              disabled={!editable}
                            />
                          </div>
                          <div className="w-50 ms-5">
                            <label className="form-label">IDC:</label>
                            <input
                              value={idc || ""}
                              onChange={(e) => setIdc(e.target.value)}
                              type="number"
                              className="form-control m-1"
                              disabled={!editable}
                            />
                          </div>
                        </div>
                        <div className="d-flex m-2">
                          <div className="col-mb-3">

                            <hr/>
                  
                              <label className="form-label d-flex">
                                1. ¿Está siendo atendido por un médico?
                                <label className="m-1">
                                  <input
                                    type="checkbox"
                                    className="m-1"
                                    checked={pregunta1[1]}
                                    onChange={() => setPregunta1((prevState) => [prevState[0], true])}
                                  />
                                  Sí
                                </label>
                                <label className="m-1">
                                  <input
                                    type="checkbox"
                                    className="m-1"
                                    checked={!pregunta1[1]}
                                    onChange={() => setPregunta1((prevState) => [prevState[0], false])}
                                  />
                                  No
                                </label>
                              </label>
                              <input
                                value={pregunta1[0]}
                                onChange={(e) => setPregunta1((prevState) => [e.target.value, prevState[1]])}
                                type="text"
                                className="form-control w-50 m-1"
                                placeholder={pregunta1[1] ? "¿Qué especialidad?" : ""}
                                disabled={!pregunta1[1]}
                              />             
                   
                              <label className="form-label d-flex">
                                2. ¿Esta siendo atendido por un médico psiquiatra o psicologo?
                                <label className="m-1">
                                  <input
                                    type="checkbox"
                                    className="m-1"
                                    checked={pregunta2[1]}
                                    onChange={() => setPregunta2((prevState) => [prevState[0], true])}
                                  />
                                  Sí
                                </label>
                                <label className="m-1">
                                  <input
                                    type="checkbox"
                                    className="m-1"
                                    checked={!pregunta2[1]}
                                    onChange={() => setPregunta2((prevState) => [prevState[0], false])}
                                  />
                                  No
                                </label>
                              </label>
                              <input
                                value={pregunta2[0]}
                                onChange={(e) => setPregunta2((prevState) => [e.target.value, prevState[1]])}
                                type="text"
                                className="form-control m-1 w-50"
                                placeholder={pregunta2[1] ? "¿Psiquiatra o Psicologo?" : ""}
                                disabled={!pregunta2[1]}
                              />
                    
                            <label className="form-label d-flex">
                              3. ¿Está tomando algún medicamento?{" "}
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={pregunta3[1]}
                                  onChange={() => setPregunta3((prevState) => [prevState[0], true])}
                                />
                                Sí
                              </label>
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={!pregunta3[1]}
                                  onChange={() => setPregunta3((prevState) => [prevState[0], false])}
                                />
                                No
                              </label>
                            </label>
                            <input
                              value={pregunta3[0]}
                              onChange={(e) => setPregunta3((prevState) => [e.target.value, prevState[1]])}
                              type="text"
                              className="form-control m-1 w-50"
                              placeholder={pregunta3[1] ? "¿Qué medicamento?" : ""}
                              disabled={!pregunta3[1]}
                            />

                            <label className="form-label d-flex">
                              4. ¿Es alérgico a algún medicamento?
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={pregunta4[1]}
                                  onChange={() => setPregunta4((prevState) => [prevState[0], true])}
                                />
                                Sí
                              </label>
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={!pregunta4[1]}
                                  onChange={() => setPregunta4((prevState) => [prevState[0], false])}
                                />
                                No
                              </label>
                            </label>
                            <input
                              value={pregunta4[0]}
                              onChange={(e) => setPregunta4((prevState) => [e.target.value, prevState[1]])}
                              type="text"
                              className="form-control m-1 w-50"
                              placeholder={pregunta4[1] ? "¿A cuál medicamento?" : ""}
                              disabled={!pregunta4[1]}
                            />

                            <label className="form-label d-flex">
                              5. ¿Ha tenido alguna reacción a la anestesia local?
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={pregunta5[1]}
                                  onChange={() => setPregunta5((prevState) => [prevState[0], true])}
                                />
                                Sí
                              </label>
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={!pregunta5[1]}
                                  onChange={() => setPregunta5((prevState) => [prevState[0], false])}
                                />
                                No
                              </label>
                            </label>

                            <label className="form-label d-flex">
                              6. ¿Está embarazada?
                               <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={pregunta6[1]}
                                  onChange={() => setPregunta6((prevState) => [prevState[0], true])}
                                />
                                Sí
                              </label>
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={!pregunta6[1]}
                                  onChange={() => setPregunta6((prevState) => [prevState[0], false])}
                                />
                                No
                              </label>
                            </label>

                            <label className="form-label d-flex">
                              7. ¿Padece o padeció hepatitis?
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={pregunta7[1]}
                                  onChange={() => setPregunta7((prevState) => [prevState[0], true])}
                                />
                                Sí
                              </label>
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={!pregunta7[1]}
                                  onChange={() => setPregunta7((prevState) => [prevState[0], false])}
                                />
                                No
                              </label>
                            </label>

                            <label className="form-label d-flex">
                              8. ¿Padece o padeció enfermedades renales?
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={pregunta8[1]}
                                  onChange={() => setPregunta8((prevState) => [prevState[0], true])}
                                />
                                Sí
                              </label>
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={!pregunta8[1]}
                                  onChange={() => setPregunta8((prevState) => [prevState[0], false])}
                                />
                                No
                              </label>
                            </label>

                            <label className="form-label d-flex">
                              9. ¿Tiene problemas del corazón?
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={pregunta9[1]}
                                  onChange={() => setPregunta9((prevState) => [prevState[0], true])}
                                />
                                Sí
                              </label>
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={!pregunta9[1]}
                                  onChange={() => setPregunta9((prevState) => [prevState[0], false])}
                                />
                                No
                              </label>
                            </label>

                            <label className="form-label d-flex">
                              10. ¿Padece o ha padecido cáncer?
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={pregunta10[1]}
                                  onChange={() => setPregunta10((prevState) => [prevState[0], true])}
                                />
                                Sí
                              </label>
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={!pregunta10[1]}
                                  onChange={() => setPregunta10((prevState) => [prevState[0], false])}
                                />
                                No
                              </label>
                            </label>

                            <label className="form-label d-flex">
                              11. ¿Ha tenido alguna cirugía?
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={pregunta11[1]}
                                  onChange={() => setPregunta11((prevState) => [prevState[0], true])}
                                />
                                Sí
                              </label>
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={!pregunta11[1]}
                                  onChange={() => setPregunta11((prevState) => [prevState[0], false])}
                                />
                                No
                              </label>
                            </label>

                            <label className="form-label d-flex">
                              12. ¿Es diabético?
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={pregunta12[1]}
                                  onChange={() => setPregunta12((prevState) => [prevState[0], true])}
                                />
                                Sí
                              </label>
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={!pregunta12[1]}
                                  onChange={() => setPregunta12((prevState) => [prevState[0], false])}
                                />
                                No
                              </label>
                            </label>
            
                            <label className="form-label d-flex">
                              13. ¿Tiene trastornos de tipo convulsivo?
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={pregunta13[1]}
                                  onChange={() => setPregunta13((prevState) => [prevState[0], true])}
                                />
                                Sí
                              </label>
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={!pregunta13[1]}
                                  onChange={() => setPregunta13((prevState) => [prevState[0], false])}
                                />
                                No
                              </label>
                            </label>

                            <label className="form-label d-flex">
                              14. ¿Lo han hospitalizado?
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={pregunta14[1]}
                                  onChange={() => setPregunta14((prevState) => [prevState[0], true])}
                                />
                                Sí
                              </label>
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={!pregunta14[1]}
                                  onChange={() => setPregunta14((prevState) => [prevState[0], false])}
                                />
                                No
                              </label>
                            </label>

                            <label className="form-label d-flex">
                              15. ¿Ha tenido algun sangrado excesivo?
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={pregunta15[1]}
                                  onChange={() => setPregunta15((prevState) => [prevState[0], true])}
                                />
                                Sí
                              </label>
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={!pregunta15[1]}
                                  onChange={() => setPregunta15((prevState) => [prevState[0], false])}
                                />
                                No
                              </label>
                            </label>

                            <label className="form-label d-flex">
                              16. ¿Tiene algun problema digestivo (úlceras o gastritis)?
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={pregunta16[1]}
                                  onChange={() => setPregunta16((prevState) => [prevState[0], true])}
                                />
                                Sí
                              </label>
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={!pregunta16[1]}
                                  onChange={() => setPregunta16((prevState) => [prevState[0], false])}
                                />
                                No
                              </label>
                            </label>

                            <label className="form-label d-flex">
                              17. ¿Toma anticonceptivos orales?
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={pregunta17[1]}
                                  onChange={() => setPregunta17((prevState) => [prevState[0], true])}
                                />
                                Sí
                              </label>
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={!pregunta17[1]}
                                  onChange={() => setPregunta17((prevState) => [prevState[0], false])}
                                />
                                No
                              </label>
                            </label>

                            <label className="form-label d-flex">
                              18. ¿Padece alguna otra enfermedad o transtorno que no se
                              mencione en esta lista y que debamos saber?
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={pregunta18[1]}
                                  onChange={() => setPregunta18((prevState) => [prevState[0], true])}
                                />
                                Sí
                              </label>
                              <label className="m-1">
                                <input
                                  type="checkbox"
                                  className="m-1"
                                  checked={!pregunta18[1]}
                                  onChange={() => setPregunta18((prevState) => [prevState[0], false])}
                                />
                                No
                              </label>
                            </label>
                            <input
                                value={pregunta18[0]}
                                onChange={(e) => setPregunta18((prevState) => [e.target.value, prevState[1]])}
                                type="text"
                                className="form-control w-50 m-1"
                                placeholder={pregunta18[1] ? "¿Qué enfermedad?" : ""}
                                disabled={!pregunta18[1]}
                              />
                          </div>
                        </div>
                        {!id ? (
                          <div id="botones">
                            <button
                              className="btn"
                              style={{ margin: "3px" }}
                              id="boton-main"
                              onClick={handleClickSiguiente}
                            >
                              Anterior
                            </button>

                            <button
                              type="submit"
                              className="btn"
                              id="boton-main"
                              style={{ margin: "3px" }}
                              onClick={validateFields}
                            >
                              Crear
                            </button>
                          </div>
                        ) : (
                          <div id="botones">
                            <button
                              className="btn"
                              id="boton-main"
                              style={{ margin: "3px" }}
                              onClick={handleClickSiguiente}
                            >
                              Anterior
                            </button>
                            <button
                              type="submit"
                              className="btn"
                              id="boton-main"
                              style={{ margin: "3px" }}
                              onClick={handleActualizarClick}
                            >
                              Actualizar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>)}
                </form>
              </div>
            </TabPanel >



            {/* CONTROL Y EVOLUCION */}

            < TabPanel value={value} index={1} >
              <ControlEvolucionEspecif id={id} tratamiento={tratamiento} />
            </TabPanel >


            < TabPanel value={value} index={2} >
              <AgendaEspecif id={id} />
            </TabPanel >

            < TabPanel value={value} index={3} >
              <TratamientosEspecif id={id} openControlYEvolucion={openControlYEvolucion} />
            </TabPanel >

            < TabPanel value={value} index={4} >
              <IngresosEspecif id={id} />
            </TabPanel >
          </Box >
        </div>
      )};
    </div >
  );
}
