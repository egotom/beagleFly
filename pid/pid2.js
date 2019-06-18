//privateScope.loadPidController = new classes.PidController();
//    privateScope.loadPidController.setTarget(privateScope.targetLoad);
//    privateScope.loadPidController.setOutput(0, 97, 0);
//    privateScope.loadPidController.setGains(16, 6, 4);
//    privateScope.loadPidController.setItermLimit(0, 90);
//
//
//Target value: 1.5
//Gains: P = 16, I = 6, D = 4
//Output limited at 0 and 97
//I-term accumulator limited at 0 and 90
//
//privateScope.loadPidController.run(currentValue);


'use strict';

var classes = classes || {};

classes.PidController = function () {

    var self = {},
        privateScope = {};

    /**
     *
     * @type {number}
     */
    privateScope.target = null;

    /**
     *
     * @type {{P: null, I: null, D: null}}
     */
    privateScope.gains = {
        P: null,
        I: null,
        D: null
    };

    /**
     *
     * @type {number}
     */
    privateScope.Iterm = 0;

    /**
     *
     * @type {{min: number, max: number}}
     */
    privateScope.ItermLimit = {
        min: -1000,
        max: 1000
    };

    /**
     *
     * @type {number}
     */
    privateScope.previousError = 0;

    /**
     *
     * @type {{min: number, max: number, minThreshold: number}}
     */
    privateScope.output = {
        min: null,
        max: null,
        minThreshold: null
    };

    /**
     *
     * @param {number} value
     */
    self.setTarget = function (value) {
        privateScope.target = value;
    };

    /**
     * @param {number} Pgain
     * @param {number} Igain
     * @param {number} Dgain
     */
    self.setGains = function (Pgain, Igain, Dgain) {
        privateScope.gains.P = Pgain;
        privateScope.gains.I = Igain;
        privateScope.gains.D = Dgain;
    };

    /**
     * Sets min and max value for output
     * @param {number} min
     * @param {number} max
     * @param {number} minThreshold if output is below this value, [min] is returned
     */
    self.setOutput = function (min, max, minThreshold) {
        privateScope.output.min = min;
        privateScope.output.max = max;
        privateScope.output.minThreshold = minThreshold;
    };

    /**
     * Sets upper and lower limit for Iterm accumulator
     * @param {number} min
     * @param {number} max
     */
    self.setItermLimit = function (min, max) {
        privateScope.ItermLimit.min = min;
        privateScope.ItermLimit.max = max;
    };

    /**
     * Executes PID controller based on current value and target
     * @param {number} current
     * @returns {number}
     */
    self.run = function (current) {
        var error = current - privateScope.target,
            Pterm = error * privateScope.gains.P,
            Dterm = (error - privateScope.previousError) * privateScope.gains.D,
            output;

        privateScope.previousError = error;

        privateScope.Iterm += error * privateScope.gains.I;
        if (privateScope.Iterm > privateScope.ItermLimit.max) {
            privateScope.Iterm = privateScope.ItermLimit.max;
        } else if (privateScope.Iterm < privateScope.ItermLimit.min) {
            privateScope.Iterm = privateScope.ItermLimit.min;
        }

        output = Pterm + privateScope.Iterm + Dterm;
        if (output < privateScope.output.minThreshold) {
            output = privateScope.output.min;
        } else if (output > privateScope.output.max) {
            output = privateScope.output.max;
        }

        return output;
    };

    return self;
};