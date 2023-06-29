import React, { useCallback, useEffect, useRef, useState } from "react";
import { collection, orderBy, query, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db, } from "../../firebaseConfig/firebase";
import CrearUsuario from "./CrearUsuario";
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
    await updateDoc(userDoc, { rol: process.env.REACT_APP_rolRecepcionis });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(userCollection.current, getUsuarios);
    return unsubscribe;
  }, [getUsuarios]);

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
    filteredResults = usuarios;
  } else {
    filteredResults = usuarios.filter(
      (dato) =>
        dato.apellido.toLowerCase().includes(search.toLowerCase()) ||
        dato.codigo.toString().includes(search.toString())
    );
  }

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = filteredResults.slice(startIndex, endIndex);

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
      {isLoading ? (
        <div className="w-100">
          <span className="loader position-absolute start-50 top-50 mt-3"></span>
        </div>
      ) : (
        <div className="w-100">
          <div className="search-bar d-flex col-2 m-2 ms-3 w-50">
            <input
              value={search}
              onChange={searcher}
              type="text"
              placeholder="Buscar..."
              className="form-control-upNav  m-2"
            />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>

          <div className="container mw-100">
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
                        Agregar Usuario
                      </button>
                    </div>
                  </div>
                </div>
                <div className="table__container">
                  <table className="table__body">
                    <thead>
                      <tr>
                        <th onClick={() => sorting("codigo")}>Código</th>
                        <th onClick={() => sorting("apellido")}>Apellido</th>
                        <th onClick={() => sorting("nombres")}>Nombres</th>
                        <th onClick={() => sorting("correo")}>Email</th>
                        <th onClick={() => sorting("telefono")}>Telefono</th>
                        <th onClick={() => sorting("fechaAlta")}>Fecha Agregado</th>
                        <th onClick={() => sorting("rol")}>Rol</th>
                        <th>Accion</th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentResults.map((usuario) => (
                        <tr key={usuario.id}
                          className={usuario.rol === process.env.REACT_APP_rolBloq ? "deleted-row" : usuario.rol === process.env.REACT_APP_rolAd ? "admin-row" : ""}
                        >
                          <td id="colIzquierda"> {usuario.codigo} </td>
                          <td> {usuario.apellido}</td>
                          <td> {usuario.nombres}</td>
                          <td> {usuario.correo} </td>
                          <td> {usuario.telefono} </td>
                          <td> {usuario.fechaAlta}</td>
                          <td>{usuario.rol === process.env.REACT_APP_rolAd ? 'Admin' : usuario.rol === process.env.REACT_APP_rolRecepcionis ? 'Recepcionista' : usuario.rol === process.env.REACT_APP_rolDoctor ? 'Doctor' : ''}</td>
                          <td className="colDerecha">
                            {usuario.rol !== process.env.REACT_APP_rolAd && (
                              <>
                                <button
                                  onClick={() => {
                                    disableUsuario(usuario.id);
                                  }}
                                  className="btn btn-danger"
                                  disabled={
                                    disabledRows.includes(usuario.id) ||
                                    usuario.rol === process.env.REACT_APP_rolBloq ||
                                    usuario.rol === process.env.REACT_APP_rolAd
                                  }
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                                <button
                                  onClick={() => {
                                    enableUsuario(usuario.id);
                                  }}
                                  className="btn btn-light"
                                  disabled={
                                    disabledRows.includes(usuario.id) ||
                                    usuario.rol === process.env.REACT_APP_rolRecepcionis ||
                                    usuario.rol === process.env.REACT_APP_rolAd ||
                                    usuario.rol === process.env.REACT_APP_rolDoctor
                                  }
                                  style={{ marginLeft: "2px" }}
                                >
                                  <i className="fa-solid fa-power-off"></i>{" "}
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="table__footer">
                  <div className="table__footer-left">
                    Mostrando {startIndex + 1} - {Math.min(endIndex, usuarios.length)} de {usuarios.length}
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
      <CrearUsuario show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default PanelAdmin;
