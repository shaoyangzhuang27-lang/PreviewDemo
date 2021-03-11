
import { MsgCore} from "../../../core/network/MsgCore";
import { NetCallFunc } from "../../../core/network/NetInterface";
import { NetManager } from "../../../core/network/NetManager";
import { GameModel } from "../../model/GameModel";
import { NotifyMgr } from "../NotifyMgr";
import { MsgBase } from "./MsgBase";

export class MsgFormation extends MsgBase{

    public initData(){
        this.responeMap = new Map<number,[any,NetCallFunc,any]>([
            [Msg.MsgType.TheChangeFormationA,[Msg.ChangeFormationA,this.responeChangeBattleTeam,this]],
            [Msg.MsgType.TheHeroTierUpA,[Msg.HeroTierUpA,this.responeHeroLvUp,this]],
        ]);
    }

    //更换阵容
    public requestChangeBattleTeam(newTeamData:Msg.FormationInfo, defaultNum:number,idleNum:number,_petID:number)
    {
        const buffer_data = Msg.ChangeFormationR.encode({newFormation:newTeamData, defaultFormation:defaultNum, idleFormation:idleNum,PetID:_petID}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheChangeFormationR,buffer_data);
    }
    public responeChangeBattleTeam(msgId: number, msgData: any){
        console.log("更换阵容数据返回",msgId);
        let newMsgData = msgData as Msg.ChangeFormationA
        if(newMsgData.err == 0)
        {
            GameModel.getInstance().getFormationModel().setCurFormationChange(newMsgData)
        }
        else{
            console.log("打印输出错误码",newMsgData.err,newMsgData.errStr)
        }
        
    }
    //更换阵容

    //英雄升级,升阶,装备(一键装备,全部卸下)--------------------start
    public requestHeroLvUp(heroID:number, consumeAdvanceExp:number,consumeMoney:number,newTier:number)
    {
        console.log("英雄升级请求");
        const buffer_data = Msg.HeroTierUpR.encode({heroID:heroID}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheHeroTierUpR,buffer_data);
    }
    public responeHeroLvUp(msgId: number, msgData: any){
        console.log("英雄升级数据返回",msgId);
        let newMsgData = msgData as Msg.HeroTierUpR
        if(newMsgData)
        {
            GameModel.getInstance().getFormationModel().setCurFormationChange(newMsgData)      
        }
        
    }
    //英雄升级,升阶,装备(一键装备,全部卸下)--------------------start
}