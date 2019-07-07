var con = require('../connection.js').con;
const config = require ('../config.json')
const funct = require ('../functions.js')
module.exports = {
  processCommand: function(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command
    var logarg = '';
    if(arguments.length > 0){
      logarg = ' ' + arguments;
    }
    funct.logger(receivedMessage.member.user.tag + ' used "'+config.commandPrefix+ primaryCommand + logarg +'"');

    if(primaryCommand == 'help' || primaryCommand == 'commands' || primaryCommand == 'about') {
      module.exports.help(receivedMessage);
    } else if (primaryCommand == "online" || primaryCommand == 'whosonline' || primaryCommand == 'oc') {
        module.exports.online(receivedMessage)
    } else if(primaryCommand == "news") {
        module.exports.news(receivedMessage)
    } else if(primaryCommand == "leaderboard") {
        module.exports.leaderboard(receivedMessage,arguments)
    } else if(primaryCommand == "user" || primaryCommand == 'lookup') {
        module.exports.lookUp(receivedMessage,arguments)
    }

  },
  help: function(receivedMessage){
    receivedMessage.channel.send({
      embed: {
        title: "Help",
        description: 'Commands can be used with **'+config.commandPrefix+'**',
        fields: [
          {name: "Commands",value: "help\nonline\nnews\nleaderboard\nuser",inline: true},
          {name: "Description", value: "Command list\nOnline users count\nLatest news article\nLeaderboard(credits/diamonds)\nLookup a user",inline: true}
        ],
        footer: {
          icon_url: config.discord.bot_image,
          text: "© 2019 Layne Balsters"
        }
      }
    });
  },
  leaderboard: function(receivedMessage,arguments) {
    if(arguments == 'credits') {
      con.query("SELECT id,username,credits FROM users WHERE users.rank <= "+config.minRank+" ORDER BY credits DESC LIMIT 3", function (err, result, fields) {
          if (err){funct.logger(err,'error');return;}
          var value = result[0].username +' - '+ result[0].credits + '\n' + result[1].username +' - '+ result[1].credits + '\n' + result[2].username +' - '+ result[2].credits + '\n'
          receivedMessage.channel.send({embed: {
            color: 3447003,
            title: "Leaderboard",
            fields: [
              { name: "Credits", value: value, inline: true}
            ]
          }
        })
      });
    } else if(arguments == 'diamonds') {
      con.query("SELECT id,username,credits,user_id,amount FROM users,users_currency WHERE users_currency.user_id = users.id AND type = '5' AND users.rank <= "+config.minRank+" ORDER BY users_currency.amount DESC LIMIT 3", function (err, result, fields) {
          if (err){funct.logger(err,'error');return;}
          var value = result[0].username +' - '+ result[0].amount + '\n'+result[1].username +' - '+ result[1].amount + '\n'+result[2].username +' - '+ result[2].amount + '\n';
          receivedMessage.channel.send({embed: {
            color: 3447003,
            title: "Leaderboard",
            fields: [
              { name: "Credits", value: value, inline: true}
            ]
          }
        })
      });
    }
    else {
      receivedMessage.channel.send('We only have leaderboards for Credits and Diamonds!')
    }
  },
  lookUp: function(receivedMessage,arguments) {
    con.query("SELECT id,username,look,account_created  FROM users WHERE username = ?",[arguments], function (err, result, fields) {
        if (err){funct.logger(err,'error');return;}
        if(result.length >= 1){
          receivedMessage.channel.send({embed:{
            title: result[0].username,
            image: {
              url: "https://habbo.com.br/habbo-imaging/avatarimage?figure="+ result[0].look+"&size=l"
            },
            url: config.hotelURL + config.profiles + result[0].username,
            description: "This user has been apart of "+config.hotelName+" for "+ funct.dayDiff(result[0].account_created)
          }})
        }
        else receivedMessage.channel.send('The user you tried to look for, does\'nt exist??');
    });
  },
  online: function(receivedMessage){
    con.query("SELECT username FROM users WHERE online = '1'", function (err, result, fields) {
        if (err){funct.logger(err,'error');return;}
        receivedMessage.channel.send(result.length + ' Users online now!')
    });
  },
  news: function(receivedMessage){
    con.query(config.mysql.query.news, function (err, result, fields) {
      if (err){funct.logger(err,'error');return;}
        receivedMessage.channel.send(config.hotelURL + config.newsArticleLink + result[0].id)
    });
  }
};
