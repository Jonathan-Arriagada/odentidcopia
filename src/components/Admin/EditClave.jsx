import React, { useState } from "react";
import { auth, verifCredenciales, reautenticar, actualizarClave, deslogear } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';


const EditClave = (props) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState('');
    const navigate = useNavigate()


    const validateFields = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Las nuevas contraseñas no coinciden!")
            setTimeout(clearError, 2000);
            return;
        } else {
            if (newPassword.length < 6) {
                setError("El password debe tener al menos 6 caracteres");
                setTimeout(clearError, 2000);
                return;
            } else {

                update(e);
            }
        }
    }

    const update = async (e) => {
        e.preventDefault();
        const email = prompt("Ingrese su correo electrónico");
        const password = prompt("Ingrese su contraseña");
        const credentials = verifCredenciales(email, password);

        await reautenticar(auth.currentUser, credentials)
            .then(({ user }) => {
                actualizarClave(user, newPassword).then(() => {
                    console.log('Succeed')
                    props.onHide();
                    deslogear(auth);
                    localStorage.setItem("user", JSON.stringify(null));
                    navigate("/")
                })
            })
            .catch((error) => {
                console.log(error);
                setNewPassword("");
                setConfirmPassword("");
                setError("");
                props.onHide();
                window.alert("Error Actualizando. Debe autenticarse correctamente!");
            });
    };

    const clearError = () => {
        setError("");
    };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton onClick={() => {
                props.onHide();
                setNewPassword("");
                setConfirmPassword("");
                setError("")
            }}>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h1>Cambiar Contraseña</h1>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    <div className="col">
                        <form onSubmit={validateFields}>
                            <div className="row">
                                <div className="col mb-6">
                                    <label className="form-label">Nueva Contraseña</label>
                                    <input
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        type="password"
                                        className="form-control"
                                        minLength={6}
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col mb-6">
                                    <label className="form-label">Reingrese Nueva Contraseña</label>
                                    <input
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        type="password"
                                        className="form-control"
                                        minLength={6}
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: "flex" }}>
                                <button
                                    type="submit"
                                    onClick={validateFields}
                                    className="btn btn-primary"
                                >
                                    Guardar Nueva Clave
                                </button>
                                {error && (
                                    <div className="alert alert-danger" role="alert" style={{ margin: '10px' }}>
                                        {error}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default EditClave;