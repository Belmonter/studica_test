import {apiService} from "./api.js";

const api = new apiService();
const cityData = [];
let searchCityData = [];
let previewItems = [];
let previewCounter = 0;

let cityItems = document.getElementById('city-items');
let cityInp = document.getElementById('city-input');
let loader = document.getElementById('loader');
let cityBtn = document.querySelector('.list-city__btn');
let cityListWrapper = document.getElementById('city-list');

let cityIcon = document.querySelector('.city-head__icon');
let cityContainer = document.querySelector('.city-head');
let cityChoose = document.querySelector('.city-head__city');
let cityPreview = document.querySelector('.list-city__preview');





cityInp.addEventListener("input", inputHandler);


document.addEventListener("click", function (e) {
  let target = e.target;

  if (cityListWrapper.classList.contains('active')) {
    handleCityPopupClose(e);
  } else if (target === cityContainer || target === cityIcon || target === cityChoose) {
    handleCityPopupOpen();
  }

  if (target.classList.contains('del-show')) {
    handleInputDelBtn(target);
  }

  if (target.classList.contains('city__item') || target.classList.contains('item-city__city') || target.classList.contains('item-city__area')) {
    previewHandler(target);
  }

  if (target === cityBtn) {
    setCities();
  };
});




function previewHandler(target) {
  let previewCities = document.querySelectorAll('.preview__city');
  cityPreview.classList.add('preview-show-items')

  if (previewCities.length) {
    previewCities.forEach((city) => {
      if (city.textContent.toLowerCase() != target.dataset.city.toLowerCase()) {
        if (!previewItems.includes(target.dataset.city.toLowerCase())) {
          renderPreview(target);
        }
      } else {
        deletePreviewOnClick(target)
      }
    })
  } else {
    renderPreview(target);
  }
}

function handleCityPopupClose(e) {
  if (!e.path.includes(cityListWrapper)) {
    cityListWrapper.classList.remove('active');
  }
}

function handleInputDelBtn(target) {
  if (target.classList.contains('del-show')) {
    cityInp.nextElementSibling.classList.remove('del-show');
    cityInp.value = '';
    renderData(cityData);
  }
}

function handleCityPopupOpen() {
  cityListWrapper.classList.toggle('active')
  if (!cityData.length) {
    api.getCities()
      .then(res => fillData(res))
      .then(() => renderData(cityData));
  }
}

function fillData(data) {
  return new Promise(resolve => {
    data.forEach(({name, cities}) => {
      let areaName = name;
      if (cities) {
        cities.forEach(({name}) => {
          cityData.push({areaName, name})
        })
      }
    })
    resolve();
  });
}

function renderData(data, searchData, searchString) {
  cityItems.innerHTML = '';
  if (data) {
    data.forEach(({areaName, name}) => {
      if (searchData) {
        cityItems.insertAdjacentHTML('beforeend', renderCityHTML(name, areaName, highlightString(name, searchString)).outerHTML)
      } else {
        cityItems.insertAdjacentHTML('beforeend', renderCityHTML(name, areaName).outerHTML)
      }
    })
    loader.remove();
  }

}

function renderPreview(target) {
  cityBtn.classList.add('btn-active');
  previewItems.push(target.dataset.city.toLowerCase());
  cityPreview.insertAdjacentHTML('beforeend',
    `
        <div class="preview__item"> 
          <span class="preview__city">${target.dataset.city}</span>
          <span class="del-item _icon-close" id="${previewCounter}"></span>
        </div>
      `);
  deletePreview(previewCounter);
  previewCounter++;
}

function renderCityHTML(cityName, cityArea, formatCityName) {
  let cityWrapperElement = document.createElement('div')
  let cityNameElement = document.createElement('div');
  let cityAreaElement = document.createElement('div')

  cityWrapperElement.setAttribute('class', 'city__item');
  cityWrapperElement.setAttribute('data-city', cityName);

  cityNameElement.setAttribute('class', 'item-city__city');
  cityNameElement.setAttribute('data-city', cityName);
  cityNameElement.innerHTML = formatCityName ? formatCityName : cityName;

  cityAreaElement.setAttribute('class', 'item-city__area');
  cityAreaElement.setAttribute('data-city', cityName);
  cityAreaElement.textContent = cityArea;

  cityWrapperElement.appendChild(cityNameElement)
  cityWrapperElement.appendChild(cityAreaElement)

  return cityWrapperElement
}

function deletePreview(id) {
  document.getElementById(`${id}`).addEventListener("click", function ({target}) {
    let itemId = previewItems.indexOf(target.previousElementSibling.textContent.toLowerCase());
    let itemWrapper = target.closest('.preview__item');
    if (itemId >= 0) previewItems.splice(itemId, 1);
    itemWrapper.classList.add('hide-preview');
    setTimeout(() => {
      target.closest('.preview__item').remove();
      if (!cityPreview.children.length) {
        cityPreview.classList.remove('preview-show-items');
        cityBtn.classList.remove('btn-active')
      }
    }, 300);
  }, {once: true});
}

function deletePreviewOnClick(element) {
  let cityName = element.dataset.city;
  let items = document.querySelectorAll('.preview__item');

  let itemId = previewItems.indexOf(cityName.toLowerCase());
  if (itemId >= 0) previewItems.splice(itemId, 1);

  items.forEach(el => {
    let itemCityName = el.querySelector('.preview__city').textContent;

    if (itemCityName === cityName) {
      el.classList.add('hide-preview')
      setTimeout(() => {
        el.remove();
        if (!cityPreview.children.length) {
          cityPreview.classList.remove('preview-show-items');
          cityBtn.classList.remove('btn-active')
        }
      }, 300);
    }
  })
}

function highlightString(str, format) {
  let word = str.toLowerCase().replace(format, `<strong>${format}</strong>`);

  let firstLetterInd = word.indexOf(str.toLowerCase()[0]);
  word = word.replace(word[firstLetterInd], str[0]);

  return word;
}

function inputHandler({target}) {
  let value = target.value.toLowerCase();
  if (value) {
    target.nextElementSibling.classList.add('del-show')
    cityData.forEach(city => {
      if (city.name.toLowerCase().match(value)) {
        let name = city.name;
        let areaName = city.areaName;
        searchCityData.push({name, areaName})
      }
    })
    renderData(searchCityData, true, value)
    searchCityData = [];
  } else {
    target.nextElementSibling.classList.remove('del-show')
    renderData(cityData);
  }
}

function setCities() {
  let data = previewItems.map(el => {
    let firstLetter = el.split('')[0].toUpperCase();
    let res = [...el];
    res.splice(0, 1);
    return [firstLetter, ...res].join('')
  })
  cityChoose.textContent = data.join(', ')
}
