define('xmpp', ['event', 'util'], function (event, util) {
    var JID = 'user@localhost';
    var PASSWORD = '1234';
    var RESOURCE = 'guest';
    var WS_IP = '192.168.0.1';
    var WS_PORT = 5280;
    var WS_URL = 'ws://' + WS_IP + ':' + WS_PORT + '/websocket';
    var EventTarget = event.EventTarget;

    /**
     * XMPPClient
     * @constructor
     */
    function XMPPClient() {
        var self = this;
        require(['stanza.io'], function (StanzaIO) {
            self.StanzaIO = StanzaIO;
            var client = StanzaIO.createClient({
                jid: JID,
                resource: RESOURCE,
                password: PASSWORD,
                wsURL: WS_URL,
                transport: 'websocket',
                sasl: 'plain'
            });
            client.on('session:started', function () {
                client.getRoster();
                client.sendPresence();
                client.getDiscoItems(JID, '', function (err, data) {
                    var resource, items = data.discoItems.items;
                    for (var j = 0; j < items.length; j++) {
                        resource = items[j].jid.resource;
                        if (resource.indexOf(RESOURCE) != -1) {
                            // NOT IMPLEMENTED
                        }
                    }
                    self.fire('started');
                });
            });
            client.on('chat', function (msg) {
                var body, out, err;
                body = JSON.parse(msg.body);
                out = body.out;
                err = body.err;
                console.log('out: ' + out);
                console.log('err: ' + err);
            });
            client.connect();
            self.client = client;
        });
    }

    util.mixin(XMPPClient.prototype, EventTarget.prototype);
    XMPPClient.prototype.send = function (command) {
        var self = this;
        var msg = {
            to: JID + '/shell',
            body: JSON.stringify({
                'command': command
            }),
            type: 'chat'
        };
        self.client.sendMessage(msg);
    };

    return XMPPClient;
});