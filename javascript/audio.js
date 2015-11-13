var AudioPlayer = (function(_util, _anim) {
    
    function AudioPlayer(src, wrapperId, progressBarId, playButtonId, duration) {
        this.src           = src;
        this.wrapperId     = wrapperId;
        this.progressBarId = progressBarId;
        this.playButtonId  = playButtonId;

        this.wrapper              = null;
        this.oAudio               = null;
        this.elapsed              = 0;   // 用于与当前的currentTIme比较， 看是否需要更新进度条宽度；
        this.duration             = duration;
        this.progressBar          = null;
        this.playButton           = null;
        this.timerId              = null;

    }

    AudioPlayer.prototype = {
        setup: function() {
            this.oAudio              = new Audio();
            this.wrapper             = document.getElementById(this.wrapperId);
            this.progressBar         = document.getElementById(this.progressBarId);
            this.playButton          = document.getElementById(this.playButtonId);
            this.duration            = this.duration/1000;

            this.initEvents();
            this.initSource();
            this.oAudio.preload = 'none';

            ( !isIPhone ) && ( this.oAudio.load() );

            this.fixSafari();  
        },
        fixSafari: function() {
            // bugfix: safari屏蔽了audio的preload， 只有当用户点击屏幕音频才会被加载， 我们绑定的事件才会被执行，
            if (isIPhone) {
                this.updateButtonUI('paused');
                var oAudio = this.oAudio;
                document.addEventListener('touchstart', function() {
                    if (!window.audioLoaded) {
                        oAudio.load();
                        window.audioLoaded = true;
                    }
                }, false);
            }       
        },
        updateButtonUI: function(state) {
            var doc      = document,
                showName = 'show',
                hideName = 'hide',
                button   = this.playButton,
                showEles = button.getElementsByClassName(showName),
                array    = _util.makeArray(showEles);

            array.some(function(item) {
                _util.removeClass(item, showName);
                _util.addClass(item, hideName);
            });

            switch (state) {
                case 'paused':
                    var pausedEle = button.getElementsByClassName('paused')[0];
                    _util.addClass(pausedEle, showName);
                    _util.removeClass(pausedEle, hideName);
                    break;
                
                case 'playing':
                    var playingEle = button.getElementsByClassName('playing')[0];
                    _util.addClass(playingEle, showName);
                    _util.removeClass(playingEle, hideName);
                    break;
                
                case 'loading':
                    var loadingEles  = button.getElementsByClassName('loading'),
                        loadingArray = _util.makeArray(loadingEles);

                    loadingArray.some(function(item) {
                        _util.addClass(item, showName);
                        _util.removeClass(item, hideName);
                    });
                    break;
            }
        },
        paused: function() {
            this.updateButtonUI('paused');
        },
        playing: function() {
            this.updateButtonUI('playing');
        },
        progress: function(cur, dur) {
            var total       = dur > 20 ? Math.max(this.oAudio.duration, Math.floor(dur)) : Math.min(this.oAudio.duration, Math.floor(dur)),
                percentage  = ( cur * 100 ) / total ,
                progressBar = this.progressBar,
                style       = progressBar.style;

            if ( percentage !== this.elapsed ) {
                style.opacity = 1;
                percentage = percentage > 100 ? 100 : percentage;
                style.width   = percentage + '%' ;
            }
            this.elapsed = percentage;
        },
        canplay: function() {
            this.updateButtonUI('paused');
        },
        ended: function() {
            this.updateButtonUI('paused');
                
            var progressBar = this.progressBar,
                style       = progressBar.style;
            // 播放结束
            this.status = false;

            _anim.fadeOut(progressBar, 1, -1, 0, 50, function() { style.width   = '0'; });
        },
        timeupdate: function() {
            // var duration = oAudio.duration;
            var oAudio   = this.oAudio,
                duration = this.duration;

            if (isAndroid404 && (oAudio.currentTime >= duration - 0.1)) {
                // bugfix: android4.0.4 cannot repeat audio
                oAudio.currentTime = 0;
                oAudio.pause();
            }

            this.progress(oAudio.currentTime, duration);
        },
        initEvents: function() {
            var _this       = this,
                oAudio      = this.oAudio,
                progressBar = this.progressBar,
                playButton  = this.playButton;

            oAudio.addEventListener('canplay', function() { _this.canplay(); }, false);
            oAudio.addEventListener('playing', function() { _this.playing(); }, false);
            oAudio.addEventListener('pause', function() { _this.paused(); }, false);
            oAudio.addEventListener('timeupdate', function() { _this.timeupdate(); }, false);
            oAudio.addEventListener('ended', function() { _this.ended(); }, false);
        },
        initSource: function() {
            var wrapper      = this.wrapper,
                src          = this.src,
                audio        = this.oAudio; 

            audio.autoplay = false;

            var doc      = document,
                source   = doc.createElement('source');
            if (audio.canPlayType('audio/mpeg;')) {
                source.type = 'audio/mpeg';
                source.src  = src;
            } else {
                source.type = 'audio/ogg';
                source.src  = src;
            }
            audio.appendChild(source);
            wrapper.appendChild(audio);
        },
        play: function() {
            var oAudio      = this.oAudio,
                progressBar = this.progressBar,
                _this       = this;
            if (oAudio.paused) {
                this.updateButtonUI('loading');
                oAudio.play();
            }
        },
        pause: function() {
            var oAudio = this.oAudio;

            if (!oAudio.paused) {
                oAudio.pause();
            }
        }
    }

    return AudioPlayer;
})(_util, _anim);