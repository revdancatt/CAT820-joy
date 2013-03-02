control = {
    
    paused: false,
    happy: false,

    y: 0,

    init: function() {
        //utils.log('Here!');
        if (utils.getURLParameter('happy') !== null && utils.getURLParameter('happy') == 1) {
            this.happy = true;
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
