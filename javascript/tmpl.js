var Tmpl = (function() {
    // 回复模板
    var render = {
        respTmpl: function(data, status) {
            var reply = data,
                id    = reply.id,
                dur   = reply.duration;

            var defaultNames = ["柠檬", "煎蛋", "雪糕", "热狗", "寿司", "棒棒糖", "火鸡腿", "蛋糕", "甜甜圈", "樱桃", "草莓"],
                defaultAvatarBase = 'http://m.zhuojiapp.com/s/images/avatars/msg_avatar';

            var respEle = document.getElementById('m-resp');

            ( !reply.replyUserName ) && ( reply.replyUserName = '' );
            if ( !reply.avatarUrl ) {
                reply.avatarUrl = ''; 
                reply.avatarId = id%6;
            }

            var replyType = reply.replyType;
            reply.replyType = replyType == undefined ? '' : ( replyType == 1 ? '电话留言' : '短信回复');
            
            reply.duration = dur ? _util.zeroPad(Math.round(dur/1000)) : undefined;
            reply.time = _util.getLagHM(reply.time/1);
            reply.delay = Math.random() * 5;

            var sortId = reply.sortId ? reply.sortId : 1,
                isRandomUser = !reply.username;
            ( isRandomUser ) && ( reply.username = defaultNames[sortId - 1] );
            ( isRandomUser ) && ( reply.avatarUrl = defaultAvatarBase + ( sortId - 1 ) + '.png' ); 
            reply.firstname = reply.username && reply.username[0];

            var parsedTmpl = _util.tmpl('respTmpl', reply);
            var extraEle = respEle.getElementsByClassName('ref')[0],
                liNode   = document.createElement('li');
            _util.addClass(liNode, 'item');
            liNode.innerHTML = parsedTmpl;
            if ( !status ) {
                (function(liNode) {
                    liNode.addEventListener('click', function(e) {
                        _util.addClass(liNode, 'read');
                    }, true);
                })(liNode);
            }

            _util.insertAfter(liNode, extraEle);

            function andrOptimize() {
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
            }
            andrOptimize();

            return liNode;
        },
        photoTmpl: function(data) {

            var item = {}, url, size,
                eParent = document.querySelector('#j-gallery');

            for ( var i = 0; i < data.length; i++ ) {
                item = data[i];
                url = item.url;

                if( i == 0 ) { 
                    item.isFirst = true; item.id = 'mainImg';
                } else {
                    item.isFirst = false; item.id = 'img' + i;
                }
                if ( url ) {
                    var reg = /_(\d+)_(\d+)\.(png|jpg|gif|jpeg)$/g; 

                    var matchArray = url.match(reg);
                    var array = matchArray[0].split('.')[0].split('_');
                    item.size = array[1] + 'x' + array[2];
                }

                if ( !item.time ) {
                    item.time = document.querySelector('#time').value;
                }

                if ( !item.location ) {
                    item.location = ' ';
                }

                var parsedTmpl = _util.tmpl('imgTmpl', item);
                eParent.innerHTML += parsedTmpl;
            }  

            var ePagination = document.querySelector('#swiper-pagination');  

            if ( data.length < 2 ) {
                ePagination.style.display = 'none';
            } else {
                ePagination.innerHTML = '1/' + data.length;
            }
                    
        }
    }
    return render;
})();