import React, { useCallback, useRef } from "react";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig/firebase";
import Navigation from "../Navigation";
import CreateTratamiento from "./CreateTratamiento";
import EditTratamiento from "./EditTratamiento";
import "../Utilidades/loader.css";
import EstadosTratamientos from "./EstadosTratamientos";

function Tratamientos() {
  const [tratamientos, setTratamientos] = useState([]);
  const [search, setSearch] = useState("");
  const [modalShowTratamiento, setModalShowTratamiento] = useState(false);
  const [modalShowEditTratamiento, setModalShowEditTratamiento] =
    useState(false);
  const [order, setOrder] = useState("ASC");
  const [tratamiento, setTratamiento] = useState([]);
  const [idParam, setIdParam] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [modalShowEstadosTratamientos, setModalShowEstadosTratamientos] = useState(false);

  const tratamientosCollectiona = collection(db, "tratamientos");
  const tratamientosCollection = useRef(query(tratamientosCollectiona, orderBy("apellidoConNombres")));

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

  const deletetratamiento = async (id) => {
    const tratamientoDoc = doc(db, "tratamientos", id);
    await deleteDoc(tratamientoDoc);
    setTratamientos((prevTratamientos) =>
      prevTratamientos.filter((tratamiento) => tratamiento.id !== id)
    );
  };

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...tratamientos].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setTratamientos(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...tratamientos].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setTratamientos(sorted);
      setOrder("ASC");
    }
  };

  let results = [];
  if (!search) {
    results = tratamientos;
  } else {
    results = tratamientos.filter((dato) =>
      dato.apellidoConNombres.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <>
      <div className="mainpage">
        <Navigation />
        {isLoading ? (
          <span className="loader position-absolute start-50 top-50 mt-3"></span>
        ) : (
          <div className="container mt-2">
            <div className="row">
              <div className="col">
                <div className="d-grid gap-2">
                  <div className="d-flex">
                    <h1>Tratamientos</h1>
                  </div>
                  <div className="d-flex justify-content-end">
                    <input
                      value={search}
                      onChange={searcher}
                      type="text"
                      placeholder="Buscar por Apellido y Nombres..."
                      className="form-control m-2 w-25"
                    />
                    <button
                      variant="primary"
                      className="btn-blue m-2"
                      onClick={() => setModalShowTratamiento(true)}
                    >
                      Agregar Tratamiento
                    </button>
                    <button
                      variant="secondary"
                      className="btn-blue m-2"
                      onClick={() => setModalShowEstadosTratamientos(true)}
                    >
                      Estados Tratamientos
                    </button>
                  </div>
                  <table className="table__body">
                    <thead>
                      <tr>
                        <th onClick={() => sorting("apellido")}>Apellido y Nombres</th>
                        <th>Tratamiento</th>
                        <th>Pieza</th>
                        <th>Cant</th>
                        <th>Plazo</th>
                        <th>Cuota</th>
                        <th>Fecha</th>
                        <th>Fecha Vencimiento</th>
                        <th>Estado del Tratamiento</th>
                        <th>Accion</th>
                      </tr>
                    </thead>

                    <tbody>
                      {results.map((tratamiento) => (
                        <tr key={tratamiento.id}>
                          <td> {tratamiento.apellidoConNombres} </td>
                          <td> {tratamiento.tarifasTratamientos} </td>
                          <td> {tratamiento.pieza} </td>
                          <td> {tratamiento.cant} </td>
                          <td> {tratamiento.plazo} </td>
                          <td> {tratamiento.cuota} </td>
                          <td> {tratamiento.fecha} </td>
                          <td> {tratamiento.fechaVencimiento} </td>
                          <td> {tratamiento.estadosTratamientos} </td>
                          <td>
                            <button
                              variant="primary"
                              className="btn btn-success mx-1"
                              onClick={() => {
                                setModalShowEditTratamiento(true);
                                setTratamiento(tratamiento);
                                setIdParam(tratamiento.id);
                              }}
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button
                              onClick={() => {
                                deletetratamiento(tratamiento.id);
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
          </div>
        )}
      </div>
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
    </>
  );
}

export default Tratamientos;
