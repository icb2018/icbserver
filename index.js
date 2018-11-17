var express = require('express')
var bodyParser = require('body-parser')

var net = require('net')
var server = net.createServer()

var app = express()

var gDoorIn=''
var gDoorOut=''
var gImei=''
var gSocket;

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.post('/', function(req, res){
  var imei = req.body.imei;
  var doorIn = req.body.doorIn;
  var doorOut = req.body.doorOut;
  //gImei=imei;
  gDoorIn=doorIn;
  gDoorOut=doorOut;
  console.log(req.body);
  console.log("imei="+gImei+"doorIn="+doorIn+"doorOut="+doorOut);
  res.end("imei="+gImei+"doorIn="+doorIn+"doorOut="+doorOut);
  gSocket.write(gDoorIn+gDoorOut);
})

app.get('/', function (req, res) {
  if((gSocket == "") || (gSocket == undefined) || (gSocket == null)){
    res.send("")
  }
  else{
    //res.send(gImei)
    res.send(gImei)
    //gSocket.write(gImei)
  }
  
})

app.listen(process.env.PORT || 5050)

server.on('connection', function(socket){
  gSocket=socket
  console.log('got a new connection')
  gSocket.on('data', function(data){
    console.log('got data:', data)
    gImei=data
    //socket.write(data)
    //gSocket.write(gImei)
  })
  gSocket.on('close', function(){
    console.log('connection closed')
    // 重置socket
    gSocket=''
  })
})
server.on('error', function(err){
  console.log('server error:', err.message)
})
server.on('close', function(){
  console.log('server closed')
  // 重置socket
  gSocket=''
})

server.listen(4000)
