module.exports = function(grunt) {
    grunt.initConfig({
        // 配置文件，参考package.json配置方式，必须设置项是
        // name, version, author
        // name作为gallery发布后的模块名
        // version是版本，也是发布目录
        // author必须是{name: "xxx", email: "xxx"}格式
        pkg: grunt.file.readJSON('abc.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd h:MM:ss TT") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

        // kmc打包任务，默认情况，入口文件是index.js，可以自行添加入口文件，在files下面
        // 添加
        kmc: {
            options: {
                packages: [
                    {
                        name: '<%= pkg.name %>',
                        path: '../'
                    }
                ],
                map: [["<%= pkg.name %>/", "gallery/<%= pkg.name %>/"]]
            },
            main: {
                files: [
                    {
                        src: "<%= pkg.version %>/index.js",
                        dest: "<%= pkg.version %>/build/index.js"
                    },
                    {
                        src: "<%= pkg.version %>/index-aria.js",
                        dest: "<%= pkg.version %>/build/index-aria.js"
                    }
                ]
            }
        },
        //CSS压缩
        cssmin : {
            build : {
                files :[{
                    expand: true,
                    cwd: '<%= pkg.version %>/build/',
                    src: ['**/*.css', '!*-min.css'],
                    dest: '<%= pkg.version %>/build/',
                    ext: '-min.css'
                }]
            }
        },
        //拷贝文件到build目录
        copy : {
            build:{
                files :[{
                    expand : true,
                    cwd : '<%= pkg.version %>/',
                    src : ['./*.{png,jpg,gif,css,js}'],
                    dest : '<%= pkg.version %>/build/'
                }]
            }
        },
        // 打包后压缩文件
        // 压缩文件和入口文件一一对应
        uglify: {
            options: {
                banner: '<%= banner %>',
                beautify: {
                    ascii_only: true
                }
            },
            base: {
                files :[{
                    expand : true,
                    cwd : '<%= pkg.version %>/build/',
                    src : ['./*.js','!./*-min.js'],
                    dest : '<%= pkg.version %>/build/',
                    ext : '-min.js'
                }]
            }
        },
        yuidoc: {
            compile: {
                name       : '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version    : '<%= pkg.version %>',
                options    : {
                    paths : '<%= pkg.version %>/',
                    outdir: '<%= pkg.version %>/guide/docs/'
                }
            }
        }
    });

    // 使用到的任务，可以增加其他任务
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-kmc');
    return grunt.registerTask('default', ['copy' , 'cssmin', 'kmc', 'uglify']);
};