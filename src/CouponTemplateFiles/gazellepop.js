function createTemplate(engageDeals) {
  let elem = document.getElementById("brandlock-ppe-deals-main");
  /*  let brandlockPpeDealsSet = document.getElementById("brandlock-ppe-deals-set"); */
  if (elem !== null) {
    elem.outerHTML = "";
  }
  var deals = engageDeals;
  var template = "";
  template +=
    '<style>.brandlock-ppe{position:relative;border:1px solid #fff;background-color:#fff;border-radius:0.75em}.brandlock-ppe .bl-panel{height:100%;outline:0px;width:100%;overflow:auto}.brandlock-ppe .bl-title{background-size: 110px 34px;text-indent: -10000em;width: 150px;display: inline-block;padding-top: .3125rem;padding-bottom: 2.3125rem;margin-right: 1rem;font-size: 1.25rem;line-height: inherit;white-space: nowrap;}.brandlock-ppe .bl-column{float:left;padding:10px;box-sizing:border-box;vertical-align:middle}.brandlock-ppe .bl-column.bl-i{width:6%;  background-repeat: no-repeat; margin-top: 0.6em;}.brandlock-ppe .bl-column.bl-ii{width:75%}.brandlock-ppe .bl-column.bl-iii{width:34%;padding-top:0.8em;font-size:16px;display:none}.brandlock-ppe .bl-column.bl-iv{width:25%} .brandlock-copy{ font-size:14px!important; } @media screen and (max-width: 600px){.brandlock-ppe .bl-column.bl-i{width:100%}.brandlock-ppe .bl-column.bl-ii{width:100%}.brandlock-ppe .bl-column.bl-iii{width:100%}.brandlock-ppe .bl-column.bl-iv{width:100%}}.brandlock-ppe .bl-left{text-align:left}.brandlock-ppe .bl-right{text-align:right}.brandlock-ppe .bl-center{text-align:center}.brandlock-ppe .bl-tag{}.brandlock-ppe .bl-clipboard{font-size:1em;padding-right:5px;padding-top:2px}.brandlock-ppe .bl-bold{font-weight:bold;color:#000000}.brandlock-ppe .bl-grey{color:#000000;font-size:14px}.brandlock-ppe .bl-row{border-top:1px solid #e4e4e4}.brandlock-ppe .bl-row:after{content:"";display:table;clear:both}.brandlock-ppe .bl-cross{position:absolute;right:5px;top:5px;z-index:10;margin:0}.brandlock-ppe .bl-cross a{width:13px;height:13px;display:block;cursor:pointer}.brandlock-ppe .bl-close{margin:0 auto;padding-top:2em}.brandlock-ppe .bl-close .bl-button{font-size:18px;padding:10px 50px}.brandlock-ppe .bl-button{display:inline-block;padding:4px 14px;font-size:18px;cursor:pointer;text-align:center;text-decoration:none;outline:none;color:#FFF;font-weight: bold;background-color:#ff6900;border:none;border-radius:0px;}#brandlock-ppe-deals{display:block;position:relative;z-index:999999;top:0;left:0;bottom:0;right:0;text-align:center;vertical-align:middle;font-size:14px}#brandlock-ppe-deals-success{display:none;position:fixed;padding: 10px;border:1px solid;border-radius:0.2em;color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6} @keyframes brandlock-ppe-blinker{50%{opacity:0}}</style>';

  template +=
    '<div id="brandlock-ppe-deals-set" style="display: none;position: fixed;height: 25px;padding: 0px 0px 0px 0px;top: 50%;width: 90px;z-index: 999995;cursor: pointer;right: -34px; font-size: 1.1em; transform: rotate(-90deg); background-color: #ff6900;border: 1px solid #ff6900;font-weight: bold;text-align: center;color:#ffffff;border-top-right-radius: 0px; border-top-left-radius: 0px;">Coupons</div>';
  template += '<div id="brandlock-ppe-deals">';
  template += '<div id="bl-engage-success-msg"></div>';
  template += '<div class="brandlock-ppe">';
  template +=
    '<div tabindex="-1" class="bl-panel"> <div class="bl-cross"> <a id="brandlock-ppe-off-ln" title="Close"> <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="0px" height="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve" style="width: 100%; height: 100%; vertical-align: top; fill: #58595b; -webkit-transition: all .11s linear; transition: all .11s linear;"> <polygon id="x-mark-icon" points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5 "> </polygon> </svg> </a></div>';
  template +=
    '<div style="padding: 2em;"><div style="margin: 0 auto;" class="bl-left"><div class="blue-bg" style="background: #fff;color: #fff;margin-bottom: 15px;text-align: center;"><img width=125px src="https://cdn.shopify.com/s/files/1/0008/9296/0821/t/208/assets/gazelle-logo.svg?v=16115985769262835509"></img> </div>';

  template +=
  '<p id="engage-body-title-msg" style="display:none" class="bl-lora" id="bl-ppe-title-msg"> <span class="bl-bold">Oops! Looks like your code didn\'t work.</span> <span class="bl-grey">Just click the \'Apply\' button below and the promo code will be applied automatically.</span> </p></div> <div style="height:15px;"></div>';
  template += '<div style="margin: 0 auto;" class="bl-left">';
  var aStyle = "",
    aTxt = "Copy";
  for (var i = 0; i < deals.length; i++) {
    var promo = deals[i].c,
      promoCls = "brandlock-copy";
    var aStyle = "",
      aTxt = "Apply";
    aStyle = "";

    template += '<div class="bl-row">';
    template +=
      '<div class="bl-column bl-ii"> <div style="line-height:17px"><span class="bl-bold" >' +
      deals[i].l +
      '</span> </div><div class="bl-grey" style="font-size:11px">' +
      deals[i].e +
      "</div></div>";
    template +=
      '<div class="bl-column bl-iii"> <span class="bl-bold" class="bl-grey" style="font-size:14px">' +
      promo +
      "</span></div>";
    template +=
      '<div class="bl-column bl-iv"> <button class="bl-button ' +
      promoCls +
      '" ' +
      aStyle +
      ' name="' +
      deals[i].c +
      '"> <em name="' +
      deals[i].c +
      '" class="size8 icon-premiumgift black pull-left bl-clipboard"></em>' +
      aTxt +
      "</button></div>";
    template += "</div>";
  }
  template += '<div class="bl-row"></div> </div>';
  template +=
    '<div class="bl-close bl-center bl-bold"> <a id="brandlock-ppe-off-btn" style="color:#000000;text-decoration: underline;"  href="javascript:void(0)"> No, Thank You </a> </div> </div></div></div></div>';
  var ppeD = document.createElement("div");
  ppeD.id = "brandlock-ppe-deals-main";
  ppeD.innerHTML = template;
  //document.body.appendChild(ppeD);
  document.getElementsByClassName("couponPreviewBox")[0].appendChild(ppeD);
}

window.createTemplate = createTemplate;
