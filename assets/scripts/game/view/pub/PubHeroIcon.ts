//单个英雄头像
import { _decorator, Component, Node, Sprite, Label, Button,SpriteFrame, resources, math, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import { TableName, ValueMgr } from "../../model/ValueMgr";
import { XConsts } from "../../model/const/XConsts";
import { HeroData } from '../../model/datas/HeroData';

@ccclass('PubPubHeroIcon')
export class PubHeroIcon extends Component {
    @property({type :  Node})
    public img_camp:Node = null as unknown as Node;

    start () {
        this.img_camp.active = false;
               
    }
    
    
}


