'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

function renderCountry(data, neighbour = '') {
  const html = `
     <article class="country ${neighbour}">
          <img class="country__img" src="${data.flags.png}" />
           <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
             <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${
              data.population
            } people<p class="country__row"><span>🗣️</span>${
    Object.values(data.languages)[0]
  }</p>
            <p class="country__row"><span>💰</span>${
              Object.values(data.currencies)[0].name
            }</p>
          </div>
        </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
}

const jsonFInder = function (url, mesg = 'Something worng with GEO coding') {
  return fetch(url).then(res => {
    if (!res.ok) throw new Error(mesg);
    return res.json();
  });
};

const whereAmI1 = function (lat, lng) {
  // Geocoding country name finder
  jsonFInder(`https://geocode.xyz/${lat},${lng}?json=1`)
    .then(data => {
      console.log(`You are in ${data.city} ${data.country}`);

      // country 1
      return jsonFInder(
        `https://restcountries.com/v3.1/name/${data.country}`,
        'error in fetching country location'
      );
    })
    .then(data => {
      //rendering country 1
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];
      if (!neighbour) throw new Error('Neighbour not found');

      //country 2 neighbour
      return jsonFInder(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        'error in fetching country location'
      );
    })
    .then(data => {
      // redering nabouring country
      renderCountry(data[0], 'neighbour');
    })
    .catch(err => console.log(`failed to fetch ${err.message}`))
    .finally(() => 'it will run no matter what');
};
whereAmI1(52.508, 13.381);
