import { _decorator, Component, Node,director,tween,Vec3 } from 'cc';
import { DataMgr } from '../model/DataMgr';

const { ccclass, property } = _decorator;

@ccclass('MainUI')
export class MainUI extends Component {
    @property({type: Node, displayName: "英雄"})
    public btn_hero:Node | null = null;

    @property({type: Node, displayName: "队伍"})
    public btn_team:Node | null = null;

    @property({type: Node, displayName: "主城战斗"})
    public btn_battle:Node | null = null;

    @property({type: Node, displayName: "背包"})
    public btn_bag:Node | null = null;

    @property({type: Node, displayName: "公会"})
    public btn_guild:Node | null = null;

    @property({type: Node, displayName: "选框"})
    public sprite_select:Node | null = null;

    @property({type: Node, displayName: "战斗图标"})
    public ico_battle:Node | null = null;

    @property({type: Node, displayName: "主城图标"})
    public ico_city:Node | null = null;



    onLoad(){
        this.btn_hero?.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_team?.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_battle?.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_bag?.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_guild?.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.locateMenu();
    }
    update(){
        if(this.sprite_select)
            this.setPreMenuPos(this.sprite_select.position)
    }

    onDestroy(){
    }
    start () {
        this.initView()
    }
    initView(){
        let playerInfo = DataMgr.getInstance().getPlayerInfo()
        playerInfo.name ="王";
        console.log("wbdwbd+++++++++++++++++++++")
        console.log(DataMgr.getInstance().getPlayerInfo())
        console.log(DataMgr.getInstance().getPlayerInfo().name)
        
    }

    buttonBtnClick(event:any){
        console.log(event)
        tween(this.sprite_select)
        .to(0.2,{position:event.target.position})
        .start()

        switch (event.target) {
            case this.btn_hero:
                console.log("btn_hero")
                director.loadScene("loading")
                break;
            case this.btn_team:
                console.log("btn_team")
                break;
            case this.btn_battle:
                console.log("btn_battle")
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
                console.log("btn_bag")
                break;
            case this.btn_guild:
                console.log("btn_guild")  
                break;
            default:
                // code...
                break;
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
