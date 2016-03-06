/**
 * Created by paul on 2/5/16.
 */

module.exports = function (grunt) {
  'use strict';
  grunt.initConfig({
    path: {
      app: 'src/app',
      server: 'src/server',
      build: 'build',
      release: 'release'
    },

    jshint: {
      frontend: {
        src: ['<%= path.app %>/**/*.js']
      },
      node: {
        src: ['Gruntfile.js', '<%= path.server %>/**/*.js'],
        jshintrc: '<%= path.server %>/.jshintrc'
      }
    },

    jscs: {
      main: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        config: '.jscsrc'
      }
    },

    concat: {
      options: {
        sourceMap: true
      },
      jsDev: {
        src: ['<%= path.app %>/**/*.js'],
        dest: '<%= path.release %>/js/myApp.js'
      },
      cssDev: {
        src: ['<%= path.app %>/**/*.css'],
        dest: '<%= path.release %>/css/myApp.css'
      }
    },

    copy: {
      release: {
        files: [
          {
            src: ['<%= path.app %>/index.html'],
            dest: '<%= path.release %>/index.html'
          }
        ]
      }
    },

    wiredep: {
      target: {
        src: ['src/app/index.html', 'karma.conf.js'],
        overrides: {
          bootstrap: {
            main: [
              'less/bootstrap.less',
              'dist/css/bootstrap.css',
              'dist/js/bootstrap.js'
            ]
          }
        }
      }
    },

    ngtemplates: {
      options: {
        module: 'myApp'
      },
      app: {
        cwd: '<%= path.app %>',
        src: ['**/!(index)*.html'],
        dest: '<%= path.release %>/js/templatesCache.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-angular-templates');

  grunt.registerTask('default', [
    'jshint:frontend',
    'jshint:node',
    'jscs',
    'concat',
    'wiredep',
    'ngtemplates',
    'copy'
  ]);

};
