/* Magic Mirror
 * Node Helper: MMM-PlayPokemon
 *
 * By Sondre Nitter Vestad
 * MIT Licensed.
 */

var ip = require("ip");
console.dir ("Creating QR for local ip: "+ip.address() );
var port = 3000;
var link = 'http://'+ip.address()+':'+port+'/';

var NodeHelper = require("node_helper");
var fs = require("fs");
var qr = require('qr-image');

var qr_png = qr.image(link, { type: 'png',margin:1 });
qr_png.pipe(require('fs').createWriteStream('./modules/MMM-PlayPokemon/qr.png'));

module.exports = NodeHelper.create({

	socketNotificationReceived: function(notification, payload) {
		var self=this;
		if (notification === "MMM-PlayPokemon-START") {
			console.log("Starting pokemon node helper");
      self.sendSocketNotification("MMM-PlayPokemon-LINK", {link:link});
			self.sendSocketNotification("MMM-PlayPokemon-UPDATE", {});
			fs.watchFile('./modules/MMM-PlayPokemon/image.png',{ persistent: true, interval: 49 }, (curr, prev) => {
				//console.log("Updating pokemonimage");
				self.sendSocketNotification("MMM-PlayPokemon-UPDATE", {});
			});

		}
	},


});
