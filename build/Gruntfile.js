module.exports = function(grunt) {
  'use strict';

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    fixturesPath: 'fixtures',

    less: {
      development: {
        options: {
          sourceMap: false,
          sourceMapFilename: 'css/main.css.map',
          sourceMapRootpath: '/'
        },
        files: {
          'css/main.css':       'less/main.less',
          'css/main--bw.css':   'less/main--bw.less',
          'css/main--wb.css':   'less/main--wb.less',
        }
      },
    },
    
    autoprefixer: {
      dist: {
        files: {
          'css/main-prefixed.css':     'css/main.css',
          'css/main-prefixed--bw.css': 'css/main--bw.css',
          'css/main-prefixed--wb.css': 'css/main--wb.css',
        }
      }
    },

    /*
    csso: {
      compress: {
        options: {
          report: 'min',
        },
        files: {
          'css/main.min.css': 'css/main-prefixed.css',
          'css/main--bw.min.css': 'css/main-prefixed--bw.css'
        }
      }
    },
*/
    cssmin: {
      main: {
        options: {
          keepSpecialComments: 0,
          sourceMap: true,
          sourceMapFilename: 'css/main.css.map',
          sourceMapRootpath: '/',
          addComment: true
        },
        files: {
          'css/main.min.css':         'css/main-prefixed.css',
          'css/main--bw.min.css':     'css/main-prefixed--bw.css',
          'css/main--wb.min.css':     'css/main-prefixed--wb.css',
        }
      }
    },

    svgmin: {
      options: {
        plugins: [
          { removeViewBox: false },
          { removeUselessStrokeAndFill: false },
          { removeEmptyAttrs: false }
        ]
      },
      dist: {
        files: [{
          expand: true,
          //cwd: 'img',
          src: ['img/_dist/*.svg', 'img/_icons/*.svg'],
          //src: ['{,*/}_dist/*.svg', '{,*/}_icons/*.svg'],
          dest: 'img/_svgmin'
        }]
      }
    },

    svgstore: {
      options: {
      },
      default : {
        files: {
          'img/store.svg': ['img/_svgmin/**/*.svg'],
        },
      },
    },

    clean: ['img/_svgmin'],

    concat: {
      options: {
        //separator: ';',
      },
      dist: {
        src: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/bootstrap/dist/js/bootstrap.js',

          'bower_components/blueimp-gallery/js/blueimp-gallery.js',
          'bower_components/blueimp-gallery/js/blueimp-gallery-fullscreen.js',
          'bower_components/blueimp-gallery/js/blueimp-gallery-indicator.js',
          'bower_components/blueimp-gallery/js/blueimp-gallery-video.js',
          'bower_components/blueimp-gallery/js/blueimp-gallery-youtube.js',
          'bower_components/blueimp-gallery/js/jquery.blueimp-gallery.js',

          'bower_components/gsap/src/uncompressed/TweenLite.js',
          'bower_components/gsap/src/uncompressed/TimelineLite.js',
          'bower_components/gsap/src/uncompressed/easing/EasePack.js',
          'bower_components/gsap/src/uncompressed/plugins/CSSPlugin.js',
          'bower_components/gsap/src/uncompressed/plugins/ScrollToPlugin.js',
          'bower_components/gsap/src/uncompressed/jquery.gsap.js',

          'bower_components/cookies-js/dist/cookies.js',

          'js/_*.js'
        ],
        dest: 'js/main.js',
      },
    },

    rig: {
      compile: {
        options: {
        },
        files: {
          'js/main.js': ['js/_main.js']
        }
      }
    },

    uglify: {
      build: {
        src: 'js/main.js',
        dest: 'js/main.min.js'
      }
    },

    htmlbuild: {
      dist: {
        src: [
          //'<%= fixturesPath %>/templates/main.html',
          '<%= fixturesPath %>/templates/about.html',
          //'<%= fixturesPath %>/templates/person.html',
          //'<%= fixturesPath %>/templates/kafedra.html',
          //'<%= fixturesPath %>/templates/kty.html',
          '<%= fixturesPath %>/templates/boss.html',
          '<%= fixturesPath %>/templates/mnp.html',
          '<%= fixturesPath %>/templates/news-list.html',
          '<%= fixturesPath %>/templates/news-item.html',
          '<%= fixturesPath %>/templates/str-admin.html',
          //'<%= fixturesPath %>/templates/str-admin-item.html',
          '<%= fixturesPath %>/templates/mop.html',
          //'<%= fixturesPath %>/templates/person-list.html',
          //'<%= fixturesPath %>/templates/phone-list.html',
          '<%= fixturesPath %>/templates/faq.html',
          '<%= fixturesPath %>/templates/activity-list.html',
          '<%= fixturesPath %>/templates/activity-item.html',
          '<%= fixturesPath %>/templates/root-page.html',
          '<%= fixturesPath %>/templates/video.html'
        ],
        dest: './',
        options: {
          beautify: true,
          sections: {
            views: {
              about:      '<%= fixturesPath %>/views/about.html',
              boss:       '<%= fixturesPath %>/views/boss.html',
              //kafedra:    '<%= fixturesPath %>/views/kafedra.html',
              //kty:        '<%= fixturesPath %>/views/faq-kty.html',
              //person:     '<%= fixturesPath %>/views/person.html',
              mnp:        '<%= fixturesPath %>/views/mnp.html',
              newsList:   '<%= fixturesPath %>/views/news-list.html',
              newsItem:   '<%= fixturesPath %>/views/news-item.html',
              strAdmin:   '<%= fixturesPath %>/views/str-admin.html',
              //strAdminItem:   '<%= fixturesPath %>/views/str-admin-item.html',
              mop:        '<%= fixturesPath %>/views/mop.html',
              //personList: '<%= fixturesPath %>/views/person-list.html',
              //phoneList:  '<%= fixturesPath %>/views/phone-list.html',
              faq:        '<%= fixturesPath %>/views/faq.html',
              actList:    '<%= fixturesPath %>/views/activity-list.html',
              actItem:    '<%= fixturesPath %>/views/activity-item.html',
              rootPage:   '<%= fixturesPath %>/views/root-page.html',
              video:      '<%= fixturesPath %>/views/video.html'
            },

            templates: '<%= fixturesPath %>/templates/**/*.html',

            layout: {
              header:       '<%= fixturesPath %>/layout/header.html',
              //sliderMain:   '<%= fixturesPath %>/layout/slider-main.html',
              //newsMain:     '<%= fixturesPath %>/layout/news-main.html',
              //activityMain: '<%= fixturesPath %>/layout/activity-main.html',
              footer:       '<%= fixturesPath %>/layout/footer.html',
              share:        '<%= fixturesPath %>/layout/share.html',
              lightbox:     '<%= fixturesPath %>/layout/lightbox.html'
            }
          }
        }
      }
    },

    nunjucks: {
      options: {
        data: grunt.file.readJSON('data.json'),

        //paths: "templates"
      },
      render: {
        files: [{
          //'index.html' : ['templates/index.njk']
          expand: true,
          cwd: "templates",
          src: ["*.njk"],
          dest: "",
          ext: ".html"
        }],
      }
    },

    prettify: {
      options: {
        "indent": 2,
        "indent_char": " ",
        //"wrap_line_length": 250,
        //"brace_style": "collapse",
        "preserve_newlines": true,
        //"condense": true,
        "max_preserve_newlines": 2,
        "unformatted": ["code", "pre"]
      },
      all: {
        expand: true,
        cwd: "",
        src: ["*.html"],
        dest: "",
        //ext: ".html"
      }
    },

    watch: {
      options: {
        spawn: false,
        //livereload: true
      },
      scripts: {
        files: ['js/_*.js'],
        tasks: ['rig', 'uglify'],
      },
      styles: {
        files: ['**/*.less'],
        tasks: ['less', 'autoprefixer', 'cssmin'],
      },
      html: {
        files: [
          '<%= fixturesPath %>/layout/*.html',
          '<%= fixturesPath %>/templates/*.html',
          '<%= fixturesPath %>/views/*.html'
        ],
        tasks: ['htmlbuild']
      },
      njk: {
        files: ['**/*.njk'],
        tasks: ['nunjucks']//, 'prettify'],
      },
      svg: {
        files: [
          'img/_dist/*.svg',
          'img/_icons/*.svg'
        ],
        tasks: ['clean', 'svgmin', 'svgstore']
      },
      /*gruntfile: {
        files: 'gruntfile.js',
        options: {
          spawn: false,
          //livereload: true,
          //reload: true
        }
      }*/
    },

    connect: {
      server: {
        options: {
          port: 35729,
          hostname: 'localhost',
          //livereload: true,
          //keepalive: true
        }
      }
    }

  });

  grunt.registerTask('default', [
    'less',
    'autoprefixer',
    'cssmin',
    'rig',
    'uglify',
    'htmlbuild',
    'nunjucks',
    'clean',
    'svgmin',
    'svgstore'
  ]);

  // Start web server
  grunt.registerTask('serve', ['connect:server', 'watch']);

};
