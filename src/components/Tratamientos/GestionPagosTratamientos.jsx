import React, { useCallback, useRef } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig/firebase";
import Navigation from "../Navigation";
import moment from 'moment';
import EditPago from './EditPago'
import ListaSeleccionEstadoPago from './ListaSeleccionEstadoPago'


function GestionPagosTratamientos() {
  const [tratamientos, setTratamientos] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("ASC");

  const [modalShowEditPago, setModalShowEditPago] = useState(false);

  const tratamientosCollectiona = collection(db, "tratamientos");
  const tratamientosCollection = useRef(query(tratamientosCollectiona, orderBy("apellidoConNombre")));

  const getTratamientos = useCallback((snapshot) => {
    const tratamientosArray = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setTratamientos(tratamientosArray);
  }, []);

  useEffect(() => {
    const unsubscribeTratamientos = onSnapshot(tratamientosCollection.current, getTratamientos);
    return unsubscribeTratamientos;
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
      dato.apellidoConNombre.toLowerCase().includes(search.toLowerCase())
    );
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
                  <h1>Gestión Pagos Tratamientos</h1>
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
                    variant="secondary"
                    className="btn-blue m-2"
                    onClick={() => setModalShowEditPago(true)}
                  >
                    Estado Pago
                  </button>
                </div>
                <table className="table__body">
                  <thead>
                    <tr>
                      <th onClick={() => sorting("apellido")}>Apellido y Nombres</th>
                      <th>Tratamiento</th>
                      <th>Cta</th>
                      <th>Pieza</th>
                      <th>Cant</th>
                      <th>Precio</th>
                      <th>Total</th>
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
                        <td>{tratamiento.apellidoConNombre}</td>
                        <td>{tratamiento.tarifasTratamientos}</td>
                        <td>{tratamiento.cta}</td>
                        <td>{tratamiento.pieza}</td>
                        <td>{tratamiento.cant}</td>
                        <td>{tratamiento.precio}</td>
                        <td>{tratamiento.precio * tratamiento.cant}</td>
                        <td>{tratamiento.plazo === 0 ? 0 * (tratamiento.plazo - tratamiento.cuota) : ((tratamiento.precio * tratamiento.cant) / tratamiento.plazo) * (tratamiento.plazo - tratamiento.cuota)}</td>
                        <td>{tratamiento.plazo}</td>
                        <td>{tratamiento.cuota}</td>
                        <td>{tratamiento.plazo - tratamiento.cuota}</td>
                        <td>{moment(tratamiento.fechaVencimiento).format('DD/MM/YY')}</td>
                        <td>{tratamiento.estadoPago}</td>
                        <td>
                          <ListaSeleccionEstadoPago
                            tratamientoId={tratamiento.id}
                          />
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
      <EditPago
        show={modalShowEditPago}
        onHide={() => setModalShowEditPago(false)}
      />

    </>
  );
}

export default GestionPagosTratamientos;
