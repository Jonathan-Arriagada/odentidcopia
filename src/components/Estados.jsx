import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { addDoc, collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase.js";
import { onSnapshot } from "firebase/firestore";


const Estados = ({ show, onHide }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [estado, setEstado] = useState('');
  const [error, setError] = useState('');
  const [estados, setEstados] = useState([]);
  const estadosCollection = collection(db, "estados");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "estados"), (snapshot) => {
      setEstados(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  
    return () => {
      unsubscribe();
    };
  }, []);
  

  const handleCreate = (e) => {
    e.preventDefault();
    if (estado.trim() === '') {
      setError('El estado no puede estar vacío');
      return;
    }
    const newState = { name: estado };
    addDoc(estadosCollection, newState)
      .then(() => {
        setEstado('');
        setError('');
      })
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEstado(estados[index].name);
    setError('');
  };

  const handleUpdate = (e) => { 
    e.preventDefault();
    if (estado.trim() === '') {
      setError('El estado no puede estar vacío');
      return;
    }
    const stateToUpdate = estados[editIndex];
    const newState = { name: estado };
    setDoc(doc(estadosCollection, stateToUpdate.id), newState)
      .then(() => {
        setEditIndex(null);
        setEstado('');
        setError('');
      })
  };

  const handleDelete = async (index) => {
      await deleteDoc(doc(estadosCollection, estados[index].id));
      const newStates = [...estados];
      newStates.splice(index, 1);
      setEstados(newStates);
      setError('');
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Crear/Editar/Eliminar Estado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={editIndex !== null ? handleUpdate : handleCreate}>
          <div className="mb-3">
            <label className="form-label">Estado</label>
            <input
              type="text"
              className="form-control"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
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
          {estados.map((state, index) => (
            <div key={state.id} className="d-flex align-items-center justify-content-between border p-2">
              <div>{state.name}</div>
              <div>
                <button className="btn btn-primary mx-1" onClick={() => handleEdit(index)}>
                <i className="fa-solid fa-edit"></i>
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(index)}>
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

export default Estados;