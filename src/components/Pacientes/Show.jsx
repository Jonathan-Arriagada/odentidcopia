import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import Navigation from "../Navigation";
import Edit from "./Edit";
import Create from "./Create";
import CreateCita from "../Agenda/CreateCita";
import moment from "moment";
import { FaSignOutAlt, FaUser, FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { Dropdown } from "react-bootstrap";
import "../../style/Main.css";

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

  const logout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        localStorage.setItem("user", JSON.stringify(null));
      })
      .catch((error) => {
        // Maneja cualquier error que ocurra durante el logout
        console.log("Error durante el logout:", error);
      });
  };

  const clientsCollectiona = collection(db, "clients");
  const clientsCollection = useRef(
    query(clientsCollectiona, orderBy("apellidoConNombre"))
  );

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
    setClients((prevClients) =>
      prevClients.filter((cliente) => cliente.id !== id)
    );
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
        const valueA =
          typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
        const valueB =
          typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
        return valueA > valueB ? 1 : -1;
      });
      setClients(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...clients].sort((a, b) => {
        const valueA =
          typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
        const valueB =
          typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
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
          <div className="w-100">
            <nav className="navbar">
              <div className="d-flex justify-content-between px-2 w-100" >
                <div className="search-bar w-50">
                  <input
                    value={search}
                    onChange={searcher}
                    type="text"
                    placeholder="Buscar por Apellido y Nombres o DNI..."
                    className="form-control m-2"
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center right-navbar">
                  <p className="fw-bold mb-0" style={{ marginLeft: "-20px" }}>
                    Bienvenido al sistema Odentid
                  </p>
                  <div className="d-flex">
                    <div className="notificacion">
                      <Link
                        to="/miPerfil"
                        className="text-decoration-none"
                      >
                        <FaUser className="icono" />
                      </Link>
                    </div>
                    <div className="notificacion">
                      <FaBell className="icono" />
                      <span className="badge rounded-pill bg-danger">5</span>
                    </div>
                  </div>
                  <div className="notificacion">
                    <Link
                      to="/"
                      className="text-decoration-none"
                      style={{ color: "#8D93AB" }}
                      onClick={logout}
                    >
                      <FaSignOutAlt className="icono" />
                      <span>Logout</span>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
            <div className="container mw-100">
              <div className="row">
                <div className="col">
                  <br></br>
                  <div className="d-flex justify-content-between">
                    <h1>Pacientes</h1>
                    <button
                      variant="primary"
                      className="btn-blue m-2"
                      onClick={() => setModalShow(true)}
                    >
                      Nuevo
                    </button>
                  </div>
                  <table className="table__body">
                    <thead>
                      <tr>
                        <th>N°</th>
                        <th onClick={() => sorting("apellidoConNombre")}>
                          Apellido Y Nombres
                        </th>
                        <th onClick={() => sorting("idc")}>DNI</th>
                        <th onClick={() => sorting("fechaNacimiento")}>
                          Fecha Nacimiento
                        </th>
                        <th onClick={() => sorting("numero")}>Telefono</th>
                        <th>Accion</th>
                      </tr>
                    </thead>

                    <tbody>
                      {results.map((client, index) => (
                        <tr key={client.id}>
                          <td>{results.length - index}</td>
                          <td>
                            <Link to={`/historial/${client.id}`}>
                              {client.apellidoConNombre}
                            </Link>

                          </td>
                          <td> {client.idc} </td>
                          <td>
                            {moment(client.fefechaNacimientocha).format(
                              "DD/MM/YY"
                            )}
                          </td>
                          <td> {client.numero}</td>

                          <td style={{ padding: "10px" }}>
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="primary"
                                className="btn btn-secondary mx-1 btn-md"
                                id="dropdown-actions"
                              >
                                <i className="fa-solid fa-list"> </i>
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={() => {
                                    setModalShowEdit(true);
                                    setClient(client);
                                    setIdParam(client.id);
                                  }}
                                >
                                  <i className="fa-regular fa-pen-to-square"></i>
                                  Editar
                                </Dropdown.Item>

                                <Dropdown.Item>
                                  <Link to={`/historial/${client.id}`} style={{textDecoration: "none", color:"#212529"}}>
                                    <i className="fa-solid fa-file-medical"></i>
                                    Historial Clinico
                                  </Link>
                                </Dropdown.Item>


                                <Dropdown.Item
                                  onClick={() => {
                                    setModalShowCita(true);
                                    setClient(client);
                                  }}
                                >
                                  <i class="fa-solid fa-plus"></i>
                                  Crear Cita
                                </Dropdown.Item>

                                <Dropdown.Item
                                  onClick={() => {
                                    deleteClient(client.id);
                                  }}
                                >
                                  <i className="fa-solid fa-trash-can"></i>
                                  Eliminar
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div >

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