/*
 * @Description: 英雄书院选择放置英雄窗
 * @Author: 徐涛
 * @Date: 2021-04-02 15:37:22
 * @LastEditTime: 2021-04-02 20:44:18
 */
import { _decorator, Node, Label, resources, instantiate, ScrollView, ToggleContainer, EventHandler, Toggle } from 'cc';
const { ccclass, property } = _decorator;
import { PopBase } from '../../../core/control/PopBase';
import { GameModel } from '../../model/GameModel';
import { HeroData } from '../../model/datas/HeroData';
import { NotifyMgr } from '../../control/NotifyMgr';
import { MsgMgr } from '../../control/MsgMgr';
import { HeroSelectIcon } from '../hero/HeroSelectIcon';
import { ValueMgr } from '../../model/ValueMgr';
import { PopMgr } from '../../control/PopMgr';

@ccclass('PopCollegeSelectHero')
export class PopCollegeSelectHero extends PopBase {

    @property({ type: Node, displayName: "确定选择" })
    public btn_save: Node = null as unknown as Node;

    @property({ type: Label, displayName: "按钮字" })
    public lab_save: Label = null as unknown as Label;
    @property({ type: Label, displayName: "标题" })
    public lab_title: Label = null as unknown as Label;
    
    @property({ type: ToggleContainer, displayName: "阵营" })
    public campGroup: ToggleContainer | null = null as unknown as ToggleContainer;

    @property({ type: ScrollView, displayName: "英雄滚动视图组件" })
    public scroll_HeroView: ScrollView = null as unknown as ScrollView;

    //拥有的所有英雄
    private _allHeroList: Map<number, HeroData> = new Map<number, HeroData>();
    //拥有的所有英雄列表显示对象
    private _bottomHeroItemList: Map<number, Node> = new Map<number, Node>();
    private _heroId: number = 0;
    private _pos: number = 0;
    private _heroPosList: Node[] = [];

    onLoad() {
        super.onLoad();

        const containerCampEventHandler = new EventHandler();
        containerCampEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerCampEventHandler.component = 'PopCollegeSelectHero';// 这个是代码文件名
        containerCampEventHandler.handler = '_onCampClick';
        containerCampEventHandler.customEventData = '';
        if (this.campGroup) {
            this.campGroup.checkEvents.push(containerCampEventHandler);
            this.campGroup.toggleItems.forEach((tog) => {
                tog?.checkEvents.push(containerCampEventHandler);
            });
        }

        this.btn_save?.on(Node.EventType.TOUCH_END, this._onSaveBtnCallBack, this);
    }

    start() {
        super.start();
        
        this.lab_title.string = ValueMgr.getInstance().getLanguageString("UI_SelectHero_Title");
		this.lab_save.string = ValueMgr.getInstance().getLanguageString("UI_Save");
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_set_college_hero, this._notifySetCollegeHeroHandle, this);

        this._allHeroList = GameModel.getInstance().getHeroList();
        this._initBottomHeros();
    }

    onDestroy() {
        super.onDestroy();
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_set_college_hero, this._notifySetCollegeHeroHandle, this);
    }

    private _onCampClick(event: Event, customEventData: string) {
        let tog: Toggle = (event as any);
        var index = tog.node.name.charAt(tog.node.name.length - 1);

        this._frushButtonHero();
    }

    private _frushButtonHero() {
        this._bottomHeroItemList.forEach((heroNode, dyncid) => {
            let heroSelectScript = heroNode.getComponent("HeroSelectIcon") as HeroSelectIcon;
            let heroData = heroSelectScript.getHeroData() as HeroData;
            let itemType = this._getItemType(heroData);
            heroSelectScript.setItemType(itemType);

            if (this._getCampType() == Msg.TCampType.ECampType_NULL) {
                heroNode.active = true;
            } else if (this._getCampType() == heroData.getCamp()) {
                heroNode.active = true;
            } else {
                heroNode.active = false;
            }
        });
    }

    //获取英雄选中状态
    private _getItemType(heroData: HeroData) {
        let itemType = 0; //itemType 0:未选中 1:选中 2:锁定
        let dyncId = heroData.getDyncID();
        if (dyncId == this._heroId && this._heroId != 0) {
            itemType = 1;
        }
        return itemType;
    }

    //获取当前阵营类型
    private _getCampType() {
        let togs = this.campGroup?.activeToggles();
        if (!togs) return;
        if (togs?.length == 0) {
            return Msg.TCampType.ECampType_NULL
        } else {
            let tog = togs[0] as Toggle;
            console.log(tog.name)
            console.log(tog.node.name)
            let index: number = Number(tog.node.name.charAt(tog.node.name.length - 1));
            return index;
        }
    }

    private _notifySetCollegeHeroHandle(data: any = null) {
        if (!data) {
            return;
        }

        let msg = data as Msg.SetCollegeHeroA;
        if (msg.err == Msg.TErrorCode.ERR_OK) {
            //关闭当前窗体
            this.delSelf();
        }
    }

    private _onSaveBtnCallBack() {
        if(this._heroId == 0 ){
            PopMgr.getInstance().popupPrompt(ValueMgr.getInstance().getLanguageString("UI_HeroCollegeNoSelectHero"));
            return ;
        }
        
        if (this._heroId != 0 && this._pos != 0) {
            MsgMgr.getInstance().getMsgHeroCollege().requestSetCollegeHero(this._heroId, true, this._pos);
            let msg = new Msg.SetCollegeHeroR({ heroId: this._heroId, isAdd: true, pos: this._pos });
            NotifyMgr.getInstance().notify(NotifyMgr.event_ui_set_college_hero, msg);
        }
    }

    /**
     * @description: 设置数据
     * @param {number} pos
     */
    public setData(pos: number) {
        this._heroId = 0;
        this._pos = pos;
    }

    private _initBottomHeros() {
        if (this.scroll_HeroView.content) {
            this.scroll_HeroView.content.removeAllChildren()
        }

        resources.load('prefabs_ui/main/hero_selecticon', (err: any, res: any) => {
            this._bottomHeroItemList.clear();
            let k = new Array<[number, Node]>();     //排序存储对象
            for (let heroData of this._allHeroList.values()) {
                let heroIcon = instantiate(res) as Node;
                this.scroll_HeroView.content?.addChild(heroIcon);
                let heroSelectScript = heroIcon.getComponent("HeroSelectIcon") as HeroSelectIcon;
                let itemType = this._getItemType(heroData);
                heroSelectScript.setItemType(itemType);
                heroSelectScript.setSelectData(heroData as HeroData, (heroData: HeroData, itemType: number) => {                    
                    this._heroSelect(heroData.getDyncID() );
                });

                let sortIndex_1: number = heroData.getLevel() * 10000 + heroData.getStar() * 1000 + heroData.getCamp() * 10 + heroData.getClasses();
                let sortIndex_2: number = 3000000 - sortIndex_1;
                k.push([sortIndex_2, heroIcon]);

                this._bottomHeroItemList.set(heroData.getDyncID(), heroIcon);
            }
            k.sort((n1, n2) => n1[0] - n2[0])
            k.forEach((value, key) => {
                value[1].setSiblingIndex(key);
            })
        });
    }

    //点选英雄
    private _heroSelect(heroId: number) {
        let isSelect= false;
        if(this._heroId==0){
            isSelect= true;
            this._heroId= heroId;
        }else{            
            if(this._heroId != heroId ){
                isSelect= true;
                this._heroId= heroId;
            }else{
                isSelect= false;
                this._heroId= 0;
            }
        }
        // this._getBottomHeroItemScript(heroId)?.setSelect(isSelect);   
        this._frushButtonHero();     
    }

    //根据herodata获取拥有英雄代码
    private _getBottomHeroItemScript(heroId: number) {
        for (let value of this._bottomHeroItemList.values()) {
            let script = value.getComponent("HeroSelectIcon") as HeroSelectIcon;
            let scriptHeroInfo = script.getCurHeroInfo() as HeroData;
            if (scriptHeroInfo.getDyncID() == heroId ) {
                return script;
            }
        }
    }

}
