/**
 * 游戏组件:一键升星
 * @author 施敏昭
 * @version 1.0.0,2021.3.16
 */
import { _decorator,ScrollView,Widget,Button,Vec3, EventHandler, instantiate, Component, resources, Node,LabelComponent } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { HeroData } from '../../model/datas/HeroData';
import { GameModel } from '../../model/GameModel';
import { TableName, ValueMgr } from "../../model/ValueMgr";
import { HeroIcon } from '../hero/HeroIcon';
import { MsgMgr } from '../../control/MsgMgr';
const { ccclass, property } = _decorator;

@ccclass('PopOneKeyStarUp')
export class PopOneKeyStarUp extends PopBase {
    @property({type: Node, displayName: "一键升星"})
    public btn_submit:Node | null = null;

    @property({type :  ScrollView, displayName: "滚动区域"})
    public scroll_HeroView:ScrollView = null as unknown as ScrollView;

    @property({type :  Node, displayName: "子项节点"})
    public itemNode:Node = null as unknown as Node;

    //拥有的所有英雄
    private _allHeroList:Map<number, HeroData> = new Map<number, HeroData>();
    //拥有的所有英雄
    private _copyAllHeroList:Map<number, HeroData> = new Map<number, HeroData>();

    //符合升星条件的组合
    private _starUpHeroIDs:Msg.HeroStarUpMultiR = new Msg.HeroStarUpMultiR();

    private _curStarupType:number = 0;        //当前选择的升星材料类型
    private _curStarupParam:number = 0;        //当前选择的升星材料参数ID或星
    private _curStarupNum:number = 3;        //当前选择的升星材料数量


    start () {
        super.start();
        this.btn_submit?.on(Node.EventType.TOUCH_END, this._onSubmit, this);

        this._getAllHeroList();
        this._getStarUpList();
        this._initBottomHeros();
    }

    public setCloseCallBack(func:Function | null){
        if(func)
            this._closeFunc = func;
    }

    //********************** */
    //获取升星列表英雄
    private _getAllHeroList(){
        this._allHeroList = GameModel.getInstance().getHeroList();
        //剔除满星级英雄
        for (let heroData of this._allHeroList.values()) {
            if(heroData.getStar() >= 13){
                this._allHeroList.delete(heroData.getDyncID());
            }
        }
        //剔除2星怪 不能升星的
        for (let heroData of this._allHeroList.values()) {
            let heroDataes = ValueMgr.getInstance().getTableByName(TableName.heroes).records ;
            for (let herodata of heroDataes) {
                let record = herodata as Config.heroes.Record;
                if(record.id == heroData.getStaticID()) { 
                    if(record.starupType == 0){
                        this._allHeroList.delete(heroData.getDyncID());
                    }
                    break;
                }
            }
        }
    }
    //获取符合升星条件的组合
    private _getStarUpList(){
        let HeroIDs:Msg.HeroIDs = new Msg.HeroIDs();
        for(let heroData of this._allHeroList.values()){
            this._copyAllHeroList.set(heroData.getDyncID(),heroData);
        }
        for (let heroData of this._copyAllHeroList.values()) {
            this._getHeroesDatas(heroData.getStaticID());
            for (let heroData2 of this._copyAllHeroList.values()){
                if(this._curStarupType == 1){
                    if(heroData2.getStaticID() == heroData.getStaticID() 
                    && heroData2.getDyncID() != heroData.getDyncID() ){
                        HeroIDs.heroIDList.push(heroData2.getDyncID());
                        if(HeroIDs.heroIDList.length == this._curStarupNum){
                            break;
                        }
                    }
                }else if(this._curStarupType == 2){
                    if(heroData2.getStar() == this._curStarupParam
                    && heroData2.getDyncID() != heroData.getDyncID() ){
                        HeroIDs.heroIDList.push(heroData2.getDyncID());
                        if(HeroIDs.heroIDList.length == this._curStarupNum){
                            break;
                        }
                    }
                }
            }
            if(HeroIDs.heroIDList.length == this._curStarupNum){
                this._starUpHeroIDs.heroAndMaterial[heroData.getDyncID()] = HeroIDs;
                this._copyAllHeroList.delete(heroData.getDyncID());
                for(let key of HeroIDs.heroIDList){
                    this._copyAllHeroList.delete(key);
                }
            }
            
            HeroIDs = new Msg.HeroIDs();
        }      
    }
    private _getHeroesDatas(StaticID:number)
    {
        let heroDataes = ValueMgr.getInstance().getTableByName(TableName.heroes).records ;
        for (let herodata of heroDataes) {
            let record = herodata as Config.heroes.Record;
            if(record.id == StaticID) { 
                this._curStarupType = record.starupType;
                this._curStarupParam = record.starupParam;
                this._curStarupNum = record.starupNum;
                break;
            }
        }
    }
    //根据动态ID获取HeroData
    private _getHeroData(ID:number){
        for (let heroData of this._allHeroList.values()) {
            if(heroData.getDyncID() == ID){
                return heroData;
            }
        }
    }
    //滚动区域列表
    private _initBottomHeros(){
        this._getAllHeroList();
        let item = this.itemNode;
        let index = 0;

        resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
            for (let key in this._starUpHeroIDs.heroAndMaterial){
                let heroList = this._starUpHeroIDs.heroAndMaterial[key];
                let item1 = instantiate(item)  as Node; 
                item1.name = "itemNode" + index;
                item1.active = true;
                let imgIndex = 1;

                //升星英雄
                let heroData = this._getHeroData(Number(key))
                let heroIcon = instantiate(res) as Node;
                heroIcon.scale = new Vec3(0.5,0.5,1);
                heroIcon.addComponent(Widget);
                let script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
                script.setHeroData(heroData as HeroData); 
                let node1 = item1.getChildByName("img_info_head"+imgIndex) as Node;
                node1.addChild(heroIcon);
                imgIndex++;

                //升星材料
                for (let key2 in heroList.heroIDList){
                    heroData = this._getHeroData(Number(heroList.heroIDList[Number(key2)]))
                    heroIcon = instantiate(res) as Node;
                    heroIcon.scale = new Vec3(0.5,0.5,1);
                    heroIcon.addComponent(Widget);
                    script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
                    script.setHeroData(heroData as HeroData); 
                    node1 = item1.getChildByName("img_info_head"+imgIndex) as Node;
                    node1.addChild(heroIcon);
                    imgIndex++;
                }

                //升星后英雄
                heroData = this._getHeroData(Number(key))
                heroIcon = instantiate(res) as Node;
                heroIcon.scale = new Vec3(0.5,0.5,1);
                heroIcon.addComponent(Widget);
                script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
                script.setHeroData(heroData as HeroData); 
                script.addOneStar()
                node1 = item1.getChildByName("img_info_head4") as Node;
                node1.addChild(heroIcon);

                //添加按钮事件
                var clickEventHandler = new EventHandler();
                clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
                clickEventHandler.component = "PopOneKeyStarUp";//这个是代码文件名
                clickEventHandler.handler = "itemClick";
                clickEventHandler.customEventData = index.toString();
                let btnItem = item1.getChildByName("btn_check")?.getComponent(Button);;
                if(btnItem){
                    btnItem.clickEvents.push(clickEventHandler);
                }
    
                this.scroll_HeroView.content?.addChild(item1);
                index++;
            }
        })    
    }

    //子项勾选
    private itemClick(event: Event, customEventData: string){
        console.log("子项勾选"+customEventData);
        if(this.scroll_HeroView.content){
            let itemNode = this.scroll_HeroView.content.getChildByName("itemNode"+customEventData);
            if(itemNode){
                let img_check = itemNode.getChildByName("img_check") as Node;
                img_check.active = !img_check.active;
            }
        }     
    }

    //一键升星
    private _onSubmit(){
        let starUpHeroIDs:Msg.HeroStarUpMultiR = new Msg.HeroStarUpMultiR();
        let index = 0;
        for (let key in this._starUpHeroIDs.heroAndMaterial){
            if(this.scroll_HeroView.content){
                let itemNode = this.scroll_HeroView.content.getChildByName("itemNode"+index);
                if(itemNode){
                    let img_check = itemNode.getChildByName("img_check") as Node;
                    if(img_check.active == true){
                        starUpHeroIDs.heroAndMaterial[Number(key)] = this._starUpHeroIDs.heroAndMaterial[key]
                    }
                }
                index++;
            } 
        }
        //发送消息
        MsgMgr.getInstance().getMsgStarUp().requestOneKeyStarUp(starUpHeroIDs);
        this.delSelf();
    }
}
