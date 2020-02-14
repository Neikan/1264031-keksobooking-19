'use strict';

(function () {

  var map = document.querySelector('.map');
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  var mapFiltersFieldsets = map.querySelectorAll('input, select, fieldset');

  // Хендлеры
  var mainPinMouseDownHandler = function (evt) {
    if (evt.buttons === 1) {
      enablePage();
    }
  };

  var mainPinKeyDownHandler = function (evt) {
    if (evt.keyCode === window.utils.KEYCODE_ENTER) {
      enablePage();
    }
  };

  var adFormChangeHandler = function (evt) {
    window.form.validationForm(evt);
  };

  var mapKeyDownHandler = function (evt) {
    if (evt.keyCode === window.utils.KEYCODE_ESC) {
      window.card.closeCard();
    }
  };

  var showLoadedOffersHandler = function (responseItems) {
    map.classList.remove('map--faded');
    window.form.adForm.classList.remove('ad-form--disabled');
    window.form.adFormAddress.classList.add('ad-form--disabled');
    window.utils.enableElements(mapFiltersFieldsets);
    window.utils.enableElements(window.form.adFormFieldsets);

    window.pins.offers = window.utils.getShuffleArray(responseItems);
    map.insertBefore(window.pins.placePins(window.pins.offers), mapFiltersContainer);
    map.insertBefore(document.createDocumentFragment().appendChild(window.card.renderCard(window.pins.offers[0])), mapFiltersContainer);
  };

  var errorLoadOffersHandler = function (response) {
    window.messages.errorLoadHandler(response);
    window.messages.displayOffMessageHandler();
    disablePage();
  };

  // Кусок для задания 6.3
  // var uploadOfferHandler = function (response) {
  //   window.messages.successUploadDataHandler(response);
  //   window.messages.displayOffMessageHandler();
  //   disablePage();
  // };

  // Прослушка событий на главной метке
  window.locality.mainPin.addEventListener('mousedown', mainPinMouseDownHandler);
  window.locality.mainPin.addEventListener('keydown', mainPinKeyDownHandler);

  // Неактивное состояние страницы
  var disablePage = function () {
    window.locality.mainPin.addEventListener('mousedown', mainPinMouseDownHandler);
    window.locality.mainPin.addEventListener('keydown', mainPinKeyDownHandler);
    map.classList.add('map--faded');
    window.form.adForm.classList.add('ad-form--disabled');
    window.utils.disableElements(mapFiltersFieldsets);
    window.utils.disableElements(window.form.adFormFieldsets);

    window.form.setRequirementsPrice();
    window.locality.getAddress(false);

    map.removeEventListener('keydown', mapKeyDownHandler);
    window.form.adForm.removeEventListener('change', adFormChangeHandler);
  };

  disablePage();

  // Активное состояние страницы
  var enablePage = function () {
    window.locality.mainPin.removeEventListener('mousedown', mainPinMouseDownHandler);
    window.locality.mainPin.removeEventListener('keydown', mainPinKeyDownHandler);

    window.backend.loadData(showLoadedOffersHandler, errorLoadOffersHandler);

    window.form.setRequirementsTitle();
    window.form.setRequirementsPrice();
    window.form.setRequirementsImages();
    window.form.setRequirementsAddress();
    window.locality.getAddress(true);

    document.addEventListener('keydown', mapKeyDownHandler);
    window.form.adForm.addEventListener('change', adFormChangeHandler);
  };

  window.map = {
    map: map,
    mapFiltersContainer: mapFiltersContainer
  };

})();
