
import { _decorator, Component, Node,Label,resources,instantiate,Vec3, CCInteger,Sprite, SpriteFrame,ButtonComponent,EventHandler} from 'cc';
import { PopBase } from '../../../core/control/PopBase';
const { ccclass, property } = _decorator;

 var SUMMON_FRIEND_COUNT_MAX = 30;
@ccclass('PopHeroPub')
export class PopHeroPub extends PopBase {
    @property({type: Label})
    public lab_title:Label | null = null;

    @property({type: Node})
    public btn_introduce:Node | null = null;

    @property({type: Node})
    public btn_recommendteam:Node | null = null;


    @property({type: Sprite})
    public img_prop = null as unknown as Sprite;


    @property({type: Label})
    public lab_prop_num:Label | null = null;

    @property({type: Node})
    public node_diamond = null as unknown as Node;

    @property({type: Node})
    public node_friend = null as unknown as Node;

    @property({type: ButtonComponent})
    public btn_hero_summon = null as unknown as ButtonComponent;

    @property({type: ButtonComponent})
    public btn_friend_summon = null as unknown as ButtonComponent;

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
        this.curSummonType = Msg.TSummonType.ESummonType_Heroic;


        const clickEventHandler = new EventHandler();
        clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = 'PopHeroPub';// 这个是代码文件名
        clickEventHandler.handler = 'showHeroSummon';
        clickEventHandler.customEventData = 'hero_summon';

        // const button = this.node.getComponent(Button);
        this.btn_hero_summon.clickEvents.push(clickEventHandler);
        // this.btn_hero_summon.on(Node.EventType.TOUCH_END, this._onClose, this);
    }
    
    showHeroSummon(event: Event, customEventData: string){
        // 这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        const node = event.target as unknown as Node;
        // const button = node.getComponent(Button);
        console.log(customEventData); // foobar
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


    set curSummonType(value : Msg.TSummonType)
    {
        switch(value)
        {
            case Msg.TSummonType.ESummonType_Heroic:
                this.node_diamond.active = true;
                this.node_friend.active = false;
                this.btn_hero_summon.interactable = false;
                this.btn_friend_summon.interactable = true;
                break;
            case Msg.TSummonType.ESummonType_Friend:
                this.node_diamond.active = false;
                this.node_friend.active = true;
                this.btn_hero_summon.interactable = true;
                this.btn_friend_summon.interactable = false;
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
