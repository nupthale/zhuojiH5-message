var imgTmpl = (function() {
    var render = {
        init: function() {
            this.container = document.querySelector('#img-wrapper .swipe-wrap');
        },
        imgTmpl: function(data, status) {
            this.init();

            var img = {},
                url = data.url,
                username = data.username,
                duration = data.duration,
                time = data.time,
                location = data.location;


            var parsedTmpl = _util.tmpl('imgTmpl', img);
            this.container.appendChild(parsedTmpl);
        }
    };
    return render;
})();