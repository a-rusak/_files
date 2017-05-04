import Cookies from 'js-cookie';

/**
 * Coockie a11y object
 *
 * @param {boolean}   state.isAccessible  Toggle accessible mode.
 * @param {string}    state.size (0.75-2) Font size.
 * @param {string}    state.theme (bw | wb | cb) Color theme. wb, cb not implemented yet.
 * @param {boolean}   state.images Toggle images.
 */

class A11y {

  constructor () {
    this.state = {};
    this.btnId = 'a11y_button';
    this.inputSizeId = 'a11y_input_size';
    this.chbImgId = 'a11y_checkbox_images';
    this.default = {
      isAccessible: false,
      size: '1',
      theme: 'bw',
      images: true
    }
  }

  init () {
    this.button = document.getElementById(this.btnId);
    this.input_size = document.getElementById(this.inputSizeId);
    this.checkbox_images = document.getElementById(this.chbImgId);
    const isDomOk = !!this.button &&
                    !!this.input_size &&
                    !!this.checkbox_images;

    if (!navigator.cookieEnabled || !isDomOk) { return };

    this.button.addEventListener('click', this._onButtonClick.bind(this));
    this.input_size.addEventListener('change', this._onSizeChange.bind(this));
    this.checkbox_images.addEventListener('change', this._onImagesChange.bind(this));

    const cookie = Cookies.getJSON('a11y');
	
    !PROD && console.log('read: ', cookie);
	
    const isCookieBroken = typeof cookie               === 'string' ||
                           typeof cookie               === 'undefined' ||
                           typeof cookie.isAccessible  !== 'boolean' ||
                           typeof cookie.size          !== 'string' ||
                           typeof cookie.theme         !== 'string' ||
                           typeof cookie.images        !== 'boolean';

    if (isCookieBroken) {
      this._setState(this.default);
    } else { 
      this._setState(cookie);
    }
    this._setDom ();
  }

  _setState (state) {
    if (typeof state !== 'object') { return };

    this.state = Object.assign({}, this.state, state);
    Cookies.set('a11y', this.state);
    this._updateDOM();
  }

  _setDom () { // once on page load

    !PROD && console.log('set: ', this.state);

    if (this.state.isAccessible) {
      this.button.setAttribute('aria-selected', 'true');
      this.button.setAttribute('data-btn-active', '');
      document.body.classList.add(`a11y`);
      document.body.classList.add(`a11y--${this.state.theme}`);
    } else {
      this.button.setAttribute('aria-selected', 'false');
      this.button.removeAttribute('data-btn-active');
      document.body.classList.remove(`a11y`);
      document.body.classList.remove(`a11y--${this.state.theme}`);
    }
    this.input_size.value = this.state.size;
    if (this.state.images) {
      this.checkbox_images.setAttribute('checked', 'true');
    } else {
      this.checkbox_images.removeAttribute('checked');
    }
  }

  _updateDOM () { // on runtime

    !PROD && console.log('update: ', this.state);

    if (this.state.isAccessible) {
      document.documentElement.style.fontSize = this.state.size + 'rem';

      if (this.state.images) {
        document.body.classList.remove(`a11y--no-images`);
      } else {
        document.body.classList.add(`a11y--no-images`);
      }
    } else {
      document.documentElement.style.fontSize = 'initial';
      document.body.classList.remove(`a11y--no-images`);
    }
  }

  _onButtonClick () {
    this._setState({ 'isAccessible': !this.state.isAccessible });
    window.location.reload();

  }
  _onSizeChange () {
    this._setState({ 'size': this.input_size.value });
  }
  _onImagesChange () {
    this._setState({ 'images': this.checkbox_images.checked });
  }
}

export {
  A11y
};