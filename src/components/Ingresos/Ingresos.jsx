import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { collection, onSnapshot, query, } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import Navigation from "../Navigation";
import "../Pacientes/Show.css"
import "../Utilidades/loader.css";
import "../Utilidades/tablas.css";
import EditIngreso from "./EditIngreso";


const Ingresos = () => {
  const [tratamientos, setTratamientos] = useState([]);
  const [search, setSearch] = useState("");
  const [modalShowEditIngreso, setModalShowEditIngreso] = useState(false);
  const [order, setOrder] = useState("ASC");
  const [tratamiento, setTratamiento] = useState([]);
  const [idParam, setIdParam] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const tratamientosCollectionRef = collection(db, "tratamientos");
  const tratamientosCollection = useRef(query(tratamientosCollectionRef));

  const getTratamientos = useCallback((snapshot) => {
    const tratamientosArray = snapshot.docs.map((doc) => {
      const { cobrosManuales } = doc.data();
      return {
        cobrosManuales,
        id: doc.id,
      };
    }).filter((tratamiento) => tratamiento.cobrosManuales.fechaCobro.length > 0 && tratamiento.cobrosManuales.estadoCobro.toString() === "COBRADO"); 

    tratamientosArray.sort((a, b) => {
      const fechaCobroA = a.cobrosManuales.fechaCobro[0];
      const fechaCobroB = b.cobrosManuales.fechaCobro[0];
      return fechaCobroA.localeCompare(fechaCobroB);
    });

    setTratamientos(tratamientosArray);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(tratamientosCollection.current, getTratamientos);
    return unsubscribe;
  }, [getTratamientos]);


  const searcher = (e) => {
    setSearch(e.target.value);
  };

  let results = [];

  if (!search) {
    results = tratamientos;
  } else {
    results = tratamientos.filter(
      (dato) =>
        dato.cobrosManuales.pacienteCobro.toString().toLowerCase().includes(search.toLowerCase()) ||
        dato.cobrosManuales.tratamientoCobro.toString().toLowerCase().includes(search.toLowerCase()) ||
        dato.cobrosManuales.metodoPago.toString().toLowerCase().includes(search.toLowerCase()) 
    );
  }

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

  return (
    <>
      <div className="mainpage">
        <Navigation />
        {isLoading ? (
          <span className="loader position-absolute start-50 top-50 mt-3"></span>
        ) : (
          <div className="container m-2 mw-100">
            <div className="row">
              <div className="col">
                <div className="d-grid gap-2">
                  <div className="d-flex">
                    <h1>Ingresos</h1>
                  </div>
                  <div className="d-flex justify-content-start">
                    <input
                      value={search}
                      onChange={searcher}
                      type="text"
                      placeholder="Buscar por Tratamiento, Paciente o Metodo de Pago..."
                      className="form-control m-2 w-25"
                    />
                  </div>

                </div>
                <table className="table__body">
                  <thead>
                    <tr>
                      <th>N°</th>
                      <th onClick={() => sorting("fechaCobro")}>Fecha</th>
                      <th onClick={() => sorting("metodoPago")}>Metodo Pago</th>
                      <th onClick={() => sorting("importeAbonado")}>Importe</th>
                      <th onClick={() => sorting("codigoTratamiento")}>Cta</th>
                      <th onClick={() => sorting("pacienteCobro")}>Paciente</th>
                      <th onClick={() => sorting("tratamientoCobro")}>Tratamiento</th>
                      <th>Accion</th>

                    </tr>
                  </thead>

                  <tbody>
                    {results.map((tratamiento, index) => (
                      <tr key={tratamiento.id}>
                        <td>{index + 1}</td>
                        <td> {tratamiento.cobrosManuales.fechaCobro} </td>
                        <td> {tratamiento.cobrosManuales.metodoPago} </td>
                        <td> {tratamiento.cobrosManuales.importeAbonado} </td>
                        <td> {tratamiento.cobrosManuales.codigoTratamiento} </td>
                        <td> {tratamiento.cobrosManuales.pacienteCobro} </td>
                        <td> {tratamiento.cobrosManuales.tratamientoCobro} </td>
                        <td><button
                          variant="primary"
                          className="btn btn-success mx-1"
                          onClick={() => {
                            setModalShowEditIngreso(true);
                            setTratamiento(tratamiento.cobrosManuales);
                            setIdParam(tratamiento.id);
                          }}
                        >
                          <i className="fa-regular fa-pen-to-square"></i>
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
      </div>


     {/*} <EditIngreso
        id={idParam}
        tratamiento={tratamiento}
        show={modalShowEditIngreso}
        onHide={() => setModalShowEditIngreso(false)}
                        />*/}
    </>
  );
};

export default Ingresos;