define("util", function () {
    function mixin(target, source) {
        function copyProperty(key) {
            target[key] = source[key];
        }

        if (arguments.length > 2) {
            Array.prototype.slice.call(arguments, 2).forEach(copyProperty);
        } else {
            Object.keys(source).forEach(copyProperty);
        }
    }

    return {
        mixin: mixin
    }
});