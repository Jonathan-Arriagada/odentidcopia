import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import { addDoc, collection, doc, setDoc, deleteDoc, query, orderBy} from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase.js";
import { onSnapshot } from "firebase/firestore";


const HorariosAtencionCitas = ({ show, onHide }) => {
    const [editIndex, setEditIndex] = useState(null);
    const [horario, setHorario] = useState('');
    const [error, setError] = useState('');
    const [horarios, setHorarios] = useState([]);
    const horariosCollection = collection(db, "horariosAtencion");
    const horariosCollectionOrdenados = useRef(query(horariosCollection, orderBy("name")));
    const [cols, setCols] = useState(1);

    const actualizarHorariosDeSnapshot = useCallback((snapshot) => {
        const horariosArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setHorarios(horariosArray);
        setCols(Math.ceil(snapshot.size / 10));
      }, []);

      useEffect(() => {
        const unsubscribe = onSnapshot(horariosCollectionOrdenados.current, actualizarHorariosDeSnapshot);
        return unsubscribe;
      }, [actualizarHorariosDeSnapshot]);

    const inputRef = useRef(null);

    const horarioExiste = (name) => {
        return horarios.some((horario) => horario.name.toLowerCase() === name.toLowerCase());
      };

    const handleCreate = (e) => {
        e.preventDefault();
        if (horario.trim() === '') {
            setError('El horario no puede estar vacío');
            return;
        }
        if (horarioExiste(horario)) {
            setError('El horario ya existe');
            return;
          }
        const newHorario = { name: horario };
        addDoc(horariosCollection, newHorario)
            .then(() => {
                setHorario('');
                setError('');
            })
    };

    const handleEdit = (index) => {
        inputRef.current.focus()
        setEditIndex(index);
        setHorario(horarios[index].name);
        setError('');
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (horario.trim() === '') {
            setError('El horario no puede estar vacío');
            return;
        }
        if (horarioExiste(horario)) {
            setError('El horario ya existe');
            return;
          }
        const horarioToUpdate = horarios[editIndex];
        const newHorario = { name: horario };
        setDoc(doc(horariosCollection, horarioToUpdate.id), newHorario)
            .then(() => {
                setEditIndex(null);
                setHorario('');
                setError('');

            })
    };

    const handleDelete = async (index) => {
        await deleteDoc(doc(horariosCollection, horarios[index].id));
        const newHorarios = horarios.filter((_, i) => i !== index);
        setHorarios(newHorarios);
        setHorario('');
        setError('');
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>Crear/Editar/Eliminar horarios</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={editIndex !== null ? handleUpdate : handleCreate}>
                    <div className="mb-6">
                        <label className="form-label">Horarios</label >
                        <input
                            type="text"
                            className="form-control"
                            maxLength={5}
                            value={horario}
                            onChange={(e) => setHorario(e.target.value)}
                            ref={inputRef}
                        />
                        {error && <small className="text-danger">{error}</small>}
                    </div>
                    <button className="btn button-main" type="submit">
                        {editIndex !== null ? 'Actualizar' : 'Crear'}
                    </button>
                    {editIndex !== null && (
                        <button className="btn btn-secondary mx-2" onClick={() => setEditIndex(null)}>
                            Cancelar
                        </button>
                    )}
                </form>
                <div style={{ columnCount: cols, marginTop: '10px' }}>
                    {horarios.map((horario, index) => (
                        <div key={horario.id} className="d-flex align-items-center justify-content-between border p-2" style={{ borderRadius: '30px', margin: '5px'}}>
                            <div>{horario.name}</div>
                            <div>
                                <button className="button-main mx-1 btn-sm" onClick={() => handleEdit(index)}>
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

export default HorariosAtencionCitas;