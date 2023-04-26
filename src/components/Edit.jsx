import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

const Edit = (props) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [idc, setIdc] = useState([]);
  const [edad, setEdad] = useState([]);
  const [numero, setNumero] = useState([]);

  const navigate = useNavigate();

  const update = async (e) => {
    e.preventDefault();
    const client = doc(db, "clients", props.id);
    const data = {
      nombre: nombre,
      apellido: apellido,
      idc: idc,
      edad: edad,
      numero: numero,
    };
    await updateDoc(client, data);
    navigate("/clients");
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
          <h1>Editar Cliente</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col">
              <form onSubmit={update}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    defaultValue={props.client.nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input
                    defaultValue={props.client.apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">IDC</label>
                  <input
                    defaultValue={props.client.idc}
                    onChange={(e) => setIdc(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Edad</label>
                  <input
                    defaultValue={props.client.edad}
                    onChange={(e) => setEdad(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Numero</label>
                  <input
                    defaultValue={props.client.numero}
                    onChange={(e) => {
                      if (props.client.numero !== e.target.value) {
                        setNumero(e.target.value);
                        console.log(numero + " entró")
                      } else {
                        setNumero(props.client.numero);
                        console.log(numero + " no entro")
                      }
                    }}
                    type="number"
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
                  Edit
                </button>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Edit;
