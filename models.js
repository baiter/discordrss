var request = require('request');
var cheerio = require('cheerio');
var toSource = require('tosource');
var fs = require("fs");
var rss_url = require("./config/config.json").rss_url;
var last_post = require("./lastpost.json");

// post update if there's a new chapter
var post_update = function(title,link,channel) {
	channel.sendMessage(
		"**" + title + "**" +
		"\nLink: <" + link + ">"
	);
}

String.prototype.decodeHTML = function() {
    var map = {"gt":">" /* , … */};
    return this.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function($0, $1) {
        if ($1[0] === "#") {
            return String.fromCharCode($1[1].toLowerCase() === "x" ? parseInt($1.substr(2), 16)  : parseInt($1.substr(1), 10));
        } else {
            return map.hasOwnProperty($1) ? map[$1] : $0;
        }
    });
};

// re-write config date on the file
var update_last_post = function(newDate) {
  var new_date = new Object();
  new_date.last_post = newDate.toString();

  fs.writeFile("./lastpost.json", JSON.stringify(new_date, null, 2), function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("lastpost.json updated!");
    last_post = new_date;
  });
}

// check rss for update
module.exports.check_update = function(callback,channel){
	var status_channel = channel;

	request(rss_url, function(err, resp, body) {
		if (err) callback("issues fetching feed");
		else {
			var $ = cheerio.load(body, {xmlMode: true});
			var rss = $.xml('item');
			var $ = cheerio.load(rss, {xmlMode: true});

			var titles = $.xml('title').replace(/<title>/g,"").decodeHTML().split("</title>");
			var links = $.xml('link').replace(/<link>/g,"").split("</link>");		
			var pubdates = $.xml('pubDate').replace(/<pubDate>/g,"").split("</pubDate>");

			titles.pop();links.pop();pubdates.pop();

			// var last_bot_date = new Date(last_bot_post);
			var newest_post_date = new Date(pubdates[0]).valueOf();
			var last_post_date = parseInt(last_post.last_post);

			var pubval = pubdates.map(function(item) {
				return (new Date(item).valueOf());
			});
			pubdates = pubval;
			//console.log(pubdates);

			// check for new posts
			if (newest_post_date < last_post_date) { callback("there's issues with dates on configuration or rss page", null, null, null); }
			if (newest_post_date > last_post_date) {
				var new_post_count = 0;
				for (var i = 0; i < titles.length; i++) {
					if ( pubdates[i] != last_post_date ) {
						new_post_count++;
					}
					else break;
				}
				// post new rss messages
				for (var i = new_post_count - 1; i >= 0; i--) {
					post_update(titles[i],links[i],status_channel);
				}
				console.log("new " + newest_post_date);
				console.log("old " + last_post_date);
				update_last_post(newest_post_date);
			}
			else {
				//callback("no update", null, null, novel);
			}

		}
	});
}
