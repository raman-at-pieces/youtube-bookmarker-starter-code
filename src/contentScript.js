import * as ics from 'ics'
import { convertHTMLTableToArray, createClassEvent } from './utils'

(() => {
   console.log("Content script injected");

   // Recieve message listener
   chrome.runtime.onMessage.addListener((obj, sender, response) => {
      const { type, value, tabId } = obj;

      if (type === "generateFile") {
         console.log("Got generate file message");
         createClassSchedule();
      }
   });

   const createClassSchedule = () => {
      // init
      let classes = [] // list for all classes

      // Gets corresbonding table from website
      let scheduleTable = document.getElementsByTagName("table")[4].lastChild

      // Convert table and its rows to a 2-d array
      // Each element is a cell of a single <td> element
      let tableArr = convertHTMLTableToArray(scheduleTable)

      console.log(tableArr);

      // Create class from each row in tableArr
      tableArr.forEach(row => {
         classes.push(createClassEvent(row))
      })

      console.log(classes);

      // convert classes array to ics formatting
      let { error, value } = ics.createEvents(classes)

      // handles ics error
      if (error) {
         console.log(error)
         return
      } else {
         // create ics file
         let blob = new Blob([value], { type: "text/calendar" });
         // create url to host file
         let url = URL.createObjectURL(blob)

         // send message to background.js to download
         chrome.runtime.sendMessage({
            type: "downloadFile",
            url: url
         })
      }
   }
})();