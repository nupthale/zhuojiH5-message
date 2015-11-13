var AudioManager = (function() {
    function AudioManager() {
        this.players   = [];
        this.currentId = 0;
    }

    AudioManager.prototype = {
        push: function(id, player) {
            player.status = 0;
            this.players[id] = player;
        },
        play: function(id) {
            this.pauseAll();

            this.currentId = id;
            this.players[id].play();
        },
        pause: function(id) {
            this.players[id].pause();
        },
        pauseAll: function() {
            var player = this.players[this.currentId];
            if (this.currentId != 0 && player.status) {
                player.pause();
            }
        },
        ontouch: function(id) {
            var player = this.players[id],
                status = player.status;
            // status true: 播放中， false: 暂停/停止中
            if ( status ) { 
                this.pause(id);
            } else {
                this.play(id);
            }
            player.status = !status;
        }
    }

    var manager;

    return {
        getInstance:function() {
            if ( manager === undefined ) {
                manager = new AudioManager();
            }
            return manager;
        }
    }
})();