const validarCrearProducto = values => {

    let errors = {};

    if (!values.nombre.trim())
        errors.nombre = "El nombre del producto es obligatorio";

    if (!values.empresa.trim())
        errors.empresa = "El Nombre de empresa es obligatorio";

    if (!values.url.trim())
        errors.url = "La url del producto es obligatorio";
    else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url.trim()))
        errors.url = "URL mal formateada o no válida";

    if (!values.descripcion.trim())
        errors.descripcion = "Agrega una descripción de tu producto";

    return errors;
}

export default validarCrearProducto;