
import { _decorator, Component, Node, ToggleContainer, EventHandler, Toggle, Vec3, tween } from 'cc';
import { MsgMgr } from '../../control/MsgMgr';
import { PopMgr } from '../../control/PopMgr';
import { GameModel } from '../../model/GameModel';
const { ccclass, property } = _decorator;

@ccclass('TeamMain')
export class TeamMain extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property({type: ToggleContainer })
    public selectGroup:ToggleContainer | null = null;
    
    @property({type: Node })
    public teamNode:Node | null = null;
    
    @property({type: Node })
    public heroNode:Node | null = null;
    
    @property({type: Node })
    public pNode:Node | null = null;
    
    @property({type: Node })
    public btnClose:Node | null = null;

    @property({type: Node })
    public btnBook:Node | null = null;

    start () {
        // [3]
        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'TeamMain';// 这个是代码文件名
        containerEventHandler.handler = 'tabClick';
        containerEventHandler.customEventData = '';
        this.selectGroup?.checkEvents.push(containerEventHandler);
        this.btnClose?.on(Node.EventType.TOUCH_END, this.closeHandle, this);
        this.btnBook?.on(Node.EventType.TOUCH_END, this.openChangeFormationView, this);
        this.show();
        this.test();
    }
    test(){
        let heroList = GameModel.getInstance().getHeroList();
        console.log("heroList=====:");
        console.log(heroList);
        console.log(GameModel.getInstance().getCurrentFormation());
        // heroList.forEach((value,key)=>{
        //     console.log(value.GetATK());
        // })
    }
    
    tabClick(event: Event, customEventData: string){
        let tog:Toggle = (event as any);
        console.log(tog.node.name)
        
        if(!(this.teamNode && this.heroNode) )return;
        if(tog.node.name == "Toggle1"){
            this.teamNode.active = true;
            this.heroNode.active = false;
        }else{
            this.teamNode.active = false;
            this.heroNode.active = true;
        }
    }
    show(){
        console.log("show--------------")
        console.log(this.pNode)
        // this.pNode?.setPosition(new Vec3(0,-900,0));
        tween(this.pNode)
        .to(0.1,{position:new Vec3(this.pNode?.getPosition().x,-340,0)})
        .call(() => {
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

    openChangeFormationView()
    {
        PopMgr.getInstance().popBattleTeamView(1,()=>{
            // MsgMgr.getInstance().getMsgFormation().requestChangeBattleTeam();
        });
        this.hide();
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
