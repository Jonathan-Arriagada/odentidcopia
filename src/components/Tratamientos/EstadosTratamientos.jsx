import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import { addDoc, collection, doc, setDoc, deleteDoc, query, orderBy} from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase.js";
import { onSnapshot } from "firebase/firestore";

const EstadosTratamientos = ({ show, onHide }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [estadoTratamientos, setEstadoTratamientos] = useState('');
  const [error, setError] = useState('');
  const [estadosTratamientos, setEstadosTratamientos] = useState([]);
  const estadosTratamientosCollection = collection(db, "estadosTratamientos");
  const estadosTratamientosCollectionOrdenados = useRef(query(estadosTratamientosCollection, orderBy("name")));

  const updateEstadosTratamientosFromSnapshot = useCallback((snapshot) => {
    const estadosTratamientosArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setEstadosTratamientos(estadosTratamientosArray);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(estadosTratamientosCollectionOrdenados.current, updateEstadosTratamientosFromSnapshot);
    return unsubscribe;
  }, [updateEstadosTratamientosFromSnapshot]);

  const inputRef = useRef(null);

  const estadoTratamientosExiste = (name) => {
    return estadosTratamientos.some((estadoTratamientos) => estadoTratamientos.name.toLowerCase() === name.toLowerCase());
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (estadoTratamientos.trim() === '') {
      setError('El estado no puede estar vacío');
      return;
    }
    if (estadoTratamientosExiste(estadoTratamientos)) {
      setError('El estado ya existe');
      return;
    }
    const newState = { name: estadoTratamientos };
    addDoc(estadosTratamientosCollection, newState)
      .then(() => {
        setEstadoTratamientos('');
        setError('');
      })
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEstadoTratamientos(estadosTratamientos[index].name);
    setError('');
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (estadoTratamientos.trim() === '') {
      setError('El estado no puede estar vacío');
      return;
    }
    if (estadoTratamientosExiste(estadoTratamientos)) {
      setError('El estado ya existe');
      return;
    }
    const stateToUpdate = estadosTratamientos[editIndex];
    const newState = { name: estadoTratamientos };
    setDoc(doc(estadosTratamientosCollection, stateToUpdate.id), newState)
      .then(() => {
        setEditIndex(null);
        setEstadoTratamientos('');
        setError('');
      })
  };

  const handleDelete = async (index) => {
    await deleteDoc(doc(estadosTratamientosCollection, estadosTratamientos[index].id));
    const newStates = estadosTratamientos.filter((_, i) => i !== index);
    setEstadosTratamientos(newStates);
    setError('');
  };

  return (
    <Modal show={show} onHide={onHide} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title>Gestión Estados Tratamientos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={editIndex !== null ? handleUpdate : handleCreate}>
          <div className="mb-3">
            <label className="form-label">Estado Tratamiento</label>
            <input
              type="text"
              className="form-control"
              value={estadoTratamientos}
              onChange={(e) => setEstadoTratamientos(e.target.value)}
              ref={inputRef}
            />
            {error && <small className="text-danger">{error}</small>}
          </div>
          <button className="btn btn-primary" type="submit">
            {editIndex !== null ? 'Actualizar' : 'Crear'}
          </button>

          {editIndex !== null && (
            <button className="btn btn-secondary mx-2" onClick={() => setEditIndex(null)}>
              Cancelar
            </button>
          )}
        </form>
        <div className="mt-3">
          {estadosTratamientos.map((state, index) => (
            <div key={state.id} className="d-flex align-items-center justify-content-between border p-2">
              <div>{state.name}</div>
              <div>
                <button className="btn btn-primary mx-1 btn-sm" onClick={() => handleEdit(index)}>
                  <i className="fa-solid fa-edit"></i>
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(index)}>
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EstadosTratamientos;
