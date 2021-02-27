import { GameModel } from "../GameModel";
import { HeroData } from "../HeroData";

export class PlayerModel{
    
    private _playerInfo:Msg.PlayerInfo = new Msg.PlayerInfo();
    private _gameConf:Msg.GameConfig = new Msg.GameConfig();
    private _roleHero:HeroData = null as unknown as HeroData;
    private _gameModel:GameModel = null as unknown as GameModel;
    
    constructor(gameModel:GameModel){
        this._gameModel = gameModel;
    }
    public initPlayerData(msg:Msg.PlayerLoginA) {
        this._playerInfo = msg.playerInfo as Msg.PlayerInfo;
        this._gameConf = msg.conf as Msg.GameConfig;
        this._roleHero = new HeroData();
        this._roleHero.initDataByKnight(this._playerInfo,this._gameModel);
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