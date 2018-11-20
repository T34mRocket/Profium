import xml2js from 'react-native-xml2js'
const parseXml = xml2js.parseString

/**
 * Contains all the functionalities for posting requests to the SPAQRL endpoint.
 * @author Ville Lohkovuori
*/

const QUERY_START = 'query='
const REMOTE_END_POINT = 'https://m1.profium.com/servlet/QueryServlet?'
const IMAGE = '<http://www.profium.com/archive/Image>'
const DEPICTED_OBJ = '<http://www.profium.com/archive/depictedObject>'
const DEPICTED_OBJ_INV = '<http://www.profium.com/archive/depictedObjectInverse>'
const MOD_DATE = '<http://www.profium.com/city/muokkausaika>'
const DATE_FORMAT = '<http://www.w3.org/2001/XMLSchema#dateTime>'
const THUMBNAIL_URL = '<http://www.profium.com/imagearchive/2007/thumbnail>' // what's in /contract-archive ??
const LARGE_THUMBNAIL_URL = '<http://www.profium.com/imagearchive/2007/largeThumbnail>'
const NORMAL_IMAGE_URL = '<http://www.profium.com/imagearchive/2007/normal>'
const DISPLAY_URL_START = 'https://m1.profium.com/displayContent.do?uri='
const ORDER_BY_DATE_DESC = 'ORDER BY DESC(?date)'

const IMG_TYPE_THUMB = '&type=thumb'
const IMG_TYPE_LARGE_THUMB = '&type=largeThumb'
const IMG_TYPE_NORMAL = '&type=normal'

// gives the useful, tag-like properties, e.g. 'marketing' or 'management'
const DOC_SPECIFIER = '<http://www.profium.com/tuomi/asiakirjatyypinTarkenne>'

// a sort of top-level document type name
// const VIEW = '<http://www.profium.com/archive/view>'

// common beginning to many queries; stored to save space & avoid redundancy
const IMAGE_DEPIC_COND = `?img a ${IMAGE} . ?img ${DEPICTED_OBJ} ?depic`

const GET_ALL_TOP_LVL_PROPS = `SELECT DISTINCT ?prop WHERE { ${IMAGE_DEPIC_COND} . ?depic ${DOC_SPECIFIER} ?prop }`

// const GET_ALL_VIEWS = `SELECT ?view WHERE { ${IMAGE_DEPIC_COND} . ?depic ${VIEW} ?view }`
// const GET_ALL_LARGE_THUMBNAIL_URLS = `SELECT ?url WHERE { ?img a ${IMAGE} . ?img ${LARGE_THUMBNAIL_URL} ?url }`

// I made it into an object because of the way that the queries work...
// we'll have to see if it causes any unpleasant side effects.
export default API = {

  QUERY_TYPE: {

    AND: '.',
    OR: 'UNION',
    NEG: 'NOT EXISTS'
  },

  query: function(config, useUri) {

    const request = REMOTE_END_POINT
    const options = {
      method: 'POST', // change to 'GET' now that it works
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `${QUERY_START}${config.query}`
    }
    // console.log("body: " + options.body)

    // using await + async would be better, but it's easier to do this since it's familiar
    return fetch(request, options)
    .then(response => response.text())
    .then(responseText => { 

      const xml = responseText
      // console.log("xml: " + xml) // useful for debugging; do not delete !!
      let resultsSet = new Set()
      parseXml(xml, function (err, result) {
        
        // console.log("JSON: " + JSON.stringify(result))

        const results = result.sparql.results[0].result
        // console.log("truncated JSON: " + JSON.stringify(results))
        
        if (results !== undefined && results !== null) { 

          results.forEach(item => {
            
            // turn it into a switch if more return formats emerge... NOTE: always check what is actually returned from the server, 
            // before trying to work with the returned result!
            if (useUri === true) {
              
              resultsSet.add(item.binding[0].uri[0])
            } else {     
              resultsSet.add(item.binding[0].literal[0]._)
            }
          }) // forEach
        } // if
      }) // parseXml
      // console.log("query resultsSet: " + resultsSet)
      return resultsSet
    })
    .catch(error => console.error(error))
  }, // query

  getTopLevelImageProps: function() {
    
    const config = {
      query: GET_ALL_TOP_LVL_PROPS // fetch the top level category names
      // this can have other properties as needed
    }
    return this.query(config, false)
  }, // getTopLevelImageProps

  // first param is an array of search terms.
  // queryType comes from enum in this file.
  // startDate and endDate need to be properties in HomeScreen's state (set by moving the slider); 
  // default values can be something like 01.01.2000 and the current date/timestamp 
  // (formatted correctly like this: '2017-04-28T05:13:22').
  onChoosingPropsGetUrls: function(chosenProps, queryType, startDate, endDate) {

    const numOfTerms = chosenProps.length
    let queryString = ''

    // there's some duplicate code, but it's better for readability to contain each query within its own block
    if (numOfTerms === 1) {

      // '%26%26' == '&&' in this bizarro world
      queryString = `SELECT DISTINCT ?url WHERE { ?depic ${MOD_DATE} ?date 
      . ?depic ${DOC_SPECIFIER} '${chosenProps[0]}' 
      . ?depic ${DEPICTED_OBJ_INV} ?url FILTER ( ?date >= '${startDate}'^^${DATE_FORMAT} %26%26 ?date <= '${endDate}'^^${DATE_FORMAT} ) } ${ORDER_BY_DATE_DESC}`
    } else {

      switch(queryType) {

        case this.QUERY_TYPE.OR:

          queryString = `SELECT DISTINCT ?url WHERE { ?depic ${MOD_DATE} ?date . `

          chosenProps.forEach( (term, index) => {

            queryString += `{ ?depic ${DOC_SPECIFIER} '${term}' 
            . ?depic ${DEPICTED_OBJ_INV} ?url }`
            if (index !== numOfTerms-1) {
              queryString += ` ${this.QUERY_TYPE.OR} `
            }
          }) // forEach
          queryString += ` FILTER ( ?date >= '${startDate}'^^${DATE_FORMAT} %26%26 ?date <= '${endDate}'^^${DATE_FORMAT} ) } ${ORDER_BY_DATE_DESC}`
          break

        case this.QUERY_TYPE.AND:

          queryString = `SELECT DISTINCT ?url WHERE { ?depic ${MOD_DATE} ?date . `

          chosenProps.forEach( (term, index) => {

            queryString += `?depic ${DOC_SPECIFIER} '${term}' 
            . ?depic ${DEPICTED_OBJ_INV} ?url`
            if (index !== numOfTerms-1) {
              queryString += ` ${this.QUERY_TYPE.AND} `
            }
          }) // forEach
          queryString += ` FILTER ( ?date >= '${startDate}'^^${DATE_FORMAT} %26%26 ?date <= '${endDate}'^^${DATE_FORMAT} ) } ${ORDER_BY_DATE_DESC}`
          break

        case this.QUERY_TYPE.NEG:

          break

        default:
          break
      } // switch
    } // else

    // console.log("query: " + queryString)
    const config = {
      query: queryString
    }
    return this.query(config, true)
  }, // onChoosingPropsGetUrls

  smallImageDisplayUrl: function(imageUrl) {
  
    return `${DISPLAY_URL_START}${imageUrl}${IMG_TYPE_LARGE_THUMB}`
  },

  fulllImageDisplayUrl: function(imageUrl) {

    return `${DISPLAY_URL_START}${imageUrl}${IMG_TYPE_NORMAL}`
  }

} // API