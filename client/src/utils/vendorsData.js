export const VENDOR_LIST = [
  { name: "Choose Vendor", address: "", code: null },
  {
    name: "TV_Liquidator",
    address:
      "Edward Estrada\nTV Liquidator\n5801 W. Jefferson Blvd.\nLos Angeles, CA 90016\nTel.(888) 885-7740",
    //discount: 1,
    discount: 0,
    code: "tl",
    shipInfo: "Freight",
    shipInfoDescription: "",
    email: ["info@tvliquidator.com; sales@xyzdisplays.com"],
  },
  {
    name: "LED_Scopic",
    address: `Paul Song // James Min\n1001 W. Crosby Rd\nCarrollton TX 75006\nTel.(469)208-9411\n(888) 588-5411`,
    //discount: 0.9,
    discount: 10,
    code: "ls",
    shipInfo: "Freight",
    shipInfoDescription: "",
    email: [
      "James.M@Ledscopic.com; thomas.h@osakititan.com; sales@xyzdisplays.com",
    ],
  },
  {
    name: "Makitso",
    address: `Makitso Displays\n
        4620 S Sam Houston Pkwy W Suite 430\n 
        Houston, TX 77053\n
        281-495-1300`,
    // discount: 0.8,
    discount: 20,
    code: "mk",
    //shipInfo: `GROUND on Makitso's Account`,
    shipInfo: `Ground on our UPS B356D3`,
    shipInfoDescription:
      "Declare value with UPS\n(DO NOT show on customer label)",
    email: [
      "alyssa@makitsodisplays.com",
      "orders@makitsodisplays.com",
      "martin@makitsodisplays.com",
      "graphics@makitsodisplays.com",
      "sales@xyzdisplays.com",
    ],
  },
  {
    name: "Orbus",
    address: `
        Orbus\n
        9033 Murphy Road\n
        Woodridge, IL 60517\n
        (630) 755-7782
      `,
    // discount: 0.8,
    discount: 20,
    code: "or",
    //shipInfo: `GROUND on Orbus'Account`,
    shipInfo: `Ground on our UPS B356D3`,
    shipInfoDescription:
      "Declare value with UPS\n(DO NOT show on customer label)",
    email: [
      "john.ulatoski@orbus.com",
      "josh@orbus.com",
      "sales@xyzdisplays.com",
    ],
  },
  {
    name: "BrandStand",
    address: `
        Casandra Cancelliere\n
        Brandstand\n
        18502 NE 5th Avenue \n
        Miami, FL 33179\n
        941-244-9310
      `,
    // discount: 0.85,
    discount: 15,
    code: "bn",
    shipInfo: `Ground on our UPS B356D3`,
    //shipInfo: `GROUND on BrandStand's Account`,
    shipInfoDescription:
      "Declare value with UPS\n(DO NOT show on customer label)",
    email: [
      "orders@brandstandusa.com",
      "casandra@brandstandamerica.com",
      "sales@xyzdisplays.com",
    ],
  },
  {
    name: "BrandStand",
    address: `
        Casandra Cancelliere\n
        Brandstand\n
        18502 NE 5th Avenue \n
        Miami, FL 33179\n
        941-244-9310
      `,
    // discount: 0.85,
    discount: 15,
    code: "be",
    shipInfo: `Ground on our UPS B356D3`,
    //shipInfo: `GROUND on BrandStand's Account`,
    shipInfoDescription:
      "Declare value with UPS\n(DO NOT show on customer label)",
    email: [
      "orders@brandstandusa.com",
      "casandra@brandstandamerica.com",
      "sales@xyzdisplays.com",
    ],
  },
  {
    name: "Dynapac",
    address: `
        Dynapac Rotating Co\n
        338 Hansen Ave.\n
        Salt Lake City, UT 84115\n
        801-485-2221
      `,
    //discount: 0.8,
    discount: 0,
    code: "dc",
    //shipInfo: `GROUND on B356D3`,
    shipInfo: `Ground on our UPS B356D3`,
    shipInfoDescription:
      "FOR ORDERS REQUIRING FREIGHT/TRUCKING:\nPROVIDE A SHIPPING QUOTE AND DIMS/WEIGHT",
    email: [
      "marlene@dpmot.com",
      "sales@dpmot.com",
      "sales@xyzdisplays.com",
    ],
  },
  {
    name: "Vue_More",
    address: `
        Dynapac Rotating Co\n
        338 Hansen Ave.\n
        Salt Lake City, UT 84115\n
        801-485-2221
      `,
    // discount: 0.65,
    discount: 0,
    code: "vm",
    shipInfo: `GROUND on B356D3`,
    shipInfoDescription:
      "Declare shipping value.\n(DO NOT show on customer label)",
    email: [
      "marlene@dynapacrotating.com",
      "sales@dynapacrotating.com",
      "sales@xyzdisplays.com",
    ],
  },
  {
    name: "KS",
    address: `
        K&S International Flooring
        760 Glenn Ave.
        Wheeling, IL 60090
        (847) 229-0202
      `,
    //discount: 1,
    discount: 0,
    code: "ks",
    shipInfo: `GROUND on B356D3`,
    shipInfoDescription:
      "Declare value with Fedex\n(DO NOT show on customer label)",
    email: ["sales@ksintl.com", "sales@xyzdisplays.com"],
  },
  {
    name: "Eastern Signs",
    address: `
        Audrey Ng
        Eastern-Signs
        No. 86 Haitanwei Industrial Park
        Pengjiang District, Jiangmen City
        Guangdong, 529050 China
        Phone: +86 750-321-3535
      `,
    //discount: 1,
    discount: 0,
    code: "es",
    shipInfo: "Ground",
    shipInfoDescription:
      "Declare value with Fedex\n(DO NOT show on customer label)",
    email: ["audrey@easternsigns.net", "sales@xyzdisplays.com"],
  },
  {
    name: "United_Visual",
    address: `
        Kathrine McCarter
        kathrinem@uvpinc.com
        United Visual Products Inc.
        500 W. Oklahoma Ave.
        Milwaukee, WI 53207
        414-615-4509
      `,
    //discount: 1,
    discount: 0,
    code: "uv",
    shipInfo: "Freight",
    shipInfoDescription: "",
    email: ["kathrinem@uvpinc.com", "sales@xyzdisplays.com"],
  },
  {
    name: "Smart_Media",
    address: `
        Nereida Siu
        Office  Manager
        SmartMedia USA Inc. 
        7400 NW 7th Street Suite 105
        Miami,FL 33126
        Tel. 786 615 7952    
      `,
    //discount: 1,
    discount: 0,
    code: "sm",
    shipInfo: "Freight",
    shipInfoDescription: "",
    email: ["nereida@smartmediaworld.net", "sales@xyzdisplays.com"],
  },
  {
    name: "Pascale",
    address: `
        Pascale Engineering
        1800 University Pkwy
        Sarasota, FL 34243
        Tel. (800) 750-7552    
      `,
    //discount: 1,
    discount: 0,
    code: "pe",
    shipInfo: "Ground on UPS B356D3",
    shipInfoDescription:
      "Declare value with UPS\n(DO NOT show on customer label)",
    email: ["sales@pascaleengineering.com", "sales@xyzdisplays.com"],
  },
  {
    name: "Testrite",
    address: `
    TESTRITE VISUAL
    216 South Newman Street
    Hackensack, NJ 07601
    (888) 873-2735  
      `,
    //discount: 1,
    discount: 0,
    code: "tr",
    shipInfo: "GROUND UPS  B356D3",
    shipInfoDescription:
      "Declare value with UPS\n(DO NOT show on customer label)",
    email: [
      "jesse@testrite.com",
      "orders@testrite.com",
      "sales@xyzdisplays.com",
    ],
  },
  {
    name: "Taylor",
    address: `
      Taylor
      1540 Fencorp Drive
      Fenton, MO 63026
      800-844-8877
      `,
    //discount: 1,
    discount: 0,
    code: "og",
    shipInfo: `Ground on our UPS B356D3`,
    //shipInfo: 'GROUND on Taylor Account',
    shipInfoDescription:
      "Declare value with UPS\n(DO NOT show on customer label)",
    email: ["Amber.Eisenbeis@taylor.com", "sales@xyzdisplays.com"],
  },
  {
    name: "Case_Design",
    address: `
    Case Design Corp
    333 School Ln
    Telford, PA 18969
    (215) 703-0130
    (800) 657-2650
      `,
    //discount: 1,
    discount: 0,
    code: "cd",
    shipInfo: "Ground on UPS B356D3",
    shipInfoDescription:
      "Declare value with UPS\n(DO NOT show on customer label)",
    email: ["sales@casedesigncorp.com", "sales@xyzdisplays.com"],
  },
  {
    name: "ExpoGo",
    address: `
    ExpoGo / ShowStyle
    411 Landmark Drive
    Wilmington, NC 28412
    910-452-3976
      `,
    discount: 0,
    code: "eg",
    shipInfo: "Ground on UPS B356D3",
    shipInfoDescription:
      "Declare value with UPS\n(DO NOT show on customer label)",
    email: ["csr@expostar.com", "sales@xyzdisplays.com"],
  },
  {
    name: "Exhibit_Foundry",
    address: `use website `,
    // discount: 0.6,
    discount: 0,
    code: "ef",
    shipInfo: `Always use coupon code Dealer40 at checkout`,
    shipInfoDescription: "",
    email: ["sales@exhibitfoundry.com", "sales@xyzdisplays.com"],
  },
  {
    name: "Abex",
    address: `
    Abex
    Marilyn Perez
    355 Parkside Dr 
    San Fernando, CA 91340
    800-537-0231 ext. 115 
      `,
    //discount: 1,
    discount: 0,
    code: "ab",
    shipInfo: "Freight",
    shipInfoDescription:
      "Please provide shipping estimate, pallet size and weight. ",
    email: ["orders@abex.com", "sales@xyzdisplays.com"],
  },
  {
    name: "Novodek",
    address: `
    Novodek USA
    3930 Perimeter West Drive
    Charlotte, NC 28214
    (980) 500 2217
      `,
    // discount: 1,
    discount: 40,
    code: "nv",
    shipInfo: "Ground on B356D3",
    shipInfoDescription:
      "Declare value with UPS\n(DO NOT show on customer label)",
    email: ["elena@novodek.com", "sales@xyzdisplays.com"],
  },
  {
    name: "WS",
    address: `
      WSDisplays\n\n\n
    `,
    discount: 0,
    code: "ws",
    shipInfo: "Ground Prime",
    shipInfoDescription:
      "Declare value with UPS\n(DO NOT show on customer label)",
    email: [
      "Hannicka@wsdisplay.com",
      "atheena@wsdisplay.com",
      "yesenia@wsdisplay.com",
      "sales@xyzdisplays.com",
    ],
  },
  {
    name: "Royal Printing Solutions",
    address: `
      Royal Printing Solutions
      13802 E 33rd Pl
      Aurora, CO 80011
      (303) 217-8418
    `,
    discount: 0,
    code: "rp",
    shipInfo: "Ground on UPS Royals Account",
    shipInfoDescription:
      "Declare value with UPS\n(DO NOT show on customer label)",
    email: ["miket@royalprintingsolutions.com", "sales@xyzdisplays.com"],
  },
  {
    name: "North America Display Corporation",
    address: `
      5465 SW Western Ave.
      Suite B 
      Beaverton, OR 97005
      1-800-901-5220

    `,
    discount: 0,
    code: "na",
    shipInfo: "Ground on UPS North America Account",
    shipInfoDescription:
      "Declare value with UPS\n(DO NOT show on customer label)",
    email: ["orders@nadisplay.com", "sales@xyzdisplays.com"],
  },
  {
    name: "BannerBug",
    address: `
      BannerBug USA
      3401 Mary Tyler Raod
      Birmingham, AL 35235
      (205) 793-9600
    `,
    discount: 0,
    code: "bb",
    shipInfo: "Ground on UPS B356D3",
    shipInfoDescription:
      "Declare value with UPS\n(DO NOT show on customer label)",
    email: ["david@bannerbugusa.com", "sales@xyzdisplays.com"],
  },
  {
    name: "Birttani",
    address: `
      500 Hartle St., #C
      Sayreville, NJ 08872
    `,
    discount: 0,
    code: "bd",
    shipInfo: "Ground on UPS B356D3",
    shipInfoDescription:
      "Declare value with UPS\n(DO NOT show on customer label)",
    email: ["orders@birttani.com", "nj@birttani.com", "andy@birttani.com", "sales@xyzdisplays.com"],
  },
];
			

		

