$(function(){
  var socket;
  function connect() {
      var host = "ws://192.168.1.195:12345/";
      if($('#host').val().len()>0){
        host=$('#host').val();
      }

      try {
          socket = new WebSocket(host);
          socket.onopen = function (msg) {
              log("Begin Connection!");
          };
          socket.onmessage = function (msg) {
              log(msg.data);
          };
          socket.onclose = function (msg) {
              log("Lose Connection!");
          };
      }
      catch (ex) {
          log(ex);
      }
  }

  function send() {
      var txt, msg;
      msg = $('#pin').val();
      if (!msg) {
          alert("Pin can not be empty");
          return;
      }
      try {
          socket.send(msg);
      } catch (ex) {
          log(ex);
      }
  }

  window.onbeforeunload = function () {
      try {
          socket.send('quit');
          socket.close();
          socket = null;
      }
      catch (ex) {
          log(ex);
      }
  };

  function log(msg) {
      $("#log").innerHTML += "<br>" + msg;
  }


  $( "#lw" ).slider({
    orientation: "vertical",
    range: "min",
    min: 0,
    max: 100,
    value: 50,
    slide: function( event, ui ) {
      $( "#lwm" ).val( ui.value );
    }
  });

  $( "#lwm" ).val( $( "#lw" ).slider( "value" ) );


  $( "#rw" ).slider({
    orientation: "vertical",
    range: "min",
    min: 0,
    max: 100,
    value: 50,
    slide: function( event, ui ) {
      $( "#rwm" ).val( ui.value );
    }
  });
  $( "#rwm" ).val( $( "#rw" ).slider( "value" ) );




  $( "#wd" ).slider({
    orientation: "horizontal",
    range: "min",
    max: 100,
    value: 50,
    slide: function( event, ui ) {
      $( "#wdm" ).val( ui.value );
    }
  });
  $( "#wd" ).val( $( "#wd" ).slider( "value" ) );





  $(".knob").knob({
      change : function (value) {
          //console.log("change : " + value);
      },
      release : function (value) {
          //console.log(this.$.attr('value'));
          console.log("release : " + value);
      },
      cancel : function () {
          console.log("cancel : ", this);
      },
      /*format : function (value) {
          return value + '%';
      },*/
      draw : function () {

          // "tron" case
          if(this.$.data('skin') == 'tron') {

              this.cursorExt = 0.3;

              var a = this.arc(this.cv)  // Arc
                  , pa                   // Previous arc
                  , r = 1;

              this.g.lineWidth = this.lineWidth;

              if (this.o.displayPrevious) {
                  pa = this.arc(this.v);
                  this.g.beginPath();
                  this.g.strokeStyle = this.pColor;
                  this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                  this.g.stroke();
              }

              this.g.beginPath();
              this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
              this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
              this.g.stroke();

              this.g.lineWidth = 2;
              this.g.beginPath();
              this.g.strokeStyle = this.o.fgColor;
              this.g.arc( this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
              this.g.stroke();

              return false;
          }
      }
  });

  // Example of infinite knob, iPod click wheel
  var v, up=0,down=0,i=0
      ,$idir = $("div.idir")
      ,$ival = $("div.ival")
      ,incr = function() { i++; $idir.show().html("+").fadeOut(); $ival.html(i); }
      ,decr = function() { i--; $idir.show().html("-").fadeOut(); $ival.html(i); };
  $("input.infinite").knob({
  min : 0
  , max : 20
  , stopper : false
  , change : function () {
        if(v > this.cv){
            if(up){
                decr();
                up=0;
            }else{up=1;down=0;}
        } else {
            if(v < this.cv){
                if(down){
                    incr();
                    down=0;
                }else{down=1;up=0;}
            }
        }
        v = this.cv;
    }
  });
});