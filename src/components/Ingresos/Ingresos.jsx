import React from "react";
import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import Navigation from "../Navigation";
import moment from "moment";
import Calendar from "react-calendar";
import { Modal, Button } from "react-bootstrap";
import { FaSignOutAlt, FaBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../../style/Main.css";
import Swal from "sweetalert2";
import profile from "../../img/profile.png";
import { AuthContext } from "../../context/AuthContext";

const Ingresos = () => {
  const [tratamientos, setTratamientos] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("ASC");
  const [isLoading, setIsLoading] = useState(true);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [cantIngresos, setCantIngresos] = useState(0);

  const [modalSeleccionFechaShow, setModalSeleccionFechaShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mostrarBotonesFechas, setMostrarBotonesFechas] = useState(false);
  const [taparFiltro, setTaparFiltro] = useState(false);

  const tratamientosCollectionRef = collection(db, "tratamientos");
  const tratamientosCollection = useRef(query(tratamientosCollectionRef));
  const navigate = useNavigate();
  const { currentUser, } = useContext(AuthContext);


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

  const getTratamientos = useCallback((snapshot) => {
    const tratamientosArray = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setTratamientos(tratamientosArray);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      tratamientosCollection.current,
      getTratamientos
    );
    return unsubscribe;
  }, [getTratamientos]);

  const searcher = (e) => {
    if (typeof e === "string") {
      setSearch(e);
    } else {
      setSearch(e.target.value);
    }
  };

  var results;
  if (!search || search === "") {
    results = tratamientos;
  } else {
    if (typeof search === "object") {
      results = tratamientos.map((tratamiento) => {
        const {
          fechaCobro,
          importeAbonado,
          codigoTratamiento,
          pacienteCobro,
          tratamientoCobro,
        } = tratamiento.cobrosManuales;

        const filteredFechaCobro = [];
        const filteredImporteAbonado = [];
        const filteredCodigoTratamiento = [];
        const filteredPacienteCobro = [];
        const filteredTratamientoCobro = [];

        for (let i = 0; i < fechaCobro.length; i++) {
          const fecha = fechaCobro[i];
          const fechaz = moment(fecha).format("YYYY-MM-DD");
          if (fechaz >= search.fechaInicio && fechaz <= search.fechaFin) {
            filteredFechaCobro.push(fecha);
            filteredImporteAbonado.push(importeAbonado[i]);
            filteredCodigoTratamiento.push(codigoTratamiento[i]);
            filteredPacienteCobro.push(pacienteCobro[i]);
            filteredTratamientoCobro.push(tratamientoCobro[i]);
          }
        }

        return {
          ...tratamiento,
          cobrosManuales: {
            fechaCobro: filteredFechaCobro,
            importeAbonado: filteredImporteAbonado,
            codigoTratamiento: filteredCodigoTratamiento,
            pacienteCobro: filteredPacienteCobro,
            tratamientoCobro: filteredTratamientoCobro,
          },
        };
      });
    } else {
      if (
        search.toString().length === 10 &&
        search.charAt(4) === "-" &&
        search.charAt(7) === "-"
      ) {
        results = tratamientos.map((tratamiento) => {
          const {
            fechaCobro,
            importeAbonado,
            codigoTratamiento,
            pacienteCobro,
            tratamientoCobro,
          } = tratamiento.cobrosManuales;

          const filteredFechaCobro = [];
          const filteredImporteAbonado = [];
          const filteredCodigoTratamiento = [];
          const filteredPacienteCobro = [];
          const filteredTratamientoCobro = [];

          for (let i = 0; i < fechaCobro.length; i++) {
            const fecha = fechaCobro[i];
            const fechaz = moment(fecha).format("YYYY-MM-DD");
            if (fechaz === search) {
              filteredFechaCobro.push(fecha);
              filteredImporteAbonado.push(importeAbonado[i]);
              filteredCodigoTratamiento.push(codigoTratamiento[i]);
              filteredPacienteCobro.push(pacienteCobro[i]);
              filteredTratamientoCobro.push(tratamientoCobro[i]);
            }
          }

          return {
            ...tratamiento,
            cobrosManuales: {
              fechaCobro: filteredFechaCobro,
              importeAbonado: filteredImporteAbonado,
              codigoTratamiento: filteredCodigoTratamiento,
              pacienteCobro: filteredPacienteCobro,
              tratamientoCobro: filteredTratamientoCobro,
            },
          };
        });
      } else {
        results = tratamientos.filter(
          (dato) =>
            dato.cobrosManuales.pacienteCobro
              ?.toString()
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            dato.cobrosManuales.tratamientoCobro
              ?.toString()
              .toLowerCase()
              .includes(search.toLowerCase())
        );
      }
    }
  }

  useEffect(() => {
    let total = 0;
    let cantidad = 0;

    results.forEach((tratamiento) => {
      const importes = tratamiento.cobrosManuales.importeAbonado;

      importes.forEach((importe, index) => {
        total += Number(importe);
        cantidad++;
      });
    });

    setTotalIngresos(total);
    setCantIngresos(cantidad);
  }, [results]);

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...tratamientos].sort((a, b) => {
        const valueA =
          typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
        const valueB =
          typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
        return valueA > valueB ? 1 : -1;
      });
      setTratamientos(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...tratamientos].sort((a, b) => {
        const valueA =
          typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
        const valueB =
          typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
        return valueA < valueB ? 1 : -1;
      });
      setTratamientos(sorted);
      setOrder("ASC");
    }
  };

  const filtroFecha = (param) => {
    if (param === "Dia") {
      setSearch(moment().format("YYYY-MM-DD"));
    }
    if (param === "Semana") {
      const fechaInicio = moment().subtract(7, "days").format("YYYY-MM-DD");
      const fechaFin = moment().format("YYYY-MM-DD");
      setSearch({ fechaInicio, fechaFin });
    }
    if (param === "Mes") {
      const fechaInicio = moment().subtract(30, "days").format("YYYY-MM-DD");
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
          <div className="w-100">
            <nav className="navbar">
              <div className="d-flex justify-content-between w-100 px-2">
                <div className="search-bar w-50" style={{ position: "relative" }}>
                  <input
                    value={search}
                    onChange={searcher}
                    type="text"
                    placeholder="Buscar por Tratamiento o Paciente..."
                    className="form-control-upNav  m-2"
                  />
                  {taparFiltro && (
                    <input
                      className="form-control m-2 w-25"
                      value="<-FILTRO ENTRE FECHAS APLICADO->"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 1,
                        textAlign: "center",
                      }}
                      disabled
                    ></input>
                  )}
                </div>
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
            <div className="container mt-2 mw-100">
              <div className="col">
                <br></br>
                <div className="row">
                  <div className="d-grid gap-2">
                    <div className="d-flex justify-content-between">
                      <div className="col d-flex justify-content-start">
                        <h1>Ingresos</h1>

                        <button
                          variant="primary"
                          className="btn greenWater without mx-1 btn-md"
                          style={{
                            borderRadius: "12px",
                            justifyContent: "center",
                            verticalAlign: "center",
                            alignSelf: "center",
                            height: "45px",
                          }}
                          onClick={() => {
                            setMostrarBotonesFechas(!mostrarBotonesFechas);
                            setSearch("");
                            setTaparFiltro(false);
                          }}
                        >
                          <i
                            className="fa-regular fa-calendar-check"
                            style={{ transform: "scale(1.4)" }}
                          ></i>
                        </button>
                        {mostrarBotonesFechas && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              verticalAlign: "center",
                              alignItems: "center",
                            }}
                          >
                            <button
                              style={{ borderRadius: "7px", margin: "10px", height: "38px", }} className="without grey"
                              onClick={() => {
                                filtroFecha("Dia");
                                setTaparFiltro(false);
                              }}
                            >
                              Dia
                            </button>
                            <button
                              style={{ borderRadius: "7px", margin: "10px", height: "38px", }} className="without grey"
                              onClick={() => {
                                filtroFecha("Semana");
                                setTaparFiltro(true);
                              }}
                            >
                              Semana
                            </button>
                            <button
                              style={{ borderRadius: "7px", margin: "10px", height: "38px", }} className="without grey"
                              onClick={() => {
                                filtroFecha("Mes");
                                setTaparFiltro(true);
                              }}
                            >
                              Mes
                            </button>
                            <button
                              style={{ borderRadius: "7px", margin: "10px", height: "38px", }} className="without grey"
                              onClick={() => {
                                setModalSeleccionFechaShow(true);
                              }}
                            >
                              Seleccionar
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="col d-flex justify-content-end">
                        <div className="d-flex flex-column">
                          <h5>Cant Ingresos: {cantIngresos} </h5>
                          <h5>Total Ingresos: {totalIngresos}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Modal
                  show={modalSeleccionFechaShow}
                  onHide={() => {
                    setModalSeleccionFechaShow(false);
                    setSelectedDate("");
                    setTaparFiltro(false);
                    setSearch("");
                    setMostrarBotonesFechas(false);
                  }}
                >
                  <Modal.Header
                    closeButton
                    onClick={() => {
                      setModalSeleccionFechaShow(false);
                      setSelectedDate("");
                      setTaparFiltro(false);
                      setSearch("");
                      setMostrarBotonesFechas(false);
                    }}
                  >
                    <Modal.Title>
                      Seleccione una fecha para filtrar:
                    </Modal.Title>
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
                    <Button
                      variant="primary"
                      onClick={() => {
                        setSearch(selectedDate);
                        setTaparFiltro(false);
                        setModalSeleccionFechaShow(false);
                        setMostrarBotonesFechas(false);
                      }}
                    >
                      Buscar Fecha
                    </Button>
                  </Modal.Footer>
                </Modal>


                <div className="row">
                  <table className="table__body">
                    <thead>
                      <tr>
                        <th onClick={() => sorting("fechaCobro")}>Fecha</th>
                        <th onClick={() => sorting("pacienteCobro")} style={{ textAlign: "left" }}>
                          Paciente
                        </th>
                        <th onClick={() => sorting("tratamientoCobro")} style={{ textAlign: "left" }}>
                          Tratamiento
                        </th>
                        <th onClick={() => sorting("nroComprobanteCobro")}>
                          Nro Comprobante
                        </th>
                        <th onClick={() => sorting("importeAbonado")}>
                          Importe
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {results.map((tratamiento) => {
                        return tratamiento.cobrosManuales.fechaCobro.map(
                          (_, index) => {
                            const fecha =
                              tratamiento.cobrosManuales.fechaCobro[index] ||
                              "";
                            const paciente =
                              tratamiento.cobrosManuales.pacienteCobro[index] ||
                              "";
                            const tratamientoz =
                              tratamiento.cobrosManuales.tratamientoCobro[
                              index
                              ] || "";
                            const nroComprobante =
                              tratamiento.cobrosManuales.nroComprobanteCobro[
                              index
                              ] || "";
                            const importe =
                              tratamiento.cobrosManuales.importeAbonado[
                              index
                              ] || "";

                            return (
                              <tr key={index}>
                                <td>
                                  {moment(fecha.toString()).format(
                                    "DD/MM/YY"
                                  )}
                                </td>
                                <td style={{ textAlign: "left" }}>{paciente.toString()}</td>
                                <td style={{ textAlign: "left" }}>{tratamientoz.toString()}</td>
                                <td>{nroComprobante.toString()}</td>
                                <td>{importe.toString()}</td>
                              </tr>
                            );

                          }
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Ingresos;
