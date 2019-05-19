#!/usr/bin/env node

const cheerio = require('cheerio')
const request = require('request')

let setUrl = 'https://elderscrollsonline.wiki.fextralife.com/Set+Bonus+Crafting+Locations'

request(setUrl, (err, res, body) => {

  let $ = cheerio.load(body)
  let results = []

  $('.row').each((_, el) => {

    let $el = $(el)

    let result = {
      name: $el.find('a:contains(" Set")').text().replace(' Set', ''),
      traitsRequired: 0,
      locations: [],
    }

    let traitsRequired = $el.find('p:contains(" Traits Required")').text().trim()
    if (traitsRequired) {
      result.traitsRequired = Number(traitsRequired.match(/(\d+)/g))
    }

    $el.find('.col-sm-3.col-xs-4').each((_, el) => {
      let location = {
        name: $(el).find('h3:first-of-type + *').text().trim(),
        zone: $(el).find('h3:first-of-type').text().trim(),
      }
      if (location.name && location.zone) {
        result.locations.push(location)
      }
    })

    result.locations = result.locations.sort((a, b) => a.name.localeCompare(b.name))

    if (result.name) {
      results.push(result)
    }

  })

  results = results.sort((a, b) => a.name.localeCompare(b.name))

  console.log(JSON.stringify(results))

})
