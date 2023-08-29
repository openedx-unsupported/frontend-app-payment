import { messages as paragonMessages } from '@edx/paragon';
import { messages as headerMessages } from '@edx/frontend-component-header';
import { messages as footerMessages } from '@edx/frontend-component-footer';

import arMessages from './messages/ar.json';
import frMessages from './messages/fr.json';
import es419Messages from './messages/es_419.json';
import es419MessagesProtected from '../subscription/i18n-protected-messages/es_419.json';
import zhcnMessages from './messages/zh_CN.json';
import ptMessages from './messages/pt.json';
import itMessages from './messages/it.json';
import ukMessages from './messages/uk.json';
import deMessages from './messages/de.json';
import ruMessages from './messages/ru.json';
import hiMessages from './messages/hi.json';
import frCAMessages from './messages/fr_CA.json';
import deDEMessages from './messages/de_DE.json';
import itITMessages from './messages/it_IT.json';
import ptPTMessages from './messages/pt_PT.json';
// no need to import en messages-- they are in the defaultMessage field

const appMessages = {
  ar: arMessages,
  // override the protected translations
  'es-419': { ...es419Messages, ...es419MessagesProtected },
  fr: frMessages,
  'zh-cn': zhcnMessages,
  pt: ptMessages,
  it: itMessages,
  de: deMessages,
  hi: hiMessages,
  'fr-ca': frCAMessages,
  ru: ruMessages,
  uk: ukMessages,
  'de-de': deDEMessages,
  'it-it': itITMessages,
  'pt-pt': ptPTMessages,
};

export default [
  headerMessages,
  footerMessages,
  paragonMessages,
  appMessages,
];
