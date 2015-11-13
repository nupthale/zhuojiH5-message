var AudioCtrl = (function(_util, _anim) {

    function AudioCtrl( progressBarId, playButtonId ) {
        this.progressBarId = progressBarId;
        this.playButtonId  = playButtonId;

        this.elapsed       = 0;
    }

    AudioCtrl.prototype = {
        init: function() {

            this.progressBar = document.getElementById( this.progressBarId );
            this.playButton  = document.getElementById( this.playButtonId );

        },
        updateButtonUI: function( state ) {
            var doc     = document,
                showCls = 'show',
                hideCls = 'hide',
                button  = this.playButton,
                showEls = button.getElementsByClassName( showCls ),
                array   = _util.makeArray(showEls);

            array.some(function(item) {
                _util.removeClass(item, showCls);
                _util.addClass(item, hideCls);
            });

            var eles;
            switch( state ) {
                case 'paused':
                    eles = button.getElementsByClassName('paused')[0];
                    _util.addClass(eles, showCls);
                    _util.removeClass(eles, hideCls);
                    break;

                case 'playing':
                    eles = button.getElementsByClassName('playing')[0];
                    _util.addClass(eles, showCls);
                    _util.removeClass(eles, hideCls);
                    break;

                case 'loading':
                    eles  = button.getElementsByClassName('loading'),
                    array = _util.makeArray( eles );

                    array.some(function(item) {
                        _util.addClass(item, showCls);
                        _util.removeClass(item, hideCls);
                    });

                    break;
            }
        },
        progress: function(cur, duration) {
            var total   = duration,
                percent = ( cur * 100 ) / total,
                progBar = this.progressBar,
                style   = progBar.style;

            if ( percent !== this.elapsed ) {
                style.opacity = 1;
                percent = percent > 100 ? 100 : percent;
                style.width = percent + '%';
            }   
            this.elapsed = percent;
        },
        ended: function() {
            var progressBar = this.progressBar,
                style       = progressBar.style;
            _anim.fadeOut(progressBar, 1, -1, 0, 50, function() { style.width   = '0'; });
        }
    };

    return AudioCtrl;
})(_util, _anim);