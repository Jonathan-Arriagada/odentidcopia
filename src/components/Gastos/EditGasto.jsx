import React, { useState, useEffect, useCallback } from "react";
import { getDoc, updateDoc, doc, query, collection, orderBy, onSnapshot, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";
import moment from "moment";


const EditGasto = (props) => {
  const [fechaGasto, setFechaGasto] = useState(props.gasto.fechaGasto || "");
  const [ruc, setRuc] = useState(props.gasto.ruc || "");
  const [proveedor, setProveedor] = useState(props.gasto.proveedor || "");
  const [tipoGasto, setTipoGasto] = useState(props.gasto.tipoGasto || "");
  const [comprobanteGasto, setComprobanteGasto] = useState(props.gasto.comprobanteGasto || "");
  const [cantArticulo, setCantArticulo] = useState(props.gasto.cantArticulo || "");
  const [umArticulo, setUmArticulo] = useState(props.gasto.umArticulo || "");
  const [descripArticulo, setDescripArticulo] = useState(props.gasto.descripArticulo || "");
  const [precioUniArticulo, setPrecioUniArticulo] = useState(props.gasto.precioUniArticulo || "");
  const [subTotalArticulo, setSubTotalArticulo] = useState(props.gasto.subTotalArticulo || "");
  const [cuentaArticulo, setCuentaArticulo] = useState(props.gasto.cuentaArticulo || "");
  const [, setProductos] = useState([]);

  const [tipoGastoOptions, setTipoGastoOptions] = useState([]);
  const [proveedoresOptions, setProveedoresOptions] = useState([]);
  const [materialesOptions, setMaterialesOptions] = useState([]);
  const [editable, setEditable] = useState(true);
  const [bloqueado,] = useState(true);


  const updateOptionsTipoGasto = useCallback(snapshot => {
    const tipoGastoOptions = snapshot.docs.map((doc, index) => (
      <option key={`tipoGasto-${index}`} value={doc.data().name}>{doc.data().name}</option>
    ));
    setTipoGastoOptions(tipoGastoOptions);
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

    ];

    return () => unsubscribe.forEach(fn => fn());
  }, [updateOptionsTipoGasto, updateOptionsProveedores, updateOptionsMateriales]);

  const update = async (e) => {
    e.preventDefault();
    const gastoRef = doc(db, "gastos", props.id);
    const gastoDoc = await getDoc(gastoRef);
    const gastoData = gastoDoc.data();

    const newData = {
      fechaGasto: fechaGasto || gastoData.fechaGasto,
      ruc: ruc || gastoData.ruc,
      proveedor: proveedor || gastoData.proveedor,
      tipoGasto: tipoGasto || gastoData.tipoGasto,
      comprobanteGasto: comprobanteGasto || gastoData.comprobanteGasto,
      cantArticulo: cantArticulo || gastoData.cantArticulo,
      umArticulo: umArticulo || gastoData.umArticulo,
      cuentaArticulo: cuentaArticulo || gastoData.cuentaArticulo,
      descripArticulo: descripArticulo || gastoData.descripArticulo,
      precioUniArticulo: precioUniArticulo || gastoData.precioUniArticulo,
      subTotalArticulo: subTotalArticulo || gastoData.subTotalArticulo,
    };
    await updateDoc(gastoRef, newData);
    clearFields();
    props.onHide();
  }

  const clearFields = () => {
    setFechaGasto("");
    setRuc("");
    setProveedor("");
    setTipoGasto("");
    setComprobanteGasto("");
    setProductos("");
    setCantArticulo("");
    setDescripArticulo("");
    setPrecioUniArticulo("");
    setSubTotalArticulo("");
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
  }

  async function buscarCuentaArticulo(nombreArticulo) {
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
    }
  }

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onClick={() => { clearFields(); props.onHide(); }}>
          <Modal.Title id="contained-modal-title-vcenter">
            <h1>Editar Compra</h1>
            <h2 style={{ fontStyle: "italic" }}>(No posee funciones para agregar, solo edición)</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col">
                <form>
                  <div className="row">
                    <div className="col mb-6">
                      <label className="form-label">Fecha*</label>
                      <input
                        defaultValue={moment(props.gasto.fechaGasto).format("YYYY-MM-DD")}
                        onChange={(e) => { setFechaGasto(e.target.value) }}
                        type="date"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col mb-6">
                      <label className="form-label">Buscador Proveedor*</label>
                      <div className="d-flex">
                        <input
                          placeholder={props.gasto.ruc}
                          value={ruc}
                          type="text"
                          onChange={(e) => { setRuc(e.target.value.split(" ").toString()); setEditable(true); setProveedor(""); manejarValorSeleccionado(e.target.value) }}
                          className="form-control"
                          list="proveedores-list"
                          required
                        />
                      </div>
                      <datalist id="proveedores-list">
                        {proveedoresOptions}
                      </datalist>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col mb-12">
                      <label className="form-label">Nombre Proveedor*</label>
                      <input
                        placeholder={props.gasto.proveedor}
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
                    <div className="col mb-6">
                      <label className="form-label">Tipo*</label>
                      <select
                        defaultValue={props.gasto.tipoGasto}
                        onChange={(e) => setTipoGasto(e.target.value)}
                        className="form-control"
                        multiple={false}
                        required
                      >
                        <option value=""></option>
                        {tipoGastoOptions}
                      </select>
                    </div>
                    <div className="col mb-6">
                      <label className="form-label">Comprobante Compra*</label>
                      <input
                        defaultValue={props.gasto.comprobanteGasto}
                        onChange={(e) => setComprobanteGasto(e.target.value)}
                        type="text"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col mb-12">
                      <br></br>
                    </div>
                  </div>
                  <div className="row align-items-lg-end">
                    <div className="col-2 sm-2">
                      <label className="form-label">Cantidad</label>
                      <input
                        defaultValue={props.gasto.cantArticulo}
                        onChange={(e) => {
                          setCantArticulo(e.target.value);
                          setSubTotalArticulo((precioUniArticulo ? precioUniArticulo : props.gasto.precioUniArticulo) * parseFloat(e.target.value));
                        }} type="number"
                        className="form-control"
                      />
                    </div>
                    <div className="col-4 sm-2">
                      <label className="form-label">Descripción</label>
                      <div className="d-flex">
                        <select
                          defaultValue={props.gasto.descripArticulo}
                          onChange={(e) => {
                            setDescripArticulo(e.target.value);
                            buscarCuentaArticulo(e.target.value);
                          }}
                          className="form-control"
                          multiple={false}
                          required
                        >
                          {materialesOptions}
                        </select>
                      </div>

                    </div>
                    <div className="col-2 sm-2">
                      <label className="form-label">Precio Unitario</label>
                      <input
                        defaultValue={props.gasto.precioUniArticulo}
                        onChange={(e) => {
                          setPrecioUniArticulo(e.target.value);
                          setSubTotalArticulo(parseFloat(e.target.value) * (cantArticulo ? cantArticulo : props.gasto.cantArticulo));
                        }}
                        type="number"
                        className="form-control"
                      />
                    </div>
                    <div className="col-2 sm-2">
                      <label className="form-label">SubTotal</label>
                      <input
                        value={subTotalArticulo || props.gasto.subTotalArticulo}
                        disabled={bloqueado}
                        type="number"
                        className="form-control"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body >
        <Modal.Footer>
          <button
            onClick={update}
            className="btn button-main"
          >
            Guardar
          </button>
        </Modal.Footer>
      </Modal >
    </>
  );
};

export default EditGasto;