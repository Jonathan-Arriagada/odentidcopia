import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import Navigation from "../Navigation";
import "../Pacientes/Show.css"
import CrearIngreso from "./CrearIngreso";
import EditIngreso from "./EditIngreso";
import "../Utilidades/loader.css";
import "../Utilidades/tablas.css";
import moment from "moment";



const Ingresos = () => {
  const [ingresos, setIngresos] = useState([]);
  const [search, setSearch] = useState("");
  const [modalShowCrearIngreso, setModalShowCrearIngreso] = useState(false);
  const [modalShowEditIngreso, setModalShowEditIngreso] = useState(false);
  const [order, setOrder] = useState("ASC");
  const [ingreso, setIngreso] = useState([]);
  const [idParam, setIdParam] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const ingresosCollectiona = collection(db, "ingresos");
  const ingresosCollection = useRef(query(ingresosCollectiona, orderBy("fechaIngreso")));

  const getIngresos = useCallback((snapshot) => {
    const ingresosArray = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setIngresos(ingresosArray);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(ingresosCollection.current, getIngresos);
    return unsubscribe;
  }, [getIngresos]);

  const deleteIngreso = async (id) => {
    const ingresoDoc = doc(db, "ingresos", id);
    await deleteDoc(ingresoDoc);
    setIngresos((prevIngresos) => prevIngresos.filter((ingreso) => ingreso.id !== id));
  };

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  let results = [];

  if (!search) {
    results = ingresos;
  } else {
    results = ingresos.filter(
      (dato) =>
        dato.tratamientoIngreso.toLowerCase().includes(search.toLowerCase()) ||
        dato.metodoPagoIngreso.toLowerCase().includes(search.toLowerCase())
    );
  }

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...ingresos].sort((a, b) => {
        const valueA = typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
        const valueB = typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
        return valueA > valueB ? 1 : -1;
      });
      setIngresos(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...ingresos].sort((a, b) => {
        const valueA = typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
        const valueB = typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
        return valueA < valueB ? 1 : -1;
      });
      setIngresos(sorted);
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
                  <div className="d-flex justify-content-end">
                    <input
                      value={search}
                      onChange={searcher}
                      type="text"
                      placeholder="Buscar por Trtamiento y Metodo de Pago..."
                      className="form-control m-2 w-25"
                    />
                    <div className="col d-flex justify-content-end">
                      <button
                        variant="primary"
                        className="btn-blue m-2"
                        onClick={() => setModalShowCrearIngreso(true)}
                      >
                        Nuevo
                      </button>
                    </div>
                  </div>

                </div>
                <table className="table__body">
                  <thead>
                    <tr>
                    <th>N°</th>
                      <th onClick={() => sorting("fechaIngreso")}>Fecha</th>
                      <th onClick={() => sorting("metodoPagoIngreso")}>Metodo Pago</th>
                      <th onClick={() => sorting("importeIngreso")}>Importe</th>
                      <th onClick={() => sorting("ctaTratamiento")}>Cta</th>
                      <th onClick={() => sorting("paciente")}>Paciente</th>
                      <th onClick={() => sorting("tratamientoIngreso")}>Tratamiento</th>
                      <th>Accion</th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((ingreso) => (
                      <tr key={ingreso.id}>
                        <td> {1} </td>
                        <td> {moment(ingreso.fechaIngreso).format("DD/MM/YY")} </td>
                        <td> {ingreso.metodoPagoIngreso} </td>
                        <td> {ingreso.importeIngreso} </td>
                        <td> {ingreso.ctaTratamiento} </td>
                        <td> {ingreso.paciente} </td>
                        <td> {ingreso.tratamientoIngreso} </td>
                        <td>
                          <button
                            variant="primary"
                            className="btn btn-success mx-1"
                            onClick={() => {
                              setModalShowEditIngreso(true);
                              setIngreso(ingreso);
                              setIdParam(ingreso.id);
                            }}
                          >
                            <i className="fa-regular fa-pen-to-square"></i>
                          </button>
                          <button
                            onClick={() => {
                              deleteIngreso(ingreso.id);
                            }}
                            className="btn btn-danger mx-1"
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
      </div>

    
      <CrearIngreso show={modalShowCrearIngreso} onHide={() => setModalShowCrearIngreso(false)} />
      <EditIngreso
        id={idParam}
        ingreso={ingreso}
        show={modalShowEditIngreso}
        onHide={() => setModalShowEditIngreso(false)}
      />
    </>
  );
};

export default Ingresos;