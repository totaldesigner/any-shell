/**
 * EventTarget
 * @constructor
 */
define('event', function () {
    function EventTarget() {
    }

    EventTarget.prototype.on = function (name, callback) {
        var self = this;
        if (!self.listeners) {
            self.listeners = {};
        }
        if (!(name in self.listeners)) {
            self.listeners[name] = [];
        }
        self.listeners[name].push(callback);
    };
    EventTarget.prototype.off = function (name, callback) {
        var self = this, stack;
        if (!self.listeners) {
            self.listeners = {};
        }
        if (!(name in self.listeners)) {
            return false;
        }
        stack = self.listeners[name];
        if (callback) {
            for (var i = 0, l = stack.length; i < l; i++) {
                if (stack[i] === callback) {
                    stack.splice(i, 1);
                    return self.removeEventListener(name, callback);
                }
            }
        } else {
            delete self.listeners[name];
        }
    };
    EventTarget.prototype.fire = function (event) {
        var self = this, stack;
        if (!(event.name in self.listeners)) {
            return;
        }
        stack = self.listeners[event.name];
        event.target = self;
        for (var i = 0, l = stack.length; i < l; i++) {
            stack[i].call(self, event);
        }
    };
    return {
        EventTarget: EventTarget
    };
});