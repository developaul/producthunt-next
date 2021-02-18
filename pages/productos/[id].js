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

const Producto = () => {

    const router = useRouter();
    const { query: { id } } = router;

    const [producto, setProducto] = useState({});
    const [error, setError] = useState(false);

    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect(() => {

        if (id) {

            (async () => {

                const productoQuery = await firebase.db.collection('productos').doc(id);

                const producto = await productoQuery.get();

                (producto.exists) ? setProducto(producto.data()) : setError(true);

            })();

        }

    }, [id, producto]);

    if (Object.keys(producto).length === 0) return <p>Cargando...</p>;

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
    }

    return (
        <Layout>
            <>
                { error && <Error404 />}

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

                                        <form>
                                            <Campo>
                                                <input
                                                    type="text"
                                                    name="message"
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

                            {comentarios.map(comentario => (
                                <li>
                                    <p>{comentario.nombre}</p>
                                    <p>Escrito por {comentario.usuarioNombre}</p>
                                </li>
                            ))}
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
                </div>
            </>
        </Layout>
    )
}

export default Producto;