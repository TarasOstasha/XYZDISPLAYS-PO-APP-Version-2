import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ProductSplitPopup = ({ vendorKitsLength, onConfirm }) => {
  const [show, setShow] = useState(false);

  // const handleShow = () => {
  //   if (vendorKitsLength > 0) {
  //     setShow(true);
  //   }
  // };


  const handleConfirm = () => {
    setShow(false);
    onConfirm(); 
  };


  const handleCancel = () => {
    setShow(false);
  };


  useEffect(() => {
    // handleShow();
  }, [vendorKitsLength]);

  return (
    <Modal show={show} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Split Products</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        There are {vendorKitsLength} kits. Do you want to split the products?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductSplitPopup;
