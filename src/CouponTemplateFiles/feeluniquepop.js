function createTemplate(engageDeals) {
    let elem = document.getElementById("brandlock-ppe-deals-main");
    /*  let brandlockPpeDealsSet = document.getElementById("brandlock-ppe-deals-set"); */
    if (elem !== null) {
        elem.outerHTML = "";
    }
    var deals = engageDeals;
    var template = "";
    template += '<style>.bl-ff{} .brandlock-ppe{position:relative;border:1px solid #ccc;background-color:#fff;border-radius:0.75em}.brandlock-ppe .bl-panel{height:100%;outline:0px;width:100%;overflow:auto}.brandlock-ppe .bl-title{width: 350px;display: inline-block;padding-top: .3125rem;padding-bottom: 1.7125rem;margin-right: 1rem;font-size: 1.25rem;line-height: inherit;white-space: nowrap;}.brandlock-ppe .bl-column{float:left;padding:10px;box-sizing:border-box;vertical-align:middle}.brandlock-ppe .bl-column.bl-i{width:5%; background: url(https://www.fila.com/on/demandware.static/Sites-FILA-Site/-/default/dw73afae12/images/header/cart.svg); background-repeat: no-repeat; margin-top: 1em;}.brandlock-ppe .bl-column.bl-ii{width:50%}.brandlock-ppe .bl-column.bl-iii{width:30%;padding-top:1em;font-size:16px}.brandlock-ppe .bl-column.bl-iv{width:18%} @media screen and (max-width: 600px){.brandlock-ppe .bl-column.bl-i{width:100%}.brandlock-ppe .bl-column.bl-ii{width:100%}.brandlock-ppe .bl-column.bl-iii{width:100%}.brandlock-ppe .bl-column.bl-iv{width:100%}}.brandlock-ppe .bl-left{text-align:left}.brandlock-ppe .bl-right{text-align:right}.brandlock-ppe .bl-center{text-align:center}.brandlock-ppe .bl-tag{}.brandlock-ppe .bl-clipboard{font-size:1em;padding-right:5px;padding-top:2px}.brandlock-ppe .bl-bold{font-weight:bold; color:#000000}.brandlock-ppe .bl-grey{color:#9f9f9f}.brandlock-ppe .bl-row{border-top:1px solid #e4e4e4}.brandlock-ppe .bl-row:after{content:"";display:table;clear:both}.brandlock-ppe .bl-cross{position:absolute;right:10px;top:10px;z-index:10;margin:0}.brandlock-ppe .bl-cross a{width:13px;height:13px;display:block;cursor:pointer}.brandlock-ppe .bl-close{margin:0 auto;padding-top:2em}.brandlock-ppe .bl-close .bl-button{font-size:14px;padding:10px 50px}.brandlock-ppe .bl-button{display:inline-block;padding:5px 14px;font-size:10px;cursor:pointer;text-align:center;text-decoration:none;outline:none;color:#FFFFFF;font-weight: bold;background-color:#000000;border:none;border-radius:50px;}#brandlock-ppe-deals{display:block;position:relative;z-index:999999;text-align:center;vertical-align:middle;font-size:14px}#brandlock-ppe-deals-success{display:none;position:fixed;padding: 10px;top:5%;left:45%;width:41em;margin-left:-15em;border:1px solid;border-radius:0.2em;color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6} @keyframes brandlock-ppe-blinker{50%{opacity:0}}</style>';

    template += '<div id="brandlock-ppe-deals-set" class="" style="display: none;position: fixed; padding: 0px 0px 0px 0px;top: 65%;width: 90px;z-index: 999995;cursor: pointer;right: -34px; font-size: 1.2em; transform: rotate(-90deg); background-color: #000; color: #FFF; border: 1px solid #cccccc;font-weight: bold;text-align: center;border-top-right-radius: 10px; border-top-left-radius: 10px;">Coupons</div>';
    template += '<div id="brandlock-ppe-deals">';
    template += '<div id="brandlock-ppe-deals-success"></div>';
    template += '<div class="brandlock-ppe">';
    template += '<div tabindex="-1" class="bl-panel"> <div class="bl-cross"> <a id="brandlock-ppe-off-ln" title="Close"> <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="0px" height="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve" style="width: 100%; height: 100%; vertical-align: top; fill: #58595b; -webkit-transition: all .11s linear; transition: all .11s linear;"> <polygon id="x-mark-icon" points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5 "> </polygon> </svg> </a></div>';
    template += '<div style="padding: 2em;"><div style="margin: 0 auto;" class="bl-left"><div><a href="/" class="bl-title"><img src="https://www.feelunique.com/assets/img/feelunique-logo.svg" alt="feelunique.com - The Destination For Beauty" width="80%"></a></div>';
    template += '<p id="bl-ppe-title-msg" class="default-title-msg-popup" style="display:block"> <span  class="bl-bold">We\'re making it easy for you to save!</span> <span  class="bl-grey bl-ff">Just click the \'Apply\' button below and the promo code will be applied automatically.</span> </p>';
    // template += '<p id="bl-ppe-title-msg" class="default-title-msg-popup" style="display:block"> <span style="color: transparent;text-shadow: 0 0 10px #000;" class="bl-bold">We\'re making it easy for you to save!</span> <span style="color:transparent; text-shadow: 0 0 10px #000;" class="bl-grey bl-ff">Just click the \'Apply\' button below and the promo code will be applied automatically.</span> </p>';
    template += '</div><div class="spacing-text"></div>';
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
        template += '<div class="bl-column bl-iii"> <span class="bl-bold" class="bl-grey" style="font-size:14px">' + promo + '</span></div>'
        template += '<div class="bl-column bl-iv"> <button class="bl-button ' + promoCls + '" ' + aStyle + ' name="' + deals[i].c + '"> <em name="' + deals[i].c + '" class="size8 icon-premiumgift black pull-left bl-clipboard"></em>' + aTxt + '</button></div>'
        template += '</div>';
    }
    template += '<div class="bl-row"></div> </div>'
    template += '<div class="bl-close bl-center"> <button id="brandlock-ppe-off-btn" class="bl-button" >Close</button></div> </div></div></div></div>';
    var ppeD = document.createElement("div");
    ppeD.id = "brandlock-ppe-deals-main"
    ppeD.innerHTML = template;
    //document.body.appendChild(ppeD);
    document.getElementsByClassName("couponPreviewBox")[0].appendChild(ppeD);

}

window.createTemplate = createTemplate;