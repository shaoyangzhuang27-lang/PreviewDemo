/**
 * 游戏组件:升星结果
 * @author 施敏昭
 * @version 1.0.0,2021.3.15
 */
import { _decorator,EventHandler,Button, Sprite,Vec3,tween, Component,SpriteFrame,Label,Node, resources,LabelComponent } from 'cc';
import { PopBase } from '../../../../core/control/PopBase';
import { HeroModel } from '../../hero/HeroModel';
import { HeroData } from '../../../model/datas/HeroData';
import { XConsts } from "../../../model/const/XConsts";
import { PopMgr } from '../../../control/PopMgr';
const { ccclass, property } = _decorator;

@ccclass('PopStarUpResult')
export class PopStarUpResult extends PopBase {

    @property({type: Button, displayName: "确定按钮"})
    public btn_submit:Button | null = null;

    @property({type: Label, displayName: "英雄名"})
    public lab_Name:Label = null as unknown as Label;

    @property({type :  Node, displayName: "当前英雄阵营"})
    public img_camp:Node = null as unknown as Node;

    @property({type :  Node, displayName: "当前英雄职业"})
    public img_classes:Node = null as unknown as Node;

    @property({type :  Node, displayName: "当前英雄星星节点"})
    public starNode:Node = null as unknown as Node;

    @property({type :  Node, displayName: "当前英雄星级"})
    public starlist:Node[] = [];

    @property({ type: HeroModel, displayName: "当前英雄形象" })
    public cur_hero_model: HeroModel | null = null;

    @property({type: Label, displayName: "血量"})
    public lab_HP:Label = null as unknown as Label;

    @property({type: Label, displayName: "新血量"})
    public lab_newHP:Label = null as unknown as Label;

    @property({type: Label, displayName: "攻击"})
    public lab_ATK:Label = null as unknown as Label;

    @property({type: Label, displayName: "新攻击"})
    public lab_newATK:Label = null as unknown as Label;

    @property({type: Label, displayName: "防御"})
    public lab_DEF:Label = null as unknown as Label;

    @property({type: Label, displayName: "新防御"})
    public lab_newDEF:Label = null as unknown as Label;

    @property({type: Label, displayName: "战力"})
    public lab_FC:Label = null as unknown as Label;

    @property({type: Label, displayName: "新战力"})
    public lab_newFC:Label = null as unknown as Label;

    @property({type :  Node, displayName: "当前移动节点"})
    public nodelist:Node[] = [];

    private _starNameList:string[] = new Array<string>();

    private _showDataTime:number = 0.25;

    //原英雄数据
    private _HeroData:HeroData = null as unknown as HeroData;

    //新英雄数据
    private _newHeroData:HeroData = null as unknown as HeroData;

    start () {
        super.start(); 
        var clickEventHandler = new EventHandler();
        clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = "PopStarUpResult";//这个是代码文件名
        clickEventHandler.handler = "_onSubmitClick";
        clickEventHandler.customEventData = "";
        this.btn_submit?.clickEvents.push(clickEventHandler);

        for (let index = 0; index < this.nodelist.length; index++) {
            this.nodelist[index].active = false;
        }
        this._showHeroData();
        this._showHeroInfo();
        this._showNewHeroData();
        this._starChangeAnimation();
    }

    public setHeroData(heroData:HeroData)
    {
        this._HeroData = heroData;   
    }

    public setnewHeroData(heroData:HeroData)
    {
        this._newHeroData = heroData; 
    }

    public setCloseCallBack(func:Function | null){
        if(func)
            this._closeFunc = func;
    }

    //平台显示英雄信息
    private _showHeroInfo(){
        let HeroInfo = this._newHeroData;
        let _campName:string = XConsts.KHeroCampIcon[HeroInfo?.getCamp() as number];
        let _classesName:string = XConsts.KClassesSpriteName[HeroInfo?.getClasses() as number];
        let _iconName:string = HeroInfo?.getName() as string;
        let _starNum:number = HeroInfo?.getStar() as number;
        this.img_camp.active = true;
        let campIconPath:string = "ui/team/" + _campName + "/spriteFrame"
        resources.load(campIconPath, (err,spriteFrame:SpriteFrame) =>
        {
            if(!err)
            {
                let sprite = this.img_camp.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        });   
        this.img_classes.active = true;
        let classesIconPath:string = "ui/lv_up/" + _classesName + "/spriteFrame"
        resources.load(classesIconPath, (err,spriteFrame:SpriteFrame) =>
        {
            if(!err)
            {
                let sprite = this.img_classes.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        });  
        
        this.lab_Name.string = _iconName.toString();
        this._setStar(_starNum);
        this._showCurHeroModel(_iconName);
    }
    //设置星星
    private _setStar(star:number)
    {
        this._starNameList = ["初级星星","中级星星","高级星星"]
        let grade:number = Math.floor(star/5);
        let yu:number = (star - 1) % 5 + 1;

        let starName = this._starNameList[grade];
        let starPath = "ui/icon/" + starName + "/spriteFrame"

        for (let index = 0; index < this.starlist.length; index++) {
            if(index >= yu && yu != 0)
            {
                this.starlist[index].active = false;
            }
            else{
                this.starlist[index].active = true;
            }
        }
    }

    // 展示当前英雄形象
    private _showCurHeroModel(_iconName:string)
    {
        if(this.cur_hero_model)
        {
            //this.cur_hero_model.updateByHeroPerfabPath(_iconName);
        }
    }

    //显示数据
    private _showHeroData(){
        this.lab_HP.string = Math.ceil(this._HeroData.getMaxHP()).toString();
        this.lab_ATK.string = Math.ceil(this._HeroData.getATK()).toString();
        this.lab_DEF.string = Math.ceil(this._HeroData.getDEF()).toString();
        this.lab_FC.string = Math.ceil(this._HeroData.getFighting()).toString();
    }

    //显示数据
    private _showNewHeroData(){
        this.lab_newHP.string = Math.ceil(this._newHeroData.getMaxHP()).toString();
        this.lab_newATK.string = Math.ceil(this._newHeroData.getATK()).toString();
        this.lab_newDEF.string = Math.ceil(this._newHeroData.getDEF()).toString();
        this.lab_newFC.string = Math.ceil(this._newHeroData.getFighting()).toString();
    }

    //星星变化动画
    private _starChangeAnimation(){
        this._Animation(0.6,this.starlist[0],1,() => { 
            this._Animation(0.2,this.starNode,0.5,() => { 
                this._Animation(0.2,this.starNode,1,() => { 
                    this._dataMoveAnimation(0);
                })  
            })        
        })
    }

    //数据移动动画
    private _dataMoveAnimation(index:number){
        this.nodelist[index].active = true;
        let posY = index*-45;
        if(index == 4){
            posY = 0;
        }
        if(index == 5){
            posY = -435;
        }
        tween(this.nodelist[index])
            .to(this._showDataTime,{position:new Vec3(0,posY,1)})
            .call(() => { 
                let Index = index + 1;
                if(Index < this.nodelist.length){
                    this._dataMoveAnimation(Index);
                }
            })
            .start()
    }

    //动画
    private _Animation(time:number,node:Node,scaleNum:number,CallBack:Function){
        tween(node)
            .to(time,{scale:new Vec3(scaleNum,scaleNum,scaleNum)})
            .call(CallBack)
            .start()
    }
}
