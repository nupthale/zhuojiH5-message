////////////////////////////////
/// Audio Player Manager
//////////////////////////////// 
(function() {
    window.replys = !!window.replys ? JSON.parse(window.replys) : [];
    var msgnoEl= document.getElementById('replyerNo'),
        respEl = document.getElementById('m-resp'),
        main   = document.getElementById('main'),
        cprightEl = document.getElementById('copyright');

    msgnoEl.innerHTML = replys.length;

    var views = {
        renderEmptyReply: function() {
            this.adjustCopyRight();

            document.body.style.height = window.innerHeight + 'px';
            respEl.style.background = '#E6E7E8';
            var arrow = respEl.getElementsByTagName('div')[0];
            arrow.style.background = '#E6E7E8';
            main.style.background = 'rgb(230, 231, 232)';
        },
        renderOneReply: function() {
            main.style.paddingBottom = '0';
            this.adjustCopyRight();
        },
        renderTwoReply: function() {
            main.style.paddingBottom = '70px';
        },
        adjustCopyRight: function() {
            _util.removeClass(cprightEl, 'copyright');
            _util.addClass(cprightEl, 'copyright1');
        },
        scrollBody: function() {
            setTimeout(function() {
                window.scrollTo(0, 200);
            }, 1000);
        },
        hideNoRespTip: function() {
            var tip = respEl.getElementsByTagName('div')[1];
            tip.style.display = 'none';
        }
    }

    var respEle = document.getElementById('m-resp'),
        rightEle = document.getElementById('copyright');

    if ( replys.length == 0 ) {
        views.renderEmptyReply();
    } else if ( replys.length == 1 ) {
        views.renderOneReply();
    } else if ( replys.length == 2 ) {
        views.renderTwoReply();
    } else if ( replys.length >= 3 ) {
        views.scrollBody();
    }

    if ( replys.length ) {
        views.hideNoRespTip();
    }
    
    window.audioManager = AudioManager.getInstance();

    var mainWrapper = document.getElementById('audio-wrapper');
    var main = new AudioPlayer(mainWrapper.getAttribute('data-src'), 'audio-wrapper', 'progressbar', 'play', 10000);
    main.setup();
    audioManager.push('main', main);

    for ( var i = replys.length - 1; i >= 0; i-- ) {
        var reply = replys[i],
            id    = reply.id,
            dur   = reply.duration;

        Tmpl.respTmpl(reply);

        var player = new AudioPlayer(reply.audioUrl, 'audio-wrapper', 'progressbar' + id, 'play' +id, dur/1);
        player.setup();
        audioManager.push(id, player);
    }

    if (isAndroid) {
        var wrappers = document.getElementsByClassName('progress-wrapper');
        for ( var i = 0 ; i < wrappers.length; i++ ) {
            var wrapper = wrappers[i],
                bar     = wrapper.children[0];
            wrapper.style.borderTopRightRadius = '10px';
            wrapper.style.borderBottomRightRadius = '10px';
            bar.style.borderRadius = '10px';
        }
    }
})();

//////////////////////////////////////////////////////////////
/// [体验优化] 加载图片速度慢时， 图片onload后加一个fadeIn效果; 
//////////////////////////////////////////////////////////////
(function(Tween, _util, _anim) {
    var img     = new Image(),
        srcEl   = document.getElementById('msg'),
        srcWrapper = document.getElementById('img-wrapper'),
        wrapper    = document.getElementById('image-wrapper'),
        viewer     = document.getElementById('image-viewer'),
        mask       = document.getElementById('mask'),
        main       = document.getElementById('main');
    
    var url = srcEl.getAttribute('data-src');

    window.photos = !!window.photos ? JSON.parse(window.photos) : [];
    // 没有主贴图也没有回复图时， 数组为空； 主贴没图片， 回复有图时， 数组为所有回复图；主贴有图， 主贴和回复图片都在数组里面；
    // 不管哪种情况，图片顺序是先发的在前面， 后发的在后面；
    if ( window.photos.length === 0 || window.imageUrl == '' ) {
        window.photos.unshift({url:'', location:''});
    }
    // window.photos.reverse();

    Tmpl.photoTmpl(window.photos);

    var eTitle = document.querySelector('#title');

    if ( isAndroid ) {
        _util.removeClass(eTitle, 'title');
        _util.addClass(eTitle, 'title1');
    }

    // function showDetail() {
    //     // 消息信息滑出
    //     var detailDOM = document.getElementById('detail'),
    //         firstLine = detailDOM.children[0],
    //         secondLine= detailDOM.children[1];

    //     _util.addClass(firstLine, 'animated');
    //     _util.addClass(firstLine, 'bounceInLeft');
    //     firstLine.style.opacity = 1;
    //     setTimeout(function() {
    //         _util.addClass(secondLine, 'animated');
    //         _util.addClass(secondLine, 'bounceInLeft');
    //         secondLine.style.opacity = 1;
    //     }, 500);
    // }

    

    // // url = '';
    // if ( !url ) {
    //     showDetail();

    //     var num = Math.floor( ( Math.random() * 5 + 1 ) % 6 ); 
    //     _util.addClass(srcWrapper, 'bg-' + num);
    //     return;
    // }

    // // false冒泡模式；
    // srcWrapper.addEventListener('click', function(e) {
    //     viewer.style.display = 'block';
    //     mask.style.display = 'block';
    //     _util.addClass(main, 'blur');
    //     mask.style.opacity = 0.86;
    //     viewer.style.opacity = 1;
    // }, false);

    // imgViewer.init(url);
    // showDetail();
     

})(_anim.Tween, _util, _anim); 


//////////////////////////////////////
/// 显示时间处理
/// 1. 发送时间：一小时内显示x分钟前， 一小时后显示xh:xm:xs， 24消失销毁
/// 所以，如果为昨天显示昨天xh:xm:xs；
/// 2. 销毁时间倒计时
//////////////////////////////////////
(function(_util) {
    var htimeEle = document.getElementById('time'),
        timeEle  = document.getElementById('occurence'),
        eLoc     = document.querySelector('#location'),
        createTime     = htimeEle.value;
    if (createTime) {
        timeEle.innerHTML = _util.getLag(createTime/1);

        var firedOnEle    = document.getElementById('firedon'),
            firedOnTime   = createTime/1 + 24 * 60 * 60 * 1000,
            countDownTime = firedOnTime - new Date();

        window.countDownTime = countDownTime;
    }

    var location = window.photos[0] && ( window.photos[0].location || '');
    eLoc.innerHTML = location;


})(_util);

////////////////////
/// debug info
////////////////////
(function() {
    var errorDom = document.getElementById('debug');
    if (errorDom.innerHTML !== '') {
        errorDom.style.display = 'block';
        mask.style.display = 'block';
        mask.style.opacity = 0.9;
    }

})();


