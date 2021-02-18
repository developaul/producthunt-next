import React, { useEffect, useState, useContext, useRef } from 'react';

import Layout from '../components/layout/Layout';
import DetallesProducto from '../components/layout/DetallesProducto';
import { FirebaseContext } from '../firebase';

const Home = () => {

	const [productos, setProductos] = useState([]);

	const { firebase } = useContext(FirebaseContext);

	// Permite Obtener todos los productos
	useEffect(() => {

		(async () => {

			await firebase.db.collection('productos').orderBy('creado', 'desc').onSnapshot(handleSnapshot)

		})();

	}, []);

	function handleSnapshot(snapshot) {
		const productos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
		setProductos(productos);
	}

	return (
		<div>
			<Layout>
				<div className="listado-productos">
					<div className="contenedor">
						<div className="bg-white">
							{
								productos.map(producto => (
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

export default Home;