import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

const EditCita = (props) => {
    const [nombre, setNombre] = useState(props.cita.nombre || "");
    const [apellido, setApellido] = useState(props.cita.apellido || "");
    const [idc, setIdc] = useState(props.cita.idc || "");
    const [estado, setEstado] = useState(props.cita.estado || "");
    const [numero, setNumero] = useState(props.cita.numero || "");
    const [fecha, setFecha] = useState(props.cita.fecha || "");
    const [comentario, setComentario] = useState(props.cita.comentario || "");
    const [horaInicio, setHoraInicio] = useState(props.cita.horaInicio || "");
    const [horaFin, setHoraFin] = useState(props.cita.horaFin || "");

  const navigate = useNavigate();

  const update = async (e) => {
    e.preventDefault();
    const citaRef = doc(db, "citas", props.id);
    const citaDoc = await getDoc(citaRef);
    const citaData = citaDoc.data();
  
  const newData = {
    nombre: nombre || citaData.nombre,
    apellido: apellido || citaData.apellido,
    idc: idc || citaData.idc,
    estado: estado || citaData.estado,
    numero: numero || citaData.numero,
    fecha: fecha || citaData.fecha,
    comentario: comentario || citaData.comentario,
    horaInicio: horaInicio || citaData.horaInicio,
    horaFin: horaFin || citaData.horaFin,
  };
  await updateDoc(citaRef, newData);
    navigate("/agenda");
    window.location.reload(false);
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
          <h1>Editar Cita</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col">
              <form onSubmit={update}>
                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input
                    defaultValue={props.cita.apellido}
                    onChange={(e) => setApellido(e.currentTarget.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    defaultValue={props.cita.nombre}
                    onChange={(e) => setNombre(e.currentTarget.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">IDC</label>
                  <input
                    defaultValue={props.cita.idc}
                    onChange={(e) => setIdc(e.currentTarget.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  <input
                    defaultValue={props.cita.estado}
                    onChange={(e) => setEstado(e.currentTarget.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Numero</label>
                  <input
                    defaultValue={props.cita.numero}
                    onChange={(e) => setNumero(e.currentTarget.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="mb-1">
                  <label className="form-label">Fecha</label>
                  <input
                    value={props.cita.fecha}
                    onChange={(e) => setFecha(e.currentTarget.value)}
                    type="date"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Comentarios</label>
                  <input
                    value={props.cita.comentario}
                    onChange={(e) => setComentario(e.currentTarget.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-1">
                  <label className="form-label">Inicio</label>
                  <input
                    value={props.cita.horaInicio}
                    onChange={(e) => setHoraInicio(e.currentTarget.value)}
                    type="time"
                    className="form-control"
                  />
                </div>                
                <div className="mb-1">
                  <label className="form-label">Fin</label>
                  <input
                    value={props.cita.horaFin}
                    onChange={(e) => setHoraFin(e.currentTarget.value)}
                    type="time"
                    className="form-control"
                  />
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
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditCita;
