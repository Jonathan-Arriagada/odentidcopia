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
  const [edad, setEdad] = useState("");
  const [lugarNacimiento, setLugarNacimiento] = useState("");
  const [procedencia, setProcedencia] = useState("");
  const [editable, setEditable] = useState(true);
  const [direccion, setDireccion] = useState("");
  const [ocupacion, setOcupacion] = useState("");
  const [correo, setCorreo] = useState("");
  const [valorBusquedaOptions, setValorBusquedaOptions] = useState([]);
  const [medicoAtendido, setMedicoAtendido] = useState("");
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

  const clientsCollection = collection(db, "clients");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const updateOptionsPacientes = useCallback((snapshot) => {
    const options = snapshot.docs.map((doc) => doc.data().valorBusqueda);
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

  const manejarValorSeleccionado = async (suggestion) => {
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
                  className="form-control m-1"
                  onChangeCapture={(e) =>
                    manejarValorSeleccionado(e.target.value)
                  }
                  list="pacientes-list"
                  multiple={false}
                />
                <datalist id="pacientes-list">
                  {valorBusquedaOptionsJSX}
                </datalist>
              </div>

              <form>
                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label">Apellido y Nombres:</label>
                    <input
                      value={apellidoConNombre || ""}
                      onChange={(e) => setApellidoConNombre(e.target.value)}
                      type="text"
                      className="form-control m-1"
                      disabled={!editable}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">DNI:</label>
                    <input
                      value={idc || ""}
                      onChange={(e) => setIdc(e.target.value)}
                      type="number"
                      className="form-control m-1"
                      disabled={!editable}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Edad*</label>
                    <input
                      value={edad}
                      onChange={(e) => setEdad(e.target.value)}
                      type="number"
                      className="form-control m-1"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Sexo:</label>
                    <select
                      value={sexo}
                      onChange={(e) => setSexo(e.target.value)}
                      multiple={false}
                      className="form-control m-1"
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
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      type="date"
                      className="form-control m-1"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Lugar Nacimiento:</label>
                    <input
                      value={lugarNacimiento}
                      onChange={(e) => setLugarNacimiento(e.target.value)}
                      type="text"
                      className="form-control m-1"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Procedencia:</label>
                    <input
                      value={procedencia}
                      onChange={(e) => setProcedencia(e.target.value)}
                      type="text"
                      className="form-control m-1"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label">Direccion:</label>
                    <input
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      type="text"
                      className="form-control m-1"
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
                      disabled={!editable}
                    />
                  </div>
                </div>

                <hr />

                <h3> En caso de emergencia comunicarse con:</h3>

                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label">Responsable:</label>
                    <input
                      value=""
                      onChange=""
                      type="text"
                      className="form-control m-1"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Nombre:</label>
                    <input
                      value=""
                      onChange=""
                      type="text"
                      className="form-control m-1"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Telefono:</label>
                    <input
                      value=""
                      onChange=""
                      type="number"
                      className="form-control m-1"
                    />
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
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div className="container mb-3">
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
                      value={medicoAtendido}
                      onChange={(e) => setMedicoAtendido(e.target.value)}
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
                      value={medicoAtendido}
                      onChange={(e) => setMedicoAtendido(e.target.value)}
                      type="text"
                      className="form-control m-1"
                      placeholder={isChecked[2] ? "¿Qué especialidad?" : ""}
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
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    type="text"
                    className="form-control m-1"
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
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    type="text"
                    className="form-control m-1"
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
                            5: e.target.checked,
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
                            5: !e.target.checked,
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
        <TabPanel value={value} index={2}>
          <div className="container d-flex mb-3">
            <h1>Control y Evolucion</h1>
          </div>
        </TabPanel>
      </Box>
    </div>
  );
}
