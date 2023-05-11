import React, { useCallback, useEffect, useRef, useState } from "react";
import Navigation from "../Navigation";
import { collection, deleteDoc, doc, orderBy, query, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import CrearAsistente from "./CrearAsistente";
import EditarAsistente from "./EditarAsistente";
import "../Pacientes/Show.css"
import "../Utilidades/loader.css";
import "../Utilidades/tablas.css";
import moment from 'moment';


function PanelAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("ASC");
  const [modalShow, setModalShow] = useState(false);
  const [modalShowEdit, setModalShowEdit] = useState(false);
  const [usuario, setUsuario] = useState([]);
  const [idParam, setIdParam] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const unsubscribe = onSnapshot(userCollection.current, getUsuarios);
    return unsubscribe;
  }, [getUsuarios]);


  const deleteUsuario = async (id) => {
    const usuarioDoc = doc(db, "user", id);
    await deleteDoc(usuarioDoc);
    setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.id !== id));
  };

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
                      <th>Apellido y Nombres</th>
                      <th>Email</th>
                      <th>Telefono</th>
                      <th>Fecha Agregado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((cita) => (
                      <tr key={cita.id}>
                        <td> {usuario.codigo} </td>
                        <td> {usuario.apellidoConNombre}</td>
                        <td> {usuario.correo} </td>
                        <td> {usuario.telefono} </td>
                        <td>{moment(usuario.fechaAgregado).format('DD/MM/YY')}</td>
                        <td>
                        <button
                            variant="primary"
                            className="btn btn-success mx-1"
                            onClick={() => {
                            setModalShowEdit(true);
                              setUsuario(usuario);
                              setIdParam(usuario.id);
                            }}
                          >
                            <i className="fa-regular fa-pen-to-square"></i>
                          </button>
                          <button
                            onClick={() => {
                              deleteUsuario(usuario.id);
                            }}
                            className="btn btn-danger"
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
      {/*<EditarAsistente
        id={idParam}
        usuario={usuario}
        show={modalShowEdit}
        onHide={() => setModalShowEdit(false)}
      />*/}
    </>
  );
}

export default PanelAdmin;
