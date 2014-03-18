'use strict';
var util = require('util');
var path = require('path');
var jade = require('jade');
var fs = require('fs');
var html = '';
var yeoman = require('yeoman-generator');


var LincsappGenerator = module.exports = function LincsappGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(LincsappGenerator, yeoman.generators.Base);

LincsappGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    type: 'input',
    name: 'appName',
    message: 'What is the name of your app?',
    default: 'LincsApp'
  },
  {
    type: 'input',
    name: 'appDescription',
    message: 'Give me a short description of your app',
    default: 'The New Hotness'
  }];

  this.prompt(prompts, function (props) {
    this.appName = props.appName;
    this.appDescription = props.appDescription;

    cb();
  }.bind(this));
};

LincsappGenerator.prototype.app = function app() {
  var self = this;
  // create an app directory to hold the app we are buiding
  this.mkdir('app');

  // create an views directory to hold the jade template we are
  // going to build the index.html for the app from
  this.mkdir('views');

  // copy the app.jade template to the views file
  this.copy('app.jade', 'views/app.jade');

  // compile and render the html template
  fs.readFile(path.join(__dirname, 'templates/app.jade'), 'utf8', function (err, data) {
    if (err) throw err;
    var fn = jade.compile(data,{pretty:true});
    html = fn({appName:self.appName, appDescription: self.appDescription});
    // write the rendered html string to file
    fs.writeFile("app/index.html", html, function(err) {
      if(err) {
          console.log(err);
      } else {
          console.log("created app/index.html");
      }
    });
  });

  // copy the default Gruntfile.js to the base directory after processing
  this.template('_Gruntfile.js', 'Gruntfile.js');

  // copy the default package.json to the base directory after processing
  this.template('_package.json', 'package.json');
    
  // copy the default package.json to the base directory after processing
  this.template('_barista_config.json', 'app/barista_config.json');
};

LincsappGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};
