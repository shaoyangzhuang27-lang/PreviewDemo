
export class DataMgr{
    private static _instance: DataMgr = new DataMgr();
    public static getInstance() {
        return this._instance;
    }
    
    // private heroList:Msg.GetHeroListR =new Msg.GetHeroListR();
    // private playerLogin:Msg.PlayerLoginA =new Msg.PlayerLoginA();
    private playerData:Msg.GetPlayerDataA | null  = null;//new Msg.GetPlayerDataA();
    private playerInfo:Msg.IPlayerInfo | null | undefined = null;
    private gameConfig:Msg.IGameConfig | null | undefined = null;
    private heroList:Array<Msg.IHeroInfo> | null = null;//new Array<Msg.IHeroInfo>();
    private heroBookInfo:{ [k: string]: Msg.IHeroBookUnit } | null = null;

    
    public setPlayerLogin(data:Msg.PlayerLoginA){
        this.playerInfo = data.playerInfo;
        this.gameConfig = data.conf;
        // this.playerLogin = data;
        // console.log("000000-----------------")
        // console.log(this.playerLogin)
    }
    public setHeroList(data:Msg.GetHeroListA){
        this.heroList = data.heroList;
        this.heroBookInfo = data.heroBookInfo;
    }
    public setPlayerData(data:Msg.GetPlayerDataA){
        this.playerData = data;
    }

    //英雄数据
    public getHeroList(){
        return this.heroList;
    }
    //英雄图鉴数据
    public getHeroBookInfo(){
        return this.heroBookInfo;
    }

    //玩家数据
    public getPlayerData(){
        return this.playerData
    }

    //角色信息
    public getPlayerInfo(){
        return this.playerInfo;
        // return this.playerLogin.playerInfo as Msg.PlayerInfo;
    }
    //游戏信息
    public getGameConfig(){
        return this.gameConfig;
        // return this.playerLogin.conf as Msg.GameConfig;
    }
}