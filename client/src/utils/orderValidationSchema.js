import * as yup from 'yup';

let currentDate = new Date();
let maxDate = currentDate.setMonth(currentDate.getMonth() + 3);

export const ORDER_VALIDATION_SCHEMA = yup.object({
    //fullName: yup.string('Allow values just a string').min(2, 'Min length is 2 symbols').max(10, 'Max length is 10 symbols').required('Full Name Is Required'),
    //date: yup.date().min(new Date(), 'Please choose valid date').max(new Date(maxDate), 'The maximum allowable date should not exceed a three-month period from the current date').required()
    po: yup.string('Allow values just a number').min(5, 'Min 5 symbols').max(10, 'Max 10 symbols at this moment').required('PO Number Is Required')
});


export const ADD_CUSTOM_PRODUCT = yup.object({
    productCode: yup.string().required('productCode is required'),
    vendorCode: yup.string().required('vendorCode is required'),
    productName: yup.string().required('productName is required'),
    quantity: yup.number('Quantity must be a number').required(),
    webPrice: yup.number().typeError('Vendor Price must be a number').required('Vendor Price is required'), //.positive('Vendor Price must be a positive number'),
    Vendor_Price: yup.number().typeError('Vendor Price must be a number').required('Vendor Price is required'), //.positive('Vendor Price must be a positive number'),
    discount: yup.number('Please enter discount from 0 to 100').required('discount is required').min(0).max(100)
});

export const LOGIN_VALIDATION_SCHEMA = yup.object({
    login: yup.string().required('Login is required').min(3),
    password: yup.string().required('Password is required').min(3),
});

export const ADD_OPTION_SCHEMA = yup.object({
    options_id: yup.number().required('Option id is required').min(3),
    product_code: yup.string().required('productCode is required'),
    price: yup.number().typeError('Price must be a number').required('Price is required'),
    quantity: yup.number('Quantity must be a number').required(),
    is_default: yup.boolean().required()
});


// .test('is-decimal','Vendor Price must have maximum 2 digits after the decimal point',value => (value === undefined || value === null || /^\d+(\.\d{1,2})?$/.test(value.toString())))),
// .matches(/^\d+(\.\d{1,2})?$/)