/**
 * Takoyaki Upload Module
 * =======================
 *
 * Module handling file upload and parsing.
 */
import CSV from 'papaparse';
import {createReducer} from './helpers';

/**
 * Constants.
 */
const UPLOAD_PARSING = '§Upload/Parsing';
const UPLOAD_PARSED = '§Upload/PreviewParsed';

/**
 * Default state.
 */
const DEFAULT_STATE = {
  parsing: false,
  previewData: null,
  previewHeaders: null
};

/**
 * Main reducer.
 */
export default createReducer(DEFAULT_STATE, {
  [UPLOAD_PARSING](state, action) {
    return {
      ...state,
      parsing: true
    };
  },

  [UPLOAD_PARSED](state, action) {
    return {
      ...state,
      parsing: false,
      previewData: action.data,
      previewHeaders: action.headers
    };
  }
});

/**
 * Actions.
 */
export const actions = {

  // Parsing preview data
  previewData(file) {
    return dispatch => {

      return CSV.parse(file, {
        preview: 50,
        header: true,
        complete(results) {
          return dispatch({
            type: UPLOAD_PARSED,
            data: results.data,
            headers: results.meta.fields
          });
        }
      })
    };
  }
};
