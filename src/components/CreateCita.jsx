import React, { useState, useEffect, useCallback } from "react";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

function CreateCita(props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [idc, setIdc] = useState("");
  const [estado, setEstado] = useState("");
  const [numero, setNumero] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [comentario, setComentario] = useState("");

  const [optionsEstado, setOptionsEstado] = useState([]);
  const [optionsHoraInicio, setOptionsHoraInicio] = useState([]);
  const [optionsHoraFin, setOptionsHoraFin] = useState([]);
  const [horariosAtencion, setHorariosAtencion] = useState([]);


  const citasCollection = collection(db, "citas");
  
  const updateOptionsEstado = useCallback(snapshot => {
    const options = snapshot.docs.map(doc => (
      <option key={`estado-${doc.id}`} value={doc.estado}>{doc.data().name}</option>
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
      .filter(horario => horaInicio && horario.name > horaInicio)
      .map((horario, index) => (
        <option key={`horarioFin-${index}`} value={horario.id}>{horario.name}</option>
    ));
    setOptionsHoraFin(optionsHoraFin);
  }, [horaInicio]);
  
  useEffect(() => {
    const unsubscribe = [
      onSnapshot(query(collection(db, "estados"), orderBy("name")), updateOptionsEstado),
      onSnapshot(query(collection(db, "horariosAtencion"), orderBy("name")), updateOptionsHorarios)
    ];
  
    return () => unsubscribe.forEach(fn => fn());
  }, [updateOptionsEstado, updateOptionsHorarios]);

  const clearFields = () => {
    setNombre("");
    setApellido("");
    setIdc([]);
    setEstado([]);
    setNumero([]);
    setFecha([]);
    setHoraInicio([]);
    setHoraFin([]);
    setComentario("");
  };

  const store = async (e) => {
    e.preventDefault();
    await addDoc(citasCollection, {
      nombre: nombre,
      apellido: apellido,
      idc: idc,
      estado: estado,
      numero: numero,
      fecha: fecha,
      comentario: comentario,
      horaInicio: horaInicio,
      horaFin: horaFin,
    });
    clearFields();
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1>Crear Cita</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col">
              <form onSubmit={store}>
                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input
                    value={apellido}
                    onChange={(e) => setApellido(e.currentTarget.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.currentTarget.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">IDC</label>
                  <input
                    value={idc}
                    onChange={(e) => setIdc(e.currentTarget.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="form-control"
                    multiple={false}
                  >
                    <option value="">Selecciona un estado</option>
                    {optionsEstado}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Numero</label>
                  <input
                    value={numero}
                    onChange={(e) => setNumero(e.currentTarget.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="mb-1">
                  <label className="form-label">Fecha</label>
                  <input
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    type="date"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Comentarios</label>
                  <input
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-1">
                  <label className="form-label">Hora Inicio</label>
                  <select
                    value={horaInicio}
                    onChange={(e) =>
                      setHoraInicio(e.target.value)}
                    className="form-control"
                    multiple={false}
                  >
                    {optionsHoraInicio}
                  </select>
                </div>
                <div className="mb-1">
                  <label className="form-label">Hora Fin</label>
                  <select
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                    className="form-control"
                    multiple={false}
                  >
                    {optionsHoraFin}
                  </select>
                </div>
                <button type="submit" onClick={props.onHide} className="btn btn-primary">Agregar</button>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CreateCita;
