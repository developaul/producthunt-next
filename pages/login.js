import React, { useState } from 'react';
import Router from 'next/router';
import { css } from '@emotion/react';
import firebase from '../firebase';

import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import useValidacion from '../hooks/useValidacion';
import Layout from '../components/layout/Layout';
import validarIniciarSesion from '../validation/validarIniciarSesion';

const INITIAL_STATE = {
    email: '',
    password: ''
};

const Login = () => {

    const [error, setError] = useState(false);

    const iniciarSesion = async () => {
        try {
            await firebase.login(email, password);
            Router.push('/');
        } catch (err) {
            console.error('Hubo un error al iniciando sesión', err);
            setError(err.message);
        }
    }

    const {
        values,
        errors,
        handleChange,
        handleSubmit,
        handleBlur
    } = useValidacion(INITIAL_STATE, validarIniciarSesion, iniciarSesion);

    const { email, password } = values;

    return (
        <>
            <Layout>
                <h1
                    css={css`
                        text-align: center;
                        margin-top: 5rem;
                    `}
                >
                    Iniciar Sesión
                </h1>

                <Formulario
                    onSubmit={handleSubmit}
                    noValidate
                >
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
                        value="Iniciar Sesión"
                    />
                </Formulario>
            </Layout>
        </>
    )
}

export default Login;