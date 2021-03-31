
import { Button, Color, instantiate, ProgressBar, resources, Size, Sprite, SpriteFrame, Toggle, ToggleComponent } from 'cc';
import { _decorator, Node, EventHandler, ToggleContainer, UITransform, Label } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { PopMgr } from '../../control/PopMgr';
import { HeroData } from '../../model/datas/HeroData';
import { GameModel } from '../../model/GameModel';
import { TableName, ValueMgr } from '../../model/ValueMgr';
import { AvatarNode } from '../menu/AvatarNode';
const { ccclass, property } = _decorator;

@ccclass('PopSettingView')
export class PopSettingView extends PopBase {

    @property({ type:ToggleContainer })
    public node_tabBtn:ToggleContainer = null as unknown as ToggleContainer
    
    @property({ type:Node, displayName:"信息节点" })
    public node_info:Node = null as unknown as Node

    @property({ type:Node, displayName:"设置节点" })
    public node_set:Node = null as unknown as Node

    @property({ type:Node, displayName:"头像节点" })
    public node_avatar:Node = null as unknown as Node

    @property({ type:Label, displayName:"昵称" })
    public lab_nickName:Label = null as unknown as Label

    @property({ type:Label, displayName:"id" })
    public lab_id:Label = null as unknown as Label

    @property({ type:Node, displayName:"同步按钮" })
    public labbtn_updateInfo:Node = null as unknown as Node

    @property({ type:ProgressBar, displayName:"经验条" })
    public progressBar_exp:ProgressBar = null as unknown as ProgressBar

    @property({ type:Label, displayName:"经验值" })
    public lab_exp:Label = null as unknown as Label

    @property({ type:Button, displayName:"服务器按钮" })
    public btn_server:Button = null as unknown as Button

    @property({ type:Button, displayName:"客服按钮" })
    public btn_service:Button = null as unknown as Button

    @property({ type:Button, displayName:"兑换按钮" })
    public btn_gift:Button = null as unknown as Button

    @property({ type:ToggleComponent, displayName:"音乐开关" })
    public toggle_music:ToggleComponent = null as unknown as ToggleComponent

    @property({ type:ToggleComponent, displayName:"音效开关" })
    public toggle_effect:ToggleComponent = null as unknown as ToggleComponent
    

    //单项子节点预制体资源
    private item_res: any;

    //英雄阵营数量数据
    private campInfo:any;

    onLoad() {
        super.onLoad()

        //绑定按钮组点击事件
        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'PopSettingView';// 这个是脚本类名
        containerEventHandler.handler = '_tabBtnClick';
        this.node_tabBtn.checkEvents.push(containerEventHandler)

        //绑定按钮事件
        this.labbtn_updateInfo.on(Node.EventType.TOUCH_END, this._onClick_updateInfo, this)

        //绑定按钮事件
        this.btn_server.node.on(Button.EventType.CLICK, this._onClick_server, this)
        this.btn_service.node.on(Button.EventType.CLICK, this._onClick_service, this)
        this.btn_gift.node.on(Button.EventType.CLICK, this._onClick_gift, this)

        //绑定复选框事件
        this.toggle_music.node.on(Toggle.EventType.TOGGLE, this._onClick_music,this)
        this.toggle_effect.node.on(Toggle.EventType.TOGGLE, this._onClick_effect,this)
    }
    start() {
        super.start()

        //默认显示信息
        this._showInfoView()

        //赋值信息显示
        let playerInfo = GameModel.getInstance().getPlayerModel().getPlayerInfo()

        //玩家昵称
        this.lab_nickName.string = playerInfo.name

        //玩家ID
        this.lab_id.string = "ID：" + playerInfo.id

        //经验
        let curLv = playerInfo.level
        let curExp = playerInfo.exp
        let dataItem = ValueMgr.getInstance().getItemByField(TableName.upgrade_exp,curLv) as Config.upgrade_exp.Record
        let curLvAllExp = dataItem.playerExp
        console.log("经验值==========", playerInfo.level, curExp, curLvAllExp)
        //经验条
        this.progressBar_exp.progress = curExp/curLvAllExp
        //经验值
        this.lab_exp.string = curExp + "/" + curLvAllExp

        //游戏音乐开启/禁止
        let forbid_music = localStorage.getItem("forbid_music")
        if (forbid_music == "true") {
            this.toggle_music.setIsCheckedWithoutNotify(true)
        }
        else {
            this.toggle_music.setIsCheckedWithoutNotify(false)
        }

        //游戏音效开启/禁止
        let forbid_effect = localStorage.getItem("forbid_effect")
        if (forbid_effect == "true") {
            this.toggle_effect.setIsCheckedWithoutNotify(true)
        }
        else {
            this.toggle_effect.setIsCheckedWithoutNotify(false)
        }

        //载入头像
        resources.load('prefabs_ui/main/node_avatar', (err:any,res:any)=>{
            let p = instantiate( res )
            this.node_avatar.addChild(p)

            let script = p.getComponent("AvatarNode") as AvatarNode;
            script.openClick()
        })
    }
    onDestroy(){
        super.onDestroy()
    }

    //按钮组点击事件
    private _tabBtnClick(event:Event, customEventData:string) {
        let targetNode = event.target as any
        console.log("PopSettingView 按钮组点击事件 ",targetNode.name)
        if (targetNode.name == "Toggle1") {
            this._showInfoView()
        }
        else {
            this._showSetView()
        }
    }
    //显示信息
    private _showInfoView() {
        this.node_info.active = true
        this.node_set.active = false
    }
    //显示设置
    private _showSetView() {
        this.node_info.active = false
        this.node_set.active = true
    }

    private _onClick_updateInfo(event:any){
        console.log("点击 同步微信")
    }
    private _onClick_server(button:Button){
        console.log("点击 服务器")

        PopMgr.getInstance().popServerListView()
    }
    private _onClick_service(button:Button){
        console.log("点击 客服")
    }
    private _onClick_gift(button:Button){
        console.log("点击 兑换")
    }

    private _onClick_music(toggle:ToggleComponent){
        console.log("点击 音乐")
        
        if (toggle.isChecked) {
            console.log("禁止音乐：选中了")
            localStorage.setItem("forbid_music","true")

            console.log("禁止音乐 功能待实现")
        }
        else {
            console.log("禁止音乐：关闭了")
            localStorage.setItem("forbid_music","false")

            console.log("禁止音乐 功能待实现")
        }
    }
    private _onClick_effect(toggle:ToggleComponent){
        console.log("点击 音效")

        if (toggle.isChecked) {
            console.log("禁止音效：选中了")
            localStorage.setItem("forbid_effect","true")

            console.log("禁止音效：选中了 功能待实现")
        }
        else {
            console.log("禁止音效：关闭了")
            localStorage.setItem("forbid_effect","false")

            console.log("禁止音效：选中了 功能待实现")
        }
    }

    //设置数据
    public setHeroData(heroIds:[]=[], isHideSkill:boolean=false) {
        //英雄阵营数量
        this.campInfo = {
            1 : 0,
            2 : 0,
            3 : 0,
            4 : 0,
            5 : 0,
        }

        if (heroIds.length == 0) {
            //载入当前阵容
            let curFormationList:Map<number,HeroData> = GameModel.getInstance().getFormationModel().getCurrentFormation();
            curFormationList.forEach((heroData,key)=>{
                let campType = heroData.getCamp()
                if (campType != 0 && this.campInfo[campType]) {
                    this.campInfo[campType]++
                    if (this.campInfo[campType] > 5) {
                        this.campInfo[campType] = 5
                    }
                }
            })
        }
        else {
            //遍历数据
            for (let index = 0; index < heroIds.length; index++) {
                const key = heroIds[index];
                let heroData = ValueMgr.getInstance().getItemByField(TableName.heroes,key) as Config.heroes.Record
                if (heroData.camp != 0) {
                    this.campInfo[heroData.camp]++
                    if (this.campInfo[heroData.camp] > 5) {
                        this.campInfo[heroData.camp] = 5
                    }
                }
            }
        }

        console.log("this.campInfo====================",this.campInfo)

        if (isHideSkill) {
            this._hideAllPropertyAndSkill()
        }
        else {
            this._updateAllProperty()
        }

        resources.load('prefabs_ui/halo/halo_item', (err:any,res:any)=>{
            this.item_res = res
            // console.log("PopSettingView 加载子项目资源完成")
            this._initHaloView()
            this._initSkillView()
        } );
    }
    
    //隐藏总加成和阵营技能
    private _hideAllPropertyAndSkill() {
        let allPropertyBg = this.node_info.getChildByName("spr_allPropertyBg")
        if (allPropertyBg) {
            allPropertyBg.active = false
        }

        let scrollView_halo = this.node_info.getChildByName("scrollView_halo")
        scrollView_halo?.getComponent(UITransform)?.setContentSize(640,850)

        var clipView = scrollView_halo?.getChildByName("view")
        clipView?.setPosition(0,850)
        clipView?.getComponent(UITransform)?.setContentSize(640,850)

        if (this.node_tabBtn) {
            this.node_tabBtn.node.active = false
        }
    }
    //赋值总加成
    private _updateAllProperty() {
        //所有光环数据
        let allData:any = {
            1 : {},
            2 : {},
            3 : {},
            4 : {},
            5 : {},
        }
        let allValue = ValueMgr.getInstance().getTableByName(TableName.aura)
        for (let index = 0; index < allValue.records.length; index++) {
            const element = allValue.records[index] as Config.aura.Record
            allData[element.param][element.num] = element
        }
        // console.log("所有光环数据============================",allData)

        //所有加成累加
        let allProperty:any = {
            1 : { nameStr:"血量", addNum:0 },
            2 : { nameStr:"攻击", addNum:0 },
            3 : { nameStr:"防御", addNum:0 },
            4 : { nameStr:"攻速", addNum:0 },
            5 : { nameStr:"暴击率", addNum:0 },
            6 : { nameStr:"暴击伤害", addNum:0 },
            7 : { nameStr:"命中", addNum:0 },
            8 : { nameStr:"闪避", addNum:0 },
            9 : { nameStr:"破甲", addNum:0 },
            10 : { nameStr:"免伤", addNum:0 },
            11 : { nameStr:"技能", addNum:0 },
            12 : { nameStr:"治疗", addNum:0 },
        }

        for (let index = 0; index < 5; index++) {
            const campType = index + 1
            let curCamp_heroCount = this.campInfo[campType]

            if (curCamp_heroCount > 0) {
                let allItemData = allData[campType]

                let types:[] = allItemData[curCamp_heroCount].propertyType
                let nums:[] = allItemData[curCamp_heroCount].propertyNum
                
                for (let i = 0; i < types.length; i++) {
                    var property_type = types[i]
                    var property_item = allProperty[property_type]
                    if (!property_item) { continue }

                    property_item.addNum += nums[i]
                }
            }
        }

        // console.log("所有加成累加===",allProperty)

        let baseStr = ""
        for (let index = 0; index < 12; index++) {
            const property_type = index+1
            property_item = allProperty[property_type]
            if (!property_item) { continue }
            
            if (property_item.addNum > 0) {
                baseStr = baseStr + property_item.nameStr + "+" + property_item.addNum + "% "
            }
        }

        if (baseStr != "") {
            this.lab_allProperty.string = baseStr
        }
    }

    //光环内容
    private _initHaloView() {
        //所有光环数据
        let allData:any = {
            1 : {},
            2 : {},
            3 : {},
            4 : {},
            5 : {},
        }
        let allValue = ValueMgr.getInstance().getTableByName(TableName.aura)
        for (let index = 0; index < allValue.records.length; index++) {
            const element = allValue.records[index] as Config.aura.Record
            allData[element.param][element.num] = element
        }
        // console.log("所有光环数据============================",allData)

        //顺序： 水火木光暗
        let campType_list = [ 1, 2, 3, 4, 5 ]
        //排序
        campType_list.sort((v1,v2)=>{
            if (this.campInfo[v1] > 0 && this.campInfo[v2] == 0) {
                return -1
            }
            if (this.campInfo[v1] == 0 && this.campInfo[v2] > 0) {
                return 1
            }
            return 0
        })

        for (let index = 0; index < campType_list.length; index++) {
            const campType = campType_list[index]

            let itemNode = this._createHaloItem(campType,allData[campType])
            
            this.content_halo?.addChild(itemNode)
        }
    }
    private _createHaloItem(campType:any, allItemData:any) {
        let halo_item = instantiate( this.item_res )

        let isHighlight = this.campInfo[campType] > 0
        let highlightCount = this.campInfo[campType]

        //高亮底图
        if (isHighlight) {
            resources.load("ui/common/halo/高亮底/spriteFrame", SpriteFrame, (err, spriteFrame) => {
                if (!err && halo_item) {
                    halo_item.getComponent(Sprite).spriteFrame = spriteFrame
                }
            });
        }

        //图标底图
        if (isHighlight) {
            resources.load("ui/common/camp/光环_激活框/spriteFrame", SpriteFrame, (err, spriteFrame) => {
                if (!err && halo_item) {
                    halo_item.getChildByName("spr_iconBg").getComponent(Sprite).spriteFrame = spriteFrame
                }
            });
        }
        else {
            resources.load("ui/common/camp/光环_未激活框/spriteFrame", SpriteFrame, (err, spriteFrame) => {
                if (!err && halo_item) {
                    halo_item.getChildByName("spr_iconBg").getComponent(Sprite).spriteFrame = spriteFrame
                }
            });
        }
        
        //图标
        let campIcons:any = ["无","水","火","木","光","暗"]
        let curCampIcon = "ui/common/team/" + campIcons[campType] + "/spriteFrame"
        resources.load(curCampIcon, SpriteFrame, (err, spriteFrame) => {
            if (!err && halo_item) {
                halo_item.getChildByName("spr_iconBg").getChildByName("spr_icon").getComponent(Sprite).spriteFrame = spriteFrame
            }
        })

        // console.log("/////////////////////////",allItemData)
        
        for (let index = 0; index < 5; index++) {
            const heroCount = index+1
            let str = "上阵" + heroCount + "个英雄："
            str += this._parseProperty(allItemData[heroCount].propertyType, allItemData[heroCount].propertyNum)

            let lab = halo_item.getChildByName("layout_labs").getChildByName("lab_"+heroCount).getComponent(Label)
            lab.string = str
            if (highlightCount == heroCount) {
                lab.color = new Color(218,170,90)
            }
        }

        return halo_item
    }
    private _parseProperty(types:[], nums:[]) {
        // console.log("types=================",types)
        let typesString:any = {
            1 : "血量",
            2 : "攻击",
            3 : "防御",
            4 : "攻速",
            5 : "暴击率",
            6 : "暴击伤害",
            7 : "命中",
            8 : "闪避",
            9 : "破甲",
            10 : "免伤",
            11 : "技能",
            12 : "治疗",
        }
        let str = ""
        for (let index = 0; index < types.length; index++) {
            const element = types[index];
            str += typesString[element] + "+" + nums[index] + "%"
            if (index != types.length-1) {
                str += ","
            }
        }
        return str
    }

    //阵营技能内容
    private _initSkillView() {
        //顺序： 水火木光暗
        let id_keys = [
            "UI_CampSkillWater",
            "UI_CampSkillFire",
            "UI_CampSkillWood",
            "UI_CampSkillLight",
            "UI_CampSkillDark"
        ]

        //高亮处理
        let highlightKey = ""
        let highlightHeroCount = 0
        for (let index = 0; index < 5; index++) {
            const campType = index + 1
            if (this.campInfo[campType] >= 3) {
                highlightKey = id_keys[index]
                highlightHeroCount = this.campInfo[campType]
            }
        }

        //排序一下
        id_keys.sort((v1,v2)=>{
            if (v1 == highlightKey) {
                return -1
            }
            if (v2 == highlightKey) {
                return 1
            }
            return 0
        })

        for (let index = 0; index < id_keys.length; index++) {
            const key = id_keys[index]

            let itemNode = this._createSkillItem(key, key==highlightKey, highlightHeroCount)
            
            this.content_skill?.addChild(itemNode)
        }
    }
    private _createSkillItem(key:any, isHighlight:any, highlightHeroCount:any) {
        let halo_item = instantiate( this.item_res )

        //高亮底图
        if (isHighlight) {
            resources.load("ui/common/halo/高亮底/spriteFrame", SpriteFrame, (err, spriteFrame) => {
                if (!err && halo_item) {
                    halo_item.getComponent(Sprite).spriteFrame = spriteFrame
                }
            });
        }

        //图标底图
        resources.load("ui/common/main/技能按钮_按钮背景/spriteFrame", SpriteFrame, (err, spriteFrame) => {
            if (!err && halo_item) {
                halo_item.getChildByName("spr_iconBg").getComponent(Sprite).spriteFrame = spriteFrame
            }
        });

        //图标
        let skillIcons:any = {
            "UI_CampSkillWater" : "技能按钮_水球",
            "UI_CampSkillFire" : "技能按钮_火球",
            "UI_CampSkillWood" : "技能按钮_毒球",
            "UI_CampSkillLight" : "技能按钮_光球",
            "UI_CampSkillDark" : "技能按钮_暗球",
        }
        let curSkillIcon = "ui/common/main/" + skillIcons[key] + "/spriteFrame"
        resources.load(curSkillIcon, SpriteFrame, (err, spriteFrame) => {
            if (!err && halo_item) {
                halo_item.getChildByName("spr_iconBg").getChildByName("spr_icon").getComponent(Sprite).spriteFrame = spriteFrame
            }
        });

        //文字描述
        let data1 = ValueMgr.getInstance().getItemByField(TableName.language_ui,key+"1") as Config.language_ui.Record
        let data2 = ValueMgr.getInstance().getItemByField(TableName.language_ui,key+"2") as Config.language_ui.Record
        let data3 = ValueMgr.getInstance().getItemByField(TableName.language_ui,key+"3") as Config.language_ui.Record
        halo_item.getChildByName("layout_labs").getChildByName("lab_1").getComponent(Label).string = data1.cn
        halo_item.getChildByName("layout_labs").getChildByName("lab_2").getComponent(Label).string = data2.cn
        halo_item.getChildByName("layout_labs").getChildByName("lab_3").getComponent(Label).string = data3.cn
        halo_item.getChildByName("layout_labs").getChildByName("lab_4").destroy()
        halo_item.getChildByName("layout_labs").getChildByName("lab_5").destroy()

        //高亮文字
        if (isHighlight && highlightHeroCount>=3 && highlightHeroCount<=5) {
            halo_item.getChildByName("layout_labs").getChildByName("lab_"+(highlightHeroCount-2)).getComponent(Label).color = new Color(218,170,90)
        }

        return halo_item
    }
}
