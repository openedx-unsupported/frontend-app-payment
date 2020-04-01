/* eslint-disable no-plusplus */
/* eslint-disable vars-on-top */
/* eslint-disable prefer-template */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-var */
/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
/* eslint-disable object-shorthand */
var checkoutForm = document.getElementById('checkout-form');
var paypalButton = document.getElementById('submit-paypal');
var couponButton = document.getElementById('coupon-button');
var userButton = document.querySelector('.user-button');
var countrySelect = document.getElementById('country');
var stateSelect = document.getElementById('state');
var countryStates = {
  CA: [
    ['AB', 'Alberta'],
    ['BC', 'British Columbia'],
    ['MB', 'Manitoba'],
    ['NB', 'New Brunswick'],
    ['NL', 'Newfoundland and Labrador'],
    ['NS', 'Nova Scotia'],
    ['NT', 'Northwest Territories'],
    ['NU', 'Nunavut'],
    ['ON', 'Ontario'],
    ['PE', 'Prince Edward Island'],
    ['QC', 'Québec'],
    ['SK', 'Saskatchewan'],
    ['YT', 'Yukon'],
  ],
  US: [
    ['AL', 'Alabama'],
    ['AK', 'Alaska'],
    ['AZ', 'Arizona'],
    ['AR', 'Arkansas'],
    ['AA', 'Armed Forces Americas'],
    ['AE', 'Armed Forces Europe'],
    ['AP', 'Armed Forces Pacific'],
    ['CA', 'California'],
    ['CO', 'Colorado'],
    ['CT', 'Connecticut'],
    ['DE', 'Delaware'],
    ['DC', 'District Of Columbia'],
    ['FL', 'Florida'],
    ['GA', 'Georgia'],
    ['HI', 'Hawaii'],
    ['ID', 'Idaho'],
    ['IL', 'Illinois'],
    ['IN', 'Indiana'],
    ['IA', 'Iowa'],
    ['KS', 'Kansas'],
    ['KY', 'Kentucky'],
    ['LA', 'Louisiana'],
    ['ME', 'Maine'],
    ['MD', 'Maryland'],
    ['MA', 'Massachusetts'],
    ['MI', 'Michigan'],
    ['MN', 'Minnesota'],
    ['MS', 'Mississippi'],
    ['MO', 'Missouri'],
    ['MT', 'Montana'],
    ['NE', 'Nebraska'],
    ['NV', 'Nevada'],
    ['NH', 'New Hampshire'],
    ['NJ', 'New Jersey'],
    ['NM', 'New Mexico'],
    ['NY', 'New York'],
    ['NC', 'North Carolina'],
    ['ND', 'North Dakota'],
    ['OH', 'Ohio'],
    ['OK', 'Oklahoma'],
    ['OR', 'Oregon'],
    ['PA', 'Pennsylvania'],
    ['RI', 'Rhode Island'],
    ['SC', 'South Carolina'],
    ['SD', 'South Dakota'],
    ['TN', 'Tennessee'],
    ['TX', 'Texas'],
    ['UT', 'Utah'],
    ['VT', 'Vermont'],
    ['VA', 'Virginia'],
    ['WA', 'Washington'],
    ['WV', 'West Virginia'],
    ['WI', 'Wisconsin'],
    ['WY', 'Wyoming'],
  ],
};
var ecommerceBaseUrl;
var lmsBaseUrl;
if (window.location.hostname === 'payment.edx.org') {
  ecommerceBaseUrl = 'https://ecommerce.edx.org';
  lmsBaseUrl = 'https://courses.edx.org';
} else if (window.location.hostname === 'payment.stage.edx.org') {
  ecommerceBaseUrl = 'https://ecommerce.stage.edx.org';
  lmsBaseUrl = 'https://courses.stage.edx.org';
} else if (window.location.hostname === 'localhost') {
  ecommerceBaseUrl = 'http://localhost:18130';
  lmsBaseUrl = 'http://localhost:18000';
}

userButton.addEventListener('click', function () {
  document.querySelector('.dropdown-menu').classList.toggle('show');
}, false);

window.onclick = function closeMenu(event) {
  if (!event.target.matches('.user-button')) {
    var dropdownMenu = document.getElementsByClassName('dropdown-menu');
    for (var i = 0; i < dropdownMenu.length; i++) {
      var open = dropdownMenu[i];
      if (open.classList.contains('show')) {
        open.classList.remove('show');
      }
    }
  }
};

/* eslint-disable no-param-reassign */
/* eslint-disable dot-notation */
function sendRev1074Event(eventType, eventData) {
  eventData['_export'] = 'false'; // Don't let these events be exported to partners

  var perfTiming;
  try {
    perfTiming = window.performance.timing.toJSON();
  } catch (e) {
    perfTiming = { error: e.toString() };
  }
  eventData.timing = perfTiming;

  var encodedEvent = [
    'event_type=edx.experiment.rev1074.' + eventType,
    'page=' + window.location.href,
    'event=' + encodeURIComponent(JSON.stringify(eventData)),
  ].join('&').replace(/%20/g, '+');

  var eventUrl = lmsBaseUrl + '/event';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', eventUrl + '?' + encodedEvent);
  xhr.send();
}
/* eslint-enable no-param-reassign */
/* eslint-enable dot-notation */

function redirectToMFE(couponCode) {
  var url = window.location.pathname;
  var sku = /.*\/([^&#]*).html/.exec(url)[1];
  var newUrl = ecommerceBaseUrl + '/basket/add/?sku=' + sku;
  if (couponCode) {
    newUrl = newUrl.concat('&coupon=', couponCode);
  }
  window.location.href = newUrl;
}

function getBasketId() {
  var url = window.location.search;
  var basketParams = /[?&]basket_id=([^&#]*)/.exec(url);
  if (!basketParams) {
    redirectToMFE();
  } else {
    var basketId = basketParams[1];
    return basketId;
  }
  return null;
}

function renderStates(country) {
  var states = Object.values(countryStates[country]);
  for (var i = 0; i < states.length; i++) {
    var state = document.createElement('option');
    state.setAttribute('value', states[i][0]);
    state.innerHTML = states[i][1];
    stateSelect.appendChild(state);
  }
}

function renderCountryState() {
  countrySelect.onchange = function getCountryStates() {
    var stateSelectHtml = document.createElement('div');
    stateSelectHtml.innerHTML = '<select id="state" name="state"><option value="" selected="selected">Choose state/province</option></select>';
    stateSelect.length = 1;
    if (!(countrySelect.value === 'CA' || countrySelect.value === 'US')) {
      stateSelectHtml = document.createElement('div');
      stateSelectHtml.innerHTML = '<input id="state" type="text" name="state">';
      stateSelect.parentNode.replaceChild(stateSelectHtml, stateSelect);
      stateSelect = document.getElementById('state');
    } else {
      stateSelect.parentNode.replaceChild(stateSelectHtml, stateSelect);
      stateSelect = document.getElementById('state');
      if (countrySelect.value === 'CA') {
        renderStates('CA');
      } else if (countrySelect.value === 'US') {
        renderStates('US');
      }
    }
  };
}

document.addEventListener('DOMContentLoaded', function () {
  renderCountryState();
});

/* eslint-disable no-unused-vars */
window.onload = function sendPageLoaded(event) {
  sendRev1074Event('static.page_loaded', {});
};
/* eslint-enable no-unused-vars */

couponButton.addEventListener('click', function couponRedirectToMicrofrontend(event) {
  event.preventDefault();
  var couponCode = document.getElementById('couponcode').value;
  redirectToMFE(couponCode);
}, false);

function parseCookies() {
  var cookies = {};
  if (document.cookie && document.cookie !== '') {
    var cookiesArray = document.cookie.split('; ');
    for (var i = 0; i < cookiesArray.length; i++) {
      var m = cookiesArray[i].trim().match(/(\w+)=(.*)/);
      if (m !== undefined) {
        cookies[m[1]] = decodeURIComponent(m[2]);
      }
    }
  }
  return cookies;
}

function disableForm() {
  var elementsToDisable = document.querySelectorAll('input, select, button');
  for (var i = 0; i < elementsToDisable.length; i++) {
    elementsToDisable[i].disabled = true;
  }
}

paypalButton.addEventListener('click', function submitPaypal() {
  disableForm();
  var spinner = document.createElement('span');
  spinner.classList.add('button-spinner-icon');
  paypalButton.insertBefore(spinner, paypalButton.firstChild);
  document.querySelector('#submit-paypal img').style.filter = 'grayscale(1)';
  var cookies = parseCookies();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', ecommerceBaseUrl + '/api/v2/checkout/', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('X-CSRFToken', cookies.csrftoken);
  xhr.setRequestHeader('USE-JWT-COOKIE', true);
  xhr.withCredentials = true;
  // eslint-disable-next-line func-names
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        var form = document.createElement('form');
        form.method = 'POST';
        form.action = JSON.parse(this.response).payment_page_url;
        document.body.appendChild(form);
        form.submit();
      } else {
        redirectToMFE();
      }
    }
  };
  var basket_id = getBasketId();
  xhr.send(JSON.stringify({
    basket_id: basket_id,
    payment_processor: 'paypal',
  }));
});

checkoutForm.addEventListener('submit', function submitCybersource(event) {
  event.preventDefault();
  disableForm();
  var cookies = parseCookies();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', ecommerceBaseUrl + '/payment/cybersource/api-submit/', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('X-CSRFToken', cookies.csrftoken);
  xhr.setRequestHeader('USE-JWT-COOKIE', true);
  xhr.withCredentials = true;
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        var form = document.createElement('form');
        form.method = 'POST';
        if (window.location.hostname === 'payment.edx.org') {
          form.action = 'https://secureacceptance.cybersource.com/silent/pay';
        } else {
          form.action = 'https://testsecureacceptance.cybersource.com/silent/pay';
        }
        var ecommerceFormFields = JSON.parse(this.response).form_fields;
        var formKeys = Object.keys(ecommerceFormFields);
        for (var i = 0; i < formKeys.length; i++) {
          var element = document.createElement('input');
          element.type = 'hidden';
          element.value = ecommerceFormFields[formKeys[i]];
          element.name = formKeys[i];
          form.appendChild(element);
        }
        var cardNumber = document.getElementById('cardnumber').value;
        cardNumber.type = 'hidden';
        var cardNumberElement = document.createElement('input');
        cardNumberElement.value = (cardNumber.match(/\d+/g) || []).join('');
        cardNumberElement.name = 'card_number';
        form.appendChild(cardNumberElement);

        var cardTypeElement = document.createElement('input');
        cardTypeElement.type = 'hidden';
        if (cardNumber.charAt(0) === '4') {
          cardTypeElement.value = '001'; // Visa
        } else if (/^3[47]/.test(cardNumber)) {
          cardTypeElement.value = '003'; // American Express
        } else if (cardNumber.substring(0, 4) === '6011' || /^622[1-9]/.test(cardNumber) || /^64[4-9]/.test(cardNumber) || cardNumber.substring(0, 2) === '65') {
          cardTypeElement.value = '004'; // Discover
        } else if (cardNumber.substring(0, 4) === '2720' || /^5[1-5]/.test(cardNumber) || /^222[1-9]/.test(cardNumber) || /^22[3-9]/.test(cardNumber) || /^2[3-6]/.test(cardNumber) || /^27[0-1]/.test(cardNumber)) {
          cardTypeElement.value = '002'; // Mastercard
        } else {
          redirectToMFE();
        }
        cardTypeElement.name = 'card_type';
        form.appendChild(cardTypeElement);

        var cardCVNElement = document.createElement('input');
        cardCVNElement.type = 'hidden';
        cardCVNElement.value = document.getElementById('cardcode').value;
        cardCVNElement.name = 'card_cvn';
        form.appendChild(cardCVNElement);

        var cardExpirationElement = document.createElement('input');
        cardExpirationElement.type = 'hidden';
        cardExpirationElement.value = document.getElementById('cardmonth').value.concat('-', document.getElementById('cardyear').value);
        cardExpirationElement.name = 'card_expiry_date';
        form.appendChild(cardExpirationElement);

        document.body.appendChild(form);
        form.submit();
      } else {
        redirectToMFE();
      }
    }
  };

  function encoder(name) {
    return encodeURIComponent(document.getElementById(name).value);
  }

  var urlEncodedDataPairs = [
    'basket=' + encodeURIComponent(getBasketId()),
    'first_name=' + encoder('firstname'),
    'last_name=' + encoder('lastname'),
    'address_line1=' + encoder('address1'),
    'address_line2=' + encoder('address2'),
    'city=' + encoder('city'),
    'country=' + encoder('country'),
    'state=' + encoder('state'),
    'postal_code=' + encoder('zip'),
  ];
  var urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
  xhr.send(urlEncodedData);
});
