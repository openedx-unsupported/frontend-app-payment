/* eslint-disable */
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    [
      'transform-imports',
      {
        '@fortawesome/free-brands-svg-icons': {
          transform: '@fortawesome/free-brands-svg-icons/${member}',
          skipDefaultConversion: true,
        },
        '@fortawesome/free-regular-svg-icons': {
          transform: '@fortawesome/free-regular-svg-icons/${member}',
          skipDefaultConversion: true,
        },
        '@fortawesome/free-solid-svg-icons': {
          transform: '@fortawesome/free-solid-svg-icons/${member}',
          skipDefaultConversion: true,
        },
      },
    ],
  ],
  env: {
    i18n: {
      plugins: [
        [
          'react-intl',
          {
            messagesDir: './temp/babel-plugin-react-intl',
            moduleSourceName: '@edx/frontend-i18n',
          },
        ],
      ],
    },
  },
};
