var WebAudioPlayer = (function() {
    // var raf = window.requestAnimationFrame

    function WebAudioPlayer(ctx, url, progressBarId, playButtonId) {

        this.url      = url;
        this.buffer   = null;
        this.ctx      = ctx;
        this.source   = null;

        this.loaded   = false;
        this.fetched  = false;
        this.isEnded  = false;

        this._playbackTime = 0;
        this._startTime    = 0;
        this.controller = new AudioCtrl(progressBarId, playButtonId);
    }

    WebAudioPlayer.prototype = {
        setup: function() {
            this.controller.init();
            this.fixSafari();
        },
        fetch: function() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', this.url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function() {
                // canplay event
                this.controller.updateButtonUI('paused');
                this.decode(xhr.response);
            }.bind(this);
            xhr.send();
            xhr.onprogress = function(e) {
                // start loading
                this.controller.updateButtonUI('loading');
            }.bind(this);
        },
        decode:function( arrayBuffer ) {
            this.ctx.decodeAudioData(arrayBuffer, function( audioBuffer ) {
                this.fetched = true;
                this.buffer = audioBuffer;
                this.play();
            }.bind(this));
        },
        connect: function() {
            this.source        = this.ctx.createBufferSource();
            this.source.buffer = this.buffer;
            this.source.connect(this.ctx.destination);

            var ended = this.ended.bind(this);
            this.source.onended = ended;
        },
        play: function(position) {
            if ( this.playing ) {
                return;
            }

            if ( !this.fetched ) { 
                return this.fetch(); 
            }

            this.connect();
            this.playing = true;
            this.isEnded = false;
            this.controller.updateButtonUI('playing');

            this.source.start(0, this._playbackTime);
            this._startTime = Date.now();

            this.progress();
        },
        progress: function() {
            var cur = this.playing ? ( Date.now() - this._startTime ) / 1000 + this._playbackTime : this._playbackTime,
                dur = this.buffer.duration;  
            if ( !this.isEnded ) {
                console.log(cur, dur);
                ( cur !== 0 ) && this.controller.progress(cur, dur);
                requestAnimationFrame(this.progress.bind(this));
            }
        },
        stop: function(pause) {
            if ( !this.playing ) return;
            this.playing = false;
            this.source.stop(0);
            this._playbackTime = pause ? ( Date.now() - this._startTime ) / 1000 + this._playbackTime : 0; 

        },
        pause: function() {
            this.controller.updateButtonUI('paused');
            this.stop(true);
        },
        ended: function(e) {
            if ( this.playing ) 
                this._playbackTime = 0;
            this.playing = false;
            this.isEnded = true;
            this.controller.updateButtonUI('paused');
            this.controller.ended();
        },
        fixSafari: function() {
            if (isIPhone) {
                var ctx = this.ctx;
                var unlock = function() {
                    // create an empty buffer
                    var buffer = ctx.createBuffer(1, 1, 22050);
                    var source = ctx.createBufferSource();
                    source.buffer = buffer;
                    source.connect(ctx.destination);

                    // play the empty buffer
                    if (typeof source.start === 'undefined') {
                      source.noteOn(0);
                    } else {
                      source.start(0);
                    }

                    // setup a timeout to check that we are unlocked on the next event loop
                    setTimeout(function() {
                        if ((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
                           // remove the touch start listener
                           window.removeEventListener('touchstart', unlock, false);
                        }
                    }, 0);
                };

                // setup a touch start listener to attempt an unlock in
                window.addEventListener('touchstart', unlock, false);
            }
        }
    }

    return WebAudioPlayer;
})();