import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';

import { FirebaseContext } from '../../firebase';
import Layout from '../../components/layout/Layout';
import Error404 from '../../components/layout/404';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

const ContenedorProducto = styled.div`
    @media(min-width: 768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #da552f;
    text-transform: uppercase;
    color: #fff;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

const Producto = () => {

    const router = useRouter();
    const { query: { id } } = router;

    const [producto, setProducto] = useState({});
    const [error, setError] = useState(false);
    const [comentario, setComentario] = useState({ message: '' });
    const [consultarDB, setConsultarDB] = useState(true);

    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect(() => {

        if (id && consultarDB) {

            (async () => {

                const productoQuery = await firebase.db.collection('productos').doc(id);

                const producto = await productoQuery.get();

                (producto.exists) ? setProducto(producto.data()) : setError(true);

                setConsultarDB(false);

            })();

        }

    }, [id, producto]);

    if (Object.keys(producto).length === 0 && !error) return <p>Cargando...</p>;

    const { comentarios, creado, creador, descripcion, empresa, nombre, url, urlImagen, votos, haVotado } = producto;

    // Administrar y validar los votos
    const votarProducto = async () => {

        if (!usuario) return router.push('/login');

        // Obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1;

        // Verificar si el usuario actual ha votado
        if (haVotado.includes(usuario.uid)) return;

        // Guardar el id del usuario que ha votado
        const hanVotado = [...haVotado, usuario.uid];

        // Actualizar en la BD
        await firebase.db.collection('productos').doc(id).update({
            votos: nuevoTotal,
            haVotado: hanVotado
        });

        // Actualizar el state
        setProducto({
            ...producto,
            votos: nuevoTotal
        });

        setConsultarDB(true);
    }

    // Funciones para crear comentarios 
    const comentarioChange = ({ target }) => setComentario({
        ...comentario,
        [target.name]: target.value
    });

    // Identifica si el comentario es del creador del producto
    const esCreador = id => (creador.id === id) ? true : false;

    const agregarComentario = async e => {
        e.preventDefault();

        if (!usuario) return router.push('/login');

        // Validar el comentario
        if (!comentario.message.trim()) return console.log('Comentario invalido');

        // Agregar información extra al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        // Tomar copia de comentarios y agregarlo al array
        const nuevosComentarios = [...comentarios, comentario];

        // Actualizar en la BD
        await firebase.db.collection('productos').doc(id).update({
            comentarios: nuevosComentarios
        });

        // Actualizar el State
        setProducto({
            ...producto,
            comentarios: nuevosComentarios
        });

        setConsultarDB(true);
    }

    // Revisa que el creador del producto sea el mismo que esta autenticado
    const puedeBorrar = () => {
        if (!usuario) return false;
        return esCreador(usuario.uid);
    }

    // Elimina un producto de base de datos
    const eliminarProducto = async () => {

        if (!usuario) return router.push('/login');
        if (!esCreador(usuario.uid)) return router.push('/');

        try {

            await firebase.db.collection('productos').doc(id).delete();
            router.push('/');

        } catch (err) {
            console.log(err);
        }

    }

    return (
        <Layout>
            <>
                { (error) ? <Error404 /> :
                    (
                        <div className="contenedor">
                            <h1
                                css={css`
                                text-align: center;
                                margin-top: 5rem;
                            `}
                            >
                                {nombre}
                            </h1>

                            <ContenedorProducto>
                                <div>
                                    <p>Publicado hace: {formatDistanceToNow(new Date(creado), { locale: es })}</p>

                                    <p>Por: {creador.nombre} de {empresa}</p>

                                    <img src={urlImagen} />

                                    <p>{descripcion}</p>

                                    {(usuario) &&
                                        (
                                            <>
                                                <h2>Agrega tu comentario</h2>

                                                <form
                                                    onSubmit={agregarComentario}
                                                >
                                                    <Campo>
                                                        <input
                                                            type="text"
                                                            name="message"
                                                            onChange={comentarioChange}
                                                        />
                                                    </Campo>

                                                    <InputSubmit
                                                        type="submit"
                                                        value="Agregar Comentario"
                                                    />
                                                </form>
                                            </>
                                        )
                                    }

                                    <h2
                                        css={css`
                                        margin: 2rem 0;
                                    `}
                                    >
                                        Comentarios
                                </h2>

                                    {(!comentarios.length) ? <p>Aún no hay comentarios</p> :
                                        (
                                            <ul>
                                                {comentarios.map((comentario, index) => (
                                                    <li
                                                        key={`${comentario.usuarioId}-${index}`}
                                                        css={css`
                                                        border: 1px solid #e1e1e1;
                                                        padding: 2rem;
                                                    `}
                                                    >
                                                        <p>{comentario.message}</p>
                                                        <p>
                                                            Escrito por
                                                        <span
                                                                css={css`
                                                                font-weight: bold;
                                                            `}
                                                            >
                                                                {''} {comentario.usuarioNombre}
                                                            </span>
                                                        </p>

                                                        { esCreador(comentario.usuarioId) && <CreadorProducto>Es creador</CreadorProducto>}
                                                    </li>
                                                ))}
                                            </ul>
                                        )
                                    }
                                </div>

                                <aside>
                                    <Boton
                                        target="_blank"
                                        bgColor="true"
                                        href={url}
                                    >
                                        Visitar URL
                                </Boton>

                                    <div
                                        css={css`
                                        margin-top: 5rem;
                                    `}
                                    >
                                        <p
                                            css={css`
                                        text-align: center;
                                    `}
                                        >
                                            {votos} Votos
                                    </p>

                                        {(usuario) &&
                                            (
                                                <Boton
                                                    onClick={votarProducto}
                                                >
                                                    Votar
                                                </Boton>
                                            )
                                        }
                                    </div>
                                </aside>
                            </ContenedorProducto>

                            { (puedeBorrar()) &&
                                (
                                    <Boton
                                        onClick={eliminarProducto}
                                    >
                                        Eliminar Producto
                                    </Boton>
                                )
                            }
                        </div>
                    )
                }
            </>
        </Layout>
    )
}

export default Producto;