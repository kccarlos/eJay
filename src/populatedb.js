#! /usr/bin/env node

/*
Creator: kccarlos
Date: Oct-1-2022
Reference: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose

Create collection and populate the MongoDB database with dummy data
*/

// Dependency

var async = require('async');
var mongoose = require('mongoose');
const config = require('config');

var User = require('./models/User');
var Product = require('./models/Product');
var Tag = require('./models/Tag');

// Connect MongoDB
var mongoDB = config.get('mongoURI')
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create data

var products = []
var users = []
var tags = []

function tagCreate(name, cb) {
  tagdetail = {name: name}
  var tag = new Tag(tagdetail);

  tag.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Tag: ' + tag);
    tags.push(tag)
    cb(null, tag)
  }  );
}

function userCreate(username, password, avatarURL,
                    firstname, lastname, bio,
                    joinTime, phone, email, cb) {
  userdetail = {username:username , password: password};
  if (avatarURL != false) userdetail.avatarURL = avatarURL;
  if (firstname != false) userdetail.firstname = firstname;
  if (lastname != false) userdetail.lastname = lastname;
  if (bio != false) userdetail.bio = bio;
  if (joinTime != false) userdetail.joinTime = joinTime;
  if (phone != false) userdetail.phone = phone;
  if (email != false) userdetail.email = email;
  var user = new User(userdetail);

  user.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New User: ' + user);
    users.push(user)
    cb(null, user)
  }  );
}

function productCreate(seller, title, description,
                       create_time, tags, mediaURLs, price, location,
                       cb) {
  productdetail = {seller:seller , title: title};
  if (description != false) productdetail.description = description;
  if (create_time != false) productdetail.create_time = create_time;
  if (tags != false) productdetail.tags = tags;
  if (mediaURLs != false) productdetail.mediaURLs = mediaURLs;
  if (price != false) productdetail.price = price;
  if (location != false) productdetail.location = location;
  var product = new Product(productdetail);
  console.log(product)
  product.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Product: ' + product);
    products.push(product)
    cb(null, product)
  }  );
}

//Insert data
// argument sequence:
// username, password, avatarURL, firstname, lastname, bio, joinTime, phone
function createTagUsers(cb) {
    async.series([
        function(callback) {
          userCreate('onlythecatknows', 'letmein', 'https://i.imgur.com/PRUDW43.jpeg',
                     'Kecheng', 'An',
                     'Do Not post your listing with my photos, or suffer your own peril. Instant block when either you are:- a) lowballing. b) mindlessly questioning with no commitment to purchase.',
                     false, 2223330000, 'kkk@jh.edu', callback);
        },
        function(callback) {
          userCreate('helloworld', 'letmein', "https://i.imgur.com/emmfRK1.jpeg",
                     'Ming', 'Xiao',
                     false,
                     false, 2223335555, 'abc@jh.edu', callback);
        },
        function(callback) {
          userCreate('dudewithnoinfo', 'letmein', false,
                      false, false,
                      false,
                      false, false, 'cdf@jh.edu', callback);
        },
        function(callback) {
          tagCreate("furniture", callback);
        },
        function(callback) {
          tagCreate("book", callback);
        },
        function(callback) {
          tagCreate("cookware & tableware", callback);
        },
        function(callback) {
          tagCreate("children & nursery", callback);
        },
        function(callback) {
          tagCreate("storage & organization", callback);
        }
        ],
        // optional callback
        cb);
}

//Insert data
// argument sequence:
//seller, title, description, create_time, tags, mediaURLs, price, location

function createProducts(cb) {
    async.parallel([
        function(callback) {
          productCreate(users[0],
                        'Ikea LERBERG Shelf unit',
                        'A classic and timeless shelf unit with plenty of room for things in all heights and sizes. A perfect storage solution for all those things you love and want to display. 60x148 cm',
                        false,
                        tags[0],
                        ["https://i.imgur.com/xiSSnO2.jpeg","https://i.imgur.com/WWdPsSQ.jpeg","https://i.imgur.com/dyhVg5f.jpeg"],
                        199,
                        [39.328030, -76.616340],
                        callback);
        },
        function(callback) {
          productCreate(users[1],
                        'Lego Ideas 40566 Ray the Castaway',
                        'Authentic Lego, brand new and factory sealed. Collector’s box. Best price as listed. Please self collect. Thanks for viewing.',
                        false,
                        tags[3],
                        ["https://i.imgur.com/R8G2gp1.jpeg"],
                        99.8,
                        [39.330360, -76.615883],
                        callback);
        },
        function(callback) {
          productCreate(users[1],
                        'IKEA storage combination with box and cover',
                        'IKEA children storage combination with boxes and cover',
                        false,
                        tags[4],
                        ["https://media.karousell.com/media/photos/products/2022/10/4/ikea_storage_combination_with__1664897362_4eb2c450_progressive.jpg"],
                        20,
                        [39.330360, -76.615883],
                        callback);
        },
        function(callback) {
          productCreate(users[1],
                        'Ikea shoe cabinet - BISSA (2 units available)',
                        'Self pickup or Lalamove to Bugis',
                        false,
                        tags[4],
                        ["https://media.karousell.com/media/photos/products/2022/10/4/ikea_shoe_cabinet__bissa_2_uni_1664896752_4e75af8d_progressive.jpg"],
                        99.8,
                        [39.330360, -76.615883],
                        callback);
        },
        function(callback) {
          productCreate(users[1],
                        'Ikea 2m shelf',
                        'Item to be picked up soonest.Need to secure against the wall to be stable.',
                        false,
                        tags[0],
                        ["https://media.karousell.com/media/photos/products/2022/10/4/ikea_2m_shelf_1664894421_aedc7b43_progressive.jpg"],
                        100,
                        [39.330360, -76.615883],
                        callback);
        },
        function(callback) {
          productCreate(users[2],
                        'Ikea small table top chest of drawers negotiable',
                        'Ikea chest of drawers table top',
                        false,
                        tags[2],
                        ["https://media.karousell.com/media/photos/products/2022/10/4/ikea_small_table_top_chest_of__1664893741_ee643ffd_progressive.jpg"],
                        50,
                        [39.330360, -76.615883],
                        callback);
        },
        function(callback) {
          productCreate(users[1],
                        'Ikea 8 compartments wooden shelf',
                        '-As per picture. -Size 150cmx80cmx40cm. -In very good condition. Just need to wipe before use. -Hard cloth pull out shelvings. -Self collect at 228070 with own transport and manpower to dismantle -Collection on last week of October after 26th',
                        false,
                        tags[0],
                        ["https://media.karousell.com/media/photos/products/2022/10/4/ikea_8_compartments_wooden_she_1664892119_d8d2dbed_progressive.jpg"],
                        49,
                        [39.328030, -76.616340],
                        callback);
        },
        function(callback) {
          productCreate(users[1],
                        'IKEA MALM chest of six drawers',
                        'Functional chest of six drawers. Used in bedroom.',
                        false,
                        tags[0],
                        ["https://media.karousell.com/media/photos/products/2022/10/4/ikea_malm_chest_of_six_drawers_1664885869_1f8bc081_progressive.jpg"],
                        100,
                        [39.328030, -76.616340],
                        callback);
        },
        function(callback) {
          productCreate(users[1],
                        'LEGO Star Wars UCS AT-AT 75313',
                        'Last box',
                        false,
                        tags[3],
                        ["https://media.karousell.com/media/photos/products/2022/10/4/lego_star_wars_ucs_atat_75313_1664897155_b260307b_progressive.jpg"],
                        99.9,
                        [39.328030, -76.616340],
                        callback);
        },
        function(callback) {
          productCreate(users[1],
                        'Lego Heartlake grand Hotel',
                        'Complete set. Comes with box and instruction manual',
                        false,
                        tags[3],
                        ["https://media.karousell.com/media/photos/products/2022/10/4/lego_hotel_1664892157_b711f119_progressive.jpg"],
                        119,
                        [39.328030, -76.616340],
                        callback);
        },
        function(callback) {
          productCreate(users[1],
                        'TO BLESS - Big Bear Soft Toy',
                        'TO BLESS - Big Bear Soft Toy. Kids outgrown. Self pickup at 530951',
                        false,
                        tags[3],
                        ["https://media.karousell.com/media/photos/products/2022/10/4/to_bless__big_bear_soft_toy_1664892162_73c3dd0d_progressive.jpg"],
                        49.9,
                        [39.328030, -76.616340],
                        callback);
        },
        function(callback) {
          productCreate(users[1],
                        'Jolteon plush toy',
                        'Jolteon is up for the grab! Only at $11',
                        false,
                        tags[3],
                        ["https://media.karousell.com/media/photos/products/2022/10/4/jolteon_plush_toy_1664891499_15d16ad5_progressive.jpg", "https://media.karousell.com/media/photos/products/2022/10/4/jolteon_plush_toy_1664891499_4aeb152c_progressive.jpg"],
                        11,
                        [39.328030, -76.616340],
                        callback);
        },
        function(callback) {
          productCreate(users[2],
                        'Introduction to algorithms third edition',
                        'Graduated, need money',
                        false,
                        tags[1],
                        ["https://media.karousell.com/media/photos/products/2016/04/17/introduction_to_algorithms_clrs_3rd_edition_1460825619_e32e3150.jpg"],
                        99.8,
                        [39.328030, -76.616340],
                        callback);
        }
      ],
        // optional callback
        cb);
}

async.series([
    createTagUsers,
    createProducts
],
// Optional callback
function(err, results) {
    if (err) console.log('FINAL ERR: '+err);
    // All done, disconnect from database
    mongoose.connection.close();
});
