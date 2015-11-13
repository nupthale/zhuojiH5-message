(function() {
    var el = document.getElementById('stars');

    var yFactor = 50;
    var yOffset = 50;
    var xFactor = 50;
    var xOffset = 50;

    var centerAlpha = null;

    function orientationListener(evt){
        var alpha = evt.alpha;
        
        // Set center alpha the first time
        if (centerAlpha === null) centerAlpha = alpha;
        
        var alphaDelta = (centerAlpha + 180 - alpha) % 360 - 180;
        
        // Lock to a 90-degree cone
        if (Math.abs(alphaDelta) > 45) {
            centerAlpha = alpha + (alphaDelta < 0 ? -45 : 45);
        }
        var beta = evt.beta;
        
        var x = Math.round((alphaDelta / 45) * xFactor + xOffset),
            y = Math.round((-1 + (beta / 90)) * yFactor + yOffset);

        var test = document.getElementById('test');
        // test.innerHTML = x + ' ' + y;

        el.style.webkitTransform = 'translateX(' +
          x + 'px) translateY('
          + y + 'px)';
    }
    window.addEventListener('deviceorientation',orientationListener);
})();