// Get authentication data
try { var configs = require("./config/config.json");} catch (e) { throw e; }
try { var models = require('./models.js');} catch (e) { throw e;}

const Discord = require("discord.js");
const client = new Discord.Client();

//// Callback Errors
var process_errors = function(err) {
  if (err == "no update") { /*console.log("no update"); */ }
  else { console.log(err); }
}

//// login success. ready!
client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
  var channel = client.channels.get(configs.channel_id);
  var interval = parseInt(configs.check_interval);
  
  // check all novels
  models.check_update(process_errors,channel);
  
  setInterval( function () {
    count = 0;
    models.check_update(process_errors,channel);}, 
    interval);

});

//// trigger command section
// !ping
client.on('message', msg => {
  var channel = client.channels.get(configs.channel_id);
  if (msg.content === '!ping') {
    msg.reply('Pong!');
    console.log("pong");
  }
  if (msg.content === '!testmessage') {
    channel.sendMessage("hiya");
  }
});

//// reconnect feature
client.on("disconnected", function () {
    console.log("Disconnected!");
    //process.exit(1); //exit node.js with an error
    setTimeout(function () {
        client.login(configs.token);
    }, 15000);
});

//// time to login!
client.login(configs.token);
