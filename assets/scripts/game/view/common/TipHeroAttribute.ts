/*
 * @Description: 英雄属性Tip弹窗
 * @Author: 徐涛
 * @Date: 2021-03-09 19:30:14
 * @LastEditTime: 2021-04-07 14:39:08
 */
import { _decorator, Node, math, Layout, instantiate, UITransform, Prefab } from 'cc';
import { ResMgr } from '../../control/ResMgr';
import { HeroData } from '../../model/datas/HeroData';
import { GameModel } from '../../model/GameModel';
import { TipBase } from '../TipBase';
import { TipHeroAttributeItem } from './TipHeroAttributeItem';
const { ccclass, property } = _decorator;

@ccclass('TipHeroAttribute')
export class TipHeroAttribute extends TipBase {
    // [1]
    // dummy = '';
    _heroId: number = 0; //英雄id

    @property({ type: Layout, displayName: "layout" })
    public layout: Layout = null as unknown as Layout;

    @property({ type: TipHeroAttributeItem, displayName: "血量" })
    public tipHeroAttributeItem0: TipHeroAttributeItem = null as unknown as TipHeroAttributeItem;
    @property({ type: TipHeroAttributeItem, displayName: "攻击" })
    public tipHeroAttributeItem1: TipHeroAttributeItem = null as unknown as TipHeroAttributeItem;
    @property({ type: TipHeroAttributeItem, displayName: "防御" })
    public tipHeroAttributeItem2: TipHeroAttributeItem = null as unknown as TipHeroAttributeItem;
    @property({ type: TipHeroAttributeItem, displayName: "速度" })
    public tipHeroAttributeItem3: TipHeroAttributeItem = null as unknown as TipHeroAttributeItem;
    @property({ type: TipHeroAttributeItem, displayName: "暴击" })
    public tipHeroAttributeItem4: TipHeroAttributeItem = null as unknown as TipHeroAttributeItem;
    @property({ type: TipHeroAttributeItem, displayName: "暴击伤害" })
    public tipHeroAttributeItem5: TipHeroAttributeItem = null as unknown as TipHeroAttributeItem;
    @property({ type: TipHeroAttributeItem, displayName: "命中" })
    public tipHeroAttributeItem6: TipHeroAttributeItem = null as unknown as TipHeroAttributeItem;
    @property({ type: TipHeroAttributeItem, displayName: "闪避" })
    public tipHeroAttributeItem7: TipHeroAttributeItem = null as unknown as TipHeroAttributeItem;
    @property({ type: TipHeroAttributeItem, displayName: "破甲" })
    public tipHeroAttributeItem8: TipHeroAttributeItem = null as unknown as TipHeroAttributeItem;

    start() {
        super.start();
    }

    /**
     * @description: 设置英雄属性
     * @param heroid: 英雄id
     */
    public setHeroId(heroid: number = 0) {
        //todo  debug value
        let listNames: string[] = ["血量", "攻击", "防御", "速度", "暴击", "暴击伤害", "命中", "闪避", "破甲"];//, "破甲2", "破甲3"];
        let listValues: number[] = [123, 123, 123, 2, 0.01, 0.02, 0.03, 0.04, 0.05];//, 0.08, 0.2];
        let listTypes: number[] = [0, 0, 0, 1, 2, 2, 2, 2, 2];//, 0, 1];
        // //骑士
        // if(heroid==0)
        // {            
        //     let playerInfo = DataMgr.getInstance().getPlayerInfo();            
        //     //todo
        //     // listValues[0] = herodata.getMaxHP();
        //     // listValues[1] = herodata.getATK();
        //     // listValues[2] = herodata.getDEF();
        //     // listValues[3] = herodata.getSpeed();
        //     // listValues[4] = herodata.getCrit();
        //     // listValues[5] = herodata.getCritDamage();
        //     // listValues[6] = herodata.getHit();
        //     // listValues[7] = herodata.getDodge();
        //     // listValues[8] = herodata.getDEFBreak();
        // }
        // else
        if (heroid != 0) {
            let herodata = GameModel.getInstance().getHeroesModel().getHeroInfoByDyncID(heroid) as HeroData;
            listValues[0] = herodata.getMaxHP();
            listValues[1] = herodata.getATK();
            listValues[2] = herodata.getDEF();
            listValues[3] = herodata.getSpeed();
            listValues[4] = herodata.getCrit();
            listValues[5] = herodata.getCritDamage();
            listValues[6] = herodata.getHit();
            listValues[7] = herodata.getDodge();
            listValues[8] = herodata.getDEFBreak();
        }

        this._setContents(listNames, listValues, listTypes);
    }

    private _setContents(names: string[], values: number[], types: number[]) {
        if ((values.length != names.length) || (values.length != types.length) || (values.length == 0)) {
            return;
        }

        let items: TipHeroAttributeItem[] = this.layout.node.getComponentsInChildren(TipHeroAttributeItem) as [TipHeroAttributeItem];
        if (items.length < values.length) {
            let nSub = values.length - items.length;
            let target = this;
            ResMgr.getInstance().loadPrefab('prefabs_ui/pop/tip_hero_attribute_item', (err, res) => {

                let pos = target.layout.node.getPosition();
                let hight = 0;
                // 通过预制体创建node
                for (let i = 0; i < nSub; i++) {
                    let p = instantiate(res as Prefab) as Node;
                    target.layout.node.addChild(p);
                }
                items = target.layout.node.getComponentsInChildren(TipHeroAttributeItem) as [TipHeroAttributeItem];

                let nodeSize = items[0].node.getComponent(UITransform)?.contentSize as math.Size;
                hight = (nodeSize.height + target.layout.spacingY) * nSub;
                pos.y += hight / 2;
                target.layout.node.setPosition(pos);

                for (let i = 0, len = items.length; i < len; i++) {
                    items[i].setTxtData(names[i], values[i], types[i]);
                }

            });
        }
        else if (items.length >= values.length) {
            let nSub1 = items.length - values.length;
            let pos = this.layout.node.getPosition();
            for (let i = 0; i < items.length; i++) {
                if (i >= values.length) {
                    items[i].node.active = false;
                }
                else {
                    items[i].setTxtData(names[i], values[i], types[i]);
                }
            }

            let nodeSize = items[0].node.getComponent(UITransform)?.contentSize as math.Size;
            let hight = (nodeSize.height + this.layout.spacingY) * nSub1;
            pos.y -= hight / 2;
            this.layout.node.setPosition(pos);
        }

    }
}
