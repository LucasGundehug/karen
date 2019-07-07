const Discord = require('discord.js')
const client = new Discord.Client()
const config = require ('./config.json')
const con = require('./connection.js').con;
const funct = require ('./functions.js')
const command = require('./commands/manager.js')
console.clear()
console.log()
console.log(`\x1b[32mdP     dP                                     `)
console.log(`\x1b[32m88   .d8'                                     `)
console.log(`\x1b[32m88aaa8P'  .d8888b. 88d888b. .d8888b. 88d888b. `)
console.log("\x1b[32m88   `8b. 88'  `88 88'  `88 88ooood8 88'  `88 ")
console.log('\x1b[32m88     88 88.  .88 88       88.  ... 88    88 ')
console.log("\x1b[32mdP     dP `88888P8 dP       `88888P' dP    dP ")
console.log(`           /\\        /\\      /\\`)
console.log(`__________/  \\/\\/\\  /  \\/\\/\\/  \\  /\\__________`)
console.log(`                  \\/            \\/`)
console.log(`----------------------------------------------`)
console.log(`\x1b[94m                         © 2019 Layne Balsters\x1b[0m`)
console.log()
con.connect(function(err) {
  if (err){
    funct.logger(err,'error');
    return;
  }
  funct.logger('Connected to Database!')
  discord()
});
function discord(){
  bot_secret_token = config.discord.bot_secret_token;
  client.login(bot_secret_token)
  client.on('ready', () => {
      funct.logger("Connected as " + client.user.tag);
      client.user.setActivity(config.discord.game)
  })
  client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) {
        return
    }
    if (receivedMessage.content.startsWith(config.commandPrefix)) {
      command.processCommand(receivedMessage)
    }
  })
}
