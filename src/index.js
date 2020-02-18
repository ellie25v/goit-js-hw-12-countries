import './styles.css';
import PNotify from '../node_modules/pnotify/dist/es/PNotify.js';
import PNotifyButtons from '../node_modules/pnotify/dist/es/PNotifyButtons.js';
import countriesTemplate from './countryList.hbs';
import fetchCountries from './fetchCountries.js';

const debounce = require('lodash.debounce');
import '../node_modules/pnotify/dist/PNotifyBrightTheme.css'
const refs = {
    input: document.querySelector('#inputCountries'),
    div: document.querySelector('#country__div'),

};

function showCountry(country) {
    refs.div.insertAdjacentHTML('beforeend', countriesTemplate({country}));
};


const onInput = debounce(function input() {
    let inputValue = refs.input.value;

    if (inputValue === '') {
        clearOutput();
        return;
    } 
    fetchCountries(inputValue).then(data => {
        if (data.length > 10) {
            PNotify.error({
                title:'Warning!',
              text: 'Too many matches found. Please enter a more specific query!',
            });
            clearOutput();
          }
        else if (data.length > 2 && data.length <= 10) {
            clearOutput()
          data.map(country => {
            refs.div.insertAdjacentHTML(
              'beforeend',
              `<div>${country.name}</div>`
            )
          })
        } 
        else if(data.length === 1){
            clearOutput()
            showCountry(data)
        }
      }).catch(error => error)  
    }, 500)

refs.input.addEventListener('input', onInput);

function clearOutput() {
    refs.div.innerHTML = '';
}