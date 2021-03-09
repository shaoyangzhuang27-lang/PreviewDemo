
import { _decorator, Component, Node, ToggleContainer, EventHandler, Toggle, Vec3, tween, ScrollView, Game, resources, instantiate } from 'cc';
import { GameModel } from '../../model/GameModel';
import { ItemEquipCell } from './ItemEquipCell';
const { ccclass, property } = _decorator;

@ccclass('BagMain')
export class BagMain extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property({type: ToggleContainer })
    public selectGroup:ToggleContainer | null = null;
    
    @property({type: Node })
    public fragNode:Node | null = null;
    
    @property({type: Node })
    public equipNode:Node | null = null;
    
    @property({type: Node })
    public propsNode:Node | null = null;
    
    @property({type: Node })
    public pNode:Node | null = null;
    
    @property({type: Node })
    public btnClose:Node | null = null;

    @property({type :  ScrollView})
    public scroll_EquipView:ScrollView = null as unknown as ScrollView;

    @property({type :  ScrollView})
    public scroll_ItemView:ScrollView = null as unknown as ScrollView;

    start () {
        // [3]
        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'BagMain';// 这个是代码文件名
        containerEventHandler.handler = 'tabClick';
        containerEventHandler.customEventData = '';
        this.selectGroup?.checkEvents.push(containerEventHandler);
        this.btnClose?.on(Node.EventType.TOUCH_END, this.closeHandle, this);
        this.show();
    }
    
    tabClick(event: Event, customEventData: string){
        let tog:Toggle = (event as any);
        if(!(this.fragNode && this.equipNode && this.propsNode) )return;

        if(tog.node.name == "Toggle1"){
            this.fragNode.active = true;
            this.equipNode.active = false;
            this.propsNode.active = false;
        }else if(tog.node.name == "Toggle2"){
            this.fragNode.active = false;
            this.equipNode.active = true;
            this.propsNode.active = false;
        }else{
            this.fragNode.active = false;
            this.equipNode.active = false;
            this.propsNode.active = true;
        }
    }
    show(){
        tween(this.pNode)
        .to(0.1,{position:new Vec3(this.pNode?.getPosition().x,-340,0)})
        .call(() => {
            this._initScrollview()
        }).start()
    }
    hide(){
        
        tween(this.pNode)
        .to(0.1,{position:new Vec3(this.pNode?.getPosition().x,-900,0)})
        .call(() => {
            this.node.removeFromParent();
        }).start()
    }
    closeHandle(){
        this.hide();
    }

    private _initScrollview()
    {
        this._initEquipScrollview()
    }

    private _initEquipScrollview()
    {
        let allEquipList = GameModel.getInstance().getBagModel().getBagEquipList();
        resources.load('prefabs_ui/main/itemEquipCell', (err:any,res:any)=>{
            for (let key of allEquipList.keys()) {
                let value = allEquipList.get(key);  //数量
                // let equipData = ValueMgr.getInstance().getItemByField(TableName.equip,Number(key)) as Config.equip.Record;
                let equipCell = instantiate(res) as Node;
                this.scroll_EquipView.content?.addChild(equipCell);

                let script = equipCell.getComponent("ItemEquipCell") as ItemEquipCell;
                script.setItemType(Number(key),Number(value),2,(id:number,num:number)=>{
                    this._itemEqipCallBack(id,num)
                })
            }
        })   
    }

    private _itemEqipCallBack(itemID:number,itemType:number)
    {

    }

    onDestroy()
    {

    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
