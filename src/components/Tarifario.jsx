import React, { useEffect, useState } from "react";
import Navigation from "./Navigation";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import CreateTarifa from "./CreateTarifa";

function Tarifario() {
  const [tarifas, setTarifas] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("ASC");
  const [modalShow, setModalShow] = React.useState(false);

  const tarifasCollection = collection(db, "tarifas");

  const getTarifas = async () => {
    const data = await getDocs(tarifasCollection);
    setTarifas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteTarifa = async (id) => {
    const tarifaDoc = doc(db, "tarifas", id);
    await deleteDoc(tarifaDoc);
    getTarifas();
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
    if (order === "ASC"){
      const sorted = [...tarifas].sort((a,b)=>
          a[col].toString() > b[col].toString() ? 1 : -1
      );
      setTarifas(sorted);
      setOrder("DSC");
    }
    if (order === "DSC"){
      const sorted = [...tarifas].sort((a,b)=>
          a[col].toString() < b[col].toString() ? 1 : -1
      );
      setTarifas(sorted);
      setOrder("ASC");
    }
  }

  useEffect(() => {
      getTarifas();
  }, []);

  return (
    <>
      <div className="mainpage">
        <Navigation />
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="d-grid gap-2">
                <div className="d-flex">
                  <h1>Tarifario</h1>
                </div>
                <div className="d-flex">
                <button
                          variant="primary"
                          className="btn btn-success m-2 w-25"
                          onClick={() => {setModalShow(true)}}
                        >
                          Agregar Tarifa
                        </button>
                </div>
                <input
                  value={search}
                  onChange={searcher}
                  type="text"
                  placeholder="Buscar por Codigo o Tratamiento..."
                  className="form-control m-2"
                />
                <table className="table table-dark table-hover">
                  <thead>
                    <tr>
                      <th onClick={()=>sorting("codigo")}>Código</th>
                      <th>Tratamiento</th>
                      <th>Tarifa</th>
                      <th>Accion</th>
                    </tr>
                  </thead>

                  <tbody className="table-group-divider table-active">
                    {results.map((tarifa) => (
                      <tr key={tarifa.id}>
                        <td> {tarifa.codigo} </td>
                        <td> {tarifa.tratamiento}</td>
                        <td> {tarifa.tarifa} </td>
                        <td>
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateTarifa show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default Tarifario;
