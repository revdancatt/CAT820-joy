control = {
    
    paused: false,
    y: 0,

    init: function() {
        //utils.log('Here!');
    }

}

utils = {
    
    log: function(msg) {
        try {
            console.log(msg)
        } catch(er) {
            //  Do Nowt.
        }
    }
}
