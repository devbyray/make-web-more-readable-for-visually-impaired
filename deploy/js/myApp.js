var MyApp = (function() {

    var _somePrivateProperty = null;

    return {
        /**
         * A simple getter to test
         * @returns {*}
         */
        getProperty : function() {
            return _somePrivateProperty;
        },

        /**
         * A simple setter to test
         * @param newVal The new value
         */
        setProperty : function(newVal) {
            _somePrivateProperty = newVal;
        }
    };
})();