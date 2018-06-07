module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-ng-annotate');
    // Project configuration.
    grunt.initConfig({

        //Minifies the HTML code//
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    src: ['app/**/*.html'],
                    dest: 'build/'
                }]
            }
        },


        //Minifies Images//
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    src: ['assets/images/**/*.{png,jpg,jpeg,gif}'],//'{,*/}*.{png,jpg,jpeg,gif}',
                    dest: 'build/'
                }]
            }
        },


        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: 'index.html',
            options: {
                dest: 'build'
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['build/index.html']
        },

        // Copies remaining files to places other tasks can use
        copy: {
            index: {
                src: ['index.html'], dest: 'build/index.html'
            },
            data: {
                files: [{
                    expand: true,
                    src: ['web.config','sites-enabled/**','assets/fonts/**','app/*.html','app/**/*.html','assets/images/**'],
                    dest: 'build/'
                }]
            }
        },

        ngAnnotate: {
            options: {
                add: true,
                remove: true,
                singleQuotes: true,
                separator: ';'
            },
            dist: {
                files: [{
                    expand: true,
                    src: ['app/**/*.js'],
                    extDot: 'last'
                }]
            }
        },

        sonarRunner: {
            analysis: {
                options: {
                    debug: true,
                    separator: '\n',
                    sonar: {
                        host: {
                            url: 'http://rsjs002:9000'
                        },
                        jdbc: {
                            url: 'jdbc:mysql://rsjs002:3306/sonarqube?useUnicode=true',
                            username: 'sonarqube_user',
                            password: 'rspl123#'
                        },
                        projectHome: 'app',
                        projectKey: 'MCE',
                        projectName: 'Depricated',
                        projectVersion: '1.1',
                        sources: ['app'].join(','),
                        language: 'js',
                        sourceEncoding: 'UTF-8'
                    }
                }
            }
        },

        clean: ['build', '.tmp']
    });

    require('time-grunt')(grunt);

    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
    });

    grunt.registerTask('sonarTest', [
        'sonarRunner'
    ]);
    // Default task(s).
    grunt.registerTask('default', ['ngAnnotate', 'clean', 'useminPrepare', 'concat', 'cssmin', 'uglify', 'copy:index','copy:data', 'usemin', 'imagemin']);

};
