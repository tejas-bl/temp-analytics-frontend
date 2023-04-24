export const Engage_ShopperSegment_Persona_Columns = [
    {accessor:'persona' , Header:'Persona'},
    {accessor:'status' , Header:'Status'},
    {accessor:'revenue' , Header:'Revenue'}
];

export const Shield_Dashboard_Kpi_Overview_Columns = [
    {accessor:'name' , Header:'Metric'},
    {accessor:'pg' , Header:'Protected Group'},
    {accessor:'cg' , Header:'Control Group'},
    {accessor:'difference' , Header:'Improvement'},
    {accessor:'icon' , Header:'Icon'}
];

export const Engage_Coupon_management_Columns = [
    {accessor:'No' , Header:'#', width: 50},
    {accessor:'offer_heading' , Header:'Name'},
    {accessor:'offer_sub_heading' , Header:'Description'},
    {accessor:'code' , Header:'Code'},
    {accessor:'valid_from' , Header:'Valid From	'},
    {accessor:'valid_to' , Header:'Valid To'},
    {accessor:'is_active' , Header:'Is Active'},
    {accessor:'remarks' , Header:'Remarks'},
    {accessor:'created_on' , Header:'Created On'},
    {accessor:'modified_on' , Header:'Modified On'},
];

export const Shield_Malware_insights_Malicious_Script_Columns = [
    {accessor:'page_url' , Header:'Pages'},
    {accessor:'is_blocked' , Header:'Scripts'}
];

export const Shield_Malware_insights_Advertising = [
    {accessor:'no' , Header:'#', width: 50},
    {accessor:'brand' , Header:'Competitors Name'},
    {accessor:'domain' , Header:'Domain'}
];

export const Shield_Malware_insights_Products = [
    {accessor:'img' , Header:'Image'},
    {accessor:'product' , Header:'Competitors Name'}
];

export const Engage_insights_Recycle_User_Data_Columns = [
    {accessor:'publisher' , Header:'Publisher'},
    {accessor:'sessions' , Header:'Total Sessions'},
    {accessor:'fpa_sessions' , Header:'FPA Sessions'},
    {accessor:'percentageRU' , Header:'Recycled Sessions(%)'},
    {accessor:'total_conversion' , Header:'Total Conversions'},
    {accessor:'fpa_conversion' , Header:'FPA Conversions'},
    {accessor:'percentageRO' , Header:'Recycled Conversions(%)'}
];

export const Engage_EEI_Recycle_Affiliate_Sessions_Columns = [
    {accessor:'publisher' , Header:'Publisher'},
    {accessor:'sessions' , Header:'Total Sessions'},
    {accessor:'ms_sessions' , Header:'Sessions with Recycled Users'},
    {accessor:'percentageRU' , Header:'% of Recycled Sessions'},
    {accessor:'total_conversion' , Header:'Total Orders'},
    {accessor:'ms_conversion' , Header:'Sessions with Recycled Orders'},
    {accessor:'percentageRO' , Header:'% of Recycled Orders'}
];
export const Engage_EEI_Recycle_Publisher_Breakdown_Columns = [
    {accessor:'publisher' , Header:'Publisher'},
    {accessor:'total_conversions' , Header:'Total Orders'},
    {accessor:'cashback_conversions' , Header:'Recycled Orders'},
    {accessor:'revenue_misattributed' , Header:'Revenue Misattributed'}
];

export const Engage_Coupon_Quality_Metrics_Columns = [
    {accessor:'coupon' , Header:'Coupon'},
    {accessor:'coupon_score' , Header:'Quality', width: 100},
    {accessor:'sum_sessions_with_apply_or_copy' , Header:'Total Sessions', width: 100},
    {accessor:'sum_sessions_with_conversions' , Header:'Total Orders', width: 100},
    {accessor:'status' , Header:'Status', width: 100}
];


/* 
export const Engage_insights_Recycle_User_Data_Columns = [
    {accessor:'publisher' , Header:'Publisher'},
    {accessor:'sessions' , Header:'Total Sessions'},
    {accessor:'fpa_sessions' , Header:'First Page Affiliates Session'},
    {accessor:'fpa_conversion' , Header:'First Page Affiliates Conversion'},
    {accessor:'total_conversion' , Header:'Total Conversions'},
    {accessor:'percentageRU' , Header:'Percentage Recycled Users'},
    {accessor:'percentageRO' , Header:'Percentage Recycled Orders'}
];
 */
export const Engage_Insights_Wrong_Coupon_Data_Column = [
    {accessor:'no' , Header:'#', width: 50},
    {accessor:'code_lower' , Header:'Code'},
    {accessor:'sessions' , Header:'Session Count'},
];

export const Engage_Insights_Wrong_Coupon_affilate_Column = [
    {accessor:'no' , Header:'#', width: 50},
    {accessor:'affiliate' , Header:'Affiliate'},
    {accessor:'wrong_coupon_count' , Header:'Wrong Coupon Code Count'},
    {accessor: 'modalDetails', Header: 'affiliate Details'}
];

export const Engage_Insights_Cashback_percentage = [
    {accessor:'no' , Header:'#', width: 50},
    {accessor:'ext_name' , Header:'Extension'},
    {accessor:'percentage' , Header:'Percentage'}
];

export const Extension_Shopper_Cashback_Coupons = [
    {accessor:'no' , Header:'#', width: 50},
    {accessor:'extension_name' , Header:'Extension'},
    {accessor:'extension_download_url' , Header:'Download Url'},
    {accessor:'sessions' , Header:'Sessions', width: 100},
    {accessor:'percent_share' , Header:'Percentage'}
];
export const Hesitant_Shopper_User_Drop_Off = [
    {accessor:'no' , Header:'#', width: 50},
    {accessor:'page_url' , Header:'Page Url'},
    {accessor:'sessions' , Header:'Sessions'}
];
export const Hesitant_Shopper_Trigger_Timing = [
    {accessor:'key' , Header:'Metrics', width: 300},
    {accessor:'value' , Header:'Data'}
];

export const Coupon_Used_Column = [
    {accessor:'no' , Header:'#', width: 50},
    {accessor:'lower_code' , Header:'Codes'},
    {accessor:'code_percentage' , Header:'Codes Used'},
    {accessor:'conversion_rate' , Header:'Codes Conv.Rate'}
];

export const Checkout_Page_Conversion_Rate_Column = [
    {accessor:'conversion_type' , Header:'Conversion Type'},
    {accessor:'session' , Header:'Sessions', width: 80},
    {accessor:'order' , Header:'Orders', width: 80},
    {accessor:'conversion_rate' , Header:'Conversion Rate'}
];

export const Engage_Persona_metrics_column = [
    {accessor:'metricName' , Header:'Metrics'},
    {accessor:'brandlock_off' , Header:'Brandlock Off'},
    {accessor:'brandlock_on' , Header:'Brandlock On'},
    {accessor:'gain' , Header:'Gain'}
];

export const Engage_Persona_Coupon_Table = [
    {accessor:'offer_heading' , Header:'Coupon'},
    {accessor:'offer_sub_heading' , Header:'Description'},
    {accessor:'code' , Header:'Code'},
    {accessor:'valid_to' , Header:'Expiry Date'},
]