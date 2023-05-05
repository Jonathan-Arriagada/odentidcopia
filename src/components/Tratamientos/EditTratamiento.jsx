import React, { useState, useEffect, useCallback } from "react";
import { getDoc, updateDoc, doc, query, collection, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

const EditTratamiento = (props) => {
  const [apellidoConNombres, setApellidoConNombres] = useState(props.tratamiento.apellidoConNombres || "");
  const [idc, setIdc] = useState(props.tratamiento.idc || "");
  const [cant, setCant] = useState(props.tratamiento.cant || "");
  const [tarifasTratamientos, setTarifasTratamientos] = useState("");
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
      <option key={`tarifasTratamientos-${doc.id}`} value={doc.tarifasTratamientos}>{doc.data().tratamiento}</option>
    ));
    setOptionsTarifasTratamientos(options2);
  }, []);

  useEffect(() => {
    const unsubscribe = [
      onSnapshot(query(collection(db, "estadosTratamientos"), orderBy("name")), updateOptionsEstadosTratamientos),
      onSnapshot(query(collection(db, "tarifas"), orderBy("tratamiento")), updateOptionsTarifasTratamientos)
    ];
    return () => unsubscribe.forEach(fn => fn());
  }, [updateOptionsEstadosTratamientos, updateOptionsTarifasTratamientos]);

  const update = async (e) => {
    e.preventDefault();
    const tratamientoRef = doc(db, "tratamientos", props.id);
    const tratamientoDoc = await getDoc(tratamientoRef);
    const tratamientoData = tratamientoDoc.data();

    const newData = {
      apellidoConNombres: apellidoConNombres || tratamientoData.apellidoConNombres,
      idc: idc || tratamientoData.idc,
      cant: cant || tratamientoData.cant,
      tarifasTratamientos: tarifasTratamientos || tratamientoData.tarifasTratamientos,
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
                      defaultValue={props.tratamiento.apellidoConNombres}
                      onChange={(e) => setApellidoConNombres(e.target.value)}
                      type="text"
                      className="form-control"
                    />
                  </div>
                  <div className="col mb-3">
                    <label className="form-label">IDC</label>
                    <input
                      value={idc}
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
                      value={tarifasTratamientos}
                      onChange={(e) => setTarifasTratamientos(e.target.value)}
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
                      value={cant}
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
                      value={cuota}
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
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      type="date"
                      className="form-control"
                    />
                  </div>
                  <div className="col mb-3">
                    <label className="form-label">Fecha Vencimiento</label>
                    <input
                      value={fechaVencimiento}
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
