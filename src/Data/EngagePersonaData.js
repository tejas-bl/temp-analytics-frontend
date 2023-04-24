export const personaTable = [
  {
    persona: "Wrong Coupon Shopper​​​​",
    status: "Enabled",
    recoveredRevenue: "145,712",
    recoveredRevenueNum: 145712,
  },
  {
    persona: "Coupon Runner​​​",
    status: "Not Active",
    recoveredRevenue: "345,712",
    recoveredRevenueNum: 345712,
  },
  {
    persona: "Extension Shoppers​​​",
    status: "Not Active",
    recoveredRevenue: "345,712",
    recoveredRevenueNum: 345712,
  },
  {
    persona: "Hesitant Shoppers​​​",
    status: "Not Active",
    recoveredRevenue: "345,712",
    recoveredRevenueNum: 345712,
  },
];


export const personaRecoveredRevData = [
  {
    heading: "Recovered Revenue",
    days: "30 days",
    money: "$145,712",
    perText: "How was it calculated? ",
    sparklineData: {
      type: "line",
      data: [1, 4, 1, 3, 7, 1],
      areaStyle: {
        color: "#769ccd",
      },
      itemStyle: {
        color: "#769ccd",
      },
      symbolSize: 1,
    },
  },
];


export const personaDetailCardData =
{
  heading: "Wrong Coupon Shopper",
  description: "Shoppers Who Enter a Wrong Coupon Code @ Checkout",
  perText: "How was it calculated? ",
  status: "Enabled"
};
export const personaOverviewCardData =
{
  heading: "Overview",
  subHeading: "Learn More",
  description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  points: [
    {
      data: "CTR Gains",
      icon: "fa fa-line-chart"
    },
    {
      data: "Affiliate Savings",
      icon: "fa fa-dollar"
    },
  ]
};


export const wcOverviewCardData =
{
  heading: "Overview",
  subHeading: "Learn More",
  description: "\“PROMO-FOMO\” Shoppers who obtain a faulty coupon and have a negative brand experience while attempting to redeem it.",
  longDescription: "Coupon Savvy customers go out of their way to find discounts. They surf the web and coupon sites for the best bargains, then return with the code they received to complete their purchase. Regrettably, they rarely come across valid coupons. 60% of coupons on affiliate websites are either expired, non-transferable, or obtained from users. Shoppers feel frustrated and abandon their onsite customer journey.  Additionally, when a shopper visits the coupon site, clicks on one of the codes, and gets redirected to their shopping cart, the coupon site takes credit for the sale regardless of whether a coupon was successfully applied or not. Merchants end up shelling out twice in affiliate fees and customer discounts. BrandLock recognizes the wrong coupon code entered at checkout and engages the shopper with the right one, preventing cart abandonment, increasing CVR by +10%, and saving affiliate fees.",
  problem: "Customers who enter a wrong coupon code at checkout, get frustrated and abandon their customer journey.",
  solution: "Give a valid coupon to remedy the shopper's frustration. Increase revenue.",
  points: [
    {
      data: "CVR Gains",
      icon: "fa fa-line-chart"
    },
    {
      data: "Affiliate Savings",
      icon: "fa fa-dollar"
    },
  ]
};

export const ti3OverviewCardData =
{
  heading: "Overview",
  subHeading: "Learn More",
  description: "Shoppers who exhibit a high intent to purchase but are reluctant to proceed to the next step - add to cart.",
  longDescription: "Hesitant Shoppers demonstrate a high level of interest in products by exploring product pages and connecting with the site, but they are hesitant to add items to their cart. Even after identifying needs and assessing options, many consumers are reluctant to add a product to their cart, with price being one of the most important considerations. Around 18% of the shoppers display signs of hesitancy. BrandLock identifies such shopping behavior and nudges them with minimum incentive to convert.",
  problem: "Shoppers with high intent to purchase, but not sure if now is the right time. 99% of this group abandons at 11min.",
  solution: "Engage this shopper with the right offer BEFORE 11 MIN. Increase revenue.",
  points: []
};


export const couponRunnerOverviewCardData =
{
  heading: "Overview",
  subHeading: "Learn More",
  description: "Shoppers who adore savings and are inclined to divert from their customer journey in search of coupons.",
  longDescription: "Price is the driving force behind a coupon runner's purchase decision. They seek optimal value at the lowest possible price and are willing to spend hours scouring the internet for bargains. Coupon connoisseurs account for about 5% of all shoppers. They believe a sweet deal is always around the corner and go to lengths to obtain it. In doing so, they tend to stray from their intended path to purchase, winding up on coupon sites, uncovering dozens of deals from your competitors. In such cases, brands risk losing potential revenue, as there is no certainty of the shopper returning. On the other hand, coupon sites take undue credit for sales they had no part driving. BrandLock identifies these customers and prevents them from abandoning their customer journey with real-time messaging, resulting in  +5% CVR lift, +5% RPS lift, and -13% affiliate savings.",
  problem: "Shoppers who leave your site in search of a coupon.",
  solution: "Prevent them from dropping off. Save margins. Increase revenue.",
  points: [
    {
      data: "CVR Gains",
      icon: "fa fa-line-chart"
    },
    {
      data: "RPS Gains",
      icon: "fa fa-dollar"
    }, {
      data: "Affiliate Savings",
      icon: "fa fa-dollar"
    },
  ]
};


export const extensionTriggerOverviewCardData =
{
  heading: "Overview",
  subHeading: "Learn More",
  description: "Deal-oriented Shoppers who have extensions like Honey, Capital One, eBates, and Rakuten installed on their browsers.",
  longDescription: "When a shopper is on the brink of check out and is about to enter a coupon code, extensions like Honey, Capital One, and Rakuten popup, scan through the codes they have in store and automatically apply the highest discount code for the buyer. Coupon Extensions reduce your AOV, gross margins and claim undue credit for sales they had little to no part in driving. Moreover, they also undermine your intended user experience and skew your attribution reporting. About 2% of Shopper visits have extensions installed on their browser are used by about 5% of shoppers. BrandLock recognizes this shopping behavior and blocks and replaces these extensions with 1:1 personalized promotions, resulting in a +10% CVR lift and a 39% reduction in affiliate fees.",
  problem: "Extensions auto-inject coupons at checkout, reduce gross margin, and slow checkout performance while claiming false credit for traffic already on your site.",
  solution: "Stop extensions from firing and replace them with your own offers.   Increase AOV.  Decrease false affiliate payouts.",
  points: [
    {
      data: "CVR Gains",
      icon: "fa fa-line-chart"
    }, {
      data: "Affiliate Savings",
      icon: "fa fa-dollar"
    },
  ]
};



export const whyNotShopperOverviewCardData =
{
  heading: "Overview",
  subHeading: "Learn More",
  description: "Shoppers that use their carts as wish lists but eliminate many items at checkout to meet their desired price point.",
  longDescription: "There's always a good reason to buy an extra pair of shoes or one more sweatshirt. We've all had experiences when we treat our shopping carts as wishlists, and keep adding items to it, only to discover at checkout that our total cost has exceeded our budget, leaving us with the unavoidable decision of whether to buy or let it go. In such circumstances, shoppers typically begin eliminating products from their cart to reach their desired pricing threshold. However, 70% of these customers complete the checkout process without removing items from their cart if given the correct incentive. BrandLock identifies such shoppers and prevents them from abandoning their checkout process or removing items from the cart by nudging them with 1:1 personalized promotions at the right time.",
  problem: "Shoppers who use the cart as wish lists, ultimately removing many desired items at checkout, when they see the final price.",
  solution: "Offer an incentive to keep all their items and complete the purchase. Only applicable when the shopper adds a specific number of items back to the cart.  Increase revenue.",
  points: []
};



export const permiumShopperOverviewCardData =
{
  heading: "Overview",
  subHeading: "Learn More",
  description: "Premium Shoppers who are inclined to purchase more when engaged with the right incentive during checkout.",
  longDescription: "All customers are vital to the success of a business, but VIP shoppers are the first among equals. VIP shoppers are not price-conscious. They don't hesitate to spend more on items they like and find value in, especially when an incentive is provided. BrandLock identifies VIP shoppers and enables you to upsell more items based on their cart value by providing 1:1 personalized promotions.",
  points: []
};



export const adwareShopperOverviewCardData =
{
  heading: "Overview",
  subHeading: "Learn More",
  description: "Hijacked Shoppers experience malicious ad injections on their screens inserted by in their browser & devices.",
  longDescription: "Shoppers who have a negative brand experience due to unauthorized ads injected into their consumer web sessions. These ad injectors get installed via free extensions, apps, or services that customers may or may not have intentionally installed on their devices. Ad Injections come in the form of price comparison pop-ups, video ads, text ads, banner ads, and malicious scripts that blend with the eCommerce site and redirect shoppers to competitor sites to complete their purchases. BrandLock recognizes and stops these ad injections in real-time to give your shoppers a distraction-free shopping experience.",
  problem: "Shoppers who have malicious ads injected by their devices/browsers, luring them away, and lowering conversion.",
  solution: "Brandlock Solution:  Block Ads.  Shoppers Stay.  Revenue Increases.",
  points: []
};


export const personaMetricsCardData =
{
  heading: "Metrics",
  perText: "Industry Based",
  subHeading: "Typical Results",
  points: [
    {
      data: "10% CR Lift",
      icon: "fa fa-line-chart",
      color: "#FF4C29",
      backgroundColor: "#FF4C29"
    },
    {
      data: "25% decrease in affiliate fees",
      icon: "fa fa-area-chart",
      color: "#8FD6E1",
      backgroundColor: "#8FD6E1"
    },
    {
      data: "Metric | Brandlock-Off | Brandlock-On | Gain",
      icon: "fa fa-bar-chart",
      color: "#F4ABC4",
      backgroundColor: "#F4ABC4"
    },
    {
      data: "CR | 4.2% | 4.6% | 10%+",
      icon: "fa fa-bar-chart-o",
      color: "#03C4A1",
      backgroundColor: "#03C4A1"
    },
    {
      data: "Monthly Rev | $349,272 | $401,123 | $52,145",
      icon: "fa fa-line-chart",
      color: "#C400C6",
      backgroundColor: "#C400C6"
    },
  ]
};


export const personaSettingsTableData = [
  {
    coupon: "HBD15​​​​",
    description: "15% of all orders over $150​",
    expiry: "Dec 15 2021",
    orderValue: "$150",
    couponType: "%off"
  },
  {
    coupon: "20off",
    description: "20% of all orders over $100 or more​",
    expiry: "No Expiry",
    orderValue: "$150",
    couponType: "%off"
  },
  {
    coupon: "HBD15",
    description: "15% of all orders over $150​",
    expiry: "Dec 15 2021",
    orderValue: "$150",
    couponType: "%off"
  },
  {
    coupon: "HBD15​​​​",
    description: "15% of all orders over $150​",
    expiry: "Dec 15 2021",
    orderValue: "$150",
    couponType: "%off"
  },
  {
    coupon: "HBD15",
    description: "15% of all orders over $150​",
    expiry: "Dec 15 2021",
    orderValue: "$150",
    couponType: "%off"
  },
  {
    coupon: "HBD15​​​​",
    description: "15% of all orders over $150​",
    expiry: "Dec 15 2021",
    orderValue: "$150",
    couponType: "%off"
  },

];


export const groupSplitPiechart = {
  title: {
    text: "",
    subtext: "",
    left: "left",
  },
  color: ["#769ccd", "#374649"],
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
  },
  legend: {
    orient: "horizontal",
    bottom: "bottom",
    data: [
      "Right Coupon Enabled",
      "Wrong Coupon Control",
    ],
  },
  series: [
    {
      type: "pie",
      radius: "20%",
      center: ["50%", "50%"],
      data: [
        { value: 90, name: "Right Coupon Enabled" },
        { value: 10, name: "Wrong Coupon Control" },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};