/* local path 
 cd "P:\quick-adsense-reloaded\github\wp-quads-pro"
server path http://wpquads.com/wp-content/uploads/edd/2016/09/wp-quads-pro.zip
 * 
 */
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        paths: {
            pro_base: '../../releases/wp-quads-pro/tags/<%= pkg.version %>/wp-quads-pro/',
            pro_tag_base: '../../releases/wp-quads-pro/tags/<%= pkg.version %>',
            pro_basetrunk: '../../releases/wp-quads-pro/trunk/',
            pro_basezip: '../../releases/wp-quads-pro/'
        },
        // Tasks here
        // Bump version numbers
        version: {
            css: {
                options: {
                    prefix: 'Version\\:\\s'
                },
                src: ['style.css']
            },
            php: {
                options: {
                    prefix: '\@version\\s+'
                },
                src: ['functions.php', '<%= pkg.name %>.php']
            }
        },
        // minify js
        uglify: {
            build: {
                files: [
                    {'assets/js/quads-pro-admin.min.js': 'assets/js/quads-pro-admin.js'}
                ]
            }
        },
        // Copy to build folder
        copy: {
            build: {
                files: [
                    {expand: true, src: ['**', '!node_modules/**', '!Gruntfile.js', '!package.json', '!nbproject/**', '!grunt/**', '!quick-adsense-reloaded.php', '!grafik/**'],
                        dest: '<%= paths.pro_base %>'}
                ]
            },
        },
        'string-replace': {
            version: {
                files: {
                    '<%= paths.pro_base %>/wp-quads-pro.php': 'wp-quads-pro.php',
                    '<%= paths.pro_base %>/readme.txt': 'readme.txt',
                },
                options: {
                    replacements: [{
                            pattern: /{{ version }}/g,
                            replacement: '<%= pkg.version %>'
                        }]
                }
            }
        },
        // Clean the build folder
        clean: {
            options: {
                force: true
            },
            build: {
                files: [
                    {src: ['<%= paths.pro_base %>']},
                ]

            }
        },
        // Minify CSS files
        cssmin: {
            build: {
                files: [
                    {'assets/css/quads-admin.min.css': 'assets/css/quads-admin.css'}
                ]
            }
        },
        // Compress the build folder into an upload-ready zip file
        compress: {
            build: {
                options:
                        {
                            archive: '<%= paths.pro_basezip %>/wp-quads-pro.zip'
                        },
                files:[
                    {
                    expand: true,
                    cwd: '<%= paths.pro_tag_base %>',
                    src: ['**/*'],
                    //dest: '<%= paths.pro_basezip %>'
                    }
                ]
            }
        }


    });

    // Load all grunt plugins here
    // [...]
    //require('load-grunt-config')(grunt);
    require('load-grunt-tasks')(grunt);

    // Display task timing
    require('time-grunt')(grunt);

    // Build task
    //grunt.registerTask( 'build', [ 'compress:build' ]);
    grunt.registerTask('build', ['clean:build', 'uglify:build', 'cssmin:build', 'copy:build', 'string-replace:version', 'compress:build']);
};