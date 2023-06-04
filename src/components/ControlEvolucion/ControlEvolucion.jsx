import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import Navigation from "../Navigation";
import EditControlEvolucion from "./EditControlEvolucion";
import moment from "moment";
import { FaSignOutAlt, FaUser, FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { Modal } from "react-bootstrap";
import "../../style/Main.css";
import Swal from "sweetalert2";

const ControlEvolucion = () => {
    const [controles, setControles] = useState([]);
    const [search, setSearch] = useState("");
    const [modalShowEditar, setModalShowEditar] = useState(false);
    const [order, setOrder] = useState("ASC");
    const [control, setControl] = useState([]);
    const [idParam, setIdParam] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [modalShowVerDetalle, setModalShowVerDetalle] = useState(false);

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

    const controlesCollectiona = collection(db, "controlEvoluciones");
    const controlesCollection = useRef(query(controlesCollectiona, orderBy("fechaControlRealizado", "desc"))
    );

    const getControles = useCallback((snapshot) => {
        const controlesArray = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));
        setControles(controlesArray);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(controlesCollection.current, getControles);
        return unsubscribe;
    }, [getControles]);

    const deleteControl = async (id) => {
        const clientDoc = doc(db, "controlEvoluciones", id);
        await deleteDoc(clientDoc);
        setControles((prevControl) =>
            prevControl.filter((control) => control.id !== id)
        );
    };

    const confirmeDelete = (id) => {
        Swal.fire({
          title: '¿Esta seguro?',
          text: "No podra revertir la accion",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si' ,
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.isConfirmed) {
            deleteControl(id)
            Swal.fire(
              '¡Borrado!',
              'Control y evolucion borrada.',
              'success'
            )
          }
        })
    }

    const searcher = (e) => {
        setSearch(e.target.value);
    };

    let results = [];

    if (!search) {
        results = controles;
    } else {
        results = controles.filter(
            (dato) =>
                dato.apellidoConNombre.toLowerCase().includes(search.toLowerCase()) ||
                dato.idc.toString().includes(search.toString())
        );
    }

    const sorting = (col) => {
        if (order === "ASC") {
            const sorted = [...controles].sort((a, b) => {
                const valueA =
                    typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
                const valueB =
                    typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
                return valueA > valueB ? 1 : -1;
            });
            setControles(sorted);
            setOrder("DSC");
        }
        if (order === "DSC") {
            const sorted = [...controles].sort((a, b) => {
                const valueA =
                    typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
                const valueB =
                    typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
                return valueA < valueB ? 1 : -1;
            });
            setControles(sorted);
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
                                        placeholder="Buscar por Apellido y Nombres o IDC..."
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
                        <div className="container mw-100">
                            <div className="row">
                                <div className="col">
                                    <br></br>
                                    <div className="d-flex justify-content-between">
                                        <h1>Control y Evoluciones</h1>
                                    </div>
                                    <table className="table__body">
                                        <thead>
                                            <tr>
                                                <th>N°</th>
                                                <th onClick={() => sorting("apellidoConNombre")}>
                                                    Apellido Y Nombres
                                                </th>
                                                <th onClick={() => sorting("idc")}>IDC</th>
                                                <th onClick={() => sorting("tratamiento")}>Tratamiento</th>
                                                <th onClick={() => sorting("pieza")}>Pieza</th>
                                                <th onClick={() => sorting("doctor")}>Doctor</th>
                                                <th onClick={() => sorting("fechaControlRealizado")}>Fecha</th>
                                                <th>Accion</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {results.map((control, index) => (
                                                <tr key={control.id}>
                                                    <td>{results.length - index}</td>
                                                    <td> {control.apellidoConNombre} </td>
                                                    <td> {control.idc} </td>
                                                    <td> {control.tratamientoControl} </td>
                                                    <td> {control.pieza} </td>
                                                    <td> {control.doctor} </td>
                                                    <td>
                                                        {moment(control.fechaControlRealizado).format(
                                                            "DD/MM/YY"
                                                        )}
                                                    </td>

                                                    <td style={{ padding: "10px" }}>
                                                        <button
                                                            variant="primary"
                                                            className="btn btn-secondary mx-1"
                                                            onClick={() => {
                                                                setModalShowVerDetalle([
                                                                    true,
                                                                    control.detalleTratamiento,
                                                                ]);
                                                            }}>
                                                            <i className="fa-regular fa-comment"></i> Ver
                                                            Notas
                                                        </button>
                                                        <button
                                                            variant="primary"
                                                            className="btn btn-success mx-1"
                                                            onClick={() => {
                                                                setModalShowEditar(true);
                                                                setControl(control);
                                                                setIdParam(control.id);
                                                            }}
                                                        >
                                                            <i className="fa-regular fa-pen-to-square"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                confirmeDelete(control.id);
                                                            }}
                                                            variant="primary"
                                                            className="btn btn-danger mx-1"
                                                        >
                                                            <i className="fa-solid fa-trash-can"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {modalShowVerDetalle[0] && (
                                        <Modal
                                            show={modalShowVerDetalle[0]}
                                            size="lg"
                                            aria-labelledby="contained-modal-title-vcenter"
                                            centered
                                            onHide={() => setModalShowVerDetalle([false, ""])}
                                        >
                                            <Modal.Header
                                                closeButton
                                                onClick={() => setModalShowVerDetalle([false, ""])}
                                            >
                                                <Modal.Title>Detalle</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <div className="container">
                                                    <div className="col">
                                                        <form>
                                                            <div className="row">
                                                                <div className="col mb-6">
                                                                    <p>{modalShowVerDetalle[1]}</p>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </Modal.Body>
                                        </Modal>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div >

            <EditControlEvolucion
                id={idParam}
                control={control}
                show={modalShowEditar}
                onHide={() => setModalShowEditar(false)}
            />
        </>
    );
};

export default ControlEvolucion;