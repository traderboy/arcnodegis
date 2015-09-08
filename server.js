var express = require('express');
var bodyParser  = require('body-parser');
var app = express();
var https = require('https');
var http = require('http');

var fs = require('fs');
var data_path=__dirname + "/services";
var replica_path=__dirname+"/replicas";
var defaultService="";
var resultscache={};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var sqlite3 = require('sqlite3').verbose();
// This line is from the Node.js HTTPS documentation.
/*
openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt
 var options = {
      key: fs.readFileSync('./key.pem', 'utf8'),
      cert: fs.readFileSync('./server.crt', 'utf8')
   };
*/
var options = {
  key: fs.readFileSync('agent2-key.pem','utf8'),
  cert: fs.readFileSync('agent2-cert.cert', 'utf8')
};
//ssl_certificate     /etc/ssl/certs/reais.crt;
//sl_certificate_key /etc/ssl/private/reais.key;
var server="localhost";
var serverDomain="e";

var options1 = {
 //key: fs.readFileSync('/etc/ssl/private/reais.key'),
 //cert: fs.readFileSync('/etc/ssl/certs/reais.crt'),
 //key: fs.readFileSync('reais.key'),
 // cert: fs.readFileSync('reais.crt'),
 /*
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),
  ca: fs.readFileSync('node.crt'),
 */
 //requestCert: true,
 rejectUnauthorized: false
};
//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

//app.configure(function(){
  //app.use(express.bodyParser());
  //app.use(express.bodyParser( { keepExtensions: true, uploadDir: __dirname + '/photos' } ));
  app.use(allowCrossDomain);
  //app.use(app.router);
  //app.use(bodyParser());

  
    
  /*
  app.use(function(req, res, next) {
    var contentType = req.headers['content-type'] || ''
      , mime = contentType.split(';')[0];
  
    if (mime != 'text/plain') {
      return next();
    }
  
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
      data += chunk;
    });
    req.on('end', function() {
      req.rawBody = data;
      next();
    });
  });
  */
//});

//app.use(express.bodyParser());

/*
Download certs
*/
app.get('/cert',function(req, res){
	res.sendFile("certs/server.crt", { root : __dirname})
});
app.get('/',function(req, res){
	res.end("Welcome");
});
/*
Root responses
*/
app.get('/sharing',function(req, res){
	console.log("/sharing");
	var response={"currentVersion":"3.8"}
	res.json(response);
	//res.json(response);
});

app.post('/sharing/rest', function(req, res){
	console.log("/sharing/rest (post)");
	var response={"currentVersion":"3.8"}
	//res.json(response);
	res.json(response);
});

app.get('/sharing/rest', function(req, res){
	console.log("/sharing/rest");
	var response={"currentVersion":"3.8"}
	res.json(response);
	//res.json(response);
});

/*
authentication.  Uses phoney tokens
*/
app.post('/sharing/generateToken', function(req, res){
	console.log("/sharing/generateToken (post)");
	var response={"token":"hbKgXcKhu_t6oTuiMOxycWn_ELCZ5G5OEwMPkBzbiCrrQdClpi531MbGo0P_HsukvhoIP8uzecIwpD8zoCaZoy1POpEUDwtNXLf-K6n913cayKDVD6wsePmgzYSNoogp","expires":1940173783033,"ssl":false}
	res.json(response);
	
});
/*
app.post('/sharing/:rest/generateToken', function(req, res){
	//console.log("Logging in post");
	//console.log(req.query);
	//console.log(req.body);
	console.log("Post rest/generateToken");
	var response={"token":"hbKgXcKhu_t6oTuiMOxycWn_ELCZ5G5OEwMPkBzbiCrrQdClpi531MbGo0P_HsukvhoIP8uzecIwpD8zoCaZoy1POpEUDwtNXLf-K6n913cayKDVD6wsePmgzYSNoogp","expires":1440173783033,"ssl":false}
	//var response={"token":"NrCcZaQedpZJHxaqSvtwBS1ycDOd3XiDL46C-UsRzZummvdCNQrFzDh1roNmZLToDL27gEu8-E1Mx2p4_GG5qSJ4ISyL06Npizxtv0bzkkfGEwrGBQJ4q1W8kybo3H1_","expires":1940038262530,"ssl":false}
	res.json(response);
	
});
*/

app.post('/sharing/:rest/generateToken', function(req, res){
	console.log("/sharing/"+req.params.rest+"/generateToken")
	var response={"token":"hbKgXcKhu_t6oTuiMOxycWn_ELCZ5G5OEwMPkBzbiCrrQdClpi531MbGo0P_HsukvhoIP8uzecIwpD8zoCaZoy1POpEUDwtNXLf-K6n913cayKDVD6wsePmgzYSNoogp","expires":1940173783033,"ssl":false}
	res.json(response);
});

app.get('//sharing/oauth2/authorize', function(req, res){
	console.log("//sharing/oauth2/authorize");
	send(res,"oauth2.html");
});
app.get('/sharing/oauth2/authorize', function(req, res){
	console.log("/sharing/oauth2/authorize");
	res.redirect('/sharing/rest?f=json&culture=en-US&code=KIV31WkDhY6XIWXmWAc6U');
	//send(res,"oauth2.html");
});

app.get('/sharing/oauth2/approval', function(req, res){
	console.log("/sharing/oauth2/approval");
	var response={"token":"hbKgXcKhu_t6oTuiMOxycWn_ELCZ5G5OEwMPkBzbiCrrQdClpi531MbGo0P_HsukvhoIP8uzecIwpD8zoCaZoy1POpEUDwtNXLf-K6n913cayKDVD6wsePmgzYSNoogp","expires":1440173783033,"ssl":false}
	res.json(response);
});

app.get('/sharing/oauth2/signin', function(req, res){
	console.log("/sharing/oauth2/signin");
	send(res,"search.json");
});

app.post('/sharing/oauth2/token', function(req, res){
	console.log("/sharing/oauth2/token");
	var response={"access_token":"XMdOaajM4srQWx8nQ77KuOYGO8GupnCoYALvXEnTj0V_ZXmEzhrcboHLb7hGtGxZCYUGFt07HKOTnkNLah8LflMDoWmKGr4No2LBSpoNkhJqc9zPa2gR3vfZp5L3yXigqxYOBVjveiuarUo2z_nqQ401_JL-mCRsXq9NO1DYrLw.","expires_in":99800,"username":"gisuser","refresh_token":"51vzPXXNl7scWXsw7YXvhMp_eyw_iQzifDIN23jNSsQuejcrDtLmf3IN5_bK0P5Z9K9J5dNb2yBbhXqjm9KlGtv5uDjr98fsUAAmNxGqnz3x0tvl355ZiuUUqqArXkBY-o6KaDtlDEncusGVM8wClk0bRr1-HeZJcR7ph9KU9khoX6H-DcFEZ4sRdl9c16exIX5lGIitw_vTmuomlivsGIQDq9thskbuaaTHMtP1m3VVnhuRQbyiZTLySjHDR8OVllSPc2Fpt0M-F5cPl_3nQg.."}
	res.json(response);
});
app.post('/sharing/rest/tokens',function(req, res){
	console.log("/sharing/rest/tokens");
	var response={"token":"1.0"}
	res.json(response);
});
/*
openssl req -x509 -nodes -days 365 -newkey rsa:1024 \
    -keyout /etc/ssl/private/reais.key \
    -out /etc/ssl/certs/reais.crt
*/

/*
End authentication
*/

app.get('/sharing/:rest/accounts/self', function(req, res){
//send(res,"search.json");
console.log("/sharing/:rest/accounts/self");
send(res,"portals.self.json");

});

app.get('/sharing//accounts/self', function(req, res){
send(res,"account.self.json");
});

//no customization necesssary except for username
app.get('/sharing/rest/portals/self', function(req, res){
  console.log("/sharing/rest/portals/self");
  send(res,"portals.self.json");
  //send(res,"portals_self.json");
});

app.get('/sharing/rest/content/users/:user', function(req, res){
	console.log("/sharing/rest/content/users/"+req.params.user);
	var response={"username":req.params.user,"total":0,"start":1,"num":0,"nextStart":-1,"currentFolder":null,"items":[],"folders":[]}
	res.json(response);
});

app.get('/sharing/rest/content/items/:id', function(req, res){
	console.log("/sharing/rest/content/items/"+req.params.id);
	send(res,req.params.id+"/content.items.json");
});

app.get('/sharing/rest/content/items/:id/data', function(req, res){
	console.log("/sharing/rest/content/items/"+req.params.id+"/data");
	send(res,req.params.id+"/content.items.json");
});


app.get('/sharing/rest/search', function(req, res){
	console.log("/sharing/rest/search");
  if(req.query.q.indexOf("typekeywords")==-1)
      send(res,"community.groups.json");
  else
	    send(res,"search.json");
});

app.get('/sharing/rest/community/users/:user/notifications',function(req, res){
	console.log("/sharing/rest/community/users/"+req.params.user+"/notifications");
   var response={"notifications":[]}
   res.json(response);
});


app.get('/sharing/rest/community/groups',function(req, res){
	console.log("/sharing/rest/community/groups");
	send(res,"community.groups.json");
});

app.get('/sharing/rest/community/users/:user',function(req, res){
	console.log("/sharing/rest/community/users/"+req.params.user);
	send(res,"community.users.json");
});

app.get('/sharing/rest/community/users',function(req, res){
	console.log("/sharing/rest/community/users/");
	send(res,"community.users.json");
});

app.get('/sharing/rest/community/users/:user/info/:img',function(req, res){
	console.log("/sharing/rest/community/users/"+req.params.user+"/info/"+req.params.img);
	var path="photos/cat.jpg";
	var fs = require('fs');
  var file = fs.readFileSync(path, "utf8");
  res.end(file)
	
});
app.get('/sharing/rest/community/groups',function(req, res){
	console.log("/sharing/rest/community/groups");
	send(res,"community.groups.json");
});

app.get('/sharing/rest/content/items/:id/info/thumbnail/:img',function(req, res){
	console.log("/sharing/rest/content/items/"+req.params.id+"/info/thumbnail/"+req.params.img);
	send(res,"thumbnails/"+req.params.id+".png");
});

app.get('/sharing/rest/content/items/:id/info/thumbnail/ago_downloaded.png',function(req, res){
	console.log("/sharing/rest/content/items/"+req.params.id+"/info/thumbnail/ago_downloaded.png");
	var response={"currentVersion":"3.8"}
	res.json(response);
});

app.get('/sharing/rest/info',function(req, res){
	console.log("/sharing/rest/info");
	var response={"owningSystemUrl":"http://"+server,"authInfo":{"tokenServicesUrl":"https://"+server+"/sharing/rest/generateToken","isTokenBasedSecurity":true}}
	res.json(response);
});

app.get('/arcgis/rest/info', function(req, res){
	console.log("/arcgis/rest/info");
	var response={"currentVersion":10.3,"fullVersion":"10.3",	"authInfo":{"isTokenBasedSecurity":false}}
  res.json(response);
});

/*
Database functions
*/
/*
POST http://services5.arcgis.com/xxxx/ArcGIS/rest/services/xxxxx/FeatureServer/unRegisterReplica HTTP/1.1
Content-Length: 59
Content-Type: application/x-www-form-urlencoded
Host: services5.arcgis.com
Connection: Keep-Alive
User-Agent: Collector-Android-10.3.3/ArcGIS.Android-10.2.5/4.4.4/BARNES-&-NOBLE-BN-NOOKHD+
Accept-Encoding: gzip

f=json&replicaID=
*/
app.get('/arcgis/rest/services/:name/FeatureServer/jobs/replicas', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/job/replica");
  var result= {"replicaName":"MyReplica","replicaID":"58808194-921a-4f9f-ac97-5ffd403368a9","submissionTime":1441201696150,"lastUpdatedTime":1441201705967,"status":"Completed",
  	"resultUrl":"http://"+server+"/arcgis/rest/services/"+req.params.name+"/FeatureServer/replicas/"}	
	res.json(result);
});

app.post('/arcgis/rest/services/:name/FeatureServer/unRegisterReplica', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/unRegisterReplica");
	var response={"success":true}
  res.json(response);
});

app.get('/arcgis/rest/services/:name/FeatureServer/replicas', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/replicas");
	var fileName = replica_path+"/"+req.params.name+".geodatabase";
  res.sendFile(fileName); //, { root : __dirname})
});
app.post('/arcgis/rest/services/:name/FeatureServer/createReplica', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/createReplica (post)");
	var response={"statusUrl":"http://"+server+"/arcgis/rest/services/"+req.params.name+"/FeatureServer/replicas"}
  res.json(response);
});

app.post('/arcgis/rest/services/:name/FeatureServer/synchronizeReplica', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/synchronizeReplica");
	var response={"status": "Completed","transportType": "esriTransportTypeUrl"}
  /*
  "responseType": <esriReplicaResponseTypeEdits | esriReplicaResponseTypeEditsAndData| esriReplicaResponseTypeNoEdits>,
  "resultUrl": "<url>", //path to JSON (dataFormat=JSON) or a SQLite geodatabase (dataFormat=sqlite)
  "submissionTime": "<T1>",  //Time since epoch in milliseconds
  "lastUpdatedTime": "<T2>", //Time since epoch in milliseconds
  "status": "<Pending | InProgress | Completed | Failed | ImportChanges | ExportChanges | ExportingData | ExportingSnapshot 
	       | ExportAttachments | ImportAttachments | ProvisioningReplica | UnRegisteringReplica | CompletedWithErrors>"
	*/
  res.json(response);

});
app.get('/arcgis/rest/services/:name/FeatureServer/jobs', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/jobs");
  var result= {"replicaName":"MyReplica","replicaID":"58808194-921a-4f9f-ac97-5ffd403368a9","submissionTime":1441201696150,"lastUpdatedTime":1441201705967,"status":"Completed",
  	"resultUrl":"http://"+server+"/arcgis/rest/services/"+req.params.name+"/FeatureServer/replicas/"}	
	res.json(result);
});


app.get('/arcgis/rest/services', function(req, res){
	console.log("/arcgis/rest/services");
	send(res,"FeatureServer.json");
});

app.post('/arcgis/rest/services', function(req, res){
	console.log("/arcgis/rest/services (post)");
  res.send('<html><head><title>Object moved</title></head><body>'+
'<h2>Object moved to <a href="/arcgis/rest/services">here</a>.</h2>'+
'</body></html>');
});

app.get('/arcgis/services', function(req, res){
	console.log("/arcgis/services");
	send(res,"FeatureServer.json");
});

app.post('/llarcgis/services', function(req, res){
	console.log("/arcgis/services (post)");
	send(res,"FeatureServer.json");
});

app.post('/arcgis/services', function(req, res){
	console.log("/arcgis/services (post)");
  res.send('<html><head><title>Object moved</title></head><body>'+
'<h2>Object moved to <a href="/arcgis/rest/services">here</a>.</h2>'+
'</body></html>');
});

app.get('/arcgis/rest/services//services/:name/FeatureServer/info/metadata', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/info/metadata");
	res.end("Metadata stuff");
});

app.get('/arcgis/rest/services//:name', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name);
	
	send(res, req.params.name+"/"+req.params.name+".json",req.query.callback);
});

app.get('/arcgis/rest/services/:name', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name);
	
	send(res, req.params.name+"/FeatureServer.json",req.query.callback);
});

app.get('/arcgis/rest/services/:name/FeatureServer', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer");
	send(res, req.params.name+"/FeatureServer.json",req.query.callback);
});
app.post('/arcgis/rest/services/:name/FeatureServer', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer  (post)");
	send(res, req.params.name+"/FeatureServer.json");
});

app.get('/arcgis/rest/services/:name/FeatureServer/:id', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/"+req.params.id);
	send(res,req.params.name+"/FeatureServer."+req.params.id+".json",req.query.callback);
});

app.post('/arcgis/rest/services/:name/FeatureServer/:id', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/"+req.params.id+"  (post)");
	send(res,req.params.name+"/FeatureServer."+req.params.id+".json",req.query.callback);
});


app.get('/arcgis/rest/services/:name/FeatureServer/:id/query', function(req, res){
	//if(req.query.outFields=='OBJECTID'){
	if(req.query.returnGeometry=='false' && req.query.outFields=='OBJECTID'){
			console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/"+req.params.id+"/objectid");
	     send(res,req.params.name+"/FeatureServer."+req.params.id+".objectid.json",req.query.callback);
	}
	else{
		  console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/"+req.params.id+"/query");
	    send(res,req.params.name+"/FeatureServer."+req.params.id+".query.json",req.query.callback);
	}
	//send(res,req.params.id + "query.json");

});
app.post('/arcgis/rest/services/:name/FeatureServer/:id/query', function(req, res){
	if(req.query.returnGeometry=='false' && req.query.outFields=='OBJECTID'){
			console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/"+req.params.id+"/objectid (post)");
	     send(res,req.params.name+"/FeatureServer."+req.params.id+".objectid.json",req.query.callback);
	}
	else{
		  console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/"+req.params.id+"/query (post)");
	    send(res,req.params.name+"/FeatureServer."+req.params.id+".query.json",req.query.callback);
	}
});

/*
Attachments
*/
app.get('/arcgis/rest/services/:name/FeatureServer/:id/:row/attachments', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/"+req.params.id+"/attachments");
	//{"attachmentInfos":[{"id":5,"globalId":"xxxx","parentID":"47","name":"cat.jpg","contentType":"image/jpeg","size":5091}]}
	var response={"attachmentInfos":[]}
  res.json(response);
});

app.get('/arcgis/rest/services/:name/FeatureServer/:id/:row/attachments/:img', function(req, res){
	console.log("/arcgis/rest/services/FeatureServer/attachments/img");
	var path="photos/cat.jpg";
	var fs = require('fs');
  var file = fs.readFileSync(path, "utf8");
  res.end(file)
});

app.post('/arcgis/rest/services/:name/FeatureServer/:id/:row/addAttachment', function(req, res){
	console.log("/arcgis/rest/services/FeatureServer/addAttachment");
  // TODO: move and rename the file using req.files.path & .name)
  //res.send(console.dir(req.files));  // DEBUG: display available fields
  var uploadPath = data_path+"/" + req.params.name + "/attachments";
  if(!fs.existsSync(uploadPath)){
      fs.mkdir(uploadPath,function(e){
          if(!e || (e && e.code === 'EEXIST')){
              //do something with contents
          } else {
              //debug
              console.log(e);
          }
      });  	
  }
  fs.readFile(req.files.attachment.path, function (err, data) {
    // ...
    var newPath = uploadPath + "/" + req.params.id + ".jpg";
    fs.writeFile(newPath, data, function (err) {
      //res.redirect("back");
	    var response={"addAttachmentResult":{"objectId":req.params.row,"globalId":null,"success":true}}
      res.json(response);
    });
  });
    
});
	
app.post('/arcgis/rest/services/:name/FeatureServer/:id/:row/deleteAttachments', function(req, res){
	console.log("/arcgis/rest/services/FeatureServer/deleteAttachments");
	var id = req.query.attachmentIds;
	var response={"deleteAttachmentResults":[{"objectId":id,"globalId":null,"success":true}]}
  res.json(response);

});

app.post('/arcgis/rest/services/:name/FeatureServer/:id/applyEdits', function(req, res){
	console.log("/arcgis/rest/services/FeatureServer/applyEdits");
  var updates = JSON.parse(req.body.updates);//JSON.parse(req.query.updates);

	var fs = require('fs');
	var path=data_path+"/"+req.params.name +"/FeatureServer."+req.params.id + ".query.json";
  var file = fs.readFileSync(path, "utf8");
  var json=JSON.parse(file)
  var results=[]
  var fields=[]
  var values=[]
  
  for(var u=0;u<updates.length;u++)
  {
	  for(var i=0;i<json.features.length;i++)
	  {
	  	//console.log(json.features[i]['attributes']['OBJECTID'] + ":  " + updates[u].attributes['OBJECTID']);
	  	if(json.features[i]['attributes']['OBJECTID']==updates[u].attributes['OBJECTID'])
	  	{
	  		//json.features.[i]['attributes']=updates;
	  		for(var j in updates[u].attributes)
	  		{
	  			for(var k in json.features[i]['attributes'])
	  			{
	  				if(j==k)
	  				{
	  					if(json.features[i]['attributes'][k] != updates[u].attributes[j])
	  					{
	  					    console.log("Updating record: " + updates[u].attributes['OBJECTID'] + " " + k + "   values: " + json.features[i]['attributes'][k]+ " to " + updates[u].attributes[j] );
	  					    json.features[i]['attributes'][k]=updates[u].attributes[j]
  	              fields.push(k+"=?")
  	              values.push(updates[0].attributes[j])
	  					    break;
	  				  }
	  				}
	  			}
	  		}
	  		results.push({"objectId":updates[u].attributes['OBJECTID'],"globalId":null,"success":true})
	  		break;
	  	}
	  }
  }
  //search for id and update all fields
  fs.writeFileSync(path, JSON.stringify(json), "utf8");

  //now update the replica database

  values.push(parseInt(req.params.id));

  var replicaDb = replica_path + "/"+req.params.name+".geodatabase";
  console.log("sqlite: " + replicaDb);
  var db = new sqlite3.Database(replicaDb);
  //create update statement from json
  console.log("UPDATE " + req.params.name + " SET "+fields.join(",")+" WHERE OBJECTID = ?");
  console.log( values )
  
  db.run("UPDATE " + req.params.name + " SET "+fields.join(",")+" WHERE OBJECTID = ?", values);
 //update json file with updates
  var response={"addResults":[],"updateResults":results,"deleteResults":[]}
  res.json(response);
});


/*
End database functions
*/
function send(res,name,callback){
	//console.log("Sending " + name);
	if(callback){
   	 //res.send(callback+"(");
	   var fs = require('fs');
	   var path=data_path+"/"+name;
     var file = fs.readFileSync(path, "utf8");
     res.end(callback+"("+file + ");")
	   //if(callback)res.end(");");
  }
	else{
		console.log(data_path+"/" + name);
		res.sendFile(data_path+"/" + name); //, { root : __dirname})
	}
	//4.0 res.sendFile("json/" + name , { root : __dirname})
	/*
	var fs = require('fs');
	var path="json/"+name;
  var file = fs.readFileSync(path, "utf8");
  res.end(file)
  */
}

//http.createServer(app).listen(3000);
// Create an HTTPS service identical to the HTTP service.
//https.createServer(options, app).listen(443);	
// Create an HTTP service.
http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443);
