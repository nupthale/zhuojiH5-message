window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


///////////////////////////////////////
///  util函数_util and _anim
///////////////////////////////////////
var _util = {
    getAndroidVersion: function(ua) {
        if (isAndroid) {
            var match = ua.match(/Android\s([0-9\.]*)/);
            return match ? match[1] : false;
        }
        return false;
    },
    makeArray:function(arrayLike){
        return Array.prototype.slice.apply(arrayLike,[0]);
    },
    zeroPad: function(value) {
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
    toHMS: function(time) {
        var date = new Date(time),
            z    = this.zeroPad,
            hour = z(date.getHours()),
            min  = z(date.getMinutes()),
            sec  = z(date.getSeconds());

        return hour + ':' + min + ':' +sec;
        // return hour + ':' + min;
    },
    getLag:function(time) {
        var now   = new Date(),
            delta = now - time,
            hmsec = 60 * 60 * 1000;
        if ( delta < hmsec ) {
            return Math.ceil(delta / (60 * 1000)) + '分钟前';
        }

        var create     = new Date(time),
            nowDate    = now.getDate(),
            createDate = create.getDate();
        if (nowDate - createDate) {
            return '昨天' + this.toHMS(time);
        }
        return this.toHMS(time);
    },
    getLagHM: function(time) {
        var hmtime = this.getLag(time);
        if (/:/.test(hmtime)) {
            var array = hmtime.split(':');
            return array[0] + ':' + array[1];
        } else {
            return hmtime;
        }
    },
    hasClass: function(ele,cls) {
        return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
    },
    addClass: function(ele,cls) {
        if ( !this.hasClass( ele, cls) ) 
            ele.className += " " + cls;
    },
    removeClass: function(ele,cls) {
        if (this.hasClass(ele,cls)) {
            var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
            ele.className=ele.className.replace(reg,' ');
        }
    }, 
    tmpl: function(str, data) {
        var cache = {};
        var fn = !/\W/.test(str) ?
                cache[str] = cache[str] ||
                this.tmpl(document.getElementById(str).innerHTML) :
         
                // Generate a reusable function that will serve as a template
                // generator (and which will be cached).
                new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +
                   
                    // Introduce the data as local variables using with(){}
                    "with(obj){p.push('" +
                   
                    // Convert the template into pure JavaScript
                    str
                      .replace(/[\r\t\n]/g, " ")
                      .split("<%").join("\t")
                      .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                      .replace(/\t=(.*?)%>/g, "',$1,'")
                      .split("\t").join("');")
                      .split("%>").join("p.push('")
                      .split("\r").join("\\'")
                  + "');}return p.join('');");
       
        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
    },
    insertAfter: function(newElement, targetElement) {
        var parent = targetElement.parentNode;
        if(parent.lastChild == targetElement) {
          parent.appendChild(newElement);
        } else {
          parent.insertBefore(newElement, targetElement.nextSibling);
        }
    },
    scrollToTop: function(scrollDuration) {
        var scrollHeight = window.scrollY,
            scrollStep = Math.PI / ( scrollDuration / 15 ),
            cosParameter = scrollHeight / 2;
        var scrollCount = 0,
            scrollMargin,
            scrollInterval = setInterval( function() {
                if ( window.scrollY != 0 ) {
                    scrollCount = scrollCount + 1;  
                    scrollMargin = cosParameter - cosParameter * Math.cos( scrollCount * scrollStep );
                    window.scrollTo( 0, ( scrollHeight - scrollMargin ) );
                } 
                else {
                    clearInterval(scrollInterval); 
                } 
            }, 15 );
    },
    microAjax: function(url, callbackFunction) {
        this.bindFunction = function (caller, object) {
            return function() {
                return caller.apply(object, [object]);
            };
        };

        this.stateChange = function (object) {
            if (this.request.readyState==4)
                this.callbackFunction(this.request.responseText);
        };

        this.getRequest = function() {
            if (window.ActiveXObject)
                return new ActiveXObject('Microsoft.XMLHTTP');
            else if (window.XMLHttpRequest)
                return new XMLHttpRequest();
            return false;
        };

        this.postBody = (arguments[2] || "");

        this.callbackFunction=callbackFunction;
        this.url=url;
        this.request = this.getRequest();
        
        if(this.request) {
            var req = this.request;
            req.onreadystatechange = this.bindFunction(this.stateChange, this);

            if (this.postBody!=="") {
                req.open("POST", url, true);
                req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                req.setRequestHeader('Connection', 'close');
            } else {
                req.open("GET", url, true);
            }

            req.send(this.postBody);
        }
    },
    getTransform: function(el) {
        var transform = window.getComputedStyle(el, null).getPropertyValue('-webkit-transform');
        var results = transform.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))\))/);

        if(!results) return [0, 0, 0];
        if(results[1] == '3d') return results.slice(2,5);

        results.push(0);
        return results.slice(5, 8); // returns the [X,Y,Z,1] values
    },
    loadBgImage: function(url, ele, eTxt) {
        if ( !url ) {
            _util.addClass(ele, 'linearBg');
        }

        if ( !_util.hasClass(ele, 'lazy-load') ) {
            return;
        }

        var img = new Image();
        img.onload = function() {
            ele.style.backgroundImage = 'url('+ this.src +')';
            var t = 0,
                b = 1,
                c = 0,
                d = 20;
            function Run(){
                var opacity = _anim.Tween.Quint.easeIn(t,b,c,d);
                ele.style.opacity = opacity;
                if (c < d) { 
                    c++; setTimeout(Run, 5); 
                } else { }
            }
            Run();

            if (eTxt) {
                eTxt.style.display = 'none';
                eTxt.style.webkitAnimation = 'none';
            }
        }
        if ( webp ) {
            img.src = url + '_.webp';
        } else {
            img.src = url;
        }
        
        _util.removeClass(ele, 'lazy-load');
    }
}   

var _anim = {
    Tween: {
        Quint : { // 五次方缓动
            easeIn : function(start, alter, curTime, dur) {
                return curTime ? (start + alter
                    * Math.pow(2, 10 * (curTime / dur - 1))) : start;
            }
        }
    },
    fadeOut: function(obj, start, alter ,curTime, dur, callback) {
        var easeIn = this.Tween.Quint.easeIn;
        function Run(){
            var opacity = easeIn(start, alter, curTime, dur);
            obj.style.opacity = opacity;
            if (curTime < dur) { 
                curTime++; setTimeout(Run, 10); 
            } else {
                callback && callback();
            }
        }
        Run();
    }, 
    fadeIn: function(obj, start, alter ,curTime, dur, callback) {
        this.fadeOut(obj, start, alter ,curTime, dur, callback);
    }
};

var evt = {
    delegate: function(root, evtType, className, handle) {
        root.addEventListener(evtType, function(e) {
            var target = e.target;
            while ( target !== root ) {
                if ( !target ) { break; }
                if ( target.className.indexOf(className) !== -1 ) {
                    handle(e);
                    break;
                } else {
                    target = target.parentNode;
                    if ( target === document.body ) { break; }
                }
            }
        }, true);
    }
};


///////////////////////////////////////
/// 全局变量
///////////////////////////////////////
var ua           = navigator.userAgent,
    isIPhone     = ua.indexOf('iPhone') !== -1,
    isAndroid    = ua.indexOf('Android') !== -1 || ua.indexOf('Adr') !== -1,
    isAndroid404 = _util.getAndroidVersion(ua) === '4.0.4';


var canWebp = window.localStorage.getItem('webp'),
    webp    = false;

// getImgUrl函数
if (canWebp !== null) {
    if (canWebp == 'true') {
        webp = true;
    } else {
        webp = false
    }
} else {
    if ( isAndroid ) {
        var img    = new Image();

        img.onload = function(){
            window.localStorage.setItem('webp', 'true');
            webp = true;
            img = img.onload = img.onerror = null;
        }

        img.onerror = function(){

            window.localStorage.setItem('webp', 'false');
            webp = false;
            img  = img.onload = img.onerror = null;
        }

        img.src  = 'http://m.zhuojiapp.com/s/images/test-1-1.png_.webp';
    }
}