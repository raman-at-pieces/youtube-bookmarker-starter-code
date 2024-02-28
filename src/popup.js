// Add listener to popup
document.addEventListener("DOMContentLoaded", async () => {
   let activeTab = await getActiveTabURL();

   if (activeTab.url.includes("bu.edu/link/bin/uiscgi_studentlink.pl/")) {
      // Add download button and functionality
      let downloadButton = document.getElementById("download")
      setButtonControl("download", "Download schedule", onClassesDownload, downloadButton)

      let inputDiv = document.getElementById("dateInput")
      setDateInput(inputDiv)
   } else {
      // when current tab is not BU schedule 
      let container = document.getElementsByClassName("container")[0];
      container.innerHTML = '<div class="title">This is not a BU schedule page.</div>';
   }
});


// Helper: Get active tab's url (used in popup)
export async function getActiveTabURL() {
   let tabs = await chrome.tabs.query({
      currentWindow: true,
      active: true
   });

   return tabs[0];
}

// send message to contentScript
const onClassesDownload = async () => {
   let activeTab = await getActiveTabURL()

   let startDate = document.getElementById("inputTag").value

   chrome.scripting.executeScript({
      target: {tabId: activeTab.id},
      args: [{startDate: startDate}],
      func: vars => Object.assign(self, vars),
    }, () => {
      chrome.scripting.executeScript({
         target: { tabId: activeTab.id },
         files: ['parseClassesSchedule.bundle.js']
      });
    });

};

// Adds functionality to control buttons
const setButtonControl = (icon, title, eventListener, parentElement) => {
   let controlElement = document.createElement("img")

   controlElement.src = "assets/" + icon + ".png"
   controlElement.title = title

   controlElement.addEventListener("click", eventListener)
   // TODO: style download button: controlElement.style = ""
   parentElement.appendChild(controlElement)
};

const setDateInput = (parentElement) => {
   let inputElement = document.createElement("input")

   inputElement.type = "date"
   inputElement.valueAsDate = new Date();
   inputElement.id = "inputTag"

   parentElement.appendChild(inputElement)
}