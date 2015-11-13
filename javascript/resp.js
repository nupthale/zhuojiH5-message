(function() {
    var wrapper = document.getElementById('resparea'),
        textarea= wrapper.getElementsByTagName('textarea')[0],
        pholder = wrapper.getElementsByTagName('p')[0],
        maxwords= wrapper.getElementsByTagName('p')[1],
        max     = wrapper.getElementsByTagName('span')[0],
        send    = document.getElementById('send'),
        back    = document.getElementById('back'),
        button  = document.getElementById('resp'),
        mask    = document.getElementById('mask');
    wrapper.style.height = window.innerWidth + 'px';

    var setSendActive = function(len) {
        if ( len ) {
            _util.addClass(send, 'active');
        } else {
            _util.removeClass(send, 'active');
        }
    }

    textarea.addEventListener('focus', function() {
        setTimeout(function() {
            // window.scrollTo(0, 0);

            _util.scrollToTop(200);
        }, 900);
    }, false);

    textarea.addEventListener('keyup', function() {
        textarea.style.height = textarea.scrollHeight + 'px';

        var len = textarea.textLength;
        setSendActive(len);


        if ( len >= 15 ) {
            _util.addClass(textarea, 'small');
        } else {
            _util.removeClass(textarea, 'small');
        }

        if ( len >= 45 ) {
            pholder.style.display = 'none';
            max.innerHTML = len >= 50 ? 50 : len;
            maxwords.style.display = 'block';
        } else {
            maxwords.style.display = 'none';
             pholder.style.display = 'block';
        }
    }, false);

    //记录弹出回复框之前的window.scrollY;
    var position = 0;
    button.addEventListener('click', function() {
        var len = textarea.textLength;
        setSendActive(len);
        position = window.scrollY;

        mask.style.display = 'block';
        mask.style.opacity = '0.85';
        wrapper.style.display = 'table';
        textarea.focus();
    }, false);

    wrapper.addEventListener('click', function() {
        textarea.focus();
    }, false);

    function goBack(pos) {
        mask.style.display = 'none';
        mask.style.opacity = '0';
        wrapper.style.display = 'none';
        window.scroll(0, pos);
    }

    back.addEventListener('click', function(e) {
        e.stopPropagation();
        goBack(position);
    }, false);


    var main = document.getElementById('main'),
        cprightEl = document.getElementById('copyright'),
        respEl = document.getElementById('m-resp');

    var views = {
        renderOneReply: function() {
            main.style.paddingBottom = "70px";
            this.adjustCopyRight();
        },
        renderEmptyReply: function() {
            main.style.paddingBottom = '70px';
            this.adjustCopyRight();

            document.body.style.height = 'auto';
            respEl.style.background = '#fff';
            var arrow = respEl.getElementsByTagName('div')[0];
            arrow.style.background = '#fff';
            main.style.background = 'rgb(255, 255, 255)';
        },
        renderTwoReply: function() {

        },
        adjustCopyRight: function() {
            _util.removeClass(cprightEl, 'copyright1');
            _util.addClass(cprightEl, 'copyright');
        }
    };

    var liNode = '', time = 0,
        respNo = document.getElementById('replyerNo');
    function beforeHandle() {
        time = new Date().getTime() - 60 * 1000; 
        var reply = {"sortId":1, "replyType":2, "id": window.replys.length + respTimes,"time":time,"username":"我"};

        isSending = true;
        //@Undone: 安卓要方角
        liNode = Tmpl.respTmpl(reply, 'loading');

        if ( replys.length == 0 ) {
            views.renderEmptyReply();
        } else if ( replys.length == 1 ) {
            views.renderOneReply();
        }

        var noresp = document.getElementsByClassName('noresp')[0];
        noresp.style.display = 'none';

    }
    function afterHandle(data) {
        
        isSending = false;

        liNode.parentNode.removeChild(liNode);
        if ( data.success == 'true' ) {
            // 清空textarea
            textarea.value = '';
            respTimes++;

            var audioUrl = data.audioUrl,
                duration = data.duration,
                sortId   = data.sortId,
                id       = window.replys.length + respTimes;

            var reply = {"audioUrl":audioUrl,"duration":duration, "sortId":data.sortId, "replyType":2, "id": id,"time":time,"username":"我"};
            Tmpl.respTmpl(reply);

            var player = new AudioPlayer(data.audioUrl, 'audio-wrapper', 'progressbar' + id, 'play' +id, data.duration/1);
            player.setup();
            audioManager.push(id, player);
            respNo.innerHTML = id;

        } else {
            alert('发送失败， 请重试...');
        }
    }

    var respTimes = 0,
        url = '/reply.htm',
        isSending = false,
        cid = document.getElementById('cid').value;
    send.addEventListener('click', function(e) {
        e.stopPropagation();
        if ( !textarea.textLength || isSending ) {
            return;
        }

        beforeHandle();

        goBack(200);
        
        // 发布逻辑
        // afterHandle({"audioUrl":"http://i01.lw.aliimg.com/tfs/TB1RVMsHXXXXXXMXFXXBJUo.FXXLAIWANGa_1.mp3", "duration":"1583", "sortId":"1", "success":"true"});
        _util.microAjax(url, function(data) {
            var json = JSON.parse(data);
            // 当发布成功后；返回用户昵称， audioUrl， duration, sortId
            afterHandle(json);
        }, 'cid=' + cid + '&text=' + textarea.value);
    }, false);

})();


(function() {
    // var doc = document;

    // var stopDefault = function(e) {
    //     e.preventDefault();
    // } 
    // // 只绑定touchmove， 如果阻止touchstart, touchend， 否则其他地方的click， touch事件就没用了;
    // doc.ontouchmove = stopDefault;

})();

(function() {
    // var replys = !!window.replys ? JSON.parse(window.replys) : [];

    // var startY, deltaY,
    //     respEle = document.getElementById('m-resp'),
    //     mainMask= document.getElementById('mainMask'),
    //     mainEle = document.getElementById('mainBody');
    // // state:0 查看主贴模式 state:1 查看回复模式
    // var state = 0, deltaMain = 0;

    // var isBottom = false, isTop = true, viewHeight = 500, threshold = 10;
    // var moveDown = false;
    // var list = document.getElementById('resplist');
    // var height = getComputedStyle(list, null).height.replace('px', '')/1;
    // if ( replys.length >= 8 ) {
    //     document.ontouchstart = function(e) {       
    //         // e.preventDefault();
    //         var touch = e.touches[0];
    //         startY = touch.pageY;
    //     }

    //     document.ontouchmove = function(e){
    //         e.preventDefault();
    //         var touch = e.touches[0];
    //         deltaY = touch.pageY - startY;
    //         if ( Math.abs(deltaY) < threshold ) { return; }    

    //         if ( !state ) {
    //             // 主贴模式
                
    //             mainMask.style.display = 'block';
    //             if ( deltaY < 0 && deltaY > -100 ) {
    //                 moveDown = false;
    //                 mainMask.style.opacity = ( Math.abs(deltaY) - 40 ) / 100;
    //                 _util.addClass(respEle, 'focus');
    //                 respEle.style.webkitTransform = 'translateY(' + deltaY + 'px)';
    //             } else if ( deltaY > 0 ) {
    //                 moveDown = true;
    //             }    
    //         }

    //         if ( state ) {
    //            // 回复模式
    //             if ( deltaY > 0 && deltaY > 100 ) {
    //                 mainMask.style.opacity = ( 70 - Math.abs(deltaY) ) / 100;
    //             }
    //             mainMask.style.display = 'none';

    //             if ( deltaY < 0 && ( height + deltaY + 80 <= viewHeight ) ) {
    //                 // 到尾部
    //                 isBottom = true;
    //                 isTop = false;
                    
    //             } else if ( deltaY > 50 ) {
    //                 // 到顶部
    //                 isTop = true;
    //                 isBottom = false;
    //                 respEle.style.webkitTransform = 'translateY(' + ( deltaY - 300 ) + 'px)';
                    

    //             } else {
    //                 isTop = false; isBottom = false;
    //                 list.style.webkitTransform = 'translateY(' + deltaY + 'px)';
    //             }
    //              _util.removeClass(respEle, 'focus');
    //         }
    //     }

    //     document.ontouchend = function(e) {
    //         // e.preventDefault();
    //         if ( !state ) {
    //             // 主贴模式
    //             respEle.style.webkitTransition = 'all 0.4s ease-in-out';
                    
    //             if ( !moveDown ) {
    //                 respEle.style.webkitTransform  = 'translateY(-300px)';  
    //             } else if ( moveDown ) {
    //                 respEle.style.webkitTransform = 'translateY(0px)';
    //             }
                    
    //             setTimeout(function() {
    //                 respEle.style.webkitTransition = 'none';
    //                 ( !moveDown ) && ( state = 1 );
    //             }, 400);
    //         }

    //         if ( state ) {
    //             if ( isBottom ) {
    //                 list.style.webkitTransition = 'all 0.4s ease-in-out';
    //                 var bottom = viewHeight - height;
    //                 list.style.webkitTransform = 'translateY(' + bottom + 'px)';
    //                 setTimeout(function() {
    //                     list.style.webkitTransition = 'none';
    //                 }, 400);
    //             } else if ( isTop ) {
    //                 list.style.webkitTransition = 'all .2s ease-in-out';
    //                 list.style.webkitTransform = 'translateY(0px)';


    //                 respEle.style.webkitTransition = 'all 0.4s ease-in-out';
    //                 respEle.style.webkitTransform = 'translateY(' + 0 + 'px)';
    //                 setTimeout(function() {
    //                     respEle.style.webkitTransition = 'none';
    //                     state = 0;
    //                     list.style.webkitTransition = 'none';
    //                 }, 400);
    //             }
    //         }
    //     }

    // }
})();