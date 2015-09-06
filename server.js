var express = require('express');
var bodyParser  = require('body-parser');
var app = express();
var https = require('https');
var http = require('http');

var fs = require('fs');
var data_path="c:\\node\\services";
var replica_path="c:\\node\\replicas";
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
var server="";
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
	//console.log("Logging in post");
	//console.log(req.query);
	//console.log(req.body);
	console.log("/sharing/rest (post)");
	var response={"currentVersion":"3.8"}
	//res.json(response);
	res.json(response);
});

app.get('/sharing/rest', function(req, res){
	//console.log("Logging in post");
	//console.log(req.query);
	//console.log(req.body);
	console.log("/sharing/rest");
	var response={"currentVersion":"3.8"}
	res.json(response);
	//res.json(response);
});

/*
authentication.  Uses phoney tokens
*/
app.post('/sharing/generateToken', function(req, res){
	//console.log("Logging in post");
	//console.log(req.query);
	//console.log(req.body);
	console.log("/sharing/generateToken (post)");
	var response={"token":"hbKgXcKhu_t6oTuiMOxycWn_ELCZ5G5OEwMPkBzbiCrrQdClpi531MbGo0P_HsukvhoIP8uzecIwpD8zoCaZoy1POpEUDwtNXLf-K6n913cayKDVD6wsePmgzYSNoogp","expires":1940173783033,"ssl":false}
	//var response={"token":"NrCcZaQedpZJHxaqSvtwBS1ycDOd3XiDL46C-UsRzZummvdCNQrFzDh1roNmZLToDL27gEu8-E1Mx2p4_GG5qSJ4ISyL06Npizxtv0bzkkfGEwrGBQJ4q1W8kybo3H1_","expires":1940038262530,"ssl":false}
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
//https://www.arcgis.com/sharing/rest/generateToken?f=json&clientid=ref.ArcGIS_AndroidSDK&_servicesUrl=1&username=hpluser&referer=ArcGIS_AndroidSDK&password=sah12469&request=gettoken
app.post('/sharing/:rest/generateToken', function(req, res){
	//console.log("Logging in post");
	//console.log(req.query);
	//console.log(req.body);
	console.log("/sharing/"+req.params.rest+"/generateToken")
	//var response={"token":"NrCcZaQedpZJHxaqSvtwBS1ycDOd3XiDL46C-UsRzZummvdCNQrFzDh1roNmZLToDL27gEu8-E1Mx2p4_GG5qSJ4ISyL06Npizxtv0bzkkfGEwrGBQJ4q1W8kybo3H1_","expires":1940038262530,"ssl":false}
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

//https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=arcgisonline&redirect_uri=https://reais.mapye.com&response_type=token&display=iframe&parent=https://www.arcgis.com&expiration=20160&locale=en-us
app.get('/sharing/oauth2/approval', function(req, res){
	console.log("/sharing/oauth2/approval");
	//var response={"access_token":"XMdOaajM4srQWx8nQ77KuOYGO8GupnCoYALvXEnTj0V_ZXmEzhrcboHLb7hGtGxZCYUGFt07HKOTnkNLah8LflMDoWmKGr4No2LBSpoNkhJqc9zPa2gR3vfZp5L3yXigqxYOBVjveiuarUo2z_nqQ401_JL-mCRsXq9NO1DYrLw.","expires_in":99800,"username":"hpluser","refresh_token":"51vzPXXNl7scWXsw7YXvhMp_eyw_iQzifDIN23jNSsQuejcrDtLmf3IN5_bK0P5Z9K9J5dNb2yBbhXqjm9KlGtv5uDjr98fsUAAmNxGqnz3x0tvl355ZiuUUqqArXkBY-o6KaDtlDEncusGVM8wClk0bRr1-HeZJcR7ph9KU9khoX6H-DcFEZ4sRdl9c16exIX5lGIitw_vTmuomlivsGIQDq9thskbuaaTHMtP1m3VVnhuRQbyiZTLySjHDR8OVllSPc2Fpt0M-F5cPl_3nQg.."}
	var response={"token":"hbKgXcKhu_t6oTuiMOxycWn_ELCZ5G5OEwMPkBzbiCrrQdClpi531MbGo0P_HsukvhoIP8uzecIwpD8zoCaZoy1POpEUDwtNXLf-K6n913cayKDVD6wsePmgzYSNoogp","expires":1440173783033,"ssl":false}
	res.json(response);
});

app.get('/sharing/oauth2/signin', function(req, res){
	console.log("/sharing/oauth2/signin");
	send(res,"search.json");
	/*
	var response={"query":"+type:\"Web Map\" -type:\"Web Mapping Application\" AND (typekeywords:Collector AND owner:hplgis)","total":1,"start":1,"num":100,"nextStart":-1,
		"results":[
		  {"id":"48fcb38825d44d0b8cc98e2553438d8c","owner":"hplgis","created":1440091045000,"modified":1440091079000,"guid":null,"name":null,"title":"hpl","type":"Web Map",
			"typeKeywords":["ArcGIS Online","Collector","Data Editing","Explorer Web Map","Map","Offline","Online Map","Web Map"],"description":null,"tags":["hpl"],"snippet":null,"thumbnail":"thumbnail/ago_downloaded.png",
			"documentation":null,"extent":[[-113.5559,34.1744],[-105.4425,38.0254]],"spatialReference":null,"accessInformation":null,"licenseInfo":null,"culture":"en-us","properties":null,"url":null,"access":"private","size":-1,
			"appCategories":[],"industries":[],"languages":[],"largeThumbnail":null,"banner":null,"screenshots":[],"listed":false,"numComments":0,"numRatings":0,"avgRating":0,"numViews":0
			}
		]}
	res.json(response);
	*/
	//
	//printMapDoc(res);
});

app.post('/sharing/oauth2/token', function(req, res){
	console.log("/sharing/oauth2/token");
	var response={"access_token":"XMdOaajM4srQWx8nQ77KuOYGO8GupnCoYALvXEnTj0V_ZXmEzhrcboHLb7hGtGxZCYUGFt07HKOTnkNLah8LflMDoWmKGr4No2LBSpoNkhJqc9zPa2gR3vfZp5L3yXigqxYOBVjveiuarUo2z_nqQ401_JL-mCRsXq9NO1DYrLw.","expires_in":99800,"username":"hpluser","refresh_token":"51vzPXXNl7scWXsw7YXvhMp_eyw_iQzifDIN23jNSsQuejcrDtLmf3IN5_bK0P5Z9K9J5dNb2yBbhXqjm9KlGtv5uDjr98fsUAAmNxGqnz3x0tvl355ZiuUUqqArXkBY-o6KaDtlDEncusGVM8wClk0bRr1-HeZJcR7ph9KU9khoX6H-DcFEZ4sRdl9c16exIX5lGIitw_vTmuomlivsGIQDq9thskbuaaTHMtP1m3VVnhuRQbyiZTLySjHDR8OVllSPc2Fpt0M-F5cPl_3nQg.."}
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
//send(res,"search.json");
send(res,"account.self.json");
//console.log("Sending  accounts/self");
/*
var response={"access":"public","allSSL":false,"availableCredits":199.99658,"basemapGalleryGroupQuery":"title:\"United States Basemaps\" AND owner:Esri_cy_US","canListApps":false,"canListData":false,"canListPreProvisionedItems":false,"canProvisionDirectPurchase":false,"canSearchPublic":true,"canShareBingPublic":false,"canSharePublic":true,"canSignInArcGIS":true,"canSignInIDP":false,"colorSetsGroupQuery":"title:\"Esri Colors\" AND owner:esri_en","commentsEnabled":true,"created":1440075018000,"culture":"","customBaseUrl":"mapye.com","databaseQuota":-1,"databaseUsage":-1,"defaultBasemap":{"baseMapLayers":[{"url":"http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer","resourceInfo":{"currentVersion":10.3,"serviceDescription":"This map is designed to be used as a basemap by GIS professionals and as a reference map by anyone. The map includes administrative boundaries, cities, water features, physiographic features, parks, landmarks, highways, roads, railways, and airports overlaid on land cover and shaded relief imagery for added context. The map provides coverage for the world down to a scale of ~1:72k. Coverage is provided down to ~1:4k for the following areas: Australia and New Zealand; India; Europe; Canada; Mexico; the continental United States and Hawaii; South America and Central America; Africa; and most of the Middle East. Coverage down to ~1:1k and ~1:2k is available in select urban areas. This basemap was compiled from a variety of best available sources from several data providers, including the U.S. Geological Survey (USGS), U.S. Environmental Protection Agency (EPA), U.S. National Park Service (NPS), Food and Agriculture Organization of the United Nations (FAO), Department of Natural Resources Canada (NRCAN), GeoBase, Agriculture and Agri-Food Canada, DeLorme, HERE, Esri, OpenStreetMap contributors, and the GIS User Community. For more information on this map, including the terms of use, visit us <a href='' target=''>online<\/a>.","mapName":"Layers","description":"This map is designed to be used as a basemap by GIS professionals and as a reference map by anyone. The map includes administrative boundaries, cities, water features, physiographic features, parks, landmarks, highways, roads, railways, and airports overlaid on land cover and shaded relief imagery for added context. The map provides coverage for the world down to a scale of ~1:72k. Coverage is provided down to ~1:4k for the following areas: Australia and New Zealand; India; Europe; Canada; Mexico; the continental United States and Hawaii; South America and Central America; Africa; and most of the Middle East. Coverage down to ~1:1k and ~1:2k is available in select urban areas. This basemap was compiled from a variety of best available sources from several data providers, including the U.S. Geological Survey (USGS), U.S. Environmental Protection Agency (EPA), U.S. National Park Service (NPS), Food and Agriculture Organization of the United Nations (FAO), Department of Natural Resources Canada (NRCAN), GeoBase, Agriculture and Agri-Food Canada, DeLorme, HERE, Esri, OpenStreetMap contributors, and the GIS User Community. For more information on this map, including our terms of use, visit us online at http://goto.arcgisonline.com/maps/World_Topo_Map","copyrightText":"Sources: Esri, HERE, DeLorme, TomTom, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), swisstopo, MapmyIndia, © OpenStreetMap contributors, and the GIS User Community","supportsDynamicLayers":false,"layers":[{"id":0,"name":"Citations","parentLayerId":-1,"defaultVisibility":false,"subLayerIds":null,"minScale":0,"maxScale":0}],"tables":[],"spatialReference":{"wkid":102100,"latestWkid":3857},"singleFusedMapCache":true,"tileInfo":{"rows":256,"cols":256,"dpi":96,"format":"JPEG","compressionQuality":90,"origin":{"x":-2.0037508342787E7,"y":2.0037508342787E7},"spatialReference":{"wkid":102100,"latestWkid":3857},"lods":[{"level":0,"resolution":156543.03392800014,"scale":5.91657527591555E8},{"level":1,"resolution":78271.51696399994,"scale":2.95828763795777E8},{"level":2,"resolution":39135.75848200009,"scale":1.47914381897889E8},{"level":3,"resolution":19567.87924099992,"scale":7.3957190948944E7},{"level":4,"resolution":9783.93962049996,"scale":3.6978595474472E7},{"level":5,"resolution":4891.96981024998,"scale":1.8489297737236E7},{"level":6,"resolution":2445.98490512499,"scale":9244648.868618},{"level":7,"resolution":1222.992452562495,"scale":4622324.434309},{"level":8,"resolution":611.4962262813797,"scale":2311162.217155},{"level":9,"resolution":305.74811314055756,"scale":1155581.108577},{"level":10,"resolution":152.87405657041106,"scale":577790.554289},{"level":11,"resolution":76.43702828507324,"scale":288895.277144},{"level":12,"resolution":38.21851414253662,"scale":144447.638572},{"level":13,"resolution":19.10925707126831,"scale":72223.819286},{"level":14,"resolution":9.554628535634155,"scale":36111.909643},{"level":15,"resolution":4.77731426794937,"scale":18055.954822},{"level":16,"resolution":2.388657133974685,"scale":9027.977411},{"level":17,"resolution":1.1943285668550503,"scale":4513.988705},{"level":18,"resolution":0.5971642835598172,"scale":2256.994353},{"level":19,"resolution":0.29858214164761665,"scale":1128.497176}]},"initialExtent":{"xmin":-1.9003965069419548E7,"ymin":-236074.10024122056,"xmax":1.9003965069419548E7,"ymax":1.458937939490844E7,"spatialReference":{"wkid":102100,"latestWkid":3857}},"fullExtent":{"xmin":-2.0037507067161843E7,"ymin":-1.9971868880408604E7,"xmax":2.0037507067161843E7,"ymax":1.997186888040863E7,"spatialReference":{"wkid":102100,"latestWkid":3857}},"minScale":5.91657527591555E8,"maxScale":1128.497176,"units":"esriMeters","supportedImageFormatTypes":"PNG32,PNG24,PNG,JPG,DIB,TIFF,EMF,PS,PDF,GIF,SVG,SVGZ,BMP","documentInfo":{"Title":"World Topographic Map","Author":"Esri","Comments":"","Subject":"topographic, topography, administrative boundaries, cities, water features, physiographic features, parks, landmarks, highways, roads, railways, airports, land cover, shaded relief imagery","Category":"imageryBaseMapsEarthCover (Imagery, basemaps, and land cover)","AntialiasingMode":"None","TextAntialiasingMode":"Force","Keywords":"World,Global,Europe,North America,South America,Southern Africa,Australia,New Zealand,India"},"capabilities":"Map,Tilemap,Query,Data","supportedQueryFormats":"JSON, AMF","exportTilesAllowed":false,"maxRecordCount":100,"maxImageHeight":4096,"maxImageWidth":4096,"supportedExtensions":"KmlServer"}}],"title":"Topographic"},"defaultExtent":{"type":"extent","xmin":-1.4999999999999491E7,"ymin":2699999.9999999036,"xmax":-6199999.999999791,"ymax":6499999.999999701,"spatialReference":{"wkid":102100}},"description":"<br>","featuredGroups":[{"title":"National Maps for USA","owner":"Federal_User_Community"},{"title":"Esri Maps and Data","owner":"esri"},{"title":"Community Basemaps","owner":"esri"},{"title":"Landsat Community","owner":"esri"},{"title":"Web Application Templates","owner":"esri_en"},{"title":"ArcGIS for Local Government","owner":"ArcGISTeamLocalGov"}],"featuredGroupsId":"","featuredItemsGroupQuery":"","galleryTemplatesGroupQuery":"title:\"Gallery Templates\" AND owner:esri_en","helpBase":"http://doc.arcgis.com/en/arcgis-online/","helpMap":{"v":"1.0","m":{"120000503":"administer/view-status.htm","120000905":"administer/configure-open-data.htm","120000897":"administer/configure-roles.htm","120000468":"create-maps/configure-pop-ups.htm","120000473":"create-maps/configure-time.htm","120000470":"create-maps/change-symbols.htm","120000464":"create-maps/make-your-first-map.htm","120000467":"create-maps/add-layers.htm#FILE","120000902":"share-maps/publish-features.htm","120000900":"share-maps/review-addresses.htm","120000923":"share-maps/share-maps.htm","120000455":"share-maps/share-items.htm","120000454":"share-maps/add-items.htm","120000456":"share-maps/supported-items.htm","120000899":"use-maps/take-maps-offline.htm","120000516":"reference/troubleshoot.htm#WEB_STORAGE","120000815":"reference/about-cityengine-web-viewer.htm","120000814":"reference/faq.htm","120000817":"reference/troubleshoot-cityengine-web-viewer.htm","120000816":"reference/use-cityengine-web-viewer.htm","120000461":"reference/videos.htm","120000463":"reference/show-desktop-content.htm","120000465":"reference/search.htm","120000466":"reference/troubleshoot-account.htm","120000469":"reference/shapefiles.htm","120000592":"reference/manage-trial.htm","120000471":"reference/kml.htm","120000597":"reference/arcgis-server-services.htm","120000966":"reference/scene-viewer-requirements.htm","120000978":"reference/multifactor.htm","120000980":"reference/profile.htm#MFA","120000969":"share-maps/add-items.htm#REG_APP","120001028":"share-maps/metadata.htm","120001031":"reference/travel-modes.htm","120000460":"index.html"}},"helperServices":{"asyncClosestFacility":{"url":"https://logistics.arcgis.com/arcgis/rest/services/World/ClosestFacility/GPServer/FindClosestFacilities","defaultTravelMode":"FEgifRtFndKNcJMJ"},"asyncLocationAllocation":{"url":"https://logistics.arcgis.com/arcgis/rest/services/World/LocationAllocation/GPServer","defaultTravelMode":"FEgifRtFndKNcJMJ"},"asyncRoute":{"url":"https://logistics.arcgis.com/arcgis/rest/services/World/Route/GPServer","defaultTravelMode":"FEgifRtFndKNcJMJ"},"asyncServiceArea":{"url":"https://logistics.arcgis.com/arcgis/rest/services/World/ServiceAreas/GPServer/GenerateServiceAreas","defaultTravelMode":"FEgifRtFndKNcJMJ"},"asyncVRP":{"url":"https://logistics.arcgis.com/arcgis/rest/services/World/VehicleRoutingProblem/GPServer/SolveVehicleRoutingProblem","defaultTravelMode":"FEgifRtFndKNcJMJ"},"closestFacility":{"url":"https://route.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World","defaultTravelMode":"FEgifRtFndKNcJMJ"},"defaultElevationLayers":[{"url":"https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer","id":"globalElevation","layerType":"ArcGISTiledElevationServiceLayer"}],"elevation":{"url":"https://elevation.arcgis.com/arcgis/rest/services/Tools/Elevation/GPServer"},"elevationSync":{"url":"https://elevation.arcgis.com/arcgis/rest/services/Tools/ElevationSync/GPServer"},"geocode":[{"url":"https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer","northLat":"Ymax","southLat":"Ymin","eastLon":"Xmax","westLon":"Xmin","name":"Esri World Geocoder","suggest":true}],"geometry":{"url":"https://utility.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer"},"hydrology":{"url":"https://hydro.arcgis.com/arcgis/rest/services/Tools/Hydrology/GPServer"},"printTask":{"url":"https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"},"route":{"url":"https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World","defaultTravelMode":"FEgifRtFndKNcJMJ"},"routingUtilities":{"url":"https://logistics.arcgis.com/arcgis/rest/services/World/Utilities/GPServer"},"serviceArea":{"url":"https://route.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World","defaultTravelMode":"FEgifRtFndKNcJMJ"},"syncVRP":{"url":"https://logistics.arcgis.com/arcgis/rest/services/World/VehicleRoutingProblemSync/GPServer/EditVehicleRoutingProblem","defaultTravelMode":"FEgifRtFndKNcJMJ"},"traffic":{"url":"https://traffic.arcgis.com/arcgis/rest/services/World/Traffic/MapServer"},"analysis":{"url":"https://analysis5.arcgis.com/arcgis/rest/services/tasks/GPServer"},"geoenrichment":{"url":"https://geoenrich.arcgis.com/arcgis/rest/services/World/GeoenrichmentServer"}},"homePageFeaturedContent":"","homePageFeaturedContentCount":12,"id":"KOH6W4WICH5gzytg","isPortal":true,"layerTemplatesGroupQuery":"title:\"Esri Layer Templates\" AND owner:esri_en","livingAtlasGroupQuery":"(title:\"Featured Maps And Apps\" AND owner:esri) OR (tags:\"gallery\" AND owner:Esri_cy_US)","maxTokenExpirationMinutes":9999999,"metadataEditable":false,"metadataFormats":["iso19139-3.2"],"modified":1440075018000,"name":"steve HPL GIS","portalHostname":"mapye.com","portalMode":"multitenant","portalName":"ArcGIS Online","portalProperties":{"links":{}},"portalThumbnail":null,"region":"US","rotatorPanels":[{"id":"banner-2","innerHTML":"<img src='images/banner-2.jpg' style='-webkit-border-radius:0 0 10px 10px; -moz-border-radius:0 0 10px 10px; -o-border-radius:0 0 10px 10px; border-radius:0 0 10px 10px; margin-top:0; width:960px; height:180px;'/><div style='position:absolute; bottom:80px; left:80px; max-height:65px; width:660px; margin:0;'><span style='position:absolute; bottom:0; margin-bottom:0; line-height:normal; font-family:HelveticaNeue,Verdana; font-weight:600; font-size:32px; color:#369;'>HPL GIS<\/span><\/div>"}],"showHomePageDescription":false,"staticImagesUrl":"http://static.arcgis.com/images","storageQuota":2199023255552,"storageUsage":4740642,"stylesGroupQuery":"title:\"Esri Styles\" AND owner:esri_en","subscriptionInfo":{"id":"3028764663","type":"Trial","state":"active","expDate":1945410799000,"maxUsers":5,"availableCredits":199.99658},"supportsHostedServices":true,"symbolSetsGroupQuery":"title:\"Esri Symbols\" AND owner:esri_en","templatesGroupQuery":"title:\"Web Application Templates\" AND owner:esri_en","thumbnail":null,"units":"english","urlKey":"","useStandardizedQuery":true,"ipCntryCode":"US","httpPort":80,"httpsPort":443,"supportsOAuth":true,"mfaAdmins":[],"mfaEnabled":false,"user":{"username":"hplgis","fullName":"joe smoe","firstName":"joe","lastName":"smoe","preferredView":null,"description":null,"email":"gefromomop@thrma.com","userType":"both","idpUsername":null,"favGroupId":"3f0777c4ab484e498e96ad25066f8e86","lastLogin":1440096274000,"mfaEnabled":false,"access":"org","storageUsage":4740642,"storageQuota":2199023255552,"orgId":"KOH6W4WICH5gzytg","role":"org_admin","privileges":["features:user:edit","features:user:fullEdit","marketplace:admin:manage","marketplace:admin:purchase","marketplace:admin:startTrial","opendata:user:designateGroup","opendata:user:openDataAdmin","portal:admin:assignToGroups","portal:admin:changeUserRoles","portal:admin:deleteGroups","portal:admin:deleteItems","portal:admin:deleteUsers","portal:admin:disableUsers","portal:admin:inviteUsers","portal:admin:manageEnterpriseGroups","portal:admin:manageLicenses","portal:admin:reassignGroups","portal:admin:reassignItems","portal:admin:reassignUsers","portal:admin:updateGroups","portal:admin:updateItems","portal:admin:updateUsers","portal:admin:viewGroups","portal:admin:viewItems","portal:admin:viewUsers","portal:publisher:publishFeatures","portal:publisher:publishScenes","portal:publisher:publishTiles","portal:user:createGroup","portal:user:createItem","portal:user:joinGroup","portal:user:joinNonOrgGroup","portal:user:shareGroupToOrg","portal:user:shareGroupToPublic","portal:user:shareToGroup","portal:user:shareToOrg","portal:user:shareToPublic","premium:user:demographics","premium:user:elevation","premium:user:geocode","premium:user:geoenrichment","premium:user:networkanalysis","premium:user:spatialanalysis"],"disabled":false,"tags":[],"culture":null,"region":"US","units":"english","thumbnail":null,"created":1440075016000,"modified":1440075018000,"provider":"arcgis"},"appInfo":{"appId":"arcgiscollectorandroid","itemId":"5c697383819a4794b1d54b59baff878a","appOwner":"esri_apps","orgId":"P3ePLMYs2RVChkJx","appTitle":"Collector for ArcGIS (Android)","privileges":["premium:user:demographics","premium:user:elevation","premium:user:geocode","premium:user:geoenrichment","premium:user:networkanalysis"]}}
  res.json(response);
*/  
//send(res,"portals_self.json");
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
	//var response=getContentItem(req.params.id);
  //res.json(response);
	//send(res,"content_items.json")
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

/*
app.get('/sharing//community/users/:user',function(req, res){
	console.log("/sharing/community/users/"+req.params.user);
	//var response={"username":"reais","fullName":"joe smoe","firstName":"joe","lastName":"smoe","preferredView":null,"description":null,"email":"gefromomop@thrma.com","userType":"both","idpUsername":null,"favGroupId":"3f0777c4ab484e498e96ad25066f8e86","lastLogin":1440096274000,"mfaEnabled":false,"access":"org","storageUsage":4740642,"storageQuota":2199023255552,"orgId":"KOH6W4WICH5gzytg","role":"org_admin","privileges":["features:user:edit","features:user:fullEdit","marketplace:admin:manage","marketplace:admin:purchase","marketplace:admin:startTrial","opendata:user:designateGroup","opendata:user:openDataAdmin","portal:admin:assignToGroups","portal:admin:changeUserRoles","portal:admin:deleteGroups","portal:admin:deleteItems","portal:admin:deleteUsers","portal:admin:disableUsers","portal:admin:inviteUsers","portal:admin:manageEnterpriseGroups","portal:admin:manageLicenses","portal:admin:reassignGroups","portal:admin:reassignItems","portal:admin:reassignUsers","portal:admin:updateGroups","portal:admin:updateItems","portal:admin:updateUsers","portal:admin:viewGroups","portal:admin:viewItems","portal:admin:viewUsers","portal:publisher:publishFeatures","portal:publisher:publishScenes","portal:publisher:publishTiles","portal:user:createGroup","portal:user:createItem","portal:user:joinGroup","portal:user:joinNonOrgGroup","portal:user:shareGroupToOrg","portal:user:shareGroupToPublic","portal:user:shareToGroup","portal:user:shareToOrg","portal:user:shareToPublic","premium:user:demographics","premium:user:elevation","premium:user:geocode","premium:user:geoenrichment","premium:user:networkanalysis","premium:user:spatialanalysis"],"disabled":false,"tags":[],"culture":"","region":"US","units":"english","thumbnail":null,"created":1440075016000,"modified":1440075018000,"provider":"enterprise","groups":[]}
	var response={"username":"arvelmhale1","fullName":"Arvel Hale","firstName":"Arvel","lastName":"Hale","preferredView":null,"description":"","email":"traderboy@yahoo.com","userType":"arcgisonly","idpUsername":null,"favGroupId":"b8556f905d404f84a6ddd08bb2ee7b4c","lastLogin":1440528416000,"mfaEnabled":false,"validateUserProfile":true,"access":"org","storageUsage":6007037,"storageQuota":2199023255552,"orgId":"KOH6W4WICH5gzytg","role":"org_admin","privileges":["features:user:edit","features:user:fullEdit","marketplace:admin:manage","marketplace:admin:purchase","marketplace:admin:startTrial","opendata:user:designateGroup","opendata:user:openDataAdmin","portal:admin:assignToGroups","portal:admin:changeUserRoles","portal:admin:deleteGroups","portal:admin:deleteItems","portal:admin:deleteUsers","portal:admin:disableUsers","portal:admin:inviteUsers","portal:admin:manageEnterpriseGroups","portal:admin:manageLicenses","portal:admin:reassignGroups","portal:admin:reassignItems","portal:admin:reassignUsers","portal:admin:updateGroups","portal:admin:updateItems","portal:admin:updateUsers","portal:admin:viewGroups","portal:admin:viewItems","portal:admin:viewUsers","portal:publisher:publishFeatures","portal:publisher:publishScenes","portal:publisher:publishTiles","portal:user:createGroup","portal:user:createItem","portal:user:joinGroup","portal:user:joinNonOrgGroup","portal:user:shareGroupToOrg","portal:user:shareGroupToPublic","portal:user:shareToGroup","portal:user:shareToOrg","portal:user:shareToPublic","premium:user:demographics","premium:user:elevation","premium:user:geocode","premium:user:geoenrichment","premium:user:networkanalysis","premium:user:spatialanalysis"],"disabled":false,"tags":[],"culture":"","region":"US","units":"english","thumbnail":null,"created":1440466346000,"modified":1440528339000,"provider":"arcgis","groups":[{"id":"8e6b96c556754c9e8307cc2768cadd9e","title":"Admin","isInvitationOnly":false,"owner":"hplgis","description":null,"snippet":"Administrative users","tags":["admin"],"phone":null,"sortField":"title","sortOrder":"asc","isViewOnly":false,"isFav":false,"thumbnail":null,"created":1440504896000,"modified":1440504896000,"provider":null,"providerGroupName":"","isReadOnly":false,"access":"org","capabilities":[],"userMembership":{"username":"arvelmhale1","memberType":"member"}}]}
	res.json(response);
	//send(res,"community_user.json");
});
*/

app.get('/sharing/rest/community/groups',function(req, res){
	console.log("/sharing/rest/community/groups");
	send(res,"community.groups.json");
});

app.get('/sharing/rest/community/users/:user',function(req, res){
	console.log("/sharing/rest/community/users/"+req.params.user);
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
	//send(res,"community_groups.json");
});

app.get('/sharing/rest/content/items/:id/info/thumbnail/:img',function(req, res){
	console.log("/sharing/rest/content/items/"+req.params.id+"/info/thumbnail/"+req.params.img);
	send(res,"thumbnails/"+req.params.id+".png");
	//var response={"currentVersion":"3.8"}
	//res.json(response);
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
app.post('/arcgis/rest/services/:name/FeatureServer/unRegisterReplica', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/unRegisterReplica");
	var response={"success":true}
  res.json(response);
});

app.post('/arcgis/rest/services/:name/FeatureServer/replicas', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/createReplica (post)");
	var fileName = "replicas/"+req.params.name+".geodatabase";
  res.sendFile(data_path+"/" + name); //, { root : __dirname})
});
app.post('/arcgis/rest/services/:name/FeatureServer/createReplica', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/createReplica (post)");
	//var response={"statusUrl":"http://services5.arcgis.com/KOH6W4WICH5gzytg/ArcGIS/rest/services/collector/FeatureServer/jobs/0b50a483-27d3-4ceb-8a7c-2229fb7f282a"}
	var response={"statusUrl":"http://"+server+"/arcgis/rest/services/"+req.params.name+"/FeatureServer/replicas"}
  res.json(response);
});

app.post('/arcgis/rest/services/:name/FeatureServer/synchronizeReplica', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/synchronizeReplica");
	var response={"statusUrl":"http://services5.arcgis.com/KOH6W4WICH5gzytg/ArcGIS/rest/services/collector/FeatureServer/jobs/ea726ba6-1bae-4dab-ac06-dd0ad8b3f5e7"}
  res.json(response);

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
	//console.log(req)
	console.log("/arcgis/services (post)");
	//<?xml version="1.0" encoding="utf-8" ?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:tns="http://www.esri.com/schemas/ArcGIS/10.1"><soap:Body><tns:GetFoldersResponse><FolderNames xsi:type="tns:ArrayOfString"><String>Canvas</String><String>Demographics</String><String>Elevation</String><String>Ocean</String><String>Polar</String><String>Reference</String><String>Specialty</String><String>Utilities</String></FolderNames></tns:GetFoldersResponse></soap:Body></soap:Envelope>

  res.send('<html><head><title>Object moved</title></head><body>'+
'<h2>Object moved to <a href="/arcgis/rest/services">here</a>.</h2>'+
'</body></html>');
});

app.get('/arcgis/rest/services//services/:name/FeatureServer/info/metadata', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/info/metadata");
	res.end("Metadata stuff");
	//send(res, req.params.name+ ".FeatureServer.json");
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
	
	//var query="select id,name,parentLayerId,defaultVisibility,subLayerIds,minScale,maxScale from layers where service=?";
	//var layers=[];
	//db.all(query, [req.params.name],function(err, rows) {
		//layers=rows;
	
		//});
	
	//send(res,req.params.name+".json");
});
app.post('/arcgis/rest/services/:name/FeatureServer', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer  (post)");
	send(res, req.params.name+"/FeatureServer.json");
});

app.get('/arcgis/rest/services/:name/FeatureServer/:id', function(req, res){
	console.log("/arcgis/rest/services/"+req.params.name+"/FeatureServer/"+req.params.id);
	send(res,req.params.name+"/FeatureServer."+req.params.id+".json",req.query.callback);
	//send(res,req.params.id + ".json");

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

//http://services5.arcgis.com/KOH6W4WICH5gzytg/arcgis/rest/services/collector/FeatureServer/3/47/attachments/5?token=3r-_M4kJOGxTFNUs5g0J62sih_StsQnU1h1u8dplvCt1-VKX1aru7M5tNcgup78lEPu6de6vjwXZGWhEXjfGgPhEyvYQqCkqn_zfOa21rCvYSFalvNyUCuhxjHdD5JkoDw5926cGPzn5A5bSlmbCRY1HbOTGg5DWvSEhw1Lz3TzAnon0R-qxcZYXjjZmWvpiPb3zR5BBc_pDnKVJjPjBmTd-hpzcHZ9mnPHF8FpIW9Z7Pz9Z0hLK8xjCS8QWxWtC
app.get('/arcgis/rest/services/:name/FeatureServer/:id/:row/attachments/:img', function(req, res){
	console.log("/arcgis/rest/services/FeatureServer/attachments/img");
	var path="photos/cat.jpg";
	var fs = require('fs');
  var file = fs.readFileSync(path, "utf8");
  res.end(file)
	//{"attachmentInfos":[{"id":5,"globalId":"xxxxxx","parentID":"47","name":"cat.jpg","contentType":"image/jpeg","size":5091}]}
	//var response={"attachmentInfos":[]}
  //res.json(response);
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
	//{"attachmentInfos":[{"id":5,"globalId":"xxxxx","parentID":"47","name":"cat.jpg","contentType":"image/jpeg","size":5091}]}
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
		res.sendFile(data_path+"\\" + name.replace(/\//g,"\\")); //, { root : __dirname})
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
