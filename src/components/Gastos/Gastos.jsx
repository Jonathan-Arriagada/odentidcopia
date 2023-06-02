import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import Navigation from "../Navigation";
import EditGasto from "./EditGasto";
import CrearGasto from "./CrearGasto";
import TipoGasto from "./Parametros/TipoGasto";
import moment from "moment";
import { getAuth, signOut } from "firebase/auth";
import { FaUser, FaBell, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../style/Main.css";

const Gastos = () => {
    const [gastos, setGastos] = useState([]);
    const [search, setSearch] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [modalShowEdit, setModalShowEdit] = useState(false);
    const [order, setOrder] = useState("ASC");
    const [gasto, setGasto] = useState([]);
    const [idParam, setIdParam] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const gastosCollectiona = collection(db, "gastos");
    const gastosCollection = useRef(query(gastosCollectiona, orderBy("fechaGasto", "desc")));

    const [mostrarAjustes, setMostrarAjustes] = useState(false);
    const [modalShowTipoGasto, setModalShowTipoGasto] = useState(false);
    const [userType, setUserType] = useState("");

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

    const getGastos = useCallback((snapshot) => {
        const gastosArray = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));
        setGastos(gastosArray);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const type = localStorage.getItem("rol");
        setUserType(type);

        const unsubscribe = onSnapshot(gastosCollection.current, getGastos);
        return unsubscribe;

    }, [getGastos]);

    const deleteGasto = async (id) => {
        const gastoDoc = doc(db, "gastos", id);
        await deleteDoc(gastoDoc);
        setGastos((prevGastos) => prevGastos.filter((gasto) => gasto.id !== id));
    };

    const searcher = (e) => {
        setSearch(e.target.value);
    };

    let results = [];

    if (!search) {
        results = gastos;
    } else {
        results = gastos.filter(
            (dato) =>
                dato.proveedor.toLowerCase().includes(search.toLowerCase()) ||
                dato.ruc.toString().includes(search.toString())
        );
    }

    const sorting = (col) => {
        if (order === "ASC") {
            const sorted = [...gastos].sort((a, b) => {
                const valueA = typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
                const valueB = typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
                return valueA > valueB ? 1 : -1;
            });
            setGastos(sorted);
            setOrder("DSC");
        }
        if (order === "DSC") {
            const sorted = [...gastos].sort((a, b) => {
                const valueA = typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
                const valueB = typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
                return valueA < valueB ? 1 : -1;
            });
            setGastos(sorted);
            setOrder("ASC");
        }
    };

    function funcMostrarAjustes() {
        if (mostrarAjustes) {
            setMostrarAjustes(false);
        } else {
            setMostrarAjustes(true);
        }
    }

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
                                <div className="search-bar w-75">
                                    <input
                                        value={search}
                                        onChange={searcher}
                                        type="text"
                                        placeholder="Buscar por Proveedor o RUC..."
                                        className="form-control m-2 w-25"
                                    />
                                </div>
                                <div className="d-flex justify-content-between w-25 align-items-center">
                                    <p className="fw-bold mb-0" style={{ marginLeft: "-20px" }}>Bienvenido al sistema Odentid</p>
                                    <div className="d-flex">
                                        <div className="notificacion">
                                            <Link to="/miPerfil" className="text-decoration-none" style={{ color: "#b8b7b8" }}>
                                                <FaUser className="icono" />
                                            </Link>
                                        </div>
                                        <div className="notificacion">
                                            <FaBell className="icono" />
                                            <span className="badge rounded-pill bg-danger">
                                                5
                                            </span>
                                        </div>
                                    </div>
                                    <div className="notificacion">
                                        <Link to="/" className="text-decoration-none" style={{ color: "#b8b7b8" }} onClick={logout}>
                                            <FaSignOutAlt className="icono" />
                                            <span>Logout</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </nav>
                        <div className="container m-2 mw-100">
                            <div className="row">
                                <div className="col">
                                    <br></br>
                                    <div className="d-flex justify-content-between">
                                        <div
                                            className="d-flex justify-content-center align-items-center"
                                            style={{ maxHeight: "40px", marginLeft: "10px" }}
                                        >
                                            <h1>Gastos</h1>
                                            {userType === process.env.REACT_APP_rolAdCon ? (
                                                <button
                                                    className="btn btn-dark mx-2 btn-sm"
                                                    style={{ borderRadius: "5px" }}
                                                    onClick={() => {
                                                        funcMostrarAjustes(true);
                                                    }}
                                                >
                                                    <i className="fa-solid fa-gear"></i>
                                                </button>
                                            ) : null}
                                        </div>
                                        <div className="col d-flex justify-content-end">
                                            <button
                                                variant="primary"
                                                className="btn-blue m-2"
                                                onClick={() => setModalShow(true)}
                                            >
                                                Nuevo
                                            </button>
                                            {mostrarAjustes && (
                                                <div className="d-flex">
                                                    <button
                                                        variant="secondary"
                                                        className="btn-blue m-2"
                                                        onClick={() => setModalShowTipoGasto(true)}
                                                    >
                                                        Tipo Gasto
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>


                                    <table className="table__body">
                                        <thead>
                                            <tr>
                                                <th onClick={() => sorting("fechaGasto")}>Fecha</th>
                                                <th onClick={() => sorting("ruc")}>RUC</th>
                                                <th onClick={() => sorting("proveedor")}>Proveedor</th>
                                                <th onClick={() => sorting("tipoGasto")}>Tipo</th>
                                                <th onClick={() => sorting("comprobanteGasto")}>Comprobante</th>
                                                <th onClick={() => sorting("cantArticulo")}>Cantidad</th>
                                                <th onClick={() => sorting("umArticulo")}>U.M.</th>
                                                <th onClick={() => sorting("cuentaArticulo")}>Cuenta</th>
                                                <th onClick={() => sorting("descripArticulo")}>Descripcion</th>
                                                <th onClick={() => sorting("precioUniArticulo")}>Precio Uni</th>
                                                <th onClick={() => sorting("subTotalArticulo")}>SubTotal</th>
                                                <th>Accion</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {results.map((gasto) => (
                                                <tr key={gasto.id}>
                                                    <td>{moment(gasto.fechaGasto).format("DD-MM-YY")}</td>
                                                    <td> {gasto.ruc} </td>
                                                    <td> {gasto.proveedor} </td>
                                                    <td> {gasto.tipoGasto} </td>
                                                    <td> {gasto.comprobanteGasto} </td>
                                                    <td> {gasto.cantArticulo} </td>
                                                    <td> {gasto.umArticulo} </td>
                                                    <td> {gasto.cuentaArticulo} </td>
                                                    <td> {gasto.descripArticulo} </td>
                                                    <td> {gasto.precioUniArticulo} </td>
                                                    <td> {gasto.subTotalArticulo} </td>
                                                    <td>
                                                        <button
                                                            variant="primary"
                                                            className="btn btn-success mx-1"
                                                            onClick={() => {
                                                                setModalShowEdit(true);
                                                                setGasto(gasto);
                                                                setIdParam(gasto.id);
                                                            }}
                                                        >
                                                            <i className="fa-regular fa-pen-to-square"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                deleteGasto(gasto.id);
                                                            }}
                                                            className="btn btn-danger mx-1"
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

            <CrearGasto show={modalShow} onHide={() => setModalShow(false)} />
            <EditGasto
                id={idParam}
                gasto={gasto}
                show={modalShowEdit}
                onHide={() => setModalShowEdit(false)}
            />
            <TipoGasto
                show={modalShowTipoGasto}
                onHide={() => setModalShowTipoGasto(false)}
            />
        </>
    );
};

export default Gastos;