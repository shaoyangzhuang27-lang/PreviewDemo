/**
 * 游戏组件:升星塔信息
 * @author 施敏昭
 * @version 1.0.0,2021.3.13
 */
import { NetCallFunc } from "../../../core/network/NetInterface";
import { HeroData } from "../../model/datas/HeroData";
import { GameModel } from "../../model/GameModel";
import { NotifyMgr } from "../NotifyMgr";
import { PopMgr } from "../PopMgr";
import { MsgBase } from "./MsgBase";

export class MsgStarUp extends MsgBase{

    public initData(){
        this.responeMap = new Map<number,[any,NetCallFunc,any]>([
            [Msg.MsgType.TheHeroStarUpA,[Msg.HeroStarUpA,this.responeStarUpResult,this]],
            [Msg.MsgType.TheHeroStarUpMultiA,[Msg.HeroStarUpMultiA,this.responeOneKeyStarUpResult,this]],
            [Msg.MsgType.TheHeroBookActiveA,[Msg.HeroBookActiveA,this._responeHeroBookActiveRsp,this]],
            [Msg.MsgType.TheHeroBookLevelUpA,[Msg.HeroBookLevelUpA,this._responeUpgradeHeroBookRsp,this]],
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

    //请求激活图鉴
    public requestHeroBookActive(bookHeroid:number)
    {
       const buffer_data = Msg.HeroBookActiveR.encode({heroBookId:bookHeroid}).finish();
       this.msgMgr?.sendData(Msg.MsgType.TheHeroBookActiveR,buffer_data);
    }

    private _responeHeroBookActiveRsp(msgId: number, msgData: any)
    {        
        let newMsgData = msgData as Msg.HeroBookActiveA;
        console.log("激活图鉴返回",msgId,msgData.hbu.heroBookId);
        let bookHeroList = GameModel.getInstance().getHeroesModel().getBookMap();
        if(bookHeroList.has(msgData.hbu.heroBookId))
        {
            let bookHeroData = GameModel.getInstance().getHeroesModel().getBookHeroDataByBookId(msgData.hbu.heroBookId);
            bookHeroData = msgData.hbu;
            bookHeroList.delete(bookHeroData.heroBookId);
            bookHeroList.set(bookHeroData.heroBookId,bookHeroData);
            let value = bookHeroList.get(msgData.hbu.heroBookId);

            let heroStaticID = HeroData.getHeroStaticIdByBookId(msgData.hbu.heroBookId)
            PopMgr.getInstance().popBookHeroActiveView(heroStaticID)
            //抛通知  界面数据变化
            NotifyMgr.getInstance().notify(NotifyMgr.event_hero_book_active,bookHeroData);
        } 
    }

    //请求升级英雄图鉴
    public requestUpgradeHeroBook(bookHeroid:number)
    {
        const buffer_data = Msg.HeroBookLevelUpR.encode({heroBookId:bookHeroid}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheHeroBookLevelUpR,buffer_data);
        
    }

    private _responeUpgradeHeroBookRsp(msgId: number, msgData: any)
    {        
        let newMsgData = msgData as Msg.HeroBookLevelUpA;
        console.log("升级英雄图鉴返回",msgId,msgData.hbu.heroBookId);
        let bookHeroList = GameModel.getInstance().getHeroesModel().getBookMap();
        if(bookHeroList.has(msgData.hbu.heroBookId))
        {
            let bookHeroData = GameModel.getInstance().getHeroesModel().getBookHeroDataByBookId(msgData.hbu.heroBookId);
            bookHeroData = msgData.hbu;
            bookHeroList.delete(bookHeroData.heroBookId);
            bookHeroList.set(bookHeroData.heroBookId,bookHeroData);
            let value = bookHeroList.get(msgData.hbu.heroBookId);

            let heroStaticID = HeroData.getHeroStaticIdByBookId(msgData.hbu.heroBookId)
            //抛通知  界面数据变化
            NotifyMgr.getInstance().notify(NotifyMgr.event_hero_book_upgrade,bookHeroData);
        }
    }
}