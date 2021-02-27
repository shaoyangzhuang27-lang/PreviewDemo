import { GameModel } from "../GameModel";
import { TableName, ValueMgr } from "../ValueMgr";

export class TechnologyModel{
    private _gameModel:GameModel = null as unknown as GameModel;

    constructor(gameModel:GameModel){
        this._gameModel = gameModel;
    }

    
    //技术提供的属性
    private _technologyProperty:Map<Msg.TClassesType, Map<Msg.THeroPropertyType, number>> = new Map<Msg.TClassesType, Map<Msg.THeroPropertyType, number>>();
    public GetTechnologyProperty(classes:Msg.TClassesType, proType:Msg.THeroPropertyType) {
        if (this._technologyProperty.has(classes) && this._technologyProperty.get(classes)?.has(proType)) {
            return this._technologyProperty.get(classes)?.get(proType) as number;
        }
        return 0;
    }
    
    private _technologyMap:Map<Msg.TClassesType, number> = new Map<Msg.TClassesType, number>();
    private _technologyTotalLevel:number = 0;
    private _technologyRoleLevel:number = 0;
    public RefreshTechnologyProperty(classes:Msg.TClassesType) {
        this._technologyTotalLevel = 0;
        this._technologyMap.forEach((value,key)=>{
            if (key != Msg.TClassesType.EClassesType_Role)
                this._technologyTotalLevel += value;
        })
        this._technologyRoleLevel = this._technologyTotalLevel / 5;
        if (classes == Msg.TClassesType.EClassesType_Role) {
            if (this._technologyProperty.has(Msg.TClassesType.EClassesType_Role)) {
                let proMap = this._technologyProperty.get(Msg.TClassesType.EClassesType_Role) as Map<Msg.THeroPropertyType, number>;
                this.calcTechnologyPropertyByClasses(Msg.TClassesType.EClassesType_Role, this._technologyRoleLevel, proMap);
            } else {
                var proMap = new Map<Msg.THeroPropertyType, number> ();
                this.calcTechnologyPropertyByClasses (Msg.TClassesType.EClassesType_Role, this._technologyRoleLevel, proMap);
                this._technologyProperty.set(Msg.TClassesType.EClassesType_Role, proMap);
            }
        } else {
            if (this._technologyMap.has(classes)) {
                let level = this._technologyMap.get(classes) as number;
                if (this._technologyProperty.has(classes)) {
                    let proMap = this._technologyProperty.get(classes) as Map<Msg.THeroPropertyType, number>;
                    this.calcTechnologyPropertyByClasses (classes, level, proMap);
                } else {
                    var proMap = new Map<Msg.THeroPropertyType, number> ();
                    this.calcTechnologyPropertyByClasses (classes, level, proMap);
                   this. _technologyProperty.set(classes, proMap);
                }
            }
        }
    }
    public RefreshTechnologyPropertyAll(){
        if (this._technologyProperty == null)
            this._technologyProperty = new Map<Msg.TClassesType, Map<Msg.THeroPropertyType, number>> ();
        this._technologyProperty.clear();
        for (let classes:Msg.TClassesType = Msg.TClassesType.EClassesType_Role; classes <= Msg.TClassesType.EClassesType_Priest; classes++)
            this.RefreshTechnologyProperty (classes);
    }
    
    //根据职业和科技等级，计算加成的总属性，并存在proMap中
    private calcTechnologyPropertyByClasses(ct :Msg.TClassesType, level:number, proMap:Map<Msg.THeroPropertyType, number>) {
        proMap.clear();
        for (let i = 1; i <= level; i++) {
            var record = ValueMgr.getInstance().getItemByField(TableName.technology,i) as Config.technology.Record;
            let idx = ct - 1;
            let proType = record.proType[idx] as Msg.THeroPropertyType;
            let proNum = record.proNum[idx] / 100.0;
            if (proMap.has(proType))
                proMap.set(proType,proMap.get(proType) as number + proNum);
            else
                proMap.set(proType, proNum);
        }
    }
}