import React, { useEffect, useState, useRef } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

function PacientesAtendidos(props) {
  const [pacientesAtendidos, setPacientesAtendidos] = useState(0);
  const [porcentajeComparadoPeriodoAnterior, setPorcentajeComparadoPeriodoAnterior] = useState(0);
  const [consultaEnProgreso, setConsultaEnProgreso] = useState(true);
  const pacientesAtendidosRef = useRef(pacientesAtendidos);

  useEffect(() => {
    const q = query(collection(db, "citas"), where("fecha", ">=", props.fechaInicio), where("fecha", "<=", props.fechaFin));
    const q2 = query(collection(db, "citas"), where("fecha", ">=", props.fechaInicioBalance), where("fecha", "<=", props.fechaFinBalance));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let contador = 0;

      snapshot.forEach((doc) => {
        const cita = doc.data();

        if (cita.estado === "Finalizada") {
          contador++;
        }
      });

      setPacientesAtendidos(contador);
      pacientesAtendidosRef.current = contador;
    });

    const unsubscribe2 = onSnapshot(q2, (snapshot) => {
      let contador2 = 0;

      snapshot.forEach((doc) => {
        const cita = doc.data();

        if (cita.estado === "Finalizada") {
          contador2++;
        }
      });

      setPorcentajeComparadoPeriodoAnterior(contador2 > 0 ? Math.round((pacientesAtendidosRef.current / contador2) * 100) : 0);
      setConsultaEnProgreso(false);
    });

    return () => {
      unsubscribe();
      unsubscribe2();
    };
  }, [props]);

  return (
    <div className="d-flex justify-content-between">
      {consultaEnProgreso ? (
        <span>...</span>
      ) : (
        <>
          <span>{pacientesAtendidos}</span>
          <span className={`fs-6 me-3 mt-2 ${porcentajeComparadoPeriodoAnterior > 0 ? 'text-success' : porcentajeComparadoPeriodoAnterior < 0 ? 'text-warning' : ''}`}>
            {porcentajeComparadoPeriodoAnterior > 0 && "+"}{porcentajeComparadoPeriodoAnterior}%
          </span>
        </>
      )}
    </div>
  );
}

export default PacientesAtendidos;
