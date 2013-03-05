control = {
    
    paused: false,
    happy: false,
    dancer: null,
    audioPlaying: false,
    lines: 45,
    subdivisions: 40,
    dampen: [
              0.01, 0.02, 0.03, 0.04, 0.04, 0.05, 0.05, 0.06, 0.08, 0.11,
              0.20, 0.35, 0.42, 0.85, 0.95, 1, 1, 0.70, 0.70, 0.70,
              0.55, 0.70, 0.80, 0.55, 0.50, 0.45, 0.35, 0.20, 0.16, 0.11,
              0.11, 0.08, 0.06, 0.05, 0.05, 0.04, 0.04, 0.03, 0.02, 0.01
            ],
    dampenAudio: [
              0.01, 0.02, 0.03, 0.04, 0.04, 0.05, 0.05, 0.06, 0.08, 0.10,
              0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.55,
              0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95, 1.00, 1.05,
              1.10, 0.80, 0.60, 0.50, 0.45, 0.40, 0.35, 0.30, 0.25, 0.20
            ],
    lineData: [],
    offset: 0.1,
    restartRandomTmr: null,
    resetting: false,
    fft: [],
    fftTmr: null,
    paused: false,

    init: function() {

        //  check to see if we are happy
        if (utils.getURLParameter('happy') !== null && utils.getURLParameter('happy') == 1) {
            this.happy = true;
        }

        //  Check to see if we can play some audio
        if (Dancer.isSupported() != '' && Dancer.isSupported() != 'flash') {
            this.dancer = new Dancer();
            this.dancer.load({ src: 'snd/disorder30s', codecs: [ 'ogg', 'mp3' ]});
            $('.play').removeClass('hidden');
        }

        //  add the clicks to the controls
        $('.play').on('click', function() { control.startPlaying(); });
        $('.mono').on('click', function() { control.happy = false; });
        $('.colour').on('click', function() { control.happy = true; });
        $('.pause').on('click', function() { 
            if (control.paused) {
                control.dancer.play();
                control.paused = false;
            } else {
                control.dancer.pause();
                control.paused = true;
            }
        });

    },

    //  All this needs to happen when we start to play the audio
    startPlaying: function() {

        //  Turn the timer off that'd restart the random noise
        clearTimeout(this.restartRandomTmr);
        control.resetting = false;

        //  empty out the line data and fill it with zeros
        this.lineData = [];
        var newLine = [];
        for (var x = 1; x < control.subdivisions; x++) {
            newLine.push(0);
        }
        for (var i = 0; i < control.lines; i++) {
            this.lineData.push(newLine);
        }


        //  Toggle the displays
        $('.play').addClass('hidden');
        $('.pause').removeClass('hidden');

        //  Fill up the FFT with an empty set of values
        //  and then start polling it
        control.getFFT();
        clearTimeout(control.popTmr);
        control.fftTmr = setInterval(function() {
          control.getFFT();
        }, 50);

        //  say that we are now in audioPlaying mode
        this.audioPlaying = true;
        this.dancer.play();

    },


    //  grab the spectrum data, this takes a bit of time
    //  so it's decoupled from the rest of the code
    getFFT: function() {
        control.fft = control.dancer.getSpectrum();
    },


    //  this kills the line at the end of the lines array
    //  and puts a new one at the start
    //  effectivily moving them all down. 
    popLines: function() {


        //  Pop the last line off the end of the stack
        this.lineData.pop();

        //  'cause I want to use the noise function from
        //  processing
        var p = Processing.getInstanceById('processing_target');

        //  Add a new set of data in the first row
        var newLine = [];
        var wavePos = null;
        var leftShift = 10;

        for (var x = 1; x < control.subdivisions; x++) {

            //  just do noise for the first [leftShift] slots as we don't
            //  want to put the more interesting bass sounds in
            //  the part over on the left that's all dampened
            if (x < leftShift || this.resetting) {
                if (this.resetting && x > leftShift && x < control.subdivisions - leftShift) {
                    newLine.push(p.noise(x, this.offset) * 100 * control.dampen[leftShift]);    
                } else {
                    newLine.push(p.noise(x, this.offset) * 100 * control.dampen[x-1]);                    
                }
            } else {

                //  get the % of the way through the rest of the points then
                //  grab the value from that percent through the fft array
                wavePos = (x - leftShift) / (control.subdivisions - leftShift);
                wavePos = control.fft[Math.floor(control.fft.length * wavePos)];

                //  push it into the new line array
                newLine.push(wavePos * 8000 * control.dampenAudio[x-1]);
            }
        }

        //  stuff the new line we've made at the start of the array, 
        //  effectively shoving everything down
        this.lineData.unshift(newLine);

        //  grab the time for display
        var time = Math.round((30 - control.dancer.getTime()) * 100) / 100;

        if (time < 10) time = '0' + time;
        $('.pause').text('pause: 0:' + time);

        //  if it has finished then swap everything back round
        //  and start the timer that'll turn the random noise back on
        if (time <= 0 && !control.resetting) {

            //  set the resetting flag so we don't call it again
            control.resetting = true;

            //  turn the fft  and hide the things
            clearTimeout(control.fftTmr);
            $('.play').removeClass('hidden');
            $('.pause').addClass('hidden');

            //  after 4 seconds I want the random to kick back in
            this.restartRandomTmr = setTimeout(function() {
                control.audioPlaying = false;
            }, 4000);

        }

    }


}

utils = {
    
    log: function(msg) {
        try {
            console.log(msg)
        } catch(er) {
            //  Do Nowt.
        }
    },

    getURLParameter: function(name) {
        return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1])
    }

}
