import { useState, useEffect, useRef } from "react";
import { query, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { FaArrowUp } from "react-icons/fa";
import ComparacionAnual from "./ComparacionAnual";
import ComparacionMensual from "./ComparacionMensual";
import InformeCompras from "./InformeCompras";
import InformeIngresos from "./InformeIngresos";
import InformeIngresosPorServicio from "./InformeIngresosPorServicio";
import Resultados from "./Resultados";
import "../../style/Main.css";
import moment from "moment";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";


export default function InformesGenerales() {
  const scrollRef = useRef(null);
  const [value, setValue] = useState(0);
  const [isLoading,] = useState(false);
  const [tratamientos, setTratamientos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [optionsAñoTratamientos, setOptionsAñoTratamientos] = useState([]);
  const [optionsAñoGastos, setOptionsAñoGastos] = useState([]);

  const tratamientosCollectiona = collection(db, "tratamientos");
  const tratamientosCollection = useRef(query(tratamientosCollectiona));
  const gastosCollectiona = collection(db, "gastos");
  const gastosCollection = useRef(query(gastosCollectiona));
  const [showArrow, setShowArrow] = useState(false);

  const getDataDeColeccion = async (collectionRef) => {
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  };
  const handleScroll = () => {
    const scrollY = window.scrollY;
    setTimeout(() => {
      setShowArrow(scrollY >= 100);
    }, 10);
  };

  const handleButtonClick = (index) => {
    setShowArrow(true);
    setValue(index);
    setTimeout(() => {
      window.scrollBy({ top: 300, behavior: "smooth" });
    }, 10);
  };
 
  const handleArrowClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowArrow(false);
  };

  useEffect(() => {
    Promise.all([
      getDataDeColeccion(tratamientosCollection.current),
      getDataDeColeccion(gastosCollection.current),
    ]).then(([tratamientosArray, gastosArray]) => {
      setTratamientos(tratamientosArray);
      setGastos(gastosArray);

      const tratamientosOptions = getOptionsAño(tratamientosArray, 'fecha');
      setOptionsAñoTratamientos(tratamientosOptions);
  
      const gastosOptions = getOptionsAño(gastosArray, 'fechaGasto');
      setOptionsAñoGastos(gastosOptions);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

 
  const getOptionsAño = (coleccion, campo) => {
    const valoresUnicos = new Set();

    coleccion.forEach((item) => {
      const fecha = moment(item[campo], "YYYY-MM-DD");
      const año = fecha.year();
      valoresUnicos.add(año);
    });

    const options = Array.from(valoresUnicos)
      .sort((a, b) => b - a)
      .map((año) => (
        <option key={`año-${año}`} value={año}>
          {año}
        </option>
      ));

    return options;
  };

  return (
    <>
      {isLoading ? (
        <div className="w-100">
          <span className="loader position-absolute start-50 top-50 mt-3"></span>
        </div>
      ) : (
        <div className="w-100">
          <div className="container mw-100" style={{ width: "100%" }}>
            <h1>Informes Contables</h1>
            <div ref={scrollRef} style={ {paddingBottom: "8px" }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    type="button"
                    variant={value === 1 ? "contained" : ""}
                    onClick={() => handleButtonClick(1)}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      backdropFilter: "blur(40px)",
                      backgroundColor: value === 1 ? "#e0e0e0" : "#00C5C1",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                      color: "#fff", 
                    }}
                  >
                    <span style={{color: "#fff"}}>Informe Compras</span>
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant={value === 2 ? "contained" : ""}
                    onClick={() => handleButtonClick(2)}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      backdropFilter: "blur(40px)",
                      backgroundColor: value === 2 ? "#e0e0e0" : "#00C5C1",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                      color: "#fff",
                    }}
                  >
                    <span style={{color: "#fff"}}>Informe Ingresos</span>
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant={value === 3 ? "contained" : ""}
                    onClick={() => handleButtonClick(3)}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      backdropFilter: "blur(40px)",
                      backgroundColor: value === 3 ? "#e0e0e0" : "#00C5C1",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                      color: "#fff",
                    }}
                  >
                    <span style={{color: "#fff"}}>Informe Ingresos Por Servicio</span>
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant={value === 4 ? "contained" : ""}
                    onClick={() => handleButtonClick(4)}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      backdropFilter: "blur(40px)",
                      backgroundColor: value === 4 ? "#e0e0e0" : "#00C5C1",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                      color: "#fff", 
                    }}
                  >
                   <span style={{color: "#fff"}}>Comparacion Mensual</span> 
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant={value === 5 ? "contained" : ""}
                    onClick={() => handleButtonClick(5)}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      backdropFilter: "blur(40px)",
                      backgroundColor: value === 5 ? "#e0e0e0" : "#00C5C1",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                      color: "#fff", 
                    }}
                  >
                    <span style={{color: "#fff"}}>Comparacion Anual</span>
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant={value === 6 ? "contained" : ""}
                    onClick={() => handleButtonClick(6)}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      backdropFilter: "blur(40px)",
                      backgroundColor: value === 6 ? "#e0e0e0" : "#00C5C1",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                      color: "#fff", 
                    }}
                  >
                    <span style={{color: "#fff"}}>Resultados</span>
                  </Button>
                </Grid>
              </Grid>
            </div>

            {value === 1 && <InformeCompras gastos={gastos} />}
            {value === 2 && <InformeIngresos tratamientos={tratamientos} />}
            {value === 3 && <InformeIngresosPorServicio tratamientos={tratamientos} optionsAño2={optionsAñoTratamientos} />}
            {value === 4 && <ComparacionMensual gastos={gastos} optionsAño={optionsAñoGastos} />}
            {value === 5 && <ComparacionAnual gastos={gastos} optionsAño={optionsAñoGastos} />}
            {value === 6 && <Resultados gastos={gastos} tratamientos={tratamientos} optionsAño={optionsAñoGastos} />}
          </div>
        </div>
      )}
      {showArrow && (
        <div
          className="arrow-button"
          onClick={handleArrowClick}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#00C5C1",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <FaArrowUp
            style={{
              position: "relative",
              top: "-1px",
              fontSize: "24px",
              color: "#fff",
            }}
          />
        </div>
      )}
    </>
  );
}
