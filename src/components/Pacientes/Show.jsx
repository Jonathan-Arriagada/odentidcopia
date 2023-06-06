import React, { useContext } from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import Navigation from "../Navigation";
import Edit from "./Edit";
import Create from "./Create";
import CreateCita from "../Agenda/CreateCita";
import moment from "moment";
import { FaSignOutAlt, FaBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import "../../style/Main.css";
import Swal from "sweetalert2";
import profile from "../../img/profile.png";
import { AuthContext } from "../../context/AuthContext";


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
  const navigate = useNavigate();
  const { currentUser, } = useContext(AuthContext);


  const logout = useCallback(() => {
    localStorage.setItem("user", JSON.stringify(null));
    navigate("/");
    window.location.reload();
  }, [navigate]);

  const confirmLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: '¿Desea cerrar sesión?',
      showDenyButton: true,
      confirmButtonText: 'Si, cerrar sesión',
      confirmButtonColor: '#00C5C1',
      denyButtonText: `No, seguir logueado`,
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
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

  const confirmeDelete = (id) => {
    Swal.fire({
      title: '¿Esta seguro?',
      text: "No podra revertir la accion",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00C5C1',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteClient(id)
        Swal.fire({
          title: '¡Borrado!',
          text: 'El paciente ha sido borrado.',
          icon: 'success',
          confirmButtonColor: '#00C5C1'
        });
      }
    })
  }

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
                <div className="search-bar">
                  <input
                    value={search}
                    onChange={searcher}
                    type="text"
                    placeholder="Buscar por Apellido y Nombres o IDC..."
                    className="form-control m-2"
                  />
                </div>
                <div className="col d-flex justify-content-end align-items-center right-navbar">
                  <p className="fw-bold mb-0" style={{ marginRight: "20px" }}>
                    Bienvenido {currentUser.displayName}
                  </p>
                  <div className="d-flex">
                    <div className="notificacion">
                      <Link
                        to="/miPerfil"
                        className="text-decoration-none"
                      >
                        <img src={currentUser.photoURL || profile} alt="profile" className="profile-picture" />
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
                      onClick={confirmLogout}
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
                  <div className="d-flex justify-content-start">
                    <h1 className="me-2">Pacientes</h1>
                    <button
                      variant="primary"
                      className="btn button-main m-2"
                      onClick={() => setModalShow(true)}
                    >
                      Nuevo
                    </button>
                  </div>
                  <table className="table__body">
                    <thead>
                      <tr>
                        <th>N°</th>
                        <th onClick={() => sorting("apellidoConNombre")} style={{ textAlign: "left" }}>
                          Apellido Y Nombres
                        </th>
                        <th onClick={() => sorting("idc")}>IDC</th>
                        <th onClick={() => sorting("fechaNacimiento")}>
                          Fecha Nacimiento
                        </th>
                        <th onClick={() => sorting("numero")}>Telefono</th>
                        <th id="columnaAccion"></th>
                      </tr>
                    </thead>

                    <tbody>
                      {results.map((client, index) => (
                        <tr key={client.id}>
                          <td>{results.length - index}</td>
                          <td style={{ textAlign: "left" }}>
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

                          <td id="columnaAccion">
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="primary"
                                className="btn btn-secondary mx-1 btn-md"
                                id="dropdown-actions"
                              >
                                <i className="fa-solid fa-ellipsis-vertical"></i>
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
                                  <Link to={`/historial/${client.id}`} style={{ textDecoration: "none", color: "#212529" }}>
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
                                  <i className="fa-solid fa-plus"></i>
                                  Crear Cita
                                </Dropdown.Item>

                                <Dropdown.Item
                                  onClick={() => {
                                    confirmeDelete(client.id);
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