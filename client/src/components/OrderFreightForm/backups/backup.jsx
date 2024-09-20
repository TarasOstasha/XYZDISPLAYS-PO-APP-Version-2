import { Formik, Form, Field, ErrorMessage } from 'formik'
import { ORDER_VALIDATION_SCHEMA } from '../../../utils/orderValidationSchema'
import { VENDOR_LIST } from '../../../utils/vendorsData'
import { yellow, descriptionWidth, attension } from '../../../stylesConstants'

import styles from './OrderFreightForm.module.scss'
import { useState } from 'react'
import AddProductPopUp from '../../AddProductPopUp'
import { saveOrder } from '../../../api'

function OrderFreightForm({
  setOrderId,
  shipCompanyName,
  shippingAddress1,
  shipCity,
  shipCountry,
  shipPostalCode,
  rerenderOrderList,
  handleToRemove,
  handleToEdit,
  isEditing,
  handleToSave,
}) {
  const initialValues = {
    po: '',
    date: new Date().toISOString().split('T')[0],
    ship: '',
    shipInfoDescription: '',
    inHand: new Date(),
    vendor: '',
    // gender: GENDERS[0],
    shipTo: '',
    orderNotes: '',
    vendorName: 'Choose Vendor',
    vendorAddress: '',
    vendorDiscount: 0,
    productCode: '',
    productName: '',
    productQuantity: '',
    productPrice: '',
    productPriceWithDiscount: '',
    totalAmount: '',
    isChecked: false,
    selectedItems: Array(rerenderOrderList.length).fill(false),
    productTableData: [],
    vendorEmails: [],
  }
  const handleSubmit = async (values, formikBag) => {
    console.log('values :>> ', values)
    values.shipTo = document.getElementById('shipTo').innerText
    const orderData = await saveOrder(values)
    console.log(orderData, '<< orderData from back end')
    //formikBag.resetForm()
  }

  //let filteredOrderList = []
  const [filteredOrderList, setFilteredOrderList] = useState([])
  const [selectedVendor, setSelectedVendorCode] = useState(false)
  const [checkByVendor, setCheckByVendor] = useState(false)
  const [checkboxFilteredIndex, setCheckboxFilteredIndex] = useState([])
  const [hideButton, setHideButton] = useState(false)

  const toggleVendorVisibility = () => {
    setCheckByVendor(!checkByVendor)
    //console.log(checkByVendor)
  }

  const checkNextNotStartsWithTwoSameLetters = (array) => {
    for (let i = 0; i < array.length - 1; i++) {
      const currentWord = array[i].ProductCode?.[0] // ProductCode?.[0]
      const nextWord = array[i + 1].ProductCode?.[0]
      const currentFirstTwoLetters = currentWord.slice(0, 2).toLowerCase()
      const nextFirstTwoLetters = nextWord.slice(0, 2).toLowerCase()
      if (currentFirstTwoLetters !== nextFirstTwoLetters) {
        return true // Next value does not start with the same two letters as previous one
      }
    }
    return false // Next value starts with the same two letters as previous one for all elements
  }

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={ORDER_VALIDATION_SCHEMA}
      >
        {(formikProps) => (
          <Form>
            <div className={styles.orderHead}>
              <div className={styles.orderHeadTop}>
                <strong>PURCHASE ORDER</strong>
              </div>
              {/* <div className={styles.orderHeadBottom}>
                <Field
                  as="select"
                  name="vendorName"
                  value={formikProps.values.vendorName}
                  onChange={(event) => {
                    const selectedVendor = VENDOR_LIST.find(
                      (vendor) => vendor.name === event.target.value,
                    )
                    formikProps.setFieldValue('vendorName', event.target.value)
                    formikProps.setFieldValue('vendorAddress',selectedVendor.address)
                    formikProps.setFieldValue('vendorDiscount',selectedVendor.discount)
                    formikProps.setFieldValue('ship', selectedVendor.shipInfo)
                    formikProps.setFieldValue('shipInfoDescription', selectedVendor.shipInfoDescription)
                  }}
                  className="form-select"
                  aria-label="Default select example"
                >
                  {VENDOR_LIST.map((v, i) => (
                    <option key={i} value={v.name}>
                      {v.name}
                    </option>
                  ))}
                </Field>
              </div> */}
            </div>
            <></>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Customer</th>
                  <th scope="col">General Info</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div>xyzDisplays </div>
                    <div>170 Changebridge Rd. Bldg A7 </div>
                    <div>Montville, NJ 07045</div>
                    <div>973-515-5151 </div>
                    <div>sales@xyzDisplays.com</div>
                  </td>
                  <td>
                    <div className="input-group mb-3">
                      <span className="input-group-text">P.O. #:</span>
                      <Field
                        name="po"
                        type="number"
                        className="form-control"
                        value={formikProps.values.po}
                        onChange={(e) => {
                          formikProps.handleChange(e)
                          setOrderId(e.target.value)
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
                            name="ship"
                            type="text"
                            value={formikProps.values.ship}
                            onChange={formikProps.handleChange}
                            className="form-control"
                            placeholder="Choose freight info, example Freight"
                            aria-label="ship"
                            aria-describedby="basic-addon1"
                          />
                        </div>
                        <div className={styles.regDiv}>
                          <span>
                            {formikProps.values.shipInfoDescription && (
                              <div>
                                {formikProps.values.shipInfoDescription
                                  .split('\n')
                                  .map((line, index) => (
                                    <div key={index}>{line}</div>
                                  ))}
                              </div>
                            )}
                          </span>
                        </div>
                        <div className="input-group mb-3">
                          <span className="input-group-text inHand">
                            In Hand Date:
                          </span>
                          <input
                            style={yellow}
                            name="inHand"
                            type="date"
                            value={formikProps.values.inHand}
                            onChange={formikProps.handleChange}
                            className="form-control"
                            placeholder="Choose in hand date"
                            aria-label="inHand"
                            aria-describedby="basic-addon1"
                          />
                        </div>
                      </>
                    )}
                  </td>
                </tr>
                <tr>
                  <th scope="col">Vendor</th>
                  <th scope="col">Ship To</th>
                </tr>
                <tr>
                  <td className={styles.myTd}>
                    {formikProps.values.vendorAddress && (
                      <div>
                        {formikProps.values.vendorAddress
                          .split('\n')
                          .map((line, index) => (
                            <div key={index}>{line}</div>
                          ))}
                      </div>
                    )}
                  </td>
                  <td className={styles.myTd} id="shipTo">
                    {shipCompanyName} <br />
                    {shippingAddress1} <br />
                    {shipCity} <br />
                    {shipCountry} <br />
                    {shipPostalCode}
                  </td>
                </tr>
              </tbody>
            </table>
            {rerenderOrderList.length !== 0 && (
              <div className={styles.filteredItems}>
                <label>
                  {' '}
                  <span>Filter Products: </span>
                  <Field
                    as="select"
                    name="vendorName"
                    value={formikProps.values.vendorName}
                    onChange={(event) => {
                      const selectedVendor = VENDOR_LIST.find(
                        (vendor) => vendor.name === event.target.value,
                        //(vendor) => { return vendor.name === event.target.value || choosenItems[0].startsWith(vendor.name)},
                      )
                      formikProps.setFieldValue(
                        'vendorName',
                        event.target.value,
                      )
                      formikProps.setFieldValue(
                        'vendorAddress',
                        selectedVendor.address,
                      )
                      formikProps.setFieldValue(
                        'vendorDiscount',
                        selectedVendor.discount,
                      )
                      formikProps.setFieldValue('ship', selectedVendor.shipInfo)
                      formikProps.setFieldValue(
                        'shipInfoDescription',
                        selectedVendor.shipInfoDescription,
                      )
                     setHideButton(true)
                      // formikProps.setFieldValue('productTableData', choosenItems)
                      const filteredOrderList = rerenderOrderList.filter(
                        (o) => {
                          const selectedVendorCode = o.ProductCode?.[0]
                            .toLowerCase()
                            .startsWith(selectedVendor.code)
                          //console.log(selectedVendorCode, '>> selectedVendorCode')
                          if (
                            selectedVendor.code !== null &&
                            selectedVendorCode !== false
                          ) {
                            return o.ProductCode?.[0]
                              .toLowerCase()
                              .startsWith(selectedVendor.code)
                          } else {
                            setSelectedVendorCode(false)
                          }
                        },
                      )
                      setFilteredOrderList(filteredOrderList)
                      formikProps.setFieldValue(
                        'productTableData',
                        filteredOrderList,
                      )
                      formikProps.setFieldValue(
                        'vendorEmails',
                        selectedVendor.email,
                      )
                    }}
                    className="form-select"
                    aria-label="Default select example"
                  >
                    {VENDOR_LIST.map((v, i) => (
                      <option key={i} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                  </Field>
                </label>
                <button
                  onClick={() => { 
                    setFilteredOrderList(rerenderOrderList); 
                    setHideButton(false); 
                    console.log(formikProps.values.vendorName); 
                  }}
                  type="button"
                  className="btn btn-secondary"
                >
                  Back to Original Order
                </button>
                {hideButton === false && (
                  <button
                    onClick={() => toggleVendorVisibility()}
                    type="button"
                    className="btn btn-primary"
                  >
                    Choose Vendor
                  </button>
                )}
              </div>
            )}
            <table className="table">
              <thead>
                <tr>
                  {checkByVendor && <th scope="col">checkbox</th>}
                  <th scope="col">Item</th>
                  <th scope="col">Description</th>
                  <th scope="col">Qty</th>
                  <th scope="col">Cost per Unit (USD)</th>
                  <th scope="col">Discounted Cost per Unit (USD)</th>
                  <th scope="col">Amount (USD)</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <>
                  {filteredOrderList.length !== 0 &&
                    filteredOrderList.map((o, index) => (
                      <tr key={index}>
                        <td>
                          {isEditing === index ? (
                            <Field
                              name="productCode"
                              value={formikProps.values.productCode || ''}
                              onChange={formikProps.handleChange}
                              type="text"
                              className={styles.regSizeInput}
                            />
                          ) : (
                            <span>{o.ProductCode?.[0]}</span>
                          )}
                        </td>
                        <td style={descriptionWidth}>
                          {isEditing === index ? (
                            <Field
                              name="productName"
                              value={formikProps.values.productName}
                              onChange={formikProps.handleChange}
                              type="text"
                              className={styles.productNameInput}
                            />
                          ) : (
                            <span>{o.ProductName?.[0]}</span>
                          )}
                        </td>
                        <td>
                          {isEditing === index ? (
                            <Field
                              name="productQuantity"
                              value={formikProps.values.productQuantity}
                              onChange={formikProps.handleChange}
                              type="number"
                              className={styles.quantityInput}
                            />
                          ) : (
                            <span>{o.Quantity?.[0]}</span>
                          )}
                        </td>
                        <td>
                          {isEditing === index &&
                          !isNaN(Number(o.Vendor_Price?.[0])) ? (
                            <Field
                              name="productPrice"
                              value={formikProps.values.productPrice}
                              onChange={formikProps.handleChange}
                              type="text"
                              className={styles.regSizeInput}
                            />
                          ) : (
                            <span>
                              {' '}
                              {isNaN(Number(o.Vendor_Price?.[0])) ? (
                                <b style={attension}>Website order item</b>
                              ) : (
                                `$${parseFloat(o.Vendor_Price?.[0]).toFixed(2)}`
                              )}{' '}
                            </span>
                          )}
                        </td>
                        <td>
                          {isNaN(Number(o.Vendor_Price?.[0])) ||
                          isNaN(Number(o.discount)) ? (
                            <b style={attension}>Website order item</b>
                          ) : (
                            `$${(o.Vendor_Price?.[0] * o.discount).toFixed(2)}`
                          )}
                        </td>
                        <td>
                          {o.Vendor_Price?.[0] && o.discount && o.Quantity?.[0]
                            ? `${(
                                o.Vendor_Price?.[0] *
                                o.discount *
                                o.Quantity?.[0]
                              ).toFixed(2)}`
                            : ''}
                        </td>
                        <td className={styles.groupedTd}>
                          <button
                            onClick={() =>
                              handleToRemove(index, rerenderOrderList)
                            }
                            type="button"
                            className="btn btn-danger"
                          >
                            Remove
                          </button>
                          {isEditing === index ? (
                            <button
                              onClick={() => handleToSave(index, formikProps)}
                              type="button"
                              className="btn btn-success"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToEdit(index, formikProps)}
                              type="button"
                              className="btn btn-secondary"
                            >
                              {isEditing === index ? 'Save' : 'Edit'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </>
                <>
                  {rerenderOrderList.length !== 0 &&
                    filteredOrderList.length === 0 &&
                    rerenderOrderList.map((o, index) => (
                      <tr key={index}>
                        {checkByVendor && (
                          <td>
                            <label>
                              {/* <Field type="checkbox"  name={`selectedItems[${index}]`}/> */}
                              <Field
                                type="checkbox"
                                name={formikProps.values.productCode}
                                checked={
                                  formikProps.values.selectedItems[index] ||
                                  false
                                }
                                onChange={({ target: { checked } }) => {
                                  const newSelectedItems = [
                                    ...formikProps.values.selectedItems,
                                  ]
                                  newSelectedItems[index] = checked
                                  formikProps.setFieldValue(
                                    `selectedItems`,
                                    newSelectedItems,
                                  )
                                  // find indexes with true value
                                  const trueIndices = newSelectedItems.reduce(
                                    (indices, value, index) => {
                                      if (value) {
                                        indices.push(index)
                                      }
                                      return indices
                                    },
                                    [],
                                  )
                                  setCheckboxFilteredIndex(trueIndices)
                                  //console.log(checkboxFilteredIndex);
                                  const choosenItems = rerenderOrderList.filter(
                                    (_, index) => trueIndices.includes(index),
                                  )
                                  //const selectedVendor = VENDOR_LIST.find((vendor) => vendor.code === 'mk')
                                  if (choosenItems.length !== 0) {
                                    const selectedVendor = VENDOR_LIST.find(
                                      (vendor) =>
                                        choosenItems[0]?.ProductCode?.[0].startsWith(
                                          vendor.code,
                                        ),
                                    )
                                    formikProps.setFieldValue(
                                      'vendorAddress',
                                      selectedVendor.address,
                                    )
                                    console.log(selectedVendor, '<< selected vendor');
                                    formikProps.setFieldValue(
                                      'shipInfoDescription',
                                      selectedVendor.shipInfoDescription,
                                    )
                                    formikProps.setFieldValue(
                                      'ship',
                                      selectedVendor.shipInfo,
                                    )
                                    formikProps.setFieldValue(
                                      'productTableData',
                                      choosenItems,
                                    )
                                    formikProps.setFieldValue(
                                      'vendorEmails',
                                      selectedVendor.email,
                                    )
                                  } else {
                                    formikProps.setFieldValue(
                                      'vendorAddress',
                                      '',
                                    )
                                    formikProps.setFieldValue(
                                      'shipInfoDescription',
                                      '',
                                    )
                                    formikProps.setFieldValue('ship', '')
                                  }
                                  if (
                                    checkNextNotStartsWithTwoSameLetters(
                                      choosenItems,
                                    ) == true
                                  ) {
                                    alert(
                                      'Vendors are not the same! Please select same vendors to set shipiing address!',
                                    )
                                    const updatedSelectedItems = Array(
                                      rerenderOrderList.length,
                                    ).fill(false)
                                    formikProps.setFieldValue(
                                      'selectedItems',
                                      updatedSelectedItems,
                                    )
                                    formikProps.setFieldValue(
                                      'vendorAddress',
                                      '',
                                    )
                                  }
                                }}
                              />
                            </label>
                          </td>
                        )}
                        <td>
                          {/* { formikProps.values.productCode = o.ProductCode?.[0]} */}
                          {isEditing === index ? (
                            <Field
                              name="productCode"
                              value={formikProps.values.productCode || ''}
                              onChange={formikProps.handleChange}
                              type="text"
                              className={styles.regSizeInput}
                            />
                          ) : (
                            <span>{o.ProductCode?.[0]}</span>
                          )}
                        </td>
                        <td style={descriptionWidth}>
                          {isEditing === index ? (
                            <Field
                              name="productName"
                              value={formikProps.values.productName}
                              onChange={formikProps.handleChange}
                              type="text"
                              className={styles.productNameInput}
                            />
                          ) : (
                            <span>{o.ProductName?.[0]}</span>
                          )}
                        </td>
                        <td>
                          {isEditing === index ? (
                            <Field
                              name="productQuantity"
                              value={formikProps.values.productQuantity}
                              onChange={formikProps.handleChange}
                              type="number"
                              className={styles.quantityInput}
                            />
                          ) : (
                            <span>{o.Quantity?.[0]}</span>
                          )}
                        </td>
                        <td>
                          {/* { typeof o.Vendor_Price?.[0]} */}
                          {isEditing === index &&
                          !isNaN(Number(o.Vendor_Price?.[0])) ? (
                            <Field
                              name="productPrice"
                              value={formikProps.values.productPrice}
                              onChange={formikProps.handleChange}
                              type="text"
                              className={styles.regSizeInput}
                            />
                          ) : (
                            <span>
                              {' '}
                              {isNaN(Number(o.Vendor_Price?.[0])) ? (
                                <b style={attension}>Website order item</b>
                              ) : (
                                `$${parseFloat(o.Vendor_Price?.[0]).toFixed(2)}`
                              )}{' '}
                            </span>
                            //  <span> { isNaN(Number(o.Vendor_Price?.[0])) || isNaN(Number(o.discount)) ? <b style={attension}>Website order item</b> : `$${(o.Vendor_Price?.[0] * o.discount).toFixed(2)}`} </span>
                          )}
                        </td>
                        <td>
                          {isNaN(Number(o.Vendor_Price?.[0])) ||
                          isNaN(Number(o.discount)) ? (
                            <b style={attension}>Website order item</b>
                          ) : (
                            `$${(o.Vendor_Price?.[0] * o.discount).toFixed(2)}`
                          )}
                          {/* {
                            isEditing === index ? (
                              <Field
                              name="productPriceWithDiscount"
                              value={formikProps.values.productPriceWithDiscount}
                              onChange={formikProps.handleChange}
                              type="text"
                              className={styles.regSizeInput}
                            />
                            ) : (
                              <span> {isNaN(Number(o.Vendor_Price?.[0])) || isNaN(Number(o.discount)) ? ( <b style={attension}>Website order item</b>) : (`$${(o.Vendor_Price?.[0] * o.discount).toFixed(2)}` )} </span>
                            )
                          } */}
                        </td>
                        <td>
                          {o.Vendor_Price?.[0] && o.discount && o.Quantity?.[0]
                            ? `${(
                                o.Vendor_Price?.[0] *
                                o.discount *
                                o.Quantity?.[0]
                              ).toFixed(2)}`
                            : ''}
                          {/* {
                            isEditing === index ? (
                              <Field
                              name="totalAmount"
                              value={formikProps.values.totalAmount}
                              onChange={formikProps.handleChange}
                              type="text"
                              className={styles.regSizeInput}
                            />
                            ) : (
                              <span>  {o.Vendor_Price?.[0] && o.discount && o.Quantity?.[0] ? `${( o.Vendor_Price?.[0] * o.discount * o.Quantity?.[0] ).toFixed(2)}` : ''} </span>
                            )
                          } */}
                        </td>
                        <td className={styles.groupedTd}>
                          <button
                            onClick={() =>
                              handleToRemove(index, rerenderOrderList)
                            }
                            type="button"
                            className="btn btn-danger"
                          >
                            Remove
                          </button>
                          {/* <button
                            onClick={() => handleToEdit(index, formikProps)}
                            type="button"
                            className="btn btn-secondary"
                          >
                            {isEditing === index ? 'Save' : 'Edit'}
                          </button> */}
                          {isEditing === index ? (
                            <button
                              onClick={() => handleToSave(index, formikProps)}
                              type="button"
                              className="btn btn-success"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToEdit(index, formikProps)}
                              type="button"
                              className="btn btn-secondary"
                            >
                              {isEditing === index ? 'Save' : 'Edit'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </>
                {/* <tr className="table-success">
                  <td colSpan="4"></td>
                  <td>Total Amount: </td>
                  <td>{}</td>
                  <td></td>
                </tr> */}
              </tbody>
            </table>
            {/* <button type="submit" className="btn btn-primary">
              New Email
            </button> */}
            <div className={styles.divGroup}>
              {checkboxFilteredIndex.length === 0 && (
                <button type="submit" className="btn btn-primary">
                  Generate PO
                </button>
              )}
              {/* appear just if products were selected from checkbox method */}
              {checkboxFilteredIndex.length !== 0 && (
                <button type="submit" className="btn btn-primary">
                  Generate PO
                </button>
              )}
              {/* <AddProductPopUp rerenderOrderList={rerenderOrderList} onFormValuesChange={handleFormValuesChange} /> */}
            </div>

            {/* <button onClick={() => {addProduct}} type="button" className="btn btn-info">Add Item</button> */}
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default OrderFreightForm
