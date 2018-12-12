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
const DISPLAY_URL_START = 'https://m1.profium.com/displayContent.do?uri='
const ORDER_BY_DATE_DESC = 'ORDER BY DESC(?date)'

// const IMG_TYPE_THUMB = '&type=thumb' // not used atm
const IMG_TYPE_LARGE_THUMB = '&type=largeThumb'
const IMG_TYPE_NORMAL = '&type=normal'

// gives the useful, tag-like properties, e.g. 'marketing' or 'management'
const DOC_SPECIFIER = '<http://www.profium.com/tuomi/asiakirjatyypinTarkenne>'

const GET_ALL_TOP_LVL_PROPS = `SELECT DISTINCT ?prop WHERE { ?img a ${IMAGE} . ?img ${DEPICTED_OBJ} ?depic . ?depic ${DOC_SPECIFIER} ?prop }`

export default API = {

  QUERY_TYPE: {

    AND: '.',
    OR: 'UNION'
  },

  _query: function(config) {

    const requestPoint = REMOTE_END_POINT
    const options = {
      method: 'POST', // should be GET, but this works fine
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `${QUERY_START}${config.query}`
    }

    // console.log("\n query: " + options.body +"\n")

    return fetch(requestPoint, options)
    .then(response => response.text())
    .then(responseText => { 

      const xml = responseText
      let resultsSet = new Set()

      parseXml(xml, function (err, result) {

        try {

          const results = result.sparql.results[0].result
          
          if (results !== undefined && results !== null) { 

            results.forEach(item => {
              
              // there seem to be two return formats
              if (config.useUri === true) {
                
                resultsSet.add(item.binding[0].uri[0])
              } else {     

                resultsSet.add(item.binding[0].literal[0]._)
              }
            }) // forEach
          } // if
        } catch(error) {
          console.log("error processing query: " + error) // not ideal, but at least the app doesn't crash with every failed query
        }
      }) // parseXml

      return Array.from(resultsSet)
    })
    .catch(error => console.error(error))
  }, // _query

  getTopLevelImageProps: function() {
    
    const config = {
      query: GET_ALL_TOP_LVL_PROPS, // fetch the top level category names
      useUri: false
    }
    return this._query(config)
  }, // getTopLevelImageProps

  // called when clicking on an image to enter the detail view
  getImageDetails: function(imageUrl) {

    const timeStampPromise = this._getImageTimeStamp(imageUrl)

    const tagsPromise = this._getImageTags(imageUrl)

    return Promise.all([timeStampPromise, tagsPromise]).then(resultsArray => {

      return { timeStamp: resultsArray[0], tags: resultsArray[1] }
    })
  }, // getImageDetails

  _getImageTimeStamp: function(imageUrl) {

    const query = `SELECT DISTINCT ?timestamp WHERE { ?depic ${DEPICTED_OBJ_INV} '${imageUrl}' . 
    ?depic ${MOD_DATE} ?timestamp }`

    const config = {
      query: query,
      useUri: false
    }
    return this._query(config)
  },

  _getImageTags: function(imageUrl) {

    const query = `SELECT DISTINCT ?tag WHERE { ?depic ${DEPICTED_OBJ_INV} '${imageUrl}' . 
    ?depic ${DOC_SPECIFIER} ?tag }`

    const config = {
      query: query,
      useUri: false
    }
    return this._query(config)
  },

  // orTypeQueries is an array of arrays of AND-type searches (which contain QueryData objects).
  // startDate and endDate are properties in HomeScreen's state (set by moving the timeline slider)
  onChoosingPropsGetUrls: function(orTypeQueries, startDate, endDate) {

    /* // example of a typical query array:
      orTypeQueries = [
      [ QueryData(term='dog'), QueryData(term='alive'), QueryData(term='yellow') ], 
      [ QueryData(term='cat') ], 
      [ QueryData(term='goose'), QueryData(term='white') ]
    ]
    */

    const numOfOrTypeQueries = orTypeQueries.length

    let queryString = 'SELECT DISTINCT ?url WHERE { '

    if (numOfOrTypeQueries > 1) {

      queryString += '{ '
    }

    orTypeQueries.forEach( (andTypeInnerArray, arrIndex) => {

      if (arrIndex !== 0 && arrIndex < numOfOrTypeQueries) {
        queryString += ` } ${this.QUERY_TYPE.OR} { `
      }

      const andArrayLength = andTypeInnerArray.length

      let tagNumber = 0
      
      andTypeInnerArray.forEach( (queryData, index) => {

        if (queryData.isNegative) {

          const tagId = `?tag${++tagNumber}` // the tag will need to be unique for each query to ensure correct results
          
          // '!' == '%21' in the weird encoding that this stuff uses.
          // there are 3-4 tag properties on each image; the !bound() operation 
          // ensures that we don't return the image url if even one tag matches the given term
          queryString += `?depic ${MOD_DATE} ?date . ?depic ${DEPICTED_OBJ_INV} ?url . 
          OPTIONAL { ?depic ${DOC_SPECIFIER} ${tagId} . FILTER (${tagId} = '${queryData.term}') } . FILTER ( %21bound(${tagId}) )`
        } else {

          queryString += `?depic ${MOD_DATE} ?date . ?depic ${DOC_SPECIFIER} '${queryData.term}' 
          . ?depic ${DEPICTED_OBJ_INV} ?url`
        }

        if (index !== andArrayLength-1) {
          queryString += ` ${this.QUERY_TYPE.AND} `
        }
      }) // AND-type forEach

      if (numOfOrTypeQueries > 1 && arrIndex !== 0) { 
        
        queryString += ' }' 
      }
    }) // OR-type forEach

    // '%26%26' == '&&'... who did this?
    queryString += ` FILTER ( ?date >= '${startDate}'^^${DATE_FORMAT} %26%26 ?date <= '${endDate}'^^${DATE_FORMAT} ) } ${ORDER_BY_DATE_DESC}`

    const config = {
      query: queryString,
      useUri: true
    }

    return this._query(config)
  }, // onChoosingPropsGetUrls

  // helper functions for converting returned 'raw' urls to a format that's 
  // needed for displaying the images in the ui.
  smallImageDisplayUrl: function(imageUrl) {
  
    return `${DISPLAY_URL_START}${imageUrl}${IMG_TYPE_LARGE_THUMB}`
  },

  fullImageDisplayUrl: function(imageUrl) {

    return `${DISPLAY_URL_START}${imageUrl}${IMG_TYPE_NORMAL}`
  }

} // API