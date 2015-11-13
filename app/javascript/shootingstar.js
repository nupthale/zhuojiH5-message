(function() {
    var el = document.getElementById('shootingstar'), 
        k  = 68 / 100,
        x  = 200;
    var t  = setInterval(function() {
        x -= 3;
        if ( x < -150 ) {
            clearInterval(t);
            return;
        }

        var y = -k * x;

        el.style.backgroundPosition = x + 'px ' + y + 'px'; 
    }, 20);

})();