import React from "react";
import { collection, deleteDoc, doc, query, orderBy, } from "firebase/firestore";
import { useState, useEffect, useCallback, useRef } from "react";
import { db } from "../../firebaseConfig/firebase";
import { onSnapshot } from "firebase/firestore";
import CreateCita from "./CreateCita";
import Navigation from "../Navigation";
import "../Pacientes/Show.css";
import EditCita from "./EditCita";
import Estados from "./Estados";
import HorariosAtencionCitas from "./HorariosAtencionCitas";
import "../Utilidades/loader.css";
import "../Utilidades/tablas.css";
import moment from 'moment';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Modal, Button } from "react-bootstrap";


function Citas() {
  const [citas, setCitas] = useState([]);
  const [search, setSearch] = useState("");
  const [modalShowCita, setModalShowCita] = useState(false);
  const [modalShowEditCita, setModalShowEditCita] = useState(false);
  const [cita, setCita] = useState([]);
  const [idParam, setIdParam] = useState("");
  const [order, setOrder] = useState("ASC");
  const [modalShowEstados, setModalShowEstados] = useState(false);
  const [modalShowHorarios, setModalShowHorarios] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contador, setContador] = useState(0);
  const [estados, setEstados] = useState([]);
  const [mostrarAjustes, setMostrarAjustes] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const estadosCollectiona = collection(db, "estados");
  const estadosCollection = useRef(query(estadosCollectiona))

  const citasCollection = collection(db, "citas");
  const citasCollectionOrdenados = useRef(query(citasCollection, orderBy("fecha", "desc")));

  const getCitas = useCallback((snapshot) => {
    const citasArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    citasArray.sort((a, b) => {
      if (a.fecha === b.fecha) {
        return b.horaInicio.localeCompare(a.horaInicio);
      } else {
        return b.fecha.localeCompare(a.fecha);
      }
    });
    setCitas(citasArray);
    setIsLoading(false);
  }, []);

  const getEstados = useCallback((snapshot) => {
    const estadosArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEstados(estadosArray);
  }, []);

  const buscarEstilos = (estadoParam) => {
    const colorEncontrado = estados.find((e) => e.name === estadoParam);
    switch (colorEncontrado.color) {
      case "yellow":
        return { backgroundColor: "#f7e172" };
      case "red":
        return { backgroundColor: "#de4747" };
      case "green":
        return { backgroundColor: "#86e49d" };
      case "blue":
        return { backgroundColor: "#6fcaea" };
      case "orange":
        return { backgroundColor: "#f5b04e" };
      case "purple":
        return { backgroundColor: "#5f5fad", color: "#fff" };
      case "grey":
        return { backgroundColor: "#89898c" };
      default:
        return {};
    }
  };

  useEffect(() => {
    const unsubscribeCitas = onSnapshot(citasCollectionOrdenados.current, (snapshot) => {
      getCitas(snapshot);
      const citasPorConfirmar = snapshot.docs.filter(
        (doc) => doc.data().estado === "Por Confirmar"
      );
      setContador(citasPorConfirmar.length);
    });

    const unsubscribeEstados = onSnapshot(estadosCollection.current, getEstados);

    return () => {
      unsubscribeCitas();
      unsubscribeEstados();
    };
  }, [getCitas, getEstados]);


  function funcMostrarAjustes() {
    if (mostrarAjustes) {
      setMostrarAjustes(false);
    } else {
      setMostrarAjustes(true);
    }
  };


  const deleteCita = async (id) => {
    const citaDoc = doc(db, "citas", id);
    await deleteDoc(citaDoc);
    setCitas((prevCitas) => prevCitas.filter((cita) => cita.id !== id));
  };


  const searcher = (e) => {
    setSearch(e.target.value);
  };

  var results = !search
    ? citas
    : search.toString().length === 10 && search.charAt(4) === "-" && search.charAt(7) === "-"
      ? (
        citas.filter((dato) => dato.fecha === search.toString())
      )
      : (
        citas.filter((dato) =>
          dato.apellidoConNombre.toLowerCase().includes(search) ||
          dato.idc.toString().includes(search.toString())
        )
      );

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...citas].sort((a, b) => {
        const valueA = typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
        const valueB = typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
        return valueA > valueB ? 1 : -1;
      });
      setCitas(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...citas].sort((a, b) => {
        const valueA = typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
        const valueB = typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
        return valueA < valueB ? 1 : -1;
      });
      setCitas(sorted);
      setOrder("ASC");
    }
  };

  return (
    <>
      <div className="mainpage">
        <Navigation />
        {isLoading ? (
          <span className="loader position-absolute start-50 top-50 mt-3"></span>
        ) : (
          <div className="container mt-2 mw-100">
            <div className="row">
              <div className="col">
                <div className="d-grid gap-2">
                  <div className="d-flex justify-content-between">
                    <div className="d-flex justify-content-center align-items-center" style={{ maxHeight: "40px" }}>
                      <h1>Agenda</h1>
                      <button
                        className="btn btn-dark mx-2 btn-sm"
                        style={{ borderRadius: "5px" }}
                        onClick={() => {
                          funcMostrarAjustes(true);
                        }}
                      >
                        <i className="fa-solid fa-gear"></i>
                      </button>
                    </div>
                    <label>Citas Por Confirmar: {contador}</label>
                  </div>

                  <div className="d-flex justify-content-between">
                    <input
                      value={search}
                      onChange={searcher}
                      type="text"
                      placeholder="Buscar por Apellido, Nombre o DNI..."
                      className="form-control m-2 w-25"
                    />

                    <button
                      variant="primary"
                      className="btn btn-success mx-1 btn-md"
                      style={{ borderRadius: "20px", justifyItems: "center", maxHeight: "50px" }}
                      onClick={() => setModalShow(true)}
                    >
                      <i className="fa-regular fa-calendar-check" style={{ transform: "scale(1.4)" }}></i>
                    </button>

                    <Modal show={modalShow} onHide={() => setModalShow(false)}>
                      <Modal.Header closeButton onClick={() => {
                        setModalShow(false);
                        setSelectedDate("");
                      }}>
                        <Modal.Title>Seleccione una fecha para filtrar:</Modal.Title>
                      </Modal.Header>
                      <Modal.Body style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Calendar onChange={(date) => {
                          const formattedDate = moment(date).format('YYYY-MM-DD');
                          setSelectedDate(formattedDate);
                        }} value={selectedDate} />
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="primary" onClick={() => {setSearch(selectedDate); setModalShow(false)}}>
                          Filtrar
                        </Button>
                      </Modal.Footer>
                    </Modal>



                    <div className="col d-flex justify-content-end">
                      <button
                        variant="primary"
                        className="btn-blue m-2"
                        onClick={() => setModalShowCita(true)}
                      >
                        Agregar Cita
                      </button>
                      {mostrarAjustes && (
                        <div className="d-flex">
                          <button
                            variant="secondary"
                            className="btn-blue m-2"
                            onClick={() => setModalShowEstados(true)}
                          >
                            Estados
                          </button>
                          <button
                            variant="tertiary"
                            className="btn-blue m-2"
                            onClick={() => setModalShowHorarios(true)}
                          >
                            Horarios Atencion
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <table className="table__body">
                  <thead>
                    <tr>
                      <th onClick={() => sorting("fecha")}>Fecha</th>
                      <th onClick={() => sorting("horaInicio")}>Hora Inicio</th>
                      <th onClick={() => sorting("horaFin")}>Hora Fin</th>
                      <th onClick={() => sorting("apellidoConNombre")}>Apellido y Nombres</th>
                      <th onClick={() => sorting("idc")}>DNI</th>
                      <th onClick={() => sorting("estado")}>Estado</th>
                      <th onClick={() => sorting("numero")}>Telefono</th>
                      <th>Notas</th>
                      <th>Accion</th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((cita) => (
                      <tr key={cita.id}>
                        <td>{moment(cita.fecha).format('DD/MM/YY')}</td>
                        <td> {cita.horaInicio} </td>
                        <td> {cita.horaFin} </td>
                        <td> {cita.apellidoConNombre} </td>
                        <td> {cita.idc} </td>
                        <td> <p style={buscarEstilos(cita.estado)} className="status">{cita.estado}</p></td>
                        <td> {cita.numero} </td>
                        <td> {cita.comentario} </td>
                        <td>
                          <button
                            variant="primary"
                            className="btn btn-success mx-1"
                            onClick={() => {
                              setModalShowEditCita(true);
                              setCita(cita);
                              setIdParam(cita.id);
                            }}
                          >
                            <i className="fa-regular fa-pen-to-square"></i>
                          </button>
                          <button
                            onClick={() => {
                              deleteCita(cita.id);
                            }}
                            className="btn btn-danger"
                          >
                            {" "}
                            <i className="fa-solid fa-trash-can"></i>{" "}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div >
      <CreateCita show={modalShowCita} onHide={() => setModalShowCita(false)} />
      <EditCita
        id={idParam}
        cita={cita}
        show={modalShowEditCita}
        onHide={() => setModalShowEditCita(false)}
      />
      <Estados
        show={modalShowEstados}
        onHide={() => setModalShowEstados(false)}
      />
      <HorariosAtencionCitas
        show={modalShowHorarios}
        onHide={() => setModalShowHorarios(false)}
      />
    </>
  );
}

export default Citas;
