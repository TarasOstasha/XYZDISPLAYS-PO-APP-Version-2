import classNames from 'classnames';
import React, { useState } from 'react';
import { BoxArrowInRight, Key, PersonFill } from 'react-bootstrap-icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import logo from './Logo-Master.png'
import styles from './Auth.module.scss'
import { LOGIN_VALIDATION_SCHEMA } from '../../utils/orderValidationSchema';




function Auth({ onSubmit, loginError }) {
    // const [authorization, setAuthorization] = useState(false);
    const initialValues = {
        login: '',
        password: '',
      };
    
      const handleSubmit = ({ login, password }) => {
        // You can perform your registration logic here
        //console.log('Submitted:', values);
        // const ifValid = {
        //     login: 'xyz',
        //     password: '1111'
        // }
        //const isValidLogin = login === ifValid.login && password === ifValid.password;
        //setAuthorization(isValidLogin)
        onSubmit({login, password})
        console.log(loginError);
      };  
  return (
    <div className={styles.formWrapper}>
        
        <div className={styles.headForm}>
            {/* <h2><PersonFill /></h2> */}
            <img className={styles.logoImg} src={logo} alt="xyzdisplays" />
        </div>
        <Formik
            initialValues={initialValues}
            validationSchema={LOGIN_VALIDATION_SCHEMA}
            onSubmit={handleSubmit}
            >
             {(formikProps) => {
                const loginClassNames = classNames(styles.input, {
                    [styles.valid]:
                        formikProps.touched.login &&
                        !formikProps.errors.login,
                    [styles.invalid]:
                        formikProps.touched.login &&
                        formikProps.errors.login,
                    [styles.invalid]: loginError,    
                })
                const passwordClassNames = classNames(styles.input, {
                    [styles.valid]:
                        formikProps.touched.password &&
                        !formikProps.errors.password,
                    [styles.invalid]:
                        formikProps.touched.password &&
                        formikProps.errors.password,
                    [styles.invalid]: loginError,
                })    
                return (
                    <Form className={styles.loginForm}> 
                    <div className='input-group mb-3'>
                        <div className="input-group-prepend">
                            <span className="input-group-text"><BoxArrowInRight /></span>
                        </div>
                        <Field onChange={formikProps.handleChange} value={formikProps.values.login} className={`${styles.loginInput} ${loginClassNames}`} type="text" id="login" name="login" />
                        <ErrorMessage className={styles.errorDiv} name="login" component="div" />
                    </div>
                    <div className='input-group mb-3'>
                        <div className="input-group-prepend">
                            <span className="input-group-text"><Key /></span>
                        </div>
                        <Field onChange={formikProps.handleChange} value={formikProps.values.password} className={`${styles.passwordInput} ${passwordClassNames}`} type="password" id="password" name="password" />
                        <ErrorMessage className={styles.errorDiv} name="password" component="div" />
                    </div>
                    {loginError && <div className={styles.errorDiv}>Invalid login credentials </div>}
                    <div className={styles.buttonWrapper}>
                        <Button variant="btn btn-primary" type='submit'>
                                Login
                        </Button>
                    </div>
                </Form>
                )
             }}   

        </Formik>
  </div>
  )
}

export default Auth