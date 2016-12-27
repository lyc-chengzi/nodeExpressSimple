var express = require('express');
var router = express.Router();
var http = require('http');
var cl = require('../viewModels/comments/commentList');
var httpHelper = require('../utils/httpOperation');

//评论列表页路由规则 1-- website/comments/all.html?id=58
router.get('/all.html', function(request, response){
    var query = request.query;
    var model = new cl();
    var url = 'http://www.lenovo.com.cn/api/products/getviewrecommendsmapp?ss=333&w=70&h=70&salesPlat=1&goodsCode='+query.id;
    httpHelper.get(url, null, (data) => {
        console.log('--------------------data----------------');
        console.log(data);
        model.gcode = query.id;
        model.items = [];
        /*如果获取到数据*/
        if(data && data.glist){
            for (var i = 0; i < data.glist.length; i++){
                model.items.push({euser: data.glist[i].gname, edesc: data.glist[i].detailUrl});
            }
            response.render('comment/list', model);
        }
        /*如果没有获取到数据*/
        else{
            response.render('comment/list', model);
        }

    });
});
//评论列表页路由规则 2-- website/comments/58.html
router.get(/\d+\.html/, function(request, response, next){
    var gcode = request.url.match(/\d+\.html/);
    var model = new cl();
    model.gcode = gcode && gcode[0].replace('.html', '');
    model.items=[{euser: '用户1', edesc: '评论11111'}, {euser: '用户2', edesc: '评论222222'}, {euser: '用户3', edesc: '评论333333'},];
    if(model.checkData('加载评论列表页')) {
        response.render('comment/list', model);
    }
});

module.exports = router;

