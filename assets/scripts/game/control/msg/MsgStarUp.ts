/**
 * 游戏组件:升星塔信息
 * @author 施敏昭
 * @version 1.0.0,2021.3.13
 */
import { NetCallFunc } from "../../../core/network/NetInterface";
import { GameModel } from "../../model/GameModel";
import { MsgBase } from "./MsgBase";

export class MsgStarUp extends MsgBase{

    public initData(){
        this.responeMap = new Map<number,[any,NetCallFunc,any]>([
            [Msg.MsgType.TheHeroStarUpA,[Msg.HeroStarUpA,this.responeStarUpResult,this]],
            [Msg.MsgType.TheHeroStarUpMultiA,[Msg.HeroStarUpMultiA,this.responeOneKeyStarUpResult,this]],
        ]);
    }

    //升星
    public requestHeroStarUp(DyncHeroID:number,materialHeroIDs:Msg.HeroIDs)
    {
        const buffer_data = Msg.HeroStarUpR.encode({heroID:DyncHeroID, materialHeroIDs:materialHeroIDs}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheHeroStarUpR,buffer_data);
    }

    //一键升星
    public requestOneKeyStarUp(StarUpMultiR:Msg.HeroStarUpMultiR)
    {
        const buffer_data = Msg.HeroStarUpMultiR.encode({heroAndMaterial:StarUpMultiR.heroAndMaterial}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheHeroStarUpMultiR,buffer_data);
    }

     //升星结果
     public responeStarUpResult(msgId: number, msgData: any)
     {
        console.log("升星数据返回",msgId);
        let newMsgData = msgData as Msg.HeroStarUpA
        if(newMsgData.err == 0)
        {
            GameModel.getInstance().getHeroesModel().resetHeroStarUpInfo(newMsgData)
        }
        else{
            console.log("打印输出错误码",newMsgData.err,newMsgData.errStr)
        }
     }

     //一键升星结果
     public responeOneKeyStarUpResult(msgId: number, msgData: any)
     {
        console.log("一键升星数据返回",msgId);
        let newMsgData = msgData as Msg.HeroStarUpMultiA
        if(newMsgData.err == 0)
        {
            GameModel.getInstance().getHeroesModel().resetOneKeyStarUpInfo(newMsgData)
        }
        else{
            console.log("打印输出错误码",newMsgData.err,newMsgData.errStr)
        }
     }
}