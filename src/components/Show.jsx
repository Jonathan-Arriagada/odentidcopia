import React from "react";
import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import Navigation from "./Navigation";
import "./Show.css";
import Edit from "./Edit";
import Create from "./Create";

const Show = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [modalShowEdit, setModalShowEdit] = useState(false);
  const [order, setOrder] = useState("ASC");
  const [client, setClient] = useState([]);
  const [idParam, setIdParam] = useState("");
 
  const clientsCollection = collection(db, "clients");

  const getClients = async () => {
    const data = await getDocs(clientsCollection);
    setClients(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  
  useEffect(() => {
    getClients();
  }, []);

  const deleteClient = async (id) => {
    const clientDoc = doc(db, "clients", id);
    await deleteDoc(clientDoc);
    getClients();
  };

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  let results = [];
  
  if (!search) {
    results = clients;
  }
  else {
    results = clients.filter(
      (dato) =>
        dato.apellido.toLowerCase().includes(search.toLowerCase()) ||
        dato.idc.toString().includes(search.toString())
    )
  }if(results === ""){
    return (<h1>No existe</h1>)
  }

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...clients].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setClients(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...clients].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setClients(sorted);
      setOrder("ASC");
    }
  };


  return (
    <>
      <div className="mainpage">
        <Navigation />
        <div className="container">
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
                    placeholder="Buscar por Apellido o IDC..."
                    className="form-control m-2 w-25"
                  />
                  <button
                    variant="primary"
                    className="btn-blue m-2"
                    onClick={() => setModalShow(true)}
                  >
                    Nuevo
                  </button>
                </div>
              </div>
              <section className="table__body">
                <table>
                  <thead>
                    <tr>
                      <th onClick={() => sorting("apellido")}>Apellido</th>
                      <th>Nombre</th>
                      <th>IDC</th>
                      <th>Edad</th>
                      <th>Numero</th>
                      <th>Accion</th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((client) => (
                      <tr key={client.id}>
                        <td className=""> {client.apellido} </td>
                        <td> {client.nombre} </td>
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
      </div>
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
