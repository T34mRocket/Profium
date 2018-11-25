
/**
 * This needs to be a class because we need two fields -- one 
 * for the value of the search term and one to indicate search type (negative or positive).
 * @author Ville Lohkovuori
 */

export default class QueryData {

  constructor(term, isNegative) {
    
    this.term = term
    this.isNegative = isNegative || false
  }

  toString = () => {
    return `term: ${this.term}, negative: ${this.isNegative}`
  }

} // class