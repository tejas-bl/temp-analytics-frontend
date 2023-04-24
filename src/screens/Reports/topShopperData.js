export const top_shopper_data = {

    "1": {
        "data_source": "db",
        "data": [],
        "table": "engage_top_codes",
        "query": (site_id = null, start_date = "", end_date = "") => {
            return `
            SELECT etc.site_id,
            LOWER(etc.code) AS code_lower,
            lower(etc.code) as label,
            SUM(visitors)   AS visitors,
            SUM(sessions)   AS sessions,
            SUM(sessions) AS value,
            SUM(top_code_count) AS code_count
        FROM engage_top_codes etc
                LEFT JOIN
            v2_promocode pc
            ON etc.site_id = pc.site_id
                AND LOWER(TRIM(BOTH ' ' FROM etc.code)) = LOWER(pc.code)
        WHERE pc.site_id IS NULL
        AND (event = 'WC' OR event = 'wc')
        AND etc.code IS NOT NULL
        AND etc.code != ''
        AND logged_at BETWEEN DATE '${start_date}' and date '${end_date}'
        AND etc.site_id = ${site_id}
        GROUP BY etc.site_id,
                etc.code
        HAVING SUM(sessions) > 0
        ORDER BY sessions DESC,
                sessions DESC LIMIT 10;`
        },
        "showOrderSequence": false,
        "showShopperTopData": true
    },
    "2": {
        "data_source": "db",
        "data": [],
        "table": "v2_hesitant_shopper_top_dropoff_pages",
        "query": (site_id = null, start_date = "", end_date = "") => {
            return `
            SELECT site_id,
                    page_url as label,
                    page_type,
                    sessions,
                    trigger_time_seconds as value,
                            avg_add_to_cart_time    
                    FROM (SELECT tdp.site_id,
                                page_url,
                                page_type,
                                sessions,
                                case when trigger_time_seconds > 2*avg_add_to_cart_time then trigger_time_seconds
            when trigger_time_seconds < 2*avg_add_to_cart_time then 2*avg_add_to_cart_time end as trigger_time_seconds,
            avg_add_to_cart_time,
                                RANK() OVER (PARTITION BY page_type ORDER BY sessions DESC) page_rank
                        FROM v2_hesitant_shopper_top_dropoff_pages tdp JOIN v2_hesitant_shopper_trigger_timings tt ON tt.site_id = tdp.site_id
                        WHERE tdp.site_id = ${site_id} AND desktop = 1) AS hesitant
                    ORDER BY sessions DESC`
        },
        "showOrderSequence": false,
        "showShopperTopData": true
    },
    "3": {
        "data_source": "db",
        "data": [],
        "table": "script_directory",
        "query": (site_id = null, start_date = "", end_date = "") => {
            return ` SELECT *,
ROUND(sessions * 100.0 / total_sessions_on_site, 2) AS value
FROM (SELECT *
    , SUM(sessions) OVER () AS total_sessions_on_site
FROM (SELECT script_name   AS label,
            script_url    AS extension_download_url,
            SUM(sessions) AS sessions
     FROM (SELECT sdm.script_name,
                  sdm.script_url,
                  SUM(sessions) AS sessions
           FROM top_coupons_cashback_extension_v2 tccev2
                    JOIN (SELECT DISTINCT script_directory_id,
                                          script_name,
                                          script_url
                          FROM script_directory_mapping) sdm
                         ON tccev2.script_directory_id = sdm.script_directory_id
           WHERE day BETWEEN date '${start_date}' and date '${end_date}'
             AND site_id = ${site_id}
           GROUP BY sdm.script_name,
                    sdm.script_url
           UNION
           SELECT script_name,
                  script_url,
                  SUM(sessions) AS sessions
           FROM (SELECT day,
                        sdm.script_directory_id,
                        sdm.script_name,
                        sdm.script_url,
                        sessions
                 FROM top_coupons_cashback_extension_v2 tccev2
                          JOIN script_directory_mapping sdm
                               ON tccev2.script_name = sdm.script
                 WHERE day BETWEEN date '${start_date}' and date '${end_date}'
                   AND site_id = ${site_id}
                   AND tccev2.script_directory_id IS NULL
                 GROUP BY day,
                          sdm.script_directory_id,
                          sdm.script_name,
                          sdm.script_url,
                          sessions) d1
           GROUP BY script_name,
                    script_url) d2
     GROUP BY label,
              extension_download_url) d3) d4 ORDER BY value Desc;`
        },
        "showOrderSequence": false,
        "showShopperTopData": true
    },
    "4": {
        "data_source": "db",
        "data": [],
        "table": "publisher_breakdown_by_user_type",
        "query": (site_id = null, start_date = "", end_date = "") => {
            return `
            select 
        publisher as label,
        sum(recycled_coupon_runner_sessions) as coupon_sessions,
        sum(recycled_coupon_runner_conversions) as coupon_conversion,
        sum(recycled_cashback_sessions) as cashback_sessions,
        sum(total_conversions) as total_conversions,
        sum(recycled_cashback_conversions) as recycled_cashback_conversions
        from publisher_breakdown_by_user_type
        where site_id = ${site_id}
        and day between date '${start_date}' and date '${end_date}'
        and (publisher != '' Or publisher is not null)
        group by publisher order by recycled_cashback_conversions desc`
        },
        "showOrderSequence": false,
        "showShopperTopData": true
    },
    "5": {
        "data_source": "static",
        "data": [],
        "table": "",
        "query": ``,
        "showOrderSequence": false,
        "showShopperTopData": false
    },
    "6": {
        "data_source": "static",
        "data": [],
        "table": "",
        "query": `select script_name as label, id as value from script_directory where deleted_on is null GROUP BY script_name, id`,
        "showOrderSequence": false,
        "showShopperTopData": true
    },
    "7": {
        "data_source": "static",
        "data": [
            { label: "Price Comparison", value: "price_comparison" },
            { label: "Video Ads", value: "video_ads" },
            { label: "Banner Ads", value: "banner_ads" },
            { label: "In-Text Ads", value: "in_text_ads" },
            { label: "Hijacking Scripts", value: "hijacking_scripts" },
            { label: "Mobile Ads", value: "mobile_ads" }
        ],
        "showOrderSequence": true,
        "showShopperTopData": true
    }
}