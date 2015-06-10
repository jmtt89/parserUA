/* parserUA main */

// Base function.
//Mozilla/[version] ([system and browser information]) [platform] ([platform details]) [extensions]
var parserUA = function(userAgent) {
	var ua = userAgent || navigator.userAgent;
	var aux, regex = /[\(\)]+/g, tmp = ua.split(regex), tmp2;

	//Layout
	var browser = {
		render: tmp[0].trim()
	};

	//System and platform
	var system = {}, hardware= {};
	aux = tmp[1].toLowerCase();
	var i, arry, elem;
	if(aux.indexOf("windows phone") > -1){
		for(i = 0, arry = aux.split(";"), elem; i<arry.length ; i++){
			elem = arry[i].trim();
			if(elem.indexOf("windows phone") > -1){
				system.version = elem.replace(/\sos\s/," ").split(" ").pop();
			}
			if(elem.indexOf("-") > -1 && elem.length === 5){
				browser.lang = elem;
			}
			if(elem.indexOf("build") > -1){
				tmp2 = elem.split("build/");

			}
		}
		hardware.device = arry.pop();
		hardware.version = arry.pop();
		system.os = "Whindows Phone";
	}else if(aux.indexOf("android") > -1){
		for(i = 0, arry = aux.split(";"), elem; i<arry.length ; i++){
			elem = arry[i].trim();
			if(elem.indexOf("android") > -1){
				system.version = elem.split(" ")[1];
			}
			if(elem.indexOf("-") > -1 && elem.length === 5){
				browser.lang = elem;
			}
			if(elem.indexOf("build") > -1){
				tmp2 = elem.split("build/");
				hardware.device = tmp2[0];
				hardware.version = tmp2[1];
			}
		}
		system.os = "Android";
	}else if(aux.indexOf("ipad") > -1 || aux.indexOf("iphone") > -1 || aux.indexOf("ipod") > -1){
		for(i = 0, arry = aux.split(";"), elem; i<arry.length ; i++){
			elem = arry[i].trim();
			if(elem.search(/(\d(_\d)+)/) > -1){
				hardware.version = elem.match(/(\d(_\d)+)/)[0];
				system.version = hardware.version.split('_').join('.');
			}
			if(elem.indexOf("-") > -1 && elem.length === 5){
				browser.lang = elem;
			}
		}
		hardware.device = arry[0].trim();
		system.os = "IOS";
	}else if(aux.indexOf("blackberry") > -1){
		arry = aux.split(";");
		hardware.device = arry[2];
		system.os = "BlackBerry";
		hardware.version = arry[2].split(" ").pop();
		system.version = hardware.version;
		browser.lang = arry[3] || undefined;
	}else if(aux.indexOf("bb10") > -1){
		system.os = "BB10";
	}else{ //Es un tipo desconocido, normalmente cumplen las siguiente regla <os>;<version>;<hardware>;<language>
		arry = aux.split(";");
		system.os = arry[0].trim();
		system.version   = arry[2] ? arry[1].trim() : undefined;
		hardware.device  = arry[2] ? arry[2] : arry[1];
		hardware.version = arry[2] ? arry[2] : arry[1];
		browser.lang     = arry[3] || undefined;
	}


	//Browser & type
	aux = tmp.length > 4 ? tmp[4].split(" ") : [];
	for(i=0; i<aux.length ;i++){
		elem = aux[i].trim().toLowerCase();
		if(elem.indexOf("mobile") > -1){
			hardware.type = "Mobile";
		}
		if(elem.indexOf("chrome") > -1) {
			browser.type    = elem.split("/")[0];
			browser.version = elem.split("/")[1];
		}
		if(elem.indexOf("opera") > -1 || elem.indexOf("presto") > -1){ // Opera - Opera Mini - Opera Mobile - old browsers
			hardware.type   = "Mobile";
			browser.type    = elem.split("/")[0];
			browser.version = elem.split("/")[1];
		}
		if(elem.indexOf("safari") > -1){
			browser.type    = !browser.type     ? elem.split("/")[0] : browser.type;
			browser.version = !browser.version  ? elem.split("/")[1] : browser.version;
		}
	}

	return {
		userAgent: ua,
		system: system,
		hardware: hardware,
		browser: browser
	};
};


// Version.
parserUA.VERSION = '0.5.0';


// Export to the root, which is probably `window`.
root.parserUA = parserUA;
