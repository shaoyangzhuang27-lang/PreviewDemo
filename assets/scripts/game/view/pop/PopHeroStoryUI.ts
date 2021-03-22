/**
 * 游戏组件:英雄故事弹窗
 * @author 黄志清
 * @version 1.0.0,2021.3.19
 */
import { _decorator, Component, Node, Label } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
const { ccclass, property } = _decorator;

@ccclass('PopHeroStoryUI')
export class PopHeroStoryUI extends PopBase {

    @property({type :  Node})
    public btn_sure:Node = null as unknown as Node;

    @property({type :  Node})
    public btn_rewrd:Node = null as unknown as Node;

    @property({type :  Node})
    public img_hero:Node = null as unknown as Node;

    @property({type: Label})
    public lab_content:Label = null as unknown as Label;
    @property({type: Label})
    public lab_titleName:Label = null as unknown as Label;
    @property({type: Label})
    public lab_heroName:Label = null as unknown as Label;

    

    //英雄背景介绍 = storyStr + 图鉴id
    private storyStr:string = "DATA_HeroStory";     
    start () {
        super.start(); 
        this.btn_sure.on(Node.EventType.TOUCH_END, this._closeView, this);
        this.btn_rewrd.on(Node.EventType.TOUCH_END, this._getStrotyAward, this);
    }

    private _closeView()
    {
        this.deleteMe()
    }

    private _getStrotyAward()
    {

    }

    private _refreshView(data:any)
    {
        
    }

    /**
     * 
     * @param staticId 英雄静态id
     */
    public setData(staticId:number)
    {

    }

    onDestroy()
    {
        super.onDestroy()
    }
}
