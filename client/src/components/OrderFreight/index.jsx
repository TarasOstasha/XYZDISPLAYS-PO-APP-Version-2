import axios from 'axios';

// import { Formik, Form, Field, ErrorMessage } from 'formik'
import styles from './OrderFreight.module.scss';
// import * as API from '../../api'
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { ORDER_VALIDATION_SCHEMA } from '../../utils/orderValidationSchema'
import { useEffect, useState } from 'react';

import { VENDOR_LIST } from '../../utils/vendorsData';
import { ALERTS } from '../../utils/alerts';
// import { yellow, descriptionWidth, attension } from '../../stylesConstants'
import OrderFreightForm from '../OrderFreightForm';
import AddProductPopUp from '../AddProductPopUp';
import MismatchedPricesModal from './MismatchedPricesModal';
import { OPTION_DATA } from '../../utils/optionsData';
import ProductSplitPopup from '../SplitProductPopup/SplitProductPopup';

function OrderFreight() {
  const API_BASE_URL =
    window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'http://server:5000';

  let discountRenderFlag = false;
  const [mismatchedPrices, setMismatchedPrices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);

  const [orderId, setOrderId] = useState('');

  // Vendor Kits Popup
  const [showVendorKitPopup, setShowVendorKitPopup] = useState(false);

  // *** order Detail ***
  const [rerenderOrderList, setRerenderOrderList] = useState([]); // rerender when inserting discount value to our object
  const [filteredOrderList, setFilteredOrderList] = useState([]);

  // *** order ship to ***
  const [orderClientAddress, setOrderClientAddress] = useState(null);

  const [removeOnclick, setRremoveOnclick] = useState(0);
  const [isEditing, setIsEditing] = useState(null);
  const [isEditingTop, setIsEditingTop] = useState(false);
  const [inputIndex, setInputIndex] = useState(0);
  const [vendorAddress, setVendorAddress] = useState('');
  const [shipInfo, setShipInfoDescription] = useState();

  const [customFieldInHand, setCustomFieldInHand] = useState();
  const [orderComments, setOrderComments] = useState();
  const [vendor, setVendor] = useState([]);
  const [orderProductDetails, setOrderProductDetails] = useState(null);
  const [vendorKitsLenght, setVendorKitsLenght] = useState(0);
  const [vendorKitItem, setVendorKitItem] = useState([]);
  const [optionProducts, setoptionProducts] = useState();
  const [userCustomProducts, setUserCustomProducts] = useState([]);
  const [productOptionsArr, setProductOptionsArr] = useState([]);
  const [itemQuantityMap, setItemQuantityMap] = useState();
  const [updatedOptionsArr, setUpdatedOptionsArr] = useState();

  const handleToRemove = (index, array, formikProps = null) => {
    console.log(index, array);
    if (index >= 0 && index < array.length) {
      // Create a new array without mutating the original
      const newArray = array.filter((_, i) => i !== index);
      // Update the state with the new array
      setRerenderOrderList(newArray);
      setRremoveOnclick(array[index]);
      
      // If in EDIT MODE (formikProps provided), update Formik's field arrays
      if (formikProps && isEditingTop) {
        const fieldNames = ['productCode', 'vendorCode', 'productName', 'productQuantity', 'vendorPrice', 'productDiscount'];
        fieldNames.forEach(fieldName => {
          const currentArray = formikProps.values[fieldName] || [];
          const newFieldArray = currentArray.filter((_, i) => i !== index);
          formikProps.setFieldValue(fieldName, newFieldArray);
        });
      }
    }
    console.log(array, index, '<< array');
  };

  const handleToEdit = (index, formikProps) => {
    setIsEditing(index === isEditing ? null : index);
    if (rerenderOrderList[index].hasOwnProperty('Vendor_Price')) {
      formikProps.values.productPrice =
        rerenderOrderList[index].Vendor_Price[0];
    }
    formikProps.values.productCode = rerenderOrderList[index].ProductCode[0];
    formikProps.values.productName = rerenderOrderList[index].ProductName[0];
    formikProps.values.productQuantity = rerenderOrderList[index].Quantity[0];
  };

  const handleChangeInput = (e, i, formikProps) => {
    setInputIndex(i);
    console.log(i);
  };

  const normalizeDecimalSeparator = (value) => {
    if (value == null) return '';
    const parsedValue = String(value).trim();
    if (!parsedValue) return '';

    // Keep digits, separators and minus; drop currency symbols/text.
    const cleaned = parsedValue.replace(/[^\d,.-]/g, '');
    if (!cleaned) return '';

    const lastComma = cleaned.lastIndexOf(',');
    const lastDot = cleaned.lastIndexOf('.');
    const decimalSeparator =
      lastComma > lastDot ? ',' : lastDot > lastComma ? '.' : null;

    if (!decimalSeparator) {
      return cleaned.replace(/,/g, '').replace(/\./g, '');
    }

    const negative = cleaned.includes('-') ? '-' : '';
    const unsigned = cleaned.replace(/-/g, '');
    const splitIndex = unsigned.lastIndexOf(decimalSeparator);

    const integerPart = unsigned
      .slice(0, splitIndex)
      .replace(/[.,]/g, '')
      .replace(/\D/g, '');
    const decimalPart = unsigned
      .slice(splitIndex + 1)
      .replace(/[.,]/g, '')
      .replace(/\D/g, '');

    return decimalPart ? `${negative}${integerPart}.${decimalPart}` : `${negative}${integerPart}`;
  };

  const handleToEditTop = (formikProps) => {
    setIsEditingTop(true);

    //console.log(isEditingTop, 'isEditingTop handleToEditTop');
    const mapProperty = (property) =>
      rerenderOrderList.map((p) => p[property]?.[0] || '');
    const valuesToUpdate = {
      productCode: mapProperty('ProductCode'),
      vendorCode: mapProperty('Vendor_PartNo'),
      productName: mapProperty('ProductName'),
      productQuantity: mapProperty('Quantity'),
      vendorPrice: mapProperty('Vendor_Price').map(normalizeDecimalSeparator),
      productPrice: mapProperty('ProductPrice'),
      productDiscount: mapProperty('discount'),
    };
    formikProps.setValues({
      ...formikProps.values,
      ...valuesToUpdate,
    });
  };

  const handleFormValuesChange = (newValues) => {
    const newProduct = [newValues];
    setRerenderOrderList((rerenderOrderList) => [
      ...rerenderOrderList,
      ...newProduct,
    ]);
  };

  const handleToSave = (index, formikProps) => {
    if (rerenderOrderList[index].hasOwnProperty('Vendor_Price')) {
      rerenderOrderList[index].ProductCode[0] = formikProps.values.productCode;
      rerenderOrderList[index].Vendor_PartNo[0] = formikProps.values.vendorCode;
      rerenderOrderList[index].ProductName[0] = formikProps.values.productName;
      rerenderOrderList[index].Quantity[0] = formikProps.values.productQuantity;
      rerenderOrderList[index].Vendor_Price[0] = normalizeDecimalSeparator(
        formikProps.values.vendorPrice,
      );
      rerenderOrderList[index].ProductPrice[0] =
        formikProps.values.productPrice;
      rerenderOrderList[index].TotalPrice[0] = formikProps.values.totalAmount;
      setIsEditing(null);
    } else {
      alert(
        `Vendor Price is missing! or ${rerenderOrderList[index].ProductCode[0]} is Website order item`,
      );
      rerenderOrderList[index].ProductCode[0] = formikProps.values.productCode;
      rerenderOrderList[index].ProductName[0] = formikProps.values.productName;
      setIsEditing(null);
      return;
    }
  };

  // updated on 2025-08-07
  const handleToSaveTop = (formikProps) => {
    const {
      productCode = [],
      vendorCode = [],
      vendorPrice = [],
      productDiscount = [],
      productName = [],
      productQuantity = [],
      productPrice = [], // keep if you use it for totals
    } = formikProps.values || {};

    const toArray = (v) => (Array.isArray(v) ? [...v] : v != null ? [v] : ['']);

    const updated = rerenderOrderList.map((orig, i) => {
      if (!orig) return orig;

      // clone object + its array fields
      const item = {
        ...orig,
        ProductCode: toArray(orig.ProductCode),
        ProductName: toArray(orig.ProductName),
        Quantity: toArray(orig.Quantity),
        discount: toArray(orig.discount),
        Vendor_Price: toArray(orig.Vendor_Price),
        Vendor_PartNo: toArray(orig.Vendor_PartNo),
        ProductPrice: toArray(orig.ProductPrice),
      };

      // get quantity from form
      const qRaw = productQuantity[i];
      const qty = qRaw === '' || qRaw == null ? item.Quantity[0] : Number(qRaw);

      item.ProductCode[0] = productCode[i] ?? item.ProductCode[0];
      item.Vendor_PartNo[0] = vendorCode[i] ?? item.Vendor_PartNo[0];
      item.Vendor_Price[0] = normalizeDecimalSeparator(
        vendorPrice[i] ?? item.Vendor_Price[0] ?? '0',
      );
      item.discount[0] = productDiscount[i] ?? item.discount[0] ?? 0;
      item.ProductName[0] = productName[i] ?? item.ProductName[0];
      item.Quantity[0] = Number.isFinite(qty) ? qty : item.Quantity[0];

      if (productPrice.length) {
        item.ProductPrice[0] = productPrice[i] ?? item.ProductPrice[0];
      }

      return item;
    });

    setRerenderOrderList(updated);
    setIsEditingTop(false);
    console.log('handleToSaveTop: saved');
  };

  const handleVendorAddressChange = (address) => {
    console.log(address, 'handleVendorAddressChange');
    setVendorAddress(address);
  };

  const handleVendorShipInfoDescription = (vendor) => {
    setShipInfoDescription(vendor);
  };
  useEffect(() => {
    console.log(updatedOptionsArr, 'updatedOptionsArr AFTER state update');
  }, [updatedOptionsArr]);
  useEffect(() => {}, [removeOnclick]);
  useEffect(() => {
    if (orderId.length < 5) {
      return;
    }

    const orderUrl = `${API_BASE_URL}/api/orders/${orderId}`;

    const fetchOrderData = async (orderUrl) => {
      try {
        const orderResponse = await axios.get(orderUrl);
        const {
          xmldata: { Orders },
        } = orderResponse.data;
        console.log(Orders[0], '***Orders[0]***');
        //console.log(rerenderOrderList, '***rerenderOrderList***');
        if (Orders && Orders[0] && Orders?.[0]?.OrderDetails?.length > 0) {
          setOrderClientAddress(Orders[0]);

          const productCodes =
            Orders[0].OrderDetails?.map((item) => item.ProductCode?.[0]) || [];
          //console.log(productCodes, '*** product codes ***');

          const productDetails =
            Orders[0].OrderDetails?.flatMap((item) => {
              // Base product
              const baseProduct = {
                productCode: item.ProductCode?.[0] || 'UnknownCode',
                productPrice: item.ProductPrice?.[0] || 'UnknownPrice',
                productName: item.ProductName?.[0] || 'UnknownProductName',
                Quantity: item.Quantity?.[0] || '0',
              };
              return baseProduct;
            }) || [];
          
          // small helper to safely coerce array|string|number -> number
          const num = (v, def = 0) => {
            const raw = Array.isArray(v) ? v[0] : v;
            const n = parseInt(String(raw ?? ''), 10);
            return Number.isFinite(n) ? n : def;
          };

          const productOption =
            Orders?.[0]?.OrderDetails?.flatMap((item) => {
              // parent line qty (3 in your screenshot)
              const parentQty = num(item?.Quantity, 1) || 1;
              const optionIDs =
                item?.OrderDetails_Options?.map((o) => o?.OptionID?.[0]) ?? [];

              const extraProducts = optionIDs
                .map((id) => {
                  const opt = OPTION_DATA.find(
                    (o) => o.id === parseInt(String(id), 10),
                  );
                  if (!opt) return null;

                  // base qty defined in OPTION_DATA (e.g., 2 for "Ship in 2 x CA700 Cases")
                  const baseQtyPerProduct = num(opt.quantity, 1) || 1;

                  // For composite products, always multiply by parent quantity
                  // unless explicitly marked as absolute
                  const finalQty = opt.absoluteQty
                    ? baseQtyPerProduct
                    : parentQty * baseQtyPerProduct;

                  console.log(`Processing option ${opt.ProductCode}: parentQty=${parentQty}, baseQty=${baseQtyPerProduct}, finalQty=${finalQty}`);

                  return {
                    ProductCode: [opt.ProductCode || 'UnknownProduct'],
                    ProductName: [
                      opt.optiondesc || opt.ProductName || 'UnknownOption',
                    ],
                    ProductPrice: [
                      (opt.pricediff ?? opt.Vendor_Price ?? 0).toString(),
                    ],
                    Quantity: [finalQty.toString()], // <-- correct quantity here
                    Vendor_PartNo: [opt.Vendor_PartNo || 'Unknown'],
                    Vendor_Price: [
                      (opt.vendorpricediff ?? opt.Vendor_Price ?? 0).toString(),
                    ],
                    discount: [opt.discount ?? 15],
                  };
                })
                .filter(Boolean);

              return extraProducts;
            }) ?? [];

          console.log(productOption, '&&&productOption&&&');
          //
          //console.log(productOption, '***productOption***')
          if (Array.isArray(productOption) && productOption.length > 0) {
            setProductOptionsArr(productOption);
          }
          const filteredProductOption = Array.isArray(productOption)
            ? productOption.filter((item) => Object.keys(item).length > 0)
            : [];
          console.log(filteredProductOption, '***filteredProductOption***');

          // Options whose Vendor_PartNo contains "+" (e.g. OCE+SW-G, OCX+SW-G) are combined
          // kits: fetch ProductCode so extractVendorKits can read Google_Age_Group. Other
          // options keep the previous behavior (no extra product fetch by option ProductCode).
          const optionVp = (item) =>
            Array.isArray(item?.Vendor_PartNo)
              ? item.Vendor_PartNo[0]
              : item?.Vendor_PartNo;
          const optionPc = (item) =>
            Array.isArray(item?.ProductCode)
              ? item.ProductCode[0]
              : item?.ProductCode;
          const isCombinedKitVendorPart = (vp) =>
            String(vp || '').trim().includes('+');
          const extraKitProductCodesFromOptions = filteredProductOption
            .filter(
              (item) =>
                isCombinedKitVendorPart(optionVp(item)) &&
                String(optionPc(item) || '').trim(),
            )
            .map((item) => String(optionPc(item)).trim());

          const combinedOrderDetails =
            filteredProductOption.length > 0
              ? [...Orders[0].OrderDetails, ...filteredProductOption]
              : Orders[0].OrderDetails;
          //console.log(combinedOrderDetails, 'combinedOrderDetails');
          const optionOrderProducts = combinedOrderDetails.filter(
            (item) => !item.hasOwnProperty('OrderDetailID'),
          );
          setoptionProducts(optionOrderProducts);
          // Fetch product URLs and process vendors (include option ProductCodes for "+" combined kits)
          const mergedProductCodes = (() => {
            const seen = new Set();
            const out = [];
            for (const c of [
              ...productCodes,
              ...extraKitProductCodesFromOptions,
            ]) {
              const s = String(c || '').trim();
              if (!s) continue;
              const low = s.toLowerCase();
              if (seen.has(low)) continue;
              seen.add(low);
              out.push(s);
            }
            return out;
          })();

          const productUrls = mergedProductCodes.map(
            (code) =>
              `${API_BASE_URL}/api/products/${code.replace(/[\/,|@]/g, '-')}`, // for custom orders
          );
          const productResponses = await fetchProductData(
            productUrls,
            'product',
          );
          console.log(productResponses, '***productResponses***');
          // Extract existing product codes as a flat array, ensuring unique entries
          const existingProductCodes = new Set(
            productResponses.flatMap((response) =>
              (response.data?.xmldata?.Products || []).map((product) =>
                product.ProductCode[0].trim().toLowerCase(),
              ),
            ),
          );
          //console.log(existingProductCodes, 'existingProductCodes');
          const nonExistingCustomProducts = productDetails.filter((detail) => {
            const productCode = detail.productCode.trim().toLowerCase();
            return !existingProductCodes.has(productCode);
          });
          //console.log(nonExistingCustomProducts,'nonExistingCustomProducts');
          setUserCustomProducts(nonExistingCustomProducts);

          console.log(productResponses, '****productResponses');
          console.log(combinedOrderDetails, '***combinedOrderDetails');
          // Build a quantity lookup by ProductCode.
          // Important: the same ProductCode can appear multiple times (base lines + options, etc).
          // We must SUM quantities instead of overwriting, otherwise Split Products will
          // "randomly" drop quantities depending on row order.
          const quantityMap = combinedOrderDetails.reduce((acc, order) => {
            const codeRaw = Array.isArray(order?.ProductCode)
              ? order.ProductCode[0]
              : order?.ProductCode;
            if (!codeRaw) return acc;

            const key = String(codeRaw).trim().toLowerCase();
            const qRaw = Array.isArray(order?.Quantity)
              ? order.Quantity[0]
              : order?.Quantity;
            const q = parseInt(String(qRaw ?? ''), 10);
            const qty = Number.isFinite(q) ? q : 0;

            acc[key] = (acc[key] || 0) + qty;
            return acc;
          }, {});
          setItemQuantityMap(quantityMap);
          console.log(quantityMap, itemQuantityMap, 'quantityMap');
          // Step 2: Map through productResponses to add the Quantity for each product.
          const updatedProductResponses = productResponses.map((response) => {
            const productsArray = Array.isArray(
              response.data?.xmldata?.Products,
            )
              ? response.data.xmldata.Products
              : [response.data.xmldata.Products];

            //console.log(productsArray, 'productsArray');
            const updatedProducts = productsArray
              .map((product) => {
                if (!product) {
                  return null;
                }
                // Ensure that product.ProductCode exists and is an array
                const productCode = Array.isArray(product.ProductCode)
                  ? product.ProductCode[0].toLowerCase()
                  : null;
                const matchingAlert = ALERTS.find(
                  (alert) => alert.id.toLowerCase() === productCode,
                );

                if (matchingAlert) {
                  alert(
                    `ID: ${matchingAlert.id}\nNote: ${matchingAlert.note} !!!`,
                  );
                }
                // Look up the quantity using the product code
                //const quantity = productCode ? quantityMap[productCode] || null : null
                const quantity = productCode ? quantityMap[productCode] ?? null : null;
                console.log(productCode, '!!! productCode !!!');
                console.log(quantityMap, '!!! quantityMap !!!');
                console.log(quantity, '!!! quantity !!!');
                return { ...product, Quantity: [quantity] };
              })
              // Filter out any null results
              .filter((product) => product !== null);
            console.log(updatedProducts, '***updatedProducts***');
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
            };
          });

          console.log(updatedProductResponses, 'updatedProductResponses');

          const vendorKits = extractVendorKits(updatedProductResponses);
          console.log(vendorKits, '***vendorKits***');
          //console.log(vendorKits.length, '***vendorKits.length***') // does not call
          setVendorKitsLenght(vendorKits.length);
          //console.log(vendorKits, '!!!vendorKits!!!')
          if (vendorKits.length > 1) {
            // setShowVendorKitPopup(true)
            setVendorKitItem(vendorKits);
          }

          const validVendors = await processProductResponses(
            //productResponses,
            updatedProductResponses,
            combinedOrderDetails,
          );
          //console.log(validVendors, '***validVendors***')
          //console.log(combinedOrderDetails, '***combinedOrderDetails***')
          //console.log(optionOrderProducts, 'optionOrderProducts');
          updateVendorState(validVendors);
          updateOrderListWithVendorCodes(combinedOrderDetails, validVendors);
          processOrderDetails(Orders[0]);
          setOrderProductDetails(combinedOrderDetails);
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    const extractVendorKits = (productResponses) => {
      console.log(productResponses, 'productResponses extractVendorKits');
      let alertShown = false; // Flag to track if the alert has been shown
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
      ];
      //console.log(mergedItems, '****mergedItems')
      return mergedItems.flatMap((item, index) => {
        const { xmldata: { Products } = {} } = item.data;
        if (!Array.isArray(Products) || Products.length === 0) {
          console.warn(`Invalid Products at index ${index}`);
          return [];
        }
        return Products.flatMap((product) => {
          console.log(product, 'product.Quantity');
          if (Array.isArray(product.Google_Age_Group)) {
            return product.Google_Age_Group.flatMap((group) => {
              // Split the group string into its parts
              return group.split(' // ').map((g) => ({
                ProductCode: product.ProductCode[0],
                Quantity: product.Quantity ? product.Quantity[0] : null,
                Google_Age_Group: g,
              }));
            });
          }
          return [];
        });

      });
    };

    const fetchKitData = async (kitUrls) => {
      try {
        const kitResponses = await Promise.all(
          kitUrls.map((url) => axios.get(url)),
        );
        const kitVendors = processProductResponses(kitResponses);
        replaceQuantities(kitVendors, quantityItemObject); // update quantity
        updateVendorState(kitVendors);
        applyDiscounts(kitVendors);
      } catch (error) {
        console.error('Error fetching kit data:', error);
      }
    };

    let quantityItemObject = [];
    
    const compareProductPrices = (products, orderProductDetails) => {
      const productPriceMap = {};
      //console.log(products, '<< products');
      // Create a lookup map for product prices based on ProductCode
      products.forEach((product) => {
        const productCode = product.ProductCode[0];
        const productPrice = product.ProductPrice[0];
        productPriceMap[productCode] = productPrice;
      });

      // Compare the prices
      const mismatchedPrices = orderProductDetails.filter((orderProduct) => {
        const productCode = orderProduct.productCode;
        const orderProductPrice = orderProduct.productPrice;
        const productPrice = productPriceMap[productCode];

        return productPrice && productPrice !== orderProductPrice;
      });

      return mismatchedPrices;
    };

    const processProductResponses = async (
      productResponses,
      orderProductDetails,
    ) => {
      const vendors = productResponses.map((response) => {
        // Handle cases where xmldata might be undefined or an empty string
        const xmldata = response.data.xmldata || {};
        const Products = xmldata.Products || [];

        if (!Products.length) {
          console.log('No Products found in response');
          return null;
        }
        // Compare product prices
        const mismatchedPrices = compareProductPrices(
          Products,
          orderProductDetails,
        );
        if (mismatchedPrices.length > 0) {
          mismatchedPrices.forEach((item) => {
            setMismatchedPrices(mismatchedPrices);
            setShowModal(true);
          });
        } else {
          console.log('All product prices match.');
        }

        // Process the product details
        const product = Products[0];
        let vendorPartNo = product.Vendor_PartNo
          ? product.Vendor_PartNo[0]
          : '';
        // Check if ProductCode starts with 'or', 'OR', 'Or', or 'oR'
        const productCode = product.ProductCode ? product.ProductCode[0] : '';
        if (/^or$/i.test(productCode.substring(0, 2))) {
          vendorPartNo = product.Google_Age_Group
            ? product.Google_Age_Group[0]
            : vendorPartNo;
        }
        console.log(product);
        return {
          Vendor_PartNo: [vendorPartNo],
          ProductCode: [productCode],
          ProductName: [product.ProductName ? product.ProductName[0] : ''],
          ProductPrice: [product.ProductPrice ? product.ProductPrice[0] : ''],
          Vendor_Price: [product.Vendor_Price ? product.Vendor_Price[0] : ''],
          Quantity: [product.Quantity ? product.Quantity[0] : ''],
        };
      });
      return vendors.filter((vendor) => vendor !== null);
    };

    const replaceQuantities = (products, replacements) => {
      products.forEach((product) => {
        const code = product.ProductCode[0];
        if (replacements.hasOwnProperty(code)) {
          product.Quantity = [replacements[code]];
        }
      });
    };

    const updateVendorState = (validVendors) => {
      //console.log(validVendors, 'validVendors')
      setVendor((prevVendor) => [...prevVendor, ...validVendors]);
      setRerenderOrderList(validVendors);
    };

    const updateOrderListWithVendorCodes = (orderDetails, validVendors) => {
      const updatedOrderWithVendorCodes = orderDetails.map((order) => {
        const matchingVendor = validVendors.find(
          (vendor) =>
            vendor.ProductCode[0].toLowerCase() ===
            order.ProductCode[0].toLowerCase(),
        );
        //console.log(matchingVendor, 'matchingVendor')
        return matchingVendor ? { ...order, ...matchingVendor } : order;
      });
      //console.log(updatedOrderWithVendorCodes, '***updatedOrderWithVendorCodes***');
      setRerenderOrderList(updatedOrderWithVendorCodes);
      applyDiscounts(updatedOrderWithVendorCodes);
    };

    const applyDiscounts = (orderList) => {
      orderList.forEach((order) => {
        //console.log(order, '***order applyDiscounts')
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
      const customFieldInHandDate =
        order.Custom_Field_InHand && order.Custom_Field_InHand[0]
          ? order.Custom_Field_InHand[0]
          : 'Not Found';
      const orderComments =
        order.Order_Comments && order.Order_Comments[0]
          ? order.Order_Comments[0]
          : 'Not Found';
      setCustomFieldInHand(customFieldInHandDate);
      setOrderComments(orderComments);
    };

    // Call the function with your order URL
    fetchOrderData(orderUrl);
  }, [orderId, discountRenderFlag, vendorKitsLenght]);

  // Log updated orderClientAddress
  useEffect(() => {
    console.log(orderClientAddress);
  }, [orderClientAddress]);

  const fetchProductData = async (productUrls, type) => {
    try {
      return await Promise.all(
        productUrls.map((url) => axios.get(url, { params: { type } })),
      );
    } catch (error) {
      console.error('Error fetching product data:', error);
      return [];
    }
  };

  // method to transform data in handleConfirmSplit
  const transformUpdatedProductsToUserCustomFormat = (val) => {
    return val.map((product) => {
      const qRaw = product?.Quantity;
      const q =
        qRaw == null || qRaw === '' || qRaw === 'undefined'
          ? '1'
          : Array.isArray(qRaw)
            ? (qRaw[0] ?? '1')
            : qRaw;
      return {
        Quantity: [String(q)],
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
      };
    });
  };

  const mergeDuplicatedProducts = (products) => {
    console.log(products, '***products mergeDuplicatedProducts ***');
    return products.reduce((acc, product) => {
      // Extract and normalize ProductCode safely
      const productCode = JSON.stringify(product.ProductCode)
        .trim()
        .toLowerCase();
      // add discount
      VENDOR_LIST.forEach((vendor) => {
        const code = Array.isArray(product.ProductCode)
          ? product.ProductCode[0].trim().toLowerCase()
          : product.ProductCode.trim().toLowerCase();

        if (code.toLowerCase().startsWith(vendor.code)) {
          product.discount = [vendor.discount];
        }
      });

      if (!productCode) {
        console.warn('Skipping product with missing ProductCode:', product);
        return acc;
      }

      // Find an existing product with the same ProductCode
      const existingProduct = acc.find((p) => {
        const existingCode = JSON.stringify(p.ProductCode).trim().toLowerCase();
        return existingCode === productCode;
      });

      if (existingProduct) {
        // Merge Quantity Safely
        const existingQuantity = parseInt(
          existingProduct.Quantity?.[0] || '1',
          10,
        );
        const newQuantity = parseInt(product.Quantity?.[0] || '1', 10);
        const totalQuantity = existingQuantity + newQuantity;
        existingProduct.Quantity = [totalQuantity.toString()];

        // Fix Vendor_Price NaN issue
        const existingVendorPrice =
          parseFloat(existingProduct.Vendor_Price?.[0]) || 0;
        const newVendorPrice = parseFloat(product.Vendor_Price?.[0]) || 0;

        if (existingVendorPrice > 0 && newVendorPrice > 0) {
          const totalVendorCost =
            existingVendorPrice * existingQuantity +
            newVendorPrice * newQuantity;
          existingProduct.Vendor_Price[0] = (
            totalVendorCost / totalQuantity
          ).toFixed(2);
        } else {
          existingProduct.Vendor_Price[0] = (
            existingVendorPrice || newVendorPrice
          ).toString();
        }
      } else {
        acc.push({ ...product, Quantity: product.Quantity || ['1'] });
      }

      return acc;
    }, []);
  };

  const handleConfirmSplit = async () => {
    if (!itemQuantityMap || !productOptionsArr) {
      console.warn(
        'Split aborted: missing itemQuantityMap or productOptionsArr',
        itemQuantityMap,
        productOptionsArr,
      );
      setShowVendorKitPopup(false);
      return;
    }

    const ensureQtyArray = (v, fallback = '1') => {
      const raw = Array.isArray(v) ? v[0] : v;
      if (raw == null) return [fallback];
      const s = String(raw).trim();
      return s && s !== 'undefined' && s !== 'null' ? [s] : [fallback];
    };

    const updatedOptions = productOptionsArr.map((item) => {
      const productCode = Array.isArray(item.ProductCode)
        ? item.ProductCode[0]
        : item.ProductCode;
      const productCodeKey = Object.keys(itemQuantityMap).find(
        (key) => key.toLowerCase() === productCode.toLowerCase(),
      );
      if (productCodeKey) {
        console.log(
          `Updating Quantity for ${productCode} to`,
          itemQuantityMap[productCodeKey],
        );
        return {
          ...item,
          Quantity: [String(itemQuantityMap[productCodeKey])],
        };
      } else {
        console.log(`ProductCode ${productCode} not found in itemQuantityMap - keeping original quantity:`, item.Quantity);
        return { ...item, Quantity: ensureQtyArray(item.Quantity) };
      }
    });
    setUpdatedOptionsArr(updatedOptions);
    console.log(updatedOptions, updatedOptionsArr, '***updatedOptions');

    //setProductOptionsArr(updatedOptions);
    console.log(productOptionsArr, '**productOptionsArr*');
    const vendorKitCodes = updatedOptions.map((item) => item.Vendor_PartNo);
    console.log(vendorKitCodes, '***vendorKitCodes***');
    // update quantity splitted kits
    const vendorKitItemsWithQty = (vendorKitItem || []).map((vk) => {
      const productCodeKey = Object.keys(itemQuantityMap).find(
        (key) => key.toLowerCase() === vk.ProductCode.toLowerCase(),
      );
      const qty = productCodeKey ? itemQuantityMap[productCodeKey] : null;
      return {
        ...vk,
        Quantity: qty != null ? String(qty) : (Array.isArray(vk.Quantity) ? (vk.Quantity[0] ?? '1') : (vk.Quantity ?? '1')),
      };
    });
    console.log(vendorKitItemsWithQty, '***vendorKitItemsWithQty***');

    const googleAgeGroups = vendorKitItemsWithQty.map(
      (item) => item.Google_Age_Group,
    );
    console.log(googleAgeGroups, 'googleAgeGroups');
    const normalizeToken = (t) => String(t || '').trim().toLowerCase();
    const combinedOptionsAndKits = [
      ...new Set(
        [...vendorKitCodes, ...googleAgeGroups]
          .flatMap((x) => (Array.isArray(x) ? x : [x]))
          .map((x) => String(x || '').trim())
          .filter(Boolean),
      ),
    ];
    console.log(combinedOptionsAndKits, '***combinedOptionsAndKits (deduped)***');

    const vendorUrls = combinedOptionsAndKits.map(
      (code) => `${API_BASE_URL}/api/vendors/${code}`,
    );
    console.log(vendorUrls, 'vendorUrls');
    const vendorResponses = await fetchProductData(vendorUrls, 'vendor');
    //console.log(vendorResponses, '***vendorResponses');
    let updatedProducts = vendorResponses.flatMap((item) => {
      console.log(item.data, '***item data***');
      const { xmldata: { Products } = {} } = item.data || {};
      return Products || [];
    });

    // Some vendors return additional decomposition hints in Google_Age_Group on the vendor products themselves
    // (ex: pe7135 has "XV5s // cardboard_box // cardboard_box").
    // Ensure we also fetch vendor products for any discovered tokens so they appear in the split list.
    const splitGroupTokens = (grp) =>
      String(grp || '')
        .split(/\s*\/\/\s*/g) // tolerate inconsistent spacing around //
        .map(normalizeToken)
        .filter(Boolean);
    const alreadyRequested = new Set(
      combinedOptionsAndKits
        .flatMap((x) => (Array.isArray(x) ? x : [x]))
        .map(normalizeToken)
        .filter(Boolean),
    );

    const discoveredTokens = new Set();
    updatedProducts.forEach((p) => {
      (p.Google_Age_Group || []).forEach((grp) => {
        splitGroupTokens(grp).forEach((tok) => discoveredTokens.add(tok));
      });
    });

    const extraTokens = [...discoveredTokens].filter(
      (tok) => tok && !alreadyRequested.has(tok),
    );
    if (extraTokens.length) {
      const extraUrls = extraTokens.map(
        (tok) => `${API_BASE_URL}/api/vendors/${tok}`,
      );
      console.log('Fetching extra vendor tokens:', extraTokens);
      const extraResponses = await fetchProductData(extraUrls, 'vendor');
      const extraProducts = extraResponses.flatMap((item) => {
        const { xmldata: { Products } = {} } = item.data || {};
        return Products || [];
      });
      // Merge (avoid duplicate product codes)
      const seenCodes = new Set(updatedProducts.map((p) => normalizeToken(p?.ProductCode?.[0])));
      extraProducts.forEach((p) => {
        const code = normalizeToken(p?.ProductCode?.[0]);
        if (!code || seenCodes.has(code)) return;
        seenCodes.add(code);
        updatedProducts.push(p);
      });
    }

    // Guardrail: dedupe fetched products by ProductCode + Vendor_PartNo so
    // mergeDuplicatedProducts doesn't double-count the same item.
    const seenProductKeys = new Set();
    updatedProducts = updatedProducts.filter((p) => {
      const code = normalizeToken(p?.ProductCode?.[0]);
      const vp = normalizeToken(p?.Vendor_PartNo?.[0]);
      const key = `${code}::${vp}`;
      if (!code) return false;
      if (seenProductKeys.has(key)) return false;
      seenProductKeys.add(key);
      return true;
    });

    // Kit components: bundle (e.g. pe7130) splits into Vendor_PartNo entries (XV5s, XV5s-g).
    // Cardboard comes from pe7135's Google_Age_Group (ex: "XV5s // cardboard_box // cardboard_box")
    // so qty(cardboard_box) = count(cardboard_box tokens in pe7135 group) × totalQty(pe7135).
    const componentQtyFromKit = {};
    // Total pe7135 qty can come from:
    // - explicit order lines (itemQuantityMap['pe7135'])
    // - kit expansion tokens (vendorKitItemsWithQty where Google_Age_Group === 'XV5s')
    const pe7135FromOrder = Number(itemQuantityMap?.pe7135) || 0;
    const pe7135FromKit = vendorKitItemsWithQty
      .filter(
        (vk) =>
          vk.Google_Age_Group &&
          String(vk.Google_Age_Group).toLowerCase().trim() === 'xv5s',
      )
      .reduce((sum, vk) => sum + (parseInt(String(vk.Quantity ?? 0), 10) || 0), 0);
    const pe7135TotalQty = pe7135FromOrder + pe7135FromKit;

    const pe7135Vendor = updatedProducts.find(
      (p) => normalizeToken(p?.ProductCode?.[0]) === 'pe7135',
    );
    const cardboardPerPe7135 = (pe7135Vendor?.Google_Age_Group || []).reduce(
      (cnt, grp) =>
        cnt +
        splitGroupTokens(grp).filter((tok) => tok === 'cardboard_box').length,
      0,
    );
    updatedProducts.forEach((product) => {
      const code = String(product.ProductCode?.[0] ?? '').trim().toLowerCase();
      const vp = (product.Vendor_PartNo && product.Vendor_PartNo[0]) ? String(product.Vendor_PartNo[0]).trim().toLowerCase() : '';
      if (!code) return;
      if (vp === 'cardboard_box') {
        if (pe7135TotalQty > 0 && cardboardPerPe7135 > 0) {
          componentQtyFromKit[code] = cardboardPerPe7135 * pe7135TotalQty;
        }
        return;
      }
      // Sum kit rows for this vendor segment **per parent ProductCode**, then take max across parents.
      // Same parent + duplicate segment (e.g. LUM // LUM) → multiple rows, summed (qty 2).
      // Different parents each with one SPT-CASE → do not sum to 2 for one line; max keeps 1.
      // Ignore kit rows where the parent ProductCode is this same product: vendor XML
      // often repeats the line's Vendor_PartNo in Google_Age_Group, which would otherwise
      // add fromKit on top of itemQuantityMap and double qty (e.g. 2+2=4).
      const matchingKits = vendorKitItemsWithQty.filter(
        (vk) =>
          vk.Google_Age_Group &&
          String(vk.Google_Age_Group).toLowerCase().trim() === vp &&
          String(vk.ProductCode || '').trim().toLowerCase() !== code,
      );
      if (matchingKits.length) {
        const byParent = {};
        matchingKits.forEach((vk) => {
          const parent = String(vk.ProductCode || '').trim().toLowerCase();
          if (!parent) return;
          if (!byParent[parent]) byParent[parent] = [];
          byParent[parent].push(vk);
        });
        const perParentSums = Object.values(byParent).map((group) =>
          group.reduce(
            (sum, vk) => sum + (parseInt(String(vk.Quantity ?? 0), 10) || 0),
            0,
          ),
        );
        const qtySum =
          perParentSums.length > 0 ? Math.max(...perParentSums) : 0;
        componentQtyFromKit[code] = (componentQtyFromKit[code] || 0) + qtySum;
      }
    });
    console.log('componentQtyFromKit', componentQtyFromKit);

    const updatedProductsWithQuantity = updatedProducts.map((product) => {
      const productCode = product.ProductCode[0];
      const googleAgeGroup = product.Google_Age_Group?.[0] || null;
      const vendorPartNo = product.Vendor_PartNo?.[0] || '';

      console.log(
        `Processing Product: ${productCode} | Google_Age_Group: ${googleAgeGroup}`,
      );

      // 1) Match by ProductCode in options (case-insensitive; API may return PE8000 vs pe8000)
      const productCodeLower = String(productCode || '').trim().toLowerCase();
      let match = updatedOptions.find((option) => {
        const optCode = Array.isArray(option.ProductCode)
          ? option.ProductCode[0]
          : option.ProductCode;
        return String(optCode || '').trim().toLowerCase() === productCodeLower;
      });

      // 2) If no match by code, try vendorKitItem by Google_Age_Group
      if (!match && googleAgeGroup) {
        const idx = vendorKitItemsWithQty.findIndex(
          (vk) =>
            vk.Google_Age_Group &&
            String(vk.Google_Age_Group).toLowerCase().trim() ===
              String(googleAgeGroup).toLowerCase().trim(),
        );
        if (idx !== -1) match = vendorKitItemsWithQty[idx];
      }

      // 2b) Vendor API often returns products without Google_Age_Group; match by Vendor_PartNo to kit's Google_Age_Group
      if (!match && vendorPartNo) {
        const idx = vendorKitItemsWithQty.findIndex(
          (vk) =>
            vk.Google_Age_Group &&
            String(vk.Google_Age_Group).toLowerCase().trim() ===
              String(vendorPartNo).toLowerCase().trim(),
        );
        if (idx !== -1) match = vendorKitItemsWithQty[idx];
      }

      console.log(match, '!!!match!!!');

      // 3) Default quantity
      let quantity = ensureQtyArray(product.Quantity, '1');
      console.log(product.Quantity, 'quantity');
      
      // 4) If we found a match with a valid Quantity, use it
      if (match && match.Quantity != null) {
        quantity = ensureQtyArray(match.Quantity, '1');
      }
      
      // 5) Special case: If Vendor_PartNo contains "OP-LN", get quantity from parent product
      if (vendorPartNo.includes('OP-LN')) {
        console.log(`Processing OP-LN item:`, productCode, vendorPartNo);
        
        // Extract base vendor part number (everything before "-OP-LN")
        const baseVendorPartNo = vendorPartNo.split('-OP-LN')[0];
        console.log(`Base vendor part number:`, baseVendorPartNo);
        
        // Find the parent product in vendorKitItem whose Google_Age_Group starts with the base
        const parentKit = vendorKitItemsWithQty.find((vk) => 
          vk.Google_Age_Group && 
          vk.Google_Age_Group.toLowerCase().trim().startsWith(baseVendorPartNo.toLowerCase().trim())
        );
        
        if (parentKit && parentKit.ProductCode) {
          console.log(`Found parent kit:`, parentKit);
          // Look up quantity using the parent's ProductCode
          const productCodeKey = Object.keys(itemQuantityMap).find(
            (key) => key.toLowerCase() === parentKit.ProductCode.toLowerCase(),
          );
          
          if (productCodeKey) {
            const kitQuantity = itemQuantityMap[productCodeKey];
            quantity = [String(kitQuantity)];
            console.log(`OP-LN detected! Parent product: ${parentKit.ProductCode}, Setting quantity to: ${kitQuantity}`);
          } else {
            console.log(`Parent ProductCode ${parentKit.ProductCode} not found in itemQuantityMap`);
            console.log(`Available keys:`, Object.keys(itemQuantityMap));
          }
        } else {
          console.log(`Parent kit with Google_Age_Group starting with "${baseVendorPartNo}" not found in vendorKitItem`);
        }
      }

      // 6) Total = order lines (itemQuantityMap) + kit components (componentQtyFromKit).
      // e.g. pe7131: 1 standalone + 2 from pe7130 bundle = 3; pe7135: 0 + 2 from bundle = 2.
      // cardboard_box: sum of all kit segments "cardboard_box" (e.g. 2+2=4 from "XV5s // cardboard_box // cardboard_box").
      const fromOrder = Number(itemQuantityMap[productCodeLower]) || 0;
      const fromKit = Number(componentQtyFromKit[productCodeLower]) || 0;
      const totalQty = fromOrder + fromKit;
      if (totalQty > 0) {
        quantity = [String(totalQty)];
        console.log(`Quantity for ${productCode}: order=${fromOrder} + kit=${fromKit} =>`, quantity);
      }

      console.log(product.Vendor_PartNo, 'product.Vendor_PartNo');
      console.log(`Final Quantity for ${productCode}:`, quantity);

      // 7) Return product with resolved quantity
      return {
        ...product,
        Quantity: quantity,
      };
    });

    const manualEntry = Array.isArray(updatedOptionsArr)
      ? updatedOptionsArr.find(
          (option) => option?.Vendor_PartNo?.[0] === 'manually',
        )
      : null;

    // 3) If manualEntry exists, push it exactly once
    if (manualEntry) {
      console.log('Adding manualEntry product:', manualEntry);
      updatedProductsWithQuantity.push({
        ProductCode: manualEntry.ProductCode,
        ProductName: manualEntry.ProductName,
        ProductPrice: manualEntry.ProductPrice,
        Vendor_PartNo: manualEntry.Vendor_PartNo,
        Vendor_Price: manualEntry.Vendor_Price,
        Quantity: manualEntry.Quantity || ['1'],
      });
    }

    // 3b) Reduce hardware vendor cost by (cardboard cost × cardboard qty). If 48.25.T is present, also remove cardboard from list.
    const cardboardIdx = updatedProductsWithQuantity.findIndex(
      (p) => String(p.Vendor_PartNo?.[0] || '').toLowerCase().trim() === 'cardboard_box',
    );
    if (cardboardIdx !== -1) {
      const cardboard = updatedProductsWithQuantity[cardboardIdx];
      const cardboardQty = parseInt(String(cardboard.Quantity?.[0] ?? 0), 10) || 0;
      const cardboardUnitCost = parseFloat(String(cardboard.Vendor_Price?.[0] ?? 0)) || 0;
      // Hardware: ProductCode starts with "pe" and ends with "5" (e.g. pe7135, pe7115, pe7145)
      const hardware = updatedProductsWithQuantity.find((p) => {
        const code = String(p.ProductCode?.[0] || '').trim().toLowerCase();
        return code.startsWith('pe') && code.endsWith('5');
      });
      if (hardware) {
        const hwQtyRaw = parseInt(String(hardware.Quantity?.[0] ?? 0), 10);
        const hwQty = Number.isFinite(hwQtyRaw) ? hwQtyRaw : 0;
        const hwCurrent = parseFloat(String(hardware.Vendor_Price?.[0] ?? 0)) || 0;
        // Total $ to pull out of hardware: unit cardboard cost × count of deductions.
        // Use max(cardboard line qty, hardware qty) so e.g. $50 × 2 hardware = $100 when cardboard row still shows qty 1.
        const deductionCount =
          hwQty > 0 ? Math.max(cardboardQty, hwQty) : cardboardQty;
        const reduction = cardboardUnitCost * deductionCount;

        // Zero/invalid quantity must render as $0.00, never empty.
        if (hwQty <= 0) {
          hardware.Vendor_Price = ['0.00'];
        } else if (reduction > 0) {
          const hwNewUnit = (hwCurrent * hwQty - reduction) / hwQty;
          hardware.Vendor_Price = [String(Math.max(0, hwNewUnit).toFixed(2))];
          console.log('Hardware vendor cost reduced by cardboard (cost × deductionCount):', reduction);
        } else if (!hardware.Vendor_Price?.[0]) {
          // Keep UI consistent: prefer explicit zero over empty value.
          hardware.Vendor_Price = ['0.00'];
        }
      }
      const hasCase4825T = updatedProductsWithQuantity.some(
        (p) => String(p.Vendor_PartNo?.[0] || '').trim() === '48.25.T',
      );
      if (hasCase4825T) {
        updatedProductsWithQuantity.splice(cardboardIdx, 1);
        console.log('48.25.T present: removed cardboard from list');
      }
    }

    // 4) Now you have ONE array with no duplicates
    console.log(
      updatedProductsWithQuantity,
      '<< Final updatedProductsWithQuantity',
    );

    console.log(updatedProducts, '|| updatedProducts');
    console.log(updatedProductsWithQuantity, '|| updatedProductsWithQuantity');
    console.log(productOptionsArr, '***productOptionsArr***');

    const mergedProducts = mergeDuplicatedProducts(updatedProductsWithQuantity);
    console.log(mergedProducts, '***mergedProducts***');
    // Define keys to copy from old rerenderOrderList
    const keysToCopy = ['OrderDetailID', 'Quantity', 'TotalPrice', 'discount'];
    const updatedOrderList = mergedProducts.map((product) => {
      //console.log(product,'product');
      let source =
        rerenderOrderList.find(
          (item) => item.ProductName[0] === product.ProductName[0],
        ) ||
        rerenderOrderList[0] ||
        {};
      //console.log(source,'source');
      // set Quantity value
      if (source && product.Quantity && product.Quantity.length) {
        source.Quantity = [product.Quantity[0]];
      }

      // Copy specified keys
      const copiedData = keysToCopy.reduce((acc, key) => {
        if (source[key]) {
          acc[key] = source[key];
        }
        return acc;
      }, {});

      return {
        ...product,
        ...copiedData,
      };
    });
    console.log(updatedOrderList, 'updatedOrderList');
    const normalizedUpdatedProducts =
      transformUpdatedProductsToUserCustomFormat(userCustomProducts);
    console.log(normalizedUpdatedProducts, 'normalizedUpdatedProducts');

    // ProductCodes already produced by the split (e.g. or6700 from kit) — do not also keep
    // the same ProductCode from optionProducts or userCustomProducts, or mergeDuplicatedProducts
    // will sum qty (7+7=14).
    const splitProductCodes = new Set(
      mergedProducts.map((p) =>
        String(
          Array.isArray(p?.ProductCode) ? p.ProductCode[0] : p?.ProductCode || '',
        )
          .trim()
          .toLowerCase(),
      ).filter(Boolean),
    );

    const productCodeKey = (item) => {
      const pc = Array.isArray(item?.ProductCode)
        ? item.ProductCode[0]
        : item?.ProductCode;
      return String(pc || '').trim().toLowerCase();
    };

    // Custom rows that duplicate a split line would double quantity when mergeDuplicatedProducts runs.
    const normalizedUpdatedProductsDeduped = normalizedUpdatedProducts.filter(
      (item) => {
        const code = productCodeKey(item);
        return !(code && splitProductCodes.has(code));
      },
    );

    // After split: drop "+" combined bundle lines; drop option rows that duplicate a split line.
    const optionProductsAfterSplit = (Array.isArray(optionProducts)
      ? optionProducts
      : []
    ).filter((item) => {
      const vp = Array.isArray(item?.Vendor_PartNo)
        ? item.Vendor_PartNo[0]
        : item?.Vendor_PartNo;
      if (String(vp || '').trim().includes('+')) return false;
      const code = productCodeKey(item);
      if (code && splitProductCodes.has(code)) return false;
      return true;
    });

    const modOrderListRaw = [
      ...normalizedUpdatedProductsDeduped,
      ...updatedOrderList.flat(Infinity),
      ...optionProductsAfterSplit,
    ];
    // Re-merge to avoid duplicate rows after adding optionProducts back.
    const modOrderList = mergeDuplicatedProducts(modOrderListRaw);
    console.log(modOrderList, 'modOrderList');
    setRerenderOrderList(modOrderList);

    // Log for debugging
    //console.log(updatedOrderList, '***Updated rerenderOrderList***');

    // Close the popup
    setShowVendorKitPopup(false);
  };

  const handleCancelSplit = () => {
    console.log('Canceled splitting products.');
    setShowVendorKitPopup(false);
  };

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
  );
}

export default OrderFreight;
