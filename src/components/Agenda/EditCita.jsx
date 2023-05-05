import React, { useState, useEffect, useCallback } from "react";
import { getDoc, updateDoc, doc, query, collection, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

const EditCita = (props) => {
  const [apellidoConNombre, setApellidoConNombre] = useState(props.cita.apellidoConNombre || "");
  const [idc, setIdc] = useState(props.cita.idc || "");
  const [estado, setEstado] = useState(props.cita.estado || "");
  const [numero, setNumero] = useState(props.cita.numero || "");
  const [fecha, setFecha] = useState(props.cita.fecha || "");
  const [comentario, setComentario] = useState(props.cita.comentario || "");
  const [horaInicio, setHoraInicio] = useState(props.cita.horaInicio || "");
  const [horaFin, setHoraFin] = useState(props.cita.horaFin || "");
  const [optionsEstado, setOptionsEstado] = useState([]);
  const [optionsHoraInicio, setOptionsHoraInicio] = useState([]);
  const [optionsHoraFin, setOptionsHoraFin] = useState([]);
  const [, setHorariosAtencion] = useState([]);

  const updateOptionsEstado = useCallback(snapshot => {
    const options = snapshot.docs.map(doc => (
      <option key={`estado-${doc.id}`} value={doc.data().name}>{doc.data().name}</option>
    ));
    setOptionsEstado(options);
  }, []);

  const updateOptionsHorarios = useCallback(snapshot => {
    const horarios = snapshot.docs.map(doc => doc.data());
    setHorariosAtencion(horarios);

    const optionsHoraInicio = horarios.map((horario, index) => (
      <option key={`horarioInicio-${index}`} value={horario.id}>{horario.name}</option>
    ));
    setOptionsHoraInicio(optionsHoraInicio);

    const optionsHoraFin = horarios
      .filter(horario => horario.name > horaInicio)
      .map((horario, index) => (
        <option key={`horarioFin-${index}`} value={horario.id}>{horario.name}</option>
      ));
    setOptionsHoraFin([...optionsHoraFin]);
    setHoraFin(optionsHoraFin[0]?.props.children || props.cita.horaFin);

  }, [horaInicio]);

  useEffect(() => {
    const unsubscribe = [
      onSnapshot(query(collection(db, "estados"), orderBy("name")), updateOptionsEstado),
      onSnapshot(query(collection(db, "horariosAtencion"), orderBy("name")), updateOptionsHorarios)
    ];

    return () => unsubscribe.forEach(fn => fn());
  }, [updateOptionsEstado, updateOptionsHorarios]);

  const update = async (e) => {
    e.preventDefault();
    const citaRef = doc(db, "citas", props.id);
    const citaDoc = await getDoc(citaRef);
    const citaData = citaDoc.data();

    const newData = {
      apellidoConNombre: apellidoConNombre || citaData.apellidoConNombre,
      idc: idc || citaData.idc,
      estado: estado || citaData.estado,
      numero: numero || citaData.numero,
      fecha: fecha || citaData.fecha,
      comentario: comentario || citaData.comentario,
      horaInicio: horaInicio || citaData.horaInicio,
      horaFin: horaFin || citaData.horaFin,
    };
    await updateDoc(citaRef, newData);
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
        setHoraFin("");
      }}>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1>Editar Cita</h1>
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
                    defaultValue={props.cita.apellidoConNombre}
                    onChange={(e) => setApellidoConNombre(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="col mb-3">
                  <label className="form-label">IDC</label>
                  <input
                    defaultValue={props.cita.idc}
                    onChange={(e) => setIdc(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col mb-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    defaultValue={props.cita.numero}
                    onChange={(e) => setNumero(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="col mb-3">
                  <label className="form-label">Estado</label>
                  <select
                    defaultValue={props.cita.estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="form-control"
                    multiple={false}
                  >
                    <option value="">Selecciona un estado</option>
                    {optionsEstado}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col mb-6">
                  <label className="form-label">Fecha</label>
                  <input
                    defaultValue={props.cita.fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    type="date"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col mb-3">
                  <label className="form-label">Hora Inicio</label>
                  <select
                    defaultValue={props.cita.horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    className="form-control"
                    multiple={false}
                  >
                    {optionsHoraInicio}
                  </select>
                </div>
                <div className="col mb-3">
                  <label className="form-label">Hora Fin</label>
                  <select
                    defaultValue={props.cita.horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                    className="form-control"
                    multiple={false}
                  >
                    {optionsHoraFin}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col mb-6">
                  <label className="form-label">Comentarios</label>
                  <input
                    defaultValue={props.cita.comentario}
                    onChange={(e) => setComentario(e.target.value)}
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

export default EditCita;