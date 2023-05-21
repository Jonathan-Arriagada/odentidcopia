import React, { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    getDocs,
    where,
  } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";


const Control = () => {
  const [evoluciones, setEvoluciones] = useState([]);
  const [nuevoTratamiento, setNuevoTratamiento] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevosDetalles, setNuevosDetalles] = useState('');

  useEffect(() => {
    // Aquí puedes establecer la conexión con Firebase y obtener las evoluciones existentes
    const obtenerEvoluciones = async () => {
      try {
        const evolucionesSnapshot = await collection(db, "evoluciones");
        const evolucionesData = evolucionesSnapshot.docs.map(doc => doc.data());
        setEvoluciones(evolucionesData);
      } catch (error) {
        console.error('Error al obtener las evoluciones:', error);
      }
    };

    obtenerEvoluciones();
  }, []);

  const agregarEvolucion = async () => {
    // Aquí puedes agregar la nueva evolución a la base de datos de Firebase
    const nuevaEvolucion = {
      doctor: 'Nombre del doctor',
      tratamiento: nuevoTratamiento,
      fecha: nuevaFecha,
      detalles: nuevosDetalles,
    };

    try {
      await collection(db, "evoluciones").addDoc(nuevaEvolucion);
      setEvoluciones([...evoluciones, nuevaEvolucion]);
      setNuevoTratamiento('');
      setNuevaFecha('');
      setNuevosDetalles('');
    } catch (error) {
      console.error('Error al agregar la evolución:', error);
    }
  };

  return (
    <div>
      {/* Renderizar las evoluciones existentes */}
      {evoluciones.map((evolucion, index) => (
        <div key={index}>
          <h4>Doctor: {evolucion.doctor}</h4>
          <p>Tratamiento: {evolucion.tratamiento}</p>
          <p>Fecha: {evolucion.fecha}</p>
          <p>Detalles: {evolucion.detalles}</p>
        </div>
      ))}

      {/* Agregar una nueva evolución */}
      <h4>Agregar evolución</h4>
      <input
        type="text"
        placeholder="Tratamiento"
        value={nuevoTratamiento}
        onChange={e => setNuevoTratamiento(e.target.value)}
      />
      <input
        type="text"
        placeholder="Fecha"
        value={nuevaFecha}
        onChange={e => setNuevaFecha(e.target.value)}
      />
      <input
        type="text"
        placeholder="Detalles"
        value={nuevosDetalles}
        onChange={e => setNuevosDetalles(e.target.value)}
      />
      <button onClick={agregarEvolucion}>Agregar</button>
    </div>
  );
};

export default Control;
