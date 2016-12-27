var _ = require('lodash');

class CommentList{
    constructor(){
        this.gcode = '';
        this.items = [];
    }
    checkData(actionName){
        if (!this.gcode){
            console.warn(actionName + '时，检查评论列表viewModel，gcode字段为空！');
            return false;
        }
        if (!_.isArray(this.items)){
            console.warn(actionName + '时，检查评论列表viewModel，list字段不是数组类型！');
            return false;
        }
        return true;
    }
}
module.exports = CommentList;