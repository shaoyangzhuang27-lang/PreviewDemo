import { Color } from 'cc';
export class XConsts{
    public static  KLanguegeTypeUI:string = "UI";
    public static  KLanguegeTypeError:string = "ERR";
    public static  KLanguegeTypeData:string = "DATA"; 
    public static  KLanguegeTypeDync:string = "DYNC"; 
    public static  KNoticeNull:string = "DYNC_Notice_0";
    //主角英雄静态数据ID
    public static  KRoleHeroClassesID:number = 1;
    public static  KRoleHeroID:number = 0;
    //PVP阵容索引
    public static  KPVPFormationIndex:number = 0;
    //试炼阵容索引
    public static  KTrailFormationIndex:number = -1;
    //秘境阵容索引
    public static  KMythicalFormationIndex:number = 6;
    public static  KLadderFormationIndex:number = 7;
    //阵容格数
    public static  KFormationGridNum:number = 9;
    //锁屏类消息超过多长时间开始转圈
    public static  KLockScreenDelay:number = 1.0;
    // 锁屏幕超过多长时间自动断开
    public static  KLockScreenMaxTime:number = 20;
    //主角装备数量
    public static  KRoleHeroEquipNum:number = 6;
    public static  KIAPNameStarterTenSummon:string = "IAPNameStarterTenSummon";
    public static  KDailyRechargeDayCount:number = 5;

    // 装备合成材料数量
    public static KEquipComposeMaterialNum: number = 3;

    // 英雄背包每次购买格子个数
    public static KBuyHeroagNumEach: number = 5;
    // vip等级对应英雄背包格子数增加
    public static KVipHeroBagAddition: number[] = []
    // 英雄背包初始最大 100格子
    public static KHeroBagMaxNum: number = 100;

    public static  OrderStage = 0;
    public static  OrderMainUI = 1;
    public static  OrderPopHide = 2;
    public static  OrderPopShow = 3;
    public static  OrderTip = 4;
    public static  OrderLoading = 5;
    public static  OrderToash = 6;


    //图集名称
    public static  KAtlasCount:number = 12;
    public static  KAtlasCommon:string = "Atlas_Common_1";
    public static  KAtlasBackGround:string = "Atlas_Bigpicture";
    public static  KAtlasHeroIcon:string = "Atlas_HeroIcon";
    public static  KAtlasCrystal:string = "Atlas_Diamond";
    public static  KAtlasEquip:string = "Atlas_Equip";
    public static  KAtlasSkill:string = "Atlas_Skill";
    public static  KAtlasTalent:string = "Atlas_Talent";
    public static  KAtlasMainUI:string = "Atlas_MainUIForm";
    public static  KAtlasSummon:string = "Atlas_Summon";
    public static  KAtlasMap:string = "Atlas_Map";
    public static  KAtlasFace:string = "Atlas_Face"; 
    public static  KAtlasPortrait:string = "Atlas_Portrait";   
    public static  KAtlasGuildIcon:string = "Atlas_GuildIcon";   

    //上帝技能
    public static KGodSkills:number[] = new Array<number> (200,201,202,203,204,205);
    //上帝天赋
    public static KGodTalents:number[] = new Array<number> (200,201,202,203,204,205);
    public static KGodSkillNormal:number = 101;
    public static GodSkillParticle:string[] = new Array<string> ("上帝技能粒子/闪电球", "上帝技能粒子/冰球", "上帝技能粒子/火球", "上帝技能粒子/毒球", "上帝技能粒子/光球", "上帝技能粒子/暗球");
    public static GodSkillUltimateParticle:string[] = new Array<string> ("上帝技能粒子/闪电大招", "上帝技能粒子/水大招", "上帝技能粒子/火大招", "上帝技能粒子/毒大招", "上帝技能粒子/光大招", "上帝技能粒子/暗大招");
    public static GodSkillIcon:string[] = new Array<string> ("技能按钮_闪电", "技能按钮_水球", "技能按钮_火球", "技能按钮_毒球", "技能按钮_光球", "技能按钮_暗球" );
    public static GodSkillSlider:string[] = new Array<string> ("技能按钮_闪电充满", "技能按钮_水球充满", "技能按钮_火球充满", "技能按钮_毒球充满", "技能按钮_光球充满", "技能按钮_暗球充满");
    public static GodSkillFull:string[] = new Array<string> ("技能按钮_闪电充满发光", "技能按钮_水球充满发光", "技能按钮_火球充满发光", "技能按钮_毒球充满发光", "技能按钮_光球充满发光", "技能按钮_暗球充满发光");

    //常用颜色定义
    public static KColorGreen: Color = new Color(61, 229, 144);
    public static KColorRed: Color = new Color(221, 27, 27);
    public static KColorGray: Color = new Color(160, 160, 160);
    //public static Color KColorGray = new Color(200 , 222 , 255 );
    public static KColorBlack: Color = new Color(71, 71, 73);
    public static KColorGolden: Color = new Color(234, 185, 44);
    public static KColorOrange: Color = new Color(234, 90, 12);
    public static KColorCollegeLevel: Color = new Color(139, 186, 252);

    public static KCampSkillAndTalentsName:string[] = new Array<string> ("UI_None","UI_CampSkillWater","UI_CampSkillFire","UI_CampSkillWood","UI_CampSkillLight","UI_CampSkillDark");
    public static KCampSkillAndTalentsImgName:string[] = new Array<string> ("无", "光环_水球技能", "光环_火球技能", "光环_毒球技能", "光环_光球技能", "光环_暗球技能");
    public static KClassesName:string[] = new Array<string> ( "UI_None", "UI_Classes1", "UI_Classes2", "UI_Classes3", "UI_Classes4", "UI_Classes5", "UI_Classes6" );
    public static KCampName:string[] = new Array<string> ( "UI_None", "UI_CampType1", "UI_CampType2", "UI_CampType3", "UI_CampType4", "UI_CampType5", "UI_CampType6" );
    public static KQualityName:string[] = new Array<string> ( "NULL", "UI_Quality1", "UI_Quality2", "UI_Quality3", "UI_Quality4", "UI_Quality5", "UI_Quality6" );
    public static KEquipLocation:string[] = new Array<string> ( "None", "UI_Equip_Weapon", "UI_Equip_Head", "UI_Equip_Chest", "UI_Equip_Trinket" );
    public static KPropertyName:string[] = new Array<string> ( "None", "UI_Property_HP", "UI_Property_ATK", "UI_Property_DEF", "UI_Property_Speed", "UI_Property_Crit", "UI_Property_CritDamage",
        "UI_Property_Hit", "UI_Property_Dodge", "UI_Property_DEFBreak", "UI_Property_DamageReduce", "UI_Property_SkillEffect", "UI_Property_CampDamage");
    public static KArmorPropertyIconName:string[] = new Array<string> ( "主角武器", "主角盾牌", "主角头盔", "主角铠甲", "主角护手", "主角战靴");
    public static GetArmorPropertyIconName(quality:number, index:number) {
        let i:number = quality / 4 + 1;
        if (i > 4)
            i = 4;
        return XConsts.KArmorPropertyIconName[index] + i.toString();
    }

    
    public static  KQualityColor:Color[] = new Array<Color> (
        Color.WHITE, 
        new Color(187.0, 187.0, 187.0),
        new Color(120.0, 247.0, 103.0),
        new Color(103.0, 195.0, 247.0),
        new Color(247.0, 103.0, 234.0),
        new Color(254.0, 216.0, 87.0),
        new Color(249.0, 206.0, 120.0));

    public static KHeroDetailTierSpriteName:string[] = new Array<string> ( "英雄详情_标题背景品质灰", "英雄详情_标题背景品质绿","英雄详情_标题背景品质蓝", "英雄详情_标题背景品质紫", "英雄详情_标题背景品质橙", "英雄详情_标题背景品质红" );
    public static KHeroDetailCampSpriteName:string[] = new Array<string> ( "英雄详情_背景", "英雄详情_背景图4", "英雄详情_背景图5", "英雄详情_背景图1", "英雄详情_背景图2", "英雄详情_背景图3" );
    public static KCampSpriteName:string[] = new Array<string> ( "无", "水属性", "火属性", "木属性", "光属性", "暗属性" );
    public static KCampSpriteNameForHeroPromotion:string[] = new Array<string> ( "无", "ico_water", "ico_fire", "ico_tree", "ico_light", "ico_dark" );
    public static KCampFrameSpriteName:string[] = new Array<string> ( "无", "光环_水框", "光环_火框", "光环_木框", "光环_光框", "光环_暗框" );
    public static KCampLVSpriteName:string[] = new Array<string> ( "光环_骑士", "光环_水", "光环_火", "光环_木", "光环_光", "光环_暗" );
    public static KCampBGSpriteName:string[] = new Array<string> ( "无", "光环_水", "光环_火", "光环_木", "光环_光", "光环_暗" );
    public static KClassesSpriteName:string[] = new Array<string> ( "无", "无", "战士图标", "刺客图标", "法师图标", "游侠图标", "牧师图标" );
	public static KClassesSpriteNameForHeroPromotion:string[] = new Array<string> ( "无", "无", "ico_zs", "ico_ck", "ico_fs", "ico_yx", "ico_ms" );
    public static KNewClassesSpriteName:string[] = new Array<string> ( "无", "无", "icon_occupation5", "icon_occupation1", "icon_occupation2", "icon_occupation3", "icon_occupation4" );
    public static KClassesCombatSpriteName:string[] = new Array<string> ( "无", "无", "战斗_职业战士", "战斗_职业刺客", "战斗_职业法师", "战斗_职业游侠", "战斗_职业牧师" );
    public static KHeroQualityBgSpriteName:string[] = new Array<string> ( "小卡框_品质灰", "小卡框_品质绿", "小卡框_品质蓝", "小卡框_品质紫", "小卡框_品质橙", "小卡框_品质红", "小卡框_品质金");
    public static KItemHeroBookBGSpriteName:string[] = new Array<string> ( "无", "图鉴_新背景4", "图鉴_新背景5", "图鉴_新背景1", "图鉴_新背景2", "图鉴_新背景3");
    public static KHeroUpBgSpriteName:string[] = new Array<string> ( "战斗_头像灰上框", "战斗_头像绿上框", "战斗_头像蓝上框", "战斗_头像紫上框", "战斗_头像橙上框", "战斗_头像红上框", "战斗_头像金上框" );
    public static KHeroDownBgSpriteName:string[] = new Array<string> ( "战斗_头像灰下框", "战斗_头像绿下框", "战斗_头像蓝下框", "战斗_头像紫下框", "战斗_头像橙下框", "战斗_头像红下框", "战斗_头像金下框" );
    public static KMythicalgSpriteName:string[] = new Array<string> ( "秘闻副本_冰冷矿坑", "秘闻副本_灼热之地", "秘闻副本_幽暗森林", "秘闻副本_永恒圣地", "秘闻副本_灵魂熔炉", "秘闻副本_潮汐王座", "秘闻副本_燃烧峡谷", "秘闻副本_沉没沼泽", "秘闻副本_金色平原", "秘闻副本_暗影迷宫", "秘闻副本_岩石深渊", "秘闻副本_北风冻原", "秘闻副本_瘟疫之地", "秘闻副本_风暴旋涡", "秘闻副本_堕落神殿", "秘闻副本_时光回廊" );
    public static GetHeroBgByStar(star: number) {
        let idx:number = 0;
        if (star < 3)
            idx = star;
        else if (star < 5)
            idx = 3;
        else if (star < 8)
            idx = 4;
        else if (star < 11)
            idx = 5;
        else
            idx = 6;
        return idx;
    }
    public static GetQualityBgByStar(star:number) {
        let idx:number = 0;
        if (star < 3)
            idx = star;
        else if (star < 5)
            idx = 3;
        else if (star < 8)
            idx = 4;
        else if (star < 11)
            idx = 5;
        else
            idx = 6;
        return XConsts.KHeroQualityBgSpriteName[idx];
    }
    public static KHeroQualityBgSpriteNameForHeroBook:string[] = new Array<string> ( "无","图鉴_品质灰", "图鉴_品质绿", "图鉴_品质蓝", "图鉴_品质紫", "图鉴_品质红","图鉴_品质金");
    public static KQualityBgSpriteName:string[] = new Array<string> ( "无", "装备底板_灰", "装备底板_绿", "装备底板_蓝", "装备底板_紫", "装备底板_橙", "装备底板_金" );
    public static KequipBgSpriteName:string[] = new Array<string> ( "无", "装备底板_灰", "装备底板_绿", "装备底板_蓝", "装备底板_紫", "装备底板_橙", "装备底板_金" );
    public static KVCampBgSpriteName:string[] = new Array<string> ( "人物底板_灰", "人物底板_水", "人物底板_火", "人物底板_木", "人物底板_光", "人物底板_暗" );
    public static KVCampCombatBgSpriteName:string[] = new Array<string> ( "战斗_骑士阵营背景后", "战斗_水阵营背景后", "战斗_火阵营背景后", "战斗_木阵营背景后", "战斗_光阵营背景后", "战斗_暗阵营背景后" );
    public static KVCampCombatFrontBgSpriteName:string[] = new Array<string> ( "战斗_骑士阵营背景前", "战斗_水阵营背景前", "战斗_火阵营背景前", "战斗_木阵营背景前", "战斗_光阵营背景前", "战斗_暗阵营背景前" );
    public static KVSPCampBgSpriteName:string[] = new Array<string> ( "人物碎片底板_万能", "人物底板_水", "人物底板_火", "人物底板_木", "人物底板_光", "人物底板_暗" );
    public static KVSPAdvanceCampBgSpriteName:string[] = new Array<string> ( "人物碎片底板_万能", "多彩头像背景-蓝", "多彩头像背景-红", "多彩头像背景-绿", "多彩头像背景-黄", "多彩头像背景-紫" );
    public static KVSPCampBgFragSpriteName:string[] = new Array<string> ( "小卡框_碎片品质灰", "小卡框_碎片品质绿", "小卡框_碎片品质蓝", "小卡框_碎片品质紫", "小卡框_碎片品质橙", "小卡框_碎片品质红", "小卡框_碎片品质金");

    public static GetQualityBgFragByStar(star:number) {
        let idx:number = 0;
        if (star < 3)
            idx = star;
        else if (star < 5)
            idx = 3;
        else if (star < 7)
            idx = 4;
        else if (star < 9)
            idx = 5;
        else
            idx = 6;
        return XConsts.KVSPCampBgFragSpriteName[idx];
    }
    public static KObjectIconSpriteName:string[] = new Array<string> ("无", "金币", "经验", "升级点", "钻石", "英雄", "碎片", "装备", "技能", "魔法尘", "试炼点",
                                                                            "血瓶", "进阶点", "普通召唤卷轴","高级召唤卷轴", "普通任务卷轴", "高级任务卷轴", "灵魂石", "奇迹宝石", "奇迹碎片", "心",
                                                                            "竞技门票", "技能突破材料", "普通筹码", "高级筹码", "声望图标", "幸运硬币", "飞龙", "公会币", "公会经验", "宠物经验",
                                                                            "宠物技能材料", "功勋图标", "无", "奇迹卷轴", "锻造石", "符文水晶", "试炼功勋");
    public static KCrystalQualityString:string[] = new Array<string> ( "无", "I", "II", "III", "IV", "V", "VI" );
    public static KCampSummonBgName:string[] = new Array<string> ( "无", "阵营抽卡_水背板", "阵营抽卡_火背板", "阵营抽卡_木背板", "阵营抽卡_光暗背板", "阵营抽卡_光暗背板" );
    public static KLanguageShowString:string[] = new Array<string> ( "无", "English", "简体中文", "繁體中文", "日本語", "한국어");
    public static KPetBgSpriteName:string[] = new Array<string> ( "无", "宠物系统_龙背景水", "宠物系统_龙背景火", "宠物系统_龙背景木", "宠物系统_龙背景光", "宠物系统_龙背景暗");
    public static KHeroCampIcon:string[] = new Array<string> ( "无", "水", "火", "木", "光", "暗" );
    public static KNewHeroCampIcon:string[] = new Array<string> ( "无", "icon_camp5", "icon_camp3", "icon_camp4", "icon_camp2", "icon_camp1" );
    public static KHeroCampRestrainIcon:string[] = new Array<string> ( "无", "阵营克制_水", "阵营克制_火", "阵营克制_木", "阵营克制_光", "阵营克制_暗" );
    public static KHeroCampRestrainIconForHeroPromotion:string[] = new Array<string> ( "无", "ico_camp_restrain_water", "ico_camp_restrain_fire", "ico_camp_restrain_tree", "ico_camp_restrain_light", "ico_camp_restrain_dark" );
    public static KHeroClasses:string[] = new Array<string> ( "无", "无", "UI_Warrior", "UI_Assassin", "UI_Mage", "UI_Rogue", "UI_Pastor" );
    public static KCampColor:Color[] = new Array<Color>(
        Color.WHITE,
        new Color(103.0, 195.0, 247.0),
        new Color(244.0, 62.0, 5.0),
        new Color(120.0, 247.0, 103.0),
        new Color(249.0, 206.0, 120.0),
        new Color(247.0, 103.0, 234.0));

    public static KMapBgColor:Color[] = new  Array<Color>(
        new Color(119.0, 231.0, 242.0),
        new Color(112.0, 154.0, 248.0),
        new Color(117.0, 48.0, 246.0),
        new Color(236.0, 44.0, 49.0));

    public static KBuffQualityColor:Color[] = new Array<Color>(
        Color.WHITE,
        new Color(0, 229.0, 255.0),
        new Color(247.0, 155.0, 250.0),
        new Color(254.0, 131.0, 0));

    //#region 技能通配符
    public static GetKeyStrSkill(key:string, idx:number = 0) {
        if (idx == 0)
            return "<" + key + ">";
        else
            return "<" + key + idx + ">";
    }   
    public static KStrSkillRange:string = "rp"; //技能范围，对应range字段
    public static KStrSkillTargetNum:string = "tn"; //影响人数，对应target_num字段
    public static KStrSkillEffectParam:string = "ep"; //效果参数1，非BUFF类效果对应effect_param1字段，BUFF类型效果对应buff_new表的effect_param1字段
    public static KStrSkillEffectParam2:string = "ex"; //效果参数2，非BUFF类效果对应effect_param2字段，BUFF类型效果对应buff_new表的effect_param2字段
    public static KStrSkillEffectChance:string = "ec"; //效果几率，对应effect_chance字段
    public static KStrBuffTime:string = "bt"; //BUFF类型持续时间，对应buff_new表的duration字段
    public static KStrBuffStack:string = "bs"; //BUFF类型的堆叠层数
    public static KStrSkillEffectCondParam:string = "ecp"; //效果条件参数,对应effect_cond_param
    public static KStrSkillEffectTargetNum:string = "etn"; //效果目标数量，对应effect_target_num
    public static KStrSkillLimitTimes:string = "lt"; //限制次数
    public static KStrSkillTriggerParam:string = "tp"; //触发参数，对应trigger_param
    public static KStrSkillName:string = "<sn>"; //技能名称
    public static KStrSkillReplace:string = "<color=#48D56D>{0}</color>";
    //#endregion
    
    //#region 声音相关定义
    public static KSoundEffect_ButtonClick:string = "按钮点击";
    public static KSoundEffect_TabChange:string = "标签切换";
    public static KSoundEffect_UIOpenClose:string = "窗口开关";
    public static KSoundEffect_BattleWin:string = "胜利";
    public static KSoundEffect_BattleLose:string = "失败";
    public static KSoundEffect_RoleLevelUp:string = "角色升级";
    public static KSoundEffect_TierUp:string = "英雄进阶";
    public static KSoundEffect_StarUp:string = "英雄升星";
    public static KSoundEffect_QualityUp:string = "英雄突破";
    public static KSoundEffect_Decompose:string = "分解";
    public static KSoundEffect_GoldFly:string = "金币飞行";
    public static KSoundEffect_ExpFly:string = "经验飞行";
    public static KSoundEffect_ItemFly:string = "道具飞行";
    public static KSoundEffect_GainObject:string = "获得物品";
    public static KSoundEffect_Boss:string = "召唤Boss";
    public static KSoundEffect_PutonEquip:string = "装备穿";
    public static KSoundEffect_TakeoffEquip:string = "装备脱";
    public static KSoundEffect_HeroLevelUp:string = "英雄升级";
    public static KSoundEffect_SkillLevelUp:string = "技能升级";
    public static KSoundEffect_Wheel:string = "转盘";
    public static KSoundEffect_WheelRefresh:string = "转盘刷新";
    public static KSoundEffect_Summon:string = "普通召唤";
    public static KSoundEffect_TabNew:string = "标签新";
    public static KSoundEffect_CampSummon:string = "阵营召唤";
    public static KSoundEffect_SkillCD:string = "技能CD";
    public static KSoundEffect_Summon5Star:string = "召唤5星";
    public static AudioController_Category_Music:string = "Music";
    public static AudioController_Category_Noisy:string = "Noisy";
    public static AudioController_Category_UI:string = "UI";
    public static AudioController_Category_Skill:string = "Skill";
    public static KSoundMusic_Idle:string = "主城挂机音乐";
    public static KSoundMusic_Fight:string = "战斗音乐";
    public static KSoundMusic_City:string = "主城音乐";

    //英雄酒馆
    public static PUB_HERO_SUMMON_COUNT_MAX:number = 30 ;  //英雄召唤
    public static PUB_WONDER_SUMMON_COUNT_MAX:number = 70 ;  //奇迹召唤
    public static PUB_SUMMON_DIAMOND_ONE_COSUME:number = 300 ;
    public static PUB_SUMMON_DIAMOND_TEN_COSUME:number = 2700 ;
    public static PUB_SUMMON_SCROLL_EXCHANGE_DIAMOND:number = 270 ;
    public static PUB_SUMMON_SCROLL_ONE_COSUME:number = 1 ;
    public static PUB_SUMMON_SCROLL_TEN_COSUME:number = 10 ;
    public static PUB_SUMMON_FRIEND_ONE_COSUME:number = 10 ;
    public static PUB_SUMMON_FRIEND_TEN_COSUME:number = 100 ;
    public static PUB_SUMMON_WONDER_ONE_COSUME:number = 500 ;
    public static PUB_SUMMON_WONDER_TEN_COSUME:number = 5000 ;

    public static PUB_UI_HEROSUMMON : string = "UI_HeroSummon";  //英雄酒馆
    public static PUB_UI_CAMPRECOMMEND : string = "UI_CampRecommend";  //推荐阵容
    public static PUB_UI_NEWSUMMONHEROLOTTO: string = "UI_NewSummonHeroLotto";  //10连英雄召唤
    public static PUB_UI_NEWSUMMONJEWELCONSUMEO: string = "UI_NewSummonJewelConsume";  //钻石消耗直降
    public static PUB_UI_NEWSUMMONRESIDUE: string = "UI_NewSummonResidue";  //再召唤{0}次必得五星传奇英雄
    public static PUB_UI_NEWSUMMONFRIENDCONTENT: string = "UI_NewSummonFriendContent";  //添加好友，每日互送爱心，即可免费召唤英雄。
    public static PUB_UI_FRIENDSUMMON : string = "UI_FriendSummon";
    public static PUB_UI_HEROICSUMMON : string = "UI_HeroicSummon";
    public static PUB_UI_BUYSUMMONSCROLL : string = "UI_BuySummonScroll";

    public static PUB_UI_HeroicSummon : string = "UI_HeroicSummon"; //英雄召唤
    public static PUB_UI_FriendSummon : string = "UI_FriendSummon"; //友情召唤

    //酒馆奇迹召唤 
    public static PUB_UI_WONDERSUMMON : string = "UI_WonderSummon";  //奇迹召唤
    public static PUB_UI_WONDERSUMMONAWARD : string = "UI_WondersummonAward";  //十连抽必得稀有奖励
    public static PUB_UI_RAREAWARD : string = "UI_RareAward";  //奖池详情

    public static PUB_UI_WONDERSUMMONRESIDUE : string = "UI_WonderSummonResidue";  //再召唤<color=#F2B633>{0}</color>次必得心愿英雄
    public static PUB_UI_WONDERHERO : string = "UI_WonderHero";  //心愿英雄
    public static PUB_UI_WONDERHEROSELECT : string = "UI_WonderHeroSelect";  //请在下方选择心愿英雄
    public static PUB_UI_WONDERSUMMONMUST : string = "UI_WonderSummonMust";  //下次召唤必得心愿英雄
    public static PUB_OPEN_WONDER_SUMMON_LEVEL : number = 80; //奇迹召唤开启等级 

    public static PUB_UI_WONDERSUMMONEXPLAIN : string = "UI_WonderSummonExplain";  //奇迹召唤说明
    public static PUB_UI_WONDERSUMMONCONTENT : string = "UI_WonderSummonContent";  //奇迹召唤说明内容
    public static PUB_UI_BUYWONDERSUMMON : string = "UI_BuyWonderSummon";
    public static PUB_UI_CLICKTOCONTINUE : string = "UI_ClickToContinue";   //点击屏幕继续

    
    

    public static PUB_UI_WONDER_DEFAULT_HEARTHERO : number = 5051401;  //奇迹召唤默认心愿英雄

    public static PUB_UI_WONDER_DEFAULT_DIAMOND_REWARD : number = 10000; //10.0k钻石

    public static PUB_UI_WONDER_DEFAULT_EQUIP_REWARD : number = 1; // 1   装备奖励个数

    public static PUB_UI_WONDER_DEFAULT_FRAGMENT_REWARD : number = 30; //碎片奖励个数

   //英雄推荐阵容-
    public static PUB_RECOMMEND_LINEUP_UI_PACKUP : string = "UI_PackUp";
    public static PUB_RECOMMEND_LINEUP_UI_VIEWDETAIL : string = "UI_Detail";
    public static PUB_RECOMMEND_LINEUP_UI_COREHERO : string = "UI_CoreHero";
    public static PUB_RECOMMEND_LINEUP_UI_KNIGHTARMOR : string = "UI_KnightArmor";
    public static PUB_RECOMMEND_LINEUP_UI_CAMPANALYSE : string = "UI_CampAnalyse";

    public static PUB_UI_SUMMONDESCTITLE : string = "UI_SummonDescTitle";
    public static PUB_UI_SUMMONDESC : string = "UI_SummonDesc";




    //获得英雄界面
    public static SUMMON_SETTLE_TITLE : string = "DATA_Achievement6";  //获得英雄
    public static SUMMON_SETTLE_HORIZONTAL_COUNTS : number = 5;

    public static HERO_ICON_TYPE  = {
        RecLineUp : 1,
        SummonSettle : 2,
        WonderSummon :3
    }

    //碎片
    public static UI_FRAGMENT : string  = "UI_Fragment";  //碎片
    public static UI_NOTFORSALE : string = "UI_NotForSale";  //不可出售
    public static UI_FRAGMENTNAME : string = "UI_FragmentName";  //{0}星英雄碎片
    public static UI_FRAGMENTDESC : string = "UI_FragmentDesc";  //收集{0}个英雄碎片可召唤1个{1}星英雄
    public static UI_FRAGMENTCAMPNAME : string = "UI_FragmentCampName";  //{0}星{1}英雄碎片
    public static UI_FRAGMENTCAMPDESC : string = "UI_FragmentCampDesc";  //收集{0}个英雄碎片可召唤1个{1}星{2}英雄
    public static UI_FRAGMENTCLASSESNAME : string = "UI_FragmentClassesName";  //{0}星{1}英雄碎片
    public static UI_FRAGMENTCLASSESDESC : string = "UI_FragmentClassesDesc";  //收集{0}个英雄碎片可召唤1个{1}星{2}英雄
    public static UI_FRAGMENTHERONAME : string = "UI_FragmentHeroName";  //{0}星{1}碎片
    public static UI_FRAGMENTHERODESC : string = "UI_FragmentHeroDesc";  //收集{0}个碎片可召唤1个{1}星{2}
    public static UI_FRAGMENTUSE : string = "UI_FragmentUse";  //召唤
    public static UI_INFO : string = "UI_Info";  //信息


    //星级合成消耗碎片
    public static KFragmentNumRequired : number[] = new Array<number> (0,5,10,20,30,50);
    public static KFragmentFrameSpriteName:string[] = new Array<string> ( "小卡框_品质随机", "小卡框_品质橙");
    public static KFragmentQualitySpriteName:string[] = new Array<string> ( "小卡框_碎片品质随机", "小卡框_碎片品质橙");
    public static KFragmentBgSpriteName:string[] = new Array<string> ( "小卡框_品质普通背景", "小卡框_品质金背景");
    //英雄置换消耗
    public static KClassesExchangeMiracleShard : number[] = new Array<number>(0, 0, 5, 20, 100, 500, 2000, 5000, 10000);

    public static KFragmentClassesName : string[] = new Array<string>("UI_OrdinaryHero","UI_SeniorHero","UI_LegendHero")
    public static POP_SUMMON_TYPE  = {
        HeroPub : 1,
        FragmentSysthesis : 2,
    }

    //图鉴英雄状态
    public static HeroBookState = {
        Null : 0,   //未激活
        CanActive : 1,      //可激活
        CanUpGrade : 2,      //可升级
        Normal : 3,      //常态
    }

    //升星塔获得物品
    public static KStarUpGainObjectTitle : string = "UI_GainObject_Title" ;  //获得物品
    public static UI_AUTODECOMPOSEGET : string = "UI_AutoDecomposeGet"; //普通英雄自动分解获得
    public static AUTODECOMPOSE_MAX_STARS : number = 3;  //分解最大星级

} 