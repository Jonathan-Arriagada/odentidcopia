import React, { useState, useEffect, } from "react";
import { doc, updateDoc, where, collection, getDocs, query, } from "firebase/firestore";
import { auth, db, sesionActiva, } from "../../firebaseConfig/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navigation from "../Navigation";
import EditClave from "./EditClave";
import "../Utilidades/loader.css";
import "../Utilidades/tablas.css";
import "../Pacientes/Show.css";

const MiPerfil = () => {
  const [user, setUser] = useState("");
  const [apellidoConNombre, setApellidoConNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaAlta, setFechaAlta] = useState("");
  const [rol, setRol] = useState("");
  const [foto, setFoto] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editable, setEditable] = useState(false);
  const [, setMostrarPerfil] = useState(true);
  const [modalShowEditClave, setModalShowEditClave] = useState(false);
  const [, setMostrarNotificaciones] = useState(false);
  const storage = getStorage();



  useEffect(() => {
    const fetchUserData = async () => {
      const user = await sesionActiva;
      const userQuery = query(collection(db, "user"), where("correo", "==", user.email));
      const userDocsSnapshot = await getDocs(userQuery);
      const userData2 = userDocsSnapshot.docs[0].data();
      setUser(userData2)
      setApellidoConNombre(userData2.apellidoConNombre);
      setCorreo(userData2.correo);
      setTelefono(userData2.telefono);
      setFechaAlta(userData2.fechaAlta);
      setFoto(userData2.foto)
      setRol(userData2.rol);
      setIsLoading(false);
    };
    fetchUserData();

  }, []);

  const handleEdit = (e) => {
    e.preventDefault();
    setEditable(true)
  };

  const handleSave = async (e) => {
    e.preventDefault(); //NO FUNCIONA AUN
    const user = auth.currentUser
    await user.updateProfile({
      displayName: apellidoConNombre,
      photoURL: foto,
    });
    await user.updateEmail(correo);

    const userDocRef = doc(db, "user", user.uid);
    await updateDoc(userDocRef, {
      apellidoConNombre,
      correo,
      telefono,
      foto,
    });
    setEditable(false);
  }

  const notificaciones = () => {
    window.alert("NO SE HA ACORDADO ESTA ETAPA AUN")
    setMostrarNotificaciones(true)
  };


  const handleUploadImage = async (e) => {
    setEditable(true)
    const file = e.target.files[0];
    const storageRef = ref(storage, `imagenes_perfil/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    setFoto(downloadURL);
    }

  return (
    <>
      <div className="mainpage">
        <Navigation />
        {isLoading ? (
          <span className="loader position-absolute start-50 top-50 mt-3"></span>
        ) : (
          <div className="container-xl px-4 mt-4">
            <div className="d-flex">
              <h1>Mi Perfil</h1>
            </div>

            <nav className="nav nav-borders">
              <div className="nav-link active ms-0" onClick={() => { setMostrarPerfil(true); setModalShowEditClave(false); setMostrarNotificaciones(false); }} >Perfil</div>
              <div className="nav-link" onClick={() => { setMostrarPerfil(false); setModalShowEditClave(true); setMostrarNotificaciones(false); }} >Seguridad</div>
              <div className="nav-link" onClick={() => { setMostrarPerfil(false); setModalShowEditClave(false); notificaciones() }} >Notificaciones</div>
            </nav>
            <hr className="mt-0 mb-4" />
            <div className="row">
              <div className="col-xl-4">
                <div className="card mb-4 mb-xl-0">
                  <div className="card-header">Imagen de Perfil</div>
                  <div className="card-body text-center">
                    <img className="img-account-profile rounded-circle mb-2" src={foto || "http://bootdey.com/img/Content/avatar/avatar1.png"} alt="Ejemplo Imagen de Perfil" />
                    <div className="small font-italic text-muted mb-4">JPG or PNG no mayor a 5 MB</div>
                    <button className="btn btn-primary" id="custom-file-upload" onChange={handleUploadImage} type="button">
                      <label>Subir archivo
                        <input type="file" accept="image/jpeg, image/png, image/jpg"  style={{ display: "none" }} />
                      </label>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-xl-8">
                <div className="card mb-4">
                  <div className="card-header">Detalles de la Cuenta</div>
                  <div className="card-body">
                    <form>
                      <div className="row gx-3 mb-3">
                        <div className="col-md-6">
                          <label className="small mb-1">Apellido y Nombres</label>
                          <input className="form-control" id="inputApellidoConNombres" type="text" placeholder="Ingresa tu Apellido y Nombres" value={apellidoConNombre || ""}
                            onChange={(e) => setApellidoConNombre(e.target.value)} disabled={!editable} style={{ textAlign: "center" }} />
                        </div>
                        <div className="col-md-6">
                          <label className="small mb-1">Telefono</label>
                          <input className="form-control" id="inputPhone" type="tel" placeholder="Ingresa tu Telefono" value={telefono || ""}
                            onChange={(e) => setTelefono(e.target.value)} disabled={!editable} style={{ textAlign: "center" }} />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="small mb-1">Correo Electronico</label>
                        <input className="form-control" id="inputEmailAddress" type="email" placeholder="Ingresa tu Correo Electronico" value={correo}
                          onChange={(e) => setCorreo(e.target.value)} disabled={!editable} style={{ textAlign: "center" }} />
                      </div>
                      <div className="row gx-3 mb-3">
                        <div className="col-md-6">
                          <label className="small mb-1">Rol</label>
                          <input className="form-control" id="inputLocation" type="text" value={rol} disabled style={{ textAlign: "center" }} />
                        </div>
                        <div className="col-md-6">
                          <label className="small mb-1">Fecha de Alta</label>
                          <input className="form-control" id="inputBirthday" type="text" name="birthday" value={fechaAlta} disabled style={{ textAlign: "center" }} />
                        </div>
                      </div>
                      <button className="btn btn-primary" type="submit" onClick={editable ? handleSave : handleEdit}>
                        {editable ? "Guardar Cambios" : "Editar Informacion"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <EditClave
        usuario={user}
        show={modalShowEditClave}
        onHide={() => setModalShowEditClave(false)}
      />
    </>
  );
};

export default MiPerfil;