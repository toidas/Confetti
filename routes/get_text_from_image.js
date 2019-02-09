var fs = require('fs');
var keyAPI = ""
function get_text(){
    return new Promise(function(resolve, reject) {
        fs.readFile('tmp.png', function(err, data) {
            var querystring = require('querystring');
            let request = require('request');
            var myJSONObject = {
                "requests":[{
                    'image': {'content': data.toString('base64')},
                    'features': [{
                        'type': 'TEXT_DETECTION',
                        'maxResults': 1
                    }]
                }]
            };
            request({
                url: "https://vision.googleapis.com/v1/images:annotate?key="+keyAPI,
                method: "POST",
                json: true,   // <--Very important!!!
                body: myJSONObject
            }, function (error, response, body){
                console.log(body['responses'][0]['fullTextAnnotation']['text']);
                let question = cut_question(body['responses'][0]['fullTextAnnotation']['text']);
                resolve(get_result_from_google(question));
            });
        });
    });
}

function get_result_from_google(question){
    return ('http://www.google.com/search?q='+question);
    // request('http://www.google.com/search?q=', function (error, response, body) {
    //     console.log('error:', error); // Print the error if one occurred
    //     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //     console.log('body:', body); // Print the HTML for the Google homepage.
    //     res.redirect('http://www.google.com');
    //     // res.render('index', {
    //     //     title: question,
    //     //     data: "<html><h1>AAAAAAAAAAAAA</h1></html>"
    //     // });
    // });
}

function cut_question(result){
    var n = result.indexOf("?");
    return result.substring(0, n+1);
} 

function crop_image() {
    return new Promise(function(resolve, reject) {
        var exec = require('child_process').exec;
        dir = exec("gm convert -crop 700x550+0+800 screenshot.png tmp.png", function(err, stdout, stderr) {
        if (err) {
            console.log(err);
            reject();
        }
            console.log(stdout);
        });

        dir.on('exit', function (code) {
            //console.log("xong crop")
            resolve();
        });
    });
}

function get_image(){
    return new Promise(function(resolve, reject) {
        var exec = require('child_process').exec;
        dir = exec("adb shell screencap -p | sed 's/$//' > screenshot.png", function(err, stdout, stderr) {
        if (err) {
            console.log(err);
            reject();
        }
            console.log(stdout);
        });

        dir.on('exit', function (code) {
            //console.log("xong")
            resolve();
        });
    });
}

exports.index = function(req, res) {
    get_image().then(function (resp){
        return crop_image();
    }).then(function (resp){
        return get_text();
    }).then(function (resp){
        console.log("xong");
        res.redirect(resp);
    })
    .catch(function (resp){})
    //get_text();
};