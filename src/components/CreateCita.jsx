import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

function CreateCita(props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState( "");
  const [idc, setIdc] = useState("");
  const [numero, setNumero] = useState("");
  const [edad, setEdad] = useState("");;
  const [fecha, setFecha] = useState([]);
  const [horaInicio, setHoraInicio] = useState([]);
  const [horaFin, setHoraFin] = useState([]);
  const [comentario, setComentario] = useState("");

  const navigate = useNavigate();

  const citasCollection = collection(db, "citas");

  const store = async (e) => {
    e.preventDefault();
    await addDoc(citasCollection, {
      nombre: nombre,
      apellido: apellido,
      idc: idc,
      edad: edad,
      numero: numero,
      fecha: fecha,
      comentario: comentario,
      horaInicio: horaInicio,
      horaFin: horaFin,
    });
    navigate("/agenda");
    window.location.reload(false)
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
                  <label className="form-label">Edad</label>
                  <input
                    value={edad}
                    onChange={(e) => setEdad(e.currentTarget.value)}
                    type="number"
                    className="form-control"
                  />
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
                  <label className="form-label">Inicio</label>
                  <input
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    type="time"
                    className="form-control"
                  />
                </div>                
                <div className="mb-1">
                  <label className="form-label">Fin</label>
                  <input
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                    type="time"
                    className="form-control"
                  />
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
