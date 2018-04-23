/* global Module */

/* Magic Mirror
 * Module: MMM-PlayPokemon
 *
 * By Sondre Nitter Vestad
 * MIT Licensed.
 */

 var frameCount=1;
 var startFPS=0;

Module.register("MMM-PlayPokemon", {
	defaults: {
	},


	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;
		this.sendSocketNotification("MMM-PlayPokemon-START", {});
		//this.updateDom();
	},

	getDom: function() {
		var self = this;

		var wrapper = document.createElement("div");
		wrapper.className = "moduleContainer"

		var header = document.createElement("img");
		header.src="/modules/MMM-PlayPokemon/background.png"
		header.className="imgHeader"


		var image = document.createElement("img");
		image.id="emulatorImage"
		image.src = "/modules/MMM-PlayPokemon/image.png?" + Date.now();
		image.className="imgEmulator"

		var infopane = document.createElement("div");
		infopane.className="infopane"

		var infobox = document.createElement("div");
		infobox.id="infobox"
		infobox.className="infobox"
		//infobox.innerHTML='Kontroller (eduroam):<br />http://10.111.54.248:3000'

		var infotext1 = document.createElement("div");
		infotext1.id="header"
		infotext1.className = "infoText"
		infotext1.textContent='Kontroller (eduroam):'

		var infotext2 = document.createElement("div");
		infotext2.id="controllerLink"
		infotext2.className = "infoText"
		infotext2.textContent='loading link'

		var lineBreak = document.createElement("div");
		lineBreak.id="invisible"
		lineBreak.className = "infoText"
		lineBreak.textContent = "--"

		var infotext3 = document.createElement("div");
		infotext3.id="gitLink"
		infotext3.className = "infoText"
		infotext3.textContent='https://github.com/sondrev/MMM-PlayPokemon'

		var infotextFps = document.createElement("div");
		infotextFps.id="fpsCounter"
		infotextFps.className = "infoText"
		infotextFps.textContent='FPS: 0'


		//https://github.com/sondrev/MMM-PlayPokemon

		var qr = document.createElement("img");
		qr.id="qr"
		qr.src = "/modules/MMM-PlayPokemon/qr.png?" + Date.now();
		qr.className="qr"

		//infobox.innerHTML="blabla<br />blabla"

		infobox.appendChild(infotext1);
		infobox.appendChild(infotext2);
		infobox.appendChild(lineBreak.cloneNode(true));
		infobox.appendChild(infotext3);
		infobox.appendChild(lineBreak.cloneNode(true));
		infobox.appendChild(infotextFps);

		infopane.appendChild(infobox);
		infopane.appendChild(qr);

		wrapper.appendChild(header);
		wrapper.appendChild(infopane);
		wrapper.appendChild(image);
		return wrapper;
	},

	handleFPS: function() {
		if (frameCount==1) {
			startFPS=Date.now()
		}

		if (frameCount==11) {
			var endFPS=Date.now()
			var elapsedMS=endFPS-startFPS
			var frames=(10/(elapsedMS/1000)).toFixed(1)
			this.updateFPS(frames)
			frameCount=0;
		}
		frameCount++;
},

	setLink: function(link) {
		let text = document.getElementById("controllerLink");
		if (text!==undefined) {
			text.textContent=link
		}
	},

	updateFPS: function(fps) {
		let text = document.getElementById("fpsCounter");
		if (text!==undefined) {
			text.textContent="FPS: "+fps
		}
	},

	updateImage: function() {
		let img = document.getElementById("emulatorImage");
		if (img!==undefined) {
			var imageTemp = new Image();
			imageTemp.onload = function () {
				img.src = imageTemp.src;
			}
			imageTemp.src = "/modules/MMM-PlayPokemon/image.png?" + Date.now();
		}
	},

	getScripts: function() {
		return [];
	},

	getStyles: function () {
		return [
			"MMM-PlayPokemon.css",
		];
	},

	socketNotificationReceived: function (notification, payload) {
		if(notification === "MMM-PlayPokemon-UPDATE") {
			this.updateImage();
			this.handleFPS();
		}
		if(notification === "MMM-PlayPokemon-LINK") {
			this.setLink(payload.link);
		}
	},
});
