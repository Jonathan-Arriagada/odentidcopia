import React, { useState, useEffect, } from "react";
import { doc, updateDoc, where, collection, getDocs, query, } from "firebase/firestore";
import { auth, db, deslogear, } from "../../firebaseConfig/firebase";
import { updateProfile, updateEmail, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import Navigation from "../Navigation";
import EditClave from "./EditClave";
import { FaSignOutAlt, FaUser, FaBell } from "react-icons/fa";
import { getAuth, signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import "../../style/Main.css"

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
  const [mostrarCancelar, setMostrarCancelar] = useState(false);
  const [id, setId] = useState("");
  const [, setMostrarPerfil] = useState(true);
  const [modalShowEditClave, setModalShowEditClave] = useState(false);
  const [, setMostrarNotificaciones] = useState(false);
  const [mostrarBotonFoto, setMostrarBotonFoto] = useState(false);
  const storage = getStorage();
  const navigate = useNavigate()

  const logout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        localStorage.setItem("user", JSON.stringify(null));
      })
      .catch((error) => {
        // Maneja cualquier error que ocurra durante el logout
        console.log("Error durante el logout:", error);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, fetchUserData);
    return unsubscribe;
  }, []);

  const fetchUserData = async (user) => {
    const userQuery = query(collection(db, "user"), where("correo", "==", user.email));
    const userDocsSnapshot = await getDocs(userQuery);
    if (!userDocsSnapshot.empty) {
      const userData2 = userDocsSnapshot.docs[0].data();
      const userId = userDocsSnapshot.docs[0].id;
      setUser(userData2);
      setApellidoConNombre(userData2.apellidoConNombre);
      setCorreo(userData2.correo);
      setTelefono(userData2.telefono);
      setFechaAlta(userData2.fechaAlta);
      setFoto(userData2.foto);
      setRol(userData2.rol === process.env.REACT_APP_rolAd ? "Admin" : "Asistente");
      setId(userId)
    }
    setIsLoading(false);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setEditable(true)
    setMostrarCancelar(true)
  };

  const handleCancelar = (e) => {
    e.preventDefault();
    setEditable(false)
    setMostrarCancelar(false)
  };

  const handleSave = async (e) => {
    try {
      e.preventDefault();
      const user = auth.currentUser;

      await updateProfile(user, {
        displayName: apellidoConNombre,
      });
      await updateEmail(user, correo);

      const userDocRef = doc(db, "user", id);
      await updateDoc(userDocRef, {
        apellidoConNombre,
        correo,
        telefono,
      });
      window.alert('Modificacion usuario exitosa')
      deslogear(auth);
      localStorage.setItem("user", JSON.stringify(null));
      navigate("/")
    } catch (error) {
      console.error("Error al guardar sus datos. Vuelva a iniciar sesión e intente de nuevo", error);
    }
  }

  const notificaciones = () => {
    window.alert("NO SE HA ACORDADO ESTA ETAPA AUN")
    setMostrarNotificaciones(true)
  };


  const handleUploadImage = async (e) => {
    try {
      const file = e.target.files[0];
      const storageRef = ref(storage, `imagenes_perfil/${file.name}`);
      await uploadBytes(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);
      setFoto(downloadURL);
      setMostrarBotonFoto(true)
    } catch (error) {
      console.error("Error al cargar la imagen al almacenamiento. Vuelva a iniciar sesión e intente de nuevo", error);
    }
  }

  const subirFoto = async (e) => {
    try {
      e.preventDefault();
      const user = auth.currentUser;
      await updateProfile(user, {
        photoURL: foto,
      });
      const userDocRef = doc(db, "user", id);
      await updateDoc(userDocRef, {
        foto: foto
      });
      window.alert('Modificacion foto exitosa')
      deslogear(auth);
      localStorage.setItem("user", JSON.stringify(null));
      navigate("/")
    } catch (error) {
      console.error("Error al guardar la imagen. Vuelva a iniciar sesión e intente de nuevo", error);
    }
  }

  return (
    <>
      <div className="mainpage">
        <Navigation />
        {isLoading ? (
          <span className="loader position-absolute start-50 top-50 mt-3"></span>
        ) : (
          <div className="w-100">
            <nav className="navbar">
              <div className="d-flex justify-content-between w-100 px-2">
                <div className="search-bar w-50">
                  
                </div>
                <div className="d-flex justify-content-between align-items-center right-navbar">
                  <p className="fw-bold mb-0" style={{ marginLeft: "-20px" }}>
                    Bienvenido al sistema Odentid
                  </p>
                  <div className="d-flex">
                    <div className="notificacion">
                      <Link
                        to="/miPerfil"
                        className="text-decoration-none"
                      >
                        <FaUser className="icono" />
                      </Link>
                    </div>
                    <div className="notificacion">
                      <FaBell className="icono" />
                      <span className="badge rounded-pill bg-danger">5</span>
                    </div>
                  </div>
                  <div className="notificacion">
                    <Link
                      to="/"
                      className="text-decoration-none"
                      style={{ color: "#8D93AB" }}
                      onClick={logout}
                    >
                      <FaSignOutAlt className="icono" />
                      <span>Logout</span>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
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
                      <button className="btn btn-primary" id="custom-file-upload" onChange={handleUploadImage} type="button" style={{ margin: "1px" }}>
                        <label>Subir archivo
                          <input type="file" accept="image/jpeg, image/png, image/jpg" style={{ display: "none" }} /></label>
                      </button>
                      {mostrarBotonFoto && (<button className="btn btn-primary" id="custom-file-upload" onClick={subirFoto} type="button" style={{ margin: "1px" }}>
                        Guardar foto</button>)}
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
                            onChange={(e) => setCorreo(e.target.value.toLowerCase())} disabled={!editable} style={{ textAlign: "center" }} autoComplete="off" />
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
                        <button className="btn btn-primary" type="submit" onClick={editable ? handleSave : handleEdit} style={{ margin: "1px" }}>
                          {editable ? "Guardar Cambios" : "Editar Informacion"}
                        </button>
                        {mostrarCancelar && (<button className="btn btn-primary" type="submit" onClick={handleCancelar} style={{ margin: "1px" }}>
                          Cancelar
                        </button>)}
                      </form>
                    </div>
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