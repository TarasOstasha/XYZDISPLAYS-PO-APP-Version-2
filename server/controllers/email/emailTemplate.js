module.exports.emailTemplate = (vendorAddress, po, date, ship, shipInfoDescription, inHand, shipTo, orderNotes) => {
    // Format Ship To Address
    const lines = shipTo.trim().split('\n');
    const formattedShipTo = lines.slice(0, lines.length - 1).map(line => line.trim()).join('<br>') + (lines.length > 1 ? '<br>' + lines[lines.length - 1].trim() : '');
    
    // Format Vendor Address
    const formattedVendorAddress = vendorAddress.split('\n').map(line => line.trim()).join('<br>');
    
    // Format Current Date
    const currentDate = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    
    return `
        <table style="width: 100%;">
            <tr>
                <td style="width: 50%; vertical-align: top;">
                    <!-- Customer and Vendor table : BEGIN -->
                    <table style="width: 100%;">
                        <tbody>
                            <tr>
                                <td style="background:rgb(148, 146, 141);font-weight:bold;border: 2px solid;">Customer</td>
                            </tr>
                            <tr>
                                <td style="border: 2px solid;">
                                    xyzDisplays <br>
                                    170 Changebridge Rd. Bldg A7 <br>
                                    Montville, NJ 07045 <br>
                                    973-515-5151 <br>
                                    sales@xyzDisplays.com <br>
                                </td>
                            </tr>
                            <tr>
                                <td style="height: 24px;"></td>
                            </tr>
                            <tr>
                                <td style="background:rgb(148, 146, 141);font-weight:bold;border: 2px solid;">Vendor</td>
                            </tr>
                            <tr>
                                <td style="border: 2px solid;">
                                    ${formattedVendorAddress}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- Customer and Vendor table : END -->
                </td>
                <td style="width: 50%; vertical-align: top;">
                    <!-- P.O. and Ship To table : BEGIN -->
                    <table style="width: 100%;">
                        <tbody>
                            <tr>
                                <td style="background:rgb(148, 146, 141);font-weight:bold;border: 2px solid;">P.O. #:</td>
                                <td style="font-weight:bold;border: 2px solid;">${po}</td>
                            </tr>
                            <tr>
                                <td style="background:rgb(148, 146, 141);border: 2px solid;font-weight:bold">Date:</td>
                                <td style="border: 2px solid;">${formattedDate}</td>
                            </tr>
                            <tr>
                                <td style="background:rgb(148, 146, 141);border: 2px solid;font-weight:bold">Ship Info:</td>
                                <td style="border: 2px solid;">${ship}</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="color: brown;text-align: center;border: 2px solid;">
                                    ${shipInfoDescription}
                                </td>
                            </tr>
                            <tr style="background: yellow;height: 46px;">
                                <td style="border: 2px solid;font-weight:bold">In Hand Date: </td>
                                <td style="border: 2px solid;">${inHand}</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="background:rgb(148, 146, 141);font-weight:bold;border: 2px solid;"> Ship to</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="border: 2px solid;">
                                    ${formattedShipTo}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- P.O. and Ship To table : END -->
                </td>
            </tr>
        </table>
        <table style="width: 100%;">
            <tbody>
                <tr>
                    <td style="border: 2px solid;background: rgb(223, 166, 10);font-weight: bold;border: 2px solid;">Order Notes:</td>
                </tr>
                <tr>
                    <td style="border: 2px solid;height: 55px;border: 2px solid;">${orderNotes}</td>
                </tr>
            </tbody>
        </table>
    `;
}
