/*
Grunt Task Manager
------------------
Handles the Sass to CSS Compiling 
Also started configuring to compile the JS into 1 file, 
- Before dependency management of the JS files must be implemented

*/

module.exports = function (grunt) {
    grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
        options: {
            includePaths: ['bower_components/foundation/scss']
        },
        dist: {
        options: {
            outputStyle: '',
            sourceMap: false,
        },
        files: {
            'css/app.css': 'scss/app.scss'
        }
        }
    },
    cmq: {
        options: {
            log: true
        },
        your_target: {
            files: {
                'css': ['css/*.css']
            }
        }
    },
    cssmin: {
        options: {
            sourceMap: true
        },
        target: {
            files: [{
                expand: true,
                cwd: 'css/',
                src: ['app.css'],
                dest: 'css/',
                ext: '.min.css'
            }]
        }
    },
    watch: {
        grunt: {
        options: {
            reload: true
        },
            files: ['Gruntfile.js']
        },

        sass: {
            files: 'scss/**/*.scss',
            tasks: ['watch-compile-css']
        }
    },
    uglify: {
        all_src: {
            options: {
                beautify: true,
                mangle: false,
                sourceMap: true,
                sourceMapName: 'sourceMap.map'
            },
            src: 'js/src/**/*.js',
            dest: 'js/dist/app.min.js'
        }
    }
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-combine-media-queries');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('init-build', ['sass']);
    grunt.registerTask('watch-compile-css', ['sass', 'cmq', 'cssmin']);
    grunt.registerTask('watch-compile-js', ['uglify']);
    grunt.registerTask('default', ['init-build', 'watch']);
}
