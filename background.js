//This function installs persistent variables when the chrome plugin loads
//Additionally utilizes the Storage Api which allows all components to access information
chrome.runtime.onInstalled.addListener((reason) => {
    chrome.storage.local.clear(function() {
        let error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });
    
    chrome.storage.local.set({
        authInfo: false,
        plaidLink: false,
        emailVerified: false
    })
    chrome.storage.sync.clear(); // callback is optional
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
        let credential = firebase.auth.GoogleAuthProvider.credential(null, token);
        firebase.auth().signInWithCredential(credential).then(() => {
            chrome.storage.local.set({ authInfo: true })
            chrome.tabs.create({
                url: "https://okane-app.com/login?token="+token, 
                active: true
            });
            chrome.identity.getProfileUserInfo({accountStatus: 'ANY'}, function(info) {
                let email = info.email
                const options = {
                    method: 'POST',
                    headers: {Accept: 'text/plain', 'Content-Type': 'application/json'},
                    body: JSON.stringify([
                        {
                          $token: 'xxxxxx',
                          $distinct_id: email,
                          $set: {
                            number_of_opens: 0,
                            $email: email,
                            $name: email
                            }
                        }
                      ])
                  };
                  
                  fetch('https://api.mixpanel.com/engage#profile-set', options)
                    //.then(response => response.json())
                    //.then(response => console.log(response))
                    .catch(err => console.error(err));

                const signUpOptions = {
                    method: 'POST',
                    headers: {Accept: 'text/plain', 'Content-Type': 'application/json'},
                    body: JSON.stringify([
                    {
                        properties: {
                        token: 'xxxxx',
                        time: Date.now(),
                        distinct_id: email,
                        },
                        event: "Extension Downloaded"
                    }
                    ])
                    };
                    fetch('https://api.mixpanel.com/track?ip=1&verbose=1', signUpOptions)
                        //.then(response => console.log(response))
                        .catch(err => console.error(err))
            })
        }).catch(console.error);
    })
});

setInterval(function(){ console.log("ping")}, 10000)
setInterval(function(){
   chrome.notifications.create('New transactions notification', {
    type: 'basic',
    iconUrl: 'images/okane_logo_128px.png',
    title: 'Budget update!',
    message: 'Head to your dashboard to take a look...',
    priority: 2,
    requireInteraction: true,
    silent: false,
})
}, 86400000)

// create a on Click listener for notifications
chrome.notifications.onClicked.addListener(function(notificationId) {
    chrome.tabs.create({url: "https://okane-app.com/dashboard"});
});  

/*Firebase Shit*/
try{
    // https://www.gstatic.com/firebasejs/8.1.2/firebase-functions.js
    // https://www.gstatic.com/firebasejs/8.6.1/firebase-functions.js
    //Import Firebase Local Scripts
    try {
        self.importScripts(
            'firebase/upgraded-firebase-app.js',
            'firebase/upgraded-firebase-auth.js',
            'firebase/upgraded-firebase-functions.js',
        )
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            let credential = firebase.auth.GoogleAuthProvider.credential(null, token);
            firebase.auth().signInWithCredential(credential).then(() => {
                chrome.storage.local.set({ authInfo: true });
                console.log("successfully logged in")
            })
        })
    } catch (error) {
        console.error('Cannot load scripts');
    }
    
    // Your web app's Firebase configuration 
    const firebaseConfig = {
        apiKey: "XXXX",
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const functions = firebase.functions();
 
    //`Async Callable Functions
    const validateFunctionPlaid = async () =>{  
        try{
            const validatePlaidLinked = functions.httpsCallable('validatePlaidLinked');
            let result = await validatePlaidLinked().then(response => {
                return response.data;
            }) 
            return result;
        }catch(error){
            console.log("Error validatePlaidLinked: "+ error)
            return false;
        }
    }

    const getTotalSpendings = async (start_date, end_date) =>{  
        try{
            const getTotalSpendings = functions.httpsCallable('getTotalSpendings');
            let res = await getTotalSpendings({start_date: start_date, end_date: end_date}).then(response => {
                return response.data;
            }) 
            return res;
        }catch(error){
            console.log("Error getting total spendings: "+ error);
        }
    }

    const getMonthOverMonthSpending = async () =>{  
        try{
            const getMonthOverMonthSpending = functions.httpsCallable('getMonthOverMonthSpending');
            let res = await getMonthOverMonthSpending({numberOfMonths: 4}).then(response => {
                return response.data;
            }) 
            return res;
        }catch(error){
            console.log("Error getting total month over month spending: "+ error);
        }
    }

    // Helpers
    function calculateStartOfMonthDate (){ // Past days to start of month
        const today = new Date()
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        const end_date = today.toISOString().slice(0, 10);
        const start_date = startOfMonth.toISOString().slice(0, 10)
        let date_object = {
            start_date: start_date,
            end_date: end_date
        }
        return date_object
    }

   
    /*
  Response Calls
    resp({type: "result", status: "success", data: doc.data(), request: msg});
    resp({type: "result", status: "error", data: error, request: msg});
  */
  // Mixpanel helper
  function mixpanel_extension_loaded (extension_source, domain, event) {
    // Mixpanel call
    let email;
    chrome.identity.getProfileUserInfo({accountStatus: 'ANY'}, function(info) {
        email = info.email
        const options = {
            method: 'POST',
            headers: {Accept: 'text/plain', 'Content-Type': 'application/json'},
            body: JSON.stringify([
            {
                properties: {
                token: 'xxxx',
                distinct_id: email,
                $insert_id: 'extension_loaded',
                website_domain: domain,
                number_of_seconds_open: 'UNKNOWN',
                hovered_over_graph: 'UNKNOWN',
                extension_source: extension_source
                },
                event: event
            }
            ])
        };
        fetch('https://api.mixpanel.com/track?ip=1&verbose=1', options)
            //.then(response => console.log(response))
            .catch(err => console.error(err))

        if(event != "Pdp Extension Loaded"){
            // Incriment number of opens
            const options = {
                method: 'POST',
                headers: {Accept: 'text/plain', 'Content-Type': 'application/json'},
                body: JSON.stringify([{$token: 'xxxxxx', $distinct_id: email, $add: {number_of_opens: 1}}])
            };
        
            fetch('https://api.mixpanel.com/engage?verbose=1#profile-numerical-add', options)
            .then(function(response) {
                // The response is a Response instance.
                // You parse the data into a useable format using `.json()`
                return response.json();
              }).then(function(data) {
                // `data` is the parsed version of the JSON returned from the above endpoint.
              })
            .catch(err => console.error(err))
        }
        })
    }

    // Mixpanel helper for uninstall :(
  function mixpanel_extension_uninstalled () {
    // Mixpanel call
    let email;
    chrome.identity.getProfileUserInfo({accountStatus: 'ANY'}, function(info) {
        email = info.email
        const options = {
            method: 'POST',
            headers: {Accept: 'text/plain', 'Content-Type': 'application/json'},
            body: JSON.stringify([
            {
                properties: {
                token: 'xxxxx',
                time: Date.now(),
                distinct_id: email,
                $insert_id: 'extension_uninstalled',
                },
                event: "Extension Uninstalled"
            }
            ])
        };
        fetch('https://api.mixpanel.com/track?ip=1&verbose=1', options)
            //.then(response => console.log(response))
            .catch(err => console.error(err))
        })
    }


  // Runtime listener
  chrome.runtime.onMessage.addListener((msg, sender, resp) => {
    if(msg.command == "checkPlaidLink"){
        if(chrome.runtime.lastError){
            resp({type: "result", status: "error", data: false});
            return;
        } 
        validateFunctionPlaid().then(data =>{
            if(data.plaidLinked){
                chrome.storage.local.set({ plaidLink: data.plaidLinked });
                resp({type: "result", status: "success", data: data.plaidLinked});
                return true;
            }else{
                chrome.notifications.create('Financial Account Not Connected', {
                    type: 'basic',
                    iconUrl: 'images/okane_logo_128px.png',
                    title: 'Financial Account Not Connected!',
                    message: 'Please connect your financial account to see info!',
                    priority: 2,
                    requireInteraction: true,
                    silent: false,
                });
                chrome.storage.local.set({ plaidLink: false });
                resp({type: "result", status: "error", data: false});
                return;
            }
        })
        return true;
    }
    if(msg.command == "getSpending"){
        if(chrome.runtime.lastError){
            resp({type: "result", status: "error", data: false});
            return true;
        } 
        let date_object = calculateStartOfMonthDate()
        getTotalSpendings(date_object.start_date, date_object.end_date).then(result =>{
            resp({type: "result", status: "success" , data: {avgNonEssentialSpending: result.avgNonEssentialSpending,
                                                      totalMonthNonEssentialSpend: result.totalMonthNonEssentialSpend, 
                                                      topFiveDiscretionaryCategories: result.topFiveDiscretionaryCategories,
                                                      topFiveAverageCategories: result.topFiveAverageCategories} });
            return true;
        })
        return true;
    }
    //Foreground injetion stuff
    if(msg.command === 'set_purchase_object'){ //set purchase object 
        chrome.storage.local.set({
            purchase_object: msg.purchase_object
        }, () => {
            if (chrome.runtime.lastError) {
                console.log("failure to set purchase price")
                resp({
                    message: 'fail'
                });
                return;
            }
            resp({ 
                message: 'success', 
            })
        })
        return true;
    }
    // Mixpanel calls
    if(msg.command == "extension_loaded_pdp"){
        let mixpanelData = msg.mixpanel
        mixpanel_extension_loaded("PDP", mixpanelData.website_domain, "Pdp Extension Loaded")
        return true;
    }
    if(msg.command == "extension_opened_pdp"){
        let mixpanelData = msg.mixpanel
        mixpanel_extension_loaded("PDP", mixpanelData.website_domain, "PDP Extension Opened")
        return true;
    }
    if(msg.command == "extension_loaded_popup"){
        mixpanel_extension_loaded("Popup", "N/A", "Popup Extension Loaded")
        return true;
    }
    // Currently called by next steps events
    if(msg.command == "mixpanel_request"){
        let mixpanelData = msg.mixpanel;
        mixpanel_extension_loaded(mixpanelData.source, mixpanelData.website, mixpanelData.action)
        return true;
    }
    // Currently called by next steps events
    if(msg.command == "notifications"){
        let notificationData = msg.notification;
        chrome.notifications.create(notificationData.title, {
			type: 'basic',
			iconUrl: 'images/okane_logo_128px.png',
			title: notificationData.title,
			message: notificationData.message,
			priority: 2,
			requireInteraction: true,
			silent: false,
		})
        return true;
    }
  })
} catch(ex){
    console.log("error: " + ex)
}


chrome.runtime.setUninstallURL("https://okane-app.com", () => {
    mixpanel_extension_uninstalled();
    return true;
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Chrome Tab Listener-- Scripting function
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    //tabId-  tab they are on
    //ChangeInfo- life cycle of tab
    //tab - contains url
    // && /^http/.test(tab.url)
    //
    if(tab.url.startsWith('https://www.google.com') && !tab.url.startsWith('https://www.google.com/travel/flights')){

    } else {
        if(changeInfo.status === 'complete'){
            chrome.scripting.insertCSS({
                target: {tabId: tabId},
                files: ["./scripts/cartScript.css"]
            }).then(() => {
                console.log("Success Injecting CSS");
                chrome.scripting.executeScript({
                    target: {tabId: tabId},
                    files: ["./scripts/pdpScript.js"]
                })
                .then(()=> {
                })
                .catch(error => console.log("Error Injecting script: " + error));
            }).catch(error => console.log("Error Injecting CSS: " + error)) 
        }
    }
    /*
    const isAmazonCartOrCheckout = (tab.url.startsWith('https://www.amazon.com/gp/buy/') || tab.url.startsWith('https://www.amazon.com/gp/cart/'));
    const isEbayCartOrCheckout = (tab.url.startsWith('https://pay.ebay.com/') || tab.url.startsWith('https://cart.ebay.com'))
    const isNikeCartOrCheckout = (tab.url.startsWith('https://www.nike.com/cart') || tab.url.startsWith('https://www.nike.com/checkout'))
    const isAmazonPdp = (tab.url.startsWith('https://www.amazon.com/'));
    const isEbayPdp = (tab.url.startsWith('https://www.ebay.com/') || tab.url.startsWith('cart.payments.ebay.com'));
    const isWalmartPdp = (tab.url.startsWith('https://www.walmart.com/'));
    const isNikePdp = (tab.url.startsWith('https://www.nike.com/'));
    if(changeInfo.status === 'complete' && tab.status == 'complete' && (isAmazonCartOrCheckout || isEbayCartOrCheckout )){
        chrome.scripting.insertCSS({
            target: {tabId: tabId},
            files: ["./scripts/cartScript.css"]
        }).then(() => {
            console.log("Success Injecting CSS");
            chrome.scripting.executeScript({
                target: {tabId: tabId},
                files: ["./scripts/cartScript.js"]
            })
            .then(()=> {
                console.log("Success Injecting Script");
                //where do you want to send mesasge which tab
                //
            
            })
            .catch(error => console.log("Error Injecting script: " + error));
        }).catch(error => console.log("Error Injecting CSS: " + error))
    } else if(changeInfo.status === 'complete' && tab.status == 'complete' && (isAmazonPdp || isEbayPdp || isWalmartPdp )){
        chrome.scripting.insertCSS({
            target: {tabId: tabId},
            files: ["./scripts/cartScript.css"]
        }).then(() => {
            console.log("Success Injecting CSS");
            chrome.scripting.executeScript({
                target: {tabId: tabId},
                files: ["./scripts/pdpScript.js"]
            })
            .then(()=> {
                console.log("Success Injecting Script");
            })
            .catch(error => console.log("Error Injecting script: " + error));
        }).catch(error => console.log("Error Injecting CSS: " + error)) 
    }
    */
});

    
// // Extensions can remove listeners from their background scripts by calling removeListener.
// // If all listeners for an event are removed, Chrome will no longer load the extension's background script for that event.  
// chrome.runtime.onMessage.addListener(function(message, sender, reply) {
//     chrome.runtime.onMessage.removeListener(event);
// });

// UI Injection
chrome.runtime.onMessage.addListener((msg, sender, resp) => {
    if(msg.command === 'get_purchase_object'){
        chrome.storage.local.get('purchase_object', data =>{
            if(chrome.runtime.lastError){
                resp({
                    message: 'fail'
                });
                return;
            } 
            resp({
                message: 'success',
                payload: data.purchase_object
            });
        })
        return true;
    } 
})

