// Execution
// Hide demo overlays for not logged in state
document.querySelector("#greyOverlay").style.display = "none"
document.querySelector("#demoOverlayText").style.display = "none"


const scriptSource = document.querySelector("#okaneGraphScript")
const source = scriptSource.getAttribute('source')
const loadingDiv = document.getElementById("loadingIn")
const parsingDiv = document.getElementById("parsingIn")
const loggedInDiv = document.getElementById("loggedIn")
const notLoggedInDiv = document.getElementById("notLoggedIn")

loadingDiv.style.transition = "opacity 1s ease-out";

loggedInDiv.style.height = "0px";
loggedInDiv.style.opacity = 0;
loggedInDiv.style.paddingLeft = "0px";
loggedInDiv.style.paddingRight = "0px";
loggedInDiv.style.paddingBottom = "0px";
loggedInDiv.style.paddingTop = "0px";
loggedInDiv.style.position = "absolute";
loggedInDiv.style.transition = "opacity 1s ease-out";
notLoggedInDiv.style.height = "0px";
notLoggedInDiv.style.opacity = 0;
notLoggedInDiv.style.paddingLeft = "0px";
notLoggedInDiv.style.paddingRight = "0px";
notLoggedInDiv.style.paddingBottom = "0px";
notLoggedInDiv.style.paddingTop = "0px";
notLoggedInDiv.style.position = "absolute";
notLoggedInDiv.style.transition = "opacity 1s ease-out";
parsingDiv.style.height = "0px";
parsingDiv.style.opacity = 0;
parsingDiv.style.paddingLeft = "0px";
parsingDiv.style.paddingRight = "0px";
parsingDiv.style.paddingBottom = "0px";
parsingDiv.style.paddingTop = "0px";
parsingDiv.style.position = "absolute";
parsingDiv.style.transition = "opacity 1s ease-out";

function redirectToOkaneWeb() {
	chrome.identity.getAuthToken({ interactive: true }, (token) => {
		chrome.tabs.create({
			url: "https://okane-app.com/login?token="+token, 
			active: true
		});
	});
}

const LoggedInButtton = document.getElementById("LoggedInButtton");
LoggedInButtton.addEventListener(`click`, async () => {
	redirectToOkaneWeb()
})

const notLoggedInButtton = document.getElementById("notLoggedInButtton");

notLoggedInButtton.addEventListener(`click`, async () => {
	redirectToOkaneWeb();
})

// Demo link to onboarding
const demoLinkToDashboardFadeIn = document.getElementById("demoFadeInLinkToDashboard")
demoLinkToDashboardFadeIn.addEventListener(`click`, async () => {
	chrome.tabs.create({
		url: "https://okane-app.com/onboarding",
		active: true
	});
})

let nextStepIcons = []
nextStepIcons.push(document.querySelector("#loggedIn").querySelector("#nextStepsDashboard"))
document.querySelector("#loggedIn").querySelector("#nextStepsDashboard").addEventListener("click", async () => {
	let mixpanel_data;
	if (source == "popupPage"){
		mixpanel_data = {
			source: "Popup",
			website: "N/A",
			action: "Logged In Next Steps Dashboard"
		}
	} else {
		mixpanel_data = {
			source: "PDP",
			website: window.location.hostname,
			action: "Logged In Next Steps Dashboard"
		}
	}
	chrome.runtime.sendMessage({
		command: "mixpanel_request",
		mixpanel: mixpanel_data
	})
	chrome.storage.local.set({
		visitDashboard: true,
	})
	redirectToOkaneWeb()
})
nextStepIcons.push(document.querySelector("#loggedIn").querySelector("#nextStepsConnectAccount"))
document.querySelector("#loggedIn").querySelector("#nextStepsConnectAccount").addEventListener("click", async () => {
	let mixpanel_data;
	if (source == "popupPage"){
		mixpanel_data = {
			source: "Popup",
			website: "N/A",
			action: "Clicked on Logged In Next Steps Connect Account"
		}
	} else {
		mixpanel_data = {
			source: "PDP",
			website: window.location.hostname,
			action: "Clicked on Logged In Next Steps Connect Account"
		}
	}
	chrome.runtime.sendMessage({
		command: "mixpanel_request",
		mixpanel: mixpanel_data
	})
	redirectToOkaneWeb()
})

nextStepIcons.push(document.querySelector("#notLoggedIn").querySelector("#nextStepsDashboard"))
document.querySelector("#notLoggedIn").querySelector("#nextStepsDashboard").addEventListener("click", async () => {
	let mixpanel_data;
	if (source == "popupPage"){
		mixpanel_data = {
			source: "Popup",
			website: "N/A",
			action: "Clicked on Logged Out Next Steps Dashboard"
		}
	} else {
		mixpanel_data = {
			source: "PDP",
			website: window.location.hostname,
			action: "Clicked on Logged Out Next Steps Dashboard"
		}
	}
	chrome.runtime.sendMessage({
		command: "mixpanel_request",
		mixpanel: mixpanel_data
	})
	chrome.storage.local.set({
		visitDasboard: true,
	})
	redirectToOkaneWeb()
})
nextStepIcons.push(document.querySelector("#notLoggedIn").querySelector("#nextStepsConnectAccount"))
document.querySelector("#notLoggedIn").querySelector("#nextStepsConnectAccount").addEventListener("click", async () => {
	let mixpanel_data;
	if (source == "popupPage"){
		mixpanel_data = {
			source: "Popup",
			website: "N/A",
			action: "Clicked on Not Logged In Next Steps Connect Account"
		}
	} else {
		mixpanel_data = {
			source: "PDP",
			website: window.location.hostname,
			action: "Clicked on Not Logged In Next Steps Connect Account"
		}
	}
	chrome.runtime.sendMessage({
		command: "mixpanel_request",
		mixpanel: mixpanel_data
	})
	
	redirectToOkaneWeb()
})
nextStepIcons.push(document.querySelector("#loggedIn").querySelector("#nextStepsPin"))
document.querySelector("#loggedIn").querySelector("#nextStepsPin").addEventListener("click", () => {
	let mixpanel_data;
	if (source == "popupPage"){
		mixpanel_data = {
			source: "Popup",
			website: "N/A",
			action: "Clicked on Logged In Next Steps Pin"
		}
	} else {
		mixpanel_data = {
			source: "PDP",
			website: window.location.hostname,
			action: "Clicked on Logged In Next Steps Pin"
		}
	}
	chrome.runtime.sendMessage({
		command: "mixpanel_request",
		mixpanel: mixpanel_data
	})
	window.open("https://www.howtogeek.com/683099/how-to-pin-and-unpin-extensions-from-the-chrome-toolbar/")
})

nextStepIcons.push(document.querySelector("#notLoggedIn").querySelector("#nextStepsPin"))
document.querySelector("#notLoggedIn").querySelector("#nextStepsPin").addEventListener("click", () => {
	let mixpanel_data;
	if (source == "popupPage"){
		mixpanel_data = {
			source: "Popup",
			website: "N/A",
			action: "Clicked on Not Logged In Next Steps Pin"
		}
	} else {
		mixpanel_data = {
			source: "PDP",
			website: window.location.hostname,
			action: "Clicked on Not Logged In Next Steps Pin"
		}
	}
	chrome.runtime.sendMessage({
		command: "mixpanel_request",
		mixpanel: mixpanel_data
	})
	window.open("https://www.howtogeek.com/683099/how-to-pin-and-unpin-extensions-from-the-chrome-toolbar/")
})


nextStepIcons.forEach(element => {
	element.addEventListener('mouseover', () => {
		element.nextElementSibling.classList.add("toolTipNextStepsShow")
	})
	element.addEventListener('mouseout', () => {
		element.nextElementSibling.classList.remove("toolTipNextStepsShow")
	})
})

//Check if pinned and whether if dashboard visited
async function updateNextStepIcons(){
  let userSettings = await chrome.action.getUserSettings();
  if(userSettings.isOnToolbar == true){
		document.querySelector("#loggedIn").querySelector("#nextStepsPin").src="../../images/Next_Steps/Next_Steps_Pin_Done.png";
		document.querySelector("#notLoggedIn").querySelector("#nextStepsPin").src="../../images/Next_Steps/Next_Steps_Pin_Done.png";
  } else {
		let notificationData = {
			title: "Okane Not Pinned To Toolbar",
			message: "Please pin Okane to your toolbar!",
		}
		chrome.runtime.sendMessage({
			command: "notifications",
			mixpanel: notificationData
		})
	}
	chrome.storage.local.get('visitDashboard', data => {
		if (data) {
			document.querySelector("#loggedIn").querySelector("#nextStepsDashboard").src="../../images/Next_Steps/Next_Steps_Visit_Dashboard_Done.png";
			document.querySelector("#notLoggedIn").querySelector("#nextStepsDashboard").src="../../images/Next_Steps/Next_Steps_Visit_Dashboard_Done.png";
		} else {
			let notificationData = {
				title: "Visit Dashboard!",
				message: "Visit dashboard to see your finances visualized",
			}
			chrome.runtime.sendMessage({
				command: "notifications",
				mixpanel: notificationData
			})
		}
	})
}

updateNextStepIcons();


/*
let loggedInNextStepDashboard = document.querySelector("#loggedIn").querySelector("#nextStepsDashboard")
let loggedInNextStepConnectAccount = document.querySelector("#loggedIn").querySelector("#nextStepsConnectAccount")
let loggedInNextStepPin = document.querySelector("#loggedIn").querySelector("#nextStepsPin")
let notLoggedInNextStepDashboard = document.querySelector("#notLoggedIn").querySelector("#nextStepsDashboard")
let notLoggedInNextStepConnectAccount = document.querySelector("#notLoggedIn").querySelector("#nextStepsConnectAccount")
let notLoggedInNextStepPin = document.querySelector("#notLoggedIn").querySelector("#nextStepsPin")
*/

let loggedInContainerAvg = document.querySelector("#loggedIn").querySelector(".average_categories")
let loggedInContainerMonth = document.querySelector("#loggedIn").querySelector(".this_month_categories")
let notLoggedInContainerAvg = document.querySelector("#notLoggedIn").querySelector(".average_categories")
let notLoggedInContainerMonth = document.querySelector("#notLoggedIn").querySelector(".this_month_categories")

let emojiImagesAvg = loggedInContainerAvg.querySelectorAll(".cateogory_emoji");
for(let j = 0; j < emojiImagesAvg.length; j++ ){
	emojiImagesAvg[j].addEventListener('mouseover', () => {
		loggedInContainerAvg.querySelector(".category_hover_over").style.zIndex = 30;
		loggedInContainerAvg.querySelector(".category_hover_over").style.boxShadow = "0px 4px 26px -10px rgba(0,0,0,0.9)";
		loggedInContainerAvg.querySelector(".category_hover_over").style.animationDuration = "1s";
		loggedInContainerAvg.querySelector(".category_hover_over").style.animationName = "categoryHoverOver";
		loggedInContainerAvg.querySelector(".category_hover_over").style.display = "block";
	})
	emojiImagesAvg[j].addEventListener('mouseout', () => {
		loggedInContainerAvg.querySelector(".category_hover_over").style.zIndex = -20;
		loggedInContainerAvg.querySelector(".category_hover_over").style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0.9)";
		loggedInContainerAvg.querySelector(".category_hover_over").style.animationDuration = "0s";
		loggedInContainerAvg.querySelector(".category_hover_over").style.animationName = "";
		loggedInContainerAvg.querySelector(".category_hover_over").style.display = "none";
	})
}

let emojiImagesMonth = loggedInContainerMonth.querySelectorAll(".cateogory_emoji");
for(let j = 0; j < emojiImagesMonth.length; j++ ){
	emojiImagesMonth[j].addEventListener('mouseover', () => {
		loggedInContainerMonth.querySelector(".category_hover_over").style.zIndex = 30;
		loggedInContainerMonth.querySelector(".category_hover_over").style.boxShadow = "0px 4px 26px -10px rgba(0,0,0,0.9)";
		loggedInContainerMonth.querySelector(".category_hover_over").style.animationDuration = "1s";
		loggedInContainerMonth.querySelector(".category_hover_over").style.animationName = "categoryHoverOver";
		loggedInContainerMonth.querySelector(".category_hover_over").style.display = "block";
	})
	emojiImagesMonth[j].addEventListener('mouseout', () => {
		loggedInContainerMonth.querySelector(".category_hover_over").style.zIndex = -20;
		loggedInContainerMonth.querySelector(".category_hover_over").style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0.9)";
		loggedInContainerMonth.querySelector(".category_hover_over").style.animationDuration = "0s";
		loggedInContainerMonth.querySelector(".category_hover_over").style.animationName = "";
		loggedInContainerMonth.querySelector(".category_hover_over").style.display = "none";
	})
}

emojiImagesAvg = notLoggedInContainerAvg.querySelectorAll(".cateogory_emoji");
for(let j = 0; j < emojiImagesAvg.length; j++ ){
	emojiImagesAvg[j].addEventListener('mouseover', () => {
		notLoggedInContainerAvg.querySelector(".category_hover_over").style.zIndex = 30;
		notLoggedInContainerAvg.querySelector(".category_hover_over").style.boxShadow = "0px 4px 26px -10px rgba(0,0,0,0.9)";
		notLoggedInContainerAvg.querySelector(".category_hover_over").style.animationDuration = "1s";
		notLoggedInContainerAvg.querySelector(".category_hover_over").style.animationName = "categoryHoverOver";
		notLoggedInContainerAvg.querySelector(".category_hover_over").style.display = "block";
	})
	emojiImagesAvg[j].addEventListener('mouseout', () => {
		notLoggedInContainerAvg.querySelector(".category_hover_over").style.zIndex = -20;
		notLoggedInContainerAvg.querySelector(".category_hover_over").style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0.9)";
		notLoggedInContainerAvg.querySelector(".category_hover_over").style.animationDuration = "0s";
		notLoggedInContainerAvg.querySelector(".category_hover_over").style.animationName = "";
		notLoggedInContainerAvg.querySelector(".category_hover_over").style.display = "none";
	})
}

emojiImagesMonth = notLoggedInContainerMonth.querySelectorAll(".cateogory_emoji");
for(let j = 0; j < emojiImagesAvg.length; j++ ){
	emojiImagesMonth[j].addEventListener('mouseover', () => {
		notLoggedInContainerMonth.querySelector(".category_hover_over").style.zIndex = 30;
		notLoggedInContainerMonth.querySelector(".category_hover_over").style.boxShadow = "0px 4px 26px -10px rgba(0,0,0,0.9)";
		notLoggedInContainerMonth.querySelector(".category_hover_over").style.animationDuration = "1s";
		notLoggedInContainerMonth.querySelector(".category_hover_over").style.animationName = "categoryHoverOver";
		notLoggedInContainerMonth.querySelector(".category_hover_over").style.display = "block";
	})
	emojiImagesMonth[j].addEventListener('mouseout', () => {
		notLoggedInContainerMonth.querySelector(".category_hover_over").style.zIndex = -20;
		notLoggedInContainerMonth.querySelector(".category_hover_over").style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0.9)";
		notLoggedInContainerMonth.querySelector(".category_hover_over").style.animationDuration = "0s";
		notLoggedInContainerMonth.querySelector(".category_hover_over").style.animationName = "";
		notLoggedInContainerMonth.querySelector(".category_hover_over").style.display = "none";
	})
}

// Handle toggle event
let thisMonthButtonLoggedIn = document.querySelector("#loggedIn").querySelector("#this_month_button");
let avgMonthButtonLoggedIn = document.querySelector("#loggedIn").querySelector("#avg_spend_button");
thisMonthButtonLoggedIn.addEventListener('click', () =>{
	if(thisMonthButtonLoggedIn.classList.contains("btn_toggle_off")){
		avgMonthButtonLoggedIn.classList.replace("btn_toggle_on","btn_toggle_off")
		thisMonthButtonLoggedIn.classList.replace("btn_toggle_off","btn_toggle_on")
		document.querySelector("#loggedIn").querySelector(".this_month_lead").className = "row categories show_toggle_lead this_month_lead"
		document.querySelector("#loggedIn").querySelector(".average_categories_lead").className = "row categories hidden_toggle_lead average_categories_lead"
		document.querySelector("#loggedIn").querySelector(".average_categories").className = "row categories_detail hidden_toggle_detail average_categories";
		document.querySelector("#loggedIn").querySelector(".this_month_categories").className = "row categories_detail show_toggle_detail this_month_categories";
	}
})

avgMonthButtonLoggedIn.addEventListener('click', () =>{
	if(avgMonthButtonLoggedIn.classList.contains("btn_toggle_off")){
		thisMonthButtonLoggedIn.classList.replace("btn_toggle_on","btn_toggle_off")
		avgMonthButtonLoggedIn.classList.replace("btn_toggle_off","btn_toggle_on")
		document.querySelector("#loggedIn").querySelector(".this_month_lead").className = "row categories hidden_toggle_lead this_month_lead"
		document.querySelector("#loggedIn").querySelector(".average_categories_lead").className = "row categories show_toggle_lead average_categories_lead"
		document.querySelector("#loggedIn").querySelector(".average_categories").className = "row categories_detail show_toggle_detail average_categories";
		document.querySelector("#loggedIn").querySelector(".this_month_categories").className = "row categories_detail  hidden_toggle_detail this_month_categories";
	}
})

// Handle toggle event
let thisMonthButtonNotLoggedIn = document.querySelector("#notLoggedIn").querySelector("#this_month_button");
let avgMonthButtonNotLoggedIn = document.querySelector("#notLoggedIn").querySelector("#avg_spend_button");
thisMonthButtonNotLoggedIn.addEventListener('click', () =>{
	if(thisMonthButtonNotLoggedIn.classList.contains("btn_toggle_off")){
		avgMonthButtonNotLoggedIn.classList.replace("btn_toggle_on","btn_toggle_off")
		thisMonthButtonNotLoggedIn.classList.replace("btn_toggle_off","btn_toggle_on")
		document.querySelector("#notLoggedIn").querySelector(".this_month_lead").className = "row categories show_toggle_lead this_month_lead"
		document.querySelector("#notLoggedIn").querySelector(".average_categories_lead").className = "row categories hidden_toggle_lead average_categories_lead"
		document.querySelector("#notLoggedIn").querySelector(".average_categories").className = "row categories_detail hidden_toggle_detail average_categories";
		document.querySelector("#notLoggedIn").querySelector(".this_month_categories").className = "row categories_detail show_toggle_detail this_month_categories";
	}
})


avgMonthButtonNotLoggedIn.addEventListener('click', () =>{
	if(avgMonthButtonNotLoggedIn.classList.contains("btn_toggle_off")){
		thisMonthButtonNotLoggedIn.classList.replace("btn_toggle_on","btn_toggle_off")
		avgMonthButtonNotLoggedIn.classList.replace("btn_toggle_off","btn_toggle_on")
		document.querySelector("#notLoggedIn").querySelector(".this_month_lead").className = "row categories hidden_toggle_lead this_month_lead"
		document.querySelector("#notLoggedIn").querySelector(".average_categories_lead").className = "row categories show_toggle_lead average_categories_lead"
		document.querySelector("#notLoggedIn").querySelector(".average_categories").className = "row categories_detail show_toggle_detail average_categories";
		document.querySelector("#notLoggedIn").querySelector(".this_month_categories").className = "row categories_detail  hidden_toggle_detail this_month_categories";
	}
})


changeIn(loadingDiv)

chrome.runtime.sendMessage({command: "checkPlaidLink"}, res => {
	try{
		let plaidTokenValidated = res.data
		// let plaidTokenValidated = false
		// Remove later
		if(plaidTokenValidated == false){
			let calculatedDataCurrentSpend = 400;
			let caluclatedDataRemainingBudget = 152;
			createDoughnutChart(calculatedDataCurrentSpend, caluclatedDataRemainingBudget, plaidTokenValidated)
			createCategoryIconsDemo()
			setTimeout(() => {
				changeOut(loadingDiv)
				setTimeout(() => {
					// Show demo overlays for not logged in state
					document.querySelector("#greyOverlay").style.display = "block"
					document.querySelector("#demoOverlayText").style.display = "block"
					changeIn(notLoggedInDiv)
					changeOutPadding(loadingDiv)
					setTimeout(() => {
						// Hide demo overlays for not logged in state
						document.querySelector("#greyOverlay").style.opacity = "0%"
						document.querySelector("#demoOverlayText").style.opacity = "0%"
						setTimeout(() => {
							// Hide demo overlays for not logged in state
							document.querySelector("#greyOverlay").style.display = "none"
							document.querySelector("#demoOverlayText").style.display = "none"
						}, 1000)
					}, 3000)
				}, 1000)
			}, 1000);
		} else {

			chrome.runtime.sendMessage({command: "getSpending"}, res => {
				const calculatedDataCurrentSpend = res.data.totalMonthNonEssentialSpend;
				const caluclatedDataRemainingBudget = (res.data.avgNonEssentialSpending) - calculatedDataCurrentSpend;
				const totalAverageSpending = res.data.avgNonEssentialSpending
				const topCategories = res.data.topFiveDiscretionaryCategories;
				const topAvgCategories = res.data.topFiveAverageCategories;

				document.querySelector("#loggedIn").querySelector("#categoryTotalInput").innerHTML = calculatedDataCurrentSpend.toFixed(0);
				document.querySelector("#loggedIn").querySelector("#totalAverageSpending").innerHTML = totalAverageSpending.toFixed(0);
				// Updates Next Steps Icon If Plaid Token Is detected
				document.getElementById("nextStepsConnectAccount").src="../../images/Next_Steps/Next_Steps_Connect_Account_Done.png";
				if (source == "uiInject"){
					createDoughnutChart(calculatedDataCurrentSpend, caluclatedDataRemainingBudget, plaidTokenValidated)
				} else {
					createDoughnutChart(calculatedDataCurrentSpend, caluclatedDataRemainingBudget, plaidTokenValidated)
				}
				createCategoryIcons(topCategories, topAvgCategories, calculatedDataCurrentSpend, totalAverageSpending)
				setTimeout(() => {
					changeOut(loadingDiv)
					setTimeout(() => {
					changeIn(loggedInDiv)
					changeOutPadding(loadingDiv)
					}, 1000)
				}, 1000)
			})
		}
		if (source == "popupPage"){
			let mixpanel_data = {
			price_on_page: "No Price"
			}
			let response =  chrome.runtime.sendMessage({
				command: "extension_loaded_popup",
				mixpanel: mixpanel_data
			})
		}
	}
	catch (e) {
		console.error(e);
		// Add mixpanel / GCP error reporting
		setTimeout(() => {
			changeOut(loadingDiv)
			setTimeout(() => {
			changeIn(parsingDiv)
			changeOutPadding(loadingDiv)
			}, 1000)
		}, 1000)
	}
})


// Helpers
// Animation, change height and opacity
function changeIn(domElement){
	domElement.style.height = "100%";
	domElement.style.opacity = 1;
  domElement.style.position = "relative";
  domElement.style.paddingLeft = "25px";
  domElement.style.paddingRight = "25px";
  domElement.style.paddingBottom = "15px";
  domElement.style.paddingTop = "15px";
}

function changeOut(domElement){
  domElement.style.height = "0px";
  domElement.style.opacity = 0;
  domElement.style.position = "absolute";
}

function changeOutPadding(domElement){
	domElement.style.paddingLeft = "0px";
	domElement.style.paddingRight = "0px";
	domElement.style.paddingBottom = "0px";
	domElement.style.paddingTop = "0px";
}

// Create Transaction Category Icons
function createCategoryIcons(categoryInputs, categoryAverageInputs, totalCurrentSpending, totalAverageSpending){
	// Sort categoryInputs
	categoryInputs = categoryInputs.sort(function(a, b) {
		let keyA = a.data.currentMonthSpend,
		  keyB = b.data.currentMonthSpend;
		// Compare the 2 dates
		if (keyA < keyB) return 1;
		if (keyA > keyB) return -1;
		return 0;
	});
	

	// Remove $0 values from categoryInputs
	for(let j = categoryInputs.length - 1; j > 0; j--){
		if(categoryInputs[j].data.currentMonthSpend == 0){
			categoryInputs.splice(j, 1);
		}
	}
	let i = 0
	for(i; i < categoryInputs.length; i++){
		let categorySearch = "#category_" + (i + 1)
		let categoryDiv = document.querySelector("#loggedIn").querySelector(".this_month_categories").querySelector(categorySearch);
		categoryDiv.querySelector(".category_numbers_main").innerHTML = "$" + (categoryInputs[i].data.currentMonthSpend).toFixed(0)
		categoryDiv.querySelector(".category_numbers_sub").innerHTML = ((categoryInputs[i].data.currentMonthSpend / totalCurrentSpending) * 100).toFixed(0) + "%"
		let categoryImage = categoryInputs[i].category
		categoryDiv.querySelector(".cateogory_emoji").src = "../../../images/Icons/" + categoryImage + ".png"
		categoryDiv.querySelector(".cateogory_emoji").addEventListener('mouseover', () => {
			document.querySelector("#loggedIn").querySelector(".this_month_categories").querySelector(".category_hover_over").innerHTML = categoryImage
		})
	}
	// Remove divs for categories that have $0 value
	for(let k = i; k < 5; k++){
		let categorySearch = "#category_" + (k + 1)
		let categoryDiv = document.querySelector("#loggedIn").querySelector(".this_month_categories").querySelector(categorySearch);
		categoryDiv.remove()
	}

	// Handle average values
	// Sort categoryAverageInputs
	categoryAverageInputs = categoryAverageInputs.sort(function(a, b) {
		let keyA = a.data.avgSpending,
		  keyB = b.data.avgSpending;
		// Compare the 2 dates
		if (keyA < keyB) return 1;
		if (keyA > keyB) return -1;
		return 0;
	});
	
	// Remove $0 values from categoryAverageInputs
	for(let j = categoryAverageInputs.length - 1; j > 0; j--){
		if(categoryAverageInputs[j].data.avgSpending == 0){
			categoryAverageInputs.splice(j, 1);
		}
	}

	let j = 0
	for(j; j < categoryAverageInputs.length; j++){
		let categorySearch = "#category_" + (j + 1)
		let categoryDiv = document.querySelector("#loggedIn").querySelector(".average_categories").querySelector(categorySearch);
		categoryDiv.querySelector(".category_numbers_main").innerHTML = "$" + (categoryAverageInputs[j].data.avgSpending).toFixed(0)
		categoryDiv.querySelector(".category_numbers_sub").innerHTML = ((categoryAverageInputs[j].data.avgSpending / totalAverageSpending) * 100).toFixed(0) + "%"
		let categoryImage = categoryAverageInputs[j].category;
		categoryDiv.querySelector(".cateogory_emoji").src = "../../../images/Icons/" + categoryImage + ".png"
		categoryDiv.querySelector(".cateogory_emoji").addEventListener('mouseover', () => {
			document.querySelector("#loggedIn").querySelector(".average_categories").querySelector(".category_hover_over").innerHTML = categoryImage
		})
	}
	// Remove divs for categories that have $0 value
	for(let k = j; k < 5; k++){
		let categorySearch = "#category_" + (k + 1)
		let categoryDiv = document.querySelector("#loggedIn").querySelector(".average_categories").querySelector(categorySearch);
		categoryDiv.remove()
	}

}

// Create Transaction Category Icons
function createCategoryIconsDemo(){
	for(let i = 0; i < 5; i++){
		let categorySearch = "#category_" + (i + 1)
		let categoryDiv = document.querySelector("#notLoggedIn").querySelector(".this_month_categories").querySelector(categorySearch);
		let categoryImage = decodeURI(categoryDiv.querySelector(".cateogory_emoji").src)
		categoryDiv.querySelector(".cateogory_emoji").addEventListener('mouseover', () => {
			document.querySelector("#notLoggedIn").querySelector(".this_month_categories").querySelector(".category_hover_over").innerHTML = 
			categoryImage.substring(categoryImage.lastIndexOf('/') + 1).replace(/_/g, " ").slice(0,-4)
		})
	}

	for(let i = 0; i < 5; i++){
		let categorySearch = "#category_" + (i + 1)
		let categoryDiv = document.querySelector("#notLoggedIn").querySelector(".average_categories").querySelector(categorySearch);
		let categoryImage = decodeURI(categoryDiv.querySelector(".cateogory_emoji").src)
		categoryDiv.querySelector(".cateogory_emoji").addEventListener('mouseover', () => {
			document.querySelector("#notLoggedIn").querySelector(".average_categories").querySelector(".category_hover_over").innerHTML = 
			categoryImage.substring(categoryImage.lastIndexOf('/') + 1).replace(/_/g, " ").slice(0,-4)
		})
	}
}


// Create doughnut chart
function createDoughnutChart(calculatedDataCurrentSpend, caluclatedDataRemainingBudget, loggedInState){
	let svg = ""
	if(loggedInState){
		svg = d3.select("#doughnutChartLoggedIn")
				.append("svg")
				.attr("height", 160 + "px") // set svg element attributes
				.attr("width", 375 + "px")
				.append("g")
	} else {
		svg = d3.select("#doughnutChartNotLoggedIn")
				.append("svg")
				.attr("height", 160 + "px") // set svg element attributes
				.attr("width", 375 + "px")
				.append("g")
	}

	const donutText = document.getElementById("donutText");
	if(caluclatedDataRemainingBudget > 0){
		donutText.innerHTML = "You are $"+ caluclatedDataRemainingBudget.toFixed(0) +" under your average non-essential spending. Keep it up 😆!"
	} else {
		donutText.innerHTML = "You are over average monthly spend by $"+ (caluclatedDataRemainingBudget * -1).toFixed(0) + ". You got this next month!"
	}
	svg.append("g")
		.attr("class", "slices"); // doughnut slices

	let width = 375,
		height = 200,
		radius = Math.min(width, height) / 2; // positioning for doughnut within the svg

	let pie = d3.pie()
		.sort(null) // Sort the data input before passing to pie
		.value(function(d) {
			return d.value;
		});

	let arc = d3.arc()
		.outerRadius(radius - 20)
		.innerRadius(radius * 0.65); // inner arc for the doughnut hole


	svg.attr("transform", "translate(" + (width / 2 + 80) + "," + (height / 2 - 21) + ")");

	let key = function(d){ return d.data.label; };
	
	let color = ""
	if(caluclatedDataRemainingBudget > 0) {
		color = d3.scaleOrdinal()
		.domain(["Current Spend", "Remaining Budget"])
		.range(["#2D3A6F", "#CFD8DC"]);
	} else {
		color = d3.scaleOrdinal()
		.domain(["Current Spend"])
		.range(["#eed202"]);
	}


	
	
	let current_spend_data = { label: "Current Spend", value: Math.round(calculatedDataCurrentSpend * 100) / 100 }
	let remaining_budget = { label: "Remaining Budget", value: Math.round(caluclatedDataRemainingBudget * 100) / 100}

	let dataInput = [];
	dataInput.push(current_spend_data)
	if(caluclatedDataRemainingBudget > 0){
		dataInput.push(remaining_budget)
	}
	/* ------- PIE SLICES -------*/
	let slice = svg.select(".slices").selectAll("path.slice")
		.data(pie(dataInput), key)

	slice.enter()
		.insert("path")
		.style("fill", function(d) { 
			return color(d.data.label); })
		.attr("class", "slice")
		.attr("d", arc)
		.style("stroke-linecap", "round")
		.attr("stroke", "white")
		.style("stroke-width", "2px")


	// create a list of keys
	let keys = ["Current Spend"] 
	let keyValues = ["Current Spend ($" + calculatedDataCurrentSpend.toFixed(0) + ")"]
	
	if(caluclatedDataRemainingBudget > 0){
		keys.push("Remaining Budget")
		keyValues.push("Remaining Budget ($" + caluclatedDataRemainingBudget.toFixed(0) + ")")
	}

	// Add one dot in the legend for each name.
	svg.selectAll("mydots")
	.data(keys)
	.enter()
	.append("circle")
		.attr("cx", -245)
		.attr("cy", function(d,i){ return -65 + i*15}) // 100 is where the first dot appears. 25 is the distance between dots
		.attr("r", 4)
		.style("fill", function(d){ return color(d)})

	// Add one dot in the legend for each name.
	svg.selectAll("mylabels")
	.data(keyValues)
	.enter()
	.append("text")
		.attr("x", -237)
		.attr("y", function(d,i){ return -65 + i*15}) // 100 is where the first dot appears. 25 is the distance between dots
		.style("fill", "black")
		.text(function(d){ return d})
		.attr("text-anchor", "left")
		.style("font-size", "10px")
		.style("font-family", "Poppins")
		.style("alignment-baseline", "middle")

	// Add center text
	let totalBudget = calculatedDataCurrentSpend + caluclatedDataRemainingBudget;
	let xPositioningLead = 0;
	// Positioning when 3 digits in avg spend
	let twoDigitsXLead = -21;
	let threeDigitsXLead = -28; 
	let fourDigitsXLead = -31;
	let fiveDigitsXLead = -38;
	if (totalBudget < 100){
		xPositioningLead = twoDigitsXLead;
	} else if (totalBudget > 99 && totalBudget < 1000) {
		xPositioningLead = threeDigitsXLead;
	} else if (totalBudget > 999 && totalBudget < 10000) {
		xPositioningLead = fourDigitsXLead;
	} else if (totalBudget > 9999) {
		xPositioningLead = fiveDigitsXLead;
	}

	svg.selectAll("centerLabel") 
	.data(["$" + (totalBudget.toFixed(0))])
	.enter()
	.append("text")
		.attr("x", 0)
		.attr("y", function(d,i){ return 0})
		.style("fill", "black")
		.text(function(d){ return d})
		.attr("text-anchor", "middle")
		.attr("alignment-baseline", "middle")
		.style("font-size", "20px")
		.style("font-family", "Poppins")
		.style("alignment-baseline", "middle")

	let xPositioningSub = 0;
	// Positioning when 3 digits in avg spend
	let twoDigitsXSub = -38;
	let threeDigitsXSub = -37; 
	let fourDigitsXSub = -36;
	let fiveDigitsXSub = -35;
	if (totalBudget < 100){
		xPositioningSub = twoDigitsXSub;
	} else if (totalBudget > 99 && totalBudget < 1000) {
		xPositioningSub = threeDigitsXSub;
	} else if (totalBudget > 999 && totalBudget < 10000) {
		xPositioningSub = fourDigitsXSub;
	} else if (totalBudget > 9999) {
		xPositioningSub = fiveDigitsXSub;
	}
	svg.selectAll("centerLabelSup") 
	.data(["avg. spending"])
	.enter()
	.append("text")
		.attr("x", 0)
		.attr("y", 14)
		.style("fill", "grey")
		.text(function(d){ return d})
		.attr("text-anchor", "middle")
		.attr("alignment-baseline", "middle")
		.style("font-size", "10px")
		.style("font-family", "Poppins")
		.style("alignment-baseline", "middle")
	
	return;
}