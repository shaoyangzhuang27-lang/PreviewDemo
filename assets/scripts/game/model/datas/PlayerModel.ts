import { GameModel } from "../GameModel";
import { BaseModel } from "./BaseModel";
import { HeroData } from "./HeroData";

export class PlayerModel extends BaseModel{
    
    private _playerInfo:Msg.PlayerInfo = null as unknown as Msg.PlayerInfo;
    private _gameConf:Msg.GameConfig = null as unknown as Msg.GameConfig;
    private _roleHero:HeroData = null as unknown as HeroData;
    
    public initPlayerData(msg:Msg.PlayerLoginA) {
        this._playerInfo = msg.playerInfo as Msg.PlayerInfo;
        this._gameConf = msg.conf as Msg.GameConfig;
        this._roleHero = new HeroData();
        this._roleHero.initDataByKnight(this._playerInfo, this._gameModel);
        //默认自动施放技能开启
        this._playerInfo.isAutoSkill = true;
    }
    public getPlayerInfo(){
        return this._playerInfo
    }
    public getRoleHero(){
        return this._roleHero
    }
}