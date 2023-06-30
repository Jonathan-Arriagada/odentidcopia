import React, { useCallback, useEffect, useRef, useState } from "react";
import { collection, updateDoc, doc, orderBy, query, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import CreateTarifa from "./CreateTarifa";
import EditTarifa from "./EditTarifa";
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

  const tarifasCollectiona = collection(db, "tarifas");
  const tarifasCollection = useRef(query(tarifasCollectiona, orderBy("codigo")));

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
  const itemsPerPage = 50;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  function quitarAcentos(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  let filteredResults = [];
  if (!search) {
    filteredResults = tarifas;
  } else {
    filteredResults = tarifas.filter((dato) => {
      const tratamientoSinAcentos = quitarAcentos(dato.tratamiento);
      const searchSinAcentos = quitarAcentos(search);
      return (
        tratamientoSinAcentos.includes(searchSinAcentos) ||
          dato.codigo.toString().includes(searchSinAcentos)
      );
  });
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

      {isLoading ? (
        <span className="loader position-absolute start-50 top-50 mt-3"></span>
      ) : (<div className="w-100">
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
