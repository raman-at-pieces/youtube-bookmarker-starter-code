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

   // TO ICS FILE
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
 * Converts 12hr time to 24hr time
 * Courtesy Chris Dąbrowski on Stackoverflow
 * @param {String} time12h 
 * @returns 
 */
const convertTime12to24 = (time12h) => {
   let time = time12h.slice(0, -2)
   let modifier = time12h.slice(-2)  // gets last two characters of string

   let [hours, minutes] = time.split(':');

   if (hours === '12') {
      hours = '00';
   }

   if (modifier === 'pm') {
      hours = parseInt(hours, 10) + 12;
   }

   return `${hours}:${minutes}`;
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
   let classEvent = {}

   let classCode = rowArr[0].innerText                   // "CAS CS210 A1"
   let titleAndProf = rowArr[4].innerText.split("\n")    // ["Comp Systems", "Narayanan"]
   let classType = rowArr[6].innerText                   // "Lecture"

   let classLocation = rowArr[7].innerText + " " + rowArr[8].innerText  // "LAW 101"

   let day = rowArr[9].innerText.split(",")              // ["Tue", "Thu"]
   let startTime = convertTime12to24(rowArr[10].innerText)// "12:30pm" but in 24hr
   let endTime = convertTime12to24(rowArr[11].innerText) // "1:45pm" but in 24hr

   classEvent["title"] = classCode.substr(classCode.indexOf(" ") + 1) + " " + titleAndProf[0] + " " + classType

   classEvent["location"] = classLocation

   // turn "day" list into rrule fragment
   // visit https://freetools.textmagic.com/rrule-generator to learn more
   let rrule = day.shift().slice(0, 2).toUpperCase()
   while (day.length != 0) {
      rrule += "," + day.shift().slice(0, 2).toUpperCase()
   }
   let numWeeks = 14; // Assumes 14 weeks in a semester
   let endDate = new Date().setDate(startDate + numWeeks * 7);    // startDate injected from popup.js
   endDate = endDate.toString().replace("-", "")

   classEvent["recurrenceRule"] = "FREQ=WEEKLY;BYDAY=" + rrule + ";INTERVAL=1;UNTIL=" + endDate + "T000000Z"

   let start = startDate.concat(startTime.split(":"))    // adds time (e.g. ["8", "55"]) to startDate
   start.forEach((o, i, a) => a[i] = +a[i])              // turns each element to number
   classEvent["start"] = start                           // assigns start to class event object
   console.log("Start:");
   console.log(start);

   let end = startDate.concat(endTime.split(":"))        // same parse as above
   end.forEach((o, i, a) => a[i] = +a[i])
   classEvent["end"] = end
   console.log("End:");
   console.log(end);

   return classEvent
}

// main calls to function
console.log("Parse classes script injected");
console.log(startDate);
startDate = startDate.toString().split("-")  // turns date into ["2024", "2", "28"]
generateClassesCalender()


// ics input format:
// for more info, look at ics's npm documentation
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