import React, { useState, useEffect} from "react";
import {doc, getDoc, updateDoc, } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig/firebase";

const MiPerfil = () => {
  const [user, ] = useState('');
  const [userData, setUserData] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [apellidoConNombre, setApellidoConNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "user", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserData(userData);
          setCodigo(userData.codigo);
          setApellidoConNombre(userData.apellidoConNombre);
          setCorreo(userData.correo);
          setPassword(userData.password);
          setTelefono(userData.telefono);
        } else {
          console.log("User data not found");
        }
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching user data:", error);
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const userDocRef = doc(db, "user", user.uid);
      await updateDoc(userDocRef, {
        codigo,
        apellidoConNombre,
        correo,
        password,
        telefono,
      });

      // Actualizar en el módulo de autenticación de Firebase usando el SDK de administración
      const currentUser = auth.currentUser;
      await currentUser.updateProfile({
        displayName: apellidoConNombre,
        photoURL: "",
      });
      await currentUser.updateEmail(correo);
      await currentUser.updatePassword(password);

      setIsEditing(false);
    } catch (error) {
      console.log("Error updating user data:", error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!userData) {
    return <p>No user data found.</p>;
  }

  return (
    <div>
      <h1>Mi Perfil</h1>
      <div>
        <label>Código:</label>
        {isEditing ? (
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
        ) : (
          <p>{codigo}</p>
        )}
      </div>
      <div>
        <label>Apellido y Nombre:</label>
        {isEditing ? (
          <input
            type="text"
            value={apellidoConNombre}
            onChange={(e) => setApellidoConNombre(e.target.value)}
          />
        ) : (
            <p>{apellidoConNombre}</p>
            )}
          </div>
          <div>
            <label>Correo:</label>
            {isEditing ? (
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        ) : (
          <p>{correo}</p>
        )}
      </div>
      <div>
        <label>Password:</label>
        {isEditing ? (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        ) : (
          <p>********</p>
        )}
      </div>
      <div>
        <label>Teléfono:</label>
        {isEditing ? (
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        ) : (
          <p>{telefono}</p>
        )}
      </div>
      <div>
        {isEditing ? (
          <button onClick={handleSave}>Guardar</button>
        ) : (
          <button onClick={handleEdit}>Editar</button>
        )}
      </div>
    </div>
  );
};

export default MiPerfil;