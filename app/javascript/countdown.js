//////////////////////////////////////////////////////
/// Desc:0h:0m:0s的时间动画
/// 1. 产生随机数 [00-24]H:[00-60]M:[00-60]S, 对于个位数需要格式化为0x；
/// 2. 由于每一位都是两位数， 对于分别对十位与各位生成过度序列；
//////////////////////////////////////////////////////
(function() {
    var _util = {
        random: function(hour) {
            // 生成[0,24)的随机数作为小时, 产生[0,60)的随机数作为分钟与秒
            var f = Math.floor,
                r = Math.random;           
            return hour ? f( r() * 24 ) : f( r() * 60 );
        },
        pad: function(value) {
            var max    = 1, 
                i      = 0,
                zeros  = '', 
                output = value;
            for(; i < 2; i++) {
                max *= 10;
                zeros += 0;
            }

            output = zeros + value;
            return output.substring(output.length - 2);
        },
        decade: function(number) {
            return parseInt ( number / 10 );
        },
        digit: function(number) {
            return number % 10; 
        },
        deltaToHMS: function(delta) {
            var floor = Math.floor,
                hour  = floor(delta / ( 60 * 60 * 1000)),
                min   = floor((delta - hour * (60 * 60 * 1000)) / ( 60 * 1000)),
                sec   = floor((delta - hour * (60 * 60 * 1000) - min * (60 * 1000))  / ( 1000 ));

            return [ hour, min, sec ];
        },
        digitSeqFilter: function(array) {
            for ( var i = 0, len = array.length; i < len; i++ ) {
                ( array[i] > 9 ) && ( array[i] %= 10 ); 
            }
            return array;
        },
        hasClass: function(ele,cls) {
            return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
        },
        addClass: function(ele,cls) {
            if (!this.hasClass(ele,cls)) ele.className += " "+cls;
        },
        removeClass: function(ele,cls) {
            if (this.hasClass(ele,cls)) {
                var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
                ele.className=ele.className.replace(reg,' ');
            }
        },
        getElementsByClassName: function(classname, node)  {
            if(!node) node = document.getElementsByTagName("body")[0];
            var a   = [],
                re  = new RegExp('\\b' + classname + '\\b'),
                els = node.getElementsByTagName("*");
            for(var i = 0,j = els.length; i < j; i++)
                if ( re.test( els[i].className ))
                    a.push( els[i] );
            return a;
        }
    };

    var view = {
        hourEls:[],
        minEls:[],
        secEls:[],
        lastHEls:[],
        lastMEls:[],
        lastSEls:[],
        countDown:0,
        init: function( h, m, s ) {
            var doc = document;

            this.hourEls[0]  = doc.getElementById('hour-1');
            this.hourEls[1]  = doc.getElementById('hour-2');

            this.minEls[0]   = doc.getElementById('minute-1');
            this.minEls[1]   = doc.getElementById('minute-2');

            this.secEls[0]   = doc.getElementById('second-1');
            this.secEls[1]   = doc.getElementById('second-2');

            this.lastHEls[0] = doc.getElementById('hlast-1');
            this.lastHEls[1] = doc.getElementById('hlast-2');

            this.lastMEls[0] = doc.getElementById('mlast-1');
            this.lastMEls[1] = doc.getElementById('mlast-2');

            this.lastSEls[0] = doc.getElementById('slast-1');
            this.lastSEls[1] = doc.getElementById('slast-2');

            this.renderView(h, m, s);
            this.initLastNumber();
        },
        renderView: function( h, m, s ) {
            var decade = _util.decade,
                digit  = _util.digit;

            this.hourEls[0].innerHTML = decade(h);
            this.hourEls[1].innerHTML = digit(h);

            this.minEls[0].innerHTML  = decade(m);
            this.minEls[1].innerHTML  = digit(m);

            this.secEls[0].innerHTML  = decade(s);
            this.secEls[1].innerHTML  = digit(s);
        },
        initLastNumber: function() {
            
            var hms = _util.deltaToHMS( this.countDown );

            this.lastHEls[0].innerHTML = _util.decade( hms[0] );
            this.lastHEls[1].innerHTML = _util.digit( hms[0] );

            this.lastMEls[0].innerHTML = _util.decade( hms[1] );
            this.lastMEls[1].innerHTML = _util.digit( hms[1] );

            this.lastSEls[0].innerHTML = _util.decade( hms[2] );
            this.lastSEls[1].innerHTML = _util.digit( hms[2] );
        },
        assemble: function(type, index, seq) {
            if ( type == 'hour') {
                this.hourEls[index].innerHTML = '';
                for ( var i = 0; i < seq.length; i++ ) {
                    this.hourEls[ index ].innerHTML += seq[i];
                }
            } else if ( type == 'min') { 
                this.minEls[ index ].innerHTML = '';
                for ( var i = 0; i < seq.length; i++ ) {
                    this.minEls[ index ].innerHTML += seq[i];
                }

            } else if ( type == 'sec') {
                this.secEls[ index ].innerHTML = '';
                for ( var i = 0; i < seq.length; i++ ) {
                    this.secEls[ index ].innerHTML += seq[i];
                }
            }
        },
        animate: function() {
            this._addAnimate( this.hourEls );
            this._addAnimate( this.minEls );
            this._addAnimate( this.secEls );

            var _this = this;
            setTimeout(function() {
                _this.tick();
            }, 1000);
        },
        _addAnimate: function(nodes) {
            for ( var i = 0; i < 2; i++ ) {
                var parent = nodes[i].parentNode;

                // if (_util.hasClass(parent, 'scroll') ) {
                //     _util.removeClass(parent, 'scroll');
                // } else {
                //     _util.addClass(parent, 'scroll');
                // }
                _util.addClass(nodes[i].parentNode, 'scroll');
            }
            
        },
        _removeAnimate: function(nodes) {
            for ( var i = 0; i < 2; i++ ) {
                _util.removeClass(nodes[i].parentNode, 'scroll');
            }
        },
        tick: function() {
            // this.resetSequence();
            
            var _this = this;
            setInterval(function() {
                var hms   = _util.deltaToHMS( _this.countDown ),
                    hour  = hms[0],
                    min   = hms[1],
                    sec   = hms[2];

                _this.countDown -= 1000;
                
                hms    = _util.deltaToHMS( _this.countDown );

                var nhour = hms[0],
                    nmin  = hms[1],
                    nsec  = hms[2];

                core.update( hour, nhour, min, nmin, sec, nsec );
            }, 1000);
                
        },
        resetSequence: function() {
            this.hourEls[0].innerHTML = ' ';
            this.hourEls[1].innerHTML = ' ';
            this.minEls[0].innerHTML  = ' ';
            this.minEls[1].innerHTML  = ' ';
            this.secEls[0].innerHTML  = ' ';
            this.secEls[1].innerHTML  = ' '; 

            this._removeAnimate(this.hourEls);
            this._removeAnimate(this.minEls);
            this._removeAnimate(this.secEls);
        },
        setCountDown: function() {
            // 减2000， 是因为动画的播放时间为2s；
            this.countDown = window.countDownTime - 2000;
        },
        getCountDown: function() {
            return this.countDown;
        }
    };

    var core = {
        hour: null,
        min: null,
        sec: null,
        nhour: null,
        nmin: null,
        nsec: null,
        init: function() {
            var pad    = _util.pad,
                random = _util.random;

            this.hour = random(true);
            this.min  = random();
            this.sec  = random();

            view.setCountDown();
            var hms    = _util.deltaToHMS( view.getCountDown() );

            this.nhour = hms[0];
            this.nmin  = hms[1];
            this.nsec  = hms[2];

            view.init( this.hour, this.min, this.sec );
            
            this.serialize();
            setTimeout(function() {
                view.animate();
            }, 2000);
        },
        update: function( hour, nhour, min, nmin, sec, nsec ) {
            this.hour = hour;
            this.min  = min;
            this.sec  = sec;

            this.nhour = nhour;
            this.nmin  = nmin;
            this.nsec  = nsec;

            // this.serialize();
            view.initLastNumber();
            // view.animate();
        },  
        serialize: function() {
            var seqH = this.makeSequence( this.hour, this.nhour ),
                seqM = this.makeSequence( this.min,  this.nmin ),
                seqS = this.makeSequence( this.sec,  this.nsec );

            this.viewAssemble('hour', seqH);
            this.viewAssemble('min',  seqM);
            this.viewAssemble('sec',  seqS);
        },
        viewAssemble: function(type, obj) {
            var seq = null;

            for ( var i = 0; i < obj.length; i++ ) {
                seq = obj[i];
                view.assemble(type, i, seq);
            } 
        },
        makeSequence: function(start, end) {
            var decade = _util.decade(start),
               ndecade = _util.decade(end);

            var ascending = ndecade > decade;

            var decSeq = [], digSeq = [];
            for ( var i = decade; ascending ? i < ndecade : i > ndecade ;  ascending ? i++ : i-- ) {
                decSeq.push(i);
            }

            ascending = end > start;
            for ( var i = start; ascending ? i < end : i > end ; ascending ? i++ : i-- ) {
                digSeq.push(i);
            }

            digSeq = _util.digitSeqFilter( digSeq );

            return [ decSeq, digSeq ];
        }
    };

    core.init();
})();