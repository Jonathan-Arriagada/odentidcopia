import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Navigation from "../Navigation";
import { collection, updateDoc, doc, orderBy, query, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import CreateTarifa from "./CreateTarifa";
import EditTarifa from "./EditTarifa";
import { FaSignOutAlt, FaBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import profile from "../../img/profile.png";
import { Dropdown } from "react-bootstrap";
import "../../style/Main.css";

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
  const { currentUser, } = useContext(AuthContext);

  const tarifasCollectiona = collection(db, "tarifas");
  const tarifasCollection = useRef(query(tarifasCollectiona, orderBy("codigo")));

  const navigate = useNavigate()

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  let filteredResults = [];
  if (!search) {
    filteredResults = tarifas;
  } else {
    filteredResults = tarifas.filter(
      (dato) =>
        dato.tratamiento.toLowerCase().includes(search.toLowerCase()) ||
        dato.codigo.toString().includes(search.toString())
    );
  }

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = filteredResults.slice(startIndex, endIndex);

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
        ) : (<div className="w-100">
          <nav className="navbar">
            <div className="d-flex justify-content-between w-100 px-2">
              <div className="search-bar w-50">
                <input
                  value={search}
                  onChange={searcher}
                  type="text"
                  placeholder="Buscar..."
                  className="form-control-upNav  m-2"
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
          <div className="container mt-2 mw-100">
            <div className="row">
              <div className="col">
                <br></br>
                <div className="d-grid gap-2">
                  <div className="d-flex justify-content-start">
                    <h1 className="me-2">Tarifario</h1>
                    <div className="d-flex justify-content-start">
                      {userType === process.env.REACT_APP_rolAdCon ? (
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

                <div className="table__container">
                  <table className="table__body">
                    <thead>
                      <tr>
                        <th onClick={() => sorting("codigo")}>Código</th>
                        <th style={{ textAlign: "left" }}>Tratamiento</th>
                        <th>Tarifa</th>
                        {userType === process.env.REACT_APP_rolAdCon ? <th id="columnaAccion"></th> : null}
                      </tr>
                    </thead>

                    <tbody>
                      {currentResults.map((tarifa) => (
                        <tr
                          key={tarifa.id}
                          className={tarifa.eliminado ? "deleted-row" : ""}
                        >
                          <td id="colIzquierda"> {tarifa.codigo} </td>
                          <td style={{ textAlign: "left" }}> {tarifa.tratamiento}</td>
                          <td> {tarifa.tarifa} </td>
                          {userType === process.env.REACT_APP_rolAdCon ? (
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

                                <Dropdown.Menu style={{ textAlign: "center" }}>
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
                                    style={{ marginLeft: "2px", background: "#E6E6E6" }}
                                  >
                                    {" "}
                                    <i className="fa-solid fa-power-off"></i>{" "}
                                  </button>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          ) : null}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="table__footer">
                  <div className="table__footer-left">
                    Mostrando {startIndex + 1} - {Math.min(endIndex, tarifas.length)} de {tarifas.length}
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
