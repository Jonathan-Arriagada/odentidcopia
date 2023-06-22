import React, { useContext } from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import Navigation from "../Navigation";
import EditGasto from "./EditGasto";
import CrearGasto from "./CrearGasto";
import TipoGasto from "./Parametros/TipoGasto";
import UnidadesMedidas from "./Parametros/UnidadesMedidas";
import moment from "moment";
import { FaBell, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import profile from "../../img/profile.png";
import { AuthContext } from "../../context/AuthContext";
import { Dropdown } from "react-bootstrap";
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
    const { currentUser, } = useContext(AuthContext);

    const gastosCollectiona = collection(db, "gastos");
    const gastosCollection = useRef(query(gastosCollectiona, orderBy("timestamp", "desc")));

    const [mostrarAjustes, setMostrarAjustes] = useState(false);
    const [modalShowTipoGasto, setModalShowTipoGasto] = useState(false);
    const [modalShowUnidadesMedidas, setModalShowUnidadesMedidas] = useState(false);
    const [userType, setUserType] = useState("");
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    let filteredResults = [];

    if (!search) {
        filteredResults = gastos;
    } else {
        filteredResults = gastos.filter(
            (dato) =>
                dato.proveedor.toLowerCase().includes(search.toLowerCase()) ||
                dato.ruc.toString().includes(search.toString())
        );
    }

    const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentResults = filteredResults.slice(startIndex, endIndex);

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
                                <div className="search-bar w-50">
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
                                    <p className="fw-normal mb-0" style={{ marginRight: "20px" }}>
                                        Hola, {currentUser.displayName}
                                    </p>
                                    <div className="d-flex">
                                        <div className="notificacion">
                                            <FaBell className="icono" />
                                            <span className="badge rounded-pill bg-danger">5</span>
                                        </div>
                                    </div>

                                    <div className="notificacion">
                                        <Dropdown>
                                            <Dropdown.Toggle
                                                variant="primary"
                                                className="btn btn-secondary mx-1 btn-md"
                                                id="dropdown-actions"
                                                style={{ background: "none", border: "none" }}
                                            >
                                                <img
                                                    src={currentUser.photoURL || profile}
                                                    alt="profile"
                                                    className="profile-picture"
                                                />
                                            </Dropdown.Toggle>
                                            <div className="dropdown__container">
                                                <Dropdown.Menu>
                                                    <Dropdown.Item>
                                                        <Link
                                                            to="/miPerfil"
                                                            className="text-decoration-none"
                                                            style={{ color: "#8D93AB" }}
                                                        >
                                                            <i className="icono fa-solid fa-user" style={{ marginRight: "12px" }}></i>
                                                            Mi Perfil
                                                        </Link>
                                                    </Dropdown.Item>

                                                    <Dropdown.Item>

                                                        <Link
                                                            to="/"
                                                            className="text-decoration-none"
                                                            style={{ color: "#8D93AB" }}
                                                            onClick={confirmLogout}
                                                        >
                                                            <FaSignOutAlt className="icono" />
                                                            Cerrar Sesión
                                                        </Link>
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </div>
                                        </Dropdown>
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
                                            <h1>Compras</h1>
                                            {userType === process.env.REACT_APP_rolAdCon ? (
                                                <button
                                                    className="btn grey mx-2 btn-sm"
                                                    style={{ borderRadius: "5px" }}
                                                    onClick={() => {
                                                        funcMostrarAjustes(true);
                                                    }}
                                                >
                                                    <i className="fa-solid fa-gear"></i>
                                                </button>
                                            ) : null}
                                        </div>
                                        <div className="col d-flex justify-content-start">
                                            <button
                                                variant="primary"
                                                className="btn button-main m-2"
                                                onClick={() => setModalShow(true)}
                                            >
                                                Nuevo
                                            </button>
                                            {mostrarAjustes && (
                                                <div className="d-flex">
                                                    <button
                                                        variant="secondary"
                                                        className="btn button-main m-2"
                                                        onClick={() => setModalShowTipoGasto(true)}
                                                    >
                                                        Tipo Compras
                                                    </button>
                                                    <button
                                                        variant="secondary"
                                                        className="btn button-main m-2"
                                                        onClick={() => setModalShowUnidadesMedidas(true)}
                                                    >
                                                        Unidades Medidas
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="table__container">
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
                                                    <th id="columnaAccion"></th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {currentResults.map((gasto) => (
                                                    <tr key={gasto.id}>
                                                        <td id="colIzquierda">{moment(gasto.fechaGasto).format("DD-MM-YY")}</td>
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

                                                                <div className="dropdown__container">
                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item
                                                                            onClick={() => {

                                                                                setModalShowEdit(true);
                                                                                setGasto(gasto);
                                                                                setIdParam(gasto.id);
                                                                            }}
                                                                        >
                                                                            <i className="fa-regular fa-pen-to-square"></i>
                                                                            Editar
                                                                        </Dropdown.Item>

                                                                        <Dropdown.Item
                                                                            onClick={() => {
                                                                                deleteGasto(gasto.id);
                                                                            }}
                                                                        >
                                                                            <i className="fa-solid fa-trash-can"></i>
                                                                            Eliminar
                                                                        </Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </div>
                                                            </Dropdown>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="table__footer">
                                        <div className="table__footer-left">
                                            Mostrando {startIndex + 1} - {Math.min(endIndex, gastos.length)} de {gastos.length}
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
            <UnidadesMedidas
                show={modalShowUnidadesMedidas}
                onHide={() => setModalShowUnidadesMedidas(false)}
            />
        </>
    );
};

export default Gastos;