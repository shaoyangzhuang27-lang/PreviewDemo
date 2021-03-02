
import { MsgCore} from "../../../core/network/MsgCore";
import { NetCallFunc } from "../../../core/network/NetInterface";
import { NetManager } from "../../../core/network/NetManager";
import { NotifyMgr } from "../NotifyMgr";
import { MsgBase } from "./MsgBase";

export class MsgFormation extends MsgBase{

    public initData(){
        this.responeMap = new Map<number,[any,NetCallFunc,any]>([
            [Msg.MsgType.TheChangeFormationA,[Msg.ChangeFormationA,this.responeChangeBattleTeam,this]],
        ]);
    }

    //更换阵容
    public requestChangeBattleTeam(newTeamData:Msg.FormationInfo, defaultNum:number,idleNum:number,_petID:number)
    {
        const buffer_data = Msg.ChangeFormationR.encode({newFormation:newTeamData, defaultFormation:defaultNum, idleFormation:idleNum,PetID:_petID}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheChangeFormationR,buffer_data);
    }
    public responeChangeBattleTeam(msgId: number, msgData: any){

    }
    //更换阵容
}