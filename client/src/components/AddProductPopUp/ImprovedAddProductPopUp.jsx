import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import classNames from 'classnames';
import axios from 'axios';

import styles from './AddProductPopUp.module.scss';
import { ADD_CUSTOM_PRODUCT } from '../../utils/orderValidationSchema';
import { getProductById } from '../../api';
import { VENDOR_LIST } from '../../utils/vendorsData';
import { useNotifications } from '../OrderFreightForm/utils/notifications';

const ImprovedAddProductPopUp = ({ rerenderOrderList, onFormValuesChange, isEditingTop }) => {
  const API_BASE_URL = useMemo(() => 
    window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://xyzdisplays-po-app-version-2-1.onrender.com',
    []
  );

  const { success, error, warning } = useNotifications();
  const [show, setShow] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productCode, setProductCode] = useState('');

  const initialValues = useMemo(() => ({
    productCode: '',
    vendorCode: '',
    productName: '',
    quantity: '',
    webPrice: '',
    Vendor_Price: '',
    discount: '',
  }), []);

  const handleClose = useCallback(() => setShow(false), []);
  const handleWarningClose = useCallback(() => setShowWarning(false), []);

  const handleShow = useCallback(() => {
    if (isEditingTop) {
      setShowWarning(true);
      setShow(false);
      warning('Please exit edit product mode and try again.');
    } else {
      setShow(true);
    }
  }, [isEditingTop, warning]);

  const onSubmit = useCallback(async (values, formikBag) => {
    try {
      setIsLoading(true);
      
      const newProduct = {
        ProductCode: [values.productCode],
        Vendor_PartNo: [values.vendorCode],
        ProductName: [values.productName],
        Quantity: [values.quantity],
        ProductPrice: [values.webPrice],
        Vendor_Price: [values.Vendor_Price],
        discount: [values.discount],
      };

      onFormValuesChange(newProduct);
      success('Product added successfully!');
      setShow(false);
      formikBag.resetForm();
    } catch (err) {
      error('Failed to add product. Please try again.');
      console.error('Error adding product:', err);
    } finally {
      setIsLoading(false);
    }
  }, [onFormValuesChange, success, error]);

  const findProduct = useCallback(async (productCode) => {
    if (!productCode || productCode.trim().length === 0) {
      warning('Please enter a product code');
      return;
    }

    setIsLoading(true);
    const lowerCaseProduct = productCode.toLowerCase();
    setProductCode(lowerCaseProduct);

    try {
      const productUrl = `${API_BASE_URL}/api/products/${lowerCaseProduct}`;
      const response = await axios.get(productUrl);
      
      const { xmldata: { Products } } = response.data;
      
      if (!Products || Products.length === 0) {
        warning('Product not found');
        return null;
      }

      const matchingVendor = VENDOR_LIST.find(vendor => 
        lowerCaseProduct.startsWith(vendor.code)
      );
      
      const discount = matchingVendor?.discount?.toString() || '0';
      
      const fieldsToUpdate = {
        productName: Products[0].ProductName?.[0] || '',
        vendorCode: Products[0].Vendor_PartNo?.[0] || '',
        quantity: '1',
        webPrice: parseFloat(Products[0].ProductPrice?.[0] || 0).toFixed(2),
        Vendor_Price: parseFloat(Products[0].Vendor_Price?.[0] || 0).toFixed(2),
        discount
      };

      success('Product found and details loaded!');
      return fieldsToUpdate;
      
    } catch (err) {
      error('Failed to fetch product details. Please check the product code.');
      console.error('Error fetching product:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, success, error, warning]);

  const renderFieldWithValidation = useCallback((name, placeholder, type = 'text', formikProps) => {
    const fieldClassNames = classNames(styles.input, {
      [styles.valid]: formikProps.touched[name] && !formikProps.errors[name],
      [styles.invalid]: formikProps.touched[name] && formikProps.errors[name],
    });

    return (
      <>
        <Field
          value={formikProps.values[name]}
          onChange={formikProps.handleChange}
          type={type}
          name={name}
          id={name}
          className={`form-control ${fieldClassNames}`}
          placeholder={placeholder}
          disabled={isLoading}
        />
        <ErrorMessage
          name={name}
          className={styles.errorDiv}
          component="div"
        />
      </>
    );
  }, [isLoading]);

  return (
    <div>
      {rerenderOrderList.length !== 0 && (
        <Button 
          variant="btn btn-success" 
          onClick={handleShow}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Add Product'}
        </Button>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="popup">
            <div className="popup-inner">
              <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={ADD_CUSTOM_PRODUCT}
              >
                {(formikProps) => {
                  const handleFindProduct = async () => {
                    const productData = await findProduct(formikProps.values.productCode);
                    if (productData) {
                      Object.keys(productData).forEach(field => {
                        formikProps.setFieldValue(field, productData[field]);
                      });
                    }
                  };

                  return (
                    <Form>
                      <div className={styles.fieldGroup}>
                        {renderFieldWithValidation('productCode', 'Stock #', 'text', formikProps)}
                        <Button 
                          onClick={handleFindProduct} 
                          type="button" 
                          className="btn btn-primary"
                          disabled={isLoading || !formikProps.values.productCode}
                        >
                          {isLoading ? 'Finding...' : 'Find'}
                        </Button>
                      </div>

                      {renderFieldWithValidation('vendorCode', 'Vendor Code', 'text', formikProps)}
                      {renderFieldWithValidation('productName', 'Product Name', 'text', formikProps)}
                      {renderFieldWithValidation('quantity', 'Quantity', 'number', formikProps)}
                      {renderFieldWithValidation('webPrice', 'Web Price', 'number', formikProps)}
                      {renderFieldWithValidation('Vendor_Price', 'Vendor Price', 'number', formikProps)}
                      {renderFieldWithValidation('discount', 'Discount %', 'number', formikProps)}

                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                          Close
                        </Button>
                        <Button 
                          type="submit" 
                          className="btn btn-success"
                          disabled={isLoading || !formikProps.isValid}
                        >
                          {isLoading ? 'Adding...' : 'ADD'}
                        </Button>
                      </Modal.Footer>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Warning modal */}
      <Modal
        show={showWarning}
        onHide={handleWarningClose}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="bg-warning text-dark">
          <Modal.Title className="d-flex align-items-center">Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please exit Edit Product Mode and try again.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleWarningClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ImprovedAddProductPopUp;
