import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Layout from '../components/layout/Layout';
import DetallesProducto from '../components/layout/DetallesProducto';
import useProductos from '../hooks/useProductos';

const Buscar = () => {

    const [resultado, setResultado] = useState([]);

    const router = useRouter();
    const { query: { q } } = router;

    // Todos los productos
    const { productos } = useProductos('creado');

    useEffect(() => {

        const busqueda = q.toLowerCase();

        const filtro = productos.filter(producto => {
            return (
                producto.nombre.toLowerCase().includes(busqueda) ||
                producto.descripcion.toLowerCase().includes(busqueda)
            )
        })

        setResultado(filtro);

    }, [q, productos]);


    return (
        <div>
            <Layout>
                <div className="listado-productos">
                    <div className="contenedor">
                        <div className="bg-white">
                            {
                                resultado.map(producto => (
                                    <DetallesProducto
                                        key={producto.id}
                                        {...producto}
                                    />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default Buscar;