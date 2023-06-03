import React, { useCallback, useEffect, useRef, useState } from "react";
import Navigation from "../Navigation";
import { collection, orderBy, query, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db, } from "../../firebaseConfig/firebase";
import CrearAsistente from "./CrearAsistente";
import { FaSignOutAlt, FaUser, FaBell } from "react-icons/fa";
import { getAuth, signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import "../../style/Main.css"

function PanelAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("ASC");
  const [modalShow, setModalShow] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [disabledRows] = useState([]);

  const userCollectiona = collection(db, "user");
  const userCollection = useRef(query(userCollectiona, orderBy("codigo")));

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

  const getUsuarios = useCallback((snapshot) => {
    const usuariosArray = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setUsuarios(usuariosArray);
    setIsLoading(false);
  }, []);

  const disableUsuario = async (id) => {
    const userDoc = doc(db, "user", id);
    await updateDoc(userDoc, { rol: process.env.REACT_APP_rolBloq });
  };

  const enableUsuario = async (id) => {
    const userDoc = doc(db, "user", id);
    await updateDoc(userDoc, { rol: process.env.REACT_APP_rolAsi });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(userCollection.current, getUsuarios);
    return unsubscribe;
  }, [getUsuarios]);

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  let results = [];
  if (!search) {
    results = usuarios;
  } else {
    results = usuarios.filter(
      (dato) =>
        dato.apellidoConNombre.toLowerCase().includes(search.toLowerCase()) ||
        dato.codigo.toString().includes(search.toString())
    );
  }

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...usuarios].sort((a, b) =>
        a[col].toString() > b[col].toString() ? 1 : -1
      );
      setUsuarios(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...usuarios].sort((a, b) =>
        a[col].toString() < b[col].toString() ? 1 : -1
      );
      setUsuarios(sorted);
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
              <div className="d-flex justify-content-between w-100 px-2">
                <div className="search-bar w-50">
                  <input
                    value={search}
                    onChange={searcher}
                    type="text"
                    placeholder="Buscar por Apellido, Nombres o Codigo..."
                    className="form-control m-2"
                  />
                </div>
                <div className="col d-flex justify-content-end align-items-center right-navbar">
                  <p className="fw-bold mb-0" style={{ marginRight: "20px" }}>
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
            <div className="container mt-2 mw-100">
              <div className="row">
                <div className="col">
                  <br></br>
                  <div className="d-grid gap-2">
                    <div className="d-flex justify-content-between">
                      <h1>Panel Administrador</h1>

                      <div className="d-flex justify-content-end">
                        <button
                          variant="primary"
                          className="btn-blue m-2"
                          onClick={() => {
                            setModalShow(true);
                          }}
                        >
                          Agregar Asistente
                        </button>
                      </div>
                    </div>
                  </div>
                  <table className="table__body">
                    <thead>
                      <tr>
                        <th onClick={() => sorting("codigo")}>Código</th>
                        <th onClick={() => sorting("apellidoConNombre")}>Apellido y Nombres</th>
                        <th onClick={() => sorting("correo")}>Email</th>
                        <th onClick={() => sorting("telefono")}>Telefono</th>
                        <th onClick={() => sorting("fechaAlta")}>Fecha Agregado</th>
                        <th>Accion</th>
                      </tr>
                    </thead>

                    <tbody>
                      {results.map((usuario) => (
                        <tr key={usuario.id}
                          className={usuario.rol === process.env.REACT_APP_rolBloq ? "deleted-row" : usuario.rol === process.env.REACT_APP_rolAd ? "admin-row" : ""}
                        >
                          <td> {usuario.codigo} </td>
                          <td> {usuario.apellidoConNombre}</td>
                          <td> {usuario.correo} </td>
                          <td> {usuario.telefono} </td>
                          <td> {usuario.fechaAlta}</td>
                          <td>
                            <button
                              onClick={() => {
                                disableUsuario(usuario.id);
                              }}
                              className="btn btn-danger"
                              disabled={
                                disabledRows.includes(usuario.id) ||
                                usuario.rol === process.env.REACT_APP_rolBloq || usuario.rol === process.env.REACT_APP_rolAd
                              }
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                            <button
                              onClick={() => {
                                enableUsuario(usuario.id);
                              }}
                              className="btn btn-light"
                              disabled={disabledRows.includes(usuario.id) || usuario.rol === process.env.REACT_APP_rolAsi || usuario.rol === process.env.REACT_APP_rolAd}
                              style={{ marginLeft: "2px" }}
                            >
                              {" "}
                              <i className="fa-solid fa-power-off"></i>{" "}
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
        )}
      </div>
      <CrearAsistente show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default PanelAdmin;
