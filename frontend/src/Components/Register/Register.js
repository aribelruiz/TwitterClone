import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import './Register.scss';

function Register() {

    let navigate = useNavigate();

    const inititalValues = {
        username: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required(),
        password: Yup.string().min(4).max(20).required(),
    });
      
    const onSubmit = (data) => {
        axios.post("http://localhost:8080/auth", data).then((res) => {
            console.log(data);
            navigate(`/login`);
        });
    }

    return (
        <div className='register'>
            <Formik initialValues={inititalValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form className='post-form'>
                    <label> Username </label>
                    <ErrorMessage name='username' component='span'/>
                    <Field id='inputRegisterUsername' name='username' placeholder="(Ex. user123...)"/>

                    <label> Password </label>
                    <ErrorMessage name='password' component='span'/>
                    <Field id='inputRegisterPassword' type="password" name='password' placeholder="(Your Password...)"/>

                    <button type='submit'> Register </button>
                </Form>
            </Formik>
        </div>
    );
}

export default Register;