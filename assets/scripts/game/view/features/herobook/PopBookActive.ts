/**
 * 游戏组件:英雄图鉴激活
 * @author 黄志清
 * @version 1.0.0,2021.3.17
 */
import { _decorator, Component, Node, resources, instantiate, Vec3 } from 'cc';
import { PopBase } from '../../../../core/control/PopBase';
import { CellHeroBook } from './CellHeroBook';
const { ccclass, property } = _decorator;

@ccclass('PopBookActive')
export class PopBookActive extends PopBase {
    @property({type :  Node})
    public iconNode:Node = null as unknown as Node;

    start () {
        super.start()
    }

    /**
     * 激活英雄弹窗
     * @param id 
     */
    public setActiveHeroInfo(id:number)
    {
        this._initIcon(id);
    }

    private _initIcon(id:number)
    {
        resources.load('prefabs_ui/features/herobook/cell_book', (err:any,res:any)=>{  
            let bookcell = instantiate(res) as Node;
            this.iconNode.addChild(bookcell)
            bookcell.scale = new Vec3(0.75,0.75,1);

            let script = bookcell.getComponent("CellHeroBook") as CellHeroBook; 
            script.setHeroBookData(3,id,null);
        })
    }
}