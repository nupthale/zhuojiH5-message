/////////////////////////////////////////////////////////
/// 原始图片浏览； 包括缩放功能， 关闭浮层图片浏览功能；
/////////////////////////////////////////////////////////

var Pinch = (function() {
    function Pinch(el, fn) {
        if (!(this instanceof Pinch))
            return new Pinch(el, fn);
        this.el         = el;
        this.parent     = el.parentNode;
        this.fn         = fn || function() {};
        this.midpoint   = null;
        this.scale      = 1;
        this.lastScale  = 1;
        this.pinching   = false;
        this.distance   = 0;

        this.initEvt();

        this.fingers = {};

        this.lastDeltaX  = 0;
        this.lastDeltaY  = 0;
        this.deltaX      = 0;
        this.deltaY      = 0;

        this.originX     = 0;
        this.originY     = 0;
    }

    Pinch.prototype.initEvt = function() {
        var _this = this;
        function touchstart(e) {
            _this.ontouchstart(e);
        };
        function touchmove(e) {
            _this.ontouchmove(e);
        }
        function touchend(e) {
            _this.ontouchend(e);
        }

        this.parent.addEventListener('touchstart', touchstart);
        this.parent.addEventListener('touchmove', touchmove);
        this.parent.addEventListener('touchend', touchend);
    }

    Pinch.prototype.ontouchstart = function(e) {
        var touches = e.touches;

        if (!touches || 2 != touches.length) {
            return this;
        }
        e.preventDefault();
            
        var coords = [];
        for ( var i = 0, finger; finger = touches[i]; i++ ) {
            coords.push(finger.pageX, finger.pageY);
        }

        this.pinching = true;
        this.sliding = false;
        this.distance = distance(coords);
        this.midpoint = midpoint(coords);
        return this;
    } 

    Pinch.prototype.ontouchmove = function(e) {
        var touches = e.touches;
        if (!touches || touches.length != 2 || !this.pinching) {
            return this;
        }        
        e.preventDefault();

        if ( this.pinching && 2=== touches.length ) {
            var coords = [];
            for ( var i = 0, finger; finger = touches[i]; i++ ) {
                coords.push(finger.pageX, finger.pageY);
            }

            var dist = distance(coords);
            var mid  = midpoint(coords);

            var o = {};
            o.scale = ( dist / this.distance ) * this.scale;
            o.x = mid.x;
            o.y = mid.y;

            o.deltaX = this.lastDeltaX;
            o.deltaY = this.lastDeltaY;

            if(o.scale >= 1) {
                this.originX = o.x;
                this.originY = o.y;
                this.fn( this.scaleAtOrigin(o) );
                this.lastScale = o.scale;
            }
        }

        return this;
        
    }

    Pinch.prototype.ontouchend = function(e) {
        var touches = e.touches;
        if (!touches || touches.length == 2 || !this.pinching) {
            return this;
        }

        this.scale = this.lastScale;
        this.pinching = false;
        return this;
    }

    Pinch.prototype.scaleAtOrigin = function(e) {
        var rect = this.el.getBoundingClientRect();

        var x = e.x, y = e.y, s = e.scale;
        // find cursor offset within the element
        x -= rect.left;
        y -= rect.top;

        // find the final position of the coordinate after scaling
        var xf = x * s / this.scale,
            yf = y * s / this.scale;
        // find the difference between the initial and final position
        // and add the difference to the current position.
        var dx = e.x + x - xf,
            dy = e.y + y - yf;

        var o = { x: dx, y: dy, s:s };

        o.s = ( e.scale < 1 ? 1 : e.scale );
        return o;

    }

    function distance(arr) {
        var x = Math.pow( arr[0] - arr[2], 2);
        var y = Math.pow( arr[1] - arr[3], 2);
        return Math.sqrt( x + y );
    }

    function midpoint(arr) {
        var coords = {};
        coords.x = ( arr[0] + arr[2] ) / 2;
        coords.y = ( arr[1] + arr[3] ) / 2; 
        return coords;
    }

    return Pinch;
})();


var imgViewer = (function(Pinch) {
   function Viewer() {
        this.url     = '';
        this.img     = new Image();
        this.wrapper = null;
        this.mask    = null;
        this.circle  = null;
   }

   Viewer.prototype = {
        init: function(url) {
            this.url     = url;
            this.wrapper = document.getElementById('image-viewer');

            this.initEvt();
            this.img.src = url;
            this.img.className = 'photo';
            this.img.id        = 'photo-full';

            this.mask   = document.getElementById('mask-circle');
            this.circle = document.getElementById('circle');
        },
        initEvt: function() {
            var _this = this;
            this.img.onload = function() {
                if ( this.width >= this.height ) {
                    this.style.height = document.body.clientWidth + 'px';
                    this.style.top    = 0;
                    this.style.bottom = 0;
                } else {
                    this.style.width = '100%';
                    // this.style.height = this.height + 'px';
                    this.style.left  = 0; 
                    this.style.right = 0;
                }
                _this.wrapper.appendChild(_this.img);

                Pinch(_this.img, function(o) {
                    // if ( o.s === 1 ) {
                    //     _this.img.style['-webkit-transition'] = '-webkit-transform .6s';
                    // } else {
                    //     _this.img.style['-webkit-transition'] = '-webkit-transform 0s';
                    // }

                    _this.img.style['-webkit-transform-origin'] = o.x + ' ' + o.y;
                    _this.img.style['-webkit-transform'] = 'scale('+ o.s +')';
                });
            }

            this.wrapper.addEventListener('click', function() {
                _this.wrapper.style.display = 'none';
                _this.wrapper.style.opacity = 0;

                _util.removeClass(_this.mask, 'show');      
                _util.removeClass(_this.circle, 'show');
            }, true);
        }
   }

   return  new Viewer();
})(Pinch);