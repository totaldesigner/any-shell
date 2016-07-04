requirejs.config({
    baseUrl: 'js',
    paths: {
        'event': 'event',
        'xmpp': 'xmpp',
        'stanza.io': 'lib/stanza.io'
    }
});

requirejs(['xmpp'], function (XMPPClient) {
    var client = new XMPPClient();
    client.on('started', function () {
        debugger;
    });
});