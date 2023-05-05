import React, { useCallback, useRef } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig/firebase";
import Navigation from "../Navigation";
import moment from 'moment';


function GestionFechasTratamientos() {
  const [tratamientos, setTratamientos] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("ASC");
  const tratamientosCollectiona = collection(db, "tratamientos");
  const tratamientosCollection = useRef(query(tratamientosCollectiona, orderBy("apellidoConNombres")));

  const getTratamientos = useCallback((snapshot) => {
    const tratamientosArray = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setTratamientos(tratamientosArray);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(tratamientosCollection.current, getTratamientos);
    return unsubscribe;
  }, [getTratamientos]);


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

  function renderDateDiff(date1) {
    const diff = moment().diff(moment(date1), 'years months days');
    const years = moment.duration(diff).years();
    const months = moment.duration(diff).months();
    const days = moment.duration(diff).days();
  
    return `${years}    -    ${months}    -    ${days} `;
  }
  return (
    <>
      <div className="mainpage">
        <Navigation />
        <div className="container mt-2">
          <div className="row">
            <div className="col">
              <div className="d-grid gap-2">
                <div className="d-flex">
                  <h1>Gestión Fechas Tratamientos</h1>
                </div>
                <div className="d-flex justify-content-end">
                  <input
                    value={search}
                    onChange={searcher}
                    type="text"
                    placeholder="Buscar por Apellido y Nombres..."
                    className="form-control m-2 w-25"
                  />
                </div>
                <table className="table__body">
                  <thead>
                    <tr>
                      <th onClick={() => sorting("apellido")}>Apellido y Nombres</th>
                      <th>Tratamiento</th>
                      <th>Pieza</th>
                      <th>Fecha</th>
                      <th>Estado Tratamiento</th>
                      <th>Y    -    M    -    D</th>
 
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((tratamiento) => (
                      <tr key={tratamiento.id}>
                        <td> {tratamiento.apellidoConNombres} </td>
                        <td> {tratamiento.tarifasTratamientos} </td>
                        <td> {tratamiento.pieza} </td>
                        <td> {tratamiento.fecha} </td>
                        <td> {tratamiento.estadosTratamientos} </td>
                        <td>  {renderDateDiff(tratamiento.fecha)} </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GestionFechasTratamientos;
