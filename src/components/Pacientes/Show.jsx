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
  const [userType, setUserType] = useState("");


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
      confirmButtonText: 'Cerrar sesión',
      confirmButtonColor: '#00C5C1',
      denyButtonText: `Cancelar`,
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
    const type = localStorage.getItem("rol");
    setUserType(type);
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
          title: '¡Eliminado!',
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  let filteredResults = [];

  if (!search) {
    filteredResults = clients;
  } else {
    filteredResults = clients.filter(
      (dato) =>
        dato.apellidoConNombre.toLowerCase().includes(search.toLowerCase()) ||
        dato.idc.toString().includes(search.toString())
    );
  }

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = filteredResults.slice(startIndex, endIndex);

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
                    placeholder="Buscar..."
                    className="form-control-upNav m-2"
                  />
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <div className="col d-flex justify-content-end align-items-center right-navbar">
                  <p className="fw-normal mb-0" style={{ marginRight: "20px" }}>
                    Hola, {currentUser.displayName}
                  </p>
                  <div className="d-flex">
                    <div className="notificacion">
                      <FaBell className="icono" />
                      <span className="badge rounded-pill bg-danger">5</span>
                    </div>
                  </div>

                  <div className="notificacion">
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="primary"
                        className="btn btn-secondary mx-1 btn-md"
                        id="dropdown-actions"
                        style={{ background: "none", border: "none" }}
                      >
                        <img
                          src={currentUser.photoURL || profile}
                          alt="profile"
                          className="profile-picture"
                        />
                      </Dropdown.Toggle>
                      <div className="dropdown__container">
                        <Dropdown.Menu>
                          <Dropdown.Item>
                            <Link
                              to="/miPerfil"
                              className="text-decoration-none"
                              style={{ color: "#8D93AB" }}
                            >
                              <i className="icono fa-solid fa-user" style={{ marginRight: "12px" }}></i>
                              Mi Perfil
                            </Link>
                          </Dropdown.Item>

                          <Dropdown.Item>

                            <Link
                              to="/"
                              className="text-decoration-none"
                              style={{ color: "#8D93AB" }}
                              onClick={confirmLogout}
                            >
                              <FaSignOutAlt className="icono" />
                              Cerrar Sesión
                            </Link>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </div>
                    </Dropdown>
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
                    {userType !== process.env.REACT_APP_rolDoctorCon ? (
                      <button
                        variant="primary"
                        className="btn button-main m-2"
                        onClick={() => setModalShow(true)}
                      >
                        Nuevo
                      </button>
                    ) : null}
                  </div>

                  <div className="table__container">
                    <table className="table__body">
                      <thead>
                        <tr>
                          <th onClick={() => sorting("apellidoConNombre")} style={{ textAlign: "left" }}>
                            Apellido Y Nombres
                          </th>
                          <th onClick={() => sorting("tipoIdc")}>Tipo Doc</th>
                          <th onClick={() => sorting("idc")}>IDC</th>
                          <th onClick={() => sorting("fechaNacimiento")}>
                            Fecha Nacimiento
                          </th>
                          <th onClick={() => sorting("numero")}>Telefono</th>
                          <th id="columnaAccion"></th>
                        </tr>
                      </thead>

                      <tbody>
                        {currentResults.map((client) => (
                          <tr key={client.id}>
                            <td style={{ textAlign: "left" }} id="colIzquierda">
                              <Link to={`/historias/${client.id}`} id="tdConColor">
                                {client.apellidoConNombre}
                              </Link>

                            </td>
                            <td>{client.tipoIdc.toUpperCase()}</td>
                            <td> {client.idc} </td>
                            <td>
                              {moment(client.fechaNacimiento).format(
                                "DD/MM/YY"
                              )}
                            </td>
                            <td> {client.selectedCode}{client.numero}</td>

                            <td id="columnaAccion" className="colDerecha">
                              <Dropdown>
                                <Dropdown.Toggle
                                  variant="primary"
                                  className="btn btn-secondary mx-1 btn-md"
                                  id="dropdown-actions"
                                  style={{ background: "none", border: "none" }}
                                >
                                  <i className="fa-solid fa-ellipsis-vertical" id="tdConColor"></i>
                                </Dropdown.Toggle>

                                <div className="dropdown__container">
                                  <Dropdown.Menu>
                                    <Dropdown.Item>
                                      <Link to={`/historias/${client.id}`} style={{ textDecoration: "none", color: "#212529" }}>
                                        <i className="fa-solid fa-file-medical"></i>
                                        Historia
                                      </Link>
                                    </Dropdown.Item>


                                    {userType !== process.env.REACT_APP_rolDoctorCon ? (
                                      <div>
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
                                            setModalShowEdit(true);
                                            setClient(client);
                                            setIdParam(client.id);
                                          }}
                                        >
                                          <i className="fa-regular fa-pen-to-square"></i>
                                          Editar
                                        </Dropdown.Item>


                                        <Dropdown.Item
                                          onClick={() => {
                                            confirmeDelete(client.id);
                                          }}
                                        >
                                          <i className="fa-solid fa-trash-can"></i>
                                          Eliminar
                                        </Dropdown.Item>
                                      </div>
                                    ) : null}
                                  </Dropdown.Menu>
                                </div>
                              </Dropdown>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="table__footer">
                    <div className="table__footer-left">
                      Mostrando {startIndex + 1} - {Math.min(endIndex, clients.length)} de {clients.length}
                    </div>

                    <div className="table__footer-right">
                      <span>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          style={{ border: "0", background: "none" }}
                        >
                          &lt; Previo
                        </button>
                      </span>

                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        return (
                          <span key={page}>
                            <span
                              onClick={() => handlePageChange(page)}
                              className={page === currentPage ? "active" : ""}
                              style={{
                                margin: "2px",
                                backgroundColor: page === currentPage ? "#003057" : "transparent",
                                color: page === currentPage ? "#FFFFFF" : "#000000",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                cursor: "pointer"
                              }}
                            >
                              {page}
                            </span>
                          </span>
                        );
                      })}

                      <span>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          style={{ border: "0", background: "none" }}
                        >
                          Siguiente &gt;
                        </button>
                      </span>
                    </div>
                  </div>
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