import React, { useCallback } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig/firebase";
import Navigation from "./Navigation";
import CreateTratamiento from "./CreateTratamiento";
import EditTratamiento from "./EditTratamiento";

function Tratamientos() {
  const [tratamientos, setTratamientos] = useState([]);
  const [search, setSearch] = useState("");
  const [modalShowTratamiento, setModalShowTratamiento] = useState(false);
  const [modalShowEditTratamiento, setModalShowEditTratamiento] = useState(false);
  const [order, setOrder] = useState("ASC");
  const [tratamiento, setTratamiento] = useState([]);
  const [idParam, setIdParam] = useState("");

  const tratamientosCollection = collection(db, "tratamientos");

  const getTratamientos = async () => {
    const data = await getDocs(tratamientosCollection);
    setTratamientos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getTratamientos();
  }, []);

  const deletetratamiento = async (id) => {
    const tratamientoDoc = doc(db, "tratamientos", id);
    await deleteDoc(tratamientoDoc);
    setTratamientos(prevTratamientos => prevTratamientos.filter(tratamiento => tratamiento.id !== id));
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
      dato.apellido.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <>
      <div className="mainpage">
        <Navigation />
        <div className="container">
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
                    placeholder="Buscar por Apellido..."
                    className="form-control m-2 w-25"
                  />
                  <button
                    variant="primary"
                    className="btn-blue m-2"
                    onClick={() => setModalShowTratamiento(true)}
                  >
                    Agregar Tratamiento
                  </button>
                </div>
                <table className="table__body">
                  <thead>
                    <tr>
                      <th onClick={() => sorting("apellido")}>Apellido</th>
                      <th>Nombre</th>
                      <th>Tratamiento</th>
                      <th>Pieza</th>
                      <th>Saldo</th>
                      <th>Estado del Pago</th>
                      <th>Estado del Tratamiento</th>
                      <th>Accion</th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((tratamiento) => (
                      <tr key={tratamiento.id}>
                        <td> {tratamiento.apellido} </td>
                        <td> {tratamiento.nombre} </td>
                        <td> {tratamiento.tratamiento} </td>
                        <td> {tratamiento.pieza} </td>
                        <td> {tratamiento.saldo} </td>
                        <td> {tratamiento.estadoPago} </td>
                        <td> {tratamiento.estadoTratamiento} </td>
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
      </div>
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
