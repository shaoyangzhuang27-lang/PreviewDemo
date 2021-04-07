/*
 * @Description: 单个英雄属性框UI单元
 * @Author: 徐涛
 * @Date: 2021-03-10 20:30:26
 * @LastEditTime: 2021-04-07 14:42:56
 */
import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TipHeroAttributeItem')
export class TipHeroAttributeItem extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property({ type: Label, displayName: "属性名" })
    public lab_name: Label = null as unknown as Label;

    @property({ type: Label, displayName: "属性值" })
    public lab_value: Label = null as unknown as Label;

    private _attrType: number = 0;   //属性类型 0:纯数字, 1:数字+秒, 2:数字%, 
    private _attrName: string = ""; //属性名
    private _attrValue: number = 0;  //属性值

    start() {
        // [3]
    }

    /**
     * @description: 设置属性
     * @param attrName 属性名
     * @param attrValue 属性值
     * @param attrType 属性类型
     */
    public setTxtData(attrName: string, attrValue: number, attrType: number = 0) {
        this.lab_name.string = attrName;
        let strValue = attrValue.toFixed();
        if (attrType == 1) {
            strValue = attrValue.toFixed(2);
            strValue += "秒";
        }
        else if (attrType == 2) {
            strValue = attrValue.toFixed(2);
            strValue += "%";
        }
        this.lab_value.string = strValue;
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
