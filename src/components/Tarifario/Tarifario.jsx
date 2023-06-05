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
      confirmButtonText: 'Si, cerrar sesión',
      confirmButtonColor: '#00C5C1',
      denyButtonText: `No, seguir logueado`,
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
        ) : (<div className="w-100">
          <nav className="navbar">
            <div className="d-flex justify-content-between w-100 px-2">
              <div className="search-bar w-50">
                <input
                  value={search}
                  onChange={searcher}
                  type="text"
                  placeholder="Buscar por Codigo o Tratamiento..."
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

                <table className="table__body">
                  <thead>
                    <tr>
                      <th onClick={() => sorting("codigo")}>Código</th>
                      <th>Tratamiento</th>
                      <th>Tarifa</th>
                      {userType === process.env.REACT_APP_rolAdCon ? <th id="columnaAccion"></th> : null}
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((tarifa) => (
                      <tr
                        key={tarifa.id}
                        className={tarifa.eliminado ? "deleted-row" : ""}
                      >
                        <td> {tarifa.codigo} </td>
                        <td> {tarifa.tratamiento}</td>
                        <td> {tarifa.tarifa} </td>
                        {userType === process.env.REACT_APP_rolAdCon ? (
                          <td id="columnaAccion" >
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="primary"
                                className="btn btn-secondary mx-1 btn-md"
                                id="dropdown-actions"
                              >
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                              </Dropdown.Toggle>

                              <Dropdown.Menu style={{textAlign: "center"}}>
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
