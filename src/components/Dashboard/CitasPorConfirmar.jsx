import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

function CitasPorConfirmar(props) {
  const [cantCitas, setCantCitas] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "citas"),
      where("fecha", ">=", props.fechaInicio),
      where("fecha", "<=", props.fechaFin)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let citas = snapshot.docs.filter((doc) => doc.data().estado === "Por Confirmar").length || 0;

      setCantCitas(citas);
    });

    return () => {
      unsubscribe();
    };
  }, [props]);

  return (
    <div>
      <span>{cantCitas}</span>
    </div>
  );
}

export default CitasPorConfirmar;