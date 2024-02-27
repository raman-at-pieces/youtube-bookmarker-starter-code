import { getActiveTabURL } from "./utils"

// Adds functionality to control buttons
const setButtonControl = (icon, title, eventListener, parentElement) => { 
   const controlElement = document.createElement("img")

   controlElement.src = "assets/" + icon + ".png"
   controlElement.title = title

   controlElement.addEventListener("click", eventListener)
   // controlElement.style = ""
   parentElement.appendChild(controlElement)
};


const onDownload = async () => {
   const activeTab = await getActiveTabURL()

   chrome.tabs.sendMessage(activeTab.id, {
      type: "toDownload"
   })
};

document.addEventListener("DOMContentLoaded", async () => {
   const activeTab = await getActiveTabURL();

   if (activeTab.url.includes("bu.edu/link/bin/uiscgi_studentlink.pl/")) {
      // Add download button and functionality
      const downloadButton = document.getElementById("download")
      setButtonControl("download", "Download schedule", onDownload, downloadButton)
   } else {
      // when current tab is not BU schedule 
      const container = document.getElementsByClassName("container")[0];
      container.innerHTML = '<div class="title">This is not a BU schedule page.</div>';
   }
});

// send message to contentScript
const onDownload = async () => {
   const activeTab = await getActiveTabURL()

   chrome.tabs.sendMessage(activeTab.id, {
      type: "generateFile",
      value: ""
   })
};