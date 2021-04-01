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
            [Msg.MsgType.TheHeroDecomposeA,[Msg.HeroDecomposeA,this.responeDecomposeResult,this]],
            [Msg.MsgType.TheHeroReturnBackA,[Msg.HeroReturnBackA,this.responeRollbackResult,this]],
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

     //分解
    public requestHeroDecompose(DyncHeroIDs:number[])
    {
        const buffer_data = Msg.HeroDecomposeR.encode({heroIDList:DyncHeroIDs}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheHeroDecomposeR,buffer_data);
    }

     //分解结果
     public responeDecomposeResult(msgId: number, msgData: any)
     {
        console.log("分解数据返回",msgId);
        let newMsgData = msgData as Msg.HeroDecomposeA
        
        if(newMsgData.err == 0)
        {
            GameModel.getInstance().getHeroesModel().resetHeroDecomposeInfo(newMsgData)
        }
        else{
            console.log("打印输出错误码",newMsgData.err,newMsgData.errStr)
        }
     }

      //回退
    public requestHeroRollback(DyncHeroID:number)
    {
        const buffer_data = Msg.HeroReturnBackR.encode({heroID:DyncHeroID}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheHeroReturnBackR,buffer_data);
    }

     //回退结果
     public responeRollbackResult(msgId: number, msgData: any)
     {
        console.log("回退数据返回",msgId);
        let newMsgData = msgData as Msg.HeroReturnBackA
        
        if(newMsgData.err == 0)
        {
            GameModel.getInstance().getHeroesModel().resetHeroRollBackInfo(newMsgData)
        }
        else{
            console.log("打印输出错误码",newMsgData.err,newMsgData.errStr)
        }
     }
}