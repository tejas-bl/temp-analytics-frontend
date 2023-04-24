function createTemplate(engageDeals){
    let elem = document.getElementById("brandlock-ppe-deals-main");
    /*  let brandlockPpeDealsSet = document.getElementById("brandlock-ppe-deals-set"); */
    if(elem !== null){
        elem.outerHTML = "";
    }
    var deals = engageDeals;
    var template = "";
    template += '<style>.bl-upper{text-transform: uppercase;}.bl-lora{font-family:"Lora";}.bl-karla{font-family:"Karla";}.brandlock-ppe{position:relative;border:1px solid #ccc;background-color:#fff;border-radius:0.75em}.brandlock-ppe .bl-panel{height:100%;outline:0px;width:100%;overflow:auto}.brandlock-ppe .bl-title{background: url();background-repeat: no-repeat;width: 300px; display: inline-block;padding-top: .3125rem;padding-bottom: 0.9125rem;margin-left: 20%;font-size: 1.25rem;line-height: inherit;white-space: nowrap;}.brandlock-ppe .bl-column{float:left;padding:10px;box-sizing:border-box;vertical-align:middle}.brandlock-ppe .bl-column.bl-i{width:5%; background: url(); background-repeat: no-repeat;}.brandlock-ppe .bl-column.bl-ii{width:55%}.brandlock-ppe .bl-column.bl-iii{width:9%;padding-top:1em;font-size:16px}.brandlock-ppe .bl-column.bl-iv{width:30%} @media screen and (max-width: 600px){.brandlock-ppe .bl-column.bl-i{width:100%}.brandlock-ppe .bl-column.bl-ii{width:100%}.brandlock-ppe .bl-column.bl-iii{width:100%}.brandlock-ppe .bl-column.bl-iv{width:100%}}.brandlock-ppe .bl-left{text-align:left}.brandlock-ppe .bl-right{text-align:right}.brandlock-ppe .bl-center{text-align:center}.brandlock-ppe .bl-tag{}.brandlock-ppe .bl-clipboard{font-size:1em;padding-right:5px;padding-top:2px}.brandlock-ppe .bl-bold{font-weight:bold}.brandlock-ppe .bl-grey{color:#9f9f9f}.brandlock-ppe .bl-row{border-top:1px solid #e4e4e4}.brandlock-ppe .bl-row:after{content:"";display:table;clear:both}.brandlock-ppe .bl-cross{position:absolute;right:10px;top:10px;z-index:10;margin:0}.brandlock-ppe .bl-cross a{width:13px;height:13px;display:block;cursor:pointer}.brandlock-ppe .bl-close{margin:0 auto;padding-top:2em}.brandlock-ppe .bl-close .bl-button{font-size:14px;padding:10px 50px}.brandlock-ppe .bl-button{display:inline-block;padding:5px 14px;font-size:10px;cursor:pointer;text-align:center;text-decoration:none;outline:none;color:#FFFFFF;font-weight: bold;background-color:#000;border:none;}#brandlock-ppe-deals{display:block;position:relative;z-index:999999;text-align:center;vertical-align:middle;font-size:14px}#brandlock-ppe-deals-success{display:none;position:fixed;padding: 10px;top:5%;left:45%;width:41em;margin-left:-15em;border:1px solid;border-radius:0.2em;color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6} @keyframes brandlock-ppe-blinker{50%{opacity:0}}</style>';
    
    template += '<div id="brandlock-ppe-deals-set" class="bl-karla" style="display: none;position: fixed; padding: 0px 0px 0px 0px;top: 65%;width: 90px;z-index: 999995;cursor: pointer;right: -34px; font-size: 1.2em; transform: rotate(-90deg); background-color: #000; color: #FFF; border: 1px solid #cccccc;font-weight: bold;text-align: center;border-top-right-radius: 10px; border-top-left-radius: 10px;">Coupons</div>';
    template += '<div id="brandlock-ppe-deals">';
    template += '<div id="bl-engage-success-msg"></div>';
    template += '<div class="brandlock-ppe">';
    template += '<div tabindex="-1" class="bl-panel"> <div class="bl-cross"> <a id="brandlock-ppe-off-ln" title="Close"> <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="0px" height="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve" style="width: 100%; height: 100%; vertical-align: top; fill: #58595b; -webkit-transition: all .11s linear; transition: all .11s linear;"> <polygon id="x-mark-icon" points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5 "> </polygon> </svg> </a></div>';
    template += '<div style="padding: 2em;"><div style="margin: 0 auto;" class="bl-left"><a href="/" class="bl-title"><img src="https://assets.bounceexchange.com/assets/uploads/clients/2801/creatives/73427fcc9ef0efc9f97ea813af93bc72.png" style="width: 100%;"/></a>';
    template += '<p class="bl-lora" id="bl-ppe-title-msg" style="display:none"> <span class="bl-bold">We\'re making it easy for you to save!</span> <span class="bl-grey">Just click the \'Copy\' button below and paste in the promo code field at checkout.</span> </p>';
    template += '</div> <div style="height:15px;"></div>';
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
                    template += '<div class="bl-column bl-i"> <svg width="13" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 17"> <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#basket" x="0" y="0" fill="#000"> <svg id="basket"> <path d="M4.055 3.692c0-1.338 1.09-2.428 2.447-2.428 1.338 0 2.427 1.09 2.427 2.428v.61H4.054v-.61zm8.792.802c-.115-.114-.267-.19-.42-.19H9.713V3.69C9.713 1.932 8.28.5 6.503.5 4.742.5 3.31 1.933 3.31 3.692v.61H.577c-.153 0-.306.078-.42.192-.115.115-.172.268-.153.44L.71 14.28c.096 1.472 1.34 2.618 2.81 2.618h5.887c1.452 0 2.695-1.146 2.81-2.6L13 4.935c0-.153-.057-.325-.153-.44z" fill="#000" fill-rule="evenodd"></path> </svg> </use> </svg></div>'
                    template += '<div class="bl-column bl-ii"> <div style="line-height:17px"><span class="bl-bold bl-karla bl-upper" >' + deals[i].l + '</span> </div><div class="bl-grey bl-lora" style="font-size:11px">' + deals[i].e + '</div></div>'
                    template += '<div class="bl-column bl-iii"> <span class="bl-bold bl-karla" class="bl-grey" style="font-size:14px"></span></div>'
                    template += '<div class="bl-column bl-iv"> <button class="bl-button bl-karla bl-upper ' + promoCls + '" ' + aStyle + ' name="' + deals[i].c + '"> <em name="' + deals[i].c + '" class="size8 icon-premiumgift black pull-left bl-clipboard"></em>' + aTxt + '</button></div>'
                    template += '</div>';
    }
    template += '<div class="bl-row"></div> </div>'
    template += '<div class="bl-close bl-center"> <button id="brandlock-ppe-off-btn" class="bl-button bl-karla" >CLOSE</button></div> </div></div></div></div>';
    var ppeD = document.createElement("div");
    ppeD.id = "brandlock-ppe-deals-main"
    ppeD.innerHTML = template;
    //document.body.appendChild(ppeD);
    document.getElementsByClassName("couponPreviewBox")[0].appendChild(ppeD);    
    
  }

  window.createTemplate = createTemplate;