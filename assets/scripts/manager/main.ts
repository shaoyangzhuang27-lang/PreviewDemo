// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { Basescene } from "./basescene";
import { loadCsv } from './ccCsvParser' // 首先引入 loadCsv 这个函数 
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property({type: cc.Prefab, displayName: "test"})
    public path:cc.Prefab[] = [];

    @property({type: cc.Node, displayName: "test3"})
    public path3:cc.node[] = [];
 
    start () {
        const url = './activity' // 这里是你要加载的 csv 文件的路径 （相对于项目 resources 目录的路径）
        loadCsv(url)
        .then((ccCsv) => { // 这个函数返回 Promise， Promise 的回调函数参数是一个 CCcsv 对象，其 getParsedData 方法返回被解析的数据（二维数组）
            const data = ccCsv.getParsedData()
            for (var i = 0; i < data.length; ++i) {
                for (var j = 0; j < data[i].length; ++j) {
                    console.log(data[i][j]);
                }
            }
        })
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
