
module.exports = function(RED) {
  "use strict";
  
  function PID(config) {
    RED.nodes.createNode(this,config);
    var node = this;
    node.setpoint = Number(config.setpoint);
    node.enable = Number(config.enable);
    node.prop_band = Number(config.pb);
    node.t_integral = Number(config.ti);
    node.t_derivative = Number(config.td);
    node.integral_default = Number(config.integral_default);
    node.smooth_factor = Number(config.smooth_factor);
    node.max_interval = Number(config.max_interval);
    node.disabled_op = Number(config.disabled_op);
    
    this.on('input', function(msg) {
      var newMsg = null;
      
      // Using msg.* to change specific PID property.
      if (msg.hasOwnProperty('setpoint')) {
        node.setpoint = Number(msg.setpoint);
      }
      if (msg.hasOwnProperty('enable')) {
        node.enable = Number(msg.enable);
      }
      if (msg.hasOwnProperty('prop_band')) {
        node.prop_band = Number(msg.prop_band);
      }
      if (msg.hasOwnProperty('t_integral')) {
        node.t_integral = Number(msg.t_integral);
      }
      if (msg.hasOwnProperty('t_derivative')) {
        node.t_derivative = Number(msg.t_derivative);
      }
      if (msg.hasOwnProperty('smooth_factor')) {
        node.smooth_factor = Number(msg.smooth_factor);
      }
      if (msg.hasOwnProperty('max_interval')) {
        node.max_interval = Number(msg.max_interval);
      }
      if (msg.hasOwnProperty('disabled_op')) {
        node.disabled_op = Number(msg.disabled_op);
      }
      if (msg.hasOwnProperty('integral_default')){
        node.integral_default = Number(msg.integral_default);
      }
      if (msg.topic == 'setpoint') {
        node.setpoint = Number(msg.payload);
      } else if (msg.topic == 'enable') {
        node.enable = Number(msg.payload);
      } else if (msg.topic == 'prop_band') {
        node.prop_band = Number(msg.payload);
      } else if (msg.topic == 't_integral') {
        node.t_integral = Number(msg.payload);
      } else if (msg.topic == 't_derivative') {
        node.t_derivative = Number(msg.payload);
      } else if (msg.topic == 'smooth_factor') {
        node.smooth_factor = Number(msg.payload);
      } else if (msg.topic == 'max_interval') {
        node.max_interval = Number(msg.payload);
      } else if (msg.topic == 'disabled_op') {
        node.disabled_op = Number(msg.payload);
      } else if (msg.topic == 'integral_default') {
        node.integral_default = Number(msg.payload);
      } else {
        // anything else is assumed to be a process value
        node.pv = Number(msg.payload);   // this may give NaN which is handled in runControlLoop
        newMsg = runControlLoop();
      }
      node.send(newMsg);
    });

    function runControlLoop() {
      //node.log("pv, setpoint, prop_band, t_integral, t_derivative, integral_default, smooth_factor, max_interval, enable, disabled_op");
      //node.log(node.pv + " " + node.setpoint + " " + node.prop_band + " " + node.t_integral + " " + node.t_derivative + " " + node.integral_default + " " + node.smooth_factor + " " + node.max_interval + " " + node.enable + " " + node.disabled_op);
      var ans;
      node.status({});
      // check we have a good pv value
      if (!isNaN(node.pv) && isFinite(node.pv)) {
        // even if we are disabled (enable == 0 or false) then run through the calcs to keep the derivative up to date
        // but lock the integral and set power to appropriate value at the end
        var time = Date.now();
        var integral_locked = false;
        var factor;
        if (node.last_sample_time) {
          var delta_t = (time - node.last_sample_time)/1000;  // seconds
          if (delta_t <= 0 || delta_t > node.max_interval) {
            // too long since last sample so leave integral as is and set deriv to zero
            node.status({fill:"red",shape:"dot",text:"Too long since last sample"});
            node.derivative = 0
          } else {
            if (node.smooth_factor > 0) {
              // A derivative smoothing factor has been supplied
              // smoothing time constant is td/factor but with a min of delta_t to stop overflows
              var ts = Math.max(node.t_derivative/node.smooth_factor, delta_t);
              factor = 1.0/(ts/delta_t);
            } else {
              // no integral smoothing so factor is 1, this makes smoothed_value the previous pv
              factor = 1.0;
            }
            var delta_v = (node.pv - node.smoothed_value) * factor;
            node.smoothed_value = node.smoothed_value + delta_v
            //node.log( "factor " + factor.toFixed(3) + " delta_t " + delta_t + " delta_v " + delta_v.toFixed(3) +
            //  " smoothed " + node.smoothed_value.toFixed(3));
            node.derivative = node.t_derivative * delta_v/delta_t;
            
            // lock the integral if abs(previous integral + error) > prop_band/2
            // as this means that P + I is outside the linear region so power will be 0 or full
            // also lock if control is disabled
            var error = node.pv - node.setpoint;
            var pbo2 = node.prop_band/2.0;
            if ((Math.abs(error + node.integral) < pbo2)  && node.enable) {
              integral_locked = false;
              node.integral = node.integral + error * delta_t/node.t_integral;
              // clamp to +- 0.5 prop band widths so that it cannot push the zero power point outside the pb
              if ( node.integral < -pbo2 ) {
                node.integral = -pbo2;
              } else if (node.integral > pbo2) {
                node.integral = pbo2;
              }
            } else {
              //node.log("Locking integral");
              integral_locked = true;
            }
          }
            
        } else {
            // first time through so initialise context data
            node.smoothed_value = node.pv;
            // setup the integral term so that the power out would be integral_default if pv=setpoint
            node.integral = (0.5 - node.integral_default)*node.prop_band;
            node.derivative = 0.0;
        }
        
        var proportional = node.pv - node.setpoint;
        var power = -1.0/node.prop_band * (proportional + node.integral + node.derivative) + 0.5;
        if (power < 0.0) {
          power = 0.0;
        } else if (power > 1.0) {
          power = 1.0;
        }
        // set power to disabled value if the loop is not enabled
        if (!node.enable) {
          power = node.disabled_op;
          node.status({fill:"yellow",shape:"dot",text:"Disabled"});
        } else if (integral_locked) {
          node.status({fill:"green",shape:"dot",text:"Integral Locked"});
        } else {
          node.status({fill:"green",shape:"dot"});
        }
        node.last_sample_time = time;
      } else {
        // pv is not a good number so set power to disabled value
        power = node.disabled_op;
        node.status({fill:"red",shape:"dot",text:"Bad PV"});
      }
      ans =  {payload: power, pv: node.pv, setpoint: node.setpoint, proportional: proportional, integral: node.integral, 
        derivative: node.derivative, smoothed_value: node.smoothed_value}
      return ans;
    }
  }
  RED.nodes.registerType("PID",PID);
}

  

