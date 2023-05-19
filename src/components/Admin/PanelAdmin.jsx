import React, { useCallback, useEffect, useRef, useState } from "react";
import Navigation from "../Navigation";
import { collection, orderBy, query, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db, } from "../../firebaseConfig/firebase";
import CrearAsistente from "./CrearAsistente";
import "../Pacientes/Show.css"
import "../Utilidades/loader.css";
import "../Utilidades/tablas.css";

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
    await updateDoc(userDoc, { rol: "Ks3n7p9Rv2wT" });
  };

  const enableUsuario = async (id) => {
    const userDoc = doc(db, "user", id);
    await updateDoc(userDoc, { rol: "yS3tEzgK9Qp7"});
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
          <div className="container mt-2 mw-100">
            <div className="row">
              <div className="col">
                <div className="d-grid gap-2">
                  <div className="d-flex">
                    <h1>Panel Administrador</h1>
                  </div>
                  <div className="d-flex justify-content-between">
                    <input
                      value={search}
                      onChange={searcher}
                      type="text"
                      placeholder="Buscar por Apellido, Nombres o Codigo..."
                      className="form-control m-2 w-25"
                    />
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
                      className={usuario.rol === "Ks3n7p9Rv2wT" ? "deleted-row" : usuario.rol === "RmTnUw1iPj5q" ? "admin-row" : ""}
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
                                usuario.rol === "Ks3n7p9Rv2wT" || usuario.rol === "RmTnUw1iPj5q"
                              }
                            >
                              <i className="fa-solid fa-trash"></i>
                              </button>
                          <button
                              onClick={() => {
                                enableUsuario(usuario.id);
                              }}
                              className="btn btn-light"
                              disabled={disabledRows.includes(usuario.id) || usuario.rol === "yS3tEzgK9Qp7" || usuario.rol === "RmTnUw1iPj5q"}
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
        )}
      </div>
      <CrearAsistente show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default PanelAdmin;
