
var http = require('http');
var express = require('express'),
    app = module.exports.app = express();
var count=0;  //在线人数
var nickname=[];  //群组昵称、


var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance
server.listen(80);  //listen on port 80

app.get('/',function(req,res){

		res.sendfile(__dirname + '/index.html');


});
app.get('/private',function(req,res){
	res.sendfile(__dirname + '/private.html');
});
//用户连接connection
io.sockets.on('connection',function(socket){

//用户数加1
	count++;
	io.sockets.emit('namelist',nickname);  //g更新用户在线列表
	socket.broadcast.emit('count',{text:count}); //用户在新人数
	socket.emit('count',{text:count});
	//用户离线
	socket.on('disconnect',function(){
		count--;
		nickname.splice(nickname.indexOf(socket.name),1);  //列表减去用户名
		
		socket.broadcast.emit('count',{text:count});  //在线人数
		console.log(nickname);
		io.sockets.emit('namelist',nickname);
	});
	socket.on('msg',function(data){
	 data={text:data.text,name:socket.name}         //上次写到这儿
	console.log(data);
		socket.broadcast.emit('msg',data);
		data.name='me';
		socket.emit('msg',data);
	});
	
	socket.on('nickname',function(data,callback){
	if(nickname.indexOf(data) != -1){
		callback(false);
	}else{
	
		callback(true);
		socket.name=data;

		nickname.push(data);
		console.log(socket.id);
		console.log('new user name is '+data);
		console.log(socket);
		io.sockets.emit('namelist',nickname);
	}
	});
	
	//私人聊天
	socket.on('privatemsg',function(form,to,msg){
		'UUd8lBsKwkldGKaLAAAJ'.emit('privatemsg',msg);
		console.log(socket);
	});
	
	
});

