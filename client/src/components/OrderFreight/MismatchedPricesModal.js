import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const MismatchedPricesModal = ({ show, handleClose, mismatchedPrices }) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Mismatched Prices</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {mismatchedPrices.length > 0 ? (
        mismatchedPrices.map((item, index) => (
          <p key={index}>
            Possible added option! Double check manually! ProductCode: {item.productCode}
          </p>
        ))
      ) : (
        <p>All product prices match.</p>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);

export default MismatchedPricesModal;
