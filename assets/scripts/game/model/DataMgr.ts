
export class DataMgr{
    private static _instance: DataMgr = new DataMgr();
    public static getInstance() {
        return this._instance;
    }
    
    private playerData:Msg.GetPlayerDataA  = new Msg.GetPlayerDataA();
    private playerLogin:Msg.PlayerLoginA =new Msg.PlayerLoginA();
    private heroList:Msg.GetHeroListR =new Msg.GetHeroListR();
    
    public setPlayerLogin(data:Msg.PlayerLoginA){
        this.playerLogin = data;
        console.log("000000-----------------")
        console.log(this.playerLogin)
    }
    public getPlayerLogin(){
        return this.playerLogin
    }
    public setHeroList(data:Msg.GetHeroListR){
        this.heroList = data;
    }
    public getHeroList(){
        return this.heroList as Msg.PlayerInfo;
    }
    public setPlayerData(data:Msg.GetPlayerDataA){
        this.playerData = data;
    }
    public getPlayerData(){
        return this.playerData
    }


    public getPlayerInfo(){
        return this.playerLogin.playerInfo as Msg.PlayerInfo;
    }
    public getGameConfig(){
        return this.playerLogin.conf as Msg.GameConfig;
    }
}