import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect} from "react";
import {
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { SweetAlert2 } from "sweetalert2-react-content";
import withReactContent from "sweetalert2-react-content";
import Navigation from "./Navigation";
import "./Show.css";
import Edit from "./Edit";

// const mySwal = withReactContent(Swal)

const Show = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [modalShow, setModalShow] = React.useState(false);

  const clientsCollection = collection(db, "clients");

  const getClients = async () => {
    const data = await getDocs(clientsCollection);
    setClients(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteClient = async (id) => {
    const clientDoc = doc(db, "clients", id);
    await deleteDoc(clientDoc);
    getClients();
  };

  const logout = () => {
    localStorage.setItem("user",JSON.stringify(null))
  }

const searcher = (e) => {
    setSearch(e.target.value)
}

  let results = [];
  if (!search) {
    results = clients;
  } else {
    results = clients.filter(
      (dato) =>
        dato.apellido.toLowerCase().includes(search.toLowerCase()) ||
        dato.idc.toString().includes(search.toString())
    );
  }

  useEffect(() => {
    getClients();
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
            <h1>Pacientes</h1>
            </div>
              <div className="d-flex">
                 <Link to="/create" className="btn btn-secondary m-2 w-25">
                  Agregar cliente
                </Link>
                <Link to="/" className="btn btn-danger m-2 w-25" onClick={logout}>
                  Logout
                </Link>
              </div>
                <input
                  value={search}
                  onChange={searcher}
                  type="text"
                  placeholder="Buscar por Apellido o IDC..."
                  className="form-control m-2"
                />
            </div>
            <table className="table table-dark table-hover">
              <thead>
                <tr >
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>IDC</th>
                  <th>Edad</th>
                  <th>Numero</th>
                  <th>Accion</th>
                </tr>
              </thead>

              <tbody className="table-group-divider table-active">
                {results.map((client) => (
                  <tr key={client.id}>
                    <td> {client.nombre} </td>
                    <td> {client.apellido} </td>
                    <td> {client.idc} </td>
                    <td> {client.edad} </td>
                    <td> {client.numero} </td>
                    <td> 
                      <button variant="primary" className='btn btn-success m-1' onClick={() => setModalShow(true)}><i className="fa-regular fa-pen-to-square"></i></button>
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
          </div>
        </div>
      </div>
      </div>
      <Edit
      show={modalShow}
      onHide={() => setModalShow(false)}
      />
      </>
  );
};


export default Show;