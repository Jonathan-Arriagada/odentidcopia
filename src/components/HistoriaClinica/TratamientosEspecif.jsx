import React, { useCallback, useRef } from "react";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig/firebase";
import CreateTratamiento from "../Tratamientos/CreateTratamiento";
import EditTratamiento from "../Tratamientos/EditTratamiento";
import ListaSeleccionEstadoPago from "../Tratamientos/ListaSeleccionEstadoPago";
import ListaSeleccionEstadoTratamiento from "../Tratamientos/ListaSeleccionEstadoTratamiento";
import moment from "moment";
import Calendar from "react-calendar";
import { Dropdown } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import CrearControlEvolucion from "../ControlEvolucion/CrearControlEvolucion";
import "../../style/Main.css";

function TratamientosEspecif(props) {
  const hoy = moment(new Date()).format("YYYY-MM-DD");
  const [tratamientos, setTratamientos] = useState([]);
  const [search, setSearch] = useState("");
  const [modalShowCrearTratamiento, setModalShowCrearTratamiento] = useState(false);
  const [modalShowEditTratamiento, setModalShowEditTratamiento] = useState(false);
  const [modalShowVerNotas, setModalShowVerNotas] = useState(false);
  const [order, setOrder] = useState("ASC");
  const [tratamiento, setTratamiento] = useState([]);
  const [idParam, setIdParam] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [noHayPacientes, setNoHayPacientes] = useState(false);

  const [estadoTratamiento, setEstadoTratamiento] = useState([]);
  const [estadoPago, setEstadoPago] = useState([]);

  const tratamientosCollectiona = collection(db, "tratamientos");
  const tratamientosCollection = useRef(
    query(tratamientosCollectiona, orderBy("codigo", "desc"))
  );

  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [mostrarVer, setMostrarVer] = useState(true);

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
  const [, setTaparFiltro] = useState(false);

  const [mostrarModalEditarCobro, setMostrarModalEditarCobro] = useState(false);
  const [indexParaEditcobro, setIndexParaEditcobro] = useState("");
  const [fechaEditCobro, setFechaEditCobro] = useState("");
  const [nroComprobanteEditCobro, setNroComprobanteEditCobro] = useState("");
  const [importeEditCobro, setImporteEditCobro] = useState("");
  const [idParaEditcobro, setIdParaEditcobro] = useState("");

  const [codigoCobro, setCodigoCobro] = useState("");
  const [trataCobro, setTrataCobro] = useState("");
  const [pacienteCobro, setPacienteCobro] = useState("");
  const [fechaCobro, setFechaCobro] = useState("");
  const [nroComprobanteCobro, setNroComprobanteCobro] = useState("");
  const [importeCobro, setImporteCobro] = useState("");
  const [idParaCobro, setIdParaCobro] = useState("");
  const [restoCobro, setRestoCobro] = useState("");
  const [pagoFinalizado, setPagoFinalizado] = useState(false);
  const [mostrarModalAgregarCobro, setMostrarModalAgregarCobro] = useState(false);
  const [modalShowCrearControl, setModalShowCrearControl] = useState(false);

  const estadosTratamientoCollectiona = collection(db, "estadosTratamientos");
  const estadosTratamientoCollection = useRef(query(estadosTratamientoCollectiona));

  const estadosPagoCollectiona = collection(db, "estadoPago");
  const estadosPagoCollection = useRef(query(estadosPagoCollectiona));

  const ocultarTabla = (codigo) => {
    if (mostrarTabla) {
      setMostrarTabla(false);
      setSearch("");
      setMostrarVer(true);
    } else {
      setSearch(codigo);
      setMostrarTabla(true);
      setMostrarVer(false);
    }
  };

  const buscarEstilos = (estadoParam) => {
    const colorEncontrado = estadoTratamiento.find((e) => e.name === estadoParam);
    if (colorEncontrado && colorEncontrado.color !== "") {
      return { backgroundColor: colorEncontrado.color, marginBottom: "0" };
    };
  }

  const buscarEstilosPago = (estadoParam) => {
    const colorEncontrado = estadoPago.find((e) => e.name === estadoParam);
    if (colorEncontrado && colorEncontrado.color !== "") {
      return { backgroundColor: colorEncontrado.color, marginBottom: "0" };
    };
  }

  const getTratamientos = useCallback((snapshot) => {
    const tratamientosArray = snapshot.docs
      .filter((doc) => doc.data().idPaciente === props.id)
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    setTratamientos(tratamientosArray);
    if (tratamientosArray.length === 0) {
      setNoHayPacientes(true)
    } else {
      setNoHayPacientes(false)
    }
    setIsLoading(false);
  }, [props.id]);

  const getEstadoTratamientos = useCallback((snapshot) => {
    const estadoTratamientoArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEstadoTratamiento(estadoTratamientoArray);
  }, []);

  const getEstadoPago = useCallback((snapshot) => {
    const estadoPagoArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEstadoPago(estadoPagoArray);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      tratamientosCollection.current,
      getTratamientos
    );
    const unsubscribeEstados = onSnapshot(
      estadosTratamientoCollection.current,
      getEstadoTratamientos
    );
    const unsubscribeEstadosPago = onSnapshot(
      estadosPagoCollection.current,
      getEstadoPago
    );

    return () => {
      unsubscribe();
      unsubscribeEstados();
      unsubscribeEstadosPago();
    };
  }, [getTratamientos, getEstadoTratamientos, getEstadoPago]);

  useEffect(() => {
    const hoy = new Date();

    const actualizarEstadoPago = async (tratamiento) => {
      const fechaVencimientoBase = tratamiento.fechaVencimiento;
      const tratamientoRef = doc(tratamientosCollectiona, tratamiento.id);

      let fechaVencimiento;
      if (fechaVencimientoBase && restoCobro > 0 && fechaVencimientoBase !== "" && fechaVencimientoBase !== null && fechaVencimientoBase !== undefined) {
        fechaVencimiento = new Date(tratamiento.fechaVencimiento)
        if (fechaVencimiento > hoy && tratamiento.estadoPago !== "Cancelado") {
          await updateDoc(tratamientoRef, {
            estadoPago: "Programado",
          });
        } else if (fechaVencimiento <= hoy && tratamiento.estadoPago !== "Cancelado") {
          await updateDoc(tratamientoRef, {
            estadoPago: "Vencido",
          });
        }
      }
      if (restoCobro > 0 && tratamiento.estadoPago === "Cancelado") {
        await updateDoc(tratamientoRef, {
          estadoPago: "Pendiente",
        });
      }
    };

    tratamientos.forEach((tratamiento) => {
      actualizarEstadoPago(tratamiento);
    });
  }, [tratamientos, tratamientosCollectiona, restoCobro]);

  const deletetratamiento = async (id) => {
    const tratamientoDoc = doc(db, "tratamientos", id);
    await deleteDoc(tratamientoDoc);
    setTratamientos((prevTratamientos) =>
      prevTratamientos.filter((tratamiento) => tratamiento.id !== id)
    );
  };

  const searcher = (e) => {
    if (typeof e === "string") {
      setSearch(e);
    } else {
      setSearch(e.target.value);
    }
  };

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

  var results;
  if (!search) {
    results = tratamientos;
  } else {
    if (typeof search === "object") {
      results = tratamientos.filter((dato) => {
        const fecha = moment(dato.fecha).format("YYYY-MM-DD");
        return fecha >= search.fechaInicio && fecha <= search.fechaFin;
      });
    } else {
      if (
        search.toString().length === 10 &&
        search.charAt(4) === "-" &&
        search.charAt(7) === "-"
      ) {
        results = tratamientos.filter(
          (dato) => dato.fecha === search.toString()
        );
      } else {
        if (search.toString().length === 1 && !isNaN(search)) {
          results = tratamientos.filter((dato) => dato.codigo === search);
        } else {
          if (
            filtroBusqueda &&
            tratamientos.some(
              (tratamiento) =>
                tratamiento[filtroBusqueda]?.includes(search) &&
                tratamiento[filtroBusqueda] !== "" &&
                tratamiento[filtroBusqueda] !== undefined &&
                tratamiento[filtroBusqueda] !== null
            )
          ) {
            results = tratamientos.filter(
              (dato) =>
                dato[filtroBusqueda]?.includes(search) &&
                dato[filtroBusqueda] !== "" &&
                dato[filtroBusqueda] !== undefined &&
                dato[filtroBusqueda] !== null
            );
          } else {
            results = tratamientos.filter(
              (dato) =>
                dato.apellidoConNombre.toLowerCase().includes(search) ||
                dato.idc.toString().includes(search.toString())
            );
          }
        }
      }
    }
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
      case "tarifasTratamientos":
        setTituloParametroModal("Por Tratamiento");
        break;
      case "estadoPago":
        setTituloParametroModal("Por Estado Pago");
        break;
      case "fecha":
        setTituloParametroModal("Por Fecha");
        break;
      case "estadosTratamientos":
        setTituloParametroModal("Por Estado Tratamiento");
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

  const clearFieldsEditarCobro = () => {
    setMostrarModalEditarCobro([false, "", "", ""]);
    setIndexParaEditcobro("");
    setIdParaCobro("");
    setFechaEditCobro("");
    setNroComprobanteEditCobro("");
    setImporteEditCobro("");
  };

  const clearFieldsCobro = () => {
    setFechaCobro("");
    setNroComprobanteCobro("");
    setImporteCobro("");
  };

  const guardarCobro = async (e, id) => {
    e.preventDefault();
    try {
      const tratamientoRef = doc(db, "tratamientos", id);
      const tratamientoDoc = await getDoc(tratamientoRef);
      const tratamientoData = tratamientoDoc.data();

      const fechaCobroArray = tratamientoData.cobrosManuales.fechaCobro || [];
      const nroComprobanteArray = tratamientoData.cobrosManuales.nroComprobanteCobro || [];
      const codigoTratamientoArray = tratamientoData.cobrosManuales.codigoTratamiento || [];
      const importeAbonadoArray =
        tratamientoData.cobrosManuales.importeAbonado || [];
      const tratamientoCobroArray =
        tratamientoData.cobrosManuales.tratamientoCobro || [];
      const pacienteCobroArray =
        tratamientoData.cobrosManuales.pacienteCobro || [];

      fechaCobroArray.push(fechaCobro);
      nroComprobanteArray.push(nroComprobanteCobro);
      codigoTratamientoArray.push(codigoCobro);
      importeAbonadoArray.push(importeCobro);
      tratamientoCobroArray.push(trataCobro);
      pacienteCobroArray.push(pacienteCobro);

      if (tratamientoDoc.exists()) {
        await updateDoc(tratamientoRef, {
          "cobrosManuales.fechaCobro": fechaCobroArray,
          "cobrosManuales.nroComprobanteCobro": nroComprobanteArray,
          "cobrosManuales.importeAbonado": importeAbonadoArray,
          "cobrosManuales.tratamientoCobro": tratamientoCobroArray,
          "cobrosManuales.codigoTratamiento": codigoTratamientoArray,
          "cobrosManuales.pacienteCobro": pacienteCobroArray,
        });
      }
      let resto = (restoCobro - importeCobro);
      setRestoCobro(resto);
      actualizarDatosConRestoCobro(id, resto);
      setMostrarModalAgregarCobro([false, ""]);
    } catch (e) {
      window.alert(
        "Hubo inconvenientes al tratar de agregar su cobro. Intentelo más tarde" +
        e +
        e.message
      );
    }
  };

  useEffect(() => {
    if (restoCobro === 0) {
      setPagoFinalizado(true);
    } else {
      setPagoFinalizado(false);
    }
  }, [restoCobro]);

  const eliminarCobro = async (e, id, index) => {
    e.preventDefault();
    try {
      const tratamientoRef = doc(db, "tratamientos", id);
      const tratamientoDoc = await getDoc(tratamientoRef);
      const tratamientoData = tratamientoDoc.data();

      const fechaCobroArray = tratamientoData.cobrosManuales.fechaCobro;
      const nroComprobanteArray = tratamientoData.cobrosManuales.nroComprobanteCobro;
      const importeAbonadoArray = tratamientoData.cobrosManuales.importeAbonado;
      const tratamientoCobroArray =
        tratamientoData.cobrosManuales.tratamientoCobro;
      const codigoTratamientoArray =
        tratamientoData.cobrosManuales.codigoTratamiento;
      const pacienteCobroArray = tratamientoData.cobrosManuales.pacienteCobro;

      const nuevaFechaCobroArray = eliminarPosicionArray(
        fechaCobroArray,
        index
      );
      const nuevoNroComprobanteArray = eliminarPosicionArray(
        nroComprobanteArray,
        index
      );
      const nuevoImporteAbonadoArray = eliminarPosicionArray(
        importeAbonadoArray,
        index
      );
      const nuevoTratamientoCobroArray = eliminarPosicionArray(
        tratamientoCobroArray,
        index
      );
      const nuevoCodigoTratamientoArray = eliminarPosicionArray(
        codigoTratamientoArray,
        index
      );
      const nuevoPacienteCobroArray = eliminarPosicionArray(
        pacienteCobroArray,
        index
      );

      if (tratamientoDoc.exists()) {
        await updateDoc(tratamientoRef, {
          "cobrosManuales.fechaCobro": nuevaFechaCobroArray,
          "cobrosManuales.nroComprobanteCobro": nuevoNroComprobanteArray,
          "cobrosManuales.importeAbonado": nuevoImporteAbonadoArray,
          "cobrosManuales.tratamientoCobro": nuevoTratamientoCobroArray,
          "cobrosManuales.codigoTratamiento": nuevoCodigoTratamientoArray,
          "cobrosManuales.pacienteCobro": nuevoPacienteCobroArray,
        });
      }
      let resto = (tratamientoData.precio - nuevoImporteAbonadoArray.reduce((total, importe) => total + Number(importe), 0));
      setRestoCobro(resto);
      actualizarDatosConRestoCobro(id, resto)

    } catch (e) {
      window.alert(
        "Hubo inconvenientes al tratar de eliminar  su cobro. Intentelo más tarde" +
        e +
        e.message
      );
    }
  };

  const editarCobro = async (e) => {
    e.preventDefault();
    try {
      const tratamientoRef = doc(db, "tratamientos", idParaEditcobro);
      const tratamientoDoc = await getDoc(tratamientoRef)
      const tratamientoData = tratamientoDoc.data();

      const fechaCobroArray = tratamientoData.cobrosManuales.fechaCobro;
      const nroComprobanteArray = tratamientoData.cobrosManuales.nroComprobanteCobro;
      const importeCobroArray = tratamientoData.cobrosManuales.importeAbonado;
      const tratamientoCobroArray = tratamientoData.cobrosManuales.tratamientoCobro;
      const codigoTratamientoArray = tratamientoData.cobrosManuales.codigoTratamiento;
      const pacienteCobroArray = tratamientoData.cobrosManuales.pacienteCobro;

      fechaCobroArray[indexParaEditcobro] = fechaEditCobro || fechaCobroArray[indexParaEditcobro];
      nroComprobanteArray[indexParaEditcobro] = nroComprobanteEditCobro || nroComprobanteArray[indexParaEditcobro];
      importeCobroArray[indexParaEditcobro] = importeEditCobro || importeCobroArray[indexParaEditcobro];
      tratamientoCobroArray[indexParaEditcobro] = trataCobro;
      codigoTratamientoArray[indexParaEditcobro] = codigoCobro;
      pacienteCobroArray[indexParaEditcobro] = pacienteCobro;


      if (tratamientoDoc.exists()) {
        await updateDoc(tratamientoRef, {
          "cobrosManuales.fechaCobro": fechaCobroArray,
          "cobrosManuales.nroComprobanteCobro": nroComprobanteArray,
          "cobrosManuales.importeAbonado": importeCobroArray,
          "cobrosManuales.tratamientoCobro": tratamientoCobroArray,
          "cobrosManuales.codigoTratamiento": codigoTratamientoArray,
          "cobrosManuales.pacienteCobro": pacienteCobroArray,
        });
      }
      let resto = (tratamientoData.precio - importeCobroArray.reduce((total, importe) => total + Number(importe), 0));
      setRestoCobro(resto);
      actualizarDatosConRestoCobro(idParaEditcobro, resto);
      clearFieldsEditarCobro();
    } catch (e) {
      window.alert("Hubo inconvenientes al tratar de Editar su cobro. Intentelo más tarde" + e + e.message)
    }
  };

  const eliminarPosicionArray = (array, index) => {
    if (index < 0 || index >= array.length) {
      return array;
    }
    return array.filter((_, i) => i !== index);
  };


  const actualizarDatosConRestoCobro = async (tratamientoID, resto) => {
    if (resto === 0 || resto < 0) {
      const tratamientoRef = doc(db, "tratamientos", tratamientoID);
      await updateDoc(tratamientoRef, {
        estadoPago: "Cancelado",
        fechaVencimiento: ""
      });
    }
  }

  useEffect(() => {
    if (fechaCobro === "") {
      setFechaCobro(hoy);
    }
  }, [fechaCobro, hoy]);

  return (
    <>
      <div className="mainpage">
        {isLoading ? (
          <span className="loader position-absolute start-50 top-50 mt-3"></span>
        ) : (
          <>
            {noHayPacientes ? (
              !props.id ? (
                <div className="container mt-2 mw-100" >
                  <div className="row">
                    <h1>No se ha seleccionado un Paciente.</h1>
                  </div>
                </div>
              ) : (
                <div className="container mt-2 mw-100" >
                  <div className="row">
                    <h1>Este paciente no ha realizado Tratamientos aún</h1>
                    <button
                      variant="primary"
                      className="btn-blue w-25 m-auto mt-5"
                      onClick={() => setModalShowCrearTratamiento(true)}
                    >
                      Crear Nuevo Tratamiento
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="w-100">
                <div className="container mt-2 mw-100">
                  <div className="row">
                    <div className="col">
                      <br></br>
                      <div className="d-flex justify-content-between">
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ maxHeight: "34px" }}
                        >
                          <h3>Tratamientos Realizados por este Paciente</h3>
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
                          <input
                            value={search}
                            onChange={searcher}
                            type="text"
                            className="form-control m-2 w-25"
                            style={{ display: "none" }}
                          />
                        </div>
                        <button
                          variant="primary"
                          className="btn-blue m-2"
                          onClick={() => {
                            setModalShowFiltros(true);
                            setQuitarFiltro(true);
                          }}
                        >
                          Filtros
                        </button>
                        {quitarFiltro && (
                          <button
                            variant="primary"
                            className="btn-blue m-2"
                            onClick={() => {
                              setSearch("");
                              setQuitarFiltro(false);
                            }}
                          >
                            Limpiar Filtros
                          </button>
                        )}
                        <button
                          variant="primary"
                          className="btn-blue m-2"
                          onClick={() => setModalShowCrearTratamiento(true)}
                        >
                          Nuevo
                        </button>
                      </div>
                      <div className="d-flex justify-content-between">
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


                        <Modal
                          show={modalShowFiltros}
                          onHide={() => {
                            setSelectedCheckbox("");
                            setParametroModal("");
                            setSelectedCheckbox2("");
                          }}
                        >
                          <Modal.Header
                            closeButton
                            onClick={() => {
                              setModalShowFiltros(false);
                              setSelectedCheckbox("");
                              setSelectedCheckbox2("");
                              setParametroModal("");
                              setQuitarFiltro(false);
                            }}
                          >
                            <Modal.Title>
                              <h1 style={{ fontWeight: "bold" }}>
                                Filtros Generales
                              </h1>
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
                              <label className="checkbox-label">
                                <input
                                  type="checkbox"
                                  name="tarifasTratamientos"
                                  checked={
                                    selectedCheckbox === "tarifasTratamientos"
                                  }
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
                                  checked={
                                    selectedCheckbox === "estadosTratamientos"
                                  }
                                  onChange={handleCheckboxChange}
                                />
                                Filtrar Por Estado Tratamiento
                              </label>
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              variant="primary"
                              onClick={() => {
                                setSelectedCheckbox(selectedCheckbox);
                                handleTituloModal(selectedCheckbox);
                                setModalShowFiltros2(true);
                                setModalShowFiltros(false);
                              }}
                            >
                              Seleccionar y Continuar
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
                              setSelectedCheckbox("");
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
                              {tratamientos
                                .map((tratamiento) => tratamiento[parametroModal])
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
                                setModalShowFiltros(true);
                                handleTituloModal("");
                                setModalShowFiltros2(false);
                                setSelectedCheckbox("");
                                setSelectedCheckbox2("");
                                setParametroModal("");
                              }}
                            >
                              Volver
                            </Button>
                            <Button
                              variant="primary"
                              onClick={() => {
                                searcher(selectedCheckbox2);
                                setModalShowFiltros2(false);
                                setParametroModal("");
                                setTituloParametroModal("");
                                setSelectedCheckbox("");
                                setSelectedCheckbox2("");
                              }}
                            >
                              Aplicar Filtro
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </div>

                      <table className="table__body">
                        <thead>
                          <tr>
                            <th>N°</th>
                            <th onClick={() => sorting("tarifasTratamientos")}>
                              Tratamiento
                            </th>
                            <th onClick={() => sorting("pieza")}>Pieza</th>
                            <th onClick={() => sorting("precio")}>Precio</th>
                            <th onClick={() => sorting("formaPago")}>Forma Pago</th>
                            <th onClick={() => sorting("fecha")}>Fecha</th>
                            <th onClick={() => sorting("fechaVencimiento")}>Fecha Vto</th>
                            <th onClick={() => sorting("estadoPago")}>Estado Pago</th>
                            <th onClick={() => sorting("estadosTratamientos")}>
                              Estado Tratamiento
                            </th>
                            <th id="columnaAccion"></th>
                          </tr>
                        </thead>

                        <tbody>
                          {results.map((tratamiento, index) => (
                            <tr key={tratamiento.id}>
                              <td>{results.length - index}</td>
                              <td> {tratamiento.tarifasTratamientos} </td>
                              <td> {tratamiento.pieza} </td>
                              <td> {tratamiento.precio} </td>
                              <td> {tratamiento.formaPago} </td>
                              <td>{moment(tratamiento.fecha).format("DD/MM/YY")}</td>
                              <td>{tratamiento.fechaVencimiento !== '' && (
                                moment(tratamiento.fechaVencimiento).format("DD/MM/YY")
                              )}
                              </td>
                              <td>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  {tratamiento.estadoPago || ""}
                                  {tratamiento.estadoPago && (
                                    <p
                                      style={buscarEstilosPago(tratamiento.estadoPago)}
                                      className="color-preview justify-content-center align-items-center"
                                    ></p>

                                  )}
                                  <ListaSeleccionEstadoPago
                                    tratamientoId={tratamiento.id}
                                  />
                                </div>
                              </td>

                              <td>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  {tratamiento.estadosTratamientos || ""}
                                  {tratamiento.estadosTratamientos && (
                                    <p
                                      style={buscarEstilos(tratamiento.estadosTratamientos)}
                                      className="color-preview justify-content-center align-items-center"
                                    ></p>

                                  )}
                                  <ListaSeleccionEstadoTratamiento
                                    tratamientoId={tratamiento.id}
                                  />
                                </div>
                              </td>

                              <td id="columnaAccion">
                                <Dropdown>
                                  <Dropdown.Toggle
                                    variant="primary"
                                    className="btn btn-secondary mx-1 btn-md"
                                    id="dropdown-actions"
                                  >
                                    <i className="fa-solid fa-ellipsis-vertical"></i>
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu>
                                    {mostrarVer && (
                                      <Dropdown.Item
                                        onClick={() => {
                                          ocultarTabla(tratamiento.codigo);
                                          setIdParaCobro(tratamiento.id);
                                          setCodigoCobro(tratamiento.cta);
                                          setTrataCobro(
                                            tratamiento.tarifasTratamientos
                                          );
                                          setPacienteCobro(
                                            tratamiento.apellidoConNombre
                                          );
                                          let resto = (
                                            tratamiento.precio -
                                            tratamiento.cobrosManuales.importeAbonado.reduce(
                                              (total, importe) =>
                                                total + Number(importe),
                                              0
                                            )
                                          );
                                          setRestoCobro(resto);
                                          actualizarDatosConRestoCobro(tratamiento.id, resto)
                                        }}
                                      >
                                        <i className="fa-regular fa-eye"></i> Ver
                                      </Dropdown.Item>
                                    )}
                                    {!mostrarVer && (
                                      <Dropdown.Item
                                        onClick={() => {
                                          ocultarTabla("");
                                          clearFieldsCobro("");
                                        }}
                                      >
                                        <i className="fa-regular fa-eye-slash"></i>{" "}
                                        Ocultar
                                      </Dropdown.Item>
                                    )}
                                    <Dropdown.Item
                                      onClick={() => {
                                        setModalShowEditTratamiento(true);
                                        setTratamiento(tratamiento);
                                        setIdParam(tratamiento.id);
                                      }}
                                    >
                                      <i className="fa-regular fa-pen-to-square"></i>{" "}
                                      Editar
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      onClick={() => {
                                        setModalShowVerNotas([
                                          true,
                                          tratamiento.notas,
                                        ]);
                                      }}
                                    >
                                      <i className="fa-regular fa-comment"></i> Ver
                                      Notas
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => {
                                      props.openControlYEvolucion(3, tratamiento)
                                    }}
                                    >
                                      <i className="fa-solid fa-chart-line"></i> Evolucionar
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      onClick={() =>
                                        deletetratamiento(tratamiento.id)
                                      }
                                    >
                                      <i className="fa-solid fa-trash-can"></i>{" "}
                                      Eliminar
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {modalShowVerNotas[0] && (
                        <Modal
                          show={modalShowVerNotas[0]}
                          size="lg"
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
                      <br></br>
                      {mostrarTabla && (
                        <div style={{ marginTop: "30px" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <h4 style={{ textAlign: "left", marginRight: "10px" }}>
                              Pagos
                            </h4>
                            <h4>Saldo Restante: {restoCobro}</h4>
                          </div>

                          <table className="table__body">
                            <thead>
                              <tr>
                                <th>N°</th>
                                <th>Fecha Cobro</th>
                                <th>Nro Comprobante</th>
                                <th>Importe abonado</th>
                                <th>Accion</th>
                                <th>
                                  {!pagoFinalizado && (
                                    <button
                                      className="btn btn-secondary mx-1 btn-md"
                                      onClick={() => {
                                        setMostrarModalAgregarCobro([
                                          true,
                                          idParaCobro,
                                        ]);
                                      }}
                                    >
                                      <i className="fa-solid fa-circle-plus"></i>
                                    </button>
                                  )}
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {results.map((tratamiento) => (
                                tratamiento.cobrosManuales.fechaCobro.map((_, index) => {
                                  const fecha = tratamiento.cobrosManuales.fechaCobro[index] || "";
                                  const importe = tratamiento.cobrosManuales.importeAbonado[index] || "";
                                  const nroComprobante = tratamiento.cobrosManuales.nroComprobanteCobro[index] || "";

                                  return (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>{moment(fecha.toString()).format("DD/MM/YY")}</td>
                                      <td>{nroComprobante.toString()}</td>
                                      <td>{importe.toString()}</td>
                                      <td>
                                        {tratamiento.cobrosManuales.fechaCobro[0] !== "" && (
                                          <>
                                            <button
                                              variant="primary"
                                              className="btn btn-secondary sm-1"
                                              onClick={(e) => {
                                                setIndexParaEditcobro(index)
                                                setIdParaEditcobro(idParaCobro)
                                                setMostrarModalEditarCobro([true, fecha, importe, nroComprobante]);
                                              }}
                                              style={{ margin: "1px" }}
                                            >
                                              <i className="fa-regular fa-pen-to-square"></i>
                                            </button>
                                            <button
                                              variant="primary"
                                              className="btn btn-danger sm-1"
                                              onClick={(e) => {
                                                eliminarCobro(e, idParaCobro, index);
                                              }}
                                              style={{ margin: "1px" }}
                                            >
                                              <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                          </>
                                        )}
                                      </td>
                                      <td>
                                        <i className="fa-solid fa-download"></i>
                                      </td>
                                    </tr>
                                  );
                                })
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <CreateTratamiento
        id={props.id}
        show={modalShowCrearTratamiento}
        onHide={() => setModalShowCrearTratamiento(false)} />
      <CrearControlEvolucion
        tratamiento={tratamiento}
        show={modalShowCrearControl}
        onHide={() => setModalShowCrearControl(false)} />
      <EditTratamiento
        id={idParam}
        tratamiento={tratamiento}
        show={modalShowEditTratamiento}
        onHide={() => setModalShowEditTratamiento(false)}
      />
      {
        mostrarModalAgregarCobro[0] && (
          <Modal
            show={mostrarModalAgregarCobro[0]}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header
              closeButton
              onClick={() => {
                setMostrarModalAgregarCobro([false, ""]);
                clearFieldsCobro();
              }}
            >
              <Modal.Title>Agregar Cobro</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container">
                <div className="col">
                  <form>
                    <div className="row">
                      <div className="col mb-6">
                        <label className="form-label">Fecha Cobro</label>
                        <input
                          value={hoy}
                          onChange={(e) => setFechaCobro(e.target.value)}
                          type="date"
                          className="form-control"
                          autoComplete="off"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col mb-6">
                        <label className="form-label">Nro Comprobante</label>
                        <input
                          onChange={(e) => setNroComprobanteCobro(e.target.value)}
                          type="text"
                          className="form-control"
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col mb-6">
                        <label className="form-label">Importe Cobro</label>
                        <input
                          onChange={(e) => setImporteCobro(e.target.value)}
                          type="number"
                          className="form-control"
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div style={{ display: "flex" }}>
                <button
                  type="submit"
                  onClick={(e) => {
                    guardarCobro(e, mostrarModalAgregarCobro[1]);
                  }}
                  className="btn btn-primary"
                >
                  Guardar Cobro
                </button>
              </div>
            </Modal.Footer>
          </Modal>)
      }

      {
        mostrarModalEditarCobro[0] && (
          <Modal show={mostrarModalEditarCobro[0]} size="lg" aria-labelledby="contained-modal-title-vcenter" centered >
            <Modal.Header closeButton onClick={() => { clearFieldsEditarCobro() }}>
              <Modal.Title>Editar Cobro</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container">
                <div className="col">
                  <form>
                    <div className="row">
                      <div className="col mb-6">
                        <label className="form-label">Fecha Cobro</label>
                        <input
                          defaultValue={mostrarModalEditarCobro[1]}
                          onChange={(e) => setFechaEditCobro(e.target.value)}
                          type="date"
                          className="form-control"
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col mb-6">
                        <label className="form-label">Nro Comprobante</label>
                        <input
                          defaultValue={mostrarModalEditarCobro[3]}
                          onChange={(e) => setNroComprobanteEditCobro(e.target.value)}
                          type="text"
                          className="form-control"
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col mb-6">
                        <label className="form-label">Importe Cobro</label>
                        <input
                          defaultValue={mostrarModalEditarCobro[2]}
                          onChange={(e) => setImporteEditCobro(e.target.value)}
                          type="number"
                          className="form-control"
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div style={{ display: "flex" }}>
                <button
                  type="submit"
                  onClick={(e) => { editarCobro(e) }}
                  className="btn btn-primary"
                >
                  Editar Cobro
                </button>
              </div>
            </Modal.Footer>
          </Modal>)
      }
    </>
  );
}

export default TratamientosEspecif;
