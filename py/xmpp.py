import json
import os
import sleekxmpp

from concurrent.futures import ThreadPoolExecutor


class XMPPShell(sleekxmpp.ClientXMPP):
    def __init__(self, jid, password):
        sleekxmpp.ClientXMPP.__init__(self, jid, password)
        self.add_event_handler("session_start", self.session_start, threaded=True)
        self.add_event_handler("message", self.message)
        self['feature_mechanisms'].unencrypted_plain = True
        self.executor = ThreadPoolExecutor(max_workers=1000)

    def session_start(self, event):
        self.send_presence()
        self.get_roster()

    def message(self, msg):
        try:
            if msg['type'] in ('chat', 'normal'):
                self.executor.submit(self.handle_request, msg)
        except Exception as e:
            no, err = e.args
            print("Exception({0}): {1}".format(no, err))

    def handle_request(self, msg):
        body = json.loads(msg['body'])
        command = body['command']
        try:
            body['out'] = os.system(command)
        except Exception as e:
            body['err'] = str(e)
        finally:
            msg['body'] = json.dumps(body)
            self.response(msg)

    def response(self, msg):
        self.send_message(
            mto=msg['from'],
            mbody=msg['body'],
            mtype='chat')


usage = """
    xmpp.py [options]
    example>
        python xmpp.py --jid="user@localhost/shell" --password="1234"
"""

if __name__ == '__main__':
    import optparse

    parser = optparse.OptionParser(usage=usage)
    parser.add_option("-j", "--jid", dest="id", help="jid - user@localhost/shell", default=None)
    parser.add_option("-p", "--password", dest="password", help="password - 1234", default=None)

    (options, args) = parser.parse_args()
    shell = XMPPShell(options.jid, options.password)
    shell.connect(use_tls=False)
    shell.process()
