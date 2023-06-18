import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import { Modal } from "react-bootstrap";
import Navigation from "../../Navigation.jsx";
import { addDoc, collection, doc, setDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebaseConfig/firebase.js";
import { onSnapshot } from "firebase/firestore";
import { FaBell, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext.js";
import profile from "../../../img/icono.png";

const Proveedores = () => {
  const [ruc, setRuc] = useState("");
  const [valorBusquedaProveedor, setValorBusquedaProveedor] = useState("");

  const [editIndex, setEditIndex] = useState(null);
  const [proveedor, setProveedor] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [modalShowGestionProveedores, setModalShowGestionProveedores] = useState(false);
  const [search, setSearch] = useState("");
  const { currentUser, } = useContext(AuthContext);

  const proveedoresCollection = collection(db, "proveedores");
  const proveedoresCollectionOrdenados = useRef(query(proveedoresCollection, orderBy("name")));
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

  const updateProveedoresFromSnapshot = useCallback((snapshot) => {
    const proveedoresArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProveedores(proveedoresArray);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      proveedoresCollectionOrdenados.current,
      updateProveedoresFromSnapshot
    );
    return unsubscribe;
  }, [updateProveedoresFromSnapshot]);

  const inputRef = useRef(null);

  const rucExiste = (ruc) => {
    return proveedores.some(
      (proveedor) => proveedor.ruc.toString() === ruc.toString()
    );
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (proveedor.trim() === "" || ruc.trim() === "") {
      setError("Denominacion/RUC no pueden estar vacíos");
      return;
    }
    if (rucExiste(ruc)) {
      setError("El RUC ya existe");
      return;
    }
    const newState = {
      ruc: ruc,
      name: proveedor,
      valorBusquedaProveedor: valorBusquedaProveedor,
    };
    addDoc(proveedoresCollection, newState).then(() => {
      setError("");
    });
    handleCloseModal();
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setProveedor(proveedores[index].name);
    setRuc(proveedores[index].ruc);
    setValorBusquedaProveedor(proveedores[index].valorBusquedaProveedor);
    setError("");
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (proveedor.trim() === "" || ruc.trim() === "") {
      setError("Denominacion/RUC no pueden estar vacíos");
      return;
    }
    const proveedorToUpdate = proveedores[editIndex];
    const newState = {
      ruc: ruc,
      name: proveedor,
      valorBusquedaProveedor: valorBusquedaProveedor,
    };
    setDoc(doc(proveedoresCollection, proveedorToUpdate.id), newState).then(
      () => {
        setError("");
      }
    );
    handleCloseModal();
  };

  const handleDelete = async (index) => {
    await deleteDoc(doc(proveedoresCollection, proveedores[index].id));
    const newStates = proveedores.filter((_, i) => i !== index);
    setProveedores(newStates);
    setProveedor("");
    setError("");
  };

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  let results = [];

  if (!search) {
    results = proveedores;
  } else {
    results = proveedores.filter(
      (dato) =>
        dato.name.toLowerCase().includes(search.toLowerCase()) ||
        dato.ruc.toString().includes(search.toString())
    );
  }

  const handleCloseModal = () => {
    setEditIndex(null);
    setProveedor("");
    setRuc("");
    setValorBusquedaProveedor("");
    setModalShowGestionProveedores(false);
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
                <div className="search-bar">
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
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ maxHeight: "40px", marginLeft: "10px" }}
                      >
                        <h1 className="me-2">Proveedores</h1>
                      </div>
                      <div className="col d-flex justify-content-star">
                        <button
                          variant="primary"
                          className="btn-blue m-2"
                          onClick={() => {
                            setEditIndex(null);
                            setModalShowGestionProveedores(true);
                          }}
                        >
                          Nuevo
                        </button>
                      </div>
                    </div>
                  </div>

                  <table className="table__body">
                    <thead>
                      <tr>
                        <th>RUC</th>
                        <th style={{ textAlign: "left" }}>Denominacion o Nombre Proveedor</th>
                        <th>Accion</th>
                      </tr>
                    </thead>

                    <tbody>
                      {results.map((proveedor, index) => (
                        <tr key={proveedor.id}>
                          <td>{proveedor.ruc}</td>
                          <td style={{ textAlign: "left" }}>{proveedor.name}</td>
                          <td>
                            <button
                              className="btn btn-success mx-1 btn-sm"
                              onClick={() => {
                                setModalShowGestionProveedores(true);
                                handleEdit(index);
                              }}
                            >
                              <i className="fa-solid fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                handleDelete(index);
                              }}
                            >
                              <i className="fa-solid fa-trash-can"></i>
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

      {modalShowGestionProveedores && (
        <Modal
          show={modalShowGestionProveedores}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton onClick={handleCloseModal}>
            <Modal.Title>Crear/Editar Proveedores</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={editIndex !== null ? handleUpdate : handleCreate}>
              <div className="mb-3">
                <label className="form-label">RUC*</label>
                <input
                  type="number"
                  className="form-control"
                  value={ruc}
                  onChange={(e) => {
                    setRuc(e.target.value);
                    setValorBusquedaProveedor(e.target.value + " " + proveedor);
                  }}
                  ref={inputRef}
                />
                {error && <small className="text-danger">{error}</small>}
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Denominacion o Nombre Proveedor*
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={proveedor}
                  onChange={(e) => {
                    setProveedor(e.target.value);
                    setValorBusquedaProveedor(ruc + " " + e.target.value);
                  }}
                  ref={inputRef}
                />
                {error && <small className="text-danger">{error}</small>}
              </div>
              <button className="btn btn-primary" type="submit">
                {editIndex !== null ? "Actualizar" : "Crear"}
              </button>

              {editIndex !== null && (
                <button
                  className="btn btn-secondary mx-2"
                  onClick={() => setEditIndex(null)}
                >
                  Cancelar
                </button>
              )}
            </form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
export default Proveedores;
