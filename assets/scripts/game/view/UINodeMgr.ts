import { _decorator, Node } from 'cc';
const { ccclass } = _decorator;

@ccclass('UINodeMgr')
export class UINodeMgr{
    static nodeList : any = {}; 
    // 缓存一份功能node表单
    static regNodeWithKey(node : Node, key : string){
        UINodeMgr.nodeList[key] = node
    }

    static unRegNodeWithKey(key : string){
        UINodeMgr.nodeList[key] = undefined
    }

    static resetNodeList(){
        UINodeMgr.nodeList = {}
    }

    static getNodeWithKey(key : string){
        return UINodeMgr.nodeList[key]
    }

    // 在界面创建时注册
    // 界面销毁时删除
}
