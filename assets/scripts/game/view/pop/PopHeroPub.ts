
import { _decorator, Component, Node,LabelComponent,resources,instantiate,Vec3, CCInteger} from 'cc';
import { PopBase } from '../../../core/control/PopBase';
const { ccclass, property } = _decorator;

 var SUMMON_FRIEND_COUNT_MAX = 30;
@ccclass('PopHeroPub')
export class PopHeroPub extends PopBase {
    @property({type: LabelComponent})
    public lab_title:LabelComponent | null = null;

    @property({type: Node})
    public btn_introduce:Node | null = null;

    @property({type: Node})
    public btn_recommendteam:Node | null = null;


    @property({type: Node})
    public img_prop:Node | null = null;


    @property({type: LabelComponent})
    public lab_prop_num:LabelComponent | null = null;

    @property({type: Node})
    public node_diamond = null as unknown as Node;

    @property({type: Node})
    public node_friend = null as unknown as Node;

    @property({type: Node})
    public btn_hero_summon:Node | null = null;

    @property({type: Node})
    public btn_friend_summon:Node | null = null;

    @property({type: Node})
    public img_summon_ad:Node | null = null;

    @property({type: Node})
    public btn_summon_one:Node | null = null;

    @property({type: Node})
    public btn_summon_ten:Node | null = null;
    // @property({type: LabelComponent})
    // public lab_content:LabelComponent | null = null;



    private submitCallFun:Function | null = null;

    // //召唤类型  默认英雄召唤
    // private _curSummonType: Msg.TSummonType = Msg.TSummonType.ESummonType_Heroic;
    // //消费道具类型 默认道具类型Null
    // private _curSummonConsumType :  Msg.TSummonConsumeType = Msg.TSummonConsumeType.ESummonConsumeType_NULL;
    //召唤类型  默认英雄召唤
    private _curSummonType: number = 0;
    //消费道具类型 默认道具类型Null
    private _curSummonConsumType :  number = 0;
    //卷轴数量
    private _nScorllNum : number  = 0;
    //友情心数量
    private _nFriendHeartNum : number = 0;
    //英雄召唤进度
    private _nSummonFriendCount : number = 0;
     //弹窗初始化-----
     onLoad(){
        super.onLoad();
        
        // this._curSummonType = Msg.TSummonType.ESummonType_Heroic;
        // this._curSummonType = Msg.TSummonType.ESummonType_Friend;
        this.setSummonType(Msg.TSummonType.ESummonType_Friend);
        // this._curSummonConsumType= Msg.TSummonConsumeType.ESummonConsumeType_NULL;
    }
    
    
    start () {
        super.start();
        this.showPubHeroIconPrefab()
    }

    submitHandle(){
        if(this.submitCallFun){
            this.submitCallFun();
        }
    }
    public setTitle(title:string){
        if(this.lab_title)
            this.lab_title.string = title
    }
    // public setContent(content:string){
    //     console.log(content)
    //     if(this.lab_content)
    //         this.lab_content.string = content
    // }
    public setSubmitCallBack(func:Function){
        this.submitCallFun = func;
    }

    public setCloseCallBack(func:Function | null){
        if(func)
            this._closeFunc = func;
    }

    // update (deltaTime: number) {
    // //     // Your update function goes here.
    // }

    public showPubHeroIconPrefab()
    {
        
        resources.load('prefabs_ui/pub/pub_heroicon', (err:any,res:any)=>{
            let p = instantiate( res );
            var nodWindow = this.node.getChildByName("window");
            var nodeDiamond = nodWindow?.getChildByName("node_diamond");
            var imgFiveStarBg = nodeDiamond?.getChildByName("img_fivestar_bg");
            var nodeFiveStar = imgFiveStarBg?.getChildByName("node_fivestar");
            if(nodeFiveStar)
            {
                p.setScale(0.4,0.4)
                nodeFiveStar.addChild(p)
            }
        } );
    }

    public setSummonType(value : Msg.TSummonType) {
        switch(value)
        {
            case Msg.TSummonType.ESummonType_Heroic:
                this.node_diamond.active = true;
                this.node_friend.active = false;
                break;
            case Msg.TSummonType.ESummonType_Friend:
                this.node_friend.active = true;
                this.node_diamond.active = false;
                break;
        }
        this._curSummonType = value;
    }

}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
