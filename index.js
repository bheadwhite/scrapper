var axios = require("axios")
var cheerio = require("cheerio")
var puppeteer = require("puppeteer")

const url = "https://www.timeanddate.com/weather/usa/st-george/historic"

puppeteer
  .launch()
  .then(browser => browser.newPage())
  .then(page => page.goto(url).then(() => page.content()))
  .then(html => {
    const $ = cheerio.load(html)
    const sections = $("#weather .section")
    const data = []
    sections.each((i, e) => {
      // console.log("length", e.childNodes.length)
      if (e.childNodes.length === 6) {
        console.log("-------------------------------")
        console.log("date", e.childNodes[0].firstChild.data)
        console.log("-------------------------------")
        console.log(
          "time",
          e.childNodes[2].firstChild.data,
          "high",
          e.childNodes[4].firstChild.data,
          "low",
          e.childNodes[1].firstChild.data
        )
        console.log()
      } else if (e.childNodes.length === 5) {
        console.log(
          "time",
          e.childNodes[1].firstChild.data,
          "high",
          e.childNodes[3].firstChild.data,
          "low",
          e.childNodes[0].firstChild.data
        )
        console.log()
      }
    })
  })
