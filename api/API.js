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
// there seems to be no ill effects from it.
export default API = {

  // in practice, this doesn't really need to exist... remove maybe
  QUERY_TYPE: {

    AND: '.',
    OR: 'UNION'
  },

  query: function(config) {

    // console.log("called query")

    const request = REMOTE_END_POINT
    const options = {
      method: 'POST', // change to 'GET' now that it works
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `${QUERY_START}${config.query}`
    }
    console.log("query body: " + options.body)

    // using await + async would be better, but it's easier to do this since it's familiar
    return fetch(request, options)
    .then(response => response.text())
    .then(responseText => { 

      const xml = responseText
      // console.log("xml: " + xml)
      let resultsSet = new Set()
      parseXml(xml, function (err, result) {

        try {
          // console.log("JSON: " + JSON.stringify(result))
          const results = result.sparql.results[0].result
          // console.log("truncated JSON: " + JSON.stringify(results))
          
          if (results !== undefined && results !== null) { 

            // console.log("got results")
            results.forEach(item => {
              
              // turn it into a switch if more return formats emerge... NOTE: always check what is actually returned from the server, 
              // before trying to work with the returned result!
              if (config.useUri === true) {
                
                // console.log("in useUri block")
                resultsSet.add(item.binding[0].uri[0])
              } else {     
                // console.log("in literal block")
                resultsSet.add(item.binding[0].literal[0]._)
              }
            }) // forEach
          } // if
        } catch(error) {
          console.log("error processing query: " + error) // not ideal, but the app doesn't crash with each failed query now
        }
      }) // parseXml
      return resultsSet
    })
    .catch(error => console.error(error))
  }, // query

  getTopLevelImageProps: function() {
    
    const config = {
      query: GET_ALL_TOP_LVL_PROPS, // fetch the top level category names
      useUri: false
    }
    return this.query(config)
  }, // getTopLevelImageProps

  
  // called when clicking on an image to enter the detail view
  getImageDetails: function(imageUrl) {

    const timeStampPromise = this._getImageTimeStamp(imageUrl).then(resultsSet => {

      const timeStamp = Array.from(resultsSet)[0] // should only contain one value
      // console.log("timestamp: " + timeStamp)
      return timeStamp
    })

    const tagsPromise = this._getImageTags(imageUrl).then(resultsSet2 => {

      const tags = Array.from(resultsSet2)
      /* tags.forEach(item => {
          console.log("tag: " + item)
      }) */
      return tags
    })

    return Promise.all([timeStampPromise, tagsPromise]).then(resultsarray => {

      return { timeStamp: resultsarray[0], tags: resultsarray[1] }
    })
  }, // getImageDetails

  _getImageTimeStamp: function(imageUrl) {

    const query = `SELECT DISTINCT ?timestamp WHERE { ?depic ${DEPICTED_OBJ_INV} '${imageUrl}' . 
    ?depic ${MOD_DATE} ?timestamp }`

    const config = {
      query: query,
      useUri: false
    }
    return this.query(config)
  },

  _getImageTags: function(imageUrl) {

    const query = `SELECT DISTINCT ?tag WHERE { ?depic ${DEPICTED_OBJ_INV} '${imageUrl}' . 
    ?depic ${DOC_SPECIFIER} ?tag }`

    const config = {
      query: query,
      useUri: false
    }
    return this.query(config)
  },

  // queryArray is an array of arrays of AND-type searches (which contain QueryData objects).
  // startDate and endDate are properties in HomeScreen's state (set by moving the slider)
  onChoosingPropsGetUrls: function(queryArray, startDate, endDate) {

    /* // example of a queryArray; not meant to be used anywhere!
    const orTypeQueries = [
      [ QueryData(term='dog'), QueryData(term='alive'), QueryData(term='yellow') ], 
      [ QueryData(term='cat') ], 
      [ QueryData(term='goose'), QueryData(term='white') ]
    ]
    */

    let queryString = ''

    const orTypeQueries = queryArray
    const numOfOrTypeQueries = orTypeQueries.length

    if (numOfOrTypeQueries === 1) {

      queryString = `SELECT DISTINCT ?url WHERE { `
    } else {
      queryString = `SELECT DISTINCT ?url WHERE { `
    }

    let negativeQueryTerms = []

    orTypeQueries.forEach( (andTypeInnerArray, arrIndex) => {

      if (numOfOrTypeQueries > 1) {
        queryString += '{ '
      }

      andTypeInnerArray.forEach( (queryData, index) => {

        if (queryData.isNegative) {
          /*

          negativeQueryTerms.push(queryData.term)

          // we need to select all images to filter them later... this is a special case when there's just one negative search term
          if (numOfOrTypeQueries === 1) { 
            queryString += `?depic ${DEPICTED_OBJ_INV} ?url`
          } */

          /*
          // NOTE: I'm only 80 % sure that this works correctly atm
          queryString += `?depic ${DOC_SPECIFIER} ?spec . ?depic ${DEPICTED_OBJ_INV} ?url . 
          FILTER (?spec != '${queryData.term}')` */
        } else {

          queryString += `?depic ${MOD_DATE} ?date . ?depic ${DOC_SPECIFIER} '${queryData.term}' 
          . ?depic ${DEPICTED_OBJ_INV} ?url`
        }
        if (index < andTypeInnerArray.length-1) {
          queryString += ` ${this.QUERY_TYPE.AND} `
        }
      }) // forEach and-type query

      if (numOfOrTypeQueries > 1) { 
        
        queryString += ' }' 
      }

      if (arrIndex < numOfOrTypeQueries-1 && numOfOrTypeQueries > 1) {
        queryString += ` ${this.QUERY_TYPE.OR} `
      }
    }) // forEach or-type query
    queryString += ` FILTER ( ?date >= '${startDate}'^^${DATE_FORMAT} %26%26 ?date <= '${endDate}'^^${DATE_FORMAT} ) } ${ORDER_BY_DATE_DESC}`

    // console.log("query: " + queryString)
    const config1 = {
      query: queryString,
      useUri: true
    }

    if (negativeQueryTerms.length === 0) {

      return this.query(config1).then(resultsSet => { return Array.from(resultsSet)} )
    } else {

      console.log("there were negative query terms")

      let queryString2 = ''

      const numOfNegTerms = negativeQueryTerms.length
      if (numOfNegTerms === 1) {

        queryString2 = `SELECT DISTINCT ?url WHERE { `
      } else {
        queryString2 = `SELECT DISTINCT ?url WHERE { { `
      }

      negativeQueryTerms.forEach( (term, index) => {

        if (index!== 0 && index < numOfNegTerms) {
          queryString2 += ` } ${this.QUERY_TYPE.OR} { `
        }
        queryString2 += `?depic ${DOC_SPECIFIER} '${term}' 
        . ?depic ${DEPICTED_OBJ_INV} ?url`

        if (index !== 0) { 
      
          queryString2 += ' }' 
        }
      }) // forEach
      queryString2 += ' }'

      const config2 = {
        query: queryString2,
        useUri: true
      }

      const negTermImagesPromise = this.query(config2).then(resultsSet => {

        return Array.from(resultsSet)
      })

      const unFilteredImagesPromise = this.query(config1).then(resultsSet => {

        return Array.from(resultsSet)
      })

      return Promise.all([unFilteredImagesPromise, negTermImagesPromise]).then(resultsarray => {

        let unFilteredImages = resultsarray[0]
        const negTermImages = resultsarray[1]

        const filteredImages = unFilteredImages.filter(url => negTermImages.every(url2 => { return url2 !== url } ))
        /* filteredImages.forEach(url => {
          console.log("filtered image url: " + url)
        }) */
        return filteredImages
      })
    } // else
  }, // onChoosingPropsGetUrls

  _getUnfilteredImages: function(config) {


  },

  _getNegativeTermImages: function() {


  },

  smallImageDisplayUrl: function(imageUrl) {
  
    return `${DISPLAY_URL_START}${imageUrl}${IMG_TYPE_LARGE_THUMB}`
  },

  fullImageDisplayUrl: function(imageUrl) {

    return `${DISPLAY_URL_START}${imageUrl}${IMG_TYPE_NORMAL}`
  }

} // API