import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import moment from "moment";

function PacientesAtendidos() {
  const hoy = moment(new Date()).format("YYYY-MM-DD");
  const [pacientesAtendidos, setPacientesAtendidos] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "citas"), where("fecha", "==", hoy));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let contador = 0;

      snapshot.forEach((doc) => {
        const cita = doc.data();

        if (cita.estado === "Finalizada") {
          contador++;
        }
      });

      setPacientesAtendidos(contador);
    });

    return () => {
      unsubscribe();
    };
  }, [hoy]);

  return (
    <div>
      <span>{pacientesAtendidos}</span>
    </div>
  );
}

export default PacientesAtendidos;
