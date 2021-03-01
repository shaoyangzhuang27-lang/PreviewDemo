import { GameModel } from "../GameModel";

export class BaseModel{
    
    protected _gameModel:GameModel = null as unknown as GameModel;
    
    constructor(gameModel:GameModel){
        this._gameModel = gameModel;
    }
}