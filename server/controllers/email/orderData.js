module.exports.orderData = (productTableData) => {
    const grandTotal = productTableData.reduce((acc, p) => {
        const discountDecimal = p.discount;
        if (discountDecimal > 0) {
            const discountDecimalPercentage = discountDecimal / 100; // Convert percentage to decimal
            return acc + parseFloat(p.Quantity * (p.Vendor_Price * (1 - discountDecimalPercentage)));
        } else {
            return acc + parseFloat(p.Quantity * p.Vendor_Price);
        }
    }, 0).toFixed(2);
    return `
        <table style="width: 100%;border: 2px solid;">
            <tbody>
                <tr>
                    <td style="font-weight: bold;width:20%;">Item</td>
                    <td style="font-weight: bold;width:30%">Description</td>
                    <td style="text-align: center;font-weight: bold;width:10%">Qty</td>
                    <td style="text-align: center;font-weight: bold;width:10%">Cost per <br> Unit <br> (USD)</td>
                    <td style="text-align: center;font-weight: bold;width:10%">Discounted <br> Cost per <br> Unit (USD)</td>
                    <td style="text-align: center;font-weight: bold;width:10%">Total Before <br> Discount</td>
                    <td style="text-align: center;font-weight: bold;width:10%">Total After <br> Discount</td>
                </tr>
            </tbody>
        </table>
        ${productTableData.map((p, index) => {
            const vendorPriceBeforeDiscount = parseFloat(p.Vendor_Price).toFixed(2);
            //const discountDecimal = p.discount / 100;
            let vendorPriceAfterDiscount;
            const discountDecimal = p.discount;
            
            if (discountDecimal > 0) {
                const discountDecimalPercentage = discountDecimal / 100;
                vendorPriceAfterDiscount = (vendorPriceBeforeDiscount * (1 - discountDecimalPercentage)).toFixed(2);
            } else {
                vendorPriceAfterDiscount = vendorPriceBeforeDiscount;
            }
            //let vendorPriceAfterDiscount = (vendorPriceBeforeDiscount * (1 - discountDecimal)).toFixed(2);
            const totalAmountAfterDiscount = (vendorPriceAfterDiscount * p.Quantity).toFixed(2);;
            const totalAmountBeforeDiscount = parseFloat(p.Quantity * p.Vendor_Price).toFixed(2);
            return `
            <table style="width: 100%;border: 2px solid;">
                <tbody>
                    <tr style="border: 1px solid;">
                        <td style="border-top: 1px solid;width:20%">${p.Vendor_PartNo}</td>
                        <td style="border-top: 1px solid;width:30%">${p.ProductName}</td>
                        <td style="border-top: 1px solid;text-align:center;width:10%">${p.Quantity}</td>
                        <td style="border-top: 1px solid;text-align:center;width:10%">$${vendorPriceBeforeDiscount}</td>
                        <td style="border-top: 1px solid;text-align:center;width:10%">$${vendorPriceAfterDiscount}</td>
                        <td style="border-top: 1px solid;text-align:center;width:10%">$${totalAmountBeforeDiscount}</td>
                        <td style="border-top: 1px solid;text-align:center;width:10%">$${totalAmountAfterDiscount}</td>
                    </tr>
                </tbody>
            </table>
            `
        }).join('')}
        <table style="width: 100%;border: 2px solid;">
            <tbody>
                <td style="width:80%"></td>
                <td style="font-weight:bold;width:15%">Total Amount: </td>
                <td style="font-weight:bold;width:5%">$${grandTotal}</td>
            </tbody>
        </table>
    `
}