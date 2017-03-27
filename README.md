#requirements: 
- node v6.10.0
- discord bot account

#node installation instructions:
https://www.digitalocean.com/community/tutorials/how-to-install-node-js-with-nvm-node-version-manager-on-a-vps

#installation instructions:
1. extract folder
2. open folder
3. install using terminal:
npm install

#configuration instructions:
1. fill in parameters for config/config.js

#run instructions
1. run using terminal:
node index.js

#note:
It will post everything on the rss after the value in lastpost.json.  To find the value for lastpost.json, you can use the following test command.  Get the date from your rss feed source code.

#example:
node test.js date "Mon, 27 Mar 2017 00:30:53 +0000"
1490574653000

