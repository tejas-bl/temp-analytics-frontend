function createTemplate(engageDeals){
    let elem = document.getElementById("brandlock-ppe-deals-main");
    /*  let brandlockPpeDealsSet = document.getElementById("brandlock-ppe-deals-set"); */
    // let elem = document.getElementsByClassName("brandlock-ppe");
    if(elem !== null){
        elem.outerHTML = "";
    }
    var deals = engageDeals;
    var template = "";
    template +=
      '<style> .brandlock-ppe{position: relative;  border: 0px solid #000; background-color: #fff; border-radius: 1em;}.brandlock-ppe .bl-panel{height: 100%; outline: 0px; width: 100%; overflow: auto;}.brandlock-ppe .bl-title{background-size: 110px 34px; text-indent: -10000em; width: 150px; display: inline-block; padding-top: 0.3125rem; padding-bottom: 2.3125rem; margin-right: 1rem; font-size: 1.25rem; line-height: inherit; white-space: nowrap;}.brandlock-ppe .bl-column{float: left; padding: 8px; box-sizing: border-box; vertical-align: middle;}.brandlock-ppe .bl-column.bl-i{width: 6%; background-repeat: no-repeat; margin-top: 0.6em;}.brandlock-ppe .bl-column.bl-ii{width: 100%;}.brandlock-ppe .bl-column.bl-iii{width: 100%; padding-top: 0.6em; font-size: 16px;}#coupon-offer{font-family: sans-serif;}.brandlock-ppe .bl-column.bl-iv{width: 100%;}.brandlock-copy{font-size: 12px !important;}@media screen and (max-width: 600px){.brandlock-ppe .bl-column.bl-i{width: 100%;}.brandlock-ppe .bl-column.bl-ii{width: 100%;}.brandlock-ppe .bl-column.bl-iii{width: 100%;}.brandlock-ppe .bl-column.bl-iv{width: 100%;}}.brandlock-ppe .bl-left{text-align: center;}.brandlock-ppe .bl-right{text-align: center;}.brandlock-ppe .bl-center{text-align: center;}.brandlock-ppe .bl-clipboard{font-size: 1em; padding-right: 5px; padding-top: 2px;}.brandlock-ppe .bl-bold{font-weight: 800; letter-spacing:-1px; font-size: 16px;}#bl-ppe-title-msg .bl-grey{line-break: auto;}#coupon-code{color : #65a247; font-size: 20px; font-weight: 1000;}.brandlock-ppe .bl-grey{/*color: #9f9f9f;*/}.brandlock-ppe .bl-row{border-top: 0px solid #e4e4e4;}.brandlock-ppe .bl-row:after{content: ""; display: table; clear: both;}.brandlock-ppe .bl-cross{position: absolute; right: 6px; top: 12px; z-index: 10; margin: 0;}.brandlock-ppe .bl-cross a{width: 24px; height: 24px; display: block; cursor: pointer;}.brandlock-ppe .bl-close{margin: 0 auto; padding-top: 1em; opacity: 0.6;}.brandlock-ppe .bl-close .bl-button{font-size: 18px; padding: 10px 50px;}.brandlock-ppe .bl-button{/* display: inline-block; */ padding: 8px 24px; font-size: 18px; letter-spacing: 2px; cursor: pointer; text-align: center; text-decoration: none; outline: none; color: #fff; font-weight: bold; background-color: #65a247; border: none; border-radius: 1em;}#brandlock-ppe-deals{display: block; position: relative; z-index: 999999; text-align: center; vertical-align: middle; font-size: 14px;}#brandlock-ppe-deals-success{display: none; position: fixed; padding: 10px; top: 5%; left: 45%; width: 41em; margin-left: -15em; border: 1px solid; border-radius: 0.2em; color: #3c763d; background-color: #dff0d8; border-color: #d6e9c6;}@keyframes brandlock-ppe-blinker{50%{opacity: 0;}}</style>';
    
      template += '<div id="brandlock-ppe-deals-set" style="display: none; color:#fff;position: fixed;height: 25px;padding: 0px 0px 0px 0px;top: 50%;width: 90px;z-index: 999995;cursor: pointer;right: -34px; font-size: 1.2em; transform: rotate(-90deg); background-color: #65a437;border: 1px solid #65a437;font-weight: bold;text-align: center;border-top-right-radius:0px; border-top-left-radius:0px;">Coupons</div>';
    template += '<div id="brandlock-ppe-deals">';
    template += '<div id="bl-engage-success-msg"></div>';
    template += '<div class="brandlock-ppe">';
    template += '<div tabindex="-1" class="bl-panel"> <div class="bl-cross"> <a id="brandlock-ppe-off-ln" title="Close"> <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="0px" height="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve" style=" width: 100%; height: 100%; vertical-align: top; fill: #58595b; -webkit-transition: all 0.11s linear; transition: all 0.11s linear; " > <polygon id="x-mark-icon" points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5 " ></polygon> </svg> </a> </div>';
    template += '<div style="padding: 1em"> <div style="margin: 0 auto" class="bl-left"> <div class="blue-bg" style=" background: #fff; color: #fff; margin-bottom: 0px; text-align: center; " > <svg width="175.999" height="75" version="1.1" id="Layer_1" focusable="false" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 155 38" style="enable-background:new 0 0 155 38;" xml:space="preserve"><g> <path class="leaf two" d="M18.7,23L16,20h2.2c0.6,0,1.2,0.3,1.6,0.7l3.2,3.6c2,2.2,4.4,4.7,6.6,6.1C25,30.1,22.1,26.7,18.7,23 M12.9,23 l-2.7-3h2.2c0.6,0,1.2,0.3,1.6,0.7l3.3,3.6c2,2.2,4.2,4.7,6.4,6.1C19.1,30.1,17.1,27.7,12.9,23 M7,23l-2.8-3h2.2 c0.6,0,1.2,0.3,1.6,0.7l3.3,3.6c2.1,2.3,3.8,4.2,5.8,5.7C12.8,29.4,11.3,27.7,7,23 M7,15c4.2-4.7,5.8-6.4,10.2-7 c-2.1,1.5-3.7,3.3-5.8,5.7l-3.3,3.6c-0.4,0.5-1,0.7-1.6,0.7H4.3L7,15z M17.2,13.7L14,17.3c-0.4,0.5-1,0.7-1.6,0.7h-2.2l2.7-3 c4.2-4.7,6.3-7.1,10.7-7.5C21.5,8.9,19.2,11.5,17.2,13.7 M29.6,7.5c-2.1,1.4-4.6,3.9-6.6,6.1l-3.2,3.6c-0.4,0.5-1,0.7-1.6,0.7H16 l2.7-3C22.1,11.3,25,7.9,29.6,7.5 M35.9,30.1L35.9,30.1c-5.2,0-8.3-3.8-11.3-7L21,19.1c0,0,0-0.1,0-0.1l0,0l0,0c0,0,0-0.1,0-0.1 l3.5-3.9c3-3.2,6.2-7,11.2-7h0.1c0.6,0,1-0.4,1-1c0-0.6-0.3-1-1-1C20.2,5,13.6,4.7,9.1,9.7l-7.8,8.7C1.1,18.6,1,18.8,1,19v0v0 c0,0.2,0.1,0.4,0.2,0.6l7.8,8.7c4.5,5,11.2,4.7,26.8,3.8c0.7,0,1-0.5,1-1C36.9,30.5,36.4,30.1,35.9,30.1" fill="#76bf43"></path> <g> <path class="one" d="M54.6,24.5L54.6,24.5v0.1c0,0-0.3,0.3-0.3,0.3c-1.5,1.4-3.3,2.2-5.4,2.2c-4.4,0-8-3.6-8-8c0-4.4,3.6-8,8-8 c2.1,0,3.7,0.6,5.4,2.1c0.1,0,0.2,0.1,0.3,0.3l0.1,0.1l-0.1,0.1c-0.2,0.2-0.3,0.3-0.3,0.3l0,0l-1,1c-0.1,0.1-0.2,0.2-0.3,0.2 c-0.1,0-0.3-0.1-0.4-0.2c-1-0.9-2.4-1.4-3.7-1.4c-3,0-5.4,2.5-5.4,5.6c0,3.1,2.4,5.6,5.4,5.6c1.6,0,2.8-0.7,3.7-1.4 c0.3-0.2,0.5-0.1,0.7,0l1,1C54.4,24.3,54.5,24.3,54.6,24.5"></path> <path class="one" d="M79.1,18.8v-4c0-0.6,0.5-1.1,1.1-1.1h2.7c1.2,0,2.4,1,2.6,2.1c0.1,0.8-0.1,1.5-0.6,2.1c-0.5,0.6-1.2,0.9-1.9,0.9H79.1z M84.8,20.6c2-0.8,3.2-2.6,3.2-4.5c0-2.7-2.2-4.8-4.9-4.8h-3.4c-1.7,0-3.1,1.4-3.1,3.1v12.4h2c0.3,0,0.5-0.2,0.5-0.5v-5.5h3.2 l2.9,5.8c0.1,0.1,0.2,0.3,0.4,0.3h2.6L84.8,20.6z"></path> <path class="one" d="M93.3,11.8l0,15.1l2,0c0.3,0,0.5-0.2,0.5-0.5l0-15.1l-2,0C93.5,11.3,93.3,11.6,93.3,11.8"></path> <path class="one" d="M113.8,11.3c0,0-0.4,0-0.4,0h-1.5c-0.3,0-0.5,0.2-0.5,0.5V21c0,2.2-1.5,3.8-3.6,3.8c-2.1,0-3.5-1.6-3.5-3.8v-9.1 c0-0.3-0.2-0.5-0.5-0.5l-2,0l0,9.8c0,3.5,2.6,6.1,6.1,6.1c3.5,0,6.1-2.6,6.1-6.1l0-9.8H113.8z"></path> <path class="one" d="M62.8,20.8l2.4-6.1l2.4,6.1H62.8z M66.7,11.6c-0.1-0.2-0.2-0.3-0.4-0.3h-2.1c-0.2,0-0.4,0.1-0.4,0.3l-5.9,15.3h2.1 c0.3,0,0.7-0.2,0.8-0.5l1.3-3.3h6.6l1.3,3.3c0.1,0.3,0.4,0.5,0.8,0.5h2.1L66.7,11.6z"></path> <path class="one" d="M144.2,20.8l2.4-6.1l2.4,6.1H144.2z M148.1,11.6c-0.1-0.2-0.2-0.3-0.4-0.3h-2.1c-0.2,0-0.4,0.1-0.4,0.3l-5.9,15.3h2.1 c0.3,0,0.7-0.2,0.8-0.5l1.3-3.3h6.6l1.3,3.3c0.1,0.3,0.4,0.5,0.8,0.5h2.1L148.1,11.6z"></path> <path class="one" d="M119.6,26.9h2.3c0.1,0,0.3-0.1,0.3-0.3V11.3h-2.5V26.9z"></path> <path class="one" d="M135,26.9h-2.3c-0.1,0-0.3-0.1-0.3-0.3V11.3h2.5V26.9z"></path> <path class="one" d="M133.7,11.3h-2c-0.3,0-0.6,0.2-0.8,0.5l-3.7,11.2l-3.7-11.2c-0.1-0.3-0.4-0.5-0.8-0.5h-2l5,15.2c0.1,0.2,0.3,0.4,0.5,0.4 l1.7,0c0.2,0,0.4-0.2,0.5-0.4L133.7,11.3z"></path> </g> </g> </svg> </div>'
    
    template +=
      '<p id="engage-body-title-msg" style="text-align:center; display:none;line-height: 25px;"><span class="bl-bold" style="color: #48c6d9;font-size: 19px;">Your code is not valid. Enjoy this shipping upgrade.</span> <br> <span class="bl-grey">Just click the "Apply" button below and the promo code will be applied automatically.</span></p>';
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
      '<div class="bl-column bl-ii"> <div style="line-height:17px"><span id="coupon-code" class="bl-bold" >' +
        deals[i].l +
        '</span> </div><div class="bl-grey" style="font-size:11px">' +
        deals[i].e +
        "</div></div>";
      template +=
      '<div class="bl-column bl-iii"> <span  id="coupon-offer" class="bl-bold" class="bl-grey" style="font-size:18px">' +
        promo +
        '</span></div>';
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
    template += '<div class="bl-close bl-center"> <a id="brandlock-ppe-off-btn" style="font-weight: 100;color:#000000;text-decoration: underline;"  href="javascript:void(0)"> No, Thank You </a> </div> </div></div></div></div>';
    var ppeD = document.createElement("div");
    ppeD.id = "brandlock-ppe-deals-main"
    ppeD.innerHTML = template;
    // document.body.appendChild(ppeD);
    document.getElementsByClassName("couponPreviewBox")[0].appendChild(ppeD);    
    
  }

  window.createTemplate = createTemplate;