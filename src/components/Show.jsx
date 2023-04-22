import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
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

// const mySwal = withReactContent(Swal)

const Show = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");

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

const searcher = (e) => {
    setSearch(e.target.value)
}

let results = [] 
if(!search){
    results = clients
}else{
    results = clients.filter((dato)=> 
    dato.apellido.toLowerCase().includes(search.toLowerCase()) ||
    dato.idc.toString().includes(search.toString())
    )
}

  useEffect(() => {
    getClients();
  }, []);
  return (
    <>
    <div className="container d-flex">
      <h1>Pacientes</h1>
      </div>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="d-flex">
              <Link to="/create" className="btn btn-primary m-2 text-nowrap">
                <text>Agregar cliente</text>
              </Link>
              <div className="col-3">
                <input
                  value={search}
                  onChange={searcher}
                  type="text"
                  placeholder="Buscar por Apellido o IDC..."
                  className="form-control m-2"
                />
              </div> 
            </div>
            <table className="table table-bordered table-dark table-hover">
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
                      <Link
                        to={`/edit/${client.id}`}
                        className="btn btn-success m-1"
                      >
                        {" "}
                        <i className="fa-regular fa-pen-to-square"></i>{" "}
                      </Link>
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
    </>
  );
};

export default Show;