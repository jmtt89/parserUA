module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 9001,
          open: {
            target: 'http://localhost:9001/demo'
          },
          keepalive: true,
          livereload: true
        }
      }
    },

    concat: {
      options: {
        separator: "\n\n"
      },
      dist: {
        src: [
          'src/_intro.js',
          'src/main.js',
          'src/_outro.js'
        ],
        dest: 'dist/<%= pkg.name.replace(".js", "") %>.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name.replace(".js", "") %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name.replace(".js", "") %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    qunit: {
      files: ['test/*.html']
    },

    jshint: {
      files: ['dist/parserUA.js'],
      options: {
        globals: {
          console: true,
          module: true,
          document: true
        },
        jshintrc: '.jshintrc'
      }
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['concat', 'jshint', 'qunit'],
      livereload: {
        files: [
          './demo/*.html',
          './demo/assets/*.css',
          './dist/*.js'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('serve', 'start web server in browser', function() {
    grunt.task.run('default','connect');
  });

  //grunt.registerTask('serve',['concat', 'jshint', 'uglify', 'connect:livereload']);
  grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('default', ['concat', 'jshint', 'qunit', 'uglify']);

};
