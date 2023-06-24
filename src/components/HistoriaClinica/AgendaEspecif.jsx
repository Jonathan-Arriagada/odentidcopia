import React from "react";
import { collection, deleteDoc, doc, query, orderBy, updateDoc } from "firebase/firestore";
import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { db } from "../../firebaseConfig/firebase";
import { onSnapshot } from "firebase/firestore";
import ListaSeleccionEstadoCita from "../Agenda/ListaSeleccionEstadoCita";
import CreateCita from "../Agenda/CreateCita";
import EditCita from "../Agenda/EditCita";
import moment from "moment";
import Calendar from "react-calendar";
import { Dropdown, Modal, Button } from "react-bootstrap";
import "../../style/Main.css";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";

function AgendaEspecif(id) {
  const hoy = moment(new Date()).format("YYYY-MM-DD");
  const mañana = moment().add(1, 'days').startOf('day');
  const [citas, setCitas] = useState([]);
  const [search, setSearch] = useState("");
  const [modalShowCrearCita, setModalShowCrearCita] = useState(false);
  const [modalShowEditCita, setModalShowEditCita] = useState(false);
  const [cita, setCita] = useState([]);
  const [idParam, setIdParam] = useState("");
  const [order, setOrder] = useState("ASC");
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [noHayCitas, setNoHayCitas] = useState(false);
  const [modalShowVerNotas, setModalShowVerNotas] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [modalShowFiltros2, setModalShowFiltros2] = useState(false);
  const [selectedCheckbox2, setSelectedCheckbox2] = useState("");
  const [tituloParametroModal, setTituloParametroModal] = useState("");
  const [parametroModal, setParametroModal] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [ocultrarFiltrosGenerales, setOcultrarFiltrosGenerales] = useState(false);

  const [estados, setEstados] = useState([]);
  const [modalSeleccionFechaShow, setModalSeleccionFechaShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [, setTaparFiltro] = useState(false);

  const [doctoresOption, setDoctoresOption] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [estadoOptions, setEstadoOptions] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("");

  const estadosCollectiona = collection(db, "estados");
  const estadosCollection = useRef(query(estadosCollectiona));
  const userCollectiona = collection(db, "user");
  const userCollection = useRef(query(userCollectiona));

  const citasCollection = collection(db, "citas");
  const citasCollectionOrdenados = useRef(query(citasCollection, orderBy("fecha", "desc")));

  const getCitas = useCallback((snapshot) => {
    const citasArray = snapshot.docs
      .filter((doc) => {
        if (userType === process.env.REACT_APP_rolDoctorCon) {
          const doctor = JSON.parse(doc.data().doctor);
          return doctor.uid === currentUser.uid;
        } else {
          return true;
        }
      })
      .filter((doc) => doc.data().idPacienteCita === id.id)
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    citasArray.sort((a, b) => {
      if (a.fecha === b.fecha) {
        return b.horaInicio.localeCompare(a.horaInicio);
      } else {
        return b.fecha.localeCompare(a.fecha);
      }
    });
    setCitas(citasArray);
    if (citasArray.length === 0) {
      setNoHayCitas(true)
    } else {
      setNoHayCitas(false)
    }
    setIsLoading(false);
  }, [id, userType, currentUser]);

  const getEstados = useCallback((snapshot) => {
    const estadosArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEstados(estadosArray);
  }, []);

  const getOptionsEstado = useCallback((snapshot) => {
    const options = snapshot.docs.map((doc, index) => (
      <option key={`estado-${index}`} value={doc.data().name}>{doc.data().name}</option>
    ));
    setEstadoOptions(options);
  }, []);

  const getOptionsDoctores = useCallback(snapshot => {
    const docsOptions = snapshot.docs.map((doc, index) => (
      <option key={`doctores-${index}`}
        value={JSON.stringify({
          uid: doc.data().uid || "admin",
          nombreApellido: doc.data().nombres + " " + doc.data().apellido
        })}>
        {doc.data().nombres + " " + doc.data().apellido}
      </option>
    ));
    setDoctoresOption(docsOptions);
  }, []);

  useEffect(() => {
    const type = localStorage.getItem("rol");
    setUserType(type);

    const unsubscribeFunctions = [
      onSnapshot(citasCollectionOrdenados.current, (snapshot) => {getCitas(snapshot)}),
      onSnapshot(estadosCollection.current, getEstados),
      onSnapshot(userCollection.current, getOptionsDoctores),
      onSnapshot(estadosCollection.current, getOptionsEstado),
    ];
  
    return () => {
      unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
    };
  }, [getCitas, getEstados, getOptionsDoctores, getOptionsEstado]);


  useEffect(() => {
    citas.forEach((cita) => {
      const citaDate = moment(cita.fecha, 'YYYY-MM-DD').startOf('day');
      if ((citaDate.isSame(mañana) || citaDate.isSame(hoy)) && cita.estado !== "Finalizada" && cita.estado !== "Confirmada" && cita.estado !== "Cancelada") {
        const citaRef = doc(db, "citas", cita.id);
        updateDoc(citaRef, { estado: "Por Confirmar" })
      }
    });
  }, [citas, mañana, hoy]);

  const buscarEstilos = (estadoParam) => {
    const colorEncontrado = estados.find((e) => e.name === estadoParam);
    if (colorEncontrado && colorEncontrado.color !== "") {
      return { backgroundColor: colorEncontrado.color, marginBottom: "0" };
    };
  }


  const deleteCita = async (id) => {
    const citaDoc = doc(db, "citas", id);
    await deleteDoc(citaDoc);
    setCitas((prevCitas) => prevCitas.filter((cita) => cita.id !== id));
  };

  const searcher = (e) => {
    if (typeof e === "string") {
      setSearch(e);
    } else {
      setSearch(e.target.value);
    }
  };

  const handleCheckboxChange2 = (event) => {
    setSelectedCheckbox2(event.target.name);
  };

  function handleTituloModal(parametroModal) {
    setFiltroBusqueda(parametroModal);
    switch (parametroModal) {
      case "doctor":
        setTituloParametroModal("Por Doctor");
        break;
      case "estado":
        setTituloParametroModal("Por Estado");
        break;
      case "mes":
        setTituloParametroModal("Por Mes");
        break;
      default:
        setTituloParametroModal("");
    }
    return;
  }

  const filtroFecha = (param) => {
    if (param === "Dia") {
      setSearch(moment().format("YYYY-MM-DD"));
    }
    if (param === "Ultimos 7") {
      const fechaInicio = moment().startOf('isoWeek').format("YYYY-MM-DD");
      const fechaFin = moment().endOf('isoWeek').format("YYYY-MM-DD");
      setSearch({ fechaInicio, fechaFin });
    }
    if (param === "Mes") {
      const fechaInicio = moment().startOf('month').format("YYYY-MM-DD");
      const fechaFin = moment().endOf('month').format("YYYY-MM-DD");
      setSearch({ fechaInicio, fechaFin });
    }
  };

  const [paginaActual, setPaginaActual] = useState(1);
  const filasPorPagina = 50;

  const handleCambioPagina = (pagina) => {
    setPaginaActual(pagina);
    if (pagina > 1) {
      setOcultrarFiltrosGenerales(true);
    } else {
      setOcultrarFiltrosGenerales(false);
    }
  };

  let results = []

  if (doctor && estadoFiltro) {
    results = citas.filter((dato) => {
      const doctorUid = JSON.parse(doctor).uid;
      const estadoMinusc = estadoFiltro.toLowerCase();
      return JSON.parse(dato.doctor).uid === doctorUid && dato.estado.toLowerCase() === estadoMinusc;
    });
  } else if (doctor && !estadoFiltro) {
    results = citas.filter((dato) => JSON.parse(dato.doctor).uid === JSON.parse(doctor).uid);
  } else if (!doctor && estadoFiltro) {
    results = citas.filter((dato) => dato.estado.toLowerCase() === estadoFiltro.toLowerCase());
  } else {
    results = citas;
  }

  results = !search
    ? results
    : typeof search === "object"
      ? results.filter((dato) => {
        const fecha = moment(dato.fecha).format("YYYY-MM-DD");
        return fecha >= search.fechaInicio && fecha <= search.fechaFin;
      })
      : search.toString().length === 10 &&
        search.charAt(4) === "-" &&
        search.charAt(7) === "-"
        ? results.filter((dato) => dato.fecha === search.toString())
        : filtroBusqueda &&
          results.some(
            (cita) =>
              cita[filtroBusqueda]?.includes(search) &&
              cita[filtroBusqueda] !== "" &&
              cita[filtroBusqueda] !== undefined &&
              cita[filtroBusqueda] !== null
          ) ?
          (results = results.filter(
            (dato) =>
              dato[filtroBusqueda]?.includes(search) &&
              dato[filtroBusqueda] !== "" &&
              dato[filtroBusqueda] !== undefined &&
              dato[filtroBusqueda] !== null
          ))
          : results.filter(
            (dato) =>
              dato.apellidoConNombre.toLowerCase().includes(search) ||
              dato.idc.toString().includes(search.toString())
          );

  var paginasTotales = Math.ceil(results.length / filasPorPagina);
  var startIndex = (paginaActual - 1) * filasPorPagina;
  var endIndex = startIndex + filasPorPagina;
  var resultsPaginados = results.slice(startIndex, endIndex);

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...citas].sort((a, b) => {
        const valueA =
          typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
        const valueB =
          typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
        return valueA > valueB ? 1 : -1;
      });
      setCitas(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...citas].sort((a, b) => {
        const valueA =
          typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
        const valueB =
          typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
        return valueA < valueB ? 1 : -1;
      });
      setCitas(sorted);
      setOrder("ASC");
    }
  };

  const confirmeDelete = (id) => {
    Swal.fire({
      title: '¿Esta seguro?',
      text: "No podra revertir la accion",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00C5C1',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCita(id)
        Swal.fire({
          title: '¡Borrado!',
          text: 'Cita eliminada.',
          icon: 'success',
          confirmButtonColor: '#00C5C1'
        });
      }
    })
  }

  return (
    <>
      <div className="mainpage">
        {isLoading ? (
          <span className="loader position-absolute start-50 top-50 mt-3"></span>
        ) : (
          <>
            {noHayCitas ? (
              !id.id ? (
                <div className="container mt-2 mw-100" >
                  <div className="row">
                    <h1>No se ha seleccionado un Paciente.</h1>
                  </div>
                </div>
              ) : (
                <div className="container mt-2 mw-100" >
                  <div className="row">
                    <h1>Este paciente no ha agendado Citas aún</h1>
                    {userType !== process.env.REACT_APP_rolDoctorCon ? (
                      <button
                        variant="primary"
                        className="btn-blue w-25 m-auto mt-5"
                        onClick={() => setModalShowCrearCita(true)}
                      >
                        Crear Nueva Cita
                      </button>
                    ) : null}
                  </div>
                </div>
              )
            ) : (
              <div className="w-100">
                <div className="container mw-100 mt-2">
                  <div className="row">
                    <div className="col">
                      <br></br>
                      <div className="d-flex justify-content-between">
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ maxHeight: "40px" }}
                        >
                          <h3>Citas agendadas por este Paciente</h3>


                          {userType !== process.env.REACT_APP_rolDoctorCon ? (
                            <button
                              variant="primary"
                              className="btn-blue m-1"
                              onClick={() => setModalShowCrearCita(true)}
                            >
                              Agregar Cita
                            </button>
                          ) : null}
                        </div>

                        {!ocultrarFiltrosGenerales && (<div className="col d-flex justify-content-end align-items-center">
                          <div className="mb-3 m-1">
                            <select
                              className="form-control-doctor"
                              multiple={false}
                              onChange={(e) => {
                                const selectedOption = e.target.value;
                                if (selectedOption === "") {
                                  setSearch("")
                                  setTaparFiltro(false);
                                } else if (selectedOption === "Hoy") {
                                  filtroFecha("Hoy");
                                  setTaparFiltro(false);
                                } else if (selectedOption === "Esta Semana") {
                                  filtroFecha("Esta Semana");
                                  setTaparFiltro(true);
                                } else if (selectedOption === "Este Mes") {
                                  filtroFecha("Este Mes");
                                  setTaparFiltro(true);
                                } else if (selectedOption === "Seleccionar") {
                                  setModalSeleccionFechaShow(true);
                                }
                                else if (selectedOption === "Meses") {
                                  handleTituloModal("mes");
                                  setParametroModal("mes");
                                  setModalShowFiltros2(true);
                                }
                              }}
                            >
                              <option value="">Todas las Fechas</option>
                              <option value="Hoy">Hoy</option>
                              <option value="Esta Semana">Esta Semana</option>
                              <option value="Este Mes">Este Mes</option>
                              <option value="Seleccionar">Seleccionar Fecha</option>
                              <option value="Meses">Agrupar por Mes</option>
                            </select>
                          </div>

                          {userType !== process.env.REACT_APP_rolDoctorCon ? (
                            <div className="mb-3 m-1">
                              <select
                                value={doctor}
                                onChange={(e) => setDoctor(e.target.value)}
                                className="form-control-doctor"
                                multiple={false}
                              >
                                <option value="">Todos los Doctores</option>
                                {doctoresOption}
                              </select>
                            </div>
                          ) : null}

                          <div className="mb-3 m-1">
                            <select
                              value={estadoFiltro}
                              onChange={(e) => setEstadoFiltro(e.target.value)}
                              className="form-control-doctor"
                              multiple={false}
                            >
                              <option value="">Todos los Estados</option>
                              {estadoOptions}
                            </select>
                          </div>
                        </div>)}
                      </div>

                      <Modal show={modalSeleccionFechaShow} onHide={() => { setModalSeleccionFechaShow(false); setSelectedDate(""); setTaparFiltro(false); setSearch(""); }}>
                        <Modal.Header closeButton onClick={() => {
                          setModalSeleccionFechaShow(false);
                          setSelectedDate("");
                          setTaparFiltro(false);
                          setSearch("");
                        }}>
                          <Modal.Title>Seleccione una fecha para filtrar:</Modal.Title>
                        </Modal.Header>
                        <Modal.Body
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Calendar
                            defaultValue={moment().format("YYYY-MM-DD")}
                            onChange={(date) => {
                              const formattedDate =
                                moment(date).format("YYYY-MM-DD");
                              setSelectedDate(formattedDate);
                            }}
                            value={selectedDate}
                          />
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="primary" onClick={() => { setSearch(selectedDate); setTaparFiltro(false); setModalSeleccionFechaShow(false); }}>
                            Buscar Fecha
                          </Button>
                        </Modal.Footer>
                      </Modal>

                      <Modal
                        show={modalShowFiltros2}
                        onHide={() => {
                          setModalShowFiltros2(false);
                          setSelectedCheckbox2("");
                        }}
                      >
                        <Modal.Header
                          closeButton
                          onClick={() => {
                            setModalShowFiltros2(false);
                            setParametroModal("");
                            setSelectedCheckbox2("");
                          }}
                        >
                          <Modal.Title>
                            <h3 style={{ fontWeight: "bold" }}>
                              Filtro Seleccionado :{" "}
                            </h3>
                            <h6>{tituloParametroModal}</h6>
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            {citas
                              .map((cita) => cita[parametroModal])
                              .filter(
                                (valor, index, self) =>
                                  self.indexOf(valor) === index &&
                                  valor !== "" &&
                                  valor !== undefined &&
                                  valor !== null
                              )
                              .map((parametroModal, index) => (
                                <label className="checkbox-label" key={index}>
                                  <input
                                    type="checkbox"
                                    name={parametroModal}
                                    checked={
                                      selectedCheckbox2 === parametroModal
                                    }
                                    onChange={handleCheckboxChange2}
                                  />
                                  {parametroModal}
                                </label>
                              ))}
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="primary"
                            onClick={() => {
                              handleTituloModal("");
                              searcher("");
                              setModalShowFiltros2(false);
                              setSelectedCheckbox2("");
                              setParametroModal("");
                            }}
                          >
                            Salir
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => {
                              searcher(selectedCheckbox2);
                              setModalShowFiltros2(false);
                              setParametroModal("");
                              setTituloParametroModal("");
                              setSelectedCheckbox2("");
                            }}
                          >
                            Aplicar Filtro
                          </Button>
                        </Modal.Footer>
                      </Modal>

                      <div className="table__container">
                        <table className="table__body">
                          <thead>
                            <tr>
                              <th onClick={() => sorting("fecha")}>Fecha</th>
                              <th>Hora Inicio</th>
                              <th>Hora Fin</th>
                              <th style={{ textAlign: "left" }}>
                                Apellido y Nombres
                              </th>
                              <th>IDC</th>
                              <th>Telefono</th>
                              <th onClick={() => sorting("doctor")}>Doctor</th>
                              <th onClick={() => sorting("estado")}>Estado</th>
                              <th id="columnaAccion"></th>
                            </tr>
                          </thead>

                          <tbody>
                            {resultsPaginados.map((cita) => (
                              <tr key={cita.id}>
                                <td id="colIzquierda">{moment(cita.fecha).format("DD/MM/YY")}</td>
                                <td> {cita.horaInicio} </td>
                                <td> {cita.horaFin} </td>
                                <td style={{ textAlign: "left" }}> {cita.apellidoConNombre} </td>
                                <td> {cita.idc} </td>
                                <td> {cita.numero} </td>
                                <td>{JSON.parse(cita.doctor).nombreApellido}</td>
                                <td className="colDerecha">
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {cita.estado || ""}
                                    {cita.estado && (
                                      <p
                                        style={buscarEstilos(cita.estado)}
                                        className="color-preview justify-content-center align-items-center"
                                      ></p>

                                    )}
                                    <ListaSeleccionEstadoCita
                                      citaId={cita.id}
                                    />
                                  </div>
                                </td>
                                <td id="columnaAccion">
                                  <Dropdown>
                                    <Dropdown.Toggle
                                      variant="primary"
                                      className="btn btn-secondary mx-1 btn-md"
                                      id="dropdown-actions"
                                      style={{ background: "none", border: "none" }}
                                    >
                                      <i className="fa-solid fa-ellipsis-vertical" id="tdConColor"></i>
                                    </Dropdown.Toggle>

                                    <div className="dropdown__container">
                                      <Dropdown.Menu>
                                        <Dropdown.Item
                                          onClick={() => {
                                            setModalShowVerNotas([
                                              true,
                                              cita.comentario
                                            ]);
                                          }}
                                        >
                                          <i className="fa-regular fa-comment"></i> Ver
                                          Notas
                                        </Dropdown.Item>
                                        {userType !== process.env.REACT_APP_rolDoctorCon ? (
                                          <div>
                                            <Dropdown.Item
                                              onClick={() => {
                                                setModalShowEditCita(true);
                                                setCita(cita);
                                                setIdParam(cita.id);
                                              }}
                                            >
                                              <i className="fa-regular fa-pen-to-square"></i>
                                              Editar
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              onClick={() =>
                                                confirmeDelete(cita.id)
                                              }
                                            >
                                              <i className="fa-solid fa-trash-can"></i>
                                              Eliminar
                                            </Dropdown.Item>
                                          </div>
                                        ) : null}

                                      </Dropdown.Menu>
                                    </div>
                                  </Dropdown>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="table__footer">
                        <div className="table__footer-left">
                          Mostrando {startIndex + 1} - {endIndex} de {results.length}
                        </div>

                        <div className="table__footer-right">
                          <span>
                            <button
                              onClick={() => handleCambioPagina(paginaActual - 1)}
                              disabled={paginaActual === 1}
                              style={{ border: "0", background: "none" }}
                            >
                              &lt; Previo
                            </button>
                          </span>

                          {[...Array(paginasTotales)].map((_, index) => {
                            const pagina = index + 1;
                            return (
                              <span key={pagina}>
                                <span
                                  onClick={() => handleCambioPagina(pagina)}
                                  className={pagina === paginaActual ? "active" : ""}
                                  style={{
                                    margin: "2px",
                                    backgroundColor: pagina === paginaActual ? "#003057" : "transparent",
                                    color: pagina === paginaActual ? "#FFFFFF" : "#000000",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                  }}
                                >
                                  {pagina}
                                </span>
                              </span>
                            );
                          })}

                          <span>
                            <button
                              onClick={() => handleCambioPagina(paginaActual + 1)}
                              disabled={paginaActual === paginasTotales}
                              style={{ border: "0", background: "none" }}
                            >
                              Siguiente &gt;
                            </button>
                          </span>
                        </div>
                      </div>
                      {modalShowVerNotas[0] && (
                        <Modal
                          show={modalShowVerNotas[0]}
                          size="md"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                          onHide={() => setModalShowVerNotas([false, ""])}
                        >
                          <Modal.Header
                            closeButton
                            onClick={() => setModalShowVerNotas([false, ""])}
                          >
                            <Modal.Title>Comentarios</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div className="container">
                              <div className="col">
                                <form>
                                  <div className="row">
                                    <div className="col mb-6">
                                      <p>{modalShowVerNotas[1]}</p>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </Modal.Body>
                        </Modal>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <CreateCita
        id={id.id}
        show={modalShowCrearCita}
        onHide={() => setModalShowCrearCita(false)} />
      <EditCita
        id={idParam}
        cita={cita}
        show={modalShowEditCita}
        onHide={() => setModalShowEditCita(false)}
      />
    </>
  );
}


export default AgendaEspecif;