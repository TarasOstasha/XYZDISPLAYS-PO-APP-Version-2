import { Formik, Form, Field, ErrorMessage } from 'formik'
import { ORDER_VALIDATION_SCHEMA } from '../../../utils/orderValidationSchema'
import { VENDOR_LIST } from '../../../utils/vendorsData'
import {
  yellow,
  descriptionWidth,
  attension,
  fullWidth,
} from '../../../stylesConstants'

import styles from './OrderFreightForm.module.scss'
import { useState, useEffect } from 'react'
import AddProductPopUp from '../../AddProductPopUp'
import { saveOrder } from '../../../api'

function OrderFreightForm({
  setOrderId,
  shipCompanyName,
  shippingAddress1,
  shipCity,
  shipName,
  shipLastName,
  shipPhoneNumber,
  shipCountry,
  shipState,
  shipPostalCode,
  rerenderOrderList,
  handleToRemove,
  handleToEdit,
  handleToEditTop,
  isEditing,
  isEditingTop,
  handleToSave,
  handleToSaveTop,
  handleChangeInput,
  setVendorAddress,
  setShipInfoDescription,
  setCustomFieldInHand,
  setOrderComments
}) {
  // Inside your component

  const initialValues = {
    po: '',
    date: new Date().toISOString().split('T')[0],
    ship: '',
    shipInfoDescription: '',
    inHand: '', //new Date(),
    vendor: '',
    // gender: GENDERS[0],
    shipTo: '',
    orderNotes: '',
    vendorName: 'Choose Vendor',
    VendorCode: '',
    vendorAddress: '',
    vendorDiscount: 0,
    //productCode: '',
    productCode: [],
    vendorCode: [],
    productName: [],
    productQuantity: '',
    webPrice: '', // product price from xyz website
    vendorPrice: '', // vendor price
    productPrice: '',
    productDiscount: '',
    productPriceWithDiscount: '',
    totalAmount: '',
    isChecked: false,
    selectedItems: Array(rerenderOrderList.length).fill(false),
    productTableData: [],
    vendorEmails: [],
  }

  const handleSubmit = async (values, formikBag) => {
    console.log('values :>> ', values)

    values.shipTo = document.getElementById('shipTo').innerText;
    values.vendorAddress = document.getElementById('vendorAddress').innerText;
    values.ship = document.getElementById('ship').value;
    values.shipInfoDescription = document.getElementById('shipInfoBottom').innerText;
    //values.orderNotes = document.getElementById('orderNotes').innerText;
    values.vendorEmails = renderEmails();
    values.inHand = setCustomFieldInHand;
    // console.log(setOrderComments, '<< setOrderComments')

    //console.log(orderData, '<< orderData');
    // rerenderOrderList.map((p) => {
    //   values.productTableData.push(p.ProductCode?.[0])
    //   values.productTableData.push(p.ProductName?.[0])
    //   values.productTableData.push(p.Quantity?.[0])
    //   values.productTableData.push(p.Vendor_Price?.[0])
    //   values.productTableData.push(p.discount?.[0])
    // })
    // if(rerenderOrderList.length > 1) {
    //   values.productTableData.push(rerenderOrderList)
    // }
    if (rerenderOrderList.length === 1) {
      const updatedValues = rerenderOrderList.reduce((acc, p) => {
        return {
          ...acc,
          productCode: [...acc.productCode, p.ProductCode?.[0]],
          vendorCode: [...acc.vendorCode, p.Vendor_PartNo[0]],
          productName: [...acc.productName, p.ProductName?.[0]],
          productQuantity: [...acc.productQuantity, p.Quantity?.[0]],
          vendorPrice: [...acc.vendorPrice, p.Vendor_Price?.[0]],
          vendorDiscount: [...acc.vendorDiscount, p.discount?.[0]],
        }
      })
      values.productTableData.push(updatedValues)
      console.log(updatedValues);
      console.log('block if');
    } else {
      // const {
      //   productCode,
      //   productName,
      //   productPrice,
      //   vendorPrice,
      //   productQuantity,
      //   vendorCode,
      //   totalAmount,
      // } = values
      // //console.log(productPrice, '<< productPrice')
      // const updatedValues = {
      //   ProductCode: productCode,
      //   Vendor_PartNo: vendorCode,
      //   ProductName: productName,
      //   Quantity: productQuantity,
      //   Vendor_Price: vendorPrice,
      //   ProductPrice: productPrice,
      //   TotalPrice: totalAmount,
      // }
      // //console.log(productCode, '<< productCode');
      // values.productTableData.push(updatedValues)
      values.productTableData.push(...rerenderOrderList)
    }

    const orderData = await saveOrder(values)
    console.log(orderData);
    //console.log(values.productTableData);
    //formikBag.resetForm()
    values.productTableData.splice(0,values.productTableData.length)
  }

  //let filteredOrderList = []
  const [filteredOrderList, setFilteredOrderList] = useState([])
  const [selectedVendor, setSelectedVendorCode] = useState(false)
  const [checkByVendor, setCheckByVendor] = useState(false)
  const [checkboxFilteredIndex, setCheckboxFilteredIndex] = useState([])
  const [hideButton, setHideButton] = useState(false)
  const [isNeededDiscountNotes, setIsNeededDiscountNotes] = useState(false)

  const toggleVendorVisibility = () => {
    setCheckByVendor(!checkByVendor)
    //console.log(checkByVendor)
  }

  // const roundCurrency = (amount) =>  `$${parseFloat(amount).toFixed(2)}`
  // const discountPrice = (price, discount) => `$${(price * discount).toFixed(2)}`

  const isNumber = (number) => isNaN(Number(number))
  const discountAmount = (discount) => {
    return discount === undefined ? (
      <b style={attension}>Website order item</b>
    ) : (
      ` ${((1 - discount) * 100).toFixed(0)}% `
    )
  }
  const calculatePrice = (price, quantity) => `$${(price * quantity).toFixed(2)}`
  const calculateDiscountedPrice = (price, quantity, discount) => `$${(price * discount * quantity).toFixed(2)}`
  //const checkIfVendorIsEqual = () => rerenderOrderList.every(item => item.ProductCode[0].startsWith(item.ProductCode[0].slice(0,2)))
  const checkIfProductCodeStartsWithSameCharacters = (orders, characters) => {
    //console.log(orders.every(order => order.ProductCode[0].startsWith(characters)));
    return orders.every((order) => order.ProductCode[0].startsWith(characters))
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

  const handleChange = (e, i) => {
    console.log(e, i)
  }

  // render shipping info input
  const renderShipInfoInput = () => {
    const pcode = rerenderOrderList[0]?.ProductCode[0].toLowerCase();
    return rerenderOrderList && rerenderOrderList.length > 0 &&
      VENDOR_LIST.find(vendor =>
        pcode?.startsWith(vendor.code),
      ) ? 
      VENDOR_LIST.find(vendor =>
        pcode?.startsWith(vendor.code),
      ).shipInfo : 
      'Not Found';
  };
  // render shipping info input bottom section
  const renderShipInfoBottom = () => {
    const pcode = rerenderOrderList[0]?.ProductCode[0].toLowerCase();
    return rerenderOrderList && rerenderOrderList.length > 0 &&
      VENDOR_LIST.find(vendor =>
        pcode?.startsWith(vendor.code),
      ) ? 
      VENDOR_LIST.find(vendor =>
        pcode?.startsWith(vendor.code),
      ).shipInfoDescription.split('\n').map((line, index) => (
        <div key={index}>{line}</div>
      )) : 
      'Not Found';
  };
  // render vendor shipping address section
  const renderVendorAddress = () => {
    const pcode = rerenderOrderList[0]?.ProductCode[0].toLowerCase();
    return rerenderOrderList && rerenderOrderList.length > 0 &&
      VENDOR_LIST.find(vendor =>
        //rerenderOrderList[0]?.ProductCode[0]?.startsWith(vendor.code),
        pcode?.startsWith(vendor.code)
      ) ? 
      VENDOR_LIST.find(vendor =>
        pcode?.startsWith(vendor.code),
      ).address.split('\n').map((line, index) => (
        <div key={index}>{line}</div>
      )) : 
      'Not Found';
  };
  // render sender emails
  const renderEmails = () => {
    const pcode = rerenderOrderList[0]?.ProductCode[0].toLowerCase();
    console.log(pcode);
    return rerenderOrderList && rerenderOrderList.length > 0 &&
      VENDOR_LIST.find(vendor =>
        pcode?.startsWith(vendor.code),
      ) ? 
      VENDOR_LIST.find(vendor =>
        pcode?.startsWith(vendor.code),
      ).email : 
      'Not Found';
  };
  

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={ORDER_VALIDATION_SCHEMA}
      >
        {(formikProps) => {
          return (
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
                              value={formikProps.values.ship || renderShipInfoInput()}
                              onChange={formikProps.handleChange}
                              className="form-control"
                              placeholder="Choose freight info, example Freight"
                              aria-label="ship"
                              aria-describedby="basic-addon1"
                              id='ship'
                            />
                          </div>
                          <div className={styles.regDiv} id="shipInfoBottom">
                            {/* <span>
                              {formikProps.values.shipInfoDescription && (
                                <div>
                                  {formikProps.values.shipInfoDescription
                                    .split('\n')
                                    .map((line, index) => (
                                      <div key={index}>{line}</div>
                                    ))}
                                </div>
                              )}
                            </span> */}
                            {
                              // rerenderOrderList &&
                              //   rerenderOrderList.length == 1 &&
                              //   // Find the vendor whose code matches the start of the ProductCode
                              //   (VENDOR_LIST.find((vendor) =>
                              //     rerenderOrderList[0]?.ProductCode[0]?.startsWith(
                              //       vendor.code,
                              //     ),
                              //   )
                              //     ? // If a vendor is found, return its name, otherwise return a placeholder
                              //       VENDOR_LIST.find((vendor) =>
                              //         rerenderOrderList[0]?.ProductCode[0]?.startsWith(
                              //           vendor.code,
                              //         ),
                              //       )
                              //         .shipInfoDescription.split('\n')
                              //         .map((line, index) => (
                              //           <div key={index}>{line}</div>
                              //         ))
                              //     : 'Not Found')
                              renderShipInfoBottom()
                            }
                          </div>
                          <div className="input-group mb-3">
                            <span className="input-group-text inHand">
                              In Hand Date:
                            </span>
                            <input
                              style={yellow}
                              name="inHand"
                              type="string" 
                              //value={formikProps.values.inHand}
                              value={setCustomFieldInHand}
                              onChange={formikProps.handleChange}
                              className="form-control"
                              // placeholder="Choose in hand date"
                              aria-label="inHand"
                              aria-describedby="basic-addon1"
                            />
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                  <tr>
                    {/* <td colSpan="2">
                      <label className={styles.orderNotes}>Order Notes: 
                      <input className={styles.orderNotes} name="orderNotes" 
                      type="text" 
                      value={formikProps.values.orderNotes = setOrderComments }
                      onChange={formikProps.handleChange}
                      />
                      </label>
                    </td> */}
                    <td colSpan='2'>
                      <Field
                        name="orderNotes"
                        type="text"
                        className={styles.orderNotes}
                        // value={formikProps.values.orderNotes}
                        value={formikProps.values.orderNotes}
                        onChange={formikProps.handleChange}
                        placeholder="Order Notes FOR VENDOR"
                      />
                    </td>

                    {/* <td>  */}
                      {/* Order Notes: <strong className={styles.orderNotesBold}>{setOrderComments}</strong> */}
                      {/* Order Notes:{' '}
                      <b id='orderNotes'>
                        {rerenderOrderList[0]?.OrderNotes?.[0]
                          ? rerenderOrderList[0]?.OrderNotes?.[0]
                          : 'No order notes'}
                      </b> */}
                    {/* </td> */}
                  </tr>
                  {setOrderComments ? (
                    <tr>
                        <td>Order Notes FROM CUSTOMER:</td>
                        <td><strong className={styles.orderNotesBold}>{setOrderComments}</strong></td>
                    </tr>
                  ) : null}
                  <tr>
                    <th scope="col">Vendor</th>
                    <th scope="col">Ship To</th>
                  </tr>
                  <tr>
                    <td className={styles.myTd} id="vendorAddress">
                      {
                        renderVendorAddress()
                        // Ensure rerenderOrderList exists and has at least one item
                        // rerenderOrderList &&
                        //   rerenderOrderList.length == 1 &&
                        //   // Find the vendor whose code matches the start of the ProductCode
                        //   (VENDOR_LIST.find((vendor) =>
                        //     rerenderOrderList[0]?.ProductCode[0]?.startsWith(
                        //       vendor.code,
                        //     ),
                        //   )
                        //     ? // If a vendor is found, return its name, otherwise return a placeholder
                        //       VENDOR_LIST.find((vendor) =>
                        //         rerenderOrderList[0]?.ProductCode[0]?.startsWith(
                        //           vendor.code,
                        //         ),
                        //       )
                        //         .address.split('\n')
                        //         .map((line, index) => (
                        //           <div key={index}>{line}</div>
                        //         ))
                        //     : 'Vendor Not Found')
                      }
                    </td>
                    {/* {checkIfProductCodeStartsWithSameCharacters(
                      rerenderOrderList,
                      rerenderOrderList[0]?.ProductCode[0].slice(0, 2),
                    ) &&
                      (() => {
                        const selectedVendor = VENDOR_LIST.find(
                          (vendor) =>
                            vendor.code ==
                            rerenderOrderList[0]?.ProductCode[0]
                              .toLowerCase()
                              .slice(0, 2),
                        )
                        {formikProps.values.vendorEmails = selectedVendor.email}
                        setVendorAddress(
                          checkIfProductCodeStartsWithSameCharacters(
                            rerenderOrderList,
                            rerenderOrderList[0]?.ProductCode[0].slice(0, 2),
                          ),
                        )
                        //console.log(selectedVendor, '<< selectedVendor');
                        if (selectedVendor !== undefined) {
                          setShipInfoDescription(selectedVendor.shipInfo)
                          formikProps.values.shipInfoDescription =
                            selectedVendor.shipInfoDescription
                          formikProps.values.ship = selectedVendor.shipInfo
                          // formikProps.setFieldValue('shipInfoDescription', selectedVendor.shipInfoDescription)
                          // formikProps.setFieldValue('shipInfo', selectedVendor.shipInfo)
                        } else {
                          formikProps.values.shipInfoDescription = 'Not Found'
                          formikProps.values.ship = 'Not Found'
                        }
                        return (
                          <td className={styles.myTd} id="vendorAddress">
                            {selectedVendor
                              ? selectedVendor.address
                                  .split('\n')
                                  .map((line, index) => (
                                    <div key={index}>{line}</div>
                                  ))
                              : 'Address not found'}
                          </td>
                        )
                      })()}
                    {!checkIfProductCodeStartsWithSameCharacters(
                      rerenderOrderList,
                      rerenderOrderList[0]?.ProductCode[0].slice(0, 2),
                    ) && (
                      <td className={styles.myTd} id="vendorAddress">
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
                    )} */}
                    {/* <td className={styles.myTd}>
                    {formikProps.values.vendorAddress && (
                      <div>
                        {formikProps.values.vendorAddress
                          .split('\n')
                          .map((line, index) => (
                            <div key={index}>{line}</div>
                          ))}
                      </div>
                    )}
                  </td> */}
                    <td className={styles.myTd} id="shipTo">
                      {shipCompanyName} <br />
                      {shipName} {shipLastName} <br />
                      {shippingAddress1} <br />
                      {shipCity}, {shipState} {shipPostalCode}
                      <br />
                      {shipCountry} <br />
                      {shipPhoneNumber}
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
                        formikProps.setFieldValue(
                          'ship',
                          selectedVendor.shipInfo,
                        )
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
                      setFilteredOrderList(rerenderOrderList)
                      setHideButton(false)
                      formikProps.setFieldValue(
                        'shipInfoDescription',
                        'Not Found',
                      )
                      formikProps.setFieldValue('shipInfo', 'Not Found')
                      formikProps.setFieldValue(
                        'vendorAddress',
                        'Address not found',
                      )
                      //console.log(formikProps.values.vendorName)
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
                    <th scope="col">Vendor Code</th>
                    <th scope="col">Description</th>
                    <th scope="col">Qty</th>
                    <th scope="col">Web Price</th>
                    <th scope="col">Vendor Cost</th>
                    <th scope="col">Discount %</th> 
                    <th scope="col">Discounted Vendor Cost</th>
                    <th scope="col">Total Cost</th>
                    {/* <th scope="col">Cost per Unit (USD)</th>
                  <th scope="col">Discounted Cost per Unit (USD)</th>
                  <th scope="col">Amount (USD)</th> */}
                    <th scope="col">
                      {/* <button style={fullWidth} type='button' className="btn btn-warning" onClick={() => handleToSaveTop(formikProps)}>EDIT</button> */}
                      {/* {console.log(isEditing)} */}
                      {isEditingTop === true ? (
                        <button
                          style={fullWidth}
                          onClick={() => handleToSaveTop(formikProps)}
                          type="button"
                          className="btn btn-warning"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          style={fullWidth}
                          onClick={() => handleToEditTop(formikProps)}
                          type="button"
                          className="btn btn-secondary"
                        >
                          {isEditingTop === true ? 'Save' : 'Edit'}
                        </button>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="10">{isNeededDiscountNotes === true ? (<b className={styles.warning}>ORBUS ITEM, PLEASE DO NOT FORGET SET DISCOUNT!</b>) : ('')}</td>
                  </tr>
                  <>
                    {filteredOrderList.length !== 0 &&
                      filteredOrderList.map((o, index) => (
                        <tr key={index}>
                          <td>
                            {isEditing === index || isEditingTop === true ? (
                              <Field
                                name={`productCode[${index}]`}
                                value={
                                  formikProps.values.productCode[index] || ''
                                }
                                onChange={formikProps.handleChange}
                                // onClick={(e) => handleChangeInput(e, index, formikProps)}
                                type="text"
                                className={styles.regSizeInput}
                              />
                            ) : (
                              // <span>{o.ProductCode?.[0]}</span>
                              <span>{o.ProductCode?.[0]}</span>
                            )}
                          </td>
                          <td>
                            {isEditing === index || isEditingTop === true ? (
                              <Field
                                name={`vendorCode[${index}]`}
                                value={
                                  formikProps.values.vendorCode[index] || ''
                                }
                                // value='Fetch Vendor Code Here'
                                onChange={formikProps.handleChange}
                                // onClick={(e) => handleChangeInput(e, index, formikProps)}
                                type="text"
                                className={styles.regSizeInput}
                              />
                            ) : (
                              // <span>Fetch Vendor Code Here</span>
                              // <span>{o.Vendor_PartNo?.[0]}</span>
                              <span>{o.Vendor_PartNo?.[0]}</span>
                            )}
                          </td>
                          <td style={descriptionWidth}>
                            {isEditing === index || isEditingTop === true ? (
                              <Field
                                name={`productName[${index}]`}
                                value={
                                  formikProps.values.productName[index] || ''
                                }
                                onChange={formikProps.handleChange}
                                // onClick={(e) => handleChangeInput(e, index, formikProps)}
                                type="text"
                                className={styles.productNameInput}
                              />
                            ) : (
                              // <span>{o.ProductName?.[0]}</span>
                              <span>{o.ProductName?.[0]}</span>
                            )}
                          </td>
                          <td>
                            {isEditing === index || isEditingTop === true ? (
                              <Field
                                name={`productQuantity[${index}]`}
                                value={
                                  formikProps.values.productQuantity[index] ||
                                  ''
                                }
                                onChange={formikProps.handleChange}
                                onClick={(e) =>
                                  handleChangeInput(e, index, formikProps)
                                }
                                type="number"
                                className={styles.quantityInput}
                              />
                            ) : (
                              <span>{o.Quantity?.[0]}</span>
                            )}
                          </td>
                          <td>
                            {/* WEBSITE PRICE */}
                            {calculatePrice(
                              o.ProductPrice?.[0],
                              o.Quantity?.[0],
                            )}
                          </td>
                          <td>
                            {/* VENDOR COST */}
                            {(isEditing === index &&
                              !isNumber(o.Vendor_Price?.[0])) ||
                            isEditingTop === true ? (
                              <Field
                                name={`vendorPrice[${index}]`}
                                value={
                                  formikProps.values.vendorPrice[index] || ''
                                }
                                onChange={formikProps.handleChange}
                                // onClick={(e) => handleChangeInput(e, index, formikProps)}
                                type="text"
                                className={styles.regSizeInput}
                                id={`vendorPrice[${index}]`}
                              />
                            ) : (
                              <span>
                                {isNumber(o.Vendor_Price?.[0]) ? (
                                  <b style={attension}>Website order item</b>
                                ) : (
                                  (() => {
                                    return calculatePrice(
                                      o.Vendor_Price?.[0],
                                      o.Quantity?.[0],
                                    )
                                  })()
                                )}
                              </span>
                            )}
                          </td>
                          <td>
                            {/* {isNaN(Number(o.Vendor_Price?.[0])) ||
                          isNaN(Number(o.discount))  ? (
                            <b style={attension}>Website order item</b>
                          ) : (
                            `$${(o.Vendor_Price?.[0] * o.discount).toFixed(2)}`
                          )} */}
                            {/* DISCOUNT */}
                            {isEditingTop === true ? (
                              <Field
                                name={`productDiscount[${index}]`}
                                value={
                                  formikProps.values.productDiscount[index] ||
                                  ''
                                }
                                onChange={formikProps.handleChange}
                                // onClick={(e) => handleChangeInput(e, index, formikProps)}
                                type="text"
                                className={styles.regSizeInput}
                                id={`productDiscount[${index}]`}
                              />
                            ) : (
                              discountAmount(o.discount)
                            )}
                          </td>
                          <td>
                            {/* {o.Vendor_Price?.[0] && o.discount && o.Quantity?.[0]
                            ? `${(
                                o.Vendor_Price?.[0] *
                                o.discount *
                                o.Quantity?.[0]
                              ).toFixed(2)}`
                            : ''} */}
                            {/* VENDOR PRICE WITH DISCOUNT */}
                            {isNumber(o.Vendor_Price?.[0]) ||
                            isNumber(o.discount) ? (
                              <b style={attension}>Website order item</b>
                            ) : (
                              calculateDiscountedPrice(
                                o.Vendor_Price?.[0],
                                o.discount,
                                o.Quantity?.[0],
                              )
                            )}
                          </td>
                          <td>
                            {o.Vendor_Price?.[0] &&
                            o.discount &&
                            o.Quantity?.[0]
                              ? calculateDiscountedPrice(
                                  o.Vendor_Price?.[0],
                                  o.discount,
                                  o.Quantity?.[0],
                                )
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
                            {isEditing === index || isEditingTop === true ? (
                              <Field
                                name={`productCode[${index}]`}
                                value={
                                  formikProps.values.productCode[index] || ''
                                }
                                onChange={formikProps.handleChange}
                                onClick={(e) => {
                                  handleChangeInput(e, index, formikProps)
                                }}
                                type="text"
                                className={styles.regSizeInput}
                                id={`productCode[${index}]`}
                              />
                            ) : (
                              <>
                                {/* {formikProps.values.productCode = o.ProductCode?.[0]} */}
                                <span>{o.ProductCode?.[0]}</span>
                              </>
                            )}
                          </td>
                          <td>
                            {isEditing === index || isEditingTop === true ? (
                              <Field
                                name={`vendorCode[${index}]`}
                                value={
                                  formikProps.values.vendorCode[index] || ''
                                }
                                // value={formikProps.values.vendorCode[index] || ''}
                                // value={o?.Vendor_PartNo}
                                onChange={formikProps.handleChange}
                                onClick={(e) =>
                                  handleChangeInput(e, index, formikProps)
                                }
                                type="text"
                                className={styles.regSizeInput}
                              />
                            ) : (
                              // <span>Fetch Vendor Code Here</span>
                              // <span>{o.Vendor_PartNo?.[0]}</span>
                              <span>{o.Vendor_PartNo?.[0]}</span>
                            )}
                          </td>
                          <td style={descriptionWidth}>
                            {isEditing === index || isEditingTop === true ? (
                              <Field
                                name={`productName[${index}]`}
                                // name="productName"
                                value={
                                  formikProps.values.productName[index] || ''
                                }
                                // value={formikProps.values.productName}
                                onChange={formikProps.handleChange}
                                onClick={(e) =>
                                  handleChangeInput(e, index, formikProps)
                                }
                                type="text"
                                className={styles.productNameInput}
                                id={`productName[${index}]`}
                              />
                            ) : (
                              <span>{o.ProductName?.[0]}</span>
                            )}
                          </td>
                          <td>
                            {isEditing === index || isEditingTop === true ? (
                              <Field
                                name={`productQuantity[${index}]`}
                                value={
                                  formikProps.values.productQuantity[index] ||
                                  ''
                                }
                                onChange={formikProps.handleChange}
                                onClick={(e) =>
                                  handleChangeInput(e, index, formikProps)
                                }
                                type="number"
                                className={styles.quantityInput}
                                id={`productQuantity[${index}]`}
                              />
                            ) : (
                              <span>{o.Quantity?.[0]}</span>
                            )}
                          </td>
                          <td>
                            {/* WEBSITE PRICE */}
                            {calculatePrice(
                              o.ProductPrice?.[0],
                              o.Quantity?.[0],
                            )}
                          </td>
                          <td>
                            {/* VENDOR COST */}
                            {(isEditing === index &&
                              !isNumber(o.Vendor_Price?.[0])) ||
                            isEditingTop === true ? (
                              <Field
                                name={`vendorPrice[${index}]`}
                                value={
                                  formikProps.values.vendorPrice[index] || ''
                                }
                                onChange={formikProps.handleChange}
                                onClick={(e) =>
                                  handleChangeInput(e, index, formikProps)
                                }
                                type="text"
                                className={styles.regSizeInput}
                                id={`vendorPrice[${index}]`}
                              />
                            ) : (
                              <span>
                                {isNumber(o.Vendor_Price?.[0])
                                  ? (() => {
                                      ;<b style={attension}>
                                        Website order item
                                      </b>
                                    })()
                                  : calculatePrice(
                                      o.Vendor_Price?.[0],
                                      o.Quantity?.[0],
                                    )}{' '}
                              </span>
                              //  <span> { isNaN(Number(o.Vendor_Price?.[0])) || isNaN(Number(o.discount)) ? <b style={attension}>Website order item</b> : `$${(o.Vendor_Price?.[0] * o.discount).toFixed(2)}`} </span>
                            )}
                          </td>
                          <td>
                            {/* DISCOUNT */}
                            {o.ProductCode[0].toLowerCase().startsWith('or') ? setIsNeededDiscountNotes(true) : setIsNeededDiscountNotes(false)}
                        
                            {isEditingTop === true ? (
                              <Field
                                name={`productDiscount[${index}]`}
                                value={
                                  //  formikProps.values.productDiscount[index] ||
                                  formikProps.values.productDiscount[index] ||
                                  ''
                                }
                                onChange={formikProps.handleChange}
                                onClick={(e) =>
                                  handleChangeInput(e, index, formikProps)
                                }
                                type="text"
                                className={styles.regSizeInput}
                                id={`productDiscount[${index}]`}
                              />
                            ) : (
                              discountAmount(o.discount)
                            )}
                            {/* { discountAmount(o.discount) } */}
                          </td>
                          <td>
                            {/* VENDOR PRICE WITH DISCOUNT */}
                            {isNumber(o.Vendor_Price?.[0]) ||
                            isNumber(o.discount) ? (
                              <b style={attension}>Website order item</b>
                            ) : (
                              calculateDiscountedPrice(
                                o.Vendor_Price?.[0],
                                o.discount,
                                o.Quantity?.[0],
                              )
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
                            {o.Vendor_Price?.[0] &&
                            o.discount &&
                            o.Quantity?.[0]
                              ? calculateDiscountedPrice(
                                  o.Vendor_Price?.[0],
                                  o.discount,
                                  o.Quantity?.[0],
                                )
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
                            {/* {isEditing === index ? (
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
                          )} */}
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

              {rerenderOrderList.length !== 0 &&
                filteredOrderList.length === 0 && (
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
                )}
              {filteredOrderList.length > 0 && (
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
                </div>
              )}

              {/* <button onClick={() => {addProduct}} type="button" className="btn btn-info">Add Item</button> */}
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default OrderFreightForm
