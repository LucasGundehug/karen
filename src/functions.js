var con = require('./connection.js').con;
module.exports = {
  dayDiff: function(date) {
   var time = module.exports.timeConverter(date);
   var date1 = new Date(time);
   var date2 = new Date();
   var res = Math.abs(date1 - date2) / 1000;
   var daysDifference = Math.floor(res / 86400);
   return daysDifference +' Days!';
  },
  timeConverter: function(UNIX_timestamp) {
   var a = new Date(UNIX_timestamp * 1000);
   var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
   var year = a.getFullYear();
   var month = months[a.getMonth()];
   var date = a.getDate();
   var hour = a.getHours();
   var min = a.getMinutes();
   var sec = a.getSeconds();
   var time = month + ' ' + date + ', ' + year + ' ' + hour + ':' + min + ':' + sec;
   return time;
  },
  userdata: function(id,key){
   con.query("SELECT * FROM users WHERE id = ?",[id], function (err, result, fields) {
     if (err) throw err;
     return result[0].credits
   });
  },
  logger: function(message, type = ''){
    var time = new Date()
    var date = module.exports.dateformat(time)
    if(type == 'error') {
     console.log('\x1b[31m[Karen][ERROR] \x1b[0m' + message)
    } else {
     console.log('\x1b[32m[Karen] \x1b[94m['+date+'] \x1b[0m' + message)
    }
  },
  dateformat: function(a){
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = month + ' ' + date + ', ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
  }
};
