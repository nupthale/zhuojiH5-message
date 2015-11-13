var ZoomImageView = (function() {
    function ZoomImageView(img) {
        this.STATUS_INIT = 1;
        this.STATUS_ZOOM_OUT = 2;
        this.STATUS_ZOOM_IN = 3;
        this.STATUS_MOVE = 4;
        this.currentStatus = 1;
        
        // zoom image view 
        this.img = img;
        this.el = this.img.parentNode;

        this.centerPointX;
        this.centerPointY;


        this.width;
        this.height;
        this.currentImageWidth;
        this.currentImageHeight;

        this.lastXMove = -1;
        this.lastYMove = -1;

        this.movedDistanceX;
        this.movedDistanceY;

        this.totalTranslateX = 0;
        this.totalTranslateY = 0;

        this.totalRatio  = 1;

        this.scaledRatio;

        this.initRatio = 1;

        this.lastFingerDis;
    }
    ZoomImageView.prototype = {
        init: function() {
            if (this.img.width >= this.img.height) {
                this.width  = document.body.clientWidth;
                this.height = this.width;

                this.currentImageHeight = this.width;
                this.currentImageWidth = (this.img.width/ this.img.height) * this.currentImageHeight;
                
            } else {
                this.width = document.body.clientWidth;
                this.height = ( this.img.height / this.img.width ) * this.width;

                this.currentImageWidth = this.width;
                this.currentImageHeight = this.height;
            }

            this.initEvt();
        },
        initEvt: function() {
            var _this = this;
            this.el.addEventListener('touchstart', _this.ontouchstart, true);
            this.el.addEventListener('touchmove', _this.ontouchmove, true);
            this.el.addEventListener('touchend', _this.ontouchend, true);
        },
        ontouchstart: function(e) {
            e.preventDefault();

            var touches = e.touches;
            if ( touches.length === 2 ) {
                this.lastFingerDis = this.distance(e);
            }
            return this;
        },
        ontouchmove: function(e) {
            var touches = e.touches;
            if (touches.length === 1) {
                var xMove = touches[0].pageX,
                    xMove = touches[0].pageY;

                if( this.lastXMove == -1 && this.lastYMove == -1) {
                    this.lastXMove = xMove;
                    this.lastYMove = yMove;
                }

                this.currentStatus = this.STATUS_MOVE;
                this.movedDistanceX = xMove - this.lastXMove;
                this.movedDistanceY = yMove - this.lastYMove;

                if (this.totalTranslateX + this.movedDistanceX > 0) {
                    this.movedDistanceX = 0;
                } else if( this.width - (this.totalTranslateX + this.movedDistanceX) > this.currentImageWidth ) {
                    this.movedDistanceX = 0;
                }
                if(this.totalTranslateY + movedDistanceY > 0) {
                    this.movedDistanceY = 0；
                } else if(this.height - (this.totalTranslateY + this.movedDistanceY) > this.currentImageHeight ) {
                    this.movedDistanceY = 0;
                }

                // draw invalidate
                this.invalidate();

                this.lastXMove = xMove;
                this.lastYMove = yMove;
            } else if( touches.length === 2) {
                // centerpointbetween two finger
                this.centerPointBetweenFingers(e);
                var fingerDis = this.distance(e);
                if (fingerDis > this.lastFingerDis) {
                    this.currentStatus = this.STATUS_ZOOM_OUT;
                } else {
                    this.currentStatus = this.STATUS_ZOOM_IN;
                }

                if((this.currentImageHeight == this.STATUS_ZOOM_OUT && this.totalRatio < 4 * this.initRatio) 
                    || (this.currentStatus == this.STATUS_ZOOM_IN && this.totalRatio > this.initRatio)) {
                    this.scaledRatio = fingerDis / this.lastFingerDis;
                    this.totalRatio = this.totalRatio * this.scaledRatio;
                    if( this.totalRatio > 4 * this.initRatio ) {
                        this.totalRatio = 4 * this.initRatio;
                    } else if ( this.totalRatio < initRatio ) {
                        this.totalRatio = this.initRatio;
                    }

                    // invalidate draw
                    this.invalidate();
                    this.lastFingerDis = fingerDis;
                }
            }
        },
        ontouchend: function() {
            this.lastXMove = -1;
            this.lastYMove = -1;
        },
        invalidate: function() {
            switch( this.currentStatus) {
                case this.STATUS_ZOOM_OUT:
                case this.STATUS_ZOOM_IN:
                    this.zoom();
                    break;
                case this.STATUS_MOVE:
                    this.move();
                    break;
            }
        },
        zoom: function() {

        },
        move: function() {
            var translateX = this.totalTranslateX + this.movedDistanceX,
                translateY = this.totalTranslateY + this.movedDistanceY;

            var transform =
                "translate("+translateX+"px,"+translateY+"px) " +
                "scale("+this.totalRatio+","+this.totalRatio+")";
            
            this.wrapper.style.transform = transform;
            this.wrapper.style.webkitTransform = transform;
        
            this.totalTranslateX = this.translateX;
            this.totalTranslateY = this.translateY;
        },
        distance: function(e) {
            var touches = e.touches;
            var disX = Math.abs( touches[0].pageX - touches[1].pageX ),
                disY = Math.abs( touches[0].pageY - touches[1].pageY );
            return Math.sqrt(disX * disX + disY * disY);
        },
        centerPointBetweenFingers: function(e) {
            var touches = e.touches,
                xPoint0 = touches[0].pageX,
                yPoint0 = touches[0].pageY,
                xPoint1 = touches[1].pageX,
                yPoint1 = touches[1].pageY;

            this.centerPointX = ( xPoint0 + xPoint1 ) / 2;
            this.centerPointY = ( yPoint0 + yPoint1 ) / 2;
        }


    }

    return ZoomImageView;

})();

(function() {
    
    new ZoomImageView().init();
})(ZoomImageView);


