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


  const ocultarTabla = (codigo) => {
    if (mostrarTabla) {
      setMostrarTabla(false);
      setSearch("")
    } else {
      setSearch(codigo)
      setMostrarTabla(true);
    }
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

  let results = !search
    ? tratamientos
    : search.toString().length === 1 && !isNaN(search)
      ? (
        tratamientos.filter((dato) => dato.codigo === search)
      )
      : (
        tratamientos.filter((dato) =>
          dato.apellidoConNombre.toLowerCase().includes(search) ||
          dato.idc.toString().includes(search.toString())
        )
      );

  function renderDateDiff(date1) {
    const diff = moment().diff(moment(date1), 'years months days');
    const years = moment.duration(diff).years();
    const months = moment.duration(diff).months();
    const days = moment.duration(diff).days();

    return `${years}    .    ${months}    .    ${days} `;
  }

  return (
    <>
<div className="mainpage">
        <Navigation />
        {isLoading ? (
          <span className="loader position-absolute start-50 top-50 mt-3"></span>
        ) : (
          <div className="container mt-2" >
            <div className="d-grid gap-2">
              <div className="d-flex" >
                <h1>Tratamientos</h1>
              </div>
            </div>

            <div className="container" id="tablaTratamientos">
              <div className="row">
                <div className="col">
                  <input
                    value={search}
                    onChange={searcher}
                    type="text"
                    placeholder="Buscar por Apellido y Nombres..."
                    className="form-control m-2 w-100"
                  />
                </div>
                <div className="col d-flex justify-content-end">
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
                  <button
                    variant="secondary"
                    className="btn-blue m-2"
                    onClick={() => setModalShowEditPago(true)}
                  >
                    Estado Pago
                  </button>
                </div>
              </div>
            </div>

            <table className="table__body"> 
              <thead>
                <tr>
                  <th onClick={() => sorting("codigo")}>N°</th>
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
                    <td>{tratamiento.codigo}</td>
                    <td> {tratamiento.apellidoConNombre} </td>
                    <td> {tratamiento.idc} </td>
                    <td> {tratamiento.cta} </td>
                    <td> {tratamiento.tarifasTratamientos} </td>
                    <td> {tratamiento.pieza} </td>
                    <td>{moment(tratamiento.fecha).format('DD/MM/YY')}</td>
                    <td> {tratamiento.estadoPago} </td>
                    <td> {tratamiento.estadosTratamientos} </td>
                    <td> {renderDateDiff(tratamiento.fecha)} </td>

                    <td >
                      <button
                        variant="primary"
                        className="btn btn-dark mx-1 btn-sm"
                        onClick={() => ocultarTabla(tratamiento.codigo)}
                      >
                        <i className="fa-regular fa-eye"></i>
                      </button>
                      <button
                        variant="primary"
                        className="btn btn-success mx-1 btn-sm"
                        onClick={() => {
                          setModalShowEditTratamiento(true);
                          setTratamiento(tratamiento);
                          setIdParam(tratamiento.id);
                        }}
                      >
                        <i className="fa-regular fa-pen-to-square"></i>
                      </button>
                      <button
                        variant="primary"
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          deletetratamiento(tratamiento.id);
                        }}
                      >
                        <i className="fa-solid fa-trash-can"></i>{" "}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {mostrarTabla && (<table className="table__body"  style={{marginTop: "50px"}}>
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
                    <td style={{ display: "flex"}}>
                      <span style={{ marginRight: "5px" }}>{tratamiento.estadoPago}</span>
                      <ListaSeleccionEstadoPago
                        tratamientoId={tratamiento.id}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>)}

            {mostrarTabla && (<table className="table__body"  style={{marginTop: "50px", width: "80%", border: "1px solid lightgray"}}>
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
