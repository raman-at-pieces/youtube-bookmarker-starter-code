chrome.tabs.onUpdated.addListener(
   (tabId, changeInfo, tab) => {
     console.log('Updated to URL:', tab.url)
     if(tab.url && tab.url.includes("bu.edu/link/bin/uiscgi_studentlink.pl/")) {
         console.log("This is student link schedule page");

         chrome.tabs.sendMessage(tabId, {
            type: "isSchedule"
         });
      }
   }
 )
  