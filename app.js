// 1. servo   range 500~2500
//   0.5ms-------------0度；
//   1.0ms------------45度；
//   1.5ms------------90度；
//   2.0ms-----------135度；
//   2.5ms-----------180度；
// 50hz    p=20ms   

// 1. esc   range 1000~2000
//   1.0ms------------0%油门；
//   2.0ms----------100%油门；
// 50hz    p=20ms 
var express=require('express');
var exec = require('child_process').exec;
  app=express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  Gpio = require('pigpio').Gpio,
  t1 = new Gpio(20, {mode: Gpio.OUTPUT}),
  t2 = new Gpio(21, {mode: Gpio.OUTPUT}),
  lw = new Gpio(5,  {mode: Gpio.OUTPUT}),
  rw = new Gpio(6,  {mode: Gpio.OUTPUT}),
  wd = new Gpio(13, {mode: Gpio.OUTPUT});
app.use(express.static('./public'));
var numUsers = 0;
io.on('connection', function(socket){
	
	var addedUser = false;
	
	socket.on('tt', function(msg){
		var cv=10*parseInt(msg)+1000;
		t1.servoWrite(cv);
		t2.servoWrite(cv);
		console.log('throttle: ' + msg);
	});
	socket.on('lw', function(msg){
		var cv=10*parseInt(msg)+1500;
		lw.servoWrite(cv);
		console.log('Left wing: ' + msg);
	});
	socket.on('rw', function(msg){
		var cv=10*parseInt(msg)+1500;
		rw.servoWrite(cv);
		console.log('Right wing: ' + msg);
	});
	socket.on('wd', function(msg){
		var cv=10*parseInt(msg)+1500;
		wd.servoWrite(cv);
		console.log('Rudder: ' + msg);
	});
	var mod="tk";//cmd || sh || tk
	socket.on('newMessage', function(msg){
		if(mod=="tk"){
			if(msg=="tk") {mod="tk";socket.emit('newMessage',"进入聊天模式");}
			else if(msg=="cmd"){mod="cmd";socket.emit('newMessage',"进入飞行命令模式");}
			else if(msg=="sh") {mod="sh";socket.emit('newMessage',"进入系统命令模式");}
			else if(msg=="exit") {mod="tk";socket.emit('newMessage',"退出"+mod+"模式，进入聊天模式");}
			else if(msg=="mod")  {socket.emit('newMessage',mod); mod="tk";}
			else{
				socket.broadcast.emit('newMessage', {
					username: socket.username,
					message: msg
				});
				console.log('msg : ' + msg);
			}
		}
		else if(mod=="sh"){
			if(msg=="tk") {mod="tk";socket.emit('newMessage',"进入聊天模式");}
			else if(msg=="cmd"){mod="cmd";socket.emit('newMessage',"进入飞行命令模式");}
			else if(msg=="sh") {mod="sh";socket.emit('newMessage',"进入系统命令模式");}
			else if(msg=="exit") {mod="tk";socket.emit('newMessage',"退出"+mod+"模式，进入聊天模式");}
			else if(msg=="mod")  {socket.emit('newMessage',mod); mod="tk";}
			else{
				exec(msg, function (error, stdout, stderr) {
					if (error) {
						//console.log(error.stack+'Error code: ' + error.code);
						socket.emit('newMessage',"Error code:"+error.code+"<br>"+error.stack);
					}
						//console.log('Child Process STDOUT: ' + stdout);
						socket.emit('newMessage',stdout);
				});
				console.log('system cmd : ' + msg);
			}
		}else{
			if(msg=="tk") {mod="tk";socket.emit('newMessage',"进入聊天模式");}
			else if(msg=="cmd"){mod="cmd";socket.emit('newMessage',"进入飞行命令模式");}
			else if(msg=="sh") {mod="sh";socket.emit('newMessage',"进入系统命令模式");}
			else if(msg=="exit") {mod="tk";socket.emit('newMessage',"退出"+mod+"模式，进入聊天模式");}
			else if(msg=="mod")  {socket.emit('newMessage',mod); mod="tk";}
			else if(msg.substring(0,2)=="go"){
				socket.emit('newMessage',"起航命令成功！");
			}else if(msg.substring(0,4)=="back"){
				socket.emit('newMessage',"返航命令成功！");
			}else if(msg.substring(0,2)=="mk"){
				socket.emit('newMessage',"缓存定位命令成功！");
			}else if(msg.substring(0,2)=="ms"){
				socket.emit('newMessage',"显示定位缓存命令成功！");
			}else{
				socket.emit('newMessage',"<br>未知命令! <br>mod : 显示当前模式.<br>tk : 进入聊天模式.<br>sh : 进入系统命令模式.<br>cmd : 进入飞行命令模式.<br>exit : 退出当前模式.<br>mk : 缓存当前经纬度和海拔高度.<br>ms : 显示已缓存经纬度和海拔高度.<br>go [lat,lng | mk:{n}]: 起航。");
			}
			console.log('cmd : ' + msg);
		}
		
	});
	socket.on('nvg', function(msg){
		console.log(msg);
		socket.broadcast.emit('nvg', msg);
	});
	socket.on('addUser', function (msg) {
		//socket.emit('newMessage',"Hello, "+msg+"!");
		// we store the username in the socket session for this client
		socket.username = msg;
		++numUsers;
		addedUser = true;
		socket.emit('login', {
		  numUsers: numUsers
		});
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('user joined', {
		  username: socket.username,
		  numUsers: numUsers
		});
		console.log(msg+' user joined');
	});
	
	
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

http.listen(80, function(){
  console.log('listening on *:80');
});