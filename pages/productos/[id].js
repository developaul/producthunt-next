import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import { FirebaseContext } from '../../firebase';
import Layout from '../../components/layout/Layout';
import Error404 from '../../components/layout/404';

const Producto = () => {

    const router = useRouter();
    const { query: { id } } = router;

    const [producto, setProducto] = useState({});
    const [error, setError] = useState(false);

    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {

        if (id) {

            (async () => {

                const productoQuery = await firebase.db.collection('productos').doc(id);

                const producto = await productoQuery.get();

                (producto.exists) ? setProducto(producto.data()) : setError(true);

            })();

        }


    }, [id]);

    // Verificar si el producto éxiste
    // if (error) return <Error404 />;

    return (
        <Layout>
            <>
                { error && <Error404 />}
            </>
        </Layout>
    )
}

export default Producto;