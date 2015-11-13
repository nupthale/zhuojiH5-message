describe("AudioPlayer", function() {
    var sandbox = sinon.sandbox.create();

    beforeEach(function() {
        // sandbox.stub(audioPlayer, setup);
    });

    afterEach(function() {
        sandbox.restore();
    });

    it("should setup", function() {
        var audioPlayer = new window.audioPlayer();
        sandbox.stub(audioPlayer, setup);
        expect(audioPlayer.setup.called).not.toBeTruthy();

        audioPlayer.setup();
        expect(audioPlayer.setup.called).toBeTruthy();
    });

    it("should ", function() {
        
    });
});