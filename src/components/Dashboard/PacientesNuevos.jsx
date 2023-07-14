import React, { useEffect, useState, useRef } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

function PacientesNuevos(props) {
  const [contadorClientes, setContadorClientes] = useState(0);
  const contadorClientesRef = useRef(contadorClientes);
  const [contadorClientesComparadoPeriodoAnterior, setContadorClientesComparadoPeriodoAnterior] = useState(0);

  const [consultaEnProgreso, setConsultaEnProgreso] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "clients"), where("fechaAlta", ">=", props.fechaInicio), where("fechaAlta", "<=", props.fechaFin));
    const q2 = query(collection(db, "clients"), where("fechaAlta", ">=", props.fechaInicioBalance), where("fechaAlta", "<=", props.fechaFinBalance));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cantidad = snapshot.size || 0;
      setContadorClientes(cantidad);
      contadorClientesRef.current = cantidad;
    });

    const unsubscribe2 = onSnapshot(q2, (snapshot) => {
      let cantidad2 = snapshot.size || 0;;
      setContadorClientesComparadoPeriodoAnterior(cantidad2 > 0 ? Math.round((contadorClientesRef.current / cantidad2) * 100) : 0);
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
            <span>{contadorClientes}</span>
            <span className={`fs-6 ms-4 mt-2 ${contadorClientesComparadoPeriodoAnterior > 0 ? 'text-success' : contadorClientesComparadoPeriodoAnterior < 0 ? 'text-warning' : ''}`}>
              {contadorClientesComparadoPeriodoAnterior > 0 && "+"}{contadorClientesComparadoPeriodoAnterior}%
            </span>
        </>
      )}
    </div>
  );
}

export default PacientesNuevos;