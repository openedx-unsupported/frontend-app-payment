import { FETCH_BASKET } from './actions';

export const initialState = {
  loading: false,
  loadingError: null,
};

const paymentsPage = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BASKET.BEGIN:
      return {
        ...state,
        loadingError: null,
        loading: true,
      };
    case FETCH_BASKET.SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    case FETCH_BASKET.ERROR:
      return {
        ...state,
        loadingError: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default paymentsPage;
