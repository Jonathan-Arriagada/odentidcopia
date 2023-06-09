import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal } from "react-bootstrap";
import { addDoc, collection, doc, setDoc, deleteDoc, query, orderBy, } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase.js";
import { onSnapshot } from "firebase/firestore";
import "../../style/Main.css";

const Estados = ({ show, onHide }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [nroOrden, setNroOrden] = useState(0);
  const [estado, setEstado] = useState("");
  const [error, setError] = useState("");
  const [estados, setEstados] = useState([]);
  const estadosCollection = collection(db, "estados");
  const estadosCollectionOrdenados = useRef(query(estadosCollection, orderBy("name")));
  const [color, setColor] = useState("");

  const updateEstadosFromSnapshot = useCallback((snapshot) => {
    const estadosArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    estadosArray.sort((a, b) => a.nroOrden - b.nroOrden);
    setEstados(estadosArray);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      estadosCollectionOrdenados.current,
      updateEstadosFromSnapshot
    );
    return unsubscribe;
  }, [updateEstadosFromSnapshot]);

  const inputRef = useRef(null);

  const estadoExiste = (name) => {
    return estados.some(
      (estado) => estado.name.toLowerCase() === name.toLowerCase()
    );
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (nroOrden === "" || estado.trim() === "") {
      setError("El Estado/N° Orden no puede estar vacío");
      return;
    }
    if (estadoExiste(estado)) {
      setError("El estado ya existe");
      return;
    }
    const newState = { nroOrden: nroOrden, name: estado, color: color };
    addDoc(estadosCollection, newState).then(() => {
      setEstado("");
      setNroOrden(0);
      setError("");
      setColor("")
    });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setNroOrden(estados[index].nroOrden);
    setEstado(estados[index].name);
    setColor(estados[index].color);
    setError("");
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (estado.trim() === "") {
      setError("El estado no puede estar vacío");
      return;
    }
    if (color.trim() === '') {
      setError('El color no puede estar vacío');
      return;
    }
    const stateToUpdate = estados[editIndex];
    const newState = { nroOrden: nroOrden, name: estado, color: color };
    setDoc(doc(estadosCollection, stateToUpdate.id), newState).then(() => {
      setEditIndex(null);
      setNroOrden(0);
      setEstado("");
      setError("");
      setColor("")
    });
  };

  const handleDelete = async (index) => {
    await deleteDoc(doc(estadosCollection, estados[index].id));
    const newStates = estados.filter((_, i) => i !== index);
    setEstados(newStates);
    setNroOrden(0);
    setEstado("");
    setError("");
    setColor("")
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Crear/Editar/Eliminar Estado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={editIndex !== null ? handleUpdate : handleCreate}>
          <div className="row">
            <div className="col-3 sm-1" style={{ textAlign: "center" }}>
              <label className="form-label">N° Orden</label>
              <input
                type="number"
                className="form-control"
                value={nroOrden}
                onChange={(e) => setNroOrden(e.target.value)}
                style={{ textAlign: "center" }}
              />
              {error && <small className="text-danger">{error}</small>}
            </div>
            <div className="col-9 mb-1">
              <label className="form-label">Estado</label>
              <input
                type="text"
                className="form-control"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                ref={inputRef}
              />
              {error && <small className="text-danger">{error}</small>}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Color:</label>
            <div className="justify-content-center align-items-center" style={{ display: "flex" }}>
              <label className="form-label" style={{ marginRight: "8px" }}>Selecciona un color para el Estado:</label>
              <div className="color-input-container">
                <input
                  type="color"
                  className="color-input"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button className="btn btn-primary" type="submit">
            {editIndex !== null ? "Actualizar" : "Crear"}
          </button>

          {editIndex !== null && (
            <button
              className="btn btn-secondary mx-2"
              onClick={() => setEditIndex(null)}
            >
              Cancelar
            </button>
          )}
        </form>
        <div className="mt-3">
          {estados.map((state, index) => (
            <div
              key={state.id}
              className="d-flex align-items-center justify-content-between border p-2"
            >
              <div className="col-1">{state.nroOrden}</div>
              <div className="col-3">{state.name}</div>
              <div className="col-1"
              ><input
                  type="color"
                  className="color-preview"
                  value={state.color}
                  readOnly
                /></div>
              <div className="col-2">
                <button
                  className="btn btn-primary mx-1 btn-sm"
                  onClick={() => handleEdit(index)}
                >
                  <i className="fa-solid fa-edit"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(index)}
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal >
  );
};

export default Estados;
