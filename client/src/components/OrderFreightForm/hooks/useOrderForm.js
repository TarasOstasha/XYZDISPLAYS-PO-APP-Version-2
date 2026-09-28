import { useState, useEffect } from 'react';
import { openOutlookDraft, saveOrder } from '../../../api';
import { VENDOR_LIST } from '../../../utils/vendorsData';

export const useOrderForm = ({
  rerenderOrderList,
  setOrderId,
  handleFormValuesChange,
  setVendorAddress,
  setShipInfoDescription,
  setCustomFieldInHand,
  setCustomFieldInHand1,
  setOrderComments
}) => {
  const [selectedVendor, setSelectedVendorCode] = useState(false);
  const [checkByVendor, setCheckByVendor] = useState(false);
  const [checkboxFilteredIndex, setCheckboxFilteredIndex] = useState([]);
  const [hideButton, setHideButton] = useState(false);
  const [isNeededDiscountNotes, setIsNeededDiscountNotes] = useState(false);
  const [shipInfo, setShipInfo] = useState('');

  const initialValues = {
    po: '',
    date: new Date().toISOString().split('T')[0],
    ship: '',
    shipInfoDescription: '',
    inHand: '',
    vendor: '',
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
    webPrice: '',
    vendorPrice: '',
    productPrice: '',
    productDiscount: '',
    productPriceWithDiscount: '',
    totalAmount: '',
    isChecked: false,
    selectedItems: Array(rerenderOrderList.length).fill(false),
    productTableData: [],
    vendorEmails: [],
  };

  const handleSubmit = async (values, formikBag) => {
    const checkIfCustom = rerenderOrderList.some((item) => {
      return typeof item.discount === 'undefined';
    });
    
    if (checkIfCustom) {
      alert('Please Remove Custom Items!!!');
      return;
    }

    values.shipTo = document.getElementById('shipTo').innerText;
    values.vendorAddress = document.getElementById('vendorAddress').innerText;
    values.ship = document.getElementById('ship').value;
    values.shipInfoDescription = document.getElementById('shipInfoBottom').innerText;
    values.vendorEmails = renderEmails();
    values.inHand = setCustomFieldInHand;

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
        };
      });
      values.productTableData.push(updatedValues);
    } else {
      values.productTableData.push(...rerenderOrderList);
    }

    const { data: orderData } = await saveOrder(values);

    if (orderData?.email) {
      try {
        await openOutlookDraft(orderData.email);
      } catch (err) {
        console.error('Outlook helper error:', err);
        window.alert(
          'Could not open Outlook.\n\n' +
            'Start the XYZ Outlook Helper on this PC (outlook-helper\\Start-OutlookHelper.bat),\n' +
            'then try again.\n\n' +
            (err?.message || '')
        );
      }
    }

    values.productTableData.splice(0, values.productTableData.length);
    console.log(values.productCode, '<< values');
  };

  const renderShipInfoInput = () => {
    const pcode = rerenderOrderList[0]?.ProductCode[0]?.toLowerCase();
    const vendor = VENDOR_LIST.find((vendor) => pcode?.startsWith(vendor.code));
    return vendor ? vendor.shipInfo : '';
  };

  const renderShipInfoBottom = () => {
    const pcode = rerenderOrderList[0]?.ProductCode[0]?.toLowerCase();
    return rerenderOrderList &&
      rerenderOrderList.length > 0 &&
      VENDOR_LIST.find((vendor) => pcode?.startsWith(vendor.code))
      ? VENDOR_LIST.find((vendor) => pcode?.startsWith(vendor.code))
          .shipInfoDescription.split('\n')
          .map((line, index) => <div key={index}>{line}</div>)
      : 'Not Found';
  };

  const renderVendorAddress = () => {
    const pcode = rerenderOrderList[0]?.ProductCode[0]?.toLowerCase();
    return rerenderOrderList &&
      rerenderOrderList.length > 0 &&
      VENDOR_LIST.find((vendor) => pcode?.startsWith(vendor.code))
      ? VENDOR_LIST.find((vendor) => pcode?.startsWith(vendor.code))
          .address.split('\n')
          .map((line, index) => <div key={index}>{line}</div>)
      : 'Not Found';
  };

  const renderEmails = () => {
    const pcode = rerenderOrderList[0]?.ProductCode[0]?.toLowerCase();
    return rerenderOrderList &&
      rerenderOrderList.length > 0 &&
      VENDOR_LIST.find((vendor) => pcode?.startsWith(vendor.code))
      ? VENDOR_LIST.find((vendor) => pcode?.startsWith(vendor.code)).email
      : 'Not Found';
  };

  useEffect(() => {
    const initialShipInfo = renderShipInfoInput();
    setShipInfo(initialShipInfo);
  }, [rerenderOrderList]);

  return {
    initialValues,
    handleSubmit,
    selectedVendor,
    setSelectedVendorCode,
    checkByVendor,
    setCheckByVendor,
    checkboxFilteredIndex,
    setCheckboxFilteredIndex,
    hideButton,
    setHideButton,
    isNeededDiscountNotes,
    setIsNeededDiscountNotes,
    shipInfo,
    setShipInfo,
    renderShipInfoInput,
    renderShipInfoBottom,
    renderVendorAddress,
    renderEmails
  };
};
