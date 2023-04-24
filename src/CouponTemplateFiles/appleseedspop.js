function createTemplate(engageDeals) {
  let elem = document.getElementById("brandlock-ppe-deals-main");
  /*  let brandlockPpeDealsSet = document.getElementById("brandlock-ppe-deals-set"); */
  if (elem !== null) {
    elem.outerHTML = "";
  }
  var deals = engageDeals;
  var template = "";
  template +=
    '<style>.brandlock-ppe{position:relative;border:1px solid #000;background-color:#fff;border-radius:0.75em}.brandlock-ppe .bl-panel{height:100%;outline:0px;width:100%;overflow:auto}.brandlock-ppe .bl-title{background-size: 110px 34px;text-indent: -10000em;width: 150px;display: inline-block;padding-top: .3125rem;padding-bottom: 2.3125rem;margin-right: 1rem;font-size: 1.25rem;line-height: inherit;white-space: nowrap;}.brandlock-ppe .bl-column{float:left;padding:10px;box-sizing:border-box;vertical-align:middle}.brandlock-ppe .bl-column.bl-i{width:6%;  background-repeat: no-repeat; margin-top: 0.6em;}.brandlock-ppe .bl-column.bl-ii{width:49%}.brandlock-ppe .bl-column.bl-iii{width:25%;padding-top:0.8em;font-size:16px}.brandlock-ppe .bl-column.bl-iv{width:20%} .brandlock-copy{ font-size:14px!important; } @media screen and (max-width: 600px){.brandlock-ppe .bl-column.bl-i{width:100%}.brandlock-ppe .bl-column.bl-ii{width:100%}.brandlock-ppe .bl-column.bl-iii{width:100%}.brandlock-ppe .bl-column.bl-iv{width:100%}}.brandlock-ppe .bl-left{text-align:left}.brandlock-ppe .bl-right{text-align:right}.brandlock-ppe .bl-center{text-align:center}.brandlock-ppe .bl-tag{}.brandlock-ppe .bl-clipboard{font-size:1em;padding-right:5px;padding-top:2px}.brandlock-ppe .bl-bold{font-weight:bold}.brandlock-ppe .bl-grey{color:#9f9f9f}.brandlock-ppe .bl-row{border-top:1px solid #e4e4e4}.brandlock-ppe .bl-row:after{content:"";display:table;clear:both}.brandlock-ppe .bl-cross{position:absolute;right:-15px;top:-15px;z-index:10;margin:0}.brandlock-ppe .bl-cross a{width:13px;height:13px;display:block;cursor:pointer}.brandlock-ppe .bl-close{margin:0 auto;padding-top:2em}.brandlock-ppe .bl-close .bl-button{font-size:18px;padding:10px 50px}.brandlock-ppe .bl-button{display:inline-block;padding:4px 14px;font-size:18px;cursor:pointer;text-align:center;text-decoration:none;outline:none;color:#FFF;font-weight: bold;background-color:#000000;border:none;border-radius:0px;}#brandlock-ppe-deals{display:block;position:relative;z-index:999999;text-align:center;vertical-align:middle;font-size:14px}#brandlock-ppe-deals-success{display:none;position:fixed;padding: 10px;top:5%;left:45%;width:41em;margin-left:-15em;border:1px solid;border-radius:0.2em;color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6} @keyframes brandlock-ppe-blinker{50%{opacity:0}}</style>';

  template +=
    '<div id="brandlock-ppe-deals-set" style="display: none;position: fixed;height: 25px;padding: 0px 0px 0px 0px;top: 50%;width: 90px;z-index: 999995;cursor: pointer;right: -34px; font-size: 1.1em; transform: rotate(-90deg); background-color: #000000;border: 1px solid #000000;font-weight: bold;text-align: center;color:#ffffff;border-top-right-radius: 0px; border-top-left-radius: 0px;">Coupons</div>';
  template += '<div id="brandlock-ppe-deals">';
  template += '<div id="brandlock-ppe-deals-success"></div>';
  template += '<div class="brandlock-ppe">';
  template +=
    '<div tabindex="-1" class="bl-panel"> <div class="bl-cross"> <button id="brandlock-ppe-off-ln" type="button" style="border-radius: 50px; line-height: 0; display: block; height: 30px; width: 30px; top: -15px; right: -15px; background: #000; "><span aria-hidden="true" class="icon-font icon-heavy-multi-x" style="font-size: 1.5em;color: #fff !important; margin-top: -5px;"></span><span class="sr-only">Close</span></button></div>';
  template +=
    '<div style="padding: 2em;"><div style="margin: 0 auto;" class="bl-left"><div class="blue-bg" style="background: #9d0b0e;color: #fff;margin-bottom: 15px;text-align: center;"><img alt="appleseeds" src="https://www.appleseeds.com/static/images/appleseeds/logo_white.svg" title="appleseeds" style=" height: auto; max-width: 300px; padding: 10px 0;"> </div><p id="bl-ppe-title-msg" style="display:none"> <span class="bl-bold">Oops! Looks like your code didn\'t work.</span> <span class="bl-grey">Just click the \'Apply\' button below and the promo code will be applied automatically.</span> </p></div> <div style="height:15px;"></div>';
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
      '<div class="bl-column bl-i"><span class="icon icon-cart" aria-hidden="true"></span></div>';
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