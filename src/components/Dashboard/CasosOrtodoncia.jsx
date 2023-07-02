import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

function CasosOrtodoncia(props) {
  const [casosEnCurso, setCasosEnCurso] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "tratamientos"),
      where("tarifasTratamientos", "==", "Ortodoncia"),
      where("estadosTratamientos", "==", "En Curso")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const resultadosAFiltrar = snapshot.docs.filter((doc) => {
        const fecha = doc.data().fecha;
        return fecha >= props.fechaInicio && fecha <= props.fechaFin;
      });

      const cantidad = resultadosAFiltrar.length || 0;
      setCasosEnCurso(cantidad);
    });

    return () => {
      unsubscribe();
    };
  }, [props]);

  return (
    <div>
      <span>{casosEnCurso}</span>
    </div>
  );
}

export default CasosOrtodoncia;