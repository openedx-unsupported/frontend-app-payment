import { PERCENTAGE_BENEFIT } from '../data/constants';

module.exports = {
  authentication: {
    userId: 9,
    username: 'staff'
  },
  configuration: {
    VIEW_MY_RECORDS_URL: 'http://localhost:18150/records',
    ACCOUNT_SETTINGS_URL: 'http://localhost:18000/account/settings',
    LANGUAGE_PREFERENCE_COOKIE_NAME: 'yum',
  },
  userAccount: {
    loading: false,
    error: null,
    username: null,
    email: null,
    bio: null,
    name: null,
    country: null,
    socialLinks: null,
    profileImage: {
      imageUrlMedium: null,
      imageUrlLarge: null
    },
    levelOfEducation: null
  },
  payment: {
    basket: {
      loading: false,
      loadingError: null,
    },
    coupon: {
      benefit: {
        type: 'unexpected type',
        value: null,
      },
      code: 'DEMO25',
      voucherId: 12345,
      error: null,
      loaded: true,
      loading: false,
    }
  },
  router: {
    location: {
      pathname: '/',
      search: '',
      hash: ''
    },
    action: 'POP'
  }
};
