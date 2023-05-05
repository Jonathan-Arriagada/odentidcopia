import React, { useCallback, useEffect, useRef, useState } from "react";
import Navigation from "./Navigation";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import CreateTarifa from "./CreateTarifa";
import "./Show.css";
import EditTarifa from "./EditTarifa";
import "./loader.css";

function Tarifario() {
  const [tarifas, setTarifas] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("ASC");
  const [modalShow, setModalShow] = useState(false);
  const [modalShowEdit, setModalShowEdit] = useState(false);
  const [tarifa, setTarifa] = useState([]);
  const [idParam, setIdParam] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const tarifasCollection = collection(db, "tarifas");
  const tarifasCollectionOrdenados = useRef(
    query(tarifasCollection, orderBy("codigo", "asc"))
  );

  const updateEstadosFromSnapshot = useCallback((snapshot) => {
    const tarifasArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTarifas(tarifasArray);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      tarifasCollectionOrdenados.current,
      updateEstadosFromSnapshot
    );
    return unsubscribe;
  }, [updateEstadosFromSnapshot]);

  const tarifaExiste = (codigo) => {
    return tarifas.some((tarifa) => tarifa.codigo === codigo);
  };

  const getTarifas = async () => {
    const data = await getDocs(tarifasCollection);
    setTarifas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteTarifa = async (id) => {
    const tarifaDoc = doc(db, "tarifas", id);
    await deleteDoc(tarifaDoc);
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
          <div className="container mt-2">
            <div className="row">
              <div className="col">
                <div className="d-grid gap-2">
                  <div className="d-flex">
                    <h1>Tarifario</h1>
                  </div>
                  <div className="d-flex justify-content-end">
                    <input
                      value={search}
                      onChange={searcher}
                      type="text"
                      placeholder="Buscar por Codigo o Tratamiento..."
                      className="form-control m-2 w-25"
                    />
                    <button
                      variant="primary"
                      className="btn-blue m-2"
                      onClick={() => {
                        setModalShow(true);
                      }}
                    >
                      Agregar Tarifa
                    </button>
                  </div>
                </div>
                <section className="table__body">
                  <table>
                    <thead>
                      <tr>
                        <th onClick={() => sorting("codigo")}>Código</th>
                        <th>Tratamiento</th>
                        <th>Tarifa</th>
                        <th>Accion</th>
                      </tr>
                    </thead>

                    <tbody>
                      {tarifas.map((tarifa) => (
                        <tr key={tarifa.id}>
                          <td> {tarifa.codigo} </td>
                          <td> {tarifa.tratamiento}</td>
                          <td> {tarifa.tarifa} </td>
                          <td>
                            <button
                              variant="primary"
                              className="btn btn-success mx-1"
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
