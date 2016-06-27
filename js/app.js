/**
 * Created by mspark on 16. 6. 27.
 */
requirejs.config({
    baseUrl: 'js',
    paths:{
        'xmpp': 'xmpp',
        'stanza.io': 'lib/stanza.io'
    }
});

requirejs(['xmpp'], function(XMPP) {
    var xmpp = new XMPP();
    debugger;
});