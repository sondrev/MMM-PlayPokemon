/* Magic Mirror
 * Node Helper: MMM-PlayPokemon
 *
 * By Sondre Nitter Vestad
 * MIT Licensed.
 */

var link = 'http://10.111.54.248:3000/';

var NodeHelper = require("node_helper");
var fs = require("fs");
var qr = require('qr-image');
 
var qr_png = qr.image(link, { type: 'png' });
qr_png.pipe(require('fs').createWriteStream('./modules/MMM-PlayPokemon/qr.png'));

module.exports = NodeHelper.create({



	socketNotificationReceived: function(notification, payload) {
		var self=this;
		if (notification === "MMM-PlayPokemon-START") {
			console.log("Starting pokemon node helper");
			self.sendSocketNotification("MMM-PlayPokemon-UPDATE", {});

			fs.watchFile('./modules/MMM-PlayPokemon/image.png',{ persistent: true, interval: 973 }, (curr, prev) => {
				console.log("Updating pokemonimage");
				self.sendSocketNotification("MMM-PlayPokemon-UPDATE", {});
			});

			//setInterval(function() {
			//	console.log("Updating pokemonimage");
			//	self.sendSocketNotification("MMM-PlayPokemon-UPDATE", {});
			//}, 100);

			// Send notification
			; //Is possible send objects :)
		}
	},


	// this you can create extra routes for your module
	extraRoutes: function() {
		var self = this;
		this.expressApp.get("/MMM-PlayPokemon/extra_route", function(req, res) {
			// call another function
			values = self.anotherFunction();
			res.send(values);
		});
	},

	// Test another function
	anotherFunction: function() {
		return {date: new Date()};
	}
});
