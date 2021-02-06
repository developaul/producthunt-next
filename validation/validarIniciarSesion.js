const validarIniciarSesion = values => {

    let errors = {};

    if (!values.email.trim())
        errors.email = "El email es obligatorio";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email.trim()))
        errors.email = "Email no válido";

    if (!values.password.trim())
        errors.password = "El password es obligatorio";
    else if (values.password.trim().length < 6)
        errors.password = "El password tiene que tener almenos 6 caracteres";

    return errors;
}

export default validarIniciarSesion;