/////////////////////////////////////////////////////////
/// 原始图片浏览； 包括缩放功能， 关闭浮层图片浏览功能；
/////////////////////////////////////////////////////////
var imgViewer = (function(Pinch) {
   function Viewer() {
        this.url     = '';
        this.img     = new Image();
        this.wrapper = null;
        this.viewer  = null;
        this.mask    = null;
        this.main    = null;

        this.zIndexBackup = 10;

        this.posX = 0, 
        this.posY = 0,
        this.lastPosX = 0, 
        this.lastPosY = 0,
        this.bufferX = 0, 
        this.bufferY = 0,
        this.scale = 1, 
        this.last_scale;
   }

   Viewer.prototype = {
        init: function(url) {
            this.url     = url;
            this.viewer  = document.getElementById('image-viewer');
            this.wrapper = document.getElementById('image-wrapper');
            this.mask    = document.getElementById('mask');
            this.main    = document.getElementById('main');

            this.initEvt();

            this.img.src = url;
            this.img.className = 'photo';
            this.img.id        = 'photo-full';
        },
        ratioAdjust: function(img) {
            var clientW = document.body.clientWidth;
            if ( img.width >= img.height ) {
                this.wrapper.style.height = clientW + 'px';
                img.style.height = clientW + 'px';
            } else {
                img.style.width = '100%';
                this.wrapper.style.height = ( clientW / img.width ) * img.height + 'px';
            } 
        },
        initHammer: function() {
            var _this  = this,
                config = {
                    transform_always_block: true,
                    transform_min_scale: 1,
                    drag_block_horizontal: true,
                    drag_block_vertical: true,
                    drag_min_distance: 5
                };

            var hammer = Hammer(this.viewer, config);

            hammer.on('touch drag dragend transform', function(e) {
                _this.manageMultitouch(e);
            });
        },
        manageMultitouch: function(e) {
            var el = e.target.parentNode;
                      
            el.style.zIndex = this.zIndexBackup + 1;
            this.zIndexBackup = this.zIndexBackup +1;
            
            switch(e.type) {
                case 'touch':
                    this.last_scale = this.scale;
                    break;

                case 'drag':
                    this.posX = e.gesture.deltaX + this.lastPosX;
                    this.posY = e.gesture.deltaY + this.lastPosY;
                    break;

                case 'transform':
                    this.scale = Math.max(1, Math.min(this.last_scale * e.gesture.scale, 10));
                    break;
                    
                case 'dragend':
                    this.lastPosX = this.posX;
                    this.lastPosY = this.posY;
                    break;
            }
            this.update(this.posX, this.posY, this.scale);
            
        },
        update: function(posX, posY, scale) {
            var transform =
                "translate("+posX+"px,"+posY+"px) " +
                "scale("+scale+","+scale+")";
                
            this.wrapper.style.transform = transform;
            this.wrapper.style.webkitTransform = transform;
        },
        initEvt: function() {
            var _this = this;
            this.img.onload = function() {
                _this.ratioAdjust(this);
                _this.wrapper.appendChild(_this.img);
                _this.initHammer();
            }

            this.viewer.addEventListener('click', function(e) {
                _this.hideViewer();
            }, false);
        },
        hideViewer: function() {
            this.viewer.style.opacity = 0;
            this.viewer.style.display = 'none';

            _util.removeClass(this.main, 'blur');
            setTimeout(function() {
                this.mask.style.opacity = 0;
                this.mask.style.display = 'none';
            }, 200);
        }
   }

   return  new Viewer();
})(_util);