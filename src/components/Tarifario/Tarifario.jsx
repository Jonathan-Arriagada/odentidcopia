import React, { useCallback, useEffect, useRef, useState } from "react";
import Navigation from "../Navigation";
import {
  collection,
  updateDoc,
  doc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import CreateTarifa from "./CreateTarifa";
import "../Pacientes/Show.css";
import EditTarifa from "./EditTarifa";
import "../Utilidades/loader.css";
import "../Utilidades/tablas.css";

function Tarifario() {
  const [tarifas, setTarifas] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("ASC");
  const [modalShow, setModalShow] = useState(false);
  const [modalShowEdit, setModalShowEdit] = useState(false);
  const [tarifa, setTarifa] = useState([]);
  const [idParam, setIdParam] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState("");

  const tarifasCollectiona = collection(db, "tarifas");
  const tarifasCollection = useRef(
    query(tarifasCollectiona, orderBy("codigo"))
  );

  const [disabledRows] = useState([]);

  const getTarifarios = useCallback((snapshot) => {
    const tarifasArray = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setTarifas(tarifasArray);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(tarifasCollection.current, getTarifarios);
    const type = localStorage.getItem("rol");
    setUserType(type);
    return unsubscribe;
  }, [getTarifarios]);

  const deleteTarifa = async (id) => {
    const tarifasDoc = doc(db, "tarifas", id);
    await updateDoc(tarifasDoc, { eliminado: true });
  };

  const activeTarifa = async (id) => {
    const tarifasDoc = doc(db, "tarifas", id);
    await updateDoc(tarifasDoc, { eliminado: false });
  };

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  let results = [];
  if (!search) {
    results = tarifas;
  } else {
    results = tarifas.filter(
      (dato) =>
        dato.tratamiento.toLowerCase().includes(search.toLowerCase()) ||
        dato.codigo.toString().includes(search.toString())
    );
  }

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...tarifas].sort((a, b) =>
        a[col].toString() > b[col].toString() ? 1 : -1
      );
      setTarifas(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...tarifas].sort((a, b) =>
        a[col].toString() < b[col].toString() ? 1 : -1
      );
      setTarifas(sorted);
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
                  <div className="d-flex">
                    <h1>Tarifario</h1>
                  </div>
                  <div className="d-flex justify-content-between">
                    <input
                      value={search}
                      onChange={searcher}
                      type="text"
                      placeholder="Buscar por Codigo o Tratamiento..."
                      className="form-control m-2 w-25"
                    />
                    <div className="d-flex justify-content-end">
                      {userType === '"admin"' ? (
                        <button
                          variant="primary"
                          className="btn-blue m-2"
                          onClick={() => {
                            setModalShow(true);
                          }}
                        >
                          Agregar Tarifa
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
                <table className="table__body">
                  <thead>
                    <tr>
                      <th onClick={() => sorting("codigo")}>Código</th>
                      <th>Tratamiento</th>
                      <th>Tarifa</th>
                      {userType === '"admin"' ? <th>Accion</th> : null}
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((tarifa) => (
                      <tr
                        key={tarifa.id}
                        className={tarifa.eliminado ? "deleted-row" : ""}
                      >
                        <td> {tarifa.codigo} </td>
                        <td> {tarifa.tratamiento}</td>
                        <td> {tarifa.tarifa} </td>
                        {userType === '"admin"' ? (
                          <td>
                            <button
                              variant="primary"
                              className="btn btn-success mx-1"
                              disabled={
                                disabledRows.includes(tarifa.id) ||
                                tarifa.eliminado
                              }
                              onClick={() => {
                                setModalShowEdit(true);
                                setTarifa(tarifa);
                                setIdParam(tarifa.id);
                              }}
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button
                              onClick={() => {
                                deleteTarifa(tarifa.id);
                              }}
                              className="btn btn-danger"
                              disabled={
                                disabledRows.includes(tarifa.id) ||
                                tarifa.eliminado
                              }
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                            {tarifa.eliminado}
                            <button
                              onClick={() => {
                                activeTarifa(tarifa.id);
                              }}
                              className="btn btn-light"
                              disabled={disabledRows.includes(tarifa.id)}
                              style={{ marginLeft: "2px" }}
                            >
                              {" "}
                              <i className="fa-solid fa-power-off"></i>{" "}
                            </button>
                          </td>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      <CreateTarifa show={modalShow} onHide={() => setModalShow(false)} />
      <EditTarifa
        id={idParam}
        tarifa={tarifa}
        show={modalShowEdit}
        onHide={() => setModalShowEdit(false)}
      />
    </>
  );
}

export default Tarifario;
