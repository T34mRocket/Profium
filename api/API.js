import xml2js from 'react-native-xml2js'
const parseXml = xml2js.parseString

/**
 * Contains all the functionalities for posting requests to the SPAQRL endpoint.
 * @author Ville Lohkovuori
*/

const QUERY_START = 'query='
const DISPLAY_URL_START = 'https://m1.profium.com/displayContent.do?uri='
const IMAGE = '<http://www.profium.com/archive/Image>'
const DEPICTED_OBJ = '<http://www.profium.com/archive/depictedObject>'
const THUMBNAIL_URL = '<http://www.profium.com/imagearchive/2007/thumbnail>'
const LARGE_THUMBNAIL_URL = '<http://www.profium.com/imagearchive/2007/largeThumbnail>'
const NORMAL_IMAGE_URL = '<http://www.profium.com/imagearchive/2007/normal>'

// a sort of top-level document type name; it's not the most useful property, but atm it's the best I can fetch
const VIEW = '<http://www.profium.com/archive/view>'

export default class API {
  
  static GET_ALL_IMAGE_VIEWS = `${QUERY_START}SELECT ?view WHERE { ?img a ${IMAGE} . ?img ${DEPICTED_OBJ} ?depic . ?depic ${VIEW} ?view }`
  static GET_ALL_LARGE_THUMBNAIL_URLS = `${QUERY_START}SELECT ?url WHERE { ?img a ${IMAGE} . ?img ${LARGE_THUMBNAIL_URL} ?url }`

  static query(config) {

    const request = 'https://m1.profium.com/servlet/QueryServlet?'
    const options = {
      method: 'POST',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: config.query
    }

    // using await + async would be better, but it's easier to do this since it's familiar
    return fetch(request, options)
    .then(response => response.text())
    .then(responseText => { 

      const xml = responseText
      let resultsArray = []
      parseXml(xml, function (err, result) {
        const json = JSON.stringify(result)
        const obj = JSON.parse(json) // this step feels a little schizophrenic, but ehh, time is of the essence

        const results = obj.sparql.results[0].result
        results.map(item => 
          resultsArray.push(item.binding[0].literal[0]._)
        )
      })
      // console.log(resultsArray);
      return resultsArray
    })
    .catch(error => console.error(error))
  } // query
  
  static displayImage(imageUrl) {
  
    const displayUrl = `${DISPLAY_URL_START}${imageUrl}`
    // todo: get the image and display it
  }

} // class