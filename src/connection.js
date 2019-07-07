var mysql = require('mysql');
const config = require ('./config.json')
var con = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.username,
  password: config.mysql.password,
  database: config.mysql.database
});
module.exports = {
  con: con
}
