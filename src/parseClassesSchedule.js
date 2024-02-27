import * as ics from 'ics'

// CONVERT HTML TO EVENTS ------------------------------------------
const generateClassesCalender = () => {
   // init
   let classes = [] // list for all classes

   // Gets corresbonding table from website
   let scheduleTable = document.getElementsByTagName("table")[4].lastChild

   // Convert table and its rows to a 2-d array
   // (Each element is a cell of a single <td> element)
   let tableArr = convertHTMLTableToArray(scheduleTable)

   console.log(tableArr);

   // Create class from each row in tableArr
   tableArr.forEach(row => {
      classes.push(createClassEvent(row))
   })

   console.log(classes);

   // TO ICS FILE -----------------------------------------------
   // convert classes array to ics formatting
   let { error, value } = ics.createEvents(classes)

   // handles ics error
   if (error) {
      console.log(error)
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


// HELPER FUNCTIONS -------------------------------------------
/**
 * Removes weird HTML formatting from student link.
 * (It's a separate function so if they update student link this can be easily updated)
 * @param {Array} tableArr Array form of the HTML table
 * @returns {Array}        Same array but cleaner and ready to be parsed
 * 
 * @note Update this immediately after student link updates!!!
 *       This cleaning is HARDCODED
 * @todo Potential misc feat: extract semester name
 */
const cleanTableArray = (tableArr) => {
   // Removes the top row bc it's the titles
   // (easier to do so after converted to array)
   tableArr.shift()

   // Removes sidebar html that is in the first row element 
   // (yea it's weird formatting I know)
   tableArr.at(0).shift()

   // remove empty rows at the bottom
   let lastRow = tableArr[tableArr.length - 1]
   // (only empty rows are of lenth 14 for some reason?)
   while (lastRow.length == 14) {
      tableArr.pop() // remove last row
      lastRow = tableArr[tableArr.length - 1] // update last row
   }

   // like srsly what is this formatting T_T

   return tableArr
}


const convertHTMLTableToArray = (htmlTable) => {
   // turn table into array
   let tableArr = Array.from(htmlTable.children)

   // turn each row also into an array (of <td> tags)
   for (let index = 0; index < tableArr.length; index++) {
      tableArr[index] = Array.from(tableArr[index].children)
   }

   // remove weird formatting
   tableArr = cleanTableArray(tableArr)

   return tableArr
}


/**
 * Parse one row of HTML element and returns an event object for ics package
 * @param {Array[<td>]} rowArr An array of a row in the table, 
 *    each element is in the following format:
 * <td>
 *    <font size="-1" color="#330000" face="Verdana, Helvetica, Arial, sans-serif">text</font>
 * </td>
 */
const createClassEvent = (rowArr) => {
   let classCode = rowArr[0].innerText
   let titleAndProf = rowArr[4].innerText.split("\n")
   let classType = rowArr[6].innerText
   let classLocation = rowArr[7].innerText + rowArr[8].innerText
   let day = rowArr[9].innerText.split(",")
   let startTime = rowArr[10].innerText
   let endTime = rowArr[11].innerText

   // TODO: populate classEvent
   //       reorganize for Sydney's part
   let classEvent = {

   }

   const event = {
      start: [2018, 5, 30, 6, 30],
      duration: { hours: 6, minutes: 30 },
      title: 'Bolder Boulder',
      description: 'Annual 10-kilometer run in Boulder, Colorado',
      location: 'Folsom Field, University of Colorado (finish line)',
      url: 'http://www.bolderboulder.com/',
      geo: { lat: 40.0095, lon: 105.2669 },
      categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
      attendees: [
         { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
         { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton', role: 'OPT-PARTICIPANT' }
      ]
   }

   return event
}


console.log("Parse classes script injected");
generateClassesCalender()


// ics input format:
// const event = {
//    start: [2018, 5, 30, 6, 30],
//    duration: { hours: 6, minutes: 30 },
//    title: 'Bolder Boulder',
//    description: 'Annual 10-kilometer run in Boulder, Colorado',
//    location: 'Folsom Field, University of Colorado (finish line)',
//    url: 'http://www.bolderboulder.com/',
//    geo: { lat: 40.0095, lon: 105.2669 },
//    categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
//    status: 'CONFIRMED',
//    busyStatus: 'BUSY',
//    organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
//    attendees: [
//       { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
//       { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton', role: 'OPT-PARTICIPANT' }
//    ]
// }