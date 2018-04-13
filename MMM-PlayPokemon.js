/* global Module */

/* Magic Mirror
 * Module: MMM-PlayPokemon
 *
 * By Sondre Nitter Vestad
 * MIT Licensed.
 */

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
		
		var infotext1 = document.createElement("p");
		infotext1.className = "infoText"
		infotext1.textContent='Kontroller (eduroam):'

		var infotext2 = document.createElement("p");
		infotext2.className = "infoText"
		infotext2.textContent='http://10.111.54.248:3000'
		
		var qr = document.createElement("img");
		qr.id="qr"
		qr.src = "/modules/MMM-PlayPokemon/qr.png?" + Date.now();
		qr.className="qr"


		infobox.appendChild(infotext1);
		infobox.appendChild(document.createElement("br"));
		infobox.appendChild(infotext2);

		infopane.appendChild(infobox);
		infopane.appendChild(qr);

		wrapper.appendChild(header);
		wrapper.appendChild(infopane);
		wrapper.appendChild(image);
		return wrapper;
	},

	updateImage: function() {
		let img = document.getElementById("emulatorImage");
		if (img!==undefined) {
			img.src = "/modules/MMM-PlayPokemon/image.png?" + Date.now();
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
			//this.updateDom();
			this.updateImage();
		}
	},
});
