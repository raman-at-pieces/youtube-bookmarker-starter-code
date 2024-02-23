(() => {
   let currentTabId = "";

   chrome.runtime.onMessage.addListener((obj, sender, response) => {
      const { type, tabId } = obj;

      if (type === "isSchedule") {
         currentTabId = tabId;
      } else if (type === "toDownload") {
         console.log("Got download message");
         getCurrentSchedule();
      }
   });

   const getCurrentSchedule = () => {
      // The table we want is the fourth on the page
      const scheduleTable = document.getElementsByTagName("table")[4].lastChild
      console.log("Current schedule got");
   }
})();