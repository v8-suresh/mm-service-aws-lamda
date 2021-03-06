var JsonRefs = require('json-refs');
var YAML = require('yaml-js');
var fs = require('fs');

var buildSwaggerYaml = function(){
    var root = YAML.load(fs.readFileSync('swagger/index.yaml').toString());
    var options = {
        filter: function(ref){
            return ref.uri.indexOf('#/') !== 0;
        },
        includeInvalid: true,
        loaderOptions : {
            processContent: function (res, cb) {
                cb(undefined, YAML.load(res.text));
            }
        },
        relativeBase: 'swagger'
    };
    JsonRefs.resolveRefs(root, options)
        .then(function (res) {
            fs.writeFileSync('./dist/swagger2.json', JSON.stringify(res.resolved, null, 2), 'utf8');
            // fs.writeFileSync('./dist/swagger2.yaml', YAML.dump(JSON.parse(JSON.stringify(res.resolved, null, 2))), 'utf8');
        }, function (err) {
            console.error(err.stack);
        });
};
buildSwaggerYaml();