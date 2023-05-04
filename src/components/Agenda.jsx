import React from "react";
import { collection, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { useState, useEffect, useCallback, useRef } from "react";
import { db } from "../firebaseConfig/firebase";
import { onSnapshot } from "firebase/firestore";
import CreateCita from "./CreateCita";
import Navigation from "./Navigation";
import "./Show.css";
import EditCita from "./EditCita";
import Estados from "./Estados";
import HorariosAtencionCitas from "./HorariosAtencionCitas";


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

  const citasCollection = collection(db, "citas");
  const citasCollectionOrdenados = useRef(query(citasCollection, orderBy("fecha","desc")));
  
  const updateEstadosFromSnapshot = useCallback((snapshot) => {
    const citasArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    citasArray.sort((a, b) => {
      if (a.fecha === b.fecha) {
        return b.horaInicio.localeCompare(a.horaInicio);
      } else {
        return b.fecha.localeCompare(a.fecha);
      }
    });
    setCitas(citasArray);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(citasCollectionOrdenados.current, updateEstadosFromSnapshot);
    return unsubscribe;
  }, [updateEstadosFromSnapshot]);

  const deleteCita = async (id) => {
      const citaDoc = doc(db, "citas", id);
      await deleteDoc(citaDoc);
      setCitas(prevCitas => prevCitas.filter(cita => cita.id !== id));
  };

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  let results = [];
  if (!search) {
    results = citas;
  } else {
    results = citas.filter(
      (dato) =>
        dato.apellido.toLowerCase().includes(search.toLowerCase()) ||
        dato.idc.toString().includes(search.toString())
    );
  }

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...citas].sort((a, b) =>
        a[col].toString() > b[col].toString() ? 1 : -1
      );
      setCitas(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...citas].sort((a, b) =>
        a[col].toString() < b[col].toString() ? 1 : -1
      );
      setCitas(sorted);
      setOrder("ASC");
    }
  };

  return (
    <>
      <div className="mainpage">
        <Navigation />
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="d-grid gap-2">
                <div className="d-flex">
                  <h1>Agenda</h1>
                </div>
                <div className="d-flex justify-content-end">
                  <input
                    value={search}
                    onChange={searcher}
                    type="text"
                    placeholder="Buscar por Apellido o IDC..."
                    className="form-control m-2 w-25"
                  />
                  <button
                    variant="primary"
                    className="btn-blue m-2"
                    onClick={() => setModalShowCita(true)}
                  >
                    Agregar Cita
                  </button>
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
                </div>
                <section className="table__body">
                  <table>
                    <thead>
                      <tr>
                        <th onClick={() => sorting("fecha")}>Fecha</th>
                        <th>Inicio</th>
                        <th>Fin</th>
                        <th>Apellido</th>
                        <th>Nombre</th>
                        <th>IDC</th>
                        <th>Estado</th>
                        <th>Numero</th>                        
                        <th>Comentarios</th>
                        <th>Accion</th>
                      </tr>
                    </thead>

                    <tbody>
                      {results.map((cita) => (
                        <tr key={cita.id}>
                          <td> {cita.fecha} </td>
                          <td> {cita.horaInicio} </td>
                          <td> {cita.horaFin} </td>
                          <td> {cita.apellido} </td>
                          <td> {cita.nombre} </td>
                          <td> {cita.idc} </td>
                          <td> {cita.estado} </td>
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
                </section>
              </div>
            </div>
          </div>
        </div>
      <CreateCita show={modalShowCita} onHide={() => setModalShowCita(false)} />
      <EditCita    
        id={idParam}
        cita={cita}
        show={modalShowEditCita}
        onHide={() => setModalShowEditCita(false)} />
        <Estados show={modalShowEstados} onHide={() => setModalShowEstados(false)} />
        <HorariosAtencionCitas show={modalShowHorarios} onHide={() => setModalShowHorarios(false)} />

    </>
  );
}

export default Citas;
