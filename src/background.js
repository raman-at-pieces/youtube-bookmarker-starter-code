console.log("background is working");

chrome.runtime.onMessage.addListener((obj, sender, response) => {
   const { type, url } = obj;

   if (type === "downloadFile") {
      console.log("Got download message");

      // downloads file from url
      chrome.downloads.download({
         url: url, // The object URL can be used as download URL
         filename: "Classes Schedule.ics"
      });
   }
});