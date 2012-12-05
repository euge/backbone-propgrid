/*global module:false, require:false */
module.exports = function(grunt) {

  var _inspect = require("sys").inspect;

  function inspect(obj) {
    log(_inspect(obj));
  }

  function log(stuff) {
    grunt.log.writeln(stuff);
  }

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0'
    },
    lint: {
      files: ['grunt.js', 'lib/*.js', 'test/**/*.js']
    },
    concat: {
      dist: {
        src: ['lib/propgrid.js', 'lib/row.js', 'lib/value_base.js', 'lib/value_show_base.js', 'lib/value_edit_base.js', 'lib/text.js', 'lib/select.js'],
        dest: 'dist/propgrid_dist.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/FILE_NAME.min.js'
      }
    },
    cleanwhitespace: {
      lib : {
        src : '<config:concat.dist.src>'
      }
    },
    watch: {
      files: '<config:concat.dist.src>',
      tasks: 'concat'
    },
    jasmine : {
      src : [
        'lib/vendor/json2.js',
        'lib/vendor/jquery-1.7.2.js',
        'lib/vendor/underscore-1.3.1.min.js',
        'lib/vendor/backbone-0.9.2-d862436d2e.js',
        'lib//*.js'
      ],
      specs : 'spec/**/*.js'
    },
    mocha: {
      all: {
        src: [ 'spec/runner.html' ],

        // mocha options
        mocha: {
        },

        // Indicates whether 'mocha.run()' should be executed in 'mocha-helper.js'
        run: true
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        multistr : true
      },
      globals: {
        jQuery: false,
        $: false,
        Backbone : false,
        _ : false,
        jasmine : false,
        describe : false,
        beforeEach : false,
        expect : false,
        it : false,
        spyOn : false,
        Propgrid : true
      }
    },
    uglify: {}
  });

  grunt.loadNpmTasks('grunt-jasmine-runner');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask('default', 'lint mocha');
  grunt.registerTask('spec', "concat mocha");
  grunt.registerMultiTask("cleanwhitespace", "Removes leading and trailing whitespace", function() {
    var contents, files = grunt.file.expandFiles(this.file.src);

    files.forEach(function(filepath) {
      contents = grunt.task.directive(filepath, grunt.file.read);
      grunt.file.write(filepath, contents.replace(/[\t ]+$/gm, ""));
    });

  });
  grunt.registerTask("prep", "lint cleanwhitespace concat mocha");


};
