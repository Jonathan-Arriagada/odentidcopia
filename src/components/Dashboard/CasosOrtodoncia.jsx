import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

function CasosOrtodoncia(props) {
  const [casosEnCurso, setCasosEnCurso] = useState(0);
  const [casosEnCursoComparadoPeriodoAnterior, setCasosEnCursoComparadoPeriodoAnterior] = useState(0);
  const [consultaEnProgreso, setConsultaEnProgreso] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "tratamientos"), where("tarifasTratamientos", "==", "Ortodoncia"), where("estadosTratamientos", "==", "En Curso"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const resultadosAFiltrar = snapshot.docs.filter((doc) => {
        const fecha = doc.data().fecha;
        return fecha >= props.fechaInicio && fecha <= props.fechaFin;
      });

      const resultadosAFiltrar2 = snapshot.docs.filter((doc) => {
        const fecha = doc.data().fecha;
        return fecha >= props.fechaInicioBalance && fecha <= props.fechaFinBalance;
      });

      const cantidad = resultadosAFiltrar.length || 0;
      const cantidad2 = resultadosAFiltrar2.length || 0;
      setCasosEnCurso(cantidad);
      setCasosEnCursoComparadoPeriodoAnterior(cantidad2 > 0 ? Math.round((cantidad / cantidad2) * 100) : 0);
      setConsultaEnProgreso(false);
    });

    return () => {
      unsubscribe();
    };
  }, [props]);

  return (
    <div className="d-flex">
      {consultaEnProgreso ? (
        <span>...</span>
      ) : (
        <>
          <div className="justify-content-between">
            <span>{casosEnCurso}</span>
            <span className={`fs-6 mx-4 mt-2 ${casosEnCursoComparadoPeriodoAnterior > 0 ? 'text-success' : casosEnCursoComparadoPeriodoAnterior < 0 ? 'text-warning' : ''}`}>
              {casosEnCursoComparadoPeriodoAnterior > 0 && "+"}{casosEnCursoComparadoPeriodoAnterior}%
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default CasosOrtodoncia;