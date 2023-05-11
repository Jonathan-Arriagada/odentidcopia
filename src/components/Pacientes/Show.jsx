import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import Navigation from "../Navigation";
import "./Show.css";
import Edit from "./Edit";
import Create from "./Create";
import CreateCita from "../Agenda/CreateCita";
import "../Utilidades/loader.css";
import "../Utilidades/tablas.css";


const Show = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [modalShowEdit, setModalShowEdit] = useState(false);
  const [order, setOrder] = useState("ASC");
  const [client, setClient] = useState([]);
  const [idParam, setIdParam] = useState("");
  const [modalShowCita, setModalShowCita] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const clientsCollectiona = collection(db, "clients");
  const clientsCollection = useRef(query(clientsCollectiona, orderBy("apellidoConNombre")));

  const getClients = useCallback((snapshot) => {
    const clientsArray = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setClients(clientsArray);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(clientsCollection.current, getClients);
    return unsubscribe;
  }, [getClients]);

  const deleteClient = async (id) => {
    const clientDoc = doc(db, "clients", id);
    await deleteDoc(clientDoc);
    setClients((prevClients) => prevClients.filter((cliente) => cliente.id !== id));
  };

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  let results = [];

  if (!search) {
    results = clients;
  } else {
    results = clients.filter(
      (dato) =>
        dato.apellidoConNombre.toLowerCase().includes(search.toLowerCase()) ||
        dato.idc.toString().includes(search.toString())
    );
  }

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...clients].sort((a, b) => {
        const valueA = typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
        const valueB = typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
        return valueA > valueB ? 1 : -1;
      });
      setClients(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...clients].sort((a, b) => {
        const valueA = typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
        const valueB = typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
        return valueA < valueB ? 1 : -1;
      });
      setClients(sorted);
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
                    <h1>Pacientes</h1>
                  </div>
                  <div className="d-flex justify-content-end">
                    <input
                      value={search}
                      onChange={searcher}
                      type="text"
                      placeholder="Buscar por Apellido y Nombres o DNI..."
                      className="form-control m-2 w-25"
                    />
                    <div className="col d-flex justify-content-end">
                      <button
                        variant="primary"
                        className="btn-blue m-2"
                        onClick={() => setModalShow(true)}
                      >
                        Nuevo
                      </button>
                    </div>
                  </div>

                </div>
                <table className="table__body">
                  <thead>
                    <tr>
                      <th onClick={() => sorting("apellidoConNombre")}>Apellido Y Nombres</th>
                      <th onClick={() => sorting("idc")}>DNI</th>
                      <th onClick={() => sorting("edad")}>Edad</th>
                      <th onClick={() => sorting("numero")}>Telefono</th>
                      <th>Accion</th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((client) => (
                      <tr key={client.id}>
                        <td> {client.apellidoConNombre} </td>
                        <td> {client.idc} </td>
                        <td> {client.edad} </td>
                        <td> {client.numero} </td>
                        <td>
                          <button
                            variant="primary"
                            className="btn btn-success mx-1"
                            onClick={() => {
                              setModalShowEdit(true);
                              setClient(client);
                              setIdParam(client.id);
                            }}
                          >
                            <i className="fa-regular fa-pen-to-square"></i>
                          </button>
                          <button
                            onClick={() => {
                              deleteClient(client.id);
                            }}
                            className="btn btn-danger mx-1"
                          >
                            {" "}
                            <i className="fa-solid fa-trash-can"></i>{" "}
                          </button>
                          <button
                            variant="primary"
                            className="btn-blue mx-1"
                            onClick={() => {
                              setModalShowCita(true);
                              setClient(client);
                            }}
                          >
                            Crear Cita
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

      <CreateCita
        show={modalShowCita}
        client={client}
        onHide={() => setModalShowCita(false)}
      />
      <Create show={modalShow} onHide={() => setModalShow(false)} />
      <Edit
        id={idParam}
        client={client}
        show={modalShowEdit}
        onHide={() => setModalShowEdit(false)}
      />
    </>
  );
};

export default Show;