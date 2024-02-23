// Get active tab's url (used on popup page)
async function getActiveTabURL() {
   const tabs = await chrome.tabs.query({
      currentWindow: true,
      active: true
   });

   return tabs[0];
}

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
      // do something
      const downloadButton = document.getElementById("download")
      await setButtonControl("download", "Download schedule", onDownload, downloadButton)
   } else {
      // when current tab is not BU schedule 
      const container = document.getElementsByClassName("container")[0];
      container.innerHTML = '<div class="title">This is not a BU schedule page.</div>';
   }
});
