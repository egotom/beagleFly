
  var socket;
  function connect() {
	  $("#knob").focus();
      var host = "ws://192.168.1.195:12345/";
      var pin="168";
      if($('#host').val().lenght>5){
        host="ws://"+$('#host').val();
      }
      if ($('#pin').val().lenght>0) {
          pin=$('#pin').val()
      }
      try {
          socket = new WebSocket(host);
          socket.onopen = function (msg) {
              log("连接服务器中...");
          };
          socket.onmessage = function (msg) {
              var data=JSON.parse(msg.data)

              if(data.c===2) {
                socket.send(pin);
                log("验证用户 ...");
              }
              if(data.c===3) {
                log("连接成功,开始通讯 ...");
              }
              if(data.c===4) {
                log(data.msg);
              }
              if(data.c===6) {
                  $("#altitude").html(data.altitude);
                  $("#latitude").html(data.latitude);
                  $("#longitude").html(data.longitude);
                  $("#time").html(data.time);
                  $("#speed").html(data.speed);
				  $("#xforce").html(data.xforce);
				  $("#yforce").html(data.yforce);
				  $("#zforce").html(data.zforce);
				  $("#azimuth").html(data.azimuth* 180 / Math.PI);
				  $("#pitch").html(data.pitch*180 / Math.PI);
				  $("#roll").html(data.roll* 180 / Math.PI);
				  $("#bearing").html(data.bearing);
				  $("#saccuracy").html(data.accuracy);
				  $("#provider").html(data.provider);
              }
          };
          socket.onclose = function (msg) {
              log("连接中断!");
          };
      }
      catch (ex) {
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
      $("#log").prepend(msg+"<br>") ;
  }
  

$(function(){
  $(".knob").knob();
  $( "#lw" ).slider({
    orientation: "vertical",
	animate: true,
    range: "min",
    min: -100,
    max: 100,
    value: 0,
    slide: function( event, ui ) {
      $( "#lwm" ).val( ui.value );//alert("slide");
	  if(ui.value>0) $( "#lwm" ).css("color","blue");
	  else           $( "#lwm" ).css("color","green");
    }
  });

  $( "#lwm" ).val( $( "#lw" ).slider( "value" ) );

  $( "#rw" ).slider({
    orientation: "vertical",
    range: "min",
    min: -100,
    max: 100,
    value: 0,
    slide: function( event, ui ) {
      $( "#rwm" ).val( ui.value );
	  if(ui.value>0) $( "#rwm" ).css("color","blue");
	  else           $( "#rwm" ).css("color","green");
    }
  });
  $( "#rwm" ).val( $( "#rw" ).slider( "value" ) );

  $( "#wd" ).slider({
    range: "min",
    min: -100,
    max: 100,
    value: 0,
    slide: function( event, ui ) {
      $( "#wdm" ).val( ui.value );
	  if(parseInt(ui.value)>0) $( "#wdm" ).css("color","blue");
	  else           $( "#wdm" ).css("color","green");
    }
  });
 $( "#wdm" ).val( $( "#wd" ).slider( "value" ) );
 
 
	$(document).on('keydown', null, 'J', m);
	$(document).on('keydown', null, 'C', n);
	$(document).on('keydown', null, 'p', p);
	$(document).on('keydown', null, 'o', o);
	$(document).on('keydown', null, 'a', a);
	$(document).on('keydown', null, 's', s);
	
	$(document).on('keydown', null, 'u', u);
	$(document).on('keydown', null, 'd', d);
	function u(){
		var cv=parseInt($("#knob").val());// alert(cv);
		if(cv<96){
			cv=cv+5;
		}else{
			cv=100;
		}
		$("#knob").val(cv).trigger('change');
	};
	function d(){
		var cv=parseInt($("#knob").val());
		if(cv>4){
			cv=cv-5;
		}else{
			cv=0;
		}
		$("#knob").val(cv).trigger('change');
	};
	function m(){
		var cv=parseInt($("#wdm").val());
		if(cv<96){
			cv=cv+5;
		}else{
			cv=100
		}
		$("#wd").slider('option', 'value',cv);
		$("#wdm").val(cv);

	};
	function n(){
		var cv=parseInt($("#wdm").val());
		if(cv>-94){
			cv=cv-5;
		}else{
			cv=-100;
		}
		$("#wd").slider('option', 'value',cv);
		$("#wdm").val(cv);
	};
	function o(){
		var cv=parseInt($("#rwm").val());
		if(cv<96){
			cv=cv+5;
		}else{
			cv=100
		}
		$("#rw").slider('option', 'value',cv);
		$("#rwm").val(cv);
	};
	function p(){
		var cv=parseInt($("#rwm").val());
		if(cv>-94){
			cv=cv-5;
		}else{
			cv=-100;
		}
		$("#rw").slider('option', 'value',cv);
		$("#rwm").val(cv);
	};
	function s(){
		var cv=parseInt($("#lwm").val());
		if(cv<96){
			cv=cv+5;
		}else{
			cv=100;
		}
		$("#lw").slider('option', 'value',cv);
		$("#lwm").val(cv);
	};
	function a(){
		var cv=parseInt($("#lwm").val());
		if(cv>-94){
			cv=cv-5;
		}else{
			cv=-100;
		}
		$("#lw").slider('option', 'value',cv);
		$("#lwm").val(cv);
	};

});