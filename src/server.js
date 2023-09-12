const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const path = require('path');
const dbo = require("./config/connect");

const fs = require('fs');

const app = express();
const PORT = 3001;
const HOST = '0.0.0.0';

const SP_NAME = 'ejay';
const BASE_URL = 'https://ejay.online';

connectDB();

app.use(cors());
app.use(express.json());
// app.use(bodyParser.urlencoded({
//     extended: true
// }));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/userproducts', require('./routes/api/userproducts'));
app.use("/users/:id", require('./routes/api/getuser'));
app.use(require('./routes/api/getproduct'));
app.use("/", require('./routes/api/allproducts'));
app.use('/userProfile', require('./routes/api/updateUserProfile'));
app.use('/api/new-product', require('./routes/api/newproduct'));
app.use('/updateFavorites', require('./routes/api/updateFavorites'))
app.use('/api/sendEmail', require('./routes/api/sendEmail'));
app.use('/api/sendEmailBuyer', require('./routes/api/sendEmailBuyer'));
app.use('/api/sendEmailSeller', require('./routes/api/sendEmailSeller'));
app.use('/api/getFavorites', require('./routes/api/getFavorites'));
app.use('/api/createOrder', require('./routes/api/createOrder'));
app.use('/api/cancelOrder', require('./routes/api/cancelOrder'));
app.use('/api/approveOrder', require('./routes/api/approveOrder'));
app.use('/api/completeOrder', require('./routes/api/completeOrder'));
app.use('/api/recommend', require('./routes/api/recommend'));
app.use('/api/gethistory', require('./routes/api/gethistory'));
app.use('/api/getOrders', require('./routes/api/getOrders'));
app.use('/api/updateProduct', require('./routes/api/updateProduct'));
app.use('/api/getUserPublic', require('./routes/api/getUserPublic'));
app.use('/api/getProductsPublic', require('./routes/api/getProductsPublic'));
app.use('/api/updateRating', require('./routes/api/updateRating'));
app.use('/api/getRating', require('./routes/api/getRating'));
app.use('/api/getOneRating', require('./routes/api/getOneRating'));
app.use('/api/verifyEmail/', require('./routes/api/verifyEmail'));
app.use('/api/sendVerification/', require('./routes/api/sendVerification'));
app.use('/api/pickupDistance', require('./routes/api/pickupDistance'));
//use route: userprofile
// app.use(require('./routes/api/userprofile'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'));
});

app.get("/jhu/metadata", (req, res) => {
    res.type("application/xml");
    res.status(200);
    res.send(samlStrategy.generateServiceProviderMetadata(PbK, PbK));
  });

// Serve static assets in production
// if (process.env.NODE_ENV === 'production') {
//     // Set static folder
//     app.use(express.static('client/build'));

//     app.get('*', (req, res) => {
//       res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//     });
//   }

app.listen(PORT, HOST, () => {
    dbo.connectToServer(function (err) {
        if (err) console.error(err);

    });
    console.log(`Listening on PORT ${PORT}...`)
})