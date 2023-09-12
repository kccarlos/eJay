const { MongoClient, ServerApiVersion } = require("mongodb");
const config = require('config');
const uri = config.get('mongoURI')
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});
 
var _db;

module.exports = {
  connectToServer: function (callback) {
    client.connect((err, db) =>  {

      if (db)
      {
        _db = db.db("testv2");
        console.log("Successfully connected to MongoDB."); 
      }
      return callback(err);
         });
  },
 
  getDb: function () {
    return _db;
  },
};