import React, { useState, useEffect, useCallback } from "react";
import { getDoc, updateDoc, doc, query, collection, orderBy, onSnapshot, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

const EditTratamiento = (props) => {
  const [apellidoConNombre, setApellidoConNombre] = useState(props.tratamiento.apellidoConNombre || "");
  const [idc, setIdc] = useState(props.tratamiento.idc || "");
  const [cant, setCant] = useState(props.tratamiento.cant || "");
  const [tarifasTratamientos, setTarifasTratamientos] = useState(props.tratamiento.tarifasTratamientos || "");
  const [cta, setCta] = useState(props.tratamiento.cta || "");
  const [precio, setPrecio] = useState(props.tratamiento.precio || "");
  const [pieza, setPieza] = useState(props.tratamiento.pieza || "");
  const [plazo, setPlazo] = useState(props.tratamiento.plazo || "");
  const [cuota, setCuota] = useState(props.tratamiento.cuota || "");
  const [estadosTratamientos, setEstadosTratamientos] = useState(props.tratamiento.estadosTratamientos || "");
  const [fecha, setFecha] = useState(props.tratamiento.fecha || "");
  const [fechaVencimiento, setFechaVencimiento] = useState(props.tratamiento.fechaVencimiento || "");
  const [notas, setNotas] = useState(props.tratamiento.notas || "");

  const [optionsEstadosTratamientos, setOptionsEstadosTratamientos] = useState([]);
  const [optionsTarifasTratamientos, setOptionsTarifasTratamientos] = useState([]);

  const updateOptionsEstadosTratamientos = useCallback((snapshot) => {
    const options = snapshot.docs.map((doc) => (
      <option key={`estadosTratamientos-${doc.id}`} value={doc.data().name}>{doc.data().name}</option>
    ));
    setOptionsEstadosTratamientos(options);
  }, []);

  const updateOptionsTarifasTratamientos = useCallback(snapshot => {
    const options2 = snapshot.docs.map(doc => (
      <option key={`tarifasTratamientos-${doc.id}`} value={doc.data().tarifasTratamientos}>{doc.data().tratamiento}</option>
    ));
    setOptionsTarifasTratamientos(options2);
  }, []);

  useEffect(() => {
    const unsubscribe = [
      onSnapshot(query(collection(db, "estadosTratamientos"), orderBy("name")), updateOptionsEstadosTratamientos),
      onSnapshot(query(collection(db, "tarifas"), orderBy("eliminado")), updateOptionsTarifasTratamientos)
    ];
    return () => unsubscribe.forEach(fn => fn());
  }, [updateOptionsEstadosTratamientos, updateOptionsTarifasTratamientos]);

  async function buscarTratamiento(tratamiento, tratamientoAnterior) {
    const q = query(collection(db, "tarifas"), where("tratamiento", "==", tratamiento));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      if (data.eliminado) {
        const confirmMessage = "El tratamiento seleccionado está marcado como eliminado. ¿Deseas continuar?";
        const shouldContinue = window.confirm(confirmMessage);
        if (!shouldContinue) {
          props.onHide()
          return;
        }
      }
      setTarifasTratamientos(tratamiento);
      setCta(data.codigo);
      setPrecio(data.tarifa);
    } else {
      setCta("");
      setPrecio("");
    }
  }

  const update = async (e) => {
    e.preventDefault();
    const tratamientoRef = doc(db, "tratamientos", props.id);
    const tratamientoDoc = await getDoc(tratamientoRef);
    const tratamientoData = tratamientoDoc.data();

    const newData = {
      apellidoConNombre: apellidoConNombre || tratamientoData.apellidoConNombre,
      idc: idc || tratamientoData.idc,
      cant: cant || tratamientoData.cant,
      tarifasTratamientos: tarifasTratamientos || tratamientoData.tarifasTratamientos,
      cta: cta || tratamientoData.cta,
      precio: precio || tratamientoData.precio,
      pieza: pieza || tratamientoData.pieza,
      plazo: plazo || tratamientoData.plazo,
      cuota: cuota || tratamientoData.cuota,
      estadosTratamientos: estadosTratamientos || tratamientoData.estadosTratamientos,
      fecha: fecha || tratamientoData.fecha,
      fechaVencimiento: fechaVencimiento || tratamientoData.fechaVencimiento,
      notas: notas || tratamientoData.notas,
    };
    await updateDoc(tratamientoRef, newData);
  };

  const handleTarifasTratamientosChange = (event, tratamiento) => {
    buscarTratamiento(event, tratamiento);
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onClick={() => {
        props.onHide();
      }}>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1>Editar Tratamiento</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="col">
            <form onSubmit={update}>

              <div className="row">
                <div className="col mb-3">
                  <label className="form-label">Apellido y Nombres</label>
                  <input
                    defaultValue={props.tratamiento.apellidoConNombre}
                    onChange={(e) => setApellidoConNombre(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="col mb-3">
                  <label className="form-label">IDC</label>
                  <input
                    defaultValue={props.tratamiento.idc}
                    onChange={(e) => setIdc(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col mb-3">
                  <label className="form-label">Tratamiento</label>
                  <select
                    defaultValue={props.tratamiento.tarifasTratamientos}
                    onChange={(e) => handleTarifasTratamientosChange(e.target.value, props.tratamiento)}
                    className="form-control"
                    multiple={false}
                  >
                    <option value="">Selecciona un Tratamiento</option>
                    {optionsTarifasTratamientos}
                  </select>
                </div>
                <div className="col mb-3">
                  <label className="form-label">Estado del Tratamiento</label>
                  <select
                    defaultValue={props.tratamiento.estadosTratamientos}
                    onChange={(e) => setEstadosTratamientos(e.target.value)}
                    className="form-control"
                    multiple={false}
                  >
                    <option value="">Selecciona un estado</option>
                    {optionsEstadosTratamientos}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col mb-2">
                  <label className="form-label">Pieza</label>
                  <input
                    defaultValue={props.tratamiento.pieza}
                    onChange={(e) => setPieza(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="col mb-2">
                  <label className="form-label">Cant</label>
                  <input
                    defaultValue={props.tratamiento.cant}
                    onChange={(e) => setCant(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="col mb-2">
                  <label className="form-label">Plazo</label>
                  <input
                    defaultValue={props.tratamiento.plazo}
                    onChange={(e) => setPlazo(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="col mb-2">
                  <label className="form-label">Cuota</label>
                  <input
                    defaultValue={props.tratamiento.cuota}
                    onChange={(e) => setCuota(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col mb-3">
                  <label className="form-label">Fecha</label>
                  <input
                    defaultValue={props.tratamiento.fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    type="date"
                    className="form-control"
                  />
                </div>
                <div className="col mb-3">
                  <label className="form-label">Fecha Vencimiento</label>
                  <input
                    defaultValue={props.tratamiento.fechaVencimiento}
                    onChange={(e) => setFechaVencimiento(e.target.value)}
                    type="date"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col mb-3">
                  <label className="form-label">Notas</label>
                  <input
                    defaultValue={props.tratamiento.notas}
                    onChange={(e) => setNotas(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>

              <button
                type="submit"
                onClick={() => {
                  props.onHide();
                }}
                className="btn btn-primary"
              >
                Editar
              </button>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditTratamiento;
