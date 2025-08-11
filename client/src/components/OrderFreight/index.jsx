import axios from 'axios'

// import { Formik, Form, Field, ErrorMessage } from 'formik'
import styles from './OrderFreight.module.scss'
// import * as API from '../../api'
import { Button, Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
// import { ORDER_VALIDATION_SCHEMA } from '../../utils/orderValidationSchema'
import { useEffect, useState } from 'react'

import { VENDOR_LIST } from '../../utils/vendorsData'
import { ALERTS } from '../../utils/alerts'
// import { yellow, descriptionWidth, attension } from '../../stylesConstants'
import OrderFreightForm from '../OrderFreightForm'
import AddProductPopUp from '../AddProductPopUp'
import MismatchedPricesModal from './MismatchedPricesModal'
import { OPTION_DATA } from '../../utils/optionsData'
import ProductSplitPopup from '../SplitProductPopup/SplitProductPopup'

function OrderFreight() {
  const API_BASE_URL =
    window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'http://server:5000'

  let discountRenderFlag = false
  const [mismatchedPrices, setMismatchedPrices] = useState([])
  const [showModal, setShowModal] = useState(false)
  const handleClose = () => setShowModal(false)

  const [orderId, setOrderId] = useState('')

  // Vendor Kits Popup
  const [showVendorKitPopup, setShowVendorKitPopup] = useState(false)

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
  const [orderComments, setOrderComments] = useState()
  const [vendor, setVendor] = useState([])
  const [orderProductDetails, setOrderProductDetails] = useState(null)
  const [vendorKitsLenght, setVendorKitsLenght] = useState(0)
  const [vendorKitItem, setVendorKitItem] = useState([])
  const [optionProducts, setoptionProducts] = useState()
  const [userCustomProducts, setUserCustomProducts] = useState([])
  const [productOptionsArr, setProductOptionsArr] = useState([])
  const [itemQuantityMap, setItemQuantityMap] = useState()
  const [updatedOptionsArr, setUpdatedOptionsArr] = useState()

  const handleToRemove = (index, array) => {
    console.log(index, array)
    if (index >= 0 && index < array.length) {
      setRremoveOnclick(array.splice(index, 1))
    }
    console.log(array, index, '<< array')
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

  const handleChangeInput = (e, i, formikProps) => {
    setInputIndex(i)
    console.log(i)
  }

  const handleToEditTop = (formikProps) => {
    setIsEditingTop(true)
    
    //console.log(isEditingTop, 'isEditingTop handleToEditTop');
    const mapProperty = (property) =>
      rerenderOrderList.map((p) => p[property]?.[0] || '')
    const valuesToUpdate = {
      productCode: mapProperty('ProductCode'),
      vendorCode: mapProperty('Vendor_PartNo'),
      productName: mapProperty('ProductName'),
      productQuantity: mapProperty('Quantity'),
      vendorPrice: mapProperty('Vendor_Price'),
      productPrice: mapProperty('ProductPrice'),
      productDiscount: mapProperty('discount'),
    }
    formikProps.setValues({
      ...formikProps.values,
      ...valuesToUpdate,
    })
  }

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

  // old working version
  // const handleToSaveTop = (formikProps) => {
  //   console.log(formikProps.values, '***formikProps handleToSaveTop***')
  //   setIsEditingTop(false)
  //   //console.log(isEditingTop, 'isEditingTop handleToSaveTop' );
  //   // HERE WE SHOULD WHICH ITEMS HAVE hasOwnProperty('Vendor_Price') AND USE KITS THESE
  //   let foundMissingVendorPrice = false
  //   rerenderOrderList.forEach((item, index) => {
  //     console.log(item, '***item handleToSaveTop***');
  //     if (!item) {
  //       console.warn(`Skipping item at index ${index} because it is undefined or null.`);
  //       return;
  //     }
  //     item.ProductCode[0] = formikProps.values.productCode[index] || item.ProductCode[0]; // add product vendor
  //     if (!item.hasOwnProperty('Vendor_PartNo')) {
  //       item.Vendor_PartNo = ['']; 
  //     }
  //     item.Vendor_PartNo[0] = formikProps.values.vendorCode[index] || item.Vendor_PartNo[0];
  //     console.log(item, '***item***')
  //     if (!item || !item.hasOwnProperty('Vendor_Price')) {
  //       item.Vendor_Price = ['0']
  //       item.discount = [0]
  //       item.Vendor_Price[0] = formikProps?.values.vendorPrice[index]
  //       item.discount[0] = formikProps?.values.productDiscount[index]
  //       console.log(formikProps?.values, 'formikProps?.values')
        
  //       // if (!foundMissingVendorPrice) {
  //       //   alert(
  //       //     'Vendor_Price is missing for an item!\n Please remove Website order Items from PO!',
  //       //   )
  //       //   foundMissingVendorPrice = true
  //       //}
  //       return
  //     } else {
  //       if (!Array.isArray(item.ProductCode)) item.ProductCode = []
  //       if (!Array.isArray(item.ProductName)) item.ProductName = []
  //       if (!Array.isArray(item.Quantity)) item.Quantity = []
  //       if (!Array.isArray(item.discount)) item.discount = []
  //       if (!Array.isArray(item.Vendor_Price)) item.Vendor_Price = []
  //       if (!Array.isArray(item.Vendor_PartNo)) item.Vendor_PartNo = []
        
  //       item.ProductCode[0] = formikProps.values.productCode[index]
  //       item.Vendor_PartNo[0] = formikProps.values.vendorCode[index]
  //       item.ProductName[0] = formikProps.values.productName[index]
  //       item.Quantity[0] = formikProps.values.productQuantity[index]
  //       item.Vendor_Price[0] = formikProps?.values.vendorPrice[index] || item.Vendor_Price[0]
  //       item.ProductPrice[0] = formikProps.values.productPrice[index]
  //       item.discount[0] = formikProps?.values.productDiscount[index] || item.discount[0]
  //     }
  //   })
  // }
 // updated on 2025-08-07
  const handleToSaveTop = (formikProps) => {
    const {
      productCode,
      vendorCode,
      vendorPrice,
      productDiscount,
      productName,
      productQuantity,
    } = formikProps.values;
  
    const updated = rerenderOrderList.map((orig, i) => {
      // clone the object
      const item = { ...orig };
      // normalize all array-fields
      ['ProductCode','ProductName','Quantity','discount','Vendor_Price','Vendor_PartNo']
        .forEach(key => {
          if (!Array.isArray(item[key])) item[key] = item[key] != null ? [item[key]] : [''];
        });
  
      // write back the formik value (or leave the existing)
      item.ProductCode[0] = productCode[i] ?? item.ProductCode[0];
      item.Vendor_PartNo[0] = vendorCode[i] ?? item.Vendor_PartNo[0];
      item.Vendor_Price[0] = vendorPrice[i] ?? item.Vendor_Price[0] ?? '0';
      item.discount[0] = productDiscount[i] ?? item.discount[0] ?? 0;
      item.ProductName[0] = productName[i] ?? item.ProductName[0];
      item.Quantity[0] = productQuantity[i] ?? item.Quantity[0];
  
      // optional: warn if vendor price was truly missing
      if (item.Vendor_Price[0] === '0' && !orig.hasOwnProperty('Vendor_Price')) {
        console.warn(`Item ${i} missing vendor price`);
      }
  
      return item;
    });
  
    setRerenderOrderList(updated);
    setIsEditingTop(false);
  };
  
  const handleVendorAddressChange = (address) => {
    console.log(address, 'handleVendorAddressChange');
    setVendorAddress(address)
  }

  const handleVendorShipInfoDescription = (vendor) => {
    setShipInfoDescription(vendor)
  }
  useEffect(() => {
    console.log(updatedOptionsArr, 'updatedOptionsArr AFTER state update')
  }, [updatedOptionsArr])
  useEffect(() => {}, [removeOnclick])
  useEffect(() => {
    if (orderId.length < 5) {
      return
    }

    const orderUrl = `${API_BASE_URL}/api/orders/${orderId}`

    const fetchOrderData = async (orderUrl) => {
      try {
        const orderResponse = await axios.get(orderUrl)
        const {
          xmldata: { Orders },
        } = orderResponse.data
        console.log(Orders[0], '***Orders[0]***')
        //console.log(rerenderOrderList, '***rerenderOrderList***');
        if (Orders && Orders[0] && Orders?.[0]?.OrderDetails?.length > 0) {
          setOrderClientAddress(Orders[0])

          const productCodes =
            Orders[0].OrderDetails?.map((item) => item.ProductCode?.[0]) || []
          //console.log(productCodes, '*** product codes ***');

          const productDetails =
            Orders[0].OrderDetails?.flatMap((item) => {
              // Base product
              const baseProduct = {
                productCode: item.ProductCode?.[0] || 'UnknownCode',
                productPrice: item.ProductPrice?.[0] || 'UnknownPrice',
                productName: item.ProductName?.[0] || 'UnknownProductName',
                Quantity: item.Quantity?.[0] || '0',
              }
              return baseProduct
            }) || []
          //console.log(productDetails,'productDetails');
          const productOption =
            Orders[0].OrderDetails?.flatMap((item) => {
              const optionIDs =
                item.OrderDetails_Options?.map(
                  (option) => option.OptionID?.[0],
                ) || []
              console.log(optionIDs, '***optionIDs***') //-----------------------------------------------
              const extraProducts = optionIDs
                .map((id) => {
                  const matchingOption = OPTION_DATA.find(
                    (option) => option.id === parseInt(id, 10),
                  )
                  console.log(matchingOption, '***matchingOption***') //-----------------------------------------------
                  //if (matchingOption && matchingOption.pricediff > 0) { // this method also check option price, if price > 0
                  if (matchingOption) {
                    //console.log(matchingOption, '***matchingOption')
                    // below data should be replaced from real file !!!!!
                    // const optionsData = [
                    //   {
                    //     id: 6666,
                    //     ProductName: 'Low Tack Tape 2in x 75ft KS650',
                    //     ProductCode: 'test',
                    //     Quantity: '1',
                    //     Vendor_PartNo: 'BRST+BRC-H+L6000D',
                    //     Vendor_Price: '100',
                    //     discount: 15,
                    //   },
                    // ]
                    //
                    return (() => {
                      console.log(matchingOption, '//matchingOption\\')
                      const option = OPTION_DATA.find(
                        (o) => o.id === matchingOption.id,
                      ) // Find a single match
                      console.log(option, '!!!option!!')
                      console.log(
                        [matchingOption?.quantity?.toString()],
                        option.ProductCode,
                        'matchingOption?.quantity?.toString()]',
                      )
                      if (!option) return {} // Fallback if no matching option is found
                      return {
                        ProductCode: [option.ProductCode || 'UnknownProduct'],
                        ProductName: [
                          matchingOption.optiondesc ||
                            option.ProductName ||
                            'UnknownOption',
                        ],
                        ProductPrice: [
                          matchingOption.pricediff?.toString() ||
                            option.Vendor_Price?.toString() ||
                            '0.00',
                        ],
                        //Quantity: [option.Quantity?.toString() || '1'],
                        // Quantity: [
                        //   matchingOption.quantity ||
                        //     option.quantity,
                        // ],
                        Quantity: [matchingOption?.quantity?.toString()], //|| option?.quantity?.toString() || "1"],
                        Vendor_PartNo: [option.Vendor_PartNo || 'Unknown'],
                        Vendor_Price: [
                          matchingOption.vendorpricediff?.toString() ||
                            option.Vendor_Price?.toString() ||
                            '0.00',
                        ],
                        discount: [option.discount || 15],
                      }
                    })()
                  }
                  return null
                })
                .filter(Boolean) // Remove null values
              console.log(extraProducts, 'extraProducts')
              return extraProducts
            }) || []
          console.log(productOption, '&&&productOption&&&')
          //
          //console.log(productOption, '***productOption***')
          if (Array.isArray(productOption) && productOption.length > 0) {
            setProductOptionsArr(productOption)
          }
          const filteredProductOption = Array.isArray(productOption)
            ? productOption.filter((item) => Object.keys(item).length > 0)
            : []
          console.log(filteredProductOption, '***filteredProductOption***')
          const combinedOrderDetails =
            filteredProductOption.length > 0
              ? [...Orders[0].OrderDetails, ...filteredProductOption]
              : Orders[0].OrderDetails
          //console.log(combinedOrderDetails, 'combinedOrderDetails');
          const optionOrderProducts = combinedOrderDetails.filter(
            (item) => !item.hasOwnProperty('OrderDetailID'),
          )
          setoptionProducts(optionOrderProducts)
          // Fetch product URLs and process vendors
          const productUrls = productCodes.map(
            (code) => `${API_BASE_URL}/api/products/${code.replace(/[\/,|@]/g, '-')}`,
          )
          const productResponses = await fetchProductData(
            productUrls,
            'product',
          )
          console.log(productResponses, '***productResponses***');
          // Extract existing product codes as a flat array, ensuring unique entries
          const existingProductCodes = new Set(
            productResponses.flatMap((response) =>
              (response.data?.xmldata?.Products || []).map((product) =>
                product.ProductCode[0].trim().toLowerCase(),
              ),
            ),
          )
          //console.log(existingProductCodes, 'existingProductCodes');
          const nonExistingCustomProducts = productDetails.filter((detail) => {
            const productCode = detail.productCode.trim().toLowerCase()
            return !existingProductCodes.has(productCode)
          })
          //console.log(nonExistingCustomProducts,'nonExistingCustomProducts');
          setUserCustomProducts(nonExistingCustomProducts)

          console.log(productResponses, '****productResponses')
          console.log(combinedOrderDetails, '***combinedOrderDetails')
          const quantityMap = combinedOrderDetails.reduce((acc, order) => {
            // Since ProductCode and Quantity are arrays, we take the first element.
            acc[order.ProductCode[0]] = order.Quantity[0]
            return acc
          }, {})
          setItemQuantityMap(quantityMap)
          console.log(quantityMap, itemQuantityMap, 'quantityMap')
          // Step 2: Map through productResponses to add the Quantity for each product.
          const updatedProductResponses = productResponses.map((response) => {
            const productsArray = Array.isArray(
              response.data?.xmldata?.Products,
            )
              ? response.data.xmldata.Products
              : [response.data.xmldata.Products]

            console.log(productsArray, 'productsArray')
            // Update each product in the Products array
            // const updatedProducts = productsArray.map((product) => {
            //   console.log(product.ProductCode[0],'product.ProductCode***');
            //   const productCode = product.ProductCode[0]
            //   // Look up the quantity using the product code
            //   const quantity = quantityMap[productCode] || null // you can set a default value if not found
            //   console.log(quantity,'quantity');
            //   // Return a new product object with Quantity added
            //   return { ...product, Quantity: [quantity] }
            // })

            const updatedProducts = productsArray
              .map((product) => {
                if (!product) {
                  return null
                }
                // Ensure that product.ProductCode exists and is an array
                const productCode = Array.isArray(product.ProductCode) ? product.ProductCode[0].toLowerCase() : null
                const matchingAlert = ALERTS.find(alert => alert.id.toLowerCase() === productCode);

                if (matchingAlert) {
                  alert(`ID: ${matchingAlert.id}\nNote: ${matchingAlert.note} !!!`);
                }
                // Look up the quantity using the product code
                //const quantity = productCode ? quantityMap[productCode] || null : null
                const quantity = productCode ? quantityMap[Object.keys(quantityMap).find(key => key.toLowerCase() === productCode)] || null : null;
                  console.log(productCode, '!!! productCode !!!');
                  console.log(quantityMap, '!!! quantityMap !!!');
                  console.log(quantity, '!!! quantity !!!');
                return { ...product, Quantity: [quantity] }
              })
              // Filter out any null results
              .filter((product) => product !== null)
            console.log(updatedProducts, '***updatedProducts***')
            // Return the updated response object with the new products list
            return {
              ...response,
              data: {
                ...response.data,
                xmldata: {
                  ...response.data.xmldata,
                  Products: updatedProducts,
                },
              },
            }
          })

          console.log(updatedProductResponses, 'updatedProductResponses')
          //console.log(productResponses, 'updatedProductResponses')
          // get product length with Google_Age_Group values
          //const vendorKits = extractVendorKits(productResponses) // old version
          const vendorKits = extractVendorKits(updatedProductResponses)
          console.log(vendorKits, '***vendorKits***')
          //console.log(vendorKits.length, '***vendorKits.length***') // does not call
          setVendorKitsLenght(vendorKits.length)
          //console.log(vendorKits, '!!!vendorKits!!!')
          if (vendorKits.length > 1) {
            // setShowVendorKitPopup(true)
            setVendorKitItem(vendorKits)
          }

          const validVendors = await processProductResponses(
            //productResponses,
            updatedProductResponses,
            combinedOrderDetails,
          )
          //console.log(validVendors, '***validVendors***')
          //console.log(combinedOrderDetails, '***combinedOrderDetails***')
          //console.log(optionOrderProducts, 'optionOrderProducts');
          updateVendorState(validVendors)
          updateOrderListWithVendorCodes(combinedOrderDetails, validVendors)
          processOrderDetails(Orders[0])
          setOrderProductDetails(combinedOrderDetails)
        }
      } catch (error) {
        console.error('Error fetching order data:', error)
      }
    }

    // const extractVendorKits = (productResponses) => {
    //   //console.log(productResponses, '** productResponses***')
    //   return productResponses
    //     .map((item) => {
    //       //console.log(item, '**item productResponses***')
    //       const { xmldata: { Products } } = item.data;
    //       //console.log(Products, '***Products***');
    //       return Products.map((product) => {
    //         if (Array.isArray(product.Google_Age_Group)) {
    //           return product.Google_Age_Group.join(' // ').split(' // ');
    //         }
    //         return [];
    //       });
    //     })
    //     .flat(2);
    // };
    const extractVendorKits = (productResponses) => {
      console.log(productResponses, 'productResponses extractVendorKits')
      let alertShown = false // Flag to track if the alert has been shown
      //console.log(userCustomProducts,'userCustomProducts');
      const mergedItems = [
        ...productResponses.map((response) => ({
          ...response,
          data: {
            ...response.data,
            xmldata: {
              Products: response.data?.xmldata?.Products || [],
            },
          },
        })),
        ...userCustomProducts.map((product) => ({
          data: {
            xmldata: {
              Products: [
                {
                  ProductCode: product.productCode,
                  ProductPrice: product.productPrice,
                  ProductName: product.productName,
                  Quantity: product.Quantity,
                },
              ],
            },
          },
        })),
      ]
      //console.log(mergedItems, '****mergedItems')
      return mergedItems.flatMap((item, index) => {
        const { xmldata: { Products } = {} } = item.data
        if (!Array.isArray(Products) || Products.length === 0) {
          console.warn(`Invalid Products at index ${index}`)
          return []
        }
        return Products.flatMap((product) => {
          console.log(product, 'product.Quantity')
          if (Array.isArray(product.Google_Age_Group)) {
            return product.Google_Age_Group.flatMap((group) => {
              // Split the group string into its parts
              return group.split(' // ').map((g) => ({
                ProductCode: product.ProductCode[0], 
                Quantity: product.Quantity ? product.Quantity[0] : null, 
                Google_Age_Group: g,
              }))
            })
          }
          return []
        })
        // return Products.flatMap((product) => {
        //   if (Array.isArray(product.Google_Age_Group)) {
        //     return product.Google_Age_Group.flatMap((group) =>
        //       group.split(' // '),
        //     )
        //   }
        //   return []
        // })
      })
    }

    // const fetchProductData = async (productUrls, type) => {
    //   try {
    //     return await Promise.all(productUrls.map((url) => axios.get(url, { params: { type } })))
    //   } catch (error) {
    //     console.error('Error fetching product data:', error)
    //     return []
    //   }
    // }

    const fetchKitData = async (kitUrls) => {
      try {
        const kitResponses = await Promise.all(
          kitUrls.map((url) => axios.get(url)),
        )
        const kitVendors = processProductResponses(kitResponses)
        replaceQuantities(kitVendors, quantityItemObject) // update quantity
        updateVendorState(kitVendors)
        applyDiscounts(kitVendors)
      } catch (error) {
        console.error('Error fetching kit data:', error)
      }
    }

    let quantityItemObject = []
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
      const productPriceMap = {}
      //console.log(products, '<< products');
      // Create a lookup map for product prices based on ProductCode
      products.forEach((product) => {
        const productCode = product.ProductCode[0]
        const productPrice = product.ProductPrice[0]
        productPriceMap[productCode] = productPrice
      })

      // Compare the prices
      const mismatchedPrices = orderProductDetails.filter((orderProduct) => {
        const productCode = orderProduct.productCode
        const orderProductPrice = orderProduct.productPrice
        const productPrice = productPriceMap[productCode]

        return productPrice && productPrice !== orderProductPrice
      })

      return mismatchedPrices
    }

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
    const processProductResponses = async (
      productResponses,
      orderProductDetails,
    ) => {
      const vendors = productResponses.map((response) => {
        // Handle cases where xmldata might be undefined or an empty string
        const xmldata = response.data.xmldata || {}
        const Products = xmldata.Products || []

        if (!Products.length) {
          console.log('No Products found in response')
          return null
        }
        // Compare product prices
        const mismatchedPrices = compareProductPrices(
          Products,
          orderProductDetails,
        )
        if (mismatchedPrices.length > 0) {
          mismatchedPrices.forEach((item) => {
            setMismatchedPrices(mismatchedPrices)
            setShowModal(true)
          })
        } else {
          console.log('All product prices match.')
        }

        // Process the product details
        const product = Products[0]
        let vendorPartNo = product.Vendor_PartNo ? product.Vendor_PartNo[0] : ''
        // Check if ProductCode starts with 'or', 'OR', 'Or', or 'oR'
        const productCode = product.ProductCode ? product.ProductCode[0] : ''
        if (/^or$/i.test(productCode.substring(0, 2))) {
          vendorPartNo = product.Google_Age_Group
            ? product.Google_Age_Group[0]
            : vendorPartNo
        }
        console.log(product)
        return {
          Vendor_PartNo: [vendorPartNo],
          ProductCode: [productCode],
          ProductName: [product.ProductName ? product.ProductName[0] : ''],
          ProductPrice: [product.ProductPrice ? product.ProductPrice[0] : ''],
          Vendor_Price: [product.Vendor_Price ? product.Vendor_Price[0] : ''],
          Quantity: [product.Quantity ? product.Quantity[0] : ''],
        }
      })
      return vendors.filter((vendor) => vendor !== null)
    }

    const replaceQuantities = (products, replacements) => {
      products.forEach((product) => {
        const code = product.ProductCode[0]
        if (replacements.hasOwnProperty(code)) {
          product.Quantity = [replacements[code]]
        }
      })
    }

    const updateVendorState = (validVendors) => {
      //console.log(validVendors, 'validVendors')
      setVendor((prevVendor) => [...prevVendor, ...validVendors])
      setRerenderOrderList(validVendors)
    }

    const updateOrderListWithVendorCodes = (orderDetails, validVendors) => {
      //console.log(orderDetails, '***orderDetails**');
      //console.log(rerenderOrderList,'***rerenderOrderList***');
      // console.log(validVendors, '***validVendors***');
      const updatedOrderWithVendorCodes = orderDetails.map((order) => {
        // console.log(
        //   orderDetails,
        //   '***order from updatedOrderListWithVendorCodes',
        // )
        const matchingVendor = validVendors.find(
          (vendor) =>
            vendor.ProductCode[0].toLowerCase() ===
            order.ProductCode[0].toLowerCase(),
        )
        //console.log(matchingVendor, 'matchingVendor')
        return matchingVendor ? { ...order, ...matchingVendor } : order
      })
      //console.log(updatedOrderWithVendorCodes, '***updatedOrderWithVendorCodes***');
      setRerenderOrderList(updatedOrderWithVendorCodes)
      applyDiscounts(updatedOrderWithVendorCodes)
    }

    const applyDiscounts = (orderList) => {
      orderList.forEach((order) => {
        //console.log(order, '***order applyDiscounts')
        VENDOR_LIST.forEach((vendor) => {
          const code = order.ProductCode.toString()
          if (code.toLowerCase().startsWith(vendor.code)) {
            order.discount = [vendor.discount]
            discountRenderFlag = true
          }
        })
      })
    }

    const processOrderDetails = (order) => {
      //const customFieldInHandDate = order.Custom_Field_InHand[0];
      //const orderComments = order.Order_Comments[0];
      const customFieldInHandDate =
        order.Custom_Field_InHand && order.Custom_Field_InHand[0]
          ? order.Custom_Field_InHand[0]
          : 'Not Found'
      const orderComments =
        order.Order_Comments && order.Order_Comments[0]
          ? order.Order_Comments[0]
          : 'Not Found'
      setCustomFieldInHand(customFieldInHandDate)
      setOrderComments(orderComments)
    }

    // Call the function with your order URL
    fetchOrderData(orderUrl)
  }, [orderId, discountRenderFlag, vendorKitsLenght])

  // Log updated orderClientAddress
  useEffect(() => {
    console.log(orderClientAddress)
  }, [orderClientAddress])

  const fetchProductData = async (productUrls, type) => {
    try {
      return await Promise.all(
        productUrls.map((url) => axios.get(url, { params: { type } })),
      )
    } catch (error) {
      console.error('Error fetching product data:', error)
      return []
    }
  }

  // method to transform data in handleConfirmSplit
  const transformUpdatedProductsToUserCustomFormat = (val) => {
    return val.map((product) => {
      return {
        Quantity: [product.Quantity] || ['1'],
        ProductCode: Array.isArray(product.productCode)
          ? [product.productCode[0]]
          : [product.productCode],
        ProductName: Array.isArray(product.productName)
          ? [product.productName[0]]
          : [product.productName],
        ProductPrice: Array.isArray(product.productPrice)
          ? [product.productPrice[0]]
          : [product.productPrice],
        discount: ['0'],
        Vendor_Price: Array.isArray(product.productPrice)
          ? [product.productPrice[0]]
          : [product.productPrice],
        Vendor_PartNo: ['custom'],
      }
    })
  }

  const mergeDuplicatedProducts = (products) => {
    console.log(products, '***products mergeDuplicatedProducts ***');
    return products.reduce((acc, product) => {
      // Extract and normalize ProductCode safely
      const productCode = JSON.stringify(product.ProductCode)
        .trim()
        .toLowerCase()
      // add discount
      VENDOR_LIST.forEach((vendor) => {
        const code = Array.isArray(product.ProductCode)
          ? product.ProductCode[0].trim().toLowerCase()
          : product.ProductCode.trim().toLowerCase()

        if (code.toLowerCase().startsWith(vendor.code)) {
          product.discount = [vendor.discount]
        }
      })

      if (!productCode) {
        console.warn('Skipping product with missing ProductCode:', product)
        return acc
      }

      // Find an existing product with the same ProductCode
      const existingProduct = acc.find((p) => {
        const existingCode = JSON.stringify(p.ProductCode).trim().toLowerCase()
        return existingCode === productCode
      })

      if (existingProduct) {
        // Merge Quantity Safely
        const existingQuantity = parseInt(
          existingProduct.Quantity?.[0] || '1',
          10,
        )
        const newQuantity = parseInt(product.Quantity?.[0] || '1', 10)
        const totalQuantity = existingQuantity + newQuantity
        existingProduct.Quantity = [totalQuantity.toString()]

        // Fix Vendor_Price NaN issue
        const existingVendorPrice =
          parseFloat(existingProduct.Vendor_Price?.[0]) || 0
        const newVendorPrice = parseFloat(product.Vendor_Price?.[0]) || 0

        if (existingVendorPrice > 0 && newVendorPrice > 0) {
          const totalVendorCost =
            existingVendorPrice * existingQuantity +
            newVendorPrice * newQuantity
          existingProduct.Vendor_Price[0] = (
            totalVendorCost / totalQuantity
          ).toFixed(2)
        } else {
          existingProduct.Vendor_Price[0] = (
            existingVendorPrice || newVendorPrice
          ).toString()
        }
      } else {
        acc.push({ ...product, Quantity: product.Quantity || ['1'] })
      }

      return acc
    }, [])
  }

  const handleConfirmSplit = async () => {
    const updatedOptions = productOptionsArr.map((item) => {
      const productCode = Array.isArray(item.ProductCode)
        ? item.ProductCode[0]
        : item.ProductCode
      const productCodeKey = Object.keys(itemQuantityMap).find(
        (key) => key.toLowerCase() === productCode.toLowerCase(),
      )
      if (productCodeKey) {
        console.log(
          `Updating Quantity for ${productCode} to`,
          itemQuantityMap[productCodeKey],
        )
        return {
          ...item,
          Quantity: Array.isArray(item.Quantity)
            ? [itemQuantityMap[productCodeKey]]
            : itemQuantityMap[productCodeKey],
        }
      } else {
        console.log(`ProductCode ${productCode} not found in itemQuantityMap`)
        return item
      }
    })
    setUpdatedOptionsArr(updatedOptions)
    console.log(updatedOptions, updatedOptionsArr, '***updatedOptions')

    //setProductOptionsArr(updatedOptions);
    console.log(productOptionsArr, '**productOptionsArr*')
    const vendorKitCodes = productOptionsArr.map((item) => item.Vendor_PartNo)
    console.log(vendorKitCodes, '***vendorKitCodes***')
    // update quantity splitted kits
    vendorKitItem.map((item) => {
      const productCodeKey = Object.keys(itemQuantityMap).find(
        (key) => key.toLowerCase() === item.ProductCode.toLowerCase(),
      )
      if (productCodeKey) {
        item.Quantity = itemQuantityMap[productCodeKey] // Assign quantity
      } else {
        console.log(
          `ProductCode ${item.ProductCode} not found in itemQuantityMap`,
        )
      }
    })
    console.log(vendorKitItem, '***vendorKitItem***')
    const googleAgeGroups = vendorKitItem.map((item) => item.Google_Age_Group)
    console.log(googleAgeGroups, 'googleAgeGroups')
    //console.log(optionProducts, '***optionProducts***');
    //console.log(orderProductDetails, '***orderProductDetails');
    const combinedOptionsAndKits = [...vendorKitCodes, ...googleAgeGroups]
    console.log(combinedOptionsAndKits, '***combinedOptionsAndKits***')
    //const uniqueVendorCodes = [...new Set(combinedOptionsAndKits)];
    //const uniqueVendorCodes = [...new Set([...productOptionsArr.map(item => item.Vendor_PartNo), ...vendorKitItem])];

    const vendorUrls = combinedOptionsAndKits.map(
      (code) => `${API_BASE_URL}/api/vendors/${code}`,
    )
    console.log(vendorUrls, 'vendorUrls')
    const vendorResponses = await fetchProductData(vendorUrls, 'vendor')
    //console.log(vendorResponses, '***vendorResponses');
    const updatedProducts = vendorResponses.flatMap((item) => {
      console.log(item.data, '***item data***')
      const { xmldata: { Products } = {} } = item.data || {}
      return Products || []
    })
    // const updatedProductsWithQuantity = updatedProducts.map((product) => {
    //   console.log(product,'product***');
    //   const googleAgeGroup = product.Google_Age_Group[0]
    //   const match = vendorKitItem.find(
    //     (vk) => vk.Google_Age_Group === googleAgeGroup,
    //   )
    //   return {
    //     ...product,
    //     Quantity: match ? [match.Quantity] : 1,
    //   }
    // })
    console.log(updatedProducts, '!updatedProducts!')
    // const updatedProductsWithQuantity = updatedProducts
    //   .filter(
    //     (product) => product.Google_Age_Group && product.Google_Age_Group[0],
    //   )
    //   .map((product) => {
    //     const googleAgeGroup = product.Google_Age_Group[0]
    //     const match = vendorKitItem.find((vk) => {
    //       if(vk.Quantity === null ) {
    //         return vk.Quantity = '1' // this section should be redevelop
    //       }
    //       return (
    //         vk.Google_Age_Group.toLowerCase().trim() ===
    //         googleAgeGroup.toLowerCase().trim()
    //       )
    //     })

    //     return {
    //       ...product,
    //       Quantity: match ? [match.Quantity] : 1,
    //     }
    //   })
    // const updatedProductsWithQuantity = updatedProducts.map((product) => {
    //   const productCode = product.ProductCode[0]
    //   const googleAgeGroup = product.Google_Age_Group
    //     ? product.Google_Age_Group[0]
    //     : null
    //   let match = productOptionsArr.find(
    //     (option) => option.ProductCode[0] === productCode,
    //   )
    //   if (!match && googleAgeGroup) {
    //     match = vendorKitItem.find(
    //       (vk) =>
    //         vk.Google_Age_Group.toLowerCase().trim() ===
    //         googleAgeGroup.toLowerCase().trim(),
    //     )
    //   }
    //   return {
    //     ...product,
    //     Quantity: match ? match.Quantity : product.Quantity,
    //   }
    // })

    // const updatedProductsWithQuantity = updatedProducts.map((product) => {

    //   const productCode = product.ProductCode[0]
    //   const googleAgeGroup = product.Google_Age_Group ? product.Google_Age_Group[0] : product.Vendor_PartNo[0]

    //   let match = productOptionsArr.find((option) => option.ProductCode[0] === productCode)

    //   if (!match && googleAgeGroup) {
    //     match = vendorKitItem.find(
    //       (vk) =>
    //         vk.Google_Age_Group.toLowerCase().trim() ===
    //         googleAgeGroup.toLowerCase().trim(),
    //     )
    //   }
    //   // Check if productOptionsArr has an item with Vendor_PartNo ['manually']
    //   const manualEntry = productOptionsArr.find(
    //     (option) =>
    //       option.Vendor_PartNo && option.Vendor_PartNo[0] === 'manually',
    //   )
    //   let updatedProductList = [
    //     {
    //       ...product,
    //       Quantity: match ? [match.Quantity] : product.Quantity, // Update Quantity if match is found
    //     },
    //   ];
    //   console.log(updatedProductList, '***updatedProductList***');
    //   // If a manually entered product exists, add it as a separate entry
    //   if (manualEntry) {
    //     updatedProductList.push({
    //       ProductCode: manualEntry.ProductCode,
    //       ProductName: manualEntry.ProductName,
    //       ProductPrice: manualEntry.ProductPrice,
    //       Vendor_PartNo: manualEntry.Vendor_PartNo,
    //       Vendor_Price: manualEntry.Vendor_Price,
    //       Quantity: manualEntry.Quantity,
    //     })
    //   }
    //   return updatedProductList;
    // }).flat();
    console.log(productOptionsArr, '//productOptionsArr')
    //   const updatedProductsWithQuantity = updatedProducts.flatMap((product) => {
    //     console.log(product, '>> product');
    //     const productCode = product.ProductCode[0];
    //     const googleAgeGroup = product.Google_Age_Group ? product.Google_Age_Group[0] : null;

    //     console.log(`Processing Product: ${productCode} | Google_Age_Group: ${googleAgeGroup}`);
    //     console.log(updatedOptionsArr, '!!!>>> updatedOptionsArr'); // receiving correct data for options product !!!!
    //     // Find matching product in productOptionsArr by ProductCode
    //     let match = productOptionsArr.find((option) => option.ProductCode[0] === productCode); // !!!!ERRR no all option
    //     console.log(match, '!!!match>>>');
    //     if (!match && googleAgeGroup) {
    //         match = vendorKitItem.find(
    //             (vk) => vk.Google_Age_Group.toLowerCase().trim() === googleAgeGroup.toLowerCase().trim()
    //         );
    //     }

    //     let quantity = product.Quantity || [1];

    //     if (match && match.Quantity != null) {
    //         quantity = [match.Quantity];
    //     }

    //     console.log(`Final Quantity for ${productCode}:`, quantity);

    //     // Check if productOptionsArr has an item with Vendor_PartNo ['manually']
    //     const manualEntry = updatedOptionsArr.find((option) => {
    //       return option.Vendor_PartNo[0] === 'manually';
    //     }
    //         //(option) => option.Vendor_PartNo === 'manually'

    //     );
    //     console.log(manualEntry.Quantity, '<<manualEntry');
    //     // Create an array to hold updated products
    //     let updatedProductList = [
    //         {
    //             ...product,
    //            Quantity: quantity, // Ensure quantity is properly set
    //         }
    //     ];

    //     if (manualEntry) { // !!!! CORRECT
    //         console.log(`Adding manualEntry product:`, manualEntry);
    //         updatedProductList.push({
    //             ProductCode: manualEntry.ProductCode,
    //             ProductName: manualEntry.ProductName,
    //             ProductPrice: manualEntry.ProductPrice,
    //             Vendor_PartNo: manualEntry.Vendor_PartNo,
    //             Vendor_Price: manualEntry.Vendor_Price,
    //             Quantity: manualEntry.Quantity || [1],
    //         });
    //         console.log(updatedProductList, '<< !! updatedProductList');
    //     }

    //     return updatedProductList;
    // });
    // 1) Build your main array WITHOUT manualEntry inside the loop
    
    // before working code
    // const updatedProductsWithQuantity = updatedProducts.map((product) => {
    //   console.log(product, '>> product updatedProductsWithQuantity')
    //   const productCode = product.ProductCode[0]
    //   const googleAgeGroup = product.Google_Age_Group?.[0] || null

    //   console.log(
    //     `Processing Product: ${productCode} | Google_Age_Group: ${googleAgeGroup}`,
    //   )

    //   // Match by ProductCode in productOptionsArr
    //   let match = productOptionsArr.find(
    //     (option) => option.ProductCode?.[0] === productCode,
    //   )
      
    //   // If no match by code, try vendorKitItem by Google_Age_Group
    //   if (!match && googleAgeGroup) {
    //     match = vendorKitItem.find((vk) => vk.Google_Age_Group.toLowerCase().trim() === googleAgeGroup.toLowerCase().trim())
    //   }

    //   console.log(match, '!!!match!!!');
    //   // Default quantity
    //   let quantity = product.Quantity || ['1']

    //   // If we found a match with a valid Quantity, use it
    //   if (match && match.Quantity != null) {
    //     quantity = Array.isArray(match.Quantity) ? match.Quantity : [match.Quantity]
    //   }

    //   console.log(`Final Quantity for ${productCode}:`, quantity)

    //   // Return ONE product for each original product
    //   return {
    //     ...product,
    //     Quantity: quantity,
    //   }
    // })
    const updatedProductsWithQuantity = updatedProducts.map((product) => {

      const productCode = product.ProductCode[0];
      const googleAgeGroup = product.Google_Age_Group?.[0] || null;
    
      console.log(
        `Processing Product: ${productCode} | Google_Age_Group: ${googleAgeGroup}`
      );
    
      // 1) Match by ProductCode in productOptionsArr
      let match = productOptionsArr.find(
        (option) => option.ProductCode?.[0] === productCode
      );
    
      // 2) If no match by code, try vendorKitItem by Google_Age_Group
      if (!match && googleAgeGroup) {
        const idx = vendorKitItem.findIndex((vk) =>
          vk.Google_Age_Group.toLowerCase().trim() ===
          googleAgeGroup.toLowerCase().trim()
        );
    
        // If found, remove that ONE item from vendorKitItem
        if (idx !== -1) {
          match = vendorKitItem[idx];
          // Remove it so it cannot be used again
          vendorKitItem.splice(idx, 1);
        }
      }
    
      console.log(match, '!!!match!!!');
    
      // 3) Default quantity
      let quantity = product.Quantity || ['1'];
    
      // 4) If we found a match with a valid Quantity, use it
      if (match && match.Quantity != null) {
        quantity = Array.isArray(match.Quantity) ? match.Quantity : [match.Quantity];
      }
    
      console.log(`Final Quantity for ${productCode}:`, quantity);
    
      // 5) Return ONE product for each original product
      return {
        ...product,
        Quantity: quantity,
      };
    });
    
    // 2) Find the manual entry in updatedOptionsArr ONCE
    // const manualEntry = updatedOptionsArr.find(
    //   (option) => option.Vendor_PartNo?.[0] === 'manually',
    //   //option.Vendor_PartNo && option.Vendor_PartNo[0] === 'manually',
    // )
    const manualEntry = Array.isArray(updatedOptionsArr)
  ? updatedOptionsArr.find(
      (option) => option?.Vendor_PartNo?.[0] === 'manually'
    )
  : null;

    // 3) If manualEntry exists, push it exactly once
    if (manualEntry) {
      console.log('Adding manualEntry product:', manualEntry)
      updatedProductsWithQuantity.push({
        ProductCode: manualEntry.ProductCode,
        ProductName: manualEntry.ProductName,
        ProductPrice: manualEntry.ProductPrice,
        Vendor_PartNo: manualEntry.Vendor_PartNo,
        Vendor_Price: manualEntry.Vendor_Price,
        Quantity: manualEntry.Quantity || ['1'],
      })
    }

    // 4) Now you have ONE array with no duplicates
    console.log(
      updatedProductsWithQuantity,
      '<< Final updatedProductsWithQuantity',
    )

    console.log(updatedProducts, '|| updatedProducts')
    console.log(updatedProductsWithQuantity, '|| updatedProductsWithQuantity')
    console.log(productOptionsArr, '***productOptionsArr***')
    // console.log(
    //   updatedProductsWithQuantity,
    //   '***updatedProductsWithQuantity***',
    // )
    //console.log(updatedProducts, '***updatedProducts***')
    // merge products with same product code
    //const mergedProducts = mergeDuplicatedProducts(updatedProducts) // old version
    const mergedProducts = mergeDuplicatedProducts(updatedProductsWithQuantity)
    console.log(mergedProducts, '***mergedProducts***')
    // Define keys to copy from old rerenderOrderList
    const keysToCopy = ['OrderDetailID', 'Quantity', 'TotalPrice', 'discount']
    const updatedOrderList = mergedProducts.map((product) => {
      //console.log(product,'product');
      let source =
        rerenderOrderList.find(
          (item) => item.ProductName[0] === product.ProductName[0],
        ) ||
        rerenderOrderList[0] ||
        {}
      //console.log(source,'source');
      // set Quantity value
      if (source && product.Quantity && product.Quantity.length) {
        source.Quantity = [product.Quantity[0]]
      }

      // Copy specified keys
      const copiedData = keysToCopy.reduce((acc, key) => {
        if (source[key]) {
          acc[key] = source[key]
        }
        return acc
      }, {})

      return {
        ...product,
        ...copiedData,
      }
    })
    console.log(updatedOrderList, 'updatedOrderList')
    const normalizedUpdatedProducts = transformUpdatedProductsToUserCustomFormat(
      userCustomProducts,
    )
    console.log(normalizedUpdatedProducts, 'normalizedUpdatedProducts')

    const modOrderList = [
      ...normalizedUpdatedProducts,
      ...updatedOrderList.flat(Infinity),
      //...optionProducts, // add existing options
    ]
    console.log(modOrderList, 'modOrderList')
    setRerenderOrderList(modOrderList)

    // Log for debugging
    //console.log(updatedOrderList, '***Updated rerenderOrderList***');

    // Close the popup
    setShowVendorKitPopup(false)
  }

  const handleCancelSplit = () => {
    console.log('Canceled splitting products.')
    setShowVendorKitPopup(false)
  }

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
        setShowVendorKitPopup={setShowVendorKitPopup}
      />

      {/* Vendor Kits Popup */}
      <Modal show={showVendorKitPopup} onHide={handleCancelSplit}>
        <Modal.Header closeButton>
          <Modal.Title>Split Products</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          There are {vendorKitsLenght} products. Do you want to split the kits?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelSplit}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmSplit}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModal}
        onHide={handleClose}
        dialogClassName={`${styles.modalBottom} ${styles.modalWarning}`}
      >
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className={styles.modalTitle}>
            Mismatched Prices
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          {mismatchedPrices.length > 0 ? (
            mismatchedPrices.map((item, index) => (
              <p key={index}>
                Possible added option! Double check manually! <br />{' '}
                ProductCode: {item.productCode}
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
