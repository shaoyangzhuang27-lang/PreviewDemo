
import { _decorator, Component, Node, instantiate, Vec3, Prefab, SkeletalAnimation, SystemEventType } from 'cc';
const { ccclass, property } = _decorator;

import { HeroBase } from "../../../core/base/HeroBase";


import { BattleTest } from "../../../battle/test/BattleTest";

import { ResMgr } from "../../control/ResMgr";
import { HeroData } from '../../model/datas/HeroData';

@ccclass('HeroModel')
export class HeroModel extends Component {

    private _curHero: HeroBase | null = null;
    private _resMap: Map<string, string> = new Map();
    private _onClickFunc: Function | null = null;
    private _bOnce: boolean = false;
    private _heroBookMap:Map<number, Msg.HeroBookUnit> = new Map<number, Msg.HeroBookUnit>();

    onLoad() {
        this.node.on(SystemEventType.TOUCH_END, () => {
            this._onClick();
        }, this)
    }

    start() {
        this.updateByHeroPerfabPath("主角_1")
    }

    onDestroy() {
        this._resMap.forEach((v, k) => {
            ResMgr.getInstance().releaseTempRes(k);
        }) 
    }

    private _resetLayer(node: Node): void {
        node.layer = this.node.layer;
        let list: Node[] = node.children;
        for(let i = 0; i < list.length; i++) {
            this._resetLayer(list[i]);
        }
    }

    private _onClick(): void {
        if (this._onClickFunc) {
            this._onClickFunc();
        }
    }

    // TODO 临时接口
    public updateByHeroPerfabPath(path: string, callback?: Function): void {

        path = BattleTest.getHeroModelPrefabPath(path);
        ResMgr.getInstance().loadTempRes(path, (prefab: any) => {
            if (prefab) {
                this._resMap.set(path, path);
                this.updateByHeroPerfab(prefab);
                if (callback) {
                    callback();
                }
            }
        });
    }
    

    // TODO 暂时不要用这个接口
    public updateByHeroPerfab(heroPrefab: Prefab): void {
        
        let heroNode: Node = instantiate(heroPrefab) as Node;
        this._resetLayer(heroNode);
        heroNode.setScale(new Vec3(50, 50, 50));
        heroNode.setRotationFromEuler(new Vec3(0, 180, 0));
        heroNode.setPosition(Vec3.ZERO);
        this.node.addChild(heroNode);

        if (this._curHero) {
            this._curHero.node.destroy();
            this._curHero = null;
        }

        this._curHero = heroNode.getComponent("HeroBase") as HeroBase;

        this._curHero.getSkeletalAnimation().on(SkeletalAnimation.EventType.LASTFRAME, ()=> {
            if (this._curHero) {
                if (this._curHero.isInSkill() && this._bOnce) {
                    this._curHero.playIdle();
                    this._bOnce = false;
                }
            }
        })

        this._curHero.playIdle();
    }

    public playSkillOnce(): void {
        if (this._curHero) {
            this._bOnce = true;
            this._curHero.playSkill();
        }
    }

    public playVictory(): void {
        if (this._curHero) {
            this._curHero.playVictory();
        }
    }

    setClickFunc(clickFunc: Function): void {
        this._onClickFunc = clickFunc;
    }

    setScale(v: Vec3): void {
        this.node.setScale(v);
    }

    setRotation(v: Vec3): void {
        this.node.setRotationFromEuler(v);
    }

    public getHeroBookMap():Map<number, Msg.HeroBookUnit>
    {
        return this._heroBookMap;
    }
    
    public addHeroBook(heroStaticID:number)
    {
        let bookid = HeroData.GetHeroBookID(heroStaticID);
        let star = HeroData.GetHeroStar(heroStaticID);
        if(!this._heroBookMap.has(bookid))
        {
            let hbu = new Msg.HeroBookUnit();
            hbu.heroBookId = bookid;
            hbu.isGetAward = false;
            hbu.curTopStar = star;
            hbu.level = 0;
            this._heroBookMap.set(bookid,hbu);
        }
        else{
            let hbu = this._heroBookMap.get(bookid) as Msg.HeroBookUnit;
            if(hbu.curTopStar < star)
            {
                hbu.curTopStar = star;
            }
        }
    }
}
