import React, { useState } from 'react';
import Router from 'next/router';
import { css } from '@emotion/react';
import firebase from '../firebase';


import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import useValidacion from '../hooks/useValidacion';
import Layout from '../components/layout/Layout';
import validarCrearCuenta from '../validation/validarCrearCuenta';

const INITIAL_STATE = {
    nombre: '',
    email: '',
    password: ''
};

const CrearCuenta = () => {

    const [error, setError] = useState(false);

    const crearCuenta = async () => {
        try {
            await firebase.registrar(nombre, email, password);
            Router.push('/');
        } catch (err) {
            console.error('Hubo un error al crear el usuario', err);
            setError(err.message);
        }
    }

    const {
        values,
        errors,
        handleChange,
        handleSubmit,
        handleBlur
    } = useValidacion(INITIAL_STATE, validarCrearCuenta, crearCuenta);

    const { nombre, email, password } = values;

    return (
        <>
            <Layout>
                <h1
                    css={css`
                        text-align: center;
                        margin-top: 5rem;
                    `}
                >
                    Crear Cuenta
                </h1>

                <Formulario
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Campo>
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            placeholder="Tu Nombre"
                            name="nombre"
                            value={nombre}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>

                    {errors.nombre && <Error>{errors.nombre}</Error>}

                    <Campo>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Tu Email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>

                    {errors.email && <Error>{errors.email}</Error>}

                    <Campo>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Tu Password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>

                    {errors.password && <Error>{errors.password}</Error>}
                    {error && <Error>{error}</Error>}

                    <InputSubmit
                        type="submit"
                        value="Crear Cuenta"
                    />
                </Formulario>
            </Layout>
        </>
    )
}

export default CrearCuenta;