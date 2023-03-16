/*
Script to find prices on page
*/


// CSS Injection
// These variables need to be declared as var since the entire pdp script reloads on certain pages. Using let throws errors
var stylesOkane = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;700&display=swap');

    #okaneIcon:hover { 
        transform: scale(0.9); 
    }

    #okaneDivShadow{
        position: fixed !important;
        top: 90%;
        left: 100%;
        z-index: 2147483647 !important;
    }


`

var styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = stylesOkane
document.head.appendChild(styleSheet)
var regex = /(USD|EUR|(US \$)|€|\$|£|US\$)\s?(\d{1,})([.,](\d{1,}))?([.,](\d{1,}))?(\/EA)?(\/ea)?\+?( )?(USD|EUR|(US \$)|€|\$|£|US\$)?/;
var price_found_on_page = "no price found"
var current_spend_goal_from_sw = 0;
var current_spend_from_sw = 0;

///////////////////////////////////////////////////////////////////////////////////////////
// PDP Script 
// Execution
function execution(){
    if(document.querySelectorAll("#okaneDivShadow").length == 0){
        // If url is demo mode url from onboarding
        if(window.location.href == "https://www.amazon.com/PEACHCAT-Banana-Plushie-Hugging-Stuffed/dp/B09YH465QP/ref=sxin_15_ac_d_hl?ac_md=1-0-T3ZlcmFsbCBDaG9pY2U%3D-ac_d_hl_hl_ac&content-id=amzn1.sym.3663916c-38f6-4d73-9801-2e9551111db6%3Aamzn1.sym.3663916c-38f6-4d73-9801-2e9551111db6&crid=2AHHAQ4SG4DES&cv_ct_cx=plushies&keywords=plushies&pd_rd_i=B09YH465QP&pd_rd_r=211608fe-aacb-471d-be51-d53e353366f6&pd_rd_w=GCGte&pd_rd_wg=MI4xY&pf_rd_p=3663916c-38f6-4d73-9801-2e9551111db6&pf_rd_r=QJEM2XD0TJFDAMAZ273S&qid=1664234448&sprefix=plushie%2Caps%2C136&sr=1-1-25fd44b4-555a-4528-b40c-891e95133f20&th=1"){
            insert_injection_no_impact_demo();
            insert_injection_no_impact(true);
        } else {
            insert_injection_no_impact(false);
        }
        // window.addEventListener("beforeunload", function(e){
        //     extensionLoaded();
        // }, false);
    }
    /*
    // Determine if page is a PDP page. Returns if a page has pdpCheckText content, but only once in the viewport
    let pdp_check_on_page = identify_pdp_page();
    console.log(pdp_check_on_page[0] + "check" + pdp_check_on_page[1])
    if ( true || pdp_check_on_page[0] == 1 && pdp_check_on_page[1] < 100){
        // Flag prices with largest font size
        const undefined_font = check_okane_class_exists_and_identify_largest_price_by_font_size();
        // If there are elements flagged as prices, then enter if statement
        if(true || !undefined_font){
            // If prices are tied in font size, pick the price to thats highest in viewport. If heights are tied, do not show injection
            const tied_prices = compare_options();
            if(true || !tied_prices){
                await chrome.runtime.sendMessage({command: "checkPlaidLink"}, res => {
                    res.data = false;
                    console.log("here")
                    if(res.data){
                        /*
                        // Checks for Okane Location to make sure the script doesn't double load
                        console.log(document.querySelectorAll("#okaneLocation").length)
                        chrome.runtime.sendMessage({command: "get-spending"}, response => {
                            if(response.status == "success"){
                            chrome.storage.local.set({
                                userIncome: response.incomeData,
                                userSpendingGoal: response.spendingData
                            })
                            }  
                            chrome.runtime.sendMessage({command: "get-purchaseHistory"}, response => {
                                if(response.status == "success"){
                                    chrome.storage.local.set({
                                    userCurrentSpend: response.currentSpend
                                    })
                                }
                                if(document.querySelectorAll("#okaneLocation").length == 0){
                                    console.log("User is logged in, insert injection")
                                    chrome.storage.local.get(['userCurrentSpend','userSpendingGoal'], data => {
                                        const userCurrentSpend = data.userCurrentSpend;
                                        const userSpendingGoal = data.userSpendingGoal;
                                        insert_injection(userCurrentSpend, userSpendingGoal);
                                        window.addEventListener("beforeunload", function(e){
                                            extensionLoaded();
                                        }, false);
                                        // Observe mutations on the identified price element
                                        /*
                                        let observer = new MutationObserver(function (mutations){
                                            if(mutations.length > 0){
                                                let slicePrice = getElementsByClassName("OkanePrice")[0].textContent.trim().replace(/[^0-9.]/g, '').replace('$', '').replace(',','');
                                                let purchase_object = {
                                                        price: slicePrice,
                                                        url: window.location.hostname
                                                }
                                                setPurchasePrice(purchase_object).then(() =>{
                                                    console.log("Mutation")
                                                })
                                         }
                                         
                                    })
                                    let config = { characterData: true, attributes: false, childList: true, subtree: true };
                                    observer.observe(document.getElementsByClassName("OkanePrice")[0], config);
                                    })
                                } else {
                                    console.log("User is not logged in")
                                    const slicePrice = document.getElementsByClassName("OkanePrice")[0].textContent.trim().replace(/[^0-9.]/g, '').replace('$', '').replace(',','');
                                    let purchase_object = {
                                            price: slicePrice,
                                            url: window.location.hostname
                                    }
                                    window.addEventListener("beforeunload", function(e){
                                        extensionLoaded();
                                    }, false);
                                    setPurchasePrice(purchase_object).then(() =>{
                                    })
                                }
                            })
                        })  
                    } else {
                        console.log("Not logged in")
                        if(document.querySelectorAll("#okaneLocation").length == 0){
                            insert_injection_not_logged_in();
                        }
                    }
                })
            } else {
                console.log("Not a PDP page, tied prices")
                // Set purchase_object as null so the graphs don't display purchase_price series
                chrome.storage.local.set({
                    purchase_object: null
                })
            }
        } else {
            console.log("Not a PDP page, undefined font")
            // Set purchase_object as null so the graphs don't display purchase_price series
            chrome.storage.local.set({
                purchase_object: null
            })
        }
    } else {
        console.log("Not a PDP page")
        // Set purchase_object as null so the graphs don't display purchase_price series
        chrome.storage.local.set({
            purchase_object: null
        })
    }
    console.log("Number of OkanePrice: " + document.getElementsByClassName("OkanePrice").length)
    */
}

// Run script
execution();
//document.addEventListener("DOMContentLoaded", execution);

// Case functions
// Case 2, combine siblings and return the price to check against the regex
function pdp_case_2_create_combined_price(element){
    let sibling  = element.parentNode.firstChild;
    let combinedprice = "";
    // collecting siblings and skip over ' '
    while (sibling) {
        if (!sibling.innerText) {
        }
        else if (sibling.innerText.trim() == '$'){
            dollarsignexists = true;
            combinedprice = combinedprice.concat(sibling.innerText.trim())
        }
        else {
            combinedprice = combinedprice.concat(sibling.innerText.trim())
        }
        sibling = sibling.nextSibling;
    }
    return combinedprice
}

// Add elements to combinedprice returned in earlier function to create a price, then check against regex
function pdp_case_2_check_price(element, combinedprice){
    combinedprice = combinedprice.replace(/\s+/g, '');
    combinedprice = combinedprice.slice(0, combinedprice.length - 2) + "." + combinedprice.slice(combinedprice.length - 2, combinedprice.length);

    // Some sites break out price across sibling elements. If this has happened, make sure children are ignored by flagging them with class "OkaneIgnore"
    if(combinedprice.match(regex) && combinedprice.match(regex)[0] == combinedprice){
        let sibling  = element.parentNode.firstChild;
        // assign price / Okane to class for each element
        while (sibling) {
            if (!sibling.classList) {
            }
            else {
            sibling.classList.add(combinedprice)
            sibling.classList.add("Okane")
            }
            sibling = sibling.nextSibling;
        }
    }
}

function isElementInViewport(el, verbose) {
    const rect = el.getBoundingClientRect();
    // flag as true if details are needed
    if(verbose == true){
        console.log("Viewport")
        console.log(rect.top)
        console.log(rect.left)
        console.log(rect.bottom)
        console.log(rect.right)
        console.log(window.innerHeight)
        console.log(innerWidth)
    }
    return (
      rect.bottom > 0 &&
      rect.right > 0
    );
}

// Identify if the page is a PDP page by looping through elements in Viewport on page load + 
// count # of 'pdpCheckText's (e.g., add to cart) in Viewport. If more than 1, then its not a PDP page.
// In same loop, tag each element that has a price (according to regex above) with 'Okane' class.
// Handle 3 price cases identified:
//    Case 1: Entire price listed in one div
//    Case 2: '$' is listed in sibling; combine all siblings together and check against regex
//    Case 3: A '"" character is in front of the price, breaking the regex
function identify_pdp_page(){
    let dollarsignexists = false;
    let pdpCheckText = ["Add To Cart".toUpperCase(),"Check availability nearby".toUpperCase(), "Add to Bag".toUpperCase(), "Add+".toUpperCase(), 'Buy now with 1-Click ®'.toUpperCase(), 'Buy now with 1-Click'.toUpperCase(), 'Buy with 1-Click'.toUpperCase()
                     ,"Proceed to checkout".toUpperCase(), "checkout".toUpperCase(), "checkout now".toUpperCase(), "buy now".toUpperCase(), "place your order".toUpperCase(), "go to checkout".toUpperCase(), "continue to checkout".toUpperCase()]

    let pdp_check = 0;

    // Select all DOM elements
    let domElements = document.getElementsByTagName("*");
    domElementsLength = domElements.length

    // Loop through DOM elements and identify prices. Assign class "Okane" to any pertinent elements
    for (let a = 0; a < domElementsLength; a++){
        let element = domElements[a]
        // If element's parent has been flagged as containing the price, skip over element (this ensure we don't get two injections on the same price)
        if (element.classList.contains("OkaneIgnore")){
            continue;
        }
        let textElement = element.innerText // Fetches text content of the element
        // Check if site is a pdp page
        if(textElement != null){
            if(pdpCheckText.includes(textElement.toUpperCase())){
                pdp_check = 1;
            }
            element.classList.add("OkaneCheckedThis")
        }
        // Filter to only elements in viewport and which have a non-null text value
        if(!(textElement == null //|| !isElementInViewport(element, false)
        )){
            // Count number of add to carts in view port, if more than 1, not a PDP page
            if(pdpCheckText.includes(textElement.toUpperCase())){
                element.classList.add("PDPFlag")
            }
            // Case 1
            // Check if element text matches regex
            if(textElement.match(regex) && textElement.match(regex)[0] == textElement){
                // Rule out any elements that have a space in them and have no children
                if(element.children.length == 0 && textElement.split(' ').length-1 < 2){
                    element.classList.add("Okane")
                }
                continue;
            }
            // Case 2
            // Some sites list the '$' in a sibling element (' ', $, ' ', 690, 00). Check if '$' exists in a sibling then manually concat
            // Some sites break out price across sibling elements. Concat all siblings together into combined price to check for this edge-case
            if(!element.parentNode) {
                // handles null error cases
            } 
            else {
                let combinedprice = pdp_case_2_create_combined_price(element)
                if(combinedprice){
                    pdp_case_2_check_price(element, combinedprice);
                }
            }
            // Case 3
            // Some sites put a quote mark in front of the price. Handle this edge case
            let quoteisfirstchar = false;
            if (textElement[0] == "\""){
                quoteisfirstchar = true;
                textElement = textElement.substring(1, textElement.length-1);
            }
        }
    }
    // countofPDPFlags check
    let countOfPDPFlags = 0
    let currentPDPs = document.querySelectorAll(".PDPFlag")
    for(let x = 0; x < currentPDPs.length; x++){
        if(!currentPDPs[x].parentElement.classList.contains("PDPFlag")){
            countOfPDPFlags++;
        }
    }
    return [pdp_check, countOfPDPFlags];
}


// Sort through Okane flagged elements and add OkaneFont class to those which have the largest font
// Use the sort_unique_font_sizes as a helper to determine the largest font size
// If there are no Okane elements, function will return 'true'
function sort_unique_font_sizes(elem){
    // Store all font sizes for prices
    let font_sizes = [];
    for (let i = 0; i < elem.length; i++){
        // if(isElementInViewport(elem[i], false) == true){
            font_sizes.push(parseInt(getComputedStyle(elem[i])['fontSize']))
        // }
    }

    // Sort font_sizes from largest to smallest
    font_sizes.sort((a, b) => b - a)
                .filter((v,i,self) => self.indexOf(v) === i)
                .slice(0, 5);

    // Filter out duplicates
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    font_sizes = font_sizes.filter(onlyUnique)

    return font_sizes
}

function check_okane_class_exists_and_identify_largest_price_by_font_size(){
    // Select all identified prices
    // Not all prices are relevant. We need to filter out small fonts so that we only flag the important prices
    let elem = document.getElementsByClassName("Okane");

    font_sizes = sort_unique_font_sizes(elem)

    count = 1;
    if(font_sizes[0] == undefined){
        return true
    }
    else {
        // Flag prices that are have any of the 3 largest price fonts
        largestFontSize = font_sizes[0]

        if(largestFontSize){
            // Loop through the elements and flag those to insert the injection against with class "OkaneFont". Color them blue for testing
            for(let i=0; i<elem.length; i++) {
                if(count == 1){
                    if(parseInt(getComputedStyle(elem[i])['fontSize']) == largestFontSize || (parseInt(getComputedStyle(elem[i])['fontSize']) == (largestFontSize - 1))){
                        elem[i].classList.add("Okanereviewed")
                        // if(isElementInViewport(elem[i], false) == true){
                            countofokane = 0
                            let children = elem[i].parentNode.children;
                            for (let j = 0; j < children.length; j++) {
                                if(children[j].classList.contains("OkaneFont")){
                                    countofokane = countofokane + 1;
                                }
                        //}
                        if(countofokane == 0){
                            elem[i].classList.add("OkaneFont")
                        }
                        }
                    }
                }
            }
        }
        return false
    }
}


// If prices are tied in font, flag the one that is highest in y position with the class 'OkanePrice'
// If the height is tied, do not show the injection and return true. Otherwise, return false
function compare_options(){
    let identifiedPriceElements = document.getElementsByClassName("OkaneFont");
    // Sometimes, same price element is flagged twice (due to hidden elements in the same location)
    let uniquePriceElements =[]
    for (let j = 0; j < identifiedPriceElements.length; j++){
        if(identifiedPriceElements[j].getBoundingClientRect().width > 0 && identifiedPriceElements[j].getBoundingClientRect().height > 0){
            uniquePriceElements.push(identifiedPriceElements[j])
        }
    }
    if(uniquePriceElements.length == 0){
        return true;
    }

    // Compare height of the price elements
    maxHeight = 9999999999999999999999999999999999999999;
    tieHeight = 0;
    for (let i = 0; i < uniquePriceElements.length; i++) {
        let positionVP = uniquePriceElements[i].getBoundingClientRect().bottom;
        if(positionVP < maxHeight){
            maxHeight = positionVP
            tieHeight = 0;
        }
        else if(positionVP == maxHeight){
            tieHeight++
        }
    }
    if(tieHeight > 0){
        return true;
    } else {
        for (let i = 0; i < uniquePriceElements.length; i++) {
            if(uniquePriceElements[i].getBoundingClientRect().bottom == maxHeight){
                uniquePriceElements[i].classList.add("OkanePrice")
            }
        }
    }
    return false;
}



// Insert the actual injection; send price to service worker to be set
async function setPurchasePrice(purchase_object_to_send) {
    try{
         let response = await chrome.runtime.sendMessage({
            command: "set_purchase_object",
            purchase_object: purchase_object_to_send
        }, response => {
            if(response.message === 'success'){
                console.log("purchase object has been set");
                return true;                
            }else{
                console.log("Purchase object not sent");
                return false;
            }
        });
    }catch(error){
        console.log("error at setPurchasePrice")
    }
}

async function get_purchaseHistory(){
    try{  
        await chrome.runtime.sendMessage({command: "get-purchaseHistory"}, response => {
          if(response.status == "success"){
              chrome.storage.local.set({
                userCurrentSpend: response.transactions[response.incomeData]
            })
          }
          return
        })
    } catch(e) {
        console.log(e)
        return
    }
}

async function get_spending(){
    try{  
        let res = await chrome.runtime.sendMessage({command: "get-spending"}, response => {
          if(response.status == "success"){
            chrome.storage.local.set({
                userIncome: response.incomeData,
                userSpendingGoal: response.spendingData
            })
            return true
          } else {
            return false
          }
          return true
        })
        return res
    } catch(e) {
        console.log(e)
        return false
    }
}
// Send extension opened call to mixpanel
function extensionLoaded() {
    let mixpanel_data = {
        website_domain: window.location.hostname,
        price_on_page: price_found_on_page
    }
    try{
         let response =  chrome.runtime.sendMessage({
            command: "extension_loaded_pdp",
            mixpanel: mixpanel_data
        })
    }catch(error){
        console.log("error at extensionLoaded Mixpanel call")
    }
}

/*
// Unused, but kept in case we need to go back to google analytics later
var setTimeSpentOnUI = async(time) => {
    try{
        var response = await chrome.runtime.sendMessage({
            command: "setTimeSpentOnUI",
            payload: millisToMinutesAndSeconds(time)
        }, response =>{
            if(response.message === 'success'){
                console.log('time spent on uiInject set')
            }
            return true;
        });
    }catch(e){
        console.log(e)
    }
}

function millisToMinutesAndSeconds(millis) {
    total_seconds = parseInt(Math.floor(millis / 1000));
    return total_seconds;
}
*/

function removeInjection(id) {
    const elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
}

// Create modal to show UI injection
function showModal(priceElement){
    const modal = document.createElement("div");
    modal.id = "modalOkane";
    modal.setAttribute(
        "style",`
        height:555px;
        width:405px;
        border: none;
        background-color:white;
        right: 44px;
        bottom: 100px;
        z-index: 2147483647 !important;
        padding: 0px;
        border: 0.5px solid #333333;
        position: fixed; box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
        `
    );

    modal.innerHTML = `<iframe id="popup-content"; style="height:100%; width: 100%;"></iframe>
    <div id = "closeiframediv" style="position:absolute; top:20px; right:30px;">
    </div>`;
    
    modal.style.display = "none";

    priceElement.appendChild(modal)

    const iframe = document.getElementById("popup-content");
    iframe.src = chrome.runtime.getURL("./components/popup/ui_inject.html");
    iframe.frameBorder = 0;
    iframe.style.display = 'block'

    return modal
}


function insert_injection(userCurrentSpend, userSpendingGoal){
    let overBudgetFlag = false;
    if(userCurrentSpend >= userSpendingGoal){
        overBudgetFlag = true
    }
    const priceElement = document.getElementsByClassName("OkanePrice");

    // Create element for Okane icon
    const initialInjectionContainer = document.createElement("DIV");
    initialInjectionContainer.href = "#"
    initialInjectionContainer.id = 'okaneLocation'
    initialInjectionContainer.setAttribute(
        "style",`
            top: 450px
            
        `
    )

    initialInjectionContainer.classList.add('float');
    // initialInjectionContainer.appendChild(okaneIcon)

    const body = document.body
    body.appendChild(initialInjectionContainer);
    let modaliFrameContent = showModal(initialInjectionContainer);

    let okaneAlert = document.createElement("DIV");
    initialInjectionContainer.appendChild(okaneAlert)
    okaneAlert.href = "#"
    okaneAlert.id = 'okanePriceContainer'
    setTimeout(() => {
        okaneAlert.style.display = 'none';
      }, 5000); 
    
    // Pre-popup message
    // Create method to close injection
    okaneAlert.innerHTML = `
        <div id = "okaneAlertMessage">:) You are under your spend goal! Click to see more.</div>
    `;
    let okaneAlertMessage = document.querySelector("#okaneAlertMessage")
    okaneAlertMessage.setAttribute(
        "style",
        `
        color: rgba(196,196,196,1)
        font-family: 'Poppins', sans-serif;
        `
    )
    okaneAlert.setAttribute(
        "style",`
        height: 57px;
        width: 275px;
        outline: #B4D7B2 solid 2px;
        background-color: #B4D7B2;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        position: absolute !important;
        right: 15%;
        bottom: 33%;
        z-index: 2147483646 !important;
        padding: 0px;
        display: grid;
        grid-template-columns: 75% 25%;
        position: fixed;
        border-top-left-radius: 20px;
        border-top-right-radius: 50px;
        border-bottom-right-radius: 50px;
        border-bottom-left-radius: 20px;
        opacity: 0;
        animation: bounceIn 5s linear;
        `
    );
    if(overBudgetFlag){
        okaneAlert.setAttribute(
            "style",`
            height: 57px;
            width: 300px;
            outline: rgb(201,107,101,1) solid 2px;
            background-color: rgb(201,107,101,1);
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
            position: absolute !important;
            right: 15%;
            bottom: 33%;
            z-index: 2147483646 !important;
            padding: 0px;
            display: grid;
            grid-template-columns: 75% 25%;
            position: fixed;
            border-top-left-radius: 20px;
            border-top-right-radius: 50px;
            border-bottom-right-radius: 50px;
            border-bottom-left-radius: 20px;
            opacity: 0;
            animation: bounceIn 5s linear;
            `
        );
        okaneAlertMessage.innerHTML = ":( This purchase exceeds your spending goal. Click to see more."
    }

    let img = new Image()
    img.id = 'okaneIcon'
    img.src = chrome.runtime.getURL("/images/okane_logo_128px_in_pdp.png")
    img.setAttribute(
        "style",
        `
        height: 61px;
        width: 61px;
        position: absolute;
        bottom: 0;
        right: 10%;
        z-index: 2147483647 !important;
        opacity: 1 !important;
        animation: bounceInStay 5s linear !important;
        transition: all .2s ease-in-out;
        `
    )
    okaneAlert.insertAdjacentElement('afterend', img);

    let closeiframeDiv = document.getElementById("closeiframediv")
    let closeButtonImg = document.createElement('img')
    closeButtonImg.src = chrome.runtime.getURL("/images/close_button.png")
    closeButtonImg.style.width = "20px !important";
    closeButtonImg.style.height = "20px !important";
    closeiframeDiv.appendChild(closeButtonImg)

    let okaneAlertMessageElement = document.querySelector("#okaneAlertMessage")
    okaneAlertMessageElement.setAttribute(
        "style",`
            display: flex;
            align-items: center;
            justify-content: center;
        `
    );

    let slicePrice = priceElement[0].textContent.trim().replace(/[^0-9.]/g, '').replace('$', '').replace(',','')
    price_found_on_page = slicePrice
    let purchase_object = {
        price: slicePrice,
        url: window.location.hostname
    }

    setPurchasePrice(purchase_object).then(() =>{
    })
    
    let open_counter = 0
    okaneIcon.addEventListener('click', () =>{
        console.log("Number of times opened: " + open_counter)
        let startDate = new Date();
        setPurchasePrice(purchase_object).then(() =>{
            modaliFrameContent.style.display = "";
        })
        open_counter++;

        if(open_counter == 1){
            modaliFrameContent.querySelector("img").addEventListener("click", () => {
                const endDate = new Date();
                const spentTime = endDate.getTime() - startDate.getTime();
                let elapsedTime = 0;
                elapsedTime += spentTime;
                console.log("close dialog: " + modaliFrameContent.style.display)
                modaliFrameContent.style.display = "none"
                console.log("close dialog: " + modaliFrameContent.style.display)
            });
        }
    })

}

function insert_injection_not_logged_in(){
    const priceElement = document.getElementsByClassName("OkanePrice");
    let slicePrice = priceElement[0].textContent.trim().replace(/[^0-9.]/g, '').replace('$', '').replace(',','')
    price_found_on_page = slicePrice
    let purchase_object = {
        price: slicePrice,
        url: window.location.hostname
    }

    setPurchasePrice(purchase_object).then(() =>{
        console.log("Price sent to background.js")
    })

    // Create element for Okane icon
    const initialInjectionContainer = document.createElement("DIV");
    initialInjectionContainer.href = "#"
    initialInjectionContainer.id = 'okaneLocation'
    initialInjectionContainer.setAttribute(
        "style",`
            top: 450px
        `
    )

    initialInjectionContainer.classList.add('float');
    // initialInjectionContainer.appendChild(okaneIcon)

    const body = document.body
    body.appendChild(initialInjectionContainer);
    let modaliFrameContent = showModal(initialInjectionContainer);

    let okaneAlert = document.createElement("DIV");
    initialInjectionContainer.appendChild(okaneAlert)
    okaneAlert.href = "#"
    okaneAlert.id = 'okanePriceContainer'
    setTimeout(() => {
        okaneAlert.style.display = 'none';
      }, 5000); 
    
    // Pre-popup message
    // Create method to close injection
    okaneAlert.innerHTML = `
        <div id = "okaneAlertMessage">Finish adding your accounts to Plaid so we can show you your data! Click here for more.</div>
    `;
    let okaneAlertMessage = document.querySelector("#okaneAlertMessage")
    okaneAlertMessage.setAttribute(
        "style",
        `
        color: rgba(196,196,196,1)
        font-family: 'Poppins', sans-serif;
        `
    )
    okaneAlert.setAttribute(
        "style",`
        height: 57px;
        width: 300px;
        outline: #CFCFC4 solid 2px;
        background-color: #CFCFC4;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        position: absolute !important;
        right: 15%;
        bottom: -45%;
        z-index: 2147483646 !important;
        padding: 0px;
        display: grid;
        grid-template-columns: 75% 25%;
        position: fixed;
        border-top-left-radius: 20px;
        border-top-right-radius: 50px;
        border-bottom-right-radius: 50px;
        border-bottom-left-radius: 20px;
        opacity: 0;
        animation: bounceIn 7s linear;
        `
    );

    let img = new Image()
    img.id = 'okaneIcon'
    img.src = chrome.runtime.getURL("/images/okane_logo_128px_in_pdp.png")
    img.setAttribute(
        "style",
        `
        height: 61px;
        width: 61px;
        -webkit-filter: grayscale(1);
        position: absolute;
        bottom: -50%;
        right: 10%;
        z-index: 2147483647 !important;
        opacity: 1 !important;
        animation: bounceInStay 5s linear !important;
        transition: all .2s ease-in-out;
        `
    )
    okaneAlert.insertAdjacentElement('afterend', img);

    let closeiframeDiv = document.getElementById("closeiframediv")
    let closeButtonImg = document.createElement('img')
    closeButtonImg.src = chrome.runtime.getURL("/images/close_button.png")
    closeButtonImg.width = "20";
    closeButtonImg.height = "20";
    closeiframeDiv.appendChild(closeButtonImg)

    // document.getElementById("okaneIcon").src = chrome.runtime.getURL("/images/okane_logo_128px_in_pdp.png");

    let okaneAlertMessageElement = document.querySelector("#okaneAlertMessage")
    okaneAlertMessageElement.setAttribute(
        "style",`
            display: flex;
            align-items: center;
            justify-content: center;
        `
    );

    //document.querySelector("#okaneAlertClose").addEventListener("click", () => {
    //    okaneAlert.style.display = "none";
        
    //});
    
    let open_counter = 0
    okaneIcon.addEventListener('click', () =>{
        extensionOpened()
        console.log("Number of times opened: " + open_counter)
        let startDate = new Date();
        open_counter++;
        modaliFrameContent.style.display = "";

        if(open_counter == 1){
            modaliFrameContent.querySelector("img").addEventListener("click", () => {
                const endDate = new Date();
                const spentTime = endDate.getTime() - startDate.getTime();
                let elapsedTime = 0;
                elapsedTime += spentTime;
                console.log("close dialog: " + modaliFrameContent.style.display)
                modaliFrameContent.style.display = "none"
                console.log("close dialog: " + modaliFrameContent.style.display)
            });
        }
    })
    extensionLoaded()
}


function insert_injection_no_impact(isDemoOn){

    // Create element for Okane icon
    const initialInjectionContainer = document.createElement("DIV");
    initialInjectionContainer.href = "#"
    initialInjectionContainer.id = 'okaneLocation'

    initialInjectionContainer.classList.add('float');
    // initialInjectionContainer.appendChild(okaneIcon)

    const body = document.body
    body.appendChild(initialInjectionContainer);
    let modaliFrameContent = showModal(initialInjectionContainer);

    let okaneAlert = document.createElement("DIV");
    initialInjectionContainer.appendChild(okaneAlert)
    okaneAlert.href = "#"
    okaneAlert.id = 'okanePriceContainer'
    okaneAlert.style.display = 'block'
    setTimeout(() => {
        okaneAlert.style.display = 'none';
      }, 7000); 
    
    // Pre-popup message
    // Create method to close injection
    okaneAlert.innerHTML = `
        <div id = "okaneAlertMessage">Quick peek at your finances? <br> Click here for more.</div>
    `;
    let okaneAlertMessage = document.querySelector("#okaneAlertMessage")
    okaneAlertMessage.setAttribute(
        "style",
        `
        color: rgba(196,196,196,1)
        font-family: 'Poppins', sans-serif;
        `
    )
    okaneAlert.setAttribute(
        "style",`
        height: 57px;
        width: 300px;
        outline: #B4D7B2 solid 2px;
        background-color: #B4D7B2;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        position: absolute !important;
        right: 15%;
        bottom: 3px;
        margin-bottom: -1px;
        padding-right: 15px
        z-index: 2147483646 !important;
        display: grid;
        grid-template-columns: 75% 25%;
        position: fixed;
        text-align: center;
        border-top-left-radius: 20px;
        border-top-right-radius: 50px;
        border-bottom-right-radius: 50px;
        border-bottom-left-radius: 20px;
        opacity: 0;
        animation: bounceIn 7s linear;
        `
    );
    let img = document.createElement('img');
    img.id = 'okaneIcon'
    img.src = chrome.runtime.getURL("/images/okane_logo_128px_in_pdp.png")
    img.setAttribute(
        "style",
        `
        height: 61px;
        width: 61px;
        position: absolute;
        bottom: -50%;
        right: 10%;
        z-index: 2147483647 !important;
        opacity: 1 !important;
        animation: bounceInStay 5s linear !important;
        transition: all .2s ease-in-out;
        `
    )
    if(isDemoOn){
        img.setAttribute(
            "style",
            `
            height: 61px;
            width: 61px;
            position: absolute;
            bottom: -50%;
            right: 10%;
            z-index: 2147483647 !important;
            opacity: 1 !important;
            animation: bounceInStayDemo 1s infinite !important;
            transition: all .2s ease-in-out;
            `
        )
    }
    
    okaneAlert.insertAdjacentElement('afterend', img);


    let closeiframeDiv = document.getElementById("closeiframediv")
    let closeButtonImg = document.createElement('img')
    closeButtonImg.src = chrome.runtime.getURL("/images/close_button.png")
    closeButtonImg.width = "20";
    closeButtonImg.height = "20";
    closeiframeDiv.appendChild(closeButtonImg)

    // document.getElementById("okaneIcon").src = chrome.runtime.getURL("/images/okane_logo_128px_in_pdp.png");

    let okaneAlertMessageElement = document.querySelector("#okaneAlertMessage")
    okaneAlertMessageElement.setAttribute(
        "style",`
            display: flex;
            align-items: center !important;
            justify-content: center !important;
            margin-right: 4px !important;
            margin-left: 10px !important;
            margin-top: 5px !important;
            font-family: 'Poppins' !important;
            font-weight: 500 !important;
            font-size: 13px !important;
        `
    );

    //document.querySelector("#okaneAlertClose").addEventListener("click", () => {
    //    okaneAlert.style.display = "none";
        
    //});
    
    let open_counter = 0
    img.addEventListener('click', () =>{
        extensionOpened()
        if(isDemoOn){
            // Move Demo overlay text after extension is opened
        let demoOverLayText = document.querySelector("#okaneDemoOverlayText");
        demoOverLayText.innerHTML = "Cool information right? What you are seeing right now is <b>demo data</b><br></br>Close this window and finish onboarding Okane so we can add your data!"
        img.setAttribute(
            "style",
            `
            height: 61px;
            width: 61px;
            position: absolute;
            bottom: -50%;
            right: 10%;
            z-index: 2147483647 !important;
            opacity: 1 !important;
            animation: bounceInStay 1s linear !important;
            transition: all .2s ease-in-out;
            `
        )
        demoOverLayText.setAttribute(
            "style",`
            position: fixed;
            top: 196px;
            right: 500px;
            background-color: #030303d9;
            z-index: 200;
            font-family: Poppins;
            font-size: 18px;
            color: white;
            font-weight: 400;
            text-align: center;
            width: 400px;
            line-height: 25px;
            background: none;
            `)
        }
        console.log("Number of times opened: " + open_counter)
        let startDate = new Date();
        open_counter++;
        modaliFrameContent.style.display = "block"
        modaliFrameContent.querySelector("#popup-content").style.display = 'block';
        if(open_counter == 1){
            modaliFrameContent.querySelector("img").addEventListener("click", () => {
                const endDate = new Date();
                const spentTime = endDate.getTime() - startDate.getTime();
                let elapsedTime = 0;
                elapsedTime += spentTime;
                console.log("close dialog: " + modaliFrameContent.style.display)
                modaliFrameContent.style.display = "none"
                document.querySelector("#popup-content").style.display = 'none';
                console.log("close dialog: " + modaliFrameContent.style.display)
            });
        }
    })
    extensionLoaded()
    const shadowDiv = document.createElement("DIV");
    shadowDiv.id = "okaneDivShadow"
    const shadow = shadowDiv.attachShadow({ mode: 'open'})
    // Appending to shadow kills the icon, unsure why. Hiding entire div to cleanly
    shadow.appendChild(initialInjectionContainer)
    if(shadow.querySelectorAll("#okaneIcon").length == 0){
        okaneAlert.style.display = "none"
    }
    let additionalStyles = document.createElement('style')
    additionalStyles.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;700&display=swap');
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scaleX(0.9);
        }
        5% {
            opacity: 1;
            transform: scaleX(1);
        }
        40% {
            opacity: 1;
            transform: scaleX(1);
        }
        60% {
            opacity: 0.8
            transform: scaleX(1);
        }
        80% {
            opacity: 0.1
            transform: scaleX(1);
        }
        to {
            opacity: 0
            transform: scaleX(1);
        }
    }

    @keyframes bounceInStay {
        0%,
        5%,
        40%,
        60%,
        80%,
        to {
            animation-timing-function: linear;
        }
        0% {
            opacity: 1;
            -webkit-transform: scale3d(0.9, 0.9, 0.9);
            transform: scale3d(0.9, 0.9, 0.9);
        }
        5% {
            opacity: 1;
            -webkit-transform: scale3d(1.01, 1.01, 1.01);
            transform: scale3d(1.01, 1.01, 1.01);
        }
        40% {
            opacity: 1;
            -webkit-transform: scaleX(1);
            transform: scaleX(1);
        }
        60% {
            -webkit-transform: scaleX(1);
            transform: scaleX(1);
        }
        80% {
            -webkit-transform: scaleX(1);
            transform: scaleX(1);
        }
        to {
            opacity: 1;
            -webkit-transform: scaleX(1);
            transform: scaleX(1);
        }
    }

    @keyframes bounceInStayDemo {
        0%,
        50%,
        to {
            animation-timing-function: infinite;
        }
        0% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 1;
            transform: scale(1.2);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    `
    shadow.appendChild(additionalStyles)
    body.appendChild(shadowDiv)
}

function insert_injection_no_impact_demo(){
    // Create element for Okane icon
    const greyCover = document.createElement("DIV");
    greyCover.href = "#"
    greyCover.id = 'okaneGreyCover'
    greyCover.setAttribute(
        "style",`
        height: 100vh;
        width: 100vw;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #030303d9;
        z-index: 200;
        `)

    // initialInjectionContainer.appendChild(okaneIcon)

    const body = document.body
    body.appendChild(greyCover);

    let clickHereDemo = document.createElement("DIV");
    clickHereDemo.id = "okaneDemoOverlayText"
    greyCover.appendChild(clickHereDemo);
    clickHereDemo.innerHTML = "As you browse online, we show up with your info! Click here to proceed"
    clickHereDemo.setAttribute(
        "style",`
        position: fixed;
        top: 520px;
        right: 15px;
        background-color: #030303d9;
        z-index: 200;
        font-family: Poppins;
        font-size: 18px;
        color: white;
        font-weight: 400;
        text-align: center;
        width: 300px;
        line-height: 25px;
        background: none;
        `)

}

// Send extension opened call to mixpanel
function extensionOpened() {
    let mixpanel_data = {
        website_domain: window.location.hostname,
    }
    try{
         let response =  chrome.runtime.sendMessage({
            command: "extension_opened_pdp",
            mixpanel: mixpanel_data
        })
    }catch(error){
        console.log("error at extensionOpened Mixpanel call")
    }
}
