import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import {
  getDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  collection,
  addDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "../Navigation";

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

export default function History() {
  const [apellidoConNombre, setApellidoConNombre] = useState("");
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
  const [error, setError] = useState("");  
  const [editable, setEditable] = useState("")
  const [value, setValue] = useState(0);
  const [pregunta1, setPregunta1] = useState("");  
  const [pregunta2, setPregunta2] = useState("");
  const [pregunta3, setPregunta3] = useState("");
  const [pregunta4, setPregunta4] = useState("");
  const [pregunta5, setPregunta5] = useState("");
  const [isChecked, setIsChecked] = useState({    
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
    11: false,
    12: false,
    13: false,
    14: false,
    15: false,
    16: false,
    17: false,
    18: false,
  });
 
  const { id } = useParams();

  const navigate = useNavigate();

  const clientsCollection = collection(db, "clients");

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
        setError("El DNI ya existe en la Base de Datos");
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
    };
    await updateDoc(clientRef, newData);

    navigate("/clients");
  };

  const handleCrearClick = async () => {
    await addDoc(clientsCollection, {
      apellidoConNombre: apellidoConNombre,
      idc: idc,
      fechaNacimiento: fechaNacimiento,
      numero: numero,
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
    });
  };

  const getClientById = async (id) => {
    const clientF = await getDoc(doc(db, "clients", id));
    if (clientF.exists()) {
      setApellidoConNombre(clientF.data().apellidoConNombre);
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
      setPregunta1(clientF.data().pregunta1)
    } else {
      console.log("No");
    }
  };

  useEffect(() => {
    getClientById(id);
  }, [])

  useEffect(() => {
    if (apellidoConNombre) {
      const obtenerDatosCliente = async () => {
        try {
          const querySnapshot = await db
            .collection("clientes")
            .where("apellidoConNombre", "==", apellidoConNombre)     
            .get();

          if (!querySnapshot.empty) {
            const cliente = querySnapshot.docs[0].data();
            setIsChecked(cliente.isChecked || {});
            setPregunta1(cliente.pregunta1 || "");
            setPregunta2(cliente.pregunta2 || "");
            setPregunta3(cliente.pregunta3 || "");
            setPregunta4(cliente.pregunta4 || "");
            setPregunta5(cliente.pregunta5 || "");
          }
        } catch (error) {
          console.error("Error al obtener los datos del cliente:", error);
        }
      };

      obtenerDatosCliente();
    }
  }, [apellidoConNombre]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="mainpage">
      <Navigation />
    
        <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Filiación"/>
            <Tab label="Antecedentes" />
            <Tab label="Control y Evolución" />
          </Tabs>
        </Box>

        {/* FILIACION */}

        <TabPanel value={value} index={0}>
          <div className="container d-flex mb-3">
            <h1>Filiación</h1>
          </div>
          <form>
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
                  value={apellidoConNombre}
                  onChange={(e) => {
                    setApellidoConNombre(e.target.value);
                  }}
                  type="text"
                  className="form-control m-1"
                  required
                />
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
                    className="form-control m-1"
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

              <div className="col-md-3">
                <label className="form-label">DNI:</label>
                <input
                  value={idc}
                  onChange={(e) => {
                    setIdc(e.target.value);
                  }}
                  type="number"
                  className="form-control m-1"
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Edad*</label>
                <input
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  type="number"
                  className="form-control m-1"
                  required
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
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  type="date"
                  className="form-control m-1"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Lugar Nacimiento:</label>
                <input
                  value={lugarNacimiento}
                  onChange={(e) => setLugarNacimiento(e.target.value)}
                  type="text"
                  className="form-control m-1"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Procedencia:</label>
                <input
                  value={procedencia}
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
                  value={direccion}
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
                  value={ocupacion}
                  onChange={(e) => setOcupacion(e.target.value)}
                  type="text"
                  className="form-control m-1"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Correo:</label>
                <input
                  value={correo}
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
                <label className="form-label">Responsable:</label>
                <input
                  value={responsable}
                  onChange={(e) => setResponsable(e.target.value)}
                  type="text"
                  className="form-control m-1"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Nombre:</label>
                <input
                  value={nombreResponsable}
                  onChange={(e) => setNombreResponsable(e.target.value)}
                  type="text"
                  className="form-control m-1"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Telefono:</label>
                <input
                  value={telefonoResponsable}
                  onChange={(e) => setTelefonoResponsable(e.target.value)}
                  type="number"
                  className="form-control m-1"
                />
              </div>
            </div>
            {!id ? (
              <button
                type="submit"
                className="btn btn-primary"
                style={{ margin: "3px" }}
                onClick={validateFields}
              >
                Crear
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
                style={{ margin: "3px" }}
                onClick={handleActualizarClick}
              >
                Actualizar
              </button>
            )}
          </div>
        </div>
        </div>
        </div>
      </form>
        </TabPanel>

        {/* ANTECEDENTES */}

        <TabPanel value={value} index={1}>
          <div className="container d-flex mb-3">
            <h1>Antecedentes</h1>
          </div>
          <div className="container">
            <form>
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
                  <label className="form-label">DNI:</label>
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
                <div className="col-md-4 mb-3">
                  <div className="row">
                    <label className="form-label">
                      1. ¿Está siendo atendido por un médico?
                      <label className="m-1">
                        <input
                          type="checkbox"
                          className="m-1"
                          checked={isChecked[1]}
                          onChange={(e) =>
                            setIsChecked({
                              ...isChecked,
                              1: e.target.checked,
                            })
                          }
                        />
                        Sí
                      </label>
                      <label className="m-1">
                        <input
                          type="checkbox"
                          className="m-1"
                          checked={!isChecked[1]}
                          onChange={(e) =>
                            setIsChecked({
                              ...isChecked,
                              1: !e.target.checked,
                            })
                          }
                        />
                        No
                      </label>
                    </label>
                    <input
                      value={pregunta1}
                      onChange={(e) => setPregunta1(e.target.value)}
                      type="text"
                      className="form-control m-1"
                      placeholder={isChecked[1] ? "¿Qué especialidad?" : ""}
                      disabled={!isChecked[1]}
                    />
                  </div>

                  <div className="row">
                    <label className="form-label">
                      2. ¿Por un médico psiquiatra o psicologo?
                      <label className="m-1">
                        <input
                          type="checkbox"
                          className="m-1"
                          checked={isChecked[2]}
                          onChange={(e) =>
                            setIsChecked({
                              ...isChecked,
                              2: e.target.checked,
                            })
                          }
                        />
                        Sí
                      </label>
                      <label className="m-1">
                        <input
                          type="checkbox"
                          className="m-1"
                          checked={!isChecked[2]}
                          onChange={(e) =>
                            setIsChecked({
                              ...isChecked,
                              2: !e.target.checked,
                            })
                          }
                        />
                        No
                      </label>
                    </label>
                    <input
                      value={pregunta2}
                      onChange={(e) => setPregunta2(e.target.value)}
                      type="text"
                      className="form-control m-1"
                      placeholder={
                        isChecked[2] ? "¿Psiquiatra o Psicologo?" : ""
                      }
                      disabled={!isChecked[2]}
                    />
                  </div>

                  <label className="form-label">
                    3. ¿Está tomando algún medicamento?{" "}
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={isChecked[3]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            3: e.target.checked,
                          })
                        }
                      />
                      Sí
                    </label>
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={!isChecked[3]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            3: !e.target.checked,
                          })
                        }
                      />
                      No
                    </label>
                  </label>
                  <input
                    value={pregunta3}
                    onChange={(e) => setPregunta3(e.target.value)}
                    type="text"
                    className="form-control m-1"
                    placeholder={isChecked[3] ? "¿Qué medicamento?" : ""}
                    disabled={!isChecked[3]}
                  />

                  <label className="form-label">
                    4. ¿Es alérgico a algún medicamento?
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={isChecked[4]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            4: e.target.checked,
                          })
                        }
                      />
                      Sí
                    </label>
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={!isChecked[4]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            4: !e.target.checked,
                          })
                        }
                      />
                      No
                    </label>
                  </label>
                  <input
                    value={pregunta4}
                    onChange={(e) => setPregunta4(e.target.value)}
                    type="text"
                    className="form-control m-1"
                    placeholder={isChecked[4] ? "¿A cuál medicamento?" : ""}
                    disabled={!isChecked[4]}
                  />

                  <label className="form-label">
                    5. ¿Ha tenido alguna reacción a la anestesia local?
                    <br />
                    <br />
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={isChecked[5]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            5: setPregunta5(e.target.checked),
                          })
                        }
                      />
                      Sí
                    </label>
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={!isChecked[5]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            5: setPregunta5(!e.target.checked),
                          })
                        }
                      />
                      No
                    </label>
                  </label>

                  <label className="form-label">
                    6. ¿Está embarazada? <br />
                    <br />
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={isChecked[6]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            6: e.target.checked,
                          })
                        }
                      />
                      Sí
                    </label>
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={!isChecked[6]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            6: !e.target.checked,
                          })
                        }
                      />
                      No
                    </label>
                  </label>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    7. ¿Padece o padeció hepatitis? <br />
                    <br />
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={isChecked[7]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            7: e.target.checked,
                          })
                        }
                      />
                      Sí
                    </label>
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={!isChecked[7]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            7: !e.target.checked,
                          })
                        }
                      />
                      No
                    </label>
                  </label>

                  <label className="form-label">
                    8. ¿Padece o padeció enfermedades renales?
                    <br />
                    <br />
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={isChecked[8]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            8: e.target.checked,
                          })
                        }
                      />
                      Sí
                    </label>
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={!isChecked[8]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            8: !e.target.checked,
                          })
                        }
                      />
                      No
                    </label>
                  </label>

                  <label className="form-label">
                    9. ¿Tiene problemas del corazón?
                    <br />
                    <br />
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={isChecked[9]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            9: e.target.checked,
                          })
                        }
                      />
                      Sí
                    </label>
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={!isChecked[9]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            9: !e.target.checked,
                          })
                        }
                      />
                      No
                    </label>
                  </label>

                  <label className="form-label">
                    10. ¿Padece o ha padecido cáncer?
                    <br />
                    <br />
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={isChecked[10]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            10: e.target.checked,
                          })
                        }
                      />
                      Sí
                    </label>
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={!isChecked[10]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            10: !e.target.checked,
                          })
                        }
                      />
                      No
                    </label>
                  </label>

                  <label className="form-label">
                    11. ¿Ha tenido alguna cirugía?
                    <br />
                    <br />
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={isChecked[11]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            11: e.target.checked,
                          })
                        }
                      />
                      Sí
                    </label>
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={!isChecked[11]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            11: !e.target.checked,
                          })
                        }
                      />
                      No
                    </label>
                  </label>
                  <br />
                  <label className="form-label">
                    12. ¿Es diabético? <br />
                    <br />
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={isChecked[12]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            12: e.target.checked,
                          })
                        }
                      />
                      Sí
                    </label>
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={!isChecked[11]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            12: !e.target.checked,
                          })
                        }
                      />
                      No
                    </label>
                  </label>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    13. ¿Tiene trastornos de tipo convulsivo?
                    <br />
                    <br />
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={isChecked[13]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            13: e.target.checked,
                          })
                        }
                      />
                      Sí
                    </label>
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={!isChecked[13]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            13: !e.target.checked,
                          })
                        }
                      />
                      No
                    </label>
                  </label>

                  <label className="form-label">
                    14. ¿Lo han hospitalizado?
                    <br />
                    <br />
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={isChecked[14]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            14: e.target.checked,
                          })
                        }
                      />
                      Sí
                    </label>
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={!isChecked[14]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            14: !e.target.checked,
                          })
                        }
                      />
                      No
                    </label>
                  </label>

                  <label className="form-label">
                    15. ¿Ha tenido algun sangrado excesivo?
                    <br />
                    <br />
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={isChecked[15]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            15: e.target.checked,
                          })
                        }
                      />
                      Sí
                    </label>
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={!isChecked[15]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            15: !e.target.checked,
                          })
                        }
                      />
                      No
                    </label>
                  </label>

                  <label className="form-label">
                    16. ¿Tiene algun problema digestivo (úlceras o gastritis)?
                    <br />
                    <br />
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={isChecked[16]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            16: e.target.checked,
                          })
                        }
                      />
                      Sí
                    </label>
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={!isChecked[16]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            16: !e.target.checked,
                          })
                        }
                      />
                      No
                    </label>
                  </label>

                  <label className="form-label">
                    17. ¿Toma anticonceptivos orales? <br />
                    <br />
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={isChecked[17]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            17: e.target.checked,
                          })
                        }
                      />
                      Sí
                    </label>
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={!isChecked[17]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            17: !e.target.checked,
                          })
                        }
                      />
                      No
                    </label>
                  </label>

                  <label className="form-label">
                    18. ¿Padece alguna otra enfermedad o transtorno que no se
                    mencione en esta lista y que debamos saber?
                    <br />
                    <br />
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={isChecked[18]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            18: e.target.checked,
                          })
                        }
                      />
                      Sí
                    </label>
                    <label className="m-1">
                      <input
                        type="checkbox"
                        className="m-1"
                        checked={!isChecked[18]}
                        onChange={(e) =>
                          setIsChecked({
                            ...isChecked,
                            18: !e.target.checked,
                          })
                        }
                      />
                      No
                    </label>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ margin: "1px" }}
              >
                Crear
              </button>
            </form>
          </div>
        </TabPanel>

        {/* CONTROL Y EVOLUCION */}

        <TabPanel value={value} index={2}>
          <div className="container d-flex mb-3">
            <h1>Control y Evolucion</h1>
          </div>
          <form className="container">
            <div className="row">
              <div className="d-flex col-md-5">
                <label className="col-form-label me-5 w-25">Nombre:</label>
                <input
                  value={apellidoConNombre || ""}
                  onChange={(e) => setApellidoConNombre(e.target.value)}
                  type="text"
                  className="form-control my-1 ms-2 w-100"
                  disabled={!editable}
                />
              </div>
              <div className="d-flex col-md-5">
                <label className="col-form-label me-5 w-25">DNI:</label>
                <input
                  value={idc || ""}
                  onChange={(e) => setIdc(e.target.value)}
                  type="number"
                  className="form-control m-1 w-100"
                  disabled={!editable}
                />
              </div>
            </div>
            <div className="row">
              <div className="d-flex col-md-5">
                <label className="col-form-label me-5 w-25">Tratamiento:</label>
                <input
                  value={apellidoConNombre || ""}
                  onChange={(e) => setApellidoConNombre(e.target.value)}
                  type="text"
                  className="form-control my-1 ms-2 w-100"
                  disabled={!editable}
                />
              </div>
              <div className="d-flex col-md-5">
                <label className="col-form-label me-5 w-25">Pieza:</label>
                <input
                  value={idc || ""}
                  onChange={(e) => setIdc(e.target.value)}
                  type="number"
                  className="form-control m-1 w-100"
                  disabled={!editable}
                />
              </div>
            </div>

            <hr />

            <div className="d-flex col-md-5">
              <label className="col-form-label me-5 w-25">Doctor:</label>
              <input
                value={apellidoConNombre || ""}
                onChange={(e) => setApellidoConNombre(e.target.value)}
                type="text"
                className="form-control m-1 w-100"
                disabled={!editable}
              />
            </div>
            <div className="d-flex col-md-5">
              <label className="col-form-label me-5 w-25">Fecha:</label>
              <input
                value={apellidoConNombre || ""}
                onChange={(e) => setApellidoConNombre(e.target.value)}
                type="number"
                className="form-control m-1 w-100"
              />
            </div>
            <div className="d-flex col-md-5">
              <label className="col-form-label me-5 w-25">Detalle:</label>
              <textarea
                value={apellidoConNombre || ""}
                onChange={(e) => setApellidoConNombre(e.target.value)}
                type="text"
                className="form-control m-1"
                style={{ height: "150px" }}
              />
            </div>
          </form>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ margin: "1px" }}
          >
            Agregar
          </button>
        </TabPanel>
        </div>
  );}
