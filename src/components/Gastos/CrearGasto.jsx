import React, { useState, useCallback, useEffect } from "react";
import { collection, getDocs, query, where, onSnapshot, orderBy, doc, writeBatch, addDoc, limit, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";
import moment from "moment";
import "../../style/Main.css";

const CrearGasto = (props) => {
    const hoy = moment(new Date()).format("YYYY-MM-DD");
    const [fechaGasto, setFechaGasto] = useState("");
    const [ruc, setRuc] = useState("");
    const [proveedor, setProveedor] = useState("");
    const [tipoGasto, setTipoGasto] = useState("");
    const [comprobanteGasto, setComprobanteGasto] = useState("");

    const [bloqueado,] = useState(true);
    const [editable, setEditable] = useState(true);
    const [editable2,] = useState(false);

    const [error, setError] = useState("");
    const [tipoGastoOptions, setTipoGastoOptions] = useState([]);
    const [unidadMedidaOptions, setUnidadMedidaOptions] = useState([]);
    const [proveedoresOptions, setProveedoresOptions] = useState([]);
    const [materialesOptions, setMaterialesOptions] = useState([]);

    const [productos, setProductos] = useState([]);
    const [cantArticulo, setCantArticulo] = useState("");
    const [umArticulo, setUmArticulo] = useState("");
    const [descripArticulo, setDescripArticulo] = useState("");
    const [precioUniArticulo, setPrecioUniArticulo] = useState("");
    const [subTotalArticulo, setSubTotalArticulo] = useState("");
    const [cuentaArticulo, setCuentaArticulo] = useState("");

    const [modalAgregarArticuloBoton, setModalAgregarArticuloBoton] = useState(false);
    const [modalAgregarArticulo, setModalAgregarArticulo] = useState(false);
    const [cuenta, setCuenta] = useState('');
    const [um, setUm] = useState('');
    const [material, setMaterial] = useState("");

    const [importeGeneral, setImporteGeneral] = useState(0);

    const materialesCollection = collection(db, "materiales");
    const gastosCollection = collection(db, "gastos");

    const updateOptionsTipoGasto = useCallback(snapshot => {
        const tipoGastoOptions = snapshot.docs.map((doc, index) => (
            <option key={`tipoGasto-${index}`} value={doc.data().name}>{doc.data().name}</option>
        ));
        setTipoGastoOptions(tipoGastoOptions);
    }, []);

    const updateOptionsUnidadMedida = useCallback(snapshot => {
        const unidadMedidaOptions = snapshot.docs.map((doc, index) => (
            <option key={`unidadMedida-${index}`} value={doc.data().name}>{doc.data().name}</option>
        ));
        setUnidadMedidaOptions(unidadMedidaOptions);
    }, []);

    const updateOptionsProveedores = useCallback(snapshot => {
        const proveedoresOptions = snapshot.docs.map((doc, index) => (
            <option key={`proveedores-${index}`} value={doc.data().valorBusquedaProveedor}>{doc.data().valorBusquedaProveedor}</option>
        ));
        setProveedoresOptions(proveedoresOptions);
    }, []);

    const updateOptionsMateriales = useCallback(snapshot => {
        const materialesOptions = snapshot.docs.map((doc, index) => (
            <option key={`materiales-${index}`} value={doc.data().name}>{doc.data().name}</option>
        ));
        setMaterialesOptions(materialesOptions);
    }, []);

    useEffect(() => {
        const unsubscribe = [
            onSnapshot(query(collection(db, "tipoGasto"), orderBy("name")), updateOptionsTipoGasto),
            onSnapshot(query(collection(db, "proveedores"), orderBy("name")), updateOptionsProveedores),
            onSnapshot(query(collection(db, "materiales"), orderBy("name")), updateOptionsMateriales),
            onSnapshot(query(collection(db, "unidadesMedidas"), orderBy("name")), updateOptionsUnidadMedida),
        ];

        return () => unsubscribe.forEach(fn => fn());
    }, [updateOptionsTipoGasto, updateOptionsProveedores, updateOptionsMateriales, updateOptionsUnidadMedida]);

    useEffect(() => {
        if (fechaGasto === "") {
            setFechaGasto(hoy);
        }
    }, [fechaGasto, hoy]);

    const validateFields = async (e) => {
        e.preventDefault();
        if (productos === "") {
            setError("Debe de haber al menos un producto cargado");
            setTimeout(clearError, 2000)
            return false;
        }
        if (
            ruc.trim() === "" ||
            proveedor.trim() === "" ||
            tipoGasto.trim() === "" ||
            comprobanteGasto.trim() === ""
        ) {
            setError("Todos los campos son obligatorios");
            setTimeout(clearError, 2000)
            return false;
        } else {
            setError("");
            await store();
            clearFields();
            props.onHide();
        }
        return true;
    };

    const clearError = () => {
        setError("");
    };

    const clearFields = () => {
        setFechaGasto("")
        setRuc("");
        setProveedor("");
        setTipoGasto("");
        setComprobanteGasto("");
        setError("");
        setProductos("");
        setCantArticulo("");
        setDescripArticulo("");
        setPrecioUniArticulo("");
        setSubTotalArticulo("");
        setImporteGeneral(0);
        setModalAgregarArticulo(false);
        setModalAgregarArticuloBoton(false);
    };

    const store = async () => {
        moment.locale('es')
    var mesVariable = moment(fechaGasto).format("MMMM");

        const querySnapshot = await getDocs(query(collection(db, "proveedores"), where("ruc", "==", ruc)));
        if (!querySnapshot.empty) {
            const batch = writeBatch(db);
            for (const producto of productos) {
                const gastoData = {
                    fechaGasto: fechaGasto,
                    ruc: ruc,
                    proveedor: proveedor,
                    tipoGasto: tipoGasto,
                    timestamp: serverTimestamp(),
                    mes: mesVariable,
                    comprobanteGasto: comprobanteGasto,
                    cantArticulo: producto.cantArticulo,
                    umArticulo: producto.umArticulo || umArticulo,
                    cuentaArticulo: producto.cuentaArticulo,
                    descripArticulo: producto.descripArticulo,
                    precioUniArticulo: producto.precioUniArticulo,
                    subTotalArticulo: producto.subTotalArticulo,
                };

                const newDocRef = doc(gastosCollection);
                batch.set(newDocRef, gastoData);
            }
            await batch.commit();
            clearFields();
            props.onHide();
        } else {
            const batch = writeBatch(db);

            const proveedorData = {
                ruc: ruc,
                name: proveedor,
                valorBusquedaProveedor: ruc + " " + proveedor
            };

            const proveedorDocRef = doc(collection(db, "proveedores"));
            batch.set(proveedorDocRef, proveedorData);

            for (const producto of productos) {
                const gastoData = {
                    fechaGasto: fechaGasto,
                    ruc: ruc,
                    proveedor: proveedor,
                    tipoGasto: tipoGasto,
                    timestamp: serverTimestamp(),
                    mes: mesVariable,
                    comprobanteGasto: comprobanteGasto,
                    cantArticulo: producto.cantArticulo,
                    umArticulo: producto.umArticulo || umArticulo,
                    cuentaArticulo: producto.cuentaArticulo,
                    descripArticulo: producto.descripArticulo,
                    precioUniArticulo: producto.precioUniArticulo,
                    subTotalArticulo: producto.subTotalArticulo,
                };

                const newDocRef = doc(gastosCollection);
                batch.set(newDocRef, gastoData);
            }
            await batch.commit();
            clearFields();
            props.onHide();
        }
    };

    const manejarValorSeleccionado = async (suggestion) => {
        if (suggestion === "") {
            setProveedor("");
            setRuc("");
            setEditable(true);
        } else {
            const querySnapshot = await getDocs(
                query(collection(db, "proveedores"), where("valorBusquedaProveedor", "==", suggestion))
            );

            const doc = querySnapshot.docs[0];

            if (doc) {
                const data = doc.data();
                setProveedor(data.name);
                setRuc(data.ruc);
                setEditable(false);
            }
        }
    };

    useEffect(() => {
        const getCuenta = async () => {
            const querySnapshot = await getDocs(
                query(materialesCollection, orderBy("cuenta", "desc"), limit(1))
            );
            if (!querySnapshot.empty) {
                const maxCodigo = querySnapshot.docs[0].data().cuenta;
                setCuenta(Number(maxCodigo) + 1);
            } else {
                setCuenta(1);
            }
        };
        getCuenta();
    }, [materialesCollection]);

    const agregarProducto = () => {
        const nuevoProducto = {
            cantArticulo: cantArticulo,
            umArticulo: umArticulo || um,
            descripArticulo: descripArticulo,
            cuentaArticulo: cuentaArticulo || (cuenta - 1),
            precioUniArticulo: precioUniArticulo,
            subTotalArticulo: subTotalArticulo,
        };
        setProductos([...productos, nuevoProducto]);
        setCantArticulo("");
        setCuenta("");
        setDescripArticulo("");
        setPrecioUniArticulo("");
        setSubTotalArticulo("");
        setUmArticulo("");
        setCuentaArticulo("");

        const importeActual = parseFloat(importeGeneral) + parseFloat(subTotalArticulo);
        setImporteGeneral(importeActual);
    };

    async function buscarCuentaArticulo(nombreArticulo) {
        setModalAgregarArticulo(false);
        const q = query(
            collection(db, "materiales"),
            where("name", "==", nombreArticulo)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs[0]) {
            setCuentaArticulo(querySnapshot.docs[0].data().cuenta);
            setUmArticulo(querySnapshot.docs[0].data().um);
        } else {
            setCuentaArticulo("");
            setUmArticulo("");
            if (nombreArticulo !== "") {
                setModalAgregarArticuloBoton(true);
            } else {
                setModalAgregarArticuloBoton(false);
            }
        }
    }

    const handleCloseModal = () => {
        setCuenta("");
        setMaterial("");
        setModalAgregarArticulo([false, ""]);
        setModalAgregarArticuloBoton(false);
    };


    const handleCreate = (e) => {
        e.preventDefault();
        if (material === "") {
            setMaterial(modalAgregarArticulo[1]);
        } else if (material.trim() === "" || um.trim() === "") {
            setError("El Material/U.M. no puede estar vacío");
            return;
        }

        const newState = { cuenta: cuenta, name: modalAgregarArticulo[1], um: um };
        addDoc(materialesCollection, newState).then(() => {
            setError("");
        });
        handleCloseModal();
    };

    return (
        <>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton onClick={() => { clearFields(); props.onHide(); handleCloseModal(); }}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <h1>Registrar Compra</h1>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <form style={{ transform: "scale(0.98)" }}>
                                    {error && (
                                        <div className="alert alert-danger" role="alert">
                                            {error}
                                        </div>
                                    )}
                                    <div className="row">
                                        <div className="col-6 mb-2">
                                            <label className="form-label">Fecha*</label>
                                            <input
                                                defaultValue={hoy}
                                                onChange={(e) => { setFechaGasto(e.target.value) }}
                                                type="date"
                                                className="form-control"
                                                max={hoy}
                                                required
                                            />
                                        </div>
                                        <div className="col-6 mb-2">
                                            <label className="form-label">Buscador Proveedor*</label>
                                            <div className="d-flex">
                                                <input
                                                    value={ruc}
                                                    type="text"
                                                    onChange={(e) => { setRuc(e.target.value.split(" ").toString()); setEditable(true); setProveedor(""); manejarValorSeleccionado(e.target.value) }}
                                                    className="form-control"
                                                    list="proveedores-list"
                                                    required
                                                />
                                                {ruc && !proveedoresOptions.some(option => option.props.value.split(" ")[0] === ruc) && (
                                                    <span className="ms-2 text-danger" style={{ textAlign: "center" }}>Nuevo Proveedor</span>
                                                )}
                                            </div>
                                            <datalist id="proveedores-list">
                                                {proveedoresOptions}
                                            </datalist>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 mb-2">
                                            <label className="form-label">Nombre Proveedor*</label>
                                            <input
                                                value={proveedor}
                                                disabled={!editable}
                                                onChange={(e) => { setProveedor(e.target.value) }}
                                                type="text"
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-6 mb-2">
                                            <label className="form-label">Tipo*</label>
                                            <select
                                                value={tipoGasto}
                                                onChange={(e) => setTipoGasto(e.target.value)}
                                                className="form-control"
                                                multiple={false}
                                                required
                                            >
                                                <option value=""></option>
                                                {tipoGastoOptions}
                                            </select>
                                        </div>
                                        <div className="col-6 mb-2">
                                            <label className="form-label">Comprobante Compra*</label>
                                            <input
                                                value={comprobanteGasto}
                                                onChange={(e) => {
                                                    var inputValue = e.target.value.toUpperCase();
                                                    setComprobanteGasto(inputValue)
                                                }}
                                                type="text"
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row align-items-lg-end">
                                        <div className="col-2 sm-2">
                                            <label className="form-label">Cantidad</label>
                                            <input
                                                value={cantArticulo}
                                                onChange={(e) => setCantArticulo(e.target.value)}
                                                type="number"
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col-4 sm-2">
                                            <label className="form-label">Descripción</label>
                                            <div className="d-flex">
                                                <input
                                                    value={descripArticulo}
                                                    onChange={(e) => {
                                                        var inputValue = e.target.value.toUpperCase();
                                                        setDescripArticulo(inputValue);
                                                        buscarCuentaArticulo(inputValue);
                                                    }}
                                                    className="form-control"
                                                    list="materiales-list"
                                                    multiple={false}
                                                    required
                                                />
                                            </div>
                                            <datalist id="materiales-list">
                                                {materialesOptions}
                                            </datalist>
                                        </div>
                                        {modalAgregarArticuloBoton && (<div className="col-1 sm-2 d-flex justify-content-center">
                                            <button
                                                type="button"
                                                onClick={() => setModalAgregarArticulo([true, descripArticulo])}
                                                className="btn button-main btn-sm"
                                                style={{ marginBottom: "5px" }}
                                            >
                                                Nuevo
                                            </button>
                                        </div>)}
                                        <div className="col-2 sm-2">
                                            <label className="form-label">Precio Unitario</label>
                                            <input
                                                value={precioUniArticulo}
                                                onChange={(e) => { setPrecioUniArticulo(e.target.value); setSubTotalArticulo(cantArticulo * e.target.value) }}
                                                type="number"
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col-2 sm-2">
                                            <label className="form-label">SubTotal</label>
                                            <input
                                                value={cantArticulo * precioUniArticulo}
                                                disabled={bloqueado}
                                                type="number"
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col-1 sm-2 d-flex justify-content-center">
                                            <button
                                                type="button"
                                                onClick={agregarProducto}
                                                className="btn button-main"
                                                style={{ marginBottom: "5px" }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col">
                                <h5 style={{ fontWeight: "bold" }}>Productos Agregados</h5>
                                <h5>Total General: {importeGeneral}</h5>
                                {productos.length > 0 ? (
                                    <div className="table__container">
                                        <table className="table__body">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Cant</th>
                                                    <th scope="col">Descrip</th>
                                                    <th scope="col">Precio Uni</th>
                                                    <th scope="col">SubTotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {productos.map((producto, index) => (
                                                    <tr key={index}>
                                                        <td>{producto.cantArticulo}</td>
                                                        <td>{producto.descripArticulo}</td>
                                                        <td>{producto.precioUniArticulo}</td>
                                                        <td>{producto.subTotalArticulo}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p style={{ fontStyle: "italic" }}>No se han agregado productos</p>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal.Body >
                <Modal.Footer>
                    <button
                        onClick={validateFields}
                        className="btn button-main"
                    >
                        Guardar
                    </button>
                </Modal.Footer>
            </Modal >

            {modalAgregarArticulo[0] && (
                <Modal
                    show={modalAgregarArticulo[0]}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton onClick={handleCloseModal}>
                        <Modal.Title>Crear/Editar Materiales</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleCreate}>
                            <div className="mb-2">
                                <label className="form-label">Cuenta</label>
                                <input
                                    value={cuenta}
                                    disabled={!editable2}
                                    type="number"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Materiales*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    defaultValue={modalAgregarArticulo[1]}
                                    onChange={(e) => setMaterial(modalAgregarArticulo[1])}
                                    readOnly
                                />
                                {error && <small className="text-danger">{error}</small>}
                            </div>
                            <div className="mb-2">
                                <label className="form-label">U.M.*</label>
                                <select
                                    className="form-select"
                                    value={um}
                                    onChange={(e) => setUm(e.target.value)}
                                >
                                    <option value=""></option>
                                    {unidadMedidaOptions}
                                </select>
                                {error && <small className="text-danger">{error}</small>}
                            </div>
                            <button className="btn button-main" type="submit">
                                Crear
                            </button>
                        </form>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

export default CrearGasto;
