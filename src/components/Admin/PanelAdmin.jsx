import React, { useCallback, useEffect, useRef, useState } from "react";
import Navigation from "../Navigation";
import { collection, orderBy, query, onSnapshot } from "firebase/firestore";
import { deleteUser, getAuth } from "firebase/auth";
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

  const userCollectiona = collection(db, "user");
  const userCollection = useRef(query(userCollectiona, orderBy("codigo")));
  const auth = getAuth();



  const getUsuarios = useCallback((snapshot) => {
    const usuariosArray = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setUsuarios(usuariosArray);
    setIsLoading(false);
  }, []);

  const eliminarUsuario = async (userId) => {
    try {
      await deleteUser(auth, userId);
      console.log("Usuario eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
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
                      <tr key={usuario.id}>
                        <td> {usuario.codigo} </td>
                        <td> {usuario.apellidoConNombre}</td>
                        <td> {usuario.correo} </td>
                        <td> {usuario.telefono} </td>
                        <td> {usuario.fechaAlta}</td>
                        <td>
                        <button
                            className="btn btn-danger mx-1"
                            onClick={() => eliminarUsuario(usuario.id)}
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
        )}
      </div>
      <CrearAsistente show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default PanelAdmin;
