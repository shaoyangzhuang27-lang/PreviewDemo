
import { Color, instantiate, Prefab, resources, Size, Sprite, SpriteFrame } from 'cc';
import { _decorator, Node, EventHandler, ToggleContainer, UITransform, Label } from 'cc';
import { PopBase } from '../../../../core/control/PopBase';
import { ResMgr } from '../../../control/ResMgr';
import { HeroData } from '../../../model/datas/HeroData';
import { GameModel } from '../../../model/GameModel';
import { TableName, ValueMgr } from '../../../model/ValueMgr';
const { ccclass, property } = _decorator;

@ccclass('PopHaloView')
export class PopHaloView extends PopBase {

    //顶部标题
    @property({type: Label})
    public lab_title:Label | null = null;

    //切换按钮组
    @property({ type:ToggleContainer })
    public node_tabBtn:ToggleContainer|null = null
    
    //光环节点
    @property({ type:Node, displayName:"光环节点" })
    public node_halo:Node = null as unknown as Node
    //阵营技能节点
    @property({ type:Node, displayName:"阵营技能节点" })
    public node_skill:Node = null as unknown as Node

    //光环内容节点
    @property({ type:Node, displayName:"光环内容节点" })
    public content_halo:Node = null as unknown as Node
    //阵营技能内容节点
    @property({ type:Node, displayName:"阵营技能内容节点" })
    public content_skill:Node = null as unknown as Node

    //总加成圆形控件
    @property({ type:Node, displayName:"总加成圆形控件" })
    public node_allProperty:Node = null as unknown as Node
    //总加成文字描述
    @property({ type:Label, displayName:"总加成文字描述" })
    public lab_allProperty:Label = null as unknown as Label

    //单项子节点预制体资源
    private item_res:Prefab = null as unknown as Prefab

    //英雄阵营数量数据
    private campInfo:any;

    start () {
        super.start();
        
        //默认显示光环
        this._showHaloView()

        //绑定按钮组点击事件
        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'PopHaloView';// 这个是脚本类名
        containerEventHandler.handler = '_tabBtnClick';
        this.node_tabBtn?.checkEvents.push(containerEventHandler)
    }

    //按钮组点击事件
    private _tabBtnClick(event:Event, customEventData:string) {
        let targetNode = event.target as any
        console.log("PopHaloView 按钮组点击事件 ",targetNode.name)
        if (targetNode.name == "Toggle1") {
            this._showHaloView()
        }
        else {
            this._showSkillView()
        }
    }
    //显示光环
    private _showHaloView() {
        this.node_halo.active = true
        this.node_skill.active = false

        if(this.lab_title)
            this.lab_title.string = "光环"
    }
    //显示技能
    private _showSkillView() {
        this.node_halo.active = false
        this.node_skill.active = true

        if(this.lab_title)
            this.lab_title.string = "阵营技能"
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

        ResMgr.getInstance().loadPrefab("prefabs_ui/halo/halo_item", (err:any, res:Prefab | null)=>{
            this.item_res = res as Prefab
            // console.log("PopHaloView 加载子项目资源完成")
            this._initHaloView()
            this._initSkillView()
        } );
    }
    
    //隐藏总加成和阵营技能
    private _hideAllPropertyAndSkill() {
        let allPropertyBg = this.node_halo.getChildByName("spr_allPropertyBg")
        if (allPropertyBg) {
            allPropertyBg.active = false
        }

        let scrollView_halo = this.node_halo.getChildByName("scrollView_halo")
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
        let halo_item = instantiate( this.item_res ) as Node

        let isHighlight = this.campInfo[campType] > 0
        let highlightCount = this.campInfo[campType]

        //高亮底图
        if (isHighlight) {
            ResMgr.getInstance().loadSpriteFrame("ui/common/halo/高亮底/spriteFrame", (err:any, spriteFrame:SpriteFrame | null)=>{
                if (!err && halo_item) {
                    let sprbg = halo_item.getComponent(Sprite) as Sprite
                    sprbg.spriteFrame = spriteFrame
                }
            });
        }

        //图标底图
        if (isHighlight) {
            ResMgr.getInstance().loadSpriteFrame("ui/common/camp/光环_激活框/spriteFrame", (err:any, spriteFrame:SpriteFrame | null)=>{
                if (!err && halo_item) {
                    let spr_iconBg = halo_item.getChildByName("spr_iconBg")?.getComponent(Sprite) as Sprite
                    spr_iconBg.spriteFrame = spriteFrame
                }
            });
        }
        else {
            ResMgr.getInstance().loadSpriteFrame("ui/common/camp/光环_未激活框/spriteFrame", (err:any, spriteFrame:SpriteFrame | null)=>{
                if (!err && halo_item) {
                    let spr_iconBg = halo_item.getChildByName("spr_iconBg")?.getComponent(Sprite) as Sprite
                    spr_iconBg.spriteFrame = spriteFrame
                }
            });
        }
        
        //图标
        let campIcons:any = ["无","水","火","木","光","暗"]
        let curCampIcon = "ui/common/team/" + campIcons[campType] + "/spriteFrame"
        ResMgr.getInstance().loadSpriteFrame(curCampIcon, (err:any, spriteFrame:SpriteFrame | null)=>{
            if (!err && halo_item) {
                let spr_icon = halo_item.getChildByName("spr_iconBg")?.getChildByName("spr_icon")?.getComponent(Sprite) as Sprite
                spr_icon.spriteFrame = spriteFrame
            }
        })

        // console.log("/////////////////////////",allItemData)
        
        for (let index = 0; index < 5; index++) {
            const heroCount = index+1
            let str = "上阵" + heroCount + "个英雄："
            str += this._parseProperty(allItemData[heroCount].propertyType, allItemData[heroCount].propertyNum)

            let lab = halo_item.getChildByName("layout_labs")?.getChildByName("lab_"+heroCount)?.getComponent(Label) as Label
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
            ResMgr.getInstance().loadSpriteFrame("ui/common/halo/高亮底/spriteFrame", (err:any, spriteFrame:SpriteFrame | null)=>{
                if (!err && halo_item) {
                    let sprbg = halo_item.getComponent(Sprite) as Sprite
                    sprbg.spriteFrame = spriteFrame
                }
            });
        }

        //图标底图
        ResMgr.getInstance().loadSpriteFrame("ui/common/main/技能按钮_按钮背景/spriteFrame", (err:any, spriteFrame:SpriteFrame | null)=>{
            if (!err && halo_item) {
                let spr_iconBg = halo_item.getChildByName("spr_iconBg")?.getComponent(Sprite) as Sprite
                spr_iconBg.spriteFrame = spriteFrame
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
        ResMgr.getInstance().loadSpriteFrame(curSkillIcon, (err:any, spriteFrame:SpriteFrame | null)=>{
            if (!err && halo_item) {
                let spr_icon = halo_item.getChildByName("spr_iconBg")?.getChildByName("spr_icon")?.getComponent(Sprite) as Sprite
                spr_icon.spriteFrame = spriteFrame
            }
        });

        //文字描述
        let data1 = ValueMgr.getInstance().getItemByField(TableName.language_ui,key+"1") as Config.language_ui.Record
        let data2 = ValueMgr.getInstance().getItemByField(TableName.language_ui,key+"2") as Config.language_ui.Record
        let data3 = ValueMgr.getInstance().getItemByField(TableName.language_ui,key+"3") as Config.language_ui.Record

        let lab1 = halo_item.getChildByName("layout_labs")?.getChildByName("lab_1")?.getComponent(Label) as Label
        let lab2 = halo_item.getChildByName("layout_labs")?.getChildByName("lab_2")?.getComponent(Label) as Label
        let lab3 = halo_item.getChildByName("layout_labs")?.getChildByName("lab_3")?.getComponent(Label) as Label

        lab1.string = data1.cn
        lab2.string = data2.cn
        lab3.string = data3.cn

        halo_item.getChildByName("layout_labs")?.getChildByName("lab_4")?.destroy()
        halo_item.getChildByName("layout_labs")?.getChildByName("lab_5")?.destroy()

        //高亮文字
        if (isHighlight && highlightHeroCount>=3 && highlightHeroCount<=5) {
            let lab = halo_item.getChildByName("layout_labs")?.getChildByName("lab_"+(highlightHeroCount-2))?.getComponent(Label) as Label
            lab.color = new Color(218,170,90)
        }

        return halo_item
    }
}
