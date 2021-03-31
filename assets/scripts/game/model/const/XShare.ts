
class CampBuff {
        public property = Msg.THeroPropertyType.EHeroPropertyType_NULL;
        public num = 0;
    }
export class XShare{
    private static _instance: XShare = new XShare();
    public static getInstance() {
        this._instance.initData();
        return this._instance;
    }
    
    //========================================
    //== const value from lua.
    //public double KVersion = 0;//例子
    //public int KLUA_BattleTime;//例子
    public KHeartbeatTimeoutSeconds = 60 * 3; //心跳超时
    public KMaxHeroQuality = 6; //英雄品质上限
    public KMaxHeroStar = 13; //英雄星级上限
    public KMaxHeroTier = 13; //英雄品阶上限
    public KStarUpMinStar = 3; //升星最小星级
    public KMaxBattleHeroNum = 5; //上阵最大随从数量
    public KMaxPVPBattleRecordNum = 10; //PVP战斗记录上限
    public KSkillPowerbar = 100; //随从能量条满足多少可以放被动技能
    public KAttackPowerUp = 10; //随从普通攻击一下加多少能量
    public KBeHitPowerUp = 5; //随从被打一下加多少能量
    public KKillPowerUp = 20; //随从击败对方加多少能量
    public KAttackSpeedParam = 0;
    public KLeaderPowerUpSpeed = 10; //主角能量自然增长速度单位是每秒这么多
    public KLeaderPowerUpAttack = 10; //主角普通攻击一下加多少能量
    public KLeaderPowerUpBeHit = 10; //主角掉血了加多少能量
    public KBaseHit = 90; //基础命中率
    public KBaseCrit = 10; //基础暴击几率
    public KBaseCritDmage = 150; //基础暴击伤害
    public KBaseDodge = 0; //基础闪避
    public KBaseBreak = 0; //基础破甲
    public KCampDamageBonus = 130; //阵营克制增伤倍数
    public KFragmentNumRequired = new Map<number,number>([[1,5],[2,10],[3,20],[4,30],[5,40],]);
    public KGuardingRadius = 10; //警觉半径
    //英雄品阶对应等级上限
    public KHeroMaxLevelForTier = new Array<number>(10, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260);
    public KHeroQualityUpMaterial = new Array<number>(5, 50, 500, 5000, 50000, 500000);
    public KHeroQualityUpMoney = new Array<number>(2000, 10000, 50000, 200000, 1000000, 5000000);
    public KHeroDecomposeMaterial = new Array<number>(1, 10, 100, 1000,  10000,  100000);
    public KHeroDecomposeAdvanceExp = new Array<number>(0, 35, 105, 245, 525, 1225, 2975, 6475, 12075, 20475);
    public KHeroDecomposeAdvanceExpByStar = new Array<number>(2, 5, 10, 30, 90, 180, 540, 720, 0, 0);
    public KHeroDecomposeSoulStone = new Array<number>(10, 20, 30, 90, 270, 540, 1620, 2160, 0);
    //public float KNormalMonsterScale;//普通怪放大多少
    //public float KEliteMonsterScale;//精英怪放大多少
    //public float KBossMonsterScale;//BOSS放大多少
    //public float KNormalMonsterAttackRangeOffset;//主角和随从攻击普通怪时的攻击距离补正
    //public float KEliteMonsterAttackRangeOffset;//主角和随从攻击精英怪时的攻击距离补正
    //public float KBossMonsterAttackRangeOffset;//主角和随从攻击BOSS怪时的攻击距离补正
    public KEquipComposeMaterialNum = 3;
    public KRoleSkillSlotNum = 3;
    public KRoleSkillMaxLevel = 5;
    public KRoleSkillLevelUpReqBook = new Map<number,Map<number,number>>();
    public KRoleSkillLevelUpReqMoney = new Map<number,Map<number,number>>();
    public KRoleSkillQualityUpReqMaterial = new Array<number>(0, 1, 10, 100, 250, 500, 500, 500, 500, 500);
    public KRoleSkillQualityUpReqMoney = new Array<number>(0, 10000, 50000, 100000, 500000, 1000000, 1000000, 1000000, 1000000, 1000000);
    public KCrystalUnlockStar = 6;
    public KHeroicSummoneVRmbOnce = 250;
    public KHeroicSummoneVRmbTenTimes = 2200;
    public KWonderSummonL = 50;
    public KWonderSummonH = 70;
    public KWonderSummonCostOne = 500;
    public KWonderSummonCostTen = 5000;
    public KStarterSummonTenUnlockCopy = 302;
    public KStarterSummonTenDuration = 7 * 3600 * 24;
    //升阶进阶石消耗
    public KHeroTierUpAdvanceExp = new Array<number>(20, 60, 300, 800, 1200, 2400, 3600, 4800, 6000, 10000, 15000, 20000, 30000);
    //升阶金币消耗
    public KHeroTierUpMoney = new Array<number>(1000, 10000, 30000, 60000, 100000, 300000, 500000, 800000, 1000000, 2000000, 3000000, 4000000, 5000000);
    public KHeroStarUpAdvanceExp = new Array<number>(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    //升阶属性提升
    public KHeroPropertyUpByTier = new Array<number>(0, 5, 25, 30, 35, 55, 75, 80, 85, 90, 95, 100, 105, 110, 115);
    public KCampBuffMap = new Map<Msg.TCampType,CampBuff>();// Dictionary<Msg.TCampType, CampBuff>
    public KHeroTalentUnlockTier = new Array<number>(2, 4, 5);
    public KMaxHeroTalentNum = 3;
    public KObjectQuality = new Map<Msg.TObjectType, Msg.TQualityType>([[1,2],[2,2],[3,2],[4,4],[5,1],[6,1],[7,1],[8,3],[9,4],[10,3],[11,4],[12,3],[3,2],[14,4],[15,2],[16,4],[17,3],[18,5],[19,4],[20,1],
        [21,3],[22,4],[23,3],[24,4],[25,3],[26,3],[27,3],[28,3],[29,2],[30,3],[31,3],[32,4],[33,1],[34,5],[35,4],[36,4],[37,4],[38,5],[39,5],[40,5],[41,5]]);
    public KEventCopyLimitTimes = 2;
    public KChallengeCopyLimitTimes = 10;
    public KShopRefreshFreeCD = 24 * 60 * 60;
    public KShopRefreshConsumeVrmb = new Array<number>(100, 100, 200, 200, 400, 400, 600, 600, 800, 800, 1000);
    public KShopGoodsNum = 0;
    public KHeroMissionTime = new Array<number>(3600, 3600 * 2, 3600 * 4, 3600 * 6, 3600 * 12, 3600 * 24, 3600 * 48);
    public KHeroMissionRefreshVrmb = 10;
    public KHeroMissionRefreshNum = 4;
    public KHeroMissionCompleteVrmb = new Array<number>(2, 5, 10, 20, 40, 60, 80);
    //public int KBaseSummonFreeCD;
    //public int KHeroicSummonFreeCD;
    public KSummonScoreNormal = 100;
    public KSummonScoreActivity = 30;
    public KSummonActivityCD = 168 * 60 * 60;
    public KAlchemyConsumeVrmb = new Array<number>(0, 20, 50);
    public KAlchemyRefreshCD = 3600 * 8;
    public KSoulShopRefreshFreeCD = 3600 * 24 * 7;
    public KSoulShopRefreshConsume = 1000;
    public KChangePlayerNameConsumeVrmb = 200;
    public KClassesExchangeStarMin = 3;
    public KClassesExchangeMiracleShard = new Array<number>(0, 0, 5, 20, 100, 500, 2000, 5000, 10000);
    public KMaxFriendNum = 30;
    public KMaxFriendGiftSend = 30;
    public KMaxFriendGiftReceive = 30;
    public KFriendCoopCD = 3600 * 8;
    public KFriendSummonGift = 10;
    
    public KVipAlchemyAddition = new Array<number>(0, 10, 20, 30, 40, 60, 80, 100, 120, 140, 160, 180, 200, 250);
    public KVipOfflineMoneyAddition = new Array<number>(0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 160, 200);
    public KVipOfflineExpAddition = new Array<number>(0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 160, 200);
    public KVipOfflineUpAddition = new Array<number>(0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 80, 100);
    public KVipEventCopyExtraTimes = new Array<number>(0, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8);
    public KVipHeroMissionAddition = new Array<number>(0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 8);
    public KVipHeroTalentRefreshExtraTimes = new Array<number>(0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 5, 6);
    public KVipHeroBagAddition = new Array<number>(0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 160, 200);
    public KFastBattleVipTimes = new Array<number>(1,2,2,3,3,4,4,5,5,6,6,7,7,8);
    public KHuntingBossVipTimes = new Array<number>(2,2,2,3,3,4,4,4,5,5,5,6,7,8);
    public KVipBuyEventCopyExtraTimesVrmb = 50;
    public KHeroBagMaxNum = 100;
    public KBuyHeroBagNumEach = 5;
    public KBuyHeroBagMaxTimes = 170;
    public KVipLevelUpVrmbReq = new Array<number>(300, 600, 1200, 2880, 7200, 18000, 45000, 99000, 198000, 356400, 534600, 801900, 1202850);
    public KLoginAwardListNum = 2;
    public KLoginAwardNumEveryList = 30;
    public KPVPBattleFreeTimes = 2;
    public KPVPTicketVrmb = 30;
    public KLadderBattleFreeTimes = 5; 
    //public Dictionary<Msg.TGameFunction,> KGameFunctionLevel;
    public KAdAwardTimes = 5;
    public KAdAwardVrmb = 20;
    public KDamageReduceParams = new Map<number,number>([[1000,0.0001],[4000,0.00005],[10000,0.00002],[20000,0.000008],[40000,0.0000025],[100000,0.000001]]);//SortedDictionary<float, float> 
    public KRookieCheckInTime = 15 * 24 * 60 * 60;
    public KMaxOfflineAwardTime = 8 * 60 * 60;
    public KRookiePackTime = 7 * 24 * 60 * 60;
    public KRookieQuestTime = 7 * 24 * 60 * 60;
    public KRookieQuestReqNum = 30;
    public KRookieQuestAwardVip = 300;
    public KRookieQuestAwardObj = new Array<number>(18, 0, 0, 0, 2);
    public KWheelTenTimesConsumeChip = 10;
    public KWheelTenTimesConsumeChipVip = 8;
    public KWheelTenTimesReqLevel = 80;
    public KWheelTenTimesReqVip = 2;
    public KAdvancedWheelReqLevel = 60;
    public KAdvancedWheelReqVip = 1;
    public KWheelRefreshConsumeVrmb = 50;
    public KWheelRefreshFreeCD = 8 * 60 * 60;
    public KWheelForceRefreshDuration = 24 * 60 * 60;
    public KNormalChipVrmb = 50;
    public KLuckyShopRefreshConsume = 100;
    public KLuckyShopFreeRefreshCD = 24 * 60 * 60;
    public KRoleFightingParam = 3000;
    public KRandomAwardTimeLimit = 60 * 10;
    public KLimitTaskBossFighting = new Array<number>(0.8, 0.9, 1.1);
    public KSkillFightingParam = new Array<number>(0, 2, 6, 9, 13, 16);
    public KFreeVrmbCD = 4 * 60 * 60;
    public KFreeVrmbNum = 20;
    public KChatBlockMaxNum = 30;
    public KMainVictimOffset = 100;
    public KOtherVictimOffset = 0;
    public KOtherVictimRadius = 0;
    public KBossShortestDistance = 40;
    public KHeroBookShowStar = new Array<number>(1,2,3,5,8,13);//HashSet<int> 
    public KSkillTapTapCD = 0.3;
    public KSkillTapTapPowerRecoverCD = 0;
    public KSkillTapTapMaxPower = 200;
    public KSkillTapTapPowerOnce = 10;
    public KSkillTapTapPowerRecover = 40;
    public KSkillTapTapPowerRecoverAuto = 10;
    public KSkillTapTapDamageIdle = 0.1;
    public KSkillTapTapDamageBoss = 0.3;
    public KSkillTapTapDistance = 20;
    public KSkillTapTapID = 101;
    public KSkillTapTapSound = "火球飞行";
    public KSkillTapTapParticle = "上帝技能粒子/火球";
    public KHeroPropertyToRole = 0.12;
    public KHeroResetVrmbConsume = new Array<number>(0, 0, 0, 0, 20, 20, 20, 20, 20, 20, 20, 20, 20);
    public KCopyProgressAutoDuration = 30;
    public KTrailShopRefreshCD = 72 * 60 * 60;
    public KTrailShopRefreshConsumeVrmb = 1000;
    public KGuildShopRefreshCD = 168 * 60 * 60;
    public KGuildShopRefreshConsumeVrmb = 1000;
    public KTrailResetCD = 48 * 60 * 60;
    public KGuildBossCheckKillNumReq = 10;
    public KGuildBossTimeLimit = 150;
    public KTrailItemHPRecoverPct = 50;
    public KTrailItemConsumeHP = 5;
    public KTrailItemConsumeReborn = 5;
    public KGuildMonsterContributionType = new Array<number>(1,4,4);
    public KGuildMonsterContributionNum = new Array<number>(50000,50,100);
    public KGuildMonsterDuration = 7 * 3600 * 24;
    public KGuildMonsterBattlePrice = new Array<number>(0,50,50,50,50);
    public KGuildMonsterContribution = new Array<number>(10000,20000,50000);
    public KGuildMonsterBuffPrice = new Array<number>(30,30,30,30,30,30,30,30,30,30);
    public KGuildMonsterBuffAdd = new Array<number>(20,40,60,80,100,120,140,160,180,200);
    public KGuildMonsterBuffTimeOne = 2 * 3600;
    public KGuildMonsterBuffTimeMax = 24 * 3600;
    public KGuildMonsterBuffTime = new Array<number>(1 * 24 * 3600, 7 * 24 * 3600);
    public KGuildMonsterBuffTimePrice = new Array<number>(300, 2100);
    public KMythicalCopyUnlockLevel = new Array<number>(525, 630, 735, 840, 945, 1050, 10150, 10250, 10350, 10450, 10550, 10650, 10750, 10850, 10950, 11050);  
    public KSuperMonthCardProductID = '';
    public KSuperMonthCardDailyAward = new Array<Msg.LootObject>();
    public KPetMaxLevel = new Array<number>(30,60,90,120);
    public KPetSkillMaxLevel = 30;
    public KPetSkillPowerTime = 10;
    public KHuntingBossEquipShow = new Map<number,Array<number>>();
    public KHuntingBossTimeLimit = 60;
    public KNormalBossTimeLimit = 60;
    public KLoopQuestsMoneyStart = 3600 * 24 * 3;
    public KLoopQuests2MoneyStart = 3600 * 24 * 2;
    public KBattleSpeedUpUnlockCopy = 108;
    public KBattleSpeedUpX3UnlockCopy = 525;
    public KBattleSpeedUpUnlockVipLevel = 3;
    public KArenaActivityScore = 0;//{3,1,2}
    //聊天间隔
    public KChatInterval = 3;
    public KRoleHeroMaxStar = 11;
    public KRoleHeroStarUpReqHeroStar = new Array<number>(5,5,5,5,6,7,8,9,10,11,12);
    public KRoleHeroStarUpReqHeroLevel = new Array<number>(20,40,60,80,100,120,140,160,180,200,220);
    public KRoleHeroStarUpReqRoleLevel = new Array<number>(20,40,60,80,100,120,140,160,180,210,240);
    public KRoleHeroStarUpReqCopy = new Array<number>(212,420,735,1050,10250,10450,10650,10850,11050,20250,20250);
    public KRoleHeroStarUpReqChallenge = new Array<number>(0,30,60,100,125,150,180,200,250,300,350);
    public KRoleHeroStarUpReqMoney = new Array<number>(20000,300000,500000,800000,1500000,2000000,2500000,3000000,5000000,7500000,10000000);
    public KRoleHeroArmorUnlockCopy = new Array<number>(0, 312, 630, 840, 1050);
    //--英雄学院
    //--格子最大数量
    public KCollegeBlockMaxNum = 100;
    //--格子冷却CD
    public KCollegeBlockCD = 0;
    public KHeroBagLimited = 1000;
    public KGuildBossVipTimes = new Array<number>(2,2,2,2,3,3,3,4,4,4,4,5,5,5);
    public KWonderSummonUnlockVipLevel = 5;
    public KAccumulatedCheckInDuration = 30;
    public K5StarHeroDecomposeReqCopy = 1030;
    public K5StarHeroDecomposeReqVipLevel = 5;
    public KDailyRechargeDuration = 7 * 3600 * 24;
    public KCollegeUnlockBlockVrmb = 500;
    public KTechnologyResetVrmb = 100;
    public KTechnologyResetMoneyReturn = 50;
    public KHeroFormationSpaceX = 2.5;
    public KHeroFormationSpaceY = 2.5;
    public KMonsterFormationSpaceX = 3;
    public KMonsterFormationSpaceY = 3;

    
    private KSuperMonthAwards = new Array<number>(23,0,0,0,2,6,1,0,5,2)  
    
    private KHuntingBossEquipNormal = new Array<number>(29, 17, 18, 19, 20)
    private KHuntingBossEquipHard = new Array<number>(37, 25, 26, 27, 28)
    private KHuntingBossEquipTorment = new Array<number>(45, 37, 38, 39, 40)
    private KHuntingBossEquipNightmare = new Array<number>(53, 37, 38, 39, 40)    

    // 技能表\天赋表通配符 ---------------start-------------------------------- 
    public getKeyStrSkillOrTalent(key: string, idx: number =0){
        if(idx==0){
            return "<"+key+">";
        }
        else{
            return "<"+key+idx.toString()+">";
        }
    }
    public  KStrSki11Range = "rp" ;//技能范围，对应 skill--- range 字段
    public  KStrSkilTargetNum ="tn";//影响人数，对应 target_num 字段 
    public  KStrSkil1EffectParam = "ep"; //效果参数1，非BUFF 类效果对应skill或talent表 effect_paraml 字段，BUFF类型效果对应buff_new表的effect_param1字段
    public  KStrSki11EffectParam2 = "ex"; //效果参数2，非BUFF类效果对应skill或talent表 effect_param2 字段，BUFF类型效果对应buff_new表的effect_param2字段
    public  KStrSkil1EffectChance = "ec"; //效果几率，对应 skill--- effect_chance 字段
    public  KStrBuffTime = "bt"; //BUFF类 型持续时间，对应buff_new 表的 duration 字段
    public  KStrBuffStack = "bs"; //BUFF类型的堆叠层数, 对应buff_new表的 max_stack 字段
    public  KStrSkil1EffectCondParam = "ecp"; //效果条件参数，对应 talent 表的 effect_cond_param 字段
    public  KStrSki11EffectIargetNum = "etn" ;//效果目标数量，对应 talent 表的 effect_target_num 字段
    public  KStrSki11LimitTimes = "1t"; //限制次数, 对应 talent 表limit_times  字段
    public  KStrSkil1TriggerParam = "tp"; //触发参数，对应 trigger_param
    public  KStrSki11Name = "<sn>"; //技能名称
    public  KStrSki11Replace ="<color=#48D56D> {0} </color>";
    // 技能表\天赋表通配符 -----------------end------------------------------ 

    //技能升级需求技能书数量
    private get_role_skill_book_req_num( quality:number, level:number ){
        return Math.pow(2, quality)
    }
    //技能升级需求金币数量
    private get_role_skill_money_req_num( quality:number, level:number ){
        return Math.pow(2, quality) * 2000
    }
    
    private KCampBuff = new Map<number,Array<number>>([[1,[1, 500]],[2,[2, 500]],[3,[7, 500]],[4,[5, 500]],[5,[9, 500]]]);

    private get_camp_buff( camp:number ){
        if(camp >= 1 && camp <= 5){
            return this.KCampBuff.get(camp)
        }
        return [0, 0]
    }

    private haveInit = false;
    public initData(){
        if(this.haveInit)return;
        this.haveInit = true;
        
        for (let i = Msg.TQualityType.EQuality_White; i <= Msg.TQualityType.EQuality_Golden; i++) {
            let tmpMap = new Map<number, number>();
            for (let j = 1; j <= this.KRoleSkillMaxLevel; j++) {
                tmpMap.set(j, this.get_role_skill_book_req_num(i, j));
            }
            this.KRoleSkillLevelUpReqBook.set(i, tmpMap);
        }

        for (let i = Msg.TQualityType.EQuality_White; i <= Msg.TQualityType.EQuality_Golden; i++) {
            let tmpMap =  new Map<number, number>();
            for (let j = 1; j <= this.KRoleSkillMaxLevel; j++) {
                tmpMap.set(j, this.get_role_skill_money_req_num(i, j));
            }
            this.KRoleSkillLevelUpReqMoney.set(i,tmpMap);
        }

        
        for (let i = Msg.TCampType.ECampType_Water; i <= Msg.TCampType.ECampType_Dark; i++) {
            let ret = this.get_camp_buff(i);
            if (ret?.length == 2) {
                let cb = new CampBuff();
                cb.property =  ret[0] as Msg.THeroPropertyType;
                cb.num = ret[1] / 10000;
                this.KCampBuffMap.set(i, cb);
            }
        }

        
        // KObjectQuality = new Dictionary<Msg.TObjectType, Msg.TQualityType>();
        // Dictionary<int, int> temp = XLua.instance.GetIntDict("KObjectQuality");
        // foreach (var v in temp) {
        //     KObjectQuality.Add((Msg.TObjectType) v.Key, (Msg.TQualityType) v.Value);
        // }

        
        // Dictionary<double, double> tmpDict = XLua.instance.GetDoubleDict("KDamageReduceParams");
        // KDamageReduceParams = new SortedDictionary<float, float>();
        // foreach (var v in tmpDict)
        //     KDamageReduceParams.Add((float) v.Key, (float) v.Value);

        
        // KHeroBookShowStar = new HashSet<int>();
        // List<int> tempAry = XLua.instance.GetIntArray("KHeroBookShowStar");
        // foreach (int star in tempAry)
        //     KHeroBookShowStar.Add(star);

        
        if (this.KSuperMonthAwards.length % 5 == 0) {
            for (let i = 0; i < this.KSuperMonthAwards.length / 5; i++) {
                let obj = new Msg.LootObject()
                obj.objType = this.KSuperMonthAwards[i * 5] as Msg.TObjectType;
                obj.param1 = this.KSuperMonthAwards[i * 5 + 1];
                obj.param2 = this.KSuperMonthAwards[i * 5 + 2];
                obj.param3 = this.KSuperMonthAwards[i * 5 + 3];
                obj.num = this.KSuperMonthAwards[i * 5 + 4];
                this.KSuperMonthCardDailyAward.push(obj); 
            }
        }

        
        this.KHuntingBossEquipShow.set(0, this.KHuntingBossEquipNormal);
        this.KHuntingBossEquipShow.set(1, this.KHuntingBossEquipHard);
        this.KHuntingBossEquipShow.set(2, this.KHuntingBossEquipTorment);
        this.KHuntingBossEquipShow.set(4, this.KHuntingBossEquipNightmare);
    }

    private KStarAddition = [1, 1.1, 1.2, 1.4, 1.6, 2.0, 2.2, 2.4, 2.6];//星级加成 
    
    public GetHeroAtk(base_atk:number, hero_star:number, hero_level:number) {
        let base_atk_for_star = base_atk * (this.KStarAddition[hero_star]) / 100
        let upgrade_atk_for_star = base_atk_for_star * 0.1
        return base_atk_for_star + upgrade_atk_for_star * hero_level
    }

    public GetHeroDef(base_def:number, hero_star:number, hero_level:number) {
        let base_def_for_star = base_def * (this.KStarAddition[hero_star]) / 100;
        let upgrade_def_for_star = base_def_for_star * 0.1
        return base_def_for_star + upgrade_def_for_star * hero_level
    }

    public GetHeroMaxHp(base_hp:number, hero_star:number, hero_level:number) {
        let base_hp_for_star = base_hp * (this.KStarAddition[hero_star]) / 100
        let upgrade_hp_for_star = base_hp * (this.KStarAddition[hero_star]) / 100 * 0.1
        return base_hp_for_star + upgrade_hp_for_star * hero_level
    }

    
    private PropertyType_HP = 1;
    private PropertyType_ATK = 2;
    private PropertyType_DEF = 3;
    private PropertyType_Speed = 4;
    private PropertyType_Crit = 5;
    private PropertyType_CritDamage = 6;
    private PropertyType_Hit = 7;
    private PropertyType_Dodge = 8;
    private PropertyType_DEFBreak = 9;	
    private PropertyCost = new Map<number,number>();
    public GetCrystalProperty(propertyType:number, cost:number, proNum:number) {
        
        this.PropertyCost.set(this.PropertyType_HP,0.00004)
        this.PropertyCost.set(this.PropertyType_ATK,0.00004)
        this.PropertyCost.set(this.PropertyType_DEF,0.0001)
        this.PropertyCost.set(this.PropertyType_Speed,0.000032)
        this.PropertyCost.set(this.PropertyType_Crit,0.00004)
        this.PropertyCost.set(this.PropertyType_CritDamage,0.0002)
        this.PropertyCost.set(this.PropertyType_Hit,0.00004)
        this.PropertyCost.set(this.PropertyType_Dodge,0.000036)
        this.PropertyCost.set(this.PropertyType_DEFBreak,0.00004)
        let num = this.PropertyCost.get(propertyType) as number;
        return cost * num / proNum
    }

    
    private EObject_NULL = 0
    private EObject_Money = 1
    private EObject_Exp = 2
    private EObject_UpgradePoint = 3
    private EObject_VRmb = 4
    private EObject_Hero = 5
    private EObject_Fragment = 6
    private EObject_Equip = 7
    private EObject_SkillBook = 8
    private EObject_MagicDust = 9
    private EObject_ClassesMaterial = 10
    private EObject_CampMaterial = 11
    private EObject_AdvanceExp = 12
    private EObject_BaseSummonScroll = 13
    private EObject_HeroicSummonScroll = 14
    private EObject_BaseMissionScroll = 15
    private EObject_HeroicMissionScroll = 16
    private EObject_SoulStone = 17
    private EObject_MiracleGem = 18
    private EObject_MiracleShard = 19
    private EObject_FriendGift = 20
    private EObject_PVPTicket = 21
    private EObject_SkillMaterial = 22
    public GetDailyQuestAwardNum(player_level:number, obj_type:number) {
        let num = 0
        if (obj_type == this.EObject_Money ){
            num = 1000 * player_level;
        }else if (obj_type == this.EObject_UpgradePoint){//随从经验石
            num = 500 * player_level;
        }
        return num
    }

    public GetAlchemyMoney(alchemyType:number, player_level:number) {
        if (player_level > 20){
            return 1000 * player_level * alchemyType
        }else{
            return 20000 * alchemyType
        }
    }

    public GetBuyHeroBagVrmb(times:number) {
        return 50 + 5 * times;
    }

    
    // public testDamageReduce() {
    //     for (let def = 1000; def < 50000; def += 1000) {
    //         let num = 0;
    //         let last_key = 0;
    //         this.KDamageReduceParams.forEach((cur_value:any,cur_key:number)=>{

    //             if (def > cur_key)
    //                 num += (cur_key - last_key) * cur_value;
    //             else {
    //                 num += (def - last_key) * cur_value;
    //                 break;
    //             }
    //             last_key = cur_key;
    //         })
    //         // Debug.LogFormat("DamageReduce: {0} when Def: {1}", num, def);
    //     }
    // }

    public GetTrailStageAward(level:number, stage:number, obj_type:number) {
        let num = 0
        if(obj_type == this.EObject_Money){
            num = level * 40 * (1 + (stage -1) * 0.02)
        }
        else if( obj_type == this.EObject_UpgradePoint){
            num = level * 30 * (1 + (stage -1) * 0.02)
        }
        return num
    }

    public GetSummonScoreAward(level:number, obj_type:number) {
        let num = 0
        if(obj_type == this.EObject_Money){
            num = level * 10000
        }
        else if(obj_type == this.EObject_UpgradePoint){
            num = level * 5000
        }
        else if(obj_type == this.EObject_AdvanceExp){
            num = level * 10
        }
        
        return num
    }
    public GetHeroBookAward(heroStaticID:number) {
        let i = Math.floor(heroStaticID / 1000000)
        let num = 0
        if(i > 3){
            num = 100
        }
        else if(i == 3){
            num = 50
        }
        return num
    }
    private GetRandomNum(Min:number, Max:number) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }
    public GetLadderGuard(rank:number) {
        let copy = 945
        if(rank >= 4 && rank <= 6){
            copy = this.GetRandomNum(936, 940)
        }else if( rank >= 7 && rank <= 10){
            copy = this.GetRandomNum(931, 935)
        }else if( rank >= 11 && rank <= 20){
            copy = this.GetRandomNum(926, 930)
        }else if( rank >= 21 && rank <= 30){
            copy = this.GetRandomNum(921, 925)
        }else if( rank >= 31 && rank <= 40){
            copy = this.GetRandomNum(916, 920)
        }else if( rank >= 41 && rank <= 50){
            copy = this.GetRandomNum(911, 915)
        }else if( rank >= 51 && rank <= 70){
            copy = this.GetRandomNum(906, 910)
        }else if( rank >= 71 && rank <= 90){
            copy = this.GetRandomNum(901, 905)
        }else if( rank >= 91 && rank <= 110){
            copy = this.GetRandomNum(836, 840)
        }else if( rank >= 111 && rank <= 140){
            copy = this.GetRandomNum(831, 835)
        }else if( rank >= 141 && rank <= 170){
            copy = this.GetRandomNum(826, 830)
        }else if( rank >= 171 && rank <= 200){
            copy = this.GetRandomNum(821, 825)
        }else if( rank >= 201 && rank <= 250){
            copy = this.GetRandomNum(816, 820)
        }else if( rank >= 251 && rank <= 300){
            copy = this.GetRandomNum(811, 815)
        }else if( rank >= 301 && rank <= 350){
            copy = this.GetRandomNum(806, 810)
        }else if( rank >= 351 && rank <= 400){
            copy = this.GetRandomNum(801, 805)
        }else if( rank >= 401 && rank <= 500){
            copy = this.GetRandomNum(731, 735)
        }else if( rank >= 501 && rank <= 600){
            copy = this.GetRandomNum(721, 730)
        }else if( rank >= 601 && rank <= 700){
            copy = this.GetRandomNum(711, 720)
        }else if( rank >= 701 && rank <= 800){
            copy = this.GetRandomNum(701, 710)
        }else if( rank >= 801 && rank <= 1000){
            copy = this.GetRandomNum(621, 630)
        }else if( rank >= 1001 && rank <= 1500){
            copy = this.GetRandomNum(611, 620)
        }else if( rank >= 1501 && rank <= 2000){
            copy = this.GetRandomNum(601, 610)
        }else if( rank >= 2001 && rank <= 2500){
            copy = this.GetRandomNum(511, 525)
        }else if( rank >= 2501 && rank <= 3000){
            copy = this.GetRandomNum(501, 510)
        }else if( rank >= 3001 && rank <= 4000){
            copy = this.GetRandomNum(411, 420)
        }else if( rank >= 4001){
            copy = this.GetRandomNum(401, 410)
        }
        return copy
    }

    //英雄书院--格子解锁需求符文水晶
    public GetCollegeMoneyConsume(index:number) {
        return (index - 1) * 100
    }
}