import axios from 'axios';

// import { Formik, Form, Field, ErrorMessage } from 'formik'
import styles from './OrderFreight.module.scss'
// import * as API from '../../api'
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { ORDER_VALIDATION_SCHEMA } from '../../utils/orderValidationSchema'
import { useEffect, useState } from 'react'

import { VENDOR_LIST } from '../../utils/vendorsData'
// import { yellow, descriptionWidth, attension } from '../../stylesConstants'
import OrderFreightForm from '../OrderFreightForm'
import AddProductPopUp from '../AddProductPopUp';
import MismatchedPricesModal from './MismatchedPricesModal';

function OrderFreight() {
  let discountRenderFlag = false;
  const [mismatchedPrices, setMismatchedPrices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);

  const [orderId, setOrderId] = useState('')

  // *** order Detail ***
  const [rerenderOrderList, setRerenderOrderList] = useState([]) // rerender when inserting discount value to our object
  const [filteredOrderList, setFilteredOrderList] = useState([])

  // *** order ship to ***
  const [orderClientAddress, setOrderClientAddress] = useState(null)

  const [removeOnclick, setRremoveOnclick] = useState(0)
  const [isEditing, setIsEditing] = useState(null)
  const [isEditingTop, setIsEditingTop] = useState(false)
  const [inputIndex, setInputIndex] = useState(0)
  const [vendorAddress, setVendorAddress] = useState('')
  const [shipInfo, setShipInfoDescription] = useState()

  const [customFieldInHand, setCustomFieldInHand] = useState()
  const [orderComments,setOrderComments] = useState()
  const [vendor, setVendor] = useState([])
  const [orderProductDetails, setOrderProductDetails] = useState(null);


  const handleToRemove = (index, array) => {
    console.log(index,array);
    if (index >= 0 && index < array.length) {
      setRremoveOnclick(array.splice(index, 1))
      //console.log(array);
    }
    console.log(array, index, '<< array');
  }

  const handleToEdit = (index, formikProps) => {
    setIsEditing(index === isEditing ? null : index)
    if (rerenderOrderList[index].hasOwnProperty('Vendor_Price')) {
      formikProps.values.productPrice = rerenderOrderList[index].Vendor_Price[0]
    }
    formikProps.values.productCode = rerenderOrderList[index].ProductCode[0]
    formikProps.values.productName = rerenderOrderList[index].ProductName[0]
    formikProps.values.productQuantity = rerenderOrderList[index].Quantity[0]
  }
  // const handleToEdit = (index, formikProps) => {
  //   setIsEditing(index === isEditing ? null : index);
  //   const orderItem = rerenderOrderList[index];
  //   if (orderItem?.Vendor_Price?.[0]) {
  //     formikProps.setFieldValue('productPrice', orderItem.Vendor_Price[0]);
  //   }
  //   formikProps.setFieldValue('productCode', orderItem.ProductCode?.[0] || '');
  //   formikProps.setFieldValue('productName', orderItem.ProductName?.[0] || '');
  //   formikProps.setFieldValue('productQuantity', orderItem.Quantity?.[0] || '');
  // };

  const handleChangeInput = (e, i, formikProps) => {
    setInputIndex(i)
    console.log(i)
  }

  // const handleToEditTop = (formikProps) => {
  //   setIsEditingTop(true)
  //   const productCodes = rerenderOrderList.map((p) => p.ProductCode?.[0])
  //   const vendorCodes = rerenderOrderList.map(p => p.Vendor_PartNo?.[0])
  //   const productNames = rerenderOrderList.map((p) => p.ProductName?.[0])
  //   const quantities = rerenderOrderList.map((p) => p.Quantity?.[0])
  //   const vendorPrices = rerenderOrderList.map((p) => p.Vendor_Price?.[0])
  //   const discounts = rerenderOrderList.map((p) => p.discount?.[0])
  //   const productPrices = rerenderOrderList.map((p) => p.ProductPrice?.[0])
  //   formikProps.setValues({
  //     ...formikProps.values,
  //     productCode: productCodes,
  //     vendorCode: vendorCodes,
  //     productName: productNames,
  //     productQuantity: quantities,
  //     vendorPrice: vendorPrices,
  //     productPrice: productPrices,
  //     productDiscount: discounts,
  //   })
  // }
  // refactor handleToEditTop
  const handleToEditTop = (formikProps) => {
    setIsEditingTop(true);
    const mapProperty = (property) => rerenderOrderList.map((p) => p[property]?.[0] || '');
    const valuesToUpdate = {
        productCode: mapProperty('ProductCode'),
        vendorCode: mapProperty('Vendor_PartNo'),
        productName: mapProperty('ProductName'),
        productQuantity: mapProperty('Quantity'),
        vendorPrice: mapProperty('Vendor_Price'),
        productPrice: mapProperty('ProductPrice'),
        productDiscount: mapProperty('discount'),
    }; 
    formikProps.setValues({
        ...formikProps.values,
        ...valuesToUpdate,
    });
};


  const handleFormValuesChange = (newValues) => {
    
    const newProduct = [newValues]
    setRerenderOrderList((rerenderOrderList) => [
      ...rerenderOrderList,
      ...newProduct,
    ])
  }

  const handleToSave = (index, formikProps) => {
    if (rerenderOrderList[index].hasOwnProperty('Vendor_Price')) {
      rerenderOrderList[index].ProductCode[0] = formikProps.values.productCode
      rerenderOrderList[index].Vendor_PartNo[0] = formikProps.values.vendorCode
      rerenderOrderList[index].ProductName[0] = formikProps.values.productName
      rerenderOrderList[index].Quantity[0] = formikProps.values.productQuantity
      rerenderOrderList[index].Vendor_Price[0] = formikProps.values.vendorPrice
      rerenderOrderList[index].ProductPrice[0] = formikProps.values.productPrice
      rerenderOrderList[index].TotalPrice[0] = formikProps.values.totalAmount
      setIsEditing(null)

    } else {
      alert(
        `Vendor Price is missing! or ${rerenderOrderList[index].ProductCode[0]} is Website order item`,
      )
      rerenderOrderList[index].ProductCode[0] = formikProps.values.productCode
      rerenderOrderList[index].ProductName[0] = formikProps.values.productName
      setIsEditing(null)
      return
    }
  }
  const handleToSaveTop = (formikProps) => {
    setIsEditingTop(false)
    // HERE WE SHOULD WHICH ITEMS HAVE hasOwnProperty('Vendor_Price') AND USE KIST THESE
    let foundMissingVendorPrice = false
    rerenderOrderList.forEach((item, index) => {
      if (!item || !item.hasOwnProperty('Vendor_Price')) {
        if (!foundMissingVendorPrice) {
          alert(
            'Vendor_Price is missing for an item!\n Please remove Website order Items from PO!',
          )
          foundMissingVendorPrice = true
        }
        return
      } else {
        if (!Array.isArray(item.ProductCode)) item.ProductCode = []
        if (!Array.isArray(item.ProductName)) item.ProductName = []
        if (!Array.isArray(item.Quantity)) item.Quantity = []
        if (!Array.isArray(item.discount)) item.discount = []

        item.ProductCode[0] = formikProps.values.productCode[index]
        item.Vendor_PartNo[0] = formikProps.values.vendorCode[index]
        item.ProductName[0] = formikProps.values.productName[index]
        item.Quantity[0] = formikProps.values.productQuantity[index]
        item.Vendor_Price[0] = formikProps?.values.vendorPrice[index]
        item.ProductPrice[0] = formikProps.values.productPrice[index]
        item.discount[0] = formikProps?.values.productDiscount[index]
      }
    })
  }

  const handleVendorAddressChange = (address) => {
    setVendorAddress(address)
  }
  const handleVendorShipInfoDescription = (vendor) => {
    setShipInfoDescription(vendor)
  }




  useEffect(() => {}, [removeOnclick])
  useEffect(() => {
    if (orderId.length < 5) {
      return;
    }
    
    const orderUrl = `http://localhost:5000/api/orders/${orderId}`;
    // const orderUrl = `https://xyzdisplays-po-app.onrender.com/api/orders/${orderId}`;
    
    // axios
    //   .get(orderUrl)
    //   .then((orderResponse) => {
    //     //console.log(orderResponse, '<< orderResponse');
    //     const {
    //       xmldata: { Orders },
    //     } = orderResponse.data;
    //     //console.log(Orders[0], '<< Orders');
    //     setOrderClientAddress(Orders[0])
    //     //console.log(Orders[0].ShipAddress1[0],) //Orders[0].ShipCity[0], Orders[0].ShipCompanyName[0], Orders[0].ShipState[0], Orders[0].ShipPostalCode[0], Orders[0].ShipFirstName[0], Orders[0].ShipLastName[0], Orders[0].ShipPhoneNumber[0]);
    //     //console.log(orderClientAddress);
    //     // Extracting Product Codes from Order Details
    //     const productCodes = Orders[0].OrderDetails.map((item) => item.ProductCode[0]);
    //     //console.log(productCodes, '<< productCodes');
    //     // Generating URLs for product requests
    //     const productUrls = productCodes.map((code) => `http://localhost:5000/api/products/${code}`);
    //     // const productUrls = productCodes.map((code) => `https://xyzdisplays-po-app.onrender.com/api/products/${code}`);

    //     //console.log(productUrls);
    //     // Fetching product data for all product codes in parallel
    //     Promise.all(productUrls.map((url) => axios.get(url)))
    //       .then((productResponses) => {
    //         //console.log(productResponses, '<< productResponses');
    //         // Extracting Vendor_PartNo and ProductCode from product responses
    //         const vendors = productResponses.map((response) => {
    //           //console.log(response);
    //           const { xmldata: { Products } } = response.data;
    //           //console.log(Products, '>> Products');

              
    //           //console.log(Products[0].EAN[0]);
    //           if(Products && Products[0] && Products[0].EAN && Products[0].EAN[0]) {
    //             const kits = Products[0].EAN[0].split(',');
    //             const productUrls = kits.map((code) => `http://localhost:5000/api/products/${code}`);
    //             //console.log(productUrls, '<< productUrls');
    //             Promise.all(productUrls.map((url) => axios.get(url)))
    //               .then((productResponses) => {
    //                 const vendors = productResponses.map((response) => {
    //                   const { xmldata: { Products } } = response.data;
    //                   console.log(Products);
    //                   return Products && Products.length > 0
    //                   ? {
    //                       Vendor_PartNo: [Products[0].Vendor_PartNo[0]],
    //                       ProductCode: [Products[0].ProductCode[0]],
    //                       ProductName: [Products[0].ProductName[0]],
    //                       ProductPrice: [Products[0].ProductPrice[0]],
    //                       Vendor_Price: [Products[0].Vendor_Price[0]],
    //                       Quantity: [1]
    //                     }
    //                   : null;
    //                 });

    //                 const validVendors = vendors.filter((vendor) => vendor !== null);
    //                 setVendor((prevVendor) => {
    //                   const updatedVendor = [...prevVendor, ...validVendors];
    //                   return updatedVendor;
    //                 });
    //                 setRerenderOrderList(vendors);
    //                 console.log(updatedOrderListWithVendorCodes);
    //                 // add discount
    //                 vendors.map((order, index) => {
    //                   VENDOR_LIST.map((vendor, index) => {
    //                     const code = order.ProductCode.toString();
    //                     if (code.toLowerCase().startsWith(vendor.code)) {
    //                       order.discount = [vendor.discount]
    //                       discountRenderFlag = true
    //                     }
    //                   })
    //                 })
    //                 console.log(rerenderOrderList);

    //               })
    //               .catch(err => console.log(err));

    //           }


    //           return Products && Products.length > 0
    //             ? {
    //                 Vendor_PartNo: [Products[0].Vendor_PartNo[0]],
    //                 ProductCode: [Products[0].ProductCode[0]],
    //               }
    //             : null;
    //         });
    //         //console.log(vendors, '<< vendors');
    //         // Filtering out null values from vendors
    //         const validVendors = vendors.filter((vendor) => vendor !== null);
    //         //console.log(validVendors, '>> validVendors');
    //         // Update the vendor state with valid vendor data
    //         setVendor((prevVendor) => {
    //           const updatedVendor = [...prevVendor, ...validVendors];
    //           return updatedVendor;
    //         });
    //         //console.log(vendor,'>> vendor');
    //         // Update order details with vendor codes
    //         const updatedOrderListWithVendorCodes = Orders[0].OrderDetails.map((order, index) => {
    //           //console.log(order.ProductCode[0], '<< order');
    //           const matchingVendor = validVendors.find((vendor) => vendor.ProductCode[0].toLowerCase() === order.ProductCode[0].toLowerCase());
    //           return matchingVendor ? { ...order, ...matchingVendor } : order;
    //         });
    //         //console.log(updatedOrderListWithVendorCodes, '<< updatedOrderListWithVendorCodes');
    //         setRerenderOrderList(updatedOrderListWithVendorCodes);
    //         // add discount
    //         updatedOrderListWithVendorCodes.map((order, index) => {
    //           VENDOR_LIST.map((vendor, index) => {
    //             const code = order.ProductCode.toString();
    //             if (code.toLowerCase().startsWith(vendor.code)) {
    //               order.discount = [vendor.discount]
    //               discountRenderFlag = true
    //             }
    //           })
    //         })
    //         // Set the updated order list state
    //         //setRerenderOrderList(updatedOrderListWithVendorCodes);
    //         //console.log(Orders[0], '>> Orders[0]');
    //         // Process further if needed
    //         // const shippingAddress1 = Orders[0].ShipAddress1[0];
    //         // const shipCity = Orders[0].ShipCity[0];
    //         // const shipCompanyName = Orders[0]?.ShipCompanyName[0];
    //         // const shipState = Orders[0].ShipState[0];
    //         // const shipCountry = Orders[0].ShipCountry[0]
    //         // const shipPostalCode = Orders[0].ShipPostalCode[0];
    //         // const shipName = Orders[0].ShipFirstName[0];
    //         // const shipLastName = Orders[0].ShipLastName[0];
    //         // const shipPhoneNumber = Orders[0].ShipPhoneNumber[0];
    //         const customFieldInHandDate = Orders[0].Custom_Field_InHand[0];
    //         const orderComments = Orders[0].Order_Comments[0];
    //         // console.log(shippingAddress1);
    //         // setShipCompanyName(shipCompanyName)
    //         // setShippingAddress1(shippingAddress1)
    //         // setShipCity(shipCity)
    //         // setShipState(shipState)
    //         // setShipCountry(shipCountry)
    //         // setShipPostalCode(shipPostalCode)
    //         // setShipName(shipName)
    //         // setShipLastName(shipLastName)
    //         // setShipPhoneNumber(shipPhoneNumber)
    //         setCustomFieldInHand(customFieldInHandDate)
    //         setOrderComments(orderComments)
    //       })
    //       .catch((productError) => {
    //         console.error('Error fetching product data:', productError);
    //       });
    //   })
    //   .catch((orderError) => {
    //     console.error('Error fetching order data:', orderError);
    //   });
    // const fetchOrderData = async (orderUrl) => {
    //   try {
    //     const orderResponse = await axios.get(orderUrl);
    //     const { xmldata: { Orders } } = orderResponse.data;
    //     console.log(Orders[0], '<< Orders');
        
    //     if (Orders && Orders[0]) {
    //       setOrderClientAddress(Orders[0]);
    //       const productCodes = Orders[0].OrderDetails.map((item) => item.ProductCode[0]);
    //       const productDetails = await Orders[0].OrderDetails.map(item => {
    //         return {
    //           productCode: item.ProductCode[0] || 'UnknownCode',
    //           productPrice: item.ProductPrice[0] || 'UnknownPrice'
    //         }
    //       });
    //       //console.log(productDetails, '<< productDetails');
    //       const productUrls = productCodes.map((code) => `http://localhost:5000/api/products/${code}`);
    //       const productResponses = await fetchProductData(productUrls);
    //       const validVendors = processProductResponses(productResponses, productDetails);
    //       updateVendorState(validVendors);
    //       updateOrderListWithVendorCodes(Orders[0].OrderDetails, validVendors);
    //       console.log(productResponses, '<< productResponses');
    //       processOrderDetails(Orders[0]);
    //       setOrderProductDetails(productDetails);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching order data:', error);
    //     //alert('Not Found');
    //   }
    // };
    
    
    const fetchOrderData = async (orderUrl) => {
      try {
        const orderResponse = await axios.get(orderUrl);
        const { xmldata: { Orders } } = orderResponse.data;
        //console.log(Orders, '<< Orders');
        if (Orders && Orders[0] && Orders[0].OrderDetails.length > 0) {
          setOrderClientAddress(Orders[0]);
          const productCodes = Orders[0].OrderDetails?.map((item) => item.ProductCode?.[0]) || [];
          //console.log(Orders, '<< Orders');
          const productDetails = Orders[0].OrderDetails?.map(item => {
            //console.log(item, '<< order details map');
            const optionIDs = item.OrderDetails_Options?.map((option) => option.OptionID?.[0]) || [];
            return {
              productCode: item.ProductCode?.[0] || 'UnknownCode',
              productPrice: item.ProductPrice?.[0] || 'UnknownPrice',
              optionIDs
            }
          }) || [];

          //console.log(orderOptions, "<< Extracted OrderDetails_Options");
          console.log(productDetails, '<< productDetails');
          const productUrls = productCodes.map((code) => `http://localhost:5000/api/products/${code}`);
          const productResponses = await fetchProductData(productUrls);
          const validVendors = processProductResponses(productResponses, productDetails);
          updateVendorState(validVendors);
          updateOrderListWithVendorCodes(Orders[0].OrderDetails, validVendors);
          processOrderDetails(Orders[0]);
          setOrderProductDetails(productDetails);
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
        //alert('Not Found');
      }
    };
    
    
    const fetchProductData = async (productUrls) => {
      try {
        return await Promise.all(productUrls.map((url) => axios.get(url)));
      } catch (error) {
        console.error('Error fetching product data:', error);
        return [];
      }
    };
    
    let quantityItemObject = [];
    // const processProductResponses = (productResponses) => {
    //   const vendors = productResponses.map((response) => {
    //     const { xmldata: { Products } } = response.data;
    //     console.log(Products, '<< Products');
    //     if (Products && Products[0] && Products[0].EAN && Products[0].EAN[0]) {
    //       const kits = Products[0].EAN[0].split(',');
    //       if(kits[kits.length - 1] === 'extra') {
    //         alert('Please fill out manually!!!')
    //       }
    //       const parsedKits = kits.map(item => {
    //         const match = item.match(/^(\D+\d+)(?:x(\d+))?$/);
    //         return match ? match[1] : item;
    //       });

    //       quantityItemObject = kits.reduce((acc, item) => {
    //         const match = item.match(/^(\D+\d+)(?:x(\d+))?$/);
    //         if (match) {
    //           const key = match[1];
    //           const quantity = match[2] ? parseInt(match[2], 10) : 1;
    //           acc[key] = quantity;
    //         }
    //         return acc;
    //       }, {});

    //       const kitUrls = parsedKits.map((code) => `http://localhost:5000/api/products/${code}`);
    //       fetchKitData(kitUrls);
    //     }

    //     return Products && Products.length > 0
    //       ? {
    //           Vendor_PartNo: [Products[0].Vendor_PartNo[0]],
    //           ProductCode: [Products[0].ProductCode[0]],
    //           ProductName: [Products[0].ProductName[0]],
    //           ProductPrice: [Products[0].ProductPrice[0]],
    //           Vendor_Price: [Products[0].Vendor_Price[0]],
    //           //Quantity: [1] // filled this in fetchKitData
    //         }
    //       : null;
    //   });
    
    //   return vendors.filter((vendor) => vendor !== null);
    // };


    const compareProductPrices = (products, orderProductDetails) => {
      const productPriceMap = {};
      //console.log(products, '<< products');
      // Create a lookup map for product prices based on ProductCode
      products.forEach(product => {
        const productCode = product.ProductCode[0];
        const productPrice = product.ProductPrice[0];
        productPriceMap[productCode] = productPrice;
      });
    
      // Compare the prices
      const mismatchedPrices = orderProductDetails.filter(orderProduct => {
        const productCode = orderProduct.productCode;
        const orderProductPrice = orderProduct.productPrice;
        const productPrice = productPriceMap[productCode];
        
        return productPrice && productPrice !== orderProductPrice;
      });
    
      return mismatchedPrices;
    };

    // const processProductResponses = (productResponses, orderProductDetails) => {
    //   console.log(productResponses, '<< productResponses');

    //   const vendors = productResponses.map((response) => {
    //     console.log(response, '<< response');
    //     const { xmldata: { Products } } = response.data;

    //     //console.log(orderProductDetails, '<< orderProductDetails');
    //     const mismatchedPrices = compareProductPrices(Products, orderProductDetails);
    //     //console.log(mismatchedPrices, '<< mismatchedPrices');
    //     if (mismatchedPrices.length > 0) {
    //       mismatchedPrices.forEach(item => {
    //         // alert(`Mismatched Prices: Possible added option! Double check manually! ProductCode: ${item.productCode}`);
    //         setMismatchedPrices(mismatchedPrices);
    //         setShowModal(true);
    //       });
    //     } else {
    //       console.log('All product prices match.');
    //     }
    
    //     if (Products && Products.length > 0) {
    //       const product = Products[0];
    //       let vendorPartNo = product.Vendor_PartNo[0];
   
    //       // Check if ProductCode starts with 'or', 'OR', 'Or', or 'oR'
    //       const productCode = product.ProductCode[0];
    //       if (/^or$/i.test(productCode.substring(0, 2))) {
    //         vendorPartNo = product.Google_Age_Group[0];
    //       }
    
    //       return {
    //         Vendor_PartNo: [vendorPartNo],
    //         ProductCode: [productCode],
    //         ProductName: [product.ProductName[0]],
    //         ProductPrice: [product.ProductPrice[0]],
    //         Vendor_Price: [product.Vendor_Price[0]],
    //         // Quantity: [1] // filled this in fetchKitData
    //       };
    //     }
    //     return null;
    //   });
    
    //   return vendors.filter((vendor) => vendor !== null);
    // };
    const processProductResponses = (productResponses, orderProductDetails) => {
      //console.log(productResponses, '<< productResponses');
    
      const vendors = productResponses.map((response) => {
        //console.log(response, '<< response');
    
        // Handle cases where xmldata might be undefined or an empty string
        const xmldata = response.data.xmldata || {};
        const Products = xmldata.Products || [];
    
        if (!Products.length) {
          console.log('No Products found in response');
          return null;
        }
    
        // Compare product prices
        const mismatchedPrices = compareProductPrices(Products, orderProductDetails);
        if (mismatchedPrices.length > 0) {
          mismatchedPrices.forEach(item => {
            setMismatchedPrices(mismatchedPrices);
            setShowModal(true);
          });
        } else {
          console.log('All product prices match.');
        }
    
        // Process the product details
        const product = Products[0];
        let vendorPartNo = product.Vendor_PartNo ? product.Vendor_PartNo[0] : '';
        // Check if ProductCode starts with 'or', 'OR', 'Or', or 'oR'
        const productCode = product.ProductCode ? product.ProductCode[0] : '';
        if (/^or$/i.test(productCode.substring(0, 2))) {
          vendorPartNo = product.Google_Age_Group ? product.Google_Age_Group[0] : vendorPartNo;
        }
        return {
          Vendor_PartNo: [vendorPartNo],
          ProductCode: [productCode],
          ProductName: [product.ProductName ? product.ProductName[0] : ''],
          ProductPrice: [product.ProductPrice ? product.ProductPrice[0] : ''],
          Vendor_Price: [product.Vendor_Price ? product.Vendor_Price[0] : ''],
        };
      });
    
      return vendors.filter((vendor) => vendor !== null);
    };
    
    const replaceQuantities = (products, replacements) => {
      products.forEach(product => {
        const code = product.ProductCode[0];
        if (replacements.hasOwnProperty(code)) {
          product.Quantity = [replacements[code]];
        }
      });
    }
    const fetchKitData = async (kitUrls) => {
      try {
        const kitResponses = await Promise.all(kitUrls.map((url) => axios.get(url)));
        const kitVendors = processProductResponses(kitResponses);
        replaceQuantities(kitVendors, quantityItemObject); // update quantity
        updateVendorState(kitVendors);
        applyDiscounts(kitVendors)
      } catch (error) {
        console.error('Error fetching kit data:', error);
      }
    };
    
    const updateVendorState = (validVendors) => {
      setVendor((prevVendor) => [...prevVendor, ...validVendors]);
      setRerenderOrderList(validVendors);
    };
    
    const updateOrderListWithVendorCodes = (orderDetails, validVendors) => {
      const updatedOrderListWithVendorCodes = orderDetails.map((order) => {
        const matchingVendor = validVendors.find((vendor) => vendor.ProductCode[0].toLowerCase() === order.ProductCode[0].toLowerCase());
        return matchingVendor ? { ...order, ...matchingVendor } : order;
      });

      setRerenderOrderList(updatedOrderListWithVendorCodes);
      applyDiscounts(updatedOrderListWithVendorCodes);
    };
    
    const applyDiscounts = (orderList) => {
      orderList.forEach((order) => {
        VENDOR_LIST.forEach((vendor) => {
          const code = order.ProductCode.toString();
          if (code.toLowerCase().startsWith(vendor.code)) {
            order.discount = [vendor.discount];
            discountRenderFlag = true;
          }
        });
      });
    };
    
    const processOrderDetails = (order) => {

      //const customFieldInHandDate = order.Custom_Field_InHand[0];
      //const orderComments = order.Order_Comments[0];
      const customFieldInHandDate = order.Custom_Field_InHand && order.Custom_Field_InHand[0] ? order.Custom_Field_InHand[0] : "Not Found";
      const orderComments = order.Order_Comments && order.Order_Comments[0] ? order.Order_Comments[0] : "Not Found";
      setCustomFieldInHand(customFieldInHandDate);
      setOrderComments(orderComments);
    };
    
    // Call the function with your order URL
    fetchOrderData(orderUrl);

  }, [orderId, discountRenderFlag]);
      // Log updated orderClientAddress
      useEffect(() => {
        console.log(orderClientAddress);
    }, [orderClientAddress]);
  return (
    <div className={styles.orderWrapper}>
      <OrderFreightForm
        handleToRemove={handleToRemove}
        handleToEdit={handleToEdit}
        handleToEditTop={handleToEditTop}
        isEditing={isEditing}
        isEditingTop={isEditingTop}
        handleToSave={handleToSave}
        handleToSaveTop={handleToSaveTop}
        setOrderId={setOrderId}
        rerenderOrderList={rerenderOrderList}
        filteredOrderList={filteredOrderList}
        handleChangeInput={handleChangeInput}
        setVendorAddress={handleVendorAddressChange}
        setShipInfoDescription={handleVendorShipInfoDescription}
        setCustomFieldInHand={customFieldInHand}
        setCustomFieldInHand1={setCustomFieldInHand}
        setOrderComments={orderComments}
        handleFormValuesChange={handleFormValuesChange}
        orderClientAddress={orderClientAddress}
      />
   
      <Modal show={showModal} onHide={handleClose} dialogClassName={`${styles.modalBottom} ${styles.modalWarning}`}>
        <Modal.Header closeButton className={styles.modalHeader}> 
          <Modal.Title className={styles.modalTitle}>Mismatched Prices</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          {mismatchedPrices.length > 0 ? (
            mismatchedPrices.map((item, index) => (
              <p key={index}>
                Possible added option! Double check manually! <br /> ProductCode: {item.productCode}
              </p>
            ))
          ) : (
            <p>All product prices match.</p>
          )}
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default OrderFreight
