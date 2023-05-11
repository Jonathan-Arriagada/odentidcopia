import React, { useCallback, useRef } from "react";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig/firebase";
import Navigation from "../Navigation";
import CreateTratamiento from "./CreateTratamiento";
import EditTratamiento from "./EditTratamiento";
import "../Utilidades/loader.css";
import "../Utilidades/tablas.css";
import EstadosTratamientos from "./EstadosTratamientos";
import EditPago from "./EditPago";
import ListaSeleccionEstadoPago from './ListaSeleccionEstadoPago'
import moment from 'moment';
import Calendar from "react-calendar";
import { Dropdown } from 'react-bootstrap';
import { Modal, Button } from "react-bootstrap";


function Tratamientos() {
  const [tratamientos, setTratamientos] = useState([]);
  const [search, setSearch] = useState("");
  const [modalShowTratamiento, setModalShowTratamiento] = useState(false);
  const [modalShowEditTratamiento, setModalShowEditTratamiento] = useState(false);
  const [order, setOrder] = useState("ASC");
  const [tratamiento, setTratamiento] = useState([]);
  const [idParam, setIdParam] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [modalShowEstadosTratamientos, setModalShowEstadosTratamientos] = useState(false);
  const [modalShowEditPago, setModalShowEditPago] = useState(false);

  const tratamientosCollectiona = collection(db, "tratamientos");
  const tratamientosCollection = useRef(query(tratamientosCollectiona, orderBy("codigo", "desc")));

  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [mostrarVer, setMostrarVer] = useState(true);
  const [mostrarAjustes, setMostrarAjustes] = useState(false);

  const [modalShowFiltros, setModalShowFiltros] = useState(false);
  const [selectedCheckbox, setSelectedCheckbox] = useState("");
  const [modalShowFiltros2, setModalShowFiltros2] = useState(false);
  const [selectedCheckbox2, setSelectedCheckbox2] = useState("");
  const [parametroModal, setParametroModal] = useState("");
  const [tituloParametroModal, setTituloParametroModal] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [quitarFiltro, setQuitarFiltro] = useState(false);

  const [modalSeleccionFechaShow, setModalSeleccionFechaShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mostrarBotonesFechas, setMostrarBotonesFechas] = useState(false);
  const [taparFiltro, setTaparFiltro] = useState(false);



  const ocultarTabla = (codigo) => {
    if (mostrarTabla) {
      setMostrarTabla(false);
      setSearch("")
      setMostrarVer(true)
    } else {
      setSearch(codigo)
      setMostrarTabla(true)
      setMostrarVer(false)
    }
  };

  function getEstadoStyle(estado) {
    switch (estado) {
      case "EN CURSO":
        return { backgroundColor: "#ebc474" };
      case "ABANDONADO":
        return {
          backgroundColor: "#d893a3",
          color: "#b30021"
        };
      case "FINALIZADO":
        return { backgroundColor: "#86e49d", color: "#006b21" };
      case "SUSPENDIDO":
        return { backgroundColor: "#6fcaea" };
      default:
        return {};
    }
  }

  const getTratamientos = useCallback((snapshot) => {
    const tratamientosArray = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setTratamientos(tratamientosArray);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(tratamientosCollection.current, getTratamientos);
    return unsubscribe;
  }, [getTratamientos]);

  function getPagoStyle(estado) {
    switch (estado) {
      case "Programado":
        return { backgroundColor: "#ebc474" };
      case "Cancelado":
        return {
          backgroundColor: "#d893a3",
          color: "#b30021"
        };
      case "Finalizado":
        return { backgroundColor: "#86e49d", color: "#006b21" };
      default:
        return {};
    }
  }

  const deletetratamiento = async (id) => {
    const tratamientoDoc = doc(db, "tratamientos", id);
    await deleteDoc(tratamientoDoc);
    setTratamientos((prevTratamientos) =>
      prevTratamientos.filter((tratamiento) => tratamiento.id !== id)
    );
  };

  const searcher = (e) => {
    if (typeof e === 'string') {
      setSearch(e);
    } else {
      setSearch(e.target.value);

    }
  };

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...tratamientos].sort((a, b) => {
        const valueA = typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
        const valueB = typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
        return valueA > valueB ? 1 : -1;
      });
      setTratamientos(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...tratamientos].sort((a, b) => {
        const valueA = typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
        const valueB = typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
        return valueA < valueB ? 1 : -1;
      });
      setTratamientos(sorted);
      setOrder("ASC");
    }
  };

  var results;
  if (!search) {
    results = tratamientos;
  } else {
    if (typeof search === 'object') {
      results = tratamientos.filter((dato) => {
        const fecha = moment(dato.fecha).format("YYYY-MM-DD");
        return (
          fecha >= search.fechaInicio && fecha <= search.fechaFin
        );
      })

    } else {
      if (search.toString().length === 10 && search.charAt(4) === "-" && search.charAt(7) === "-") {
        results = tratamientos.filter((dato) => dato.fecha === search.toString())
      } else {
        if (search.toString().length === 1 && !isNaN(search)) {
          results = tratamientos.filter((dato) => dato.codigo === search);
        } else {
          if (filtroBusqueda && tratamientos.some(tratamiento => tratamiento[filtroBusqueda]?.includes(search) && tratamiento[filtroBusqueda] !== "" && tratamiento[filtroBusqueda] !== undefined && tratamiento[filtroBusqueda] !== null)) {
            results = tratamientos.filter((dato) =>
              dato[filtroBusqueda]?.includes(search) &&
              dato[filtroBusqueda] !== "" &&
              dato[filtroBusqueda] !== undefined &&
              dato[filtroBusqueda] !== null
            );
          } else {
            results = tratamientos.filter((dato) =>
              dato.apellidoConNombre.toLowerCase().includes(search) ||
              dato.idc.toString().includes(search.toString())
            )
          }
        }
      }
    }
  }

  function funcMostrarAjustes() {
    if (mostrarAjustes) {
      setMostrarAjustes(false);
    } else {
      setMostrarAjustes(true);
    }
  };

  function renderDateDiff(date1) {
    const diff = moment().diff(moment(date1), 'years months days');
    const years = moment.duration(diff).years();
    const months = moment.duration(diff).months();
    const days = moment.duration(diff).days();

    return `${years}    .    ${months}    .    ${days} `;
  }

  const handleCheckboxChange = (event) => {
    setSelectedCheckbox(event.target.name);
    setParametroModal(event.target.name);
  };

  const handleCheckboxChange2 = (event) => {
    setSelectedCheckbox2(event.target.name);
  };

  function handleTituloModal(parametroModal) {
    setFiltroBusqueda(parametroModal);
    switch (parametroModal) {
      case 'tarifasTratamientos':
        setTituloParametroModal('Por Tratamiento');
        break;
      case 'estadoPago':
        setTituloParametroModal('Por Estado Pago');
        break;
      case 'fecha':
        setTituloParametroModal('Por Fecha');
        break;
      case 'estadosTratamientos':
        setTituloParametroModal('Por Estado Tratamiento');
        break;
      default:
        setTituloParametroModal('');
    }
    return
  }

  const filtroFecha = (param) => {
    if (param === "Dia") {
      setSearch(moment().format("YYYY-MM-DD"))
    }
    if (param === "Semana") {
      const fechaInicio = moment().subtract(7, 'days').format("YYYY-MM-DD");
      const fechaFin = moment().format("YYYY-MM-DD");
      setSearch({ fechaInicio, fechaFin });
    }
    if (param === "Mes") {
      const fechaInicio = moment().subtract(30, 'days').format("YYYY-MM-DD");
      const fechaFin = moment().format("YYYY-MM-DD");
      setSearch({ fechaInicio, fechaFin });
    }
  };

  return (
    <>
      <div className="mainpage">
        <Navigation />
        {isLoading ? (
          <span className="loader position-absolute start-50 top-50 mt-3"></span>
        ) : (
          <div className="container mt-2 mw-100" >
            <div className="row">
              <div className="col">
                <div className="d-grid gap-2">
                  <div className="d-flex justify-content-between">
                    <div className="d-flex justify-content-center align-items-center" style={{ maxHeight: "34px" }}>
                      <h1>Tratamientos</h1>
                      <button
                        className="btn btn-dark mx-2 btn-sm"
                        onClick={() => {
                          funcMostrarAjustes(true);
                        }}
                      >
                        <i className="fa-solid fa-gear"></i>
                      </button>
                    </div>
                  </div>


                  <div className="d-flex justify-content-between">
                  {taparFiltro && (
                      <input 
                      className="form-control m-2 w-25"
                      value="<-FILTRO ENTRE FECHAS APLICADO->"
                      style={{textAlign:"center"}}
                      disabled
                      >
                      </input>
                    )}
                    <input
                      value={search}
                      onChange={(e) => { searcher(e); setMostrarTabla(false); setMostrarVer(true) }}
                      type="text"
                      placeholder="Buscar por Apellido, Nombres o DNI..."
                      className="form-control m-2 w-25"
                      style={{
                        display: taparFiltro ? "none" : "block",   }}
                    />
                    <button
                      variant="primary"
                      className="btn btn-success mx-1 btn-md"
                      style={{ borderRadius: "12px", justifyContent: "center", verticalAlign: "center", alignSelf: "center", height: "45px" }}
                      onClick={() => { setMostrarBotonesFechas(!mostrarBotonesFechas); setSearch(""); setTaparFiltro(false) }}
                    >
                      <i className="fa-regular fa-calendar-check" style={{ transform: "scale(1.4)" }}></i>
                    </button>
                    {mostrarBotonesFechas && (<div style={{ display: 'flex', justifyContent: "center", verticalAlign: "center", alignItems: "center" }}>
                      <button style={{ borderRadius: "7px", margin: "1px", height: "38px", }} className="btn btn-outline-dark" onClick={() => {filtroFecha('Dia'); setTaparFiltro(false)}}>Dia</button>
                      <button style={{ borderRadius: "7px", margin: "1px", height: "38px", }} className="btn btn-outline-dark" onClick={() => {filtroFecha('Semana'); setTaparFiltro(true)}}>Semana</button>
                      <button style={{ borderRadius: "7px", margin: "1px", height: "38px", }} className="btn btn-outline-dark" onClick={() => {filtroFecha('Mes'); setTaparFiltro(true)}}>Mes</button>
                      <button style={{ borderRadius: "7px", margin: "1px", height: "38px", }} className="btn btn-outline-dark" onClick={() => {setModalSeleccionFechaShow(true)}}>Seleccionar</button>
                    </div>)}

                    <Modal show={modalSeleccionFechaShow} onHide={() => { setModalSeleccionFechaShow(false); setSelectedDate("");setTaparFiltro(false); setSearch("");setMostrarBotonesFechas(false) }}>
                      <Modal.Header closeButton onClick={() => {
                        setModalSeleccionFechaShow(false);
                        setSelectedDate("");
                        setTaparFiltro(false);
                        setSearch("");
                        setMostrarBotonesFechas(false);
                      }}>
                        <Modal.Title>Seleccione una fecha para filtrar:</Modal.Title>
                      </Modal.Header>
                      <Modal.Body style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Calendar defaultValue={moment().format("YYYY-MM-DD")} onChange={(date) => {
                          const formattedDate = moment(date).format('YYYY-MM-DD');
                          setSelectedDate(formattedDate);
                        }}
                          value={selectedDate}
                        />
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="primary" onClick={() => { setSearch(selectedDate); setTaparFiltro(false); setModalSeleccionFechaShow(false); setMostrarBotonesFechas(false) }}>
                          Buscar Fecha
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    <div className="col d-flex justify-content-end">
                      <button
                        variant="primary"
                        className="btn-blue m-2"
                        onClick={() => setModalShowTratamiento(true)}
                      >
                        Agregar Tratamiento
                      </button>
                      <button
                        variant="primary"
                        className="btn-blue m-2"
                        onClick={() => { setModalShowFiltros(true); setQuitarFiltro(true) }}>
                        Filtros
                      </button>
                      {quitarFiltro && (<button
                        variant="primary"
                        className="btn-blue m-2"
                        onClick={() => { setSearch(""); setQuitarFiltro(false) }}
                      >
                        Limpiar Filtros
                      </button>)}

                      <Modal show={modalShowFiltros} onHide={() => { setSelectedCheckbox(""); setParametroModal(""); setSelectedCheckbox2(""); }}>
                        <Modal.Header closeButton onClick={() => {
                          setModalShowFiltros(false);
                          setSelectedCheckbox("");
                          setSelectedCheckbox2("");
                          setParametroModal("");
                        }}>
                          <Modal.Title><h1 style={{ fontWeight: "bold" }}>Filtros Generales</h1></Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <div>
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                name="tarifasTratamientos"
                                checked={selectedCheckbox === "tarifasTratamientos"}
                                onChange={handleCheckboxChange}
                              />
                              Filtrar Por Tratamiento
                            </label>
                            <br />
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                name="fecha"
                                checked={selectedCheckbox === "fecha"}
                                onChange={handleCheckboxChange}
                              />
                              Filtrar Por Fecha
                            </label>
                            <br />
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                name="estadoPago"
                                checked={selectedCheckbox === "estadoPago"}
                                onChange={handleCheckboxChange}
                              />
                              Filtrar Por Estado Pago
                            </label>
                            <br />
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                name="estadosTratamientos"
                                checked={selectedCheckbox === "estadosTratamientos"}
                                onChange={handleCheckboxChange}
                              />
                              Filtrar Por Estado Tratamiento
                            </label>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="primary" onClick={() => { setSelectedCheckbox(selectedCheckbox); handleTituloModal(selectedCheckbox); setModalShowFiltros2(true); setModalShowFiltros(false); }}>
                            Seleccionar y Continuar
                          </Button>
                        </Modal.Footer>
                      </Modal>


                      <Modal show={modalShowFiltros2} onHide={() => { setModalShowFiltros2(false); setSelectedCheckbox2(""); }}>
                        <Modal.Header closeButton onClick={() => {
                          setModalShowFiltros2(false);
                          setParametroModal("");
                          setSelectedCheckbox("");
                          setSelectedCheckbox2("");
                        }}>
                          <Modal.Title>
                            <h3 style={{ fontWeight: "bold" }}>Filtro Seleccionado : </h3>
                            <h6>{tituloParametroModal}</h6>
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <div>
                            {tratamientos
                              .map(tratamiento => tratamiento[parametroModal])
                              .filter((valor, index, self) => self.indexOf(valor) === index && valor !== "" && valor !== undefined && valor !== null)
                              .map((parametroModal, index) => (
                                <label className="checkbox-label" key={index}>
                                  <input
                                    type="checkbox"
                                    name={parametroModal}
                                    checked={selectedCheckbox2 === parametroModal}
                                    onChange={handleCheckboxChange2}
                                  />
                                  {parametroModal}
                                </label>
                              ))}
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="primary" onClick={() => { setModalShowFiltros(true); handleTituloModal(""); setModalShowFiltros2(false); setSelectedCheckbox(""); setSelectedCheckbox2(""); setParametroModal("") }}>
                            Volver
                          </Button>
                          <Button variant="primary" onClick={() => { searcher(selectedCheckbox2); setModalShowFiltros2(false); setParametroModal(""); setTituloParametroModal(""); setSelectedCheckbox(""); setSelectedCheckbox2(""); }}>
                            Aplicar Filtro
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      {mostrarAjustes && (
                        <div className="d-flex">
                          <button
                            variant="secondary"
                            className="btn-blue m-2"
                            onClick={() => setModalShowEstadosTratamientos(true)}
                          >
                            Estados Tratamientos
                          </button>
                          <button
                            variant="secondary"
                            className="btn-blue m-2"
                            onClick={() => setModalShowEditPago(true)}
                          >
                            Estado Pago
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <table className="table__body">
                  <thead>
                    <tr>
                      <th>N°</th>
                      <th onClick={() => sorting("apellido")}>Apellido y Nombres</th>
                      <th onClick={() => sorting("idc")}>DNI</th>
                      <th onClick={() => sorting("cta")}>Cta</th>
                      <th onClick={() => sorting("tarifasTratamientos")}>Tratamiento</th>
                      <th onClick={() => sorting("pieza")}>Pieza</th>
                      <th onClick={() => sorting("fecha")}>Fecha</th>
                      <th onClick={() => sorting("estadoPago")}>Estado Pago</th>
                      <th onClick={() => sorting("estadosTratamientos")}>Estado Tratamiento</th>
                      <th>Y    .    M   .    D</th>

                      <th>Accion</th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((tratamiento, index) => (
                      <tr key={tratamiento.id}>
                        <td>{results.length - index}</td>
                        <td> {tratamiento.apellidoConNombre} </td>
                        <td> {tratamiento.idc} </td>
                        <td> {tratamiento.cta} </td>
                        <td> {tratamiento.tarifasTratamientos} </td>
                        <td> {tratamiento.pieza} </td>
                        <td>{moment(tratamiento.fecha).format('DD/MM/YY')}</td>
                        <td><p style={getPagoStyle(tratamiento.estadoPago)} className="status">{tratamiento.estadoPago}</p></td>
                        <td><p style={getEstadoStyle(tratamiento.estadosTratamientos)} className="status"> {tratamiento.estadosTratamientos}</p></td>
                        <td> {renderDateDiff(tratamiento.fecha)} </td>

                        <td>
                          <Dropdown>
                            <Dropdown.Toggle variant="primary" className="btn btn-secondary mx-1 btn-md" id="dropdown-actions">
                              <i className="fa-solid fa-list"> </i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              {mostrarVer && <Dropdown.Item onClick={() => ocultarTabla(tratamiento.codigo)}>
                                <i className="fa-regular fa-eye"></i> Ver
                              </Dropdown.Item>}
                              {!mostrarVer && <Dropdown.Item onClick={() => ocultarTabla("")}>
                                <i className="fa-regular fa-eye-slash"></i> Ocultar
                              </Dropdown.Item>}
                              <Dropdown.Item onClick={() => {
                                setModalShowEditTratamiento(true);
                                setTratamiento(tratamiento);
                                setIdParam(tratamiento.id);
                              }}>
                                <i className="fa-regular fa-pen-to-square"></i> Editar
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => deletetratamiento(tratamiento.id)}>
                                <i className="fa-solid fa-trash-can"></i> Eliminar
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {mostrarTabla && (<table className="table__body" style={{ marginTop: "50px" }}>
                  <thead>
                    <tr>
                      <th>Precio</th>
                      <th>Saldo</th>
                      <th>Plazo</th>
                      <th>Cuota</th>
                      <th>Resta</th>
                      <th>Fecha Vto</th>
                      <th>Estado Pago</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((tratamiento) => (
                      <tr key={tratamiento.id}>
                        <td>{tratamiento.precio}</td>
                        <td>{tratamiento.plazo === 0 ? 0 * (tratamiento.plazo - tratamiento.cuota) : (tratamiento.precio / tratamiento.plazo) * (tratamiento.plazo - tratamiento.cuota)}</td>
                        <td>{tratamiento.plazo}</td>
                        <td>{tratamiento.cuota}</td>
                        <td>{tratamiento.plazo - tratamiento.cuota}</td>
                        <td>{moment(tratamiento.fechaVencimiento).format('DD/MM/YY')}</td>
                        <td style={{ display: "flex" }}>
                          <span style={{ marginRight: "5px" }}>{tratamiento.estadoPago}</span>
                          <ListaSeleccionEstadoPago
                            tratamientoId={tratamiento.id}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>)}

                {mostrarTabla && (<table className="table__body" style={{ marginTop: "50px", width: "80%", border: "1px solid lightgray" }}>
                  <thead>
                    <tr>
                      <th>Comentarios</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((tratamiento) => (
                      <tr key={tratamiento.id}>
                        <td>{tratamiento.notas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>)}
              </div>
            </div>
          </div>
        )}
      </div >
      <EstadosTratamientos
        show={modalShowEstadosTratamientos}
        onHide={() => setModalShowEstadosTratamientos(false)}
      />
      <CreateTratamiento
        show={modalShowTratamiento}
        onHide={() => setModalShowTratamiento(false)}
      />
      <EditTratamiento
        id={idParam}
        tratamiento={tratamiento}
        show={modalShowEditTratamiento}
        onHide={() => setModalShowEditTratamiento(false)}
      />
      <EditPago
        show={modalShowEditPago}
        onHide={() => setModalShowEditPago(false)}
      />
    </>
  );
}

export default Tratamientos;