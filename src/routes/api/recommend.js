const { execFile } = require('child_process');
const express = require("express");
const { syncBuiltinESMExports } = require('module');
const router = express.Router();
const auth = require('../../middleware/auth');

// node server.js: run at /src
// python file path: src/pyserver/recomm.py
const path = 'pyserver/recomm.py';
var recommendations = [];

// @route    POST api/recommend
// @desc     Get recommendation results according to browsing history
// @access   Public
router.post("/", auth, async function (req, res) {
    // let browsingHistory = req.body.browsingHistory;
    if (!req.user) {
        res.status(401).json("Please login to get recommendations.");
    }
    else {
        // console.log("req.body: ", req.body);
        browsingHistory = req.body;
        // console.log("router at recommend.js: ", browsingHistory)
        const child = execFile('python3', [path, browsingHistory], (error, stdout, stderr) => {
            if (error) {
                throw error;
            }
            // console.log("child: ", child);
            recommendations = stdout.split("\n").filter((item) => item != "\n"&& item != "");
            for(var i=0;i<recommendations.length;i++){
                // console.log("stdout: ", i, recommendations[i]);
            }
        
        });
        child.on('exit', function (code, signal) {
            // console.log('child process exited with ' +
                // `code ${code} and signal ${signal}`);
        });
    
        if(recommendations.length!=0){
            // console.log("recommendations: ", recommendations);
            res.json(recommendations);
        }
    }
});

module.exports = router;