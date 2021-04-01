import { _decorator, Component, Node } from 'cc';
const { ccclass } = _decorator;

@ccclass('BasisScene')
export class BasisScene extends Component {

    private _underNodes:Array<Node> = new Array<Node>();

    onLoad(){
        this._initTempNode();
        console.log("---------------------------------------------------- "+this.name+" start ----------------------------------------------------");
    }
    onDestroy(){
        console.log("---------------------------------------------------- "+this.name+" end ----------------------------------------------------");
    }
    public setUnderNodeVisible(bo:boolean){
        for (let i = 0; i < this._underNodes.length; i++) {
            let node = this._underNodes[i];
            node.active = bo;
        }
    }
    public setUnderNode(underNode:Node){
        this._underNodes.push(underNode);
    }
    public getCanvas():Node | null{
        return null;
    }
    private _initTempNode(){
        for (let i = 0; i < 5; i++) {
            let tempNode = new Node();
            tempNode.parent = this.getCanvas();
        }
    }
}
