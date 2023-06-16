import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import moment from "moment";
import Calendar from "react-calendar";
import { Modal, Button } from "react-bootstrap";
import "../../style/Main.css";

function IngresosEspecif(id) {
  const [tratamientos, setTratamientos] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("ASC");
  const [isLoading, setIsLoading] = useState(true);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [cantIngresos, setCantIngresos] = useState(0);
  const [noHayIngresos, setNoHayIngresos] = useState(false);

  const [modalSeleccionFechaShow, setModalSeleccionFechaShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mostrarBotonesFechas, setMostrarBotonesFechas] = useState(false);

  const tratamientosCollectionRef = collection(db, "tratamientos");
  const tratamientosCollection = useRef(query(tratamientosCollectionRef));


  const getTratamientos = useCallback((snapshot) => {
    const tratamientosArray = snapshot.docs
      .filter((doc) => doc.data().idPaciente === id.id)
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    setTratamientos(tratamientosArray);
    if (tratamientosArray.length === 0) {
      setNoHayIngresos(true)
    } else {
      setNoHayIngresos(false)
    }
    setIsLoading(false);
  }, [id]);

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
        {isLoading ? (
          <span className="loader position-absolute start-50 top-50 mt-3"></span>
        ) : (
          <>
            {noHayIngresos ? (
              !id.id ? (
                <div className="container mt-2 mw-100" >
                  <div className="row">
                    <h1>No se ha seleccionado un Paciente.</h1>
                  </div>
                </div>
              ) : (
                <div className="container mt-2 mw-100" >
                  <div className="row">
                    <h1>A Este paciente no se le han registrado Ingresos aún</h1>
                    <h3>Para registrar Ingresos diríjase a Tratamientos</h3>
                  </div>
                </div>
              )
            ) : (
              <div className="w-100">
                <div className="container mt-2 mw-100">
                  <div className="col">
                    <div className="row">
                      <div className="d-grid gap-2">
                        <div className="d-flex justify-content-between">
                          <div className="col d-flex justify-content-start align-items-center">
                            <h3>Ingresos cobrados al Paciente</h3>
                            <button
                              variant="primary"
                              className="btn greenWater without mx-1 btn-md ms-3 me-3"
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
                                  style={{
                                    borderRadius: "7px",
                                    margin: "1px",
                                    height: "38px",
                                  }}
                                  className="btn btn-outline-dark"
                                  onClick={() => {
                                    filtroFecha("Dia");
                                  }}
                                >
                                  Dia
                                </button>
                                <button
                                  style={{
                                    borderRadius: "7px",
                                    margin: "1px",
                                    height: "38px",
                                  }}
                                  className="btn btn-outline-dark"
                                  onClick={() => {
                                    filtroFecha("Semana");
                                  }}
                                >
                                  Semana
                                </button>
                                <button
                                  style={{
                                    borderRadius: "7px",
                                    margin: "1px",
                                    height: "38px",
                                  }}
                                  className="btn btn-outline-dark"
                                  onClick={() => {
                                    filtroFecha("Mes");
                                  }}
                                >
                                  Mes
                                </button>
                                <button
                                  style={{
                                    borderRadius: "7px",
                                    margin: "1px",
                                    height: "38px",
                                  }}
                                  className="btn btn-outline-dark"
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
                            <input
                              value={search}
                              onChange={searcher}
                              type="text"
                              className="form-control m-2 w-25"
                              style={{ display: "none" }}
                            />
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
                        setSearch("");
                        setMostrarBotonesFechas(false);
                      }}
                    >
                      <Modal.Header
                        closeButton
                        onClick={() => {
                          setModalSeleccionFechaShow(false);
                          setSelectedDate("");
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
          </>
        )}
      </div>
    </>
  );
};

export default IngresosEspecif;
