import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

function PacientesAtendidos(props) {
  const [pacientesAtendidos, setPacientesAtendidos] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "citas"),
      where("fecha", ">=", props.fechaInicio),
      where("fecha", "<=", props.fechaFin)
    );
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
  }, [props]);

  return (
    <div>
      <span>{pacientesAtendidos}</span>
    </div>
  );
}

export default PacientesAtendidos;
