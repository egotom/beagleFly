$(function(){
	
	$("[name='sw']").bootstrapSwitch();
	$("#swa").checked=false;
	$("#swt").checked=false;
	$("#swi").checked=false;
	$("#sw2").checked=false;
	$("#sw3").checked=false;

var lw = new LinearGauge({
    renderTo: 'lw',
    barBeginCircle: false,
    barWidth: 8,
    barStroke: 0,
    colorBar: "#d5d5d5",
    colorBarProgress: "#d5d5d5",
    colorNeedleEnd: "",
    colorNeedle: "#000",
    animationRule: "linear",
    animationDuration: 0,
    needleWidth: 3,
    needleType: "arrow",
    borderRadius: 10,
    borders: false,
    borderShadowWidth: 0,
    colorNumbers: "#000",
    colorUnits: "#333",
    colorTitle: "#333",
    colorMinorTicks: "#ffe66a",
    colorMajorTicks: "#ffe66a",
    highlights: [
        {"from": -50,"to": 0,"color": "rgba(0,0, 255, .3)"},
        {"from": 0,"to": 50,"color": "rgba(0, 255,0, .3)"}
    ],
    ticksWidthMinor: 7.5,
    ticksWidth: 15,
    strokeTicks: true,
    minorTicks: 5,
    majorTicks: [-100,-80,-60,-40,-20,0,20,40,60,80,100],
    maxValue: 100,
    minValue: -100,
    title: "左翼",
    units: "°",
    height: 550,
    width: 150
}).draw();
var rw = new LinearGauge({
    renderTo: 'rw',
    barBeginCircle: false,
    barWidth: 8,
    barStroke: 0,
    colorBar: "#d5d5d5",
    colorBarProgress: "#d5d5d5",
    colorNeedleEnd: "",
    colorNeedle: "#000",
    animationRule: "linear",
    animationDuration: 0,
    needleWidth: 3,
    needleType: "arrow",
    borderRadius: 10,
    borders: false,
    borderShadowWidth: 0,
    colorNumbers: "#000",
    colorUnits: "#333",
    colorTitle: "#333",
    colorMinorTicks: "#ffe66a",
    colorMajorTicks: "#ffe66a",
    highlights: [
        {"from": -50,"to": 0,"color": "rgba(0,0, 255, .3)"},
        {"from": 0,"to": 50,"color": "rgba(0, 255,0, .3)"}
    ],
    ticksWidthMinor: 7.5,
    ticksWidth: 15,
    strokeTicks: true,
    minorTicks: 5,
    majorTicks: [-100,-80,-60,-40,-20,0,20,40,60,80,100],
    maxValue: 100,
    minValue: -100,
    title: "右翼",
    units: "°",
    height: 550,
    width: 150
}).draw();
var wd = new LinearGauge({
    renderTo: 'wd',
    barBeginCircle: false,
    barWidth: 8,
    barStroke: 0,
    colorBar: "#d5d5d5",
    colorBarProgress: "#d5d5d5",
    colorNeedleEnd: "",
    colorNeedle: "#000",
    animationRule: "linear",
    animationDuration: 0,
    needleWidth: 3,
    needleType: "arrow",
    borderRadius: 10,
    borders: false,
    borderShadowWidth: 0,
    colorNumbers: "#000",
    colorUnits: "#333",
    colorTitle: "#333",
    colorMinorTicks: "#ffe66a",
    colorMajorTicks: "#ffe66a",
    highlights: [
        {"from": -50,"to": 0,"color": "rgba(0,0, 255, .3)"},
        {"from": 0,"to": 50,"color": "rgba(0, 255,0, .3)"}
    ],
    ticksWidthMinor: 7.5,
    ticksWidth: 15,
    strokeTicks: true,
    minorTicks: 5,
    majorTicks: [-100,-80,-60,-40,-20,0,20,40,60,80,100],
    maxValue: 100,
    minValue: -100,
    title: "尾翼",
    units: "°",
    height: 200,
    width: 550
}).draw();
var az = new RadialGauge({width: 200,
    renderTo: 'az',
    animationDuration: 0,
    borderShadowWidth: 0,
    colorNeedleShadowDown: "#222",
    colorBorderOuterEnd: "#ccc",
    colorBorderOuter: "#ccc",
    borderOuterWidth: 0,
    borderMiddleWidth: 0,
    borderInnerWidth: 0,
    borders: true,
    needleWidth: 3,
    needleEnd: 99,
    needleStart: 75,
    needleType: "line",
    animationRule: "linear",
    needleCircleOuter: false,
    needleCircleSize: 15,
    colorNeedleCircleOuter: "#ccc",
    colorCircleInner: "#fff",
    valueTextShadow: false,
    valueBox: false,
    colorNeedleEnd: "rgba(255, 160, 122, .9)",
    colorNeedle: "rgba(240, 128, 128, 1)",
    colorNumbers: "#ccc",
    colorMinorTicks: "#ddd",
    colorMajorTicks: "#f5f5f5",
    colorPlate: "#222",
    highlights: false,
    strokeTicks: false,
    startAngle: 180,
    ticksAngle: 360,
    minorTicks: 22,
    majorTicks: ["北","东北","东","东南","南","西南","西","西北","北"],
    maxValue: 360,
    minValue: 0
}).draw();

var pt = new RadialGauge({
    renderTo: 'pt',
    animationRule: "linear",
    animationDuration: 0,
    needleCircleInner: false,
    needleCircleOuter: true,
    needleCircleSize: 7,
    needleWidth: 2,
    needleType: "arrow",
    borders: false,
    borderShadowWidth: 0,
    colorPlate: "#fff",
    highlights: [{"from": -50,"to": -20,"color": "rgba(200, 50, 50, .75)"},{"from": 30,"to": 50,"color": "rgba(200, 50, 50, .75)"}],
    strokeTicks: true,
    minorTicks: 2,
    majorTicks: ["-50","-40","-30","-20","-10","0","10","20","30","40","50"],
    maxValue: 50,
    valueBox: false,
    ticksAngle: 180,
    startAngle: 90,
    minValue: -50,
    units: "°",
    height: 170,
    width: 170
}).draw();
var rl = new RadialGauge({
    renderTo: 'rl',
    animationRule: "linear",
    animationDuration: 0,
    needleCircleInner: false,
    needleCircleOuter: true,
    needleCircleSize: 7,
    needleWidth: 2,
    needleType: "arrow",
    borders: false,
    borderShadowWidth: 0,
    colorPlate: "#fff",
    highlights: [{"from": -50,"to": -30,"color": "rgba(200, 50, 50, .75)"},{"from": 30,"to": 50,"color": "rgba(200, 50, 50, .75)"}],
    strokeTicks: true,
    minorTicks: 2,
    majorTicks: ["-50","-40","-30","-20","-10","0","10","20","30","40","50"],
    maxValue: 50,
    valueBox: false,
    ticksAngle: 180,
    startAngle: 90,
    minValue: -50,
    units: "°",
    height: 170,
    width: 170
}).draw();
var lt = new RadialGauge({
    renderTo: 'lt',
    animationRule: "linear",
    animationDuration: 0,
    needleCircleInner: false,
    needleCircleOuter: true,
    needleCircleSize: 7,
    needleWidth: 2,
    needleType: "arrow",
    borders: false,
    borderShadowWidth: 0,
    colorPlate: "#fff",
    highlights: [{"from": 70,"to": 100,"color": "rgba(200, 50, 50, .75)"}],
    strokeTicks: true,
    minorTicks: 2,
    majorTicks: ["0","10","20","30","40","50","60","70","80","90","100"],
    maxValue: 100,
    valueBox: false,
    ticksAngle: 180,
    startAngle: 90,
    minValue: 0,
    units: "",
    height: 250,
    width: 250
}).draw();
var rt = new RadialGauge({
    renderTo: 'rt',
    animationRule: "linear",
    animationDuration: 0,
    needleCircleInner: false,
    needleCircleOuter: true,
    needleCircleSize: 7,
    needleWidth: 2,
    needleType: "arrow",
    borders: false,
    borderShadowWidth: 0,
    colorPlate: "#fff",
    highlights: [{"from": 70,"to": 100,"color": "rgba(200, 50, 50, .75)"}],
    strokeTicks: true,
    minorTicks: 2,
    majorTicks: ["0","10","20","30","40","50","60","70","80","90","100"],
    maxValue: 100,
    valueBox: false,
    ticksAngle: 180,
    startAngle: 90,
    minValue: 0,
    units: "",
    height: 250,
    width: 250
}).draw();

	lw.value=0;
	rw.value=0;
	wd.value=0;
	lt.value=0;
	rt.value=0;

	var socket = io();
	socket.emit('addUser', '地球人');

	$('#swt').on('switchChange.bootstrapSwitch', function(event, state) {
		if(state) {
            rt.value=lt.value=100;
			socket.emit('tt', 100);
        }else{
			rt.value=lt.value=0;
			socket.emit('tt', 0);
		}
	});
	$(document).on('keydown', null, 'j', j);
	$(document).on('keydown', null, 'c', c);
	$(document).on('keydown', null, 'p', p);
	$(document).on('keydown', null, 'o', o);
	$(document).on('keydown', null, 'a', a);
	$(document).on('keydown', null, 's', s);
	$(document).on('keydown', null, 'u', u);
	$(document).on('keydown', null, 'd', d);
	function u(){
		var cv=parseInt(rt.value);//alert(cv);
		if(cv<96){
			cv=cv+5;
		}else{
			cv=100;
		}
		rt.value=lt.value=cv;
		socket.emit('tt', cv);
	};
	function d(){
		var cv=parseInt(rt.value);
		if(cv>4){
			cv=cv-5;
		}else{
			cv=0;
		}
		rt.value=lt.value=cv;
		socket.emit('tt', cv);
	};
	function j(){
		var cv=parseInt(wd.value);
		if(cv<96){
			cv=cv+5;
		}else{
			cv=100
		}
		wd.value=cv;
		socket.emit('wd', cv);
	};
	function c(){
		var cv=parseInt(wd.value);
		if(cv>-94){
			cv=cv-5;
		}else{
			cv=-100;
		}
		wd.value=cv;
		socket.emit('wd', cv);
	};
	function o(){
		var cv=parseInt(rw.value);
		if(cv<96){
			cv=cv+5;
		}else{
			cv=100
		}
		rw.value=cv;
		socket.emit('rw', cv);
	};
	function p(){
		var cv=parseInt(rw.value);
		if(cv>-94){
			cv=cv-5;
		}else{
			cv=-100;
		}
		rw.value=cv;
		socket.emit('rw', cv);
	};
	function s(){
		var cv=parseInt(lw.value);
		if(cv<96){
			cv=cv+5;
		}else{
			cv=100;
		}
		lw.value=cv;
		socket.emit('lw', cv);
	};
	function a(){
		var cv=parseInt(lw.value);
		if(cv>-94){
			cv=cv-5;
		}else{
			cv=-100;
		}
		lw.value=cv;
		socket.emit('lw', cv);
	};
	function cleanInput (input) {
		return $('<div/>').text(input).html();
	}
	// command line name set
	$(".ok").click(function(){  //alert($("#cmds").val());
		let username = cleanInput($('.name').val().trim());

		// If the username is valid
		if (username) {
		  socket.emit('addUser', username);
		}
	});
	
	$('.name').on('keypress',function(event){
         if(event.keyCode == 13) 
         {  
			let username = cleanInput($('.name').val().trim());

			// If the username is valid
			if (username) {
			  socket.emit('addUser', username);
			}
         }
     });
	// command line access function
	$("#go").click(function(){  //alert($("#cmds").val());
		socket.emit('newMessage',$("#cmds").val());		
		$('.messages').prepend('<li><i style="float:right;padding-right:3px;">'+$("#cmds").val()+'</i></li>');
		$("#cmds").val("");
		
	});
	
	$('#cmds').on('keypress',function(event){
         if(event.keyCode == 13) 
         {  
            socket.emit('newMessage',$("#cmds").val());
			$('.messages').prepend('<li><i style="float:right;padding-right:3px;">'+$("#cmds").val()+'</i></li>');
			$("#cmds").val("");
         }
     });
	// Show command result
	socket.on('newMessage', function(msg){
		//alert(msg.username+" - "+msg.message);
		if (typeof msg.username === 'undefined') {
			 $('.messages').prepend('<li style="color:blue;"><b>beagle : </b>'+msg+'</li>');
		}
		else $('.messages').prepend('<li><b>'+msg.username+': </b>'+msg.message+'</li>');
	});
	socket.on('nvg', function(data){
		$("#altitude").html(data.altitude);
		$("#latitude").html(data.latitude);
		$("#longitude").html(data.longitude);
		$("#time").html(data.time);
		$("#speed").html(data.speed);
		$("#xforce").html(data.xforce);
		$("#yforce").html(data.yforce);
		$("#zforce").html(data.zforce);
		az.value=data.azimuth* 180 / Math.PI;
		pt.value=data.pitch*-180 / Math.PI;
		rl.value=data.roll* 180 / Math.PI;
		$("#azimuth").html(data.azimuth);
		$("#pitch").html(-data.pitch);
		$("#roll").html(data.roll);
		$("#bearing").html(data.bearing);
		$("#provider").html(data.provider);
	});
});

