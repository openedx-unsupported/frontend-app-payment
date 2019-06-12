import { ADD_COUPON, REMOVE_COUPON, UPDATE_COUPON_DRAFT } from './actions';

const defaultState = {
  benefit: null,
  code: null,
  voucherId: null,
  error: null,
  loaded: false,
  loading: false,
};

const reducer = (state = defaultState, action = null) => {
  if (action !== null) {
    switch (action.type) {
      case ADD_COUPON.BEGIN:
        return {
          ...state,
          loading: true,
          loaded: false,
          error: null,
        };
      case ADD_COUPON.SUCCESS:
        return {
          ...state,
          loading: false,
          loaded: true,
          error: null,
          benefit: action.payload.benefit,
          code: action.payload.code,
          voucherId: action.payload.voucherId,
        };
      case ADD_COUPON.FAILURE:
        return {
          ...state,
          loading: false,
          loaded: false,
          error: action.payload.error,
          voucherId: null,
        };
      case ADD_COUPON.RESET:
        return defaultState;
      case REMOVE_COUPON.BEGIN:
        return {
          ...state,
          loading: true,
          loaded: false,
          error: null,
        };
      case REMOVE_COUPON.SUCCESS:
        return {
          ...state,
          benefit: null,
          code: null,
          voucherId: null,
          loading: false,
          loaded: false,
          error: null,
        };
      case REMOVE_COUPON.FAILURE:
        return {
          ...state,
          loading: false,
          loaded: false,
          error: action.payload.error,
        };
      case REMOVE_COUPON.RESET:
        return defaultState;
      case UPDATE_COUPON_DRAFT:
        return {
          ...state,
          code: action.payload.code,
        };
      default:
    }
  }

  return state;
};

export default reducer;
