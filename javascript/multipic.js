
(function(_util) {
    var elem = document.querySelector('#img-wrapper'),
        pageEl = document.querySelector('#swiper-pagination'),
        eOccur = document.querySelector('#occurence'),
        ePos   = document.querySelector('#location');

    window.mySwipe = Swipe(elem, {
        continuous: false,
        // disableScroll: true,
        stopPropagation: true,
        callback: function(index, element) {
            // swipe.js懒加载

            if ( element.tagName.toUpperCase()  === 'FIGURE' ) {
                var eLink = element.children[0].children[0],
                    url   = eLink && eLink.getAttribute('data-src');
                if ( url ) {
                    _util.loadBgImage(url, eLink);
                }                
            }

        },
        transitionEnd: function(index, element) {
            pageEl.innerHTML = index + 1 + '/' + mySwipe.getNumSlides();

            var eLink, time, pos;

            if ( element.tagName.toUpperCase()  === 'FIGURE' ) {
                eLink = element.children[0];
            } else {
                eLink = element.children[0];
            }

            time  = eLink.getAttribute('data-time'),
            pos   = eLink && eLink.getAttribute('data-location');

            eOccur.innerHTML = _util.getLag(time/1);
            ePos.innerHTML = pos;
        }
    });

    // 加载第一张主图；
    var mainImg = document.querySelector('#mainImg'),
        url = mainImg.getAttribute('data-src');

    _util.loadBgImage(url, mainImg);

})(_util);