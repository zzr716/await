import fs from 'fs'; // fs = require('fs') es6 js 模块化方案
import path from 'path'; 
// let fs = require('fs'); // common.js模块化方案
// let path = require('path');
// let request = require('request');
import request from 'request';
const movieDir = __dirname + '/movies',
    exts = ['.mkv', '.avi', '.mp4', '.rm', '.rmvb', '.wmv']
function readFiles () {
    return new Promise((resolve, reject) => {
        // resolve()
        fs.readdir(movieDir, (err, files) => {
            // file是数组filter方法， 过滤条件 为真/假
            resolve(files.filter(file => 
                exts.includes(
                    path.parse(file).ext)
                )
            );
            // [ '千与千寻.mkv', '盗梦空间.mkv', '肖申克的救赎.mkv' ]
            
        })
    })
}
function getPoster (name) {
    let url = `https://api.douban.com/v2/movie/search?q=${encodeURI(name)}`;
    console.log(url);
    return new Promise((resolve, reject) => {
        request({
            url: url,
            json: true
        }, (error, response, body) => {
            if (error)
                return reject(error)
            resolve(body.subjects[0].images.large)
        })
    })
}
let savePoster = (name, url) => {
    // 图片 二进制流 流向本地文件夹movies
    // createWriteStream 持续写入流
    // pipe 将两个流接起来，
    request.get(url).pipe(
        fs.createWriteStream(path.join(movieDir, name + '.jpg'))
    )
}
(async () => {
    let files = await readFiles();
    for (let file of files) {
        let { name } = path.parse(file);
        console.log(`正在获取[${name}]的海报`)
        // let post_url = await getPoster(name);
        // console.log(post_url)
        try {
            savePoster(name, await getPoster(name))
        } catch (e) {
            console.log(e)
        }
        
    }
})()
// const movies = ["霸王别姬", "千与千寻", "断背山"]
// // 每部电影封面请求中间插一个sleep 1000s
// var sleep = function () {
//     return new Promise((resolve, reject) => {
//         setTimeout(function () {
//             resolve();
//         }, 1000)
//     })
// }
// var start = async function () {
//     var http = require('http'),
//         https = require('https'),
//         url = 'https://api.douban.com/v2/movie/search?q=%E9%9C%B8%E7%8E%8B%E5%88%AB%E5%A7%AC';
//     http.get(url, function (res) {
//         console.log(res)
//     })
//     // for (movie of movies) {
//     //     await sleep()
//     // }
// }