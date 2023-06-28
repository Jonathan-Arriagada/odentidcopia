import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import moment from "moment";

function CasosOrtodoncia() {
    const hoy = moment(new Date()).format("YYYY-MM-DD");
  const [casosEnCurso, setCasosEnCurso] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "tratamientos"), where("tarifasTratamientos", "==", "Ortodoncia"), where("estadosTratamientos", "==", "EN CURSO"), where("fecha", "==", hoy));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCasosEnCurso(snapshot.size);
    });

    return () => {
      unsubscribe();
    };
  }, [hoy]);

  return (
    <div>
      <span>{casosEnCurso}</span>
    </div>
  );
}

export default CasosOrtodoncia;