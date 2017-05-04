import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
import './lightbox.less';
import 'Icons/ui-37-plus.svg';

class LightboxWidget {

  constructor() {
    this.selector = {
      lightbox:   '.js-lbx',
      gallery:    '.js-lbx-gallery',
      item:       '.js-lbx-gallery__item'
    },
    this.string = {
      close:        'Закрыть (Esc)',
      share:        'Поделиться',
      fullscreen:   'На весь экран',
      zoom:         'Увеличить / Уменьшить',
      leftArrow:    'Предыдущая фотография',
      rightArrow:   'Следующая фотография'
    }
    this.galleries = [];
    this.thumbnails = [];
    //this._init();
  }

  init() {
    this.galleries = [...document.querySelectorAll(this.selector.gallery)];
    if (this.galleries.length === 0) return;


    window.addEventListener("load", () => {
      document.body.insertAdjacentHTML('beforeend', this._getLightBoxHTMLString());
      this.pswpElement = document.querySelector(this.selector.lightbox);
      this._loadPhotoswipePlugin();
    });

  }

  _parseGalleries() {
    this.galleries.forEach((item, index) => {
      item.setAttribute('data-gallery-uid', index + 1);
      const nestedGalleries = [...item.querySelectorAll(this.selector.gallery)];
      if (nestedGalleries.length > 0) {
        console.warn(`Nested galleries not supported. Please fix markup`);
      }
      const thumbnails = [...item.querySelectorAll(this.selector.item)];
      item.data = this._parseThumbnailsFromGallery(thumbnails);
    });
  }

  _parseThumbnailsFromGallery(thumbnails) {
    let data = [];
    thumbnails.forEach((item, index) => {
      const itemLink  = item.querySelector('a'),
            itemImage = item.querySelector('img'),
            dataSize  = itemLink.getAttribute('data-size');
      if (dataSize === null) {
        console.warn(`Need "data-size" attribute for ${itemLink}`);
        return;
      }
      const size = dataSize.split('x');
      const obj = {
        src: itemLink.getAttribute('href'),
        msrc: itemImage.getAttribute('src'),
        title: itemLink.title,
        //pid: index + 1,
        w: parseInt(size[0], 10),
        h: parseInt(size[1], 10)
      };
      data.push(obj);
      itemLink.addEventListener('click', this._onLinkClick.bind(this));
      itemLink.img = itemImage;
      itemLink.pos = index;
    })
    return data;
  }

  _openLightbox(initTarget, gallery) {
    const options = {
      index: initTarget.pos,
      shareEl: false,
      galleryUID: gallery.getAttribute('data-gallery-uid'),
      getThumbBoundsFn: (currentIndex) => {
        const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
        const currentTarget = [...gallery.querySelectorAll(this.selector.item)][currentIndex];
        const rect = currentTarget.getBoundingClientRect();
        return {
          x: rect.left,
          y: rect.top + pageYScroll,
          w: rect.width
        };
      }
    };

    const lightbox = new this.PhotoSwipe(this.pswpElement, this.PhotoSwipeUI_Default, gallery.data, options);
    lightbox.init();
  }

  _onLinkClick(e) {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : e.returnValue = false;

    const eTarget = e.target || e.srcElement;
    function closest(el, fn) {
      return el && (fn(el) ? el : closest(el.parentNode, fn));
    }

    const clickedItem = closest(eTarget, (el) => {
      return (el.tagName && el.tagName.toUpperCase() === 'A');
    });

    const clickedGallery = closest(eTarget, (el) => {
      return (el.tagName && el.classList.contains(this.selector.gallery.split('.')[1]));
    });

    if (!clickedItem) return;

    this._openLightbox(clickedItem, clickedGallery);
  }

  _loadPhotoswipePlugin() {
    const photoswipeUIContext = require('bundle-loader?name=photoswipe!photoswipe/dist/photoswipe-ui-default');
    const photoswipeContext = require('bundle-loader?name=photoswipe!photoswipe');

    // css: TODO: problem with output.publicPath 
    /*require.ensure([], function(require){
      require('photoswipe/dist/photoswipe.css');
      require('photoswipe/dist/default-skin/default-skin.css');
    }, 'photoswipe-css');*/

    // js
    photoswipeContext((PhotoSwipe) => {
      this.PhotoSwipe = PhotoSwipe;

      photoswipeUIContext((PhotoSwipeUI_Default) => {
        this.PhotoSwipeUI_Default = PhotoSwipeUI_Default;
        this._parseGalleries();
      });
    });
  }

  _getLightBoxHTMLString() {
    return `
      <div class="${this.selector.lightbox.split('.')[1]} pswp" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="pswp__bg"></div>
        <div class="pswp__scroll-wrap">
          <div class="pswp__container">
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
          </div>
          <div class="pswp__ui pswp__ui--hidden">
            <div class="pswp__top-bar">
              <div class="pswp__counter"></div>
              <button class="pswp__button pswp__button--close" title="${this.string.close}"></button>
              <button class="pswp__button pswp__button--share" title="${this.string.share}"></button>
              <button class="pswp__button pswp__button--fs" title="${this.string.fullscreen}"></button>
              <button class="pswp__button pswp__button--zoom" title="${this.string.zoom}"></button>
              <div class="pswp__preloader">
                <div class="pswp__preloader__icn">
                  <div class="pswp__preloader__cut">
                    <div class="pswp__preloader__donut"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
              <div class="pswp__share-tooltip"></div>
            </div>
            <button class="pswp__button pswp__button--arrow--left" title="${this.string.leftArrow}"></button>
            <button class="pswp__button pswp__button--arrow--right" title="${this.string.rightArrow}"></button>
            <div class="pswp__caption">
              <div class="pswp__caption__center"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

}

export {
  LightboxWidget
};