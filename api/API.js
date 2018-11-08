import xml2js from 'react-native-xml2js'
const parseXml = xml2js.parseString

/**
 * Contains all the functionalities for posting requests to the SPAQRL endpoint.
 * @author Ville Lohkovuori
*/

const QUERY_START = 'query='
const REQUEST = 'https://m1.profium.com/servlet/QueryServlet?'
const DISPLAY_URL_START = 'https://m1.profium.com/displayContent.do?uri='
const IMAGE = '<http://www.profium.com/archive/Image>'
const DEPICTED_OBJ = '<http://www.profium.com/archive/depictedObject>'
const THUMBNAIL_URL = '<http://www.profium.com/imagearchive/2007/thumbnail>'
const LARGE_THUMBNAIL_URL = '<http://www.profium.com/imagearchive/2007/largeThumbnail>'
const NORMAL_IMAGE_URL = '<http://www.profium.com/imagearchive/2007/normal>'

// gives the useful, tag-like properties, e.g. 'marketing' or 'management'
const DOC_SPECIFIER = '<http://www.profium.com/tuomi/asiakirjatyypinTarkenne>'

// a sort of top-level document type name
const VIEW = '<http://www.profium.com/archive/view>'

export default class API {

  static GET_ALL_IMAGE_VIEWS = `SELECT ?view WHERE { ?img a ${IMAGE} . ?img ${DEPICTED_OBJ} ?depic . ?depic ${VIEW} ?view }`
  static GET_ALL_TOP_LVL_PROPS = `SELECT ?prop WHERE { ?img a ${IMAGE} . ?img ${DEPICTED_OBJ} ?depic . ?depic ${DOC_SPECIFIER} ?prop }`

  static GET_ALL_VIEWS = `SELECT ?view WHERE { ?img a ${IMAGE} . ?img ${DEPICTED_OBJ} ?depic . ?depic ${VIEW} ?view }`
  static GET_ALL_LARGE_THUMBNAIL_URLS = `SELECT ?url WHERE { ?img a ${IMAGE} . ?img ${LARGE_THUMBNAIL_URL} ?url }`

  static query(config) {

    // console.log("called query");

    const request = REQUEST
    const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `${QUERY_START}${config.query}`
    }

    // using await + async would be better, but it's easier to do this since it's familiar
    return fetch(request, options)
    .then(response => response.text())
    .then(responseText => { 

      const xml = responseText
      let resultsSet = new Set()
      parseXml(xml, function (err, result) {

        const results = result.sparql.results[0].result
        // console.log(results)
        results.map(item => 
          resultsSet.add(item.binding[0].literal[0]._)
        )
      })
      // console.log(resultsArray);
      return resultsSet
    })
    .catch(error => console.error(error))
  } // query
  
  static displayImage(imageUrl) {
  
    const displayUrl = `${DISPLAY_URL_START}${imageUrl}`
    // todo: get the image and display it
  }

} // class