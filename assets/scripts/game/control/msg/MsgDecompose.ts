/**
 * 游戏组件:融魂祭坛信息
 * @author 施敏昭
 * @version 1.0.0,2021.3.26
 */
import { NetCallFunc } from "../../../core/network/NetInterface";
import { GameModel } from "../../model/GameModel";
import { MsgBase } from "./MsgBase";

export class MsgDecompose extends MsgBase{

    public initData(){
        this.responeMap = new Map<number,[any,NetCallFunc,any]>([
            [Msg.MsgType.TheHeroResetA,[Msg.HeroResetA,this.responeResetResult,this]],
        ]);
    }

    //重置
    public requestHeroReset(DyncHeroID:number)
    {
        const buffer_data = Msg.HeroResetR.encode({heroID:DyncHeroID}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheHeroResetR,buffer_data);
    }

     //重置结果
     public responeResetResult(msgId: number, msgData: any)
     {
        console.log("重置数据返回",msgId);
        let newMsgData = msgData as Msg.HeroResetA
        
        if(newMsgData.err == 0)
        {
            GameModel.getInstance().getHeroesModel().resetHeroResetInfo(newMsgData)
        }
        else{
            console.log("打印输出错误码",newMsgData.err,newMsgData.errStr)
        }
     }
}