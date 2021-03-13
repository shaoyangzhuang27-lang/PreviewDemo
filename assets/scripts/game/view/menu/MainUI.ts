import { _decorator, Component, Node,director,tween,Vec3, instantiate, resources, Label, ProgressBar } from 'cc';
import { NotifyMgr } from '../../control/NotifyMgr';
import { XFuns } from '../../model/const/XFuns';
import { DataMgr } from '../../model/DataMgr';
import { GameModel } from '../../model/GameModel';
import { BagMain } from '../menu/BagMain';
import { KnightMain } from '../menu/KnightMain';
import { TeamMain } from '../menu/TeamMain';

const { ccclass, property } = _decorator;

@ccclass('MainUI')
export class MainUI extends Component {
    @property({type: Node, displayName: "英雄"})
    public btn_hero:Node = null as unknown as Node;

    @property({type: Node, displayName: "队伍"})
    public btn_team:Node = null as unknown as Node;

    @property({type: Node, displayName: "主城战斗"})
    public btn_battle:Node = null as unknown as Node;

    @property({type: Node, displayName: "背包"})
    public btn_bag:Node = null as unknown as Node;

    @property({type: Node, displayName: "公会"})
    public btn_guild:Node = null as unknown as Node;

    @property({type: Node, displayName: "选框"})
    public sprite_select:Node = null as unknown as Node;

    @property({type: Node, displayName: "战斗图标"})
    public ico_battle:Node = null as unknown as Node;

    @property({type: Node, displayName: "主城图标"})
    public ico_city:Node = null as unknown as Node;
    
    @property({type: ProgressBar, displayName: "等级进度条"})
    public pro_level:ProgressBar = null as unknown as ProgressBar;
    
    @property({type: Label, displayName: "等级"})
    public txt_level:Label = null as unknown as Label;
    
    @property({type: Label, displayName: "金币数量"})
    public txt_coin:Label = null as unknown as Label;
    
    @property({type: Node, displayName: "金币按钮"})
    public btn_coin:Node = null as unknown as Node;

    @property({type: Label, displayName: "钻石数量"})
    public txt_diamond:Label = null as unknown as Label;
    
    @property({type: Node, displayName: "钻石按钮"})
    public btn_diamond:Node = null as unknown as Node;



    onLoad(){
        this.btn_hero.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_team.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_battle.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_bag.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_guild.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_coin.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_diamond.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.locateMenu();
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_coin_diamond_level_change,this._playerDataChange,this);
    }
    onDestroy(){
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_coin_diamond_level_change,this._playerDataChange,this) 
    }
    private _playerDataChange(data:any) {
        this.txt_coin.string = String(GameModel.getInstance().getPlayerModel().getPlayerInfo().money);
        this.txt_diamond.string = String(GameModel.getInstance().getPlayerModel().getPlayerInfo().vrmb);
        this.txt_level.string = String(GameModel.getInstance().getPlayerModel().getPlayerInfo().level);
    }
    update(){
        if(this.sprite_select)
            this.setPreMenuPos(this.sprite_select.position)
    }

    start () {
        this.initView();
    }
    initView(){
        let playerInfo = DataMgr.getInstance().getPlayerInfo()
        // playerInfo.name ="王";
        // console.log("wbdwbd+++++++++++++++++++++")
        // console.log(DataMgr.getInstance().getPlayerInfo())
        // console.log(DataMgr.getInstance().getPlayerInfo().name)
        
        // GameModel.getInstance().getPlayerModel().getPlayerInfo().exp;
        
        this.txt_coin.string = XFuns.FormatNumber(GameModel.getInstance().getPlayerModel().getPlayerInfo().money);
        this.txt_diamond.string = XFuns.FormatNumber(GameModel.getInstance().getPlayerModel().getPlayerInfo().vrmb);
        this.txt_level.string = String(GameModel.getInstance().getPlayerModel().getPlayerInfo().level + "级");
        
    }

    buttonBtnClick(event:any){
        console.log(event)
        tween(this.sprite_select)
        .to(0.2,{position:event.target.position})
        .start()

        switch (event.target) {
            case this.btn_hero:
                this.closeTeam();
                this.closeBag();

                resources.load('prefabs_ui/main/knight', (err:any,res:any)=>{
                    
                    let nodeTeam = this.node.getChildByName("node_knight")
                    if(nodeTeam){
                        return;
                    }

                    let p = instantiate( res );
                    p.name = "node_knight"
                    this.node.addChild(p);
                    p.setSiblingIndex(0);
                } );


                break;
            case this.btn_team:
                this.closeKnight();
                this.closeBag();

                resources.load('prefabs_ui/main/team', (err:any,res:any)=>{
                    
                    let nodeTeam = this.node.getChildByName("node_team")
                    if(nodeTeam){
                        return;
                    }

                    let p = instantiate( res );
                    p.name = "node_team"
                    this.node.addChild(p);
                    p.setSiblingIndex(0);
                } );

                break;
            case this.btn_battle:
                if(this.getCurSceneName() == "scene_main"){
                    director.loadScene("battle");
                    this.setCurSceneName("battle");
                    this.setCityBattleBtnState("battle");
                    // this.ico_battle.getComponent("cc.Sprite").setTexture(cc.textureCache.addImage("ui/main/主城图标.png"));
                    // cc.resources.load("ui/main/主城图标.png", cc.SpriteFrame, null, function (err, spriteFrame) {
                    //     this.ico_battle.getComponent("cc.Sprite").spriteFrame = spriteFrame;
                    // })
                }else{
                    director.loadScene("scene_main");
                    this.setCurSceneName("scene_main")
                    this.setCityBattleBtnState("scene_main");
                    // this.ico_battle.getComponent("cc.Sprite").spriteFrame = new cc.SpriteFrame("resources/ui/main/主城图标.png")
                }
                break;
            case this.btn_bag:
                this.closeKnight();
                this.closeTeam();

                resources.load('prefabs_ui/main/bag', (err:any,res:any)=>{
                    
                    let nodeTeam = this.node.getChildByName("node_bag")
                    if(nodeTeam){
                        return;
                    }

                    let p = instantiate( res );
                    p.name = "node_bag"
                    this.node.addChild(p);
                    p.setSiblingIndex(0);
                } );
                break;
            case this.btn_guild:

                break;
            case this.btn_coin:

                break;
            case this.btn_diamond:

                break;
                
            default:
                // code...
                break;
        }
    }
    closeTeam(){
        let nodeTeam = this.node.getChildByName("node_team")
        if(nodeTeam){
            let script =  nodeTeam.getComponent("TeamMain") as TeamMain;
            script.hide();
        }
    }
    closeKnight(){
        let nodeKnight = this.node.getChildByName("node_knight")
        if(nodeKnight){
            let script =  nodeKnight.getComponent("KnightMain") as KnightMain;
            script.hide();
        }
    }
    closeBag(){
        let nodeBag = this.node.getChildByName("node_bag")
        if(nodeBag){
            let script =  nodeBag.getComponent("BagMain") as BagMain;
            script.hide();
        }
    }

    locateMenu(){
        if(this.btn_battle && this.sprite_select){

            let preMenuPos = this.getPreMenuPos();
            let curMenuPos:Vec3 = this.btn_battle.position;
    
            if(director.getScene()?.name == "scene_main" || director.getScene()?.name == ""){
                curMenuPos = this.btn_battle.position;
            }
    
            if(preMenuPos){
                this.sprite_select.position = preMenuPos
                tween(this.sprite_select)
                .to(0.2,{position:curMenuPos})
                .start()
            }else{
                this.sprite_select.setPosition(curMenuPos);
            }
    
            this.setCityBattleBtnState(this.getCurSceneName());
        }
    }
    setCityBattleBtnState(state:string){
        if(state == "scene_main"){
            // cc.resources.load("ui/main/主城图标1.png",(err, spriteFrame)=> {
            //     this.ico_battle.getComponent("cc.Sprite").spriteFrame = spriteFrame;
            // })
            if(this.ico_battle)
                this.ico_battle.active = false
            if(this.ico_city)
                this.ico_city.active = true
        }else{
            if(this.ico_battle)
                this.ico_battle.active = true
            if(this.ico_city)
                this.ico_city.active = false
        }
    }

    getPreMenuPos(){
        if(!window.menuData){window.menuData = {}}
        return window.menuData.menuPos
    }
    setPreMenuPos(pos){
        if(!window.menuData){window.menuData = {}}
        window.menuData.menuPos = pos
    }
    getCurSceneName(){
        if(!window.menuData){window.menuData = {}}
        return window.menuData.curSceneName
    }
    setCurSceneName(str){
        if(!window.menuData){window.menuData = {}}
        window.menuData.curSceneName = str
    }
    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
