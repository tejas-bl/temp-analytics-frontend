import moment from 'moment';

export const getCurrentUser = () => {
  let user = null;
  try {
    user =
      localStorage.getItem('current_user') != null
        ? JSON.parse(localStorage.getItem('current_user'))
        : null;
  } catch (error) {
    console.log('>>>>: src/helper/Utils.js  : getCurrentUser -> error', error);
    user = null;
  }
  return user;
};

export const setCurrentUser = (user) => {
  try {
    if (user) {
      localStorage.setItem('current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('current_user');
    }
  } catch (error) {
    console.log('>>>>: src/helper/Utils.js : setCurrentUser -> error', error);
  }
};


export const setWebsiteData = (data) => {
  try {
    if (data) {
      localStorage.setItem('website_data', JSON.stringify(data));
    } else {
      localStorage.removeItem('website_data');
    }
  } catch (error) {
    console.log('>>>>: src/helper/Utils.js : setWebsiteData -> error', error);
  }
};

export const getWebsiteData = () => {

  let data = null;
  try {
    data =
      localStorage.getItem('website_data') != null
        ? JSON.parse(localStorage.getItem('website_data'))
        : null;
  } catch (error) {
    console.log('>>>>: src/helper/Utils.js  : getCurrentUser -> error', error);
    data = null;
  }
  return data;
};


export const formatDate = (date) => {
  try {
    // return new Date(date).toUTCString().slice(0, 19);
    // return new Date(date).toUTCString();
    // return new Date(date).toLocaleString(); 
    return new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    // return date
  } catch (error) {
    console.log('>>>>: src/helper/Utils.js : formatDate -> error', error);
  }
};


export const getMonthAndYear = (date) => {
  try {
    return moment(new Date(date)).format("MMM YYYY")
    // return date
  } catch (error) {
    console.log('>>>>: src/helper/Utils.js : formatDate -> error', error);
  }
};

export const getYear = (date) => {
  try {
    return moment(new Date(date)).format("YYYY")
    // return date
  } catch (error) {
    console.log('>>>>: src/helper/Utils.js : formatDate -> error', error);
  }
};


export const convertDateTOLocale = (date, formatDate = false) => {
  try {
    if (!formatDate) {
      return moment(date).format('YYYY-MM-DD')
      // return new Date(date).toLocaleString().slice(0, 10).split(',')[0];
    } else {
      date = new Date(date);
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth() + 1).toString();
      var dd = date.getDate().toString();

      var mmChars = mm.split('');
      var ddChars = dd.split('');
      return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
    }
  } catch (error) {
    console.log('>>>>: src/helper/Utils.js : formatDate -> error', error);
  }
};

export const getCurrencySymbol = (currency) => {
  if (currency !== null) {
    return (0).toLocaleString(
      'en-US',
      {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }
    ).replace(/\d/g, '').trim()
  } else {
    return '$';
  }
}

export const loadCouponTemplate = (callback, src) => {
  const existingScript = document.getElementById('coupon_template');
  if (existingScript != null) {
    existingScript.remove()
  }

  const script = document.createElement('script');
  script.src = src;
  script.id = 'coupon_template';
  script.async = true;
  document.body.appendChild(script);
  script.onload = () => {
    if (callback) callback();
  };
  /*  if (existingScript && callback) callback(); */
};

export const transformEngagePersonaLogData = (data, persona) => {
  let engageLogsData = [];
  if (persona === "wc") {

    let wc_flag = false;
    data.map((e, i) => {
      let engageLogs = {
        status: e.wc_status,
        split: e.wrong_coupon_trigger_split,
        site_id: e.site_id,
        date: e.prod_invalidated_on
      }
      if (i === 0) {
        engageLogsData.push(engageLogs);
      } else if (e.wc_status && e.engage_status) {
        wc_flag = true;
        engageLogsData.push(engageLogs);
      } else if (!e.engage_status && wc_flag) {
        engageLogs.status = false
        engageLogsData.push(engageLogs);
      }
    });

    engageLogsData.reverse()

  }
  if (persona === "ti3") {
    let hesitant_flag = false;
    data.map((e, i) => {
      let engageLogs = {
        status: e.hesitant_status,
        split: e.hesitant_trigger_split,
        site_id: e.site_id,
        date: e.prod_invalidated_on
      }
      if (i === 0) {
        engageLogsData.push(engageLogs);
      } else if (e.hesitant_status && e.engage_status) {
        hesitant_flag = true;
        engageLogsData.push(engageLogs);
      } else if (!e.engage_status && hesitant_flag) {
        engageLogs.status = false
        engageLogsData.push(engageLogs);
      }
    });

    engageLogsData.reverse()
  }
  if (persona === "e-ei") {

    let eei_flag = false;
    data.map((e, i) => {
      let engageLogs = {
        status: e.eei_status,
        split: e.extension_trigger_split,
        site_id: e.site_id,
        date: e.prod_invalidated_on
      }
      if (i === 0) {
        engageLogsData.push(engageLogs);
      } else if (e.eei_status && e.engage_status) {
        eei_flag = true;
        engageLogsData.push(engageLogs);
      } else if (!e.engage_status && eei_flag) {
        engageLogs.status = false
        engageLogsData.push(engageLogs);
      }
    });

    engageLogsData.reverse()
  }
  if (persona === "epr") {
    let cr_flag = false;
    data.map((e, i) => {
      let engageLogs = {
        status: e.prediction_status,
        split: e.prediction_trigger_split,
        site_id: e.site_id,
        date: e.prod_invalidated_on
      }
      if (i === 0) {
        engageLogsData.push(engageLogs);
      } else if (e.prediction_status && e.engage_status) {
        cr_flag = true;
        engageLogsData.push(engageLogs);
      } else if (!e.engage_status && cr_flag) {
        engageLogs.status = false
        engageLogsData.push(engageLogs);
      }
    });

    engageLogsData.reverse()
  }
  if (persona === "cs") {
    let whynot_flag = false;
    data.map((e, i) => {
      let engageLogs = {
        status: e.why_not_status,
        split: e.why_not_trigger_split,
        site_id: e.site_id,
        date: e.prod_invalidated_on
      }
      if (i === 0) {
        engageLogsData.push(engageLogs);
      } else if (e.why_not_status && e.engage_status) {
        whynot_flag = true;
        engageLogsData.push(engageLogs);
      } else if (!e.engage_status && whynot_flag) {
        engageLogs.status = false
        engageLogsData.push(engageLogs);
      }
    });

    engageLogsData.reverse()
  }
  return engageLogsData;
}

export const getColor = () => {
  return "hsl(" + 360 * Math.random() + ',' +
    (25 + 20 * Math.random()) + '%,' +
    (55 + 20 * Math.random()) + '%)'
}

export const stringIntoArrayUsingSeparator = (str, separator) => {
  let stringArray = str.split(separator);
  return stringArray;
}

export const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

export const sendGAHit = async (event, category, data) => {
  await window.gtag(event, category, data);
}

export const getFirstAndLastDayUsingMonthIndex = (monthYear, monthIndex) => {
  // Get the first day of the month
  const firstDayOfMonth = moment({ year: monthYear, month: monthIndex }).startOf('month').format('YYYY-MM-DD');

  // Get the last day of the month
  const lastDayOfMonth = moment({ year: monthYear, month: monthIndex }).endOf('month').format('YYYY-MM-DD');

  return {
    firstDayOfMonth,
    lastDayOfMonth
  }
}
export const getFirstAndLastDayUsingWeekIndex = (weekYear, weekIndex) => {
  // Get the first day of the week
  const firstDayOfWeek = moment().year(weekYear).isoWeek(weekIndex).startOf('isoWeek');

  // Get the last day of the week
  const lastDayOfWeek = moment().year(weekYear).isoWeek(weekIndex).endOf('isoWeek');

  return {
    firstDayOfWeek,
    lastDayOfWeek
  }
}

export const getStatisticalSignificance = (body) => {
  let controlConversions = body.cg_transactions
  let controlSessions = body.cg_users
  let experimentConversions = body.pg_transactions
  let experimentSessions = body.pg_users
  // Calculate the conversion rate for the control group
  let controlConversionRate = controlConversions / controlSessions;

  // Calculate the conversion rate for the experiment group
  let experimentConversionRate = experimentConversions / experimentSessions;

  /*
    * Standard Error calculated as root(p x (1-p)/ N)
  */

  let standardErrorControl = Math.sqrt(controlConversionRate * (1 - controlConversionRate) / controlSessions);
  let standardErrorExperiment = Math.sqrt(experimentConversionRate * (1 - experimentConversionRate) / experimentSessions);

  /*
  * Z-Score calculated as (control_p - experiment_p) / root( SE_Control ^2 + SE_Experiment ^2)
  */
  let zScore = (controlConversionRate - experimentConversionRate) / Math.sqrt(Math.pow(standardErrorControl, 2) + Math.pow(standardErrorExperiment, 2));

  // Define z-score ranges for different confidence intervals
  let ninetyFivePercentZScore = 1.96;

  /*
  * Z-Score ranges for 90, 95 and 99 percent confidence intervals
  *  for a two tailed test are +/- 1.65, +/- 1.96 and +/- 2.58 respectively
  */
  let ninetyFivePercentTest = false;

  if (zScore < -ninetyFivePercentZScore || zScore > ninetyFivePercentZScore) {
    ninetyFivePercentTest = true;
  }

  return ninetyFivePercentTest
}


export const convertNumbertoCurrencyFormat = (num, currency, minFrac = 2, maxFrac = 2) => {
  if (currency === '') {
    return Math.round(num).toLocaleString('en-US')
  }
  if (num !== undefined && num !== null) {
    num = num * 1;
    if (num >= 100) {
      return Math.round(num).toLocaleString('en-US', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 })
    } else {
      return parseFloat(num).toLocaleString('en-US', { style: 'currency', currency, minimumFractionDigits: minFrac, maximumFractionDigits: maxFrac })
    }
  } else {
    return 0;
  }
}

export const convertSecondsToReadableFormat = (d) => {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hrs ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " secs") : "";
  return hDisplay + mDisplay + sDisplay;
}

export const metricsPerNumberOfUsers = (num, lift = 1, perNumberOfUsers = 1, maxFraction = 0) => {
  if (num !== undefined && num !== null) {
    num = num * 1;
    if (maxFraction === 0 || num >= 100) {
      return Math.round(num * lift * perNumberOfUsers);
    }
    return parseFloat(num * lift * perNumberOfUsers).toFixed(maxFraction);
  }
  return 0;

}

export const shoppersCurrentDetails = (s) => {

  const checkStatus = (status, isBucketActive) => {
    if (isBucketActive) {
      if (status !== undefined && status !== null && status !== '' && status !== false) {
        return true
      } else {
        return false
      }
    }
  }
  const checkSplit = (split) => {
    if (split !== undefined && split !== null && split !== '' && split !== false) {
      return Math.abs(split)
    } else {
      return "-"
    }
  }

  const splitAndActiveStatus = {
    "1": {
      split: checkSplit(s.wrong_coupon_trigger_split),
      isActive: checkStatus(s.wrong_coupon, s.engage),
    },
    "2": {
      split: checkSplit(s.hesitant_trigger_split),
      isActive: checkStatus(s.hesitant_trigger, s.engage),
    },
    "3": {
      split: checkSplit(s.extension_trigger_split),
      isActive: checkStatus(s.extension_trigger, s.engage),
    },
    "4": {
      split: checkSplit(s.prediction_trigger_split),
      isActive: checkStatus(s.prediction_trigger, s.engage),
    },
    "5": {
      split: checkSplit(s.why_not_trigger_split),
      isActive: checkStatus(s.whynot_trigger, s.engage),
    },
    "6": {
      split: checkSplit(s.wrong_coupon_trigger_split),
      isActive: checkStatus(false, s.engage),
    },
    "7": {
      split: checkSplit(s.ab_perc),
      isActive: checkStatus(s.ab_status, s.ab_status),
    },
  }
  return splitAndActiveStatus;
}

export default loadCouponTemplate;