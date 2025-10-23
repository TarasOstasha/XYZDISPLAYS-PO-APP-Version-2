import { Formik, Form, Field, ErrorMessage } from 'formik'
import { ORDER_VALIDATION_SCHEMA } from '../../utils/orderValidationSchema'
import { VENDOR_LIST } from '../../utils/vendorsData'
import {
  yellow,
  descriptionWidth,
  attension,
  fullWidth,
  vendoCodeWidth,
} from '../../stylesConstants'
import React from 'react'
import styles from './OrderFreightForm.module.scss'
import { useState, useEffect } from 'react'
import AddProductPopUp from '../AddProductPopUp'
import { saveOrder } from '../../api'
import MarkupAmount from '../MarkupAmount'

function OrderFreightForm({
  setOrderId,
  // shipCompanyName,
  // shippingAddress1,
  // shipCity,
  // shipName,
  // shipLastName,
  // shipPhoneNumber,
  // shipCountry,
  // shipState,
  // shipPostalCode,
  rerenderOrderList,
  filteredOrderList,
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
  setCustomFieldInHand1,
  setOrderComments,
  handleFormValuesChange,
  orderClientAddress,
  orderDetailsOptions,
  setShowVendorKitPopup
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
    reprint: '',
    orderNotes: '',
    vendorName: 'Choose Vendor',
    VendorCode: '',
    vendorAddress: '',
    vendorDiscount: 0,
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

  //console.log(orderDetailsOptions);
  const handleSubmit = async (values, formikBag) => {
    //console.log(VENDOR_LIST);
    
    const checkIfCustom = rerenderOrderList.some((item) => {
      return typeof item.discount === 'undefined'
    })
    if (checkIfCustom) {
      alert('Please Remove Custom Items!!!')
      return
    }

    values.shipTo = document.getElementById('shipTo').innerText
    values.vendorAddress = document.getElementById('vendorAddress').innerText
    values.ship = document.getElementById('ship').value
    values.shipInfoDescription = document.getElementById(
      'shipInfoBottom',
    ).innerText
    values.vendorEmails = renderEmails()
    values.inHand = setCustomFieldInHand

    // if (rerenderVendorName('or')) {
    //   values.orderNotes = '-20% off per Josh'
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

      //console.log('block if');
    } else {
      values.productTableData.push(...rerenderOrderList)
      // console.log(values, '<< values');
    }

    const orderData = await saveOrder(values)
    //console.log(values,'values***');
    //console.log(values.productTableData);
    //formikBag.resetForm()
    values.productTableData.splice(0, values.productTableData.length)
    console.log(values.productCode, '<< values')


  }

  //const [filteredOrderList, setFilteredOrderList] = useState([])
  const [selectedVendor, setSelectedVendorCode] = useState(false)
  const [checkByVendor, setCheckByVendor] = useState(false)
  const [checkboxFilteredIndex, setCheckboxFilteredIndex] = useState([])
  const [hideButton, setHideButton] = useState(false)
  const [isNeededDiscountNotes, setIsNeededDiscountNotes] = useState(false)
  const [shipInfo, setShipInfo] = useState()

  const toggleVendorVisibility = () => {
    setCheckByVendor(!checkByVendor)
  }

  const formattedPrice = (price) =>
    price !== undefined ? parseFloat(price).toFixed(2) : ''
  const priceWithDiscountPerUnit = (vendorPrice, discount) => {
    const discountedPrice = vendorPrice * (1 - discount / 100)
    return discountedPrice.toFixed(2)
  }
  const isNumber = (number) => isNaN(Number(number))
  const calculateRoundedPercentage = (discount) => {
    if (discount > 0) {
      return ((1 - (1 - discount / 100)) * 100).toFixed(0) + '%'
    }
    return 0 + '%'
  }
  const discountAmount = (discount) => {
    return discount === undefined ? (
      <b style={attension}>Website order item</b>
    ) : (
      // ` ${((1 - discount) * 100).toFixed(0)}% `
      calculateRoundedPercentage(discount)
    )
  }
  const calculatePrice = (price, quantity) =>
    `$${(price * quantity).toFixed(2)}`
  // const calculateDiscountedPrice = (price, discount, quantity) => `$${(price * discount * quantity).toFixed(2)}`
  const calculateDiscountedPrice = (price, discount, quantity) => {
    if (discount > 0) {
      const discountDecimal = discount / 100
      const discountedPrice = price * (1 - discountDecimal) * quantity
      return `$${discountedPrice.toFixed(2)}`
    } else {
      const discountedPrice = price * quantity
      return `$${discountedPrice.toFixed(2)}`
    }
    // const discountDecimal = discount / 100;
    // const discountedPrice = price * (1 - discountDecimal) * quantity;
    // return `$${discountedPrice.toFixed(2)}`;
  }
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
  // Function to check if all rows have "Website order item"
  // const allWebsiteOrderItems = rerenderOrderList.every(
  //   (item) => item.Vendor_Price?.[0] && isNaN(item.Vendor_Price[0])
  // );

  const handleChange = (e, i) => {
    console.log(e, i)
  }

  useEffect(() => {
    //console.log(rerenderOrderList, 'rerenderOrderList');
    const initialShipInfo = renderShipInfoInput()
    setShipInfo(initialShipInfo) // Set the initial value
  }, [rerenderOrderList])
  // render shipping info input
  // const renderShipInfoInput = () => {
  //   const pcode = rerenderOrderList[0]?.ProductCode[0].toLowerCase();
  //   return rerenderOrderList && rerenderOrderList.length > 0 &&
  //     VENDOR_LIST.find(vendor =>
  //       pcode?.startsWith(vendor.code),
  //     ) ?
  //     VENDOR_LIST.find(vendor =>
  //       pcode?.startsWith(vendor.code),
  //     ).shipInfo :
  //     'Not Found';
  // };
  const renderShipInfoInput = () => {
    const pcode = rerenderOrderList[0]?.ProductCode[0]?.toLowerCase()
    const vendor = VENDOR_LIST.find((vendor) => pcode?.startsWith(vendor.code))
    return vendor ? vendor.shipInfo : ''
  }

  // render shipping info input bottom section
  const renderShipInfoBottom = () => {
    const pcode = rerenderOrderList[0]?.ProductCode[0].toLowerCase()
    return rerenderOrderList &&
      rerenderOrderList.length > 0 &&
      VENDOR_LIST.find((vendor) => pcode?.startsWith(vendor.code))
      ? VENDOR_LIST.find((vendor) => pcode?.startsWith(vendor.code))
          .shipInfoDescription.split('\n')
          .map((line, index) => <div key={index}>{line}</div>)
      : 'Not Found'
  }
  // render vendor shipping address section
  const renderVendorAddress = () => {
    const pcode = rerenderOrderList[0]?.ProductCode[0].toLowerCase();
    console.log(pcode, '<< pcode in renderVendorAddress');
    return rerenderOrderList &&
      rerenderOrderList.length > 0 &&
      VENDOR_LIST.find((vendor) =>
        //rerenderOrderList[0]?.ProductCode[0]?.startsWith(vendor.code),
        pcode?.startsWith(vendor.code),
      )
      ? VENDOR_LIST.find((vendor) => pcode?.startsWith(vendor.code))
          .address.split('\n')
          .map((line, index) => <div key={index}>{line}</div>)
      : 'Not Found'
  }
  // rerender vendor name
  const rerenderVendorName = (vendorN) => {
    return rerenderOrderList.some((item) => {
      return item.ProductCode[0].startsWith(vendorN)
    })
  }
  // render customer address
  const renderCustomerAddress = () => {
    const {
      ShipCompanyName = [],
      ShipAddress1 = [],
      ShipAddress2 = [],
      ShipFirstName = [],
      ShipLastName = [],
      ShipCity = [],
      ShipState = [],
      ShipPostalCode = [],
      ShipCountry = [],
      ShipPhoneNumber = [],
    } = orderClientAddress || {}
    const shipCompanyName = ShipCompanyName[0] || ''
    const shipFirstName = ShipFirstName[0] || ''
    const shipLastName = ShipLastName[0] || ''
    const shipAddress1 = ShipAddress1[0] || ''
    const shipAddress2 = ShipAddress2[0] || ''
    const shipCity = ShipCity[0] || ''
    const shipState = ShipState[0] || ''
    const shipPostalCode = ShipPostalCode[0] || ''
    const shipCountry = ShipCountry[0] || ''
    const shipPhoneNumber = ShipPhoneNumber[0] || ''
    const addressLine = [shipAddress1, shipAddress2].filter(Boolean).join('<br>');
    return `
      ${shipCompanyName}<br>
      ${shipFirstName} ${shipLastName}<br>
      ${addressLine}<br>
      ${shipCity}, ${shipState}, ${shipPostalCode}<br>
      ${shipCountry}<br>
      ${shipPhoneNumber}
    `
  }

  // render sender emails
  const renderEmails = () => {
    const pcode = rerenderOrderList[0]?.ProductCode[0].toLowerCase()
    //console.log(pcode);
    return rerenderOrderList &&
      rerenderOrderList.length > 0 &&
      VENDOR_LIST.find((vendor) => pcode?.startsWith(vendor.code))
      ? VENDOR_LIST.find((vendor) => pcode?.startsWith(vendor.code)).email
      : 'Not Found'
  }

  const isPriceOutOfRange = (webPrice, priceWithDiscount) => {
    const ratio = webPrice / priceWithDiscount - 1
    //console.log(ratio);
    return ratio > 0.9 || ratio < 0.3
  }

  const grandTotalPrice = (order, switcher, discount) => {
    const grandTotal = order.reduce((acc, item) => {
      const price = switcher
        ? item.ProductPrice?.[0]
        : (item.Vendor_Price?.[0] * (100 - item.discount)) / 100
      return acc + item.Quantity?.[0] * price //ProductPrice?.[0]
    }, 0)
    return '$' + grandTotal.toFixed(2) // return the total rounded to two decimal places
  }

  return (
    <>
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={ORDER_VALIDATION_SCHEMA}
        >
          {(formikProps) => {
            // Handler to update ship info within Formik's scope
            const handleShipInfoChange = (e) => {
              console.log(e.target.value, '<< e.target.value in handleShipInfoChange');  
              setShipInfo(e.target.value) // Update the state with the new value
              formikProps.setFieldValue('ship', e.target.value) // Update Formik's field value too
              formikProps.setFieldTouched('ship', true, false); // <-- make it "touched"
            }
            return (
              <Form>
                <div className={styles.orderHead}>
                  <div className={styles.orderHeadTop}>
                    <strong>PURCHASE ORDER</strong>
                  </div>
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
                      <td className={styles.topBlockTd}>
                        <div>xyzDisplays </div>
                        <div>170 Changebridge Rd. Bldg A7 </div>
                        <div>Montville, NJ 07045</div>
                        <div>973-515-5151 </div>
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
                              formikProps.handleChange(e)
                              setOrderId(e.target.value)
                              rerenderVendorName('or')
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
                              {/* <input
                                style={{ background: 'yellow' }}
                                name="ship"
                                type="text"
                                value={renderShipInfoInput()}
                                // value={formikProps.values.ship || renderShipInfoInput()}
                                onChange={formikProps.handleChange}
                                className="form-control"
                                placeholder="Choose freight info, example Freight"
                                aria-label="ship"
                                aria-describedby="basic-addon1"
                                id='ship'
                              /> */}
                              {/* <input
                                style={{ background: 'yellow' }}
                                name="ship"
                                type="text"
                                value={shipInfo} // Controlled by state
                                onChange={handleShipInfoChange} // Update state and Formik
                                className="form-control"
                                placeholder="Choose freight info, example Freight"
                                aria-label="ship"
                                aria-describedby="basic-addon1"
                                id="ship"
                              /> */}
                              <select
                                name="ship"
                                value={shipInfo}
                                onChange={handleShipInfoChange}
                                className="form-control"
                                id="ship"
                                aria-label="ship"
                                aria-describedby="basic-addon1"
                                style={{ background: 'yellow', cursor: 'pointer' }}
                              >
                                <option value="">Select shipping method</option>
                                <option value="GROUND on B356D3">Default: GROUND on B356D3</option>
                                <option value="3-Day on B356D3">3-Day on B356D3</option>
                                <option value="2-Day on B356D3">2-Day on B356D3</option>
                                <option value="Next Day Air on B356D3">Next Day Air on B356D3</option>
                                <option value="Freight by XYZ">Freight by XYZ</option>
                              </select>
                              {formikProps.touched.ship && formikProps.errors.ship && (
                                <div className="invalid-feedback d-block">
                                  {formikProps.errors.ship}
                                </div>
                              )}
                            </div>
                            <div className={styles.regDiv} id="shipInfoBottom">
                              {renderShipInfoBottom()}
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
                                //onChange={formikProps.handleChange}
                                onChange={(e) => {
                                  formikProps.handleChange(e)
                                  setCustomFieldInHand1(e.target.value)
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
                    <tr>
                    <td colSpan="2">
                      <label style={{ marginRight: '10px' }}>Previous customer order(s) with same hardware?</label>
                      <label style={{ marginRight: '10px' }}>
                        <input
                          type="radio"
                          name="reprint"
                          value="yes"
                          checked={formikProps.values.reprint === 'yes'}
                          onChange={(e) => {
                            formikProps.setFieldValue('reprint', 'yes');
                            if (
                              !formikProps.values.orderNotes ||
                              !formikProps.values.orderNotes.startsWith('Previous customer order(s) with same hardware?')
                            ) {
                              formikProps.setFieldValue('orderNotes', 'Previous customer order(s) with same hardware');
                            }
                          }}
                        />
                        Yes
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="reprint"
                          value="no"
                          checked={formikProps.values.reprint === 'no'}
                          onChange={(e) => {
                            formikProps.setFieldValue('reprint', 'no');
                            formikProps.setFieldValue('orderNotes', '');
                          }}
                        />
                        No
                      </label>
                      {formikProps.touched.reprint && formikProps.errors.reprint && (
                          <div style={{ color: 'red' }}>{formikProps.errors.reprint}</div>
                        )}
                    </td>
                  </tr>
                    <tr>
                      {console.log(rerenderVendorName())}
                      <td colSpan="2">
                        <Field
                          style={{ background: 'yellow' }}
                          name="orderNotes"
                          type="text"
                          className={styles.orderNotes}
                          value={formikProps.values.orderNotes}
                          // value={
                          //   rerenderVendorName('or')
                          //     ? '-20% off per Josh'
                          //     : formikProps.values.orderNotes
                          // }
                          onChange={formikProps.handleChange}
                          placeholder="Order Notes FOR VENDOR"
                        />
                        {formikProps.values.reprint === 'yes' &&
                          formikProps.touched.orderNotes &&
                          formikProps.errors.orderNotes && (
                            <div style={{ color: 'red' }}>{formikProps.errors.orderNotes}</div>
                        )}
                      </td>
                    </tr>
                    {setOrderComments ? (
                      <tr>
                        <td>Order Notes FROM CUSTOMER:</td>
                        <td>
                          <strong className={styles.orderNotesBold}>
                            {setOrderComments}
                          </strong>
                        </td>
                      </tr>
                    ) : null}
                    <tr>
                      <th scope="col">Vendor</th>
                      <th scope="col">Ship To</th>
                    </tr>
                    <tr>
                      <td className={styles.myTd} id="vendorAddress">
                        {renderVendorAddress()}
                      </td>
                      <td className={styles.myTd} id="shipTo">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: renderCustomerAddress(),
                          }}
                        />
                        {/* {shipCompanyName} <br />
                        {shipName} {shipLastName} <br />
                        {shippingAddress1} <br />
                        {shipCity}, {shipState} {shipPostalCode}
                        <br />
                        {shipCountry} <br />
                        {shipPhoneNumber} */}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* I HIDE THIS BLOCK OF CODE TO REDEVELOP LATER IF NEEDED */}
                {/* {rerenderOrderList.length !== 0 && (
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
                          )
                          formikProps.setFieldValue('vendorName',event.target.value)
                          formikProps.setFieldValue('vendorAddress',selectedVendor.address)
                          formikProps.setFieldValue('vendorDiscount',selectedVendor.discount,)
                          formikProps.setFieldValue('ship',selectedVendor.shipInfo)
                          formikProps.setFieldValue('shipInfoDescription',selectedVendor.shipInfoDescription)
                          setHideButton(true)
                          const filteredOrderList = rerenderOrderList.filter(
                            (o) => {
                              const selectedVendorCode = o.ProductCode?.[0]
                                .toLowerCase()
                                .startsWith(selectedVendor.code)
                              console.log(selectedVendorCode, '>> selectedVendorCode')
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
                    <button disabled
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
                      <button disabled
                        onClick={() => toggleVendorVisibility()}
                        type="button"
                        className="btn btn-primary"
                      >
                        Choose Vendor
                      </button>
                    )}
                  </div>
                )} */}
                <div>
                  {(rerenderOrderList.length > 0 || filteredOrderList.length > 0) && (
                    <button
                      onClick={() => setShowVendorKitPopup(true)}
                      type="button"
                      className="btn btn-primary"
                    >
                      Split Products
                    </button>
                  )} 
                </div>
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
                      <th scope="col">
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
                      <th scope="col">Note*</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* <tr>
                      <td colSpan="10">{isNeededDiscountNotes === true ? (<b className={styles.warning}>ORBUS ITEM, PLEASE DO NOT FORGET SET DISCOUNT!</b>) : ('')}</td>
                    </tr> */}
                    {/* EDITING TABLE */}
                    <>
                      {filteredOrderList.length !== 0 &&
                        filteredOrderList.map((o, index) => (
                          <React.Fragment>
                            <tr key={index}>
                              <td>
                                {isEditing === index || isEditingTop === true ? (
                                  <Field
                                    name={`productCode[${index}]`}
                                    value={
                                      formikProps.values.productCode[index] || ''
                                    }
                                    onChange={formikProps.handleChange}
                                    type="text"
                                    className={styles.regSizeInput}
                                  />
                                ) : (
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
                                    onChange={formikProps.handleChange}
                                    type="text"
                                    className={styles.regSizeInput}
                                  />
                                ) : (
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
                                    type="text"
                                    className={styles.productNameInput}
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
                                    handleToRemove(index, filteredOrderList)
                                  }
                                  type="button"
                                  className="btn btn-danger"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>Total Web</td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>Total Vendor</td>
                              <td></td>
                              <td></td>
                            </tr>
                          </React.Fragment>
                        ))}
                    </>
                    {/* MAIN TABLE */}
                    <>
                      {/* { console.log(rerenderOrderList, 'rerenderOrderList') } */}
                      {rerenderOrderList.length !== 0 &&
                        filteredOrderList.length === 0 &&
                        rerenderOrderList.map((o, index) => (
                          <React.Fragment key={index}>
                            <tr>
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
                                        const choosenItems = rerenderOrderList.filter(
                                          (_, index) =>
                                            trueIndices.includes(index),
                                        )
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
                                    <span>{o.ProductCode?.[0]}</span>
                                  </>
                                )}
                              </td>
                              <td style={vendoCodeWidth}>
                                {isEditing === index || isEditingTop === true ? (
                                  <Field
                                    name={`vendorCode[${index}]`}
                                    value={
                                      formikProps.values.vendorCode[index] || ''
                                    }
                                    fdgdfg
                                    onChange={formikProps.handleChange}
                                    onClick={(e) =>
                                      handleChangeInput(e, index, formikProps)
                                    }
                                    type="text"
                                    className={styles.regSizeInput}
                                  />
                                ) : (
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
                                {/* WEBSITE PRICE */}$
                                {formattedPrice(o.ProductPrice?.[0])}
                                {/* {console.log(JSON.stringify(o), '<< o.ProductPrice?.[0]')} */}
                                {/* {calculatePrice(
                                  o.ProductPrice?.[0],
                                  o.Quantity?.[0],
                                )} */}
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
                                    {
                                      isNumber(o.Vendor_Price?.[0])
                                        ? (() => {
                                            ;<b style={attension}>
                                              Website order item
                                            </b>
                                          })()
                                        : formattedPrice(o.Vendor_Price?.[0])
                                      // : calculatePrice(
                                      //     o.Vendor_Price?.[0],
                                      //     o.Quantity?.[0],
                                      //   )
                                    }{' '}
                                  </span>
                                )}
                              </td>
                              <td>
                                {/* DISCOUNT */}
                                {o.ProductCode[0].toLowerCase().startsWith('or')
                                  ? setIsNeededDiscountNotes(true)
                                  : setIsNeededDiscountNotes(false)}
                                {isEditingTop === true ? (
                                  <Field
                                    name={`productDiscount[${index}]`}
                                    value={
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
                              </td>
                              <td>
                                {/* VENDOR PRICE WITH DISCOUNT */}
                                {isNumber(o.Vendor_Price?.[0]) ||
                                isNumber(o.discount) ? (
                                  <b style={attension}>Website order item</b>
                                ) : (
                                  priceWithDiscountPerUnit(
                                    o.Vendor_Price?.[0],
                                    o.discount,
                                  )
                                  // calculateDiscountedPrice(
                                  //   o.Vendor_Price?.[0],
                                  //   o.discount,
                                  //   o.Quantity?.[0],
                                  // )
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
                              </td>
                              {isPriceOutOfRange(
                                formattedPrice(o.ProductPrice?.[0]),
                                priceWithDiscountPerUnit(
                                  o.Vendor_Price?.[0],
                                  o.discount,
                                ),
                              ) && (
                                <td>
                                  <span className={styles.rangeText}>
                                    {formattedPrice(o.ProductPrice?.[0]) /
                                      priceWithDiscountPerUnit(
                                        o.Vendor_Price?.[0],
                                        o.discount,
                                      ) <
                                      0.9 &&
                                    formattedPrice(o.ProductPrice?.[0]) /
                                      priceWithDiscountPerUnit(
                                        o.Vendor_Price?.[0],
                                        o.discount,
                                      ) >
                                      0.3
                                      ? 'Price in Range'
                                      : 'Price is Out of Range'}
                                  </span>
                                  <MarkupAmount />
                                </td>
                              )}
                            </tr>
                          </React.Fragment>
                        ))}
                      <tr>
                        <td colSpan="4"></td>
                        <td>Total Web</td>
                        <td colSpan="3"></td>
                        <td>Total Vendor</td>
                        <td colSpan="2"></td>
                      </tr>
                      <tr>
                        <td colSpan="4"></td>
                        <td>{grandTotalPrice(rerenderOrderList, true)}</td>
                        <td colSpan="3"></td>
                        <td>{grandTotalPrice(rerenderOrderList, false)}</td>
                        <td colSpan="2"></td>
                      </tr>
                    </>
                  </tbody>
                </table>
                <AddProductPopUp
                  rerenderOrderList={rerenderOrderList}
                  onFormValuesChange={handleFormValuesChange}
                  isEditingTop={isEditingTop}
                />
                {rerenderOrderList.length !== 0 &&
                  filteredOrderList.length === 0 && (
                    <div className={styles.divGroup}>
                      {checkboxFilteredIndex.length === 0 && (
                        <>
                          <button type="submit" className="btn btn-primary">
                            Generate PO
                          </button>
                          <span>
                            {isNeededDiscountNotes === true ? (
                              <b style={{ color: 'red' }}>
                                ORBUS ITEM, PLEASE DO NOT FORGET SET DISCOUNT!
                              </b>
                            ) : (
                              ''
                            )}
                          </span>
                        </>
                      )}
                      {/* appear just if products were selected from checkbox method */}
                      {/* {checkboxFilteredIndex.length !== 0 && (
                        <button type="submit" className="btn btn-primary">
                          Generate PO
                        </button>
                      )} */}
                    </div>
                  )}
                {filteredOrderList.length > 0 && (
                  <div className={styles.divGroup}>
                    {/* {checkboxFilteredIndex.length === 0 && (
                      <button type="submit" className="btn btn-primary">
                        Generate PO
                      </button>
                    )} */}
                    {/* appear just if products were selected from checkbox method */}
                    {/* {checkboxFilteredIndex.length !== 0 && (
                      <button type="submit" className="btn btn-primary">
                        Generate PO
                      </button>
                    )} */}
                  </div>
                )}
              </Form>
            )
          }}
        </Formik>
      </div>
    </>
    
  )
}

export default OrderFreightForm
