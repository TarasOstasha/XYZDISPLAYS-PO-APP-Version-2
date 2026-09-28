import React from 'react';
import { Field, ErrorMessage } from 'formik';
import styles from '../OrderFreightForm.module.scss';

const OrderHeader = ({ 
  formikProps, 
  setOrderId, 
  rerenderOrderList, 
  initialValues,
  shipInfo,
  handleShipInfoChange,
  renderShipInfoBottom,
  setCustomFieldInHand,
  setCustomFieldInHand1,
  rerenderVendorName 
}) => {
  return (
    <>
      <div className={styles.orderHead}>
        <div className={styles.orderHeadTop}>
          <strong>PURCHASE ORDER</strong>
        </div>
      </div>
      
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Customer</th>
            <th scope="col">General Info</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.topBlockTd}>
              <div>xyzDisplays</div>
              <div>170 Changebridge Rd. Bldg A7</div>
              <div>Montville, NJ 07045</div>
              <div>973-515-5151</div>
              <div>sales@xyzDisplays.com</div>
            </td>
            <td className={styles.topBlockTd}>
              <div className="input-group mb-3">
                <span className="input-group-text">P.O. #:</span>
                <Field
                  name="po"
                  type="text"
                  className="form-control"
                  value={formikProps.values.po}
                  onChange={(e) => {
                    formikProps.handleChange(e);
                    setOrderId(e.target.value);
                    rerenderVendorName('or');
                  }}
                />
                <ErrorMessage
                  name="po"
                  className={styles.errorDiv}
                  component="div"
                />
              </div>

              {rerenderOrderList.length !== 0 && (
                <>
                  <div className="input-group mb-3">
                    <span className="input-group-text">Date:</span>
                    <input
                      defaultValue={initialValues.date}
                      name="date"
                      type="date"
                      className="form-control"
                      placeholder="Choose Date"
                      aria-label="date"
                      aria-describedby="basic-addon1"
                    />
                  </div>
                  
                  <div className="input-group mb-3">
                    <span className="input-group-text">Ship Info:</span>
                    <input
                      style={{ background: 'yellow' }}
                      name="ship"
                      type="text"
                      value={shipInfo}
                      onChange={handleShipInfoChange}
                      className="form-control"
                      placeholder="Choose freight info, example Freight"
                      aria-label="ship"
                      aria-describedby="basic-addon1"
                      id="ship"
                    />
                  </div>
                  
                  <div className={styles.regDiv} id="shipInfoBottom">
                    {renderShipInfoBottom()}
                  </div>
                  
                  <div className="input-group mb-3">
                    <span className="input-group-text inHand">In Hand Date:</span>
                    <input
                      style={{ background: 'yellow' }}
                      name="inHand"
                      type="string"
                      value={setCustomFieldInHand}
                      onChange={(e) => {
                        formikProps.handleChange(e);
                        setCustomFieldInHand1(e.target.value);
                      }}
                      className="form-control"
                      aria-label="inHand"
                      aria-describedby="basic-addon1"
                    />
                  </div>
                </>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default OrderHeader;
