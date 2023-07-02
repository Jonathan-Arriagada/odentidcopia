import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

function Top3Tratamientos(props) {
  const [top1, setTop1] = useState("");
  const [top2, setTop2] = useState("");
  const [top3, setTop3] = useState("");

  useEffect(() => {
    const q = query(collection(db, "tratamientos"),
      where("fecha", ">=", props.fechaInicio),
      where("fecha", "<=", props.fechaFin)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tratamientosCount = {};
      snapshot.forEach((doc) => {
        const tratamiento = doc.data().tarifasTratamientos;
        if (tratamiento in tratamientosCount) {
          tratamientosCount[tratamiento] += 1;
        } else {
          tratamientosCount[tratamiento] = 1;
        }
      });

      const sortedTratamientos = Object.keys(tratamientosCount).sort(
        (a, b) => tratamientosCount[b] - tratamientosCount[a]
      );

      setTop1(sortedTratamientos[0] || "");
      setTop2(sortedTratamientos[1] || "");
      setTop3(sortedTratamientos[2] || "");
    });

    return () => {
      unsubscribe();
    };
  }, [props]);

  return (
    <div className="text-start">
      <span>1. {top1}</span>
      <br></br>
      <span>2. {top2}</span>
      <br></br>
      <span>3. {top3}</span>
    </div>
  );
}

export default Top3Tratamientos;