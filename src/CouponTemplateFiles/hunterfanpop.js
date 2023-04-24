function createTemplate(engageDeals){
    let elem = document.getElementById("brandlock-ppe-deals-main");
    /*  let brandlockPpeDealsSet = document.getElementById("brandlock-ppe-deals-set"); */
    if(elem !== null){
        elem.outerHTML = "";
    }
    var deals = engageDeals;
    var template = "";
    template += '<style>.bl-tiempos{font-family:"Tiempos"}.bl-sofia-pro{}.brandlock-ppe{position:relative;border:1px solid #7d7d7d;background-color:#fff;border-radius:0em}.brandlock-ppe .bl-panel{height:100%;outline:0;width:100%;overflow:auto}.brandlock-ppe .bl-title{width:280px;display:inline-block;padding-top:.3125rem;padding-bottom:0em;line-height:inherit;white-space:nowrap}.brandlock-ppe .bl-msg1{font-weight:600;color:#2f5a62;font-size:24px;padding:6px;letter-spacing:.2px;transform:scaleY(1.1)}.brandlock-ppe .bl-msg2{font-weight:300;color:#1f1c1d;font-size:18px;padding:5px;opacity:0.6}.brandlock-ppe .bl-column{float:left;padding:10px;box-sizing:border-box;vertical-align:middle}.brandlock-ppe .bl-column.bl-i{width:5%;background-repeat:no-repeat}.brandlock-ppe .bl-column.bl-ii{width:69%}.brandlock-ppe .bl-column.bl-ii .l1{font-weight:1000;color:#1f1c1d;font-size:18px}.brandlock-ppe .bl-column.bl-ii .l2{font-weight:100;color:#1f1c1d;font-size:14px;padding-top:4px;opacity:0.6}.brandlock-ppe .bl-column.bl-iii{width:27%;font-size:24px;font-family:"Tiempos";font-weight:700;color:#2f5a62;margin-top:8px}.brandlock-ppe .bl-column.bl-iv{width:30%;padding-top: 15px;}@media screen and (max-width: 600px){.brandlock-ppe .bl-column.bl-i{width:100%}.brandlock-ppe .bl-column.bl-ii{width:100%}.brandlock-ppe .bl-column.bl-iii{width:100%}.brandlock-ppe .bl-column.bl-iv{width:100%}}.brandlock-ppe .bl-left{text-align:left}.brandlock-ppe .bl-right{text-align:right}.brandlock-ppe .bl-clipboard{font-size:1em;padding-right:5px;padding-top:2px}.brandlock-ppe .bl-bold{font-size:14px;font-weight:700;color:#000000}.brandlock-ppe .bl-grey{color:#666}.brandlock-ppe .bl-row{border-top:1px solid #d1cdca}.brandlock-ppe .bl-row:after{content:"";display:table;clear:both}.brandlock-ppe .bl-cross{position:absolute;right:10px;top:10px;z-index:10;margin:0}.brandlock-ppe .bl-cross a{width:22px;height:22px;display:block;cursor:pointer;padding-top:5px;padding-right:5px}.brandlock-ppe .bl-close{margin:0 auto;padding-top:2em;color:#1f1c1d;font-size:14px;font-weight:300;text-align:center;opacity:.6;text-decoration:underline}.brandlock-ppe .bl-button{padding:9px 17px;font-size:10px;cursor:pointer;text-align:center;color:#fff;background-color:#537f53;border:none;border-radius:0em;font-weight:bold;letter-spacing:2px;text-transform:uppercase;width:89%}#brandlock-ppe-deals{display:block;position:relative;z-index:999999;text-align:center;vertical-align:middle;font-size:14px}#brandlock-ppe-deals-success{display:none;position:fixed;padding:10px;top:5%;left:45%;width:41em;margin-left:-15em;border:1px solid;border-radius:.2em;color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6}@keyframes brandlock-ppe-blinker{50%{opacity:0}}</style>';
    
    template += '<div id="brandlock-ppe-deals-set" style="display: none; color:#fff;position: fixed;height: 25px;padding: 0px 0px 0px 0px;top: 50%;width: 90px;z-index: 999995;cursor: pointer;right: -34px; font-size: 1.2em; transform: rotate(-90deg); background-color: #537f53; border: 1px solid #537f53;font-weight: bold;text-align: center;border-top-right-radius:0px; border-top-left-radius:0px;">Coupons</div>';
    template += '<div id="brandlock-ppe-deals">';
    template += '<div id="bl-engage-success-msg"></div>';
    template += '<div class="brandlock-ppe">';
    template += '<div tabindex="-1" class="bl-panel"> <div class="bl-cross"> <a id="brandlock-ppe-off-ln" title="Close"> <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="0px" height="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve" style="width: 100%; height: 100%; vertical-align: top; fill: #58595b; -webkit-transition: all .11s linear; transition: all .11s linear;"> <polygon id="x-mark-icon" points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5 "> </polygon> </svg> </a></div>';
    template += '<div style="padding: 2em;"><div style="margin: 0 auto;" class="bl-left"><div class="blue-bg" style="background: #fff;color: #fff;margin-bottom: 15px;text-align: center;"><img width=125px src="https://images.hunterfan.com/s/files/1/0259/4629/2284/files/Hunter_Logo__2021_RGB_Green_002.png?v=1640119677"></img> </div>';
    
    template +=
    '<p id="engage-body-title-msg" class="bl-lora" id="bl-ppe-title-msg" style="display:none"> <span class="bl-bold">Oops! Looks like your code didn\'t work.</span> <span class="bl-grey">Just click the \'Apply\' button below and the promo code will be applied automatically.</span> </p></div> <div style="height:15px;"></div>';
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
                    template += '<div class="bl-column bl-ii"> <div style="line-height:17px"><span class="bl-bold" >' + deals[i].l + '</span> </div><div class="bl-grey" style="font-size:11px">' + deals[i].e + '</div></div>'
                        template += '<div class="bl-column bl-iii" style="display:none"> <span class="bl-bold" class="bl-grey" style="">' + promo + '</span></div>'
                    template += '<div class="bl-column bl-iv"> <button class="bl-button ' + promoCls + '" ' + aStyle + ' name="' + deals[i].c + '"> <em name="' + deals[i].c + '" class="size8 icon-premiumgift black pull-left bl-clipboard"></em>' + aTxt + '</button></div>'
                    template += '</div>';
    }
    template += '<div class="bl-row"></div> </div>'
    template += '<div class="bl-close bl-center bl-bold"> <a id="brandlock-ppe-off-btn" style="color:#000000;text-decoration: underline;"  href="javascript:void(0)"> No, Thank You </a> </div> </div></div></div></div>';
    var ppeD = document.createElement("div");
    ppeD.id = "brandlock-ppe-deals-main"
    ppeD.innerHTML = template;
    //document.body.appendChild(ppeD);
    document.getElementsByClassName("couponPreviewBox")[0].appendChild(ppeD);    
    
  }

  window.createTemplate = createTemplate;