// var axios = require("axios")
var cheerio = require("cheerio")
var puppeteer = require("puppeteer")
var jsdom = require("jsdom")

const weatherHistory = "https://www.timeanddate.com/weather/usa/st-george/historic"
const currentWeather = "https://www.timeanddate.com/weather/usa/st-george"

// puppeteer
//   .launch()
//   .then(browser => browser.newPage())
//   .then(page => page.goto(weatherHistory).then(() => page.content()))
//   .then(html => {
//     const $ = cheerio.load(html)
//     const sections = $("#weather .section")
//     const data = []
//     sections.each((i, e) => {
//       // console.log("length", e.childNodes.length)
//       if (e.childNodes.length === 6) {
//         console.log("-------------------------------")
//         console.log("date", e.childNodes[0].firstChild.data)
//         console.log("-------------------------------")
//         console.log(
//           "time",
//           e.childNodes[2].firstChild.data,
//           "high",
//           e.childNodes[4].firstChild.data,
//           "low",
//           e.childNodes[1].firstChild.data
//         )
//         console.log()
//       } else if (e.childNodes.length === 5) {
//         console.log(
//           "time",
//           e.childNodes[1].firstChild.data,
//           "high",
//           e.childNodes[3].firstChild.data,
//           "low",
//           e.childNodes[0].firstChild.data
//         )
//         console.log()
//       }
//     })
//   })
//   .then(() => puppeteer.launch())
puppeteer
  .launch()
  .then(browser => browser.newPage())
  .then(page => page.goto(currentWeather).then(() => page.content()))
  .then(html => {
    const { JSDOM } = jsdom
    const { document } = new JSDOM(html).window
    const weatherSections = document.querySelectorAll(".eight.columns")

    const next5table = weatherSections[0].querySelectorAll("table tbody tr")
    const fiveTime = next5table[0]
    const fiveTemperature = next5table[2]

    const getChildren = array => {
      let newArray = []
      array.forEach(e => {
        const value = e.textContent.trim()
        if (value !== "") {
          if (value === "Evening") {
            newArray.push("Late Evening")
          } else if (value === "Night") {
            newArray.push("Early Morning")
          } else {
            newArray.push(e.textContent)
          }
        }
      })
      return newArray
    }

    console.log("next 5 hours")
    console.log(fiveTime.textContent)
    console.log(fiveTemperature.textContent)

    const next48 = {}
    const next48section = weatherSections[1]
    const next48headers = next48section.querySelectorAll("thead tr")
    const next48body = next48section.querySelectorAll("tbody tr > *")
    const next48tableData = getChildren(next48body)
    let key
    let dayIndex = 0
    let columnIndex = 0
    let finalTableData = []

    console.log("next 48 hours")
    next48.days = getChildren(next48headers[0].querySelectorAll("th"))
    next48.timeOfDay = getChildren(next48headers[1].querySelectorAll("th"))

    next48tableData.forEach(data => {
      const regex = /forecast|temperature|feels\slike|wind\sspeed|wind\sspeed|wind\sdirection|humidity|dew\spoint|visibility|probability\sof\sprecipitation/i
      if (data.match(regex)) {
        key = data
      } else {
        const newObj = {}
        newObj[key] = data
        //working with pertinant data here
        const day = next48.days[dayIndex]
        const timeOfDay = next48.timeOfDay[columnIndex]
        if (timeOfDay === "Late Evening") {
          dayIndex++
        }
        if (columnIndex >= 6) {
          columnIndex = 0
        } else {
          columnIndex += 1
        }

        finalTableData.push({ day, timeOfDay, ...newObj })
      }
    })
    console.log(finalTableData)
  })
