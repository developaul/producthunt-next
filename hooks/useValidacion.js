import { useState, useEffect } from 'react';

const useValidacion = (initialState, validar, fn) => {

    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [submitForm, setSubmitForm] = useState(false);

    useEffect(() => {

        if (submitForm) {
            const noErrors = Object.keys(errors).length === 0;

            if (noErrors) {
                fn();
            }

            setSubmitForm(false);
        }

    }, [submitForm]);

    const handleChange = ({ target }) => setValues({
        ...values,
        [target.name]: target.value
    });

    const handleSubmit = e => {
        e.preventDefault();

        const errorsValidacion = validar(values);
        setErrors(errorsValidacion);

        setSubmitForm(true);
    }

    const handleBlur = e => {
        const errorsValidacion = validar(values);
        setErrors(errorsValidacion);
    }

    return {
        values,
        errors,
        submitForm,
        handleChange,
        handleSubmit,
        handleBlur
    };
}

export default useValidacion;