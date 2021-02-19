import { useState, useEffect, useContext } from 'react';

import { FirebaseContext } from '../firebase';

const useProductos = orden => {

    const [productos, setProductos] = useState([]);

    const { firebase } = useContext(FirebaseContext);

    // Permite Obtener todos los productos
    useEffect(() => {

        (async () => {

            await firebase.db.collection('productos').orderBy(orden, 'desc').onSnapshot(handleSnapshot)

        })();

    }, []);

    function handleSnapshot(snapshot) {
        const productos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductos(productos);
    }

    return { productos };
}

export default useProductos;