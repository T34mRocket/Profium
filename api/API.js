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

    const orTypeQueries = queryArray
    const numOfOrTypeQueries = orTypeQueries.length

    let containsNegativeQueries = false

    orTypeQueries.forEach( andTypeInnerArray => {

      andTypeInnerArray.forEach( queryData => {
        if (queryData.isNegative) {
          containsNegativeQueries = true
          return
        }
      })
    })
  
    // due to the wonky way in which the negative queries work,
    // we need different blocks for query arrays that contain negative queries
    if (containsNegativeQueries) {

      let resultImages = []

      const promises = orTypeQueries.map( andTypeInnerArray => {
        
        let negQueries = []
        let posQueries = []

        andTypeInnerArray.forEach( queryData => {

          if (queryData.isNegative) { 

            negQueries.push(queryData.term)
          } else {
            posQueries.push(queryData.term)
          }
        })

        let negQueryString = 'SELECT DISTINCT ?url WHERE { '
        let posQueryString = 'SELECT DISTINCT ?url WHERE { '

        negQueries.forEach( (term, index) => {

          if (negQueries.length > 1) {
            negQueryString += '{ '
          }

          negQueryString += `?depic ${MOD_DATE} ?date . ?depic ${DOC_SPECIFIER} '${term}' 
          . ?depic ${DEPICTED_OBJ_INV} ?url`

          if (negQueries.length > 1) {
            negQueryString += ' }'

            if (index < negQueries.length-1) {
              negQueryString += ` ${this.QUERY_TYPE.OR} { ` // don't even ask why they're OR-type queries here...
            }
          }

          if (index === negQueries.length-1) {
            negQueryString += ` } FILTER ( ?date >= '${startDate}'^^${DATE_FORMAT} %26%26 ?date <= '${endDate}'^^${DATE_FORMAT} ) } ${ORDER_BY_DATE_DESC}`
          }
        })

        if (posQueries.length === 0) { // special case... we still need something to compare against, even with no positive queries

          posQueryString += `?depic ${MOD_DATE} ?date . ?depic ${DOC_SPECIFIER} ?any 
          . ?depic ${DEPICTED_OBJ_INV} ?url } FILTER ( ?date >= '${startDate}'^^${DATE_FORMAT} %26%26 ?date <= '${endDate}'^^${DATE_FORMAT} ) } ${ORDER_BY_DATE_DESC}`
        } else {

          posQueries.forEach( (term, index) => {

            if (posQueries.length > 1) {
              posQueryString += '{ '
            }
  
            posQueryString += `?depic ${MOD_DATE} ?date . ?depic ${DOC_SPECIFIER} '${term}' 
            . ?depic ${DEPICTED_OBJ_INV} ?url`
  
            if (posQueries.length > 1) {
              posQueryString += ' }'
  
              if (index < posQueries.length-1) {
                posQueryString += ` ${this.QUERY_TYPE.AND} { `
              }
            }
  
            if (index === posQueries.length-1) {
              posQueryString += ` } FILTER ( ?date >= '${startDate}'^^${DATE_FORMAT} %26%26 ?date <= '${endDate}'^^${DATE_FORMAT} ) } ${ORDER_BY_DATE_DESC}`
            }
          }) // posQueries forEach
        } // else if there's more than one positive query

        const negConfig = {
          query: negQueryString,
          useUri: true
        }

        const negPromise = this.query(negConfig).then(resultsSet => {

          return Array.from(resultsSet)
        })

        const posConfig = {
          query: posQueryString,
          useUri: true
        }

        const posPromise = this.query(posConfig).then(resultsSet => {

          return Array.from(resultsSet)
        })

        return Promise.all([negPromise, posPromise]).then(resultsArray => {

          const negImages = resultsArray[0]
          const posImages = resultsArray[1]

          // filter out the negative image urls from the positive results
          for (let i = posImages.length-1; i >= 0; i--) {
            for (let j = negImages.length-1; j >= 0; j--) {
              if (posImages[i] === negImages[j]) {
                posImages.pop()
                // negImages.splice(j, 1) // they can be removed since all images in both arrays are unique
              }
            }
          }
          // console.log("filtered andImages: ")
          // posImages.forEach(url => console.log("pos url: " + url))
          return posImages
        }) // Promise.all
      }) // const promises

      // the final, actual function return from the negative query logic... jesus christ on a pogo stick :D
      return Promise.all(promises).then(images => {

        // the returned object is some kind of huge concatenated string monster... wtf is up here is anyone's guess.
        // this is more inefficient than splitting atoms with a camp fire
        const splitImages = images[0].toString().trim().split(',')
        // console.log("num of unfiltered images: " + splitImages.length)
        const filteredImages = this.removeDuplicates(splitImages)
        // console.log("num of filtered images: " + filteredImages.length)
        // console.log("zeroeth img url: " + typeof filteredImages[0])

        // something is putting zero-length strings into the array at some point somehow...
        const newArray = filteredImages.filter(url => url.length > 0 ) 

        // console.log("length of filtered array: " + newArray.length)
        return newArray
      })
    } else { // the andArrays contain only positive type of queries

      let queryString = `SELECT DISTINCT ?url WHERE { `
    
      orTypeQueries.forEach( (andTypeInnerArray, arrIndex) => {
  
        if (numOfOrTypeQueries > 1) {
          queryString += '{ '
        }
  
        andTypeInnerArray.forEach( (queryData, index) => {
  
          queryString += `?depic ${MOD_DATE} ?date . ?depic ${DOC_SPECIFIER} '${queryData.term}' 
          . ?depic ${DEPICTED_OBJ_INV} ?url`
          
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
  
      // console.log("pos. query: " + queryString)
      const config2 = {
        query: queryString,
        useUri: true
      }
      
      return this.query(config2).then(resultsSet => { return Array.from(resultsSet)} )
    } // positive queries only else
  }, // onChoosingPropsGetUrls

  smallImageDisplayUrl: function(imageUrl) {
  
    return `${DISPLAY_URL_START}${imageUrl}${IMG_TYPE_LARGE_THUMB}`
  },

  fullImageDisplayUrl: function(imageUrl) {

    return `${DISPLAY_URL_START}${imageUrl}${IMG_TYPE_NORMAL}`
  },

  removeDuplicates: function(array) {

    let seen = {}

    return array.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true)
    })
  } 

} // API