import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';
import FileUploader from 'react-firebase-file-uploader';

import { FirebaseContext } from '../firebase';

import Layout from '../components/layout/Layout';
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validation/validarCrearProducto';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

const INITIAL_STATE = {
    nombre: '',
    empresa: '',
    imagen: '',
    url: '',
    descripcion: ''
};

const NuevoProducto = () => {

    // State de las imagenes
    const [nombreImagen, setNombreImagen] = useState('');
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [urlImagen, setUrlImage] = useState('');

    // Context con las operaciones crud de firebase
    const { firebase, usuario } = useContext(FirebaseContext);

    // hook de router para redireccionar
    const router = useRouter();

    const {
        values,
        errors,
        handleChange,
        handleSubmit,
        handleBlur
    } = useValidacion(INITIAL_STATE, validarCrearProducto, crearProducto);

    const { nombre, empresa, url, descripcion } = values;

    async function crearProducto() {

        // Si el usuario no esta autenticado
        if (!usuario) return router.push('/login');

        // Crear nuevo producto
        const producto = {
            nombre,
            empresa,
            url,
            urlImagen,
            descripcion,
            votos: 0,
            comentarios: [],
            creado: Date.now()
        }

        try {

            // Insertarlo en la base de datos
            await firebase.db.collection('productos').add(producto);

            return router.push('/');

        } catch (err) {

            console.error(err);

        }

    }

    const handleUploadStart = () => {
        setProgreso(0);
        setSubiendo(true);
    }

    const handleProgress = progress => setProgreso({ progress });

    const handleUploadError = error => {
        setSubiendo(false);
        console.error(error);
    };

    const handleUploadSuccess = nombre => {
        setProgreso(100);
        setSubiendo(false);
        setNombreImagen(nombre);
        firebase
            .storage
            .ref("productos")
            .child(nombre)
            .getDownloadURL()
            .then(url => {
                setUrlImage(url);
            });
    };

    return (
        <>
            <Layout>
                <h1
                    css={css`
                        text-align: center;
                        margin-top: 5rem;
                    `}
                >
                    Nuevo Producto
                </h1>

                <Formulario
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <fieldset>
                        <legend>Información General</legend>

                        <Campo>
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                type="text"
                                id="nombre"
                                placeholder="Nombre Producto"
                                name="nombre"
                                value={nombre}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>

                        {errors.nombre && <Error>{errors.nombre}</Error>}

                        <Campo>
                            <label htmlFor="empresa">Empresa</label>
                            <input
                                type="text"
                                id="empresa"
                                placeholder="Nombre Empresa o Compañia"
                                name="empresa"
                                value={empresa}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>

                        {errors.empresa && <Error>{errors.empresa}</Error>}


                        <Campo>
                            <label htmlFor="imagen">Imagen</label>
                            <FileUploader
                                accept="image/*"
                                id="imagen"
                                name="imagen"
                                randomizeFilename
                                storageRef={firebase.storage.ref("productos")}
                                onUploadStart={handleUploadStart}
                                onUploadError={handleUploadError}
                                onUploadSuccess={handleUploadSuccess}
                                onProgress={handleProgress}
                            />
                        </Campo>

                        <Campo>
                            <label htmlFor="url">url</label>
                            <input
                                type="url"
                                id="url"
                                name="url"
                                placeholder="URL de tu producto"
                                value={url}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>

                        {errors.url && <Error>{errors.url}</Error>}
                    </fieldset>

                    <fieldset>
                        <legend>Sobre tu producto</legend>

                        <Campo>
                            <label htmlFor="descripcion">Descripción</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={descripcion}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            ></textarea>
                        </Campo>

                        {errors.descripcion && <Error>{errors.descripcion}</Error>}
                    </fieldset>

                    <InputSubmit
                        type="submit"
                        value="Crear Producto"
                    />
                </Formulario>
            </Layout>
        </>
    )
}

export default NuevoProducto;