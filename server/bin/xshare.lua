-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- xshare.lua
-- 服务器客户端共享配置及规则，适合游戏常量，规则定义等
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 渠道不同的配置，放在最前面
KChannelString = "bk"
KLeitingPayUrl = "http://daimqsgameos.leiting.com:8898/lt_pay"
KLeitingLogos = 0
KUpdateDataUrl = "https://static.daimengqishi.com/update/data/"
KBattleRecordDataUrl = ""
-- pay controller
KProductCode   = "68726227440852764003065648350196 "
KProductKey    = "07969233"
KCallback_Key  = "63216970084049788038225294886222"
KMd5_Key       = "cssesfjs2iwsgihymcrdrxuoqmh50wmc"
KbokeHost      = "http://checkuser.quickapi.net/v2/checkUserInfo"
-- VIP升级所需钻石
KVipLevelUpVrmbReq = {60, 300, 1000, 3000, 5000, 10000, 20000, 50000, 100000, 200000, 300000, 400000, 500000}
--抽卡钻石消耗
KHeroicSummoneVRmbOnce = 300
KHeroicSummoneVRmbTenTimes = 2700
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
KIsDebugServer = 1 --服务器调试开关
KCheatSecond = 0 --消灭一拨怪的间隔小于10秒，认为加速了
KChatInterval = 3 --聊天间隔，小于这个时间不转发
KClientMainVersion = 1
KClientMinorVersion = 0
KUpdateVersionUrl = "https://play.google.com/store/apps/details?id=com.ltgames.android.idk"
KDiscordUrl = "https://discord.gg/Fg3qPa5"
KHeartbeatTimeoutSeconds = 60 * 3
KMaxPVPBattleRecordNum = 10 --PVP战斗记录上限
KPVPBattleRecordSavePath = "./data/battle_records/" --PVP战报路径
KLadderBattleRecordSavePath = "./data/ladder_records/" --天梯战报路径
KNotchOffsetTop = 90
KNotchOffsetBottom = 0
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
--英雄品质上限
KMaxHeroQuality = 6
--英雄星级上限
KMaxHeroStar = 13
--英雄品阶上限
KMaxHeroTier = 13
--升星最小星级
KStarUpMinStar = 3
--阵型数量
KFormationNum = 5
--上阵位置解锁等级
KFormationUnlockLevel = {1, 1, 1, 1, 1}
--图鉴显示星级 
KHeroBookShowStar = {1,2,3,5,8,13}
--副本多爆概率，总数 分段1 分段2 
KPassEventCopy = {100,60,90}

-- 物品品质
KObjectQuality = {}
KObjectQuality[1] = 2 --金币 绿色
KObjectQuality[2] = 2 --经验 绿色
KObjectQuality[3] = 2 --升级点 绿色
KObjectQuality[4] = 4 --钻石 紫色
KObjectQuality[5] = 1 
KObjectQuality[6] = 1 
KObjectQuality[7] = 1 
KObjectQuality[8] = 3 --技能书 蓝色
KObjectQuality[9] = 4 --魔法尘 紫色
KObjectQuality[10] = 3 --试炼点 蓝色
KObjectQuality[11] = 4 --试炼恢复道具 紫色
KObjectQuality[12] = 3 --进阶材料 蓝色
KObjectQuality[13] = 2 --普通召唤卷轴 绿色
KObjectQuality[14] = 4 --高级召唤卷轴 紫色
KObjectQuality[15] = 2 --普通任务卷轴 绿色
KObjectQuality[16] = 4 --高级任务卷轴 紫色
KObjectQuality[17] = 3 --灵魂石	蓝色
KObjectQuality[18] = 5 --神秘宝石	橙色
KObjectQuality[19] = 4 --神秘碎片	紫色
KObjectQuality[20] = 1 --好友赠礼   白色
KObjectQuality[21] = 3 --竞技门票   蓝色
KObjectQuality[22] = 4 --技能突破材料 紫色
KObjectQuality[23] = 3 --普通筹码 蓝色
KObjectQuality[24] = 4 --高级筹码 紫色
KObjectQuality[25] = 3 --声望 蓝色
KObjectQuality[26] = 3 --幸运硬币 蓝色
KObjectQuality[27] = 3 --合成资源 蓝色
KObjectQuality[28] = 3 --公会币 蓝色
KObjectQuality[29] = 2 --公会经验 绿色
KObjectQuality[30] = 3 --宠物经验 蓝色
KObjectQuality[31] = 3 --宠物石 蓝色
KObjectQuality[32] = 4 --功勋 紫色
KObjectQuality[33] = 1 --可使用道具 按静态表的数据走
KObjectQuality[34] = 5 --奇迹宝石 橙色
KObjectQuality[35] = 4 --锻造石 紫色
KObjectQuality[36] = 4 --符文水晶 紫色
KObjectQuality[37] = 4 --试炼功勋 紫色
KObjectQuality[38] = 5 --头像 橙色
KObjectQuality[39] = 5 --头像框 橙色
KObjectQuality[40] = 5 --称号 橙色
KObjectQuality[41] = 5 --皮肤 橙色
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
--随从形象数量
KHeroImageNum = {}
KHeroImageNum[2] = 3
KHeroImageNum[3] = 3
KHeroImageNum[4] = 3
KHeroImageNum[5] = 3
KHeroImageNum[6] = 3

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 抽卡相关
-- 基础抽卡星级概率
KBasicSummonRate = {}
KBasicSummonRate[1] = 6000
KBasicSummonRate[2] = 3000
KBasicSummonRate[3] = 840
KBasicSummonRate[4] = 155
KBasicSummonRate[5] = 5
-- 高级抽卡星级概率
KHeroicSummonRate = {}
KHeroicSummonRate[1] = 1000
KHeroicSummonRate[2] = 2000
KHeroicSummonRate[3] = 5439
KHeroicSummonRate[4] = 1361
KHeroicSummonRate[5] = 200
-- 友情抽卡星级概率
KFriendSummonRate = {}
KFriendSummonRate[1] = 2000
KFriendSummonRate[2] = 4000
KFriendSummonRate[3] = 3090
KFriendSummonRate[4] = 735
KFriendSummonRate[5] = 175
--抽卡职业几率
KSummonClassesRate = {}
KSummonClassesRate[2] = 2200
KSummonClassesRate[3] = 2200
KSummonClassesRate[4] = 2200
KSummonClassesRate[5] = 2200
KSummonClassesRate[6] = 1200
--抽卡阵营几率
KSummonCampRate = {}
KSummonCampRate[1] = 2400
KSummonCampRate[2] = 2400
KSummonCampRate[3] = 2400
KSummonCampRate[4] = 1400
KSummonCampRate[5] = 1400
--抽卡品质几率
function random_summon_quality( star )
	local quality = 1
	local rate = math.random(10000)
	if star == 3 then
		if rate < 5000 then
			quality = 2
		else
			quality = 1
		end
	elseif star == 4 then
		if rate < 5000 then
			quality = 3
		else
			quality = 2
		end
	elseif star == 5 then
		if rate < 100 then
			quality = 5
		elseif rate < 2000 then
			quality = 4
		else
			quality = 3
		end
	end
	return quality
end
--抽卡免费CD
KBaseSummonFreeCD = 8 * 60 * 60
KHeroicSummonFreeCD = 48 * 60 * 60
--友情抽卡消耗
KFriendSummonGift = 10
--普通抽卡积分出5星
KSummonScoreNormal = 100
--活动抽卡积分出5星
KSummonScoreActivity = 30
--活动抽卡CD
KSummonActivityCD = 168 * 60 * 60

--阵营抽卡
ECampSummonResultType_Hero = 1;
ECampSummonResultType_RandomFragment = 2;
ECampSummonResultType_CampFragment = 3;

-- function random_camp_summon(  )
-- 	local ret = {0, 0, 0, 0}
-- 	rate = math.random(10000)
-- 	if rate < 2800 then -- 28%英雄
-- 		ret[1] = ECampSummonResultType_Hero
-- 		rate = math.random(10000)
-- 		if rate < 7143 then --20%几率4星英雄
-- 			ret[2] = 4
-- 		else --8%几率5星英雄
-- 			ret[2] = 5
-- 		end
-- 	else
-- 		if rate < 7500 then -- 54%随机碎片
-- 			ret[1] = ECampSummonResultType_RandomFragment
-- 		else 	--18%阵营碎片
-- 			ret[1] =  ECampSummonResultType_CampFragment
-- 		end
-- 		--碎片星级和数量
-- 		rate = math.random(10000)
-- 		if rate < 8000 then --50%几率4星碎片
-- 			ret[2] = 4
-- 			ret[3] = math.random(15, 30) --4星碎片数量
-- 		else
-- 			ret[2] = 5
-- 			ret[3] = math.random(8, 15) --5星碎片数量
-- 		end
-- 	end
-- 	ret[4] = math.random(10, 20) --奇迹碎片数量
-- 	return ret
-- end

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
--碎片合成星级所需数量
KFragmentNumRequired = {}
KFragmentNumRequired[1] = 5
KFragmentNumRequired[2] = 10
KFragmentNumRequired[3] = 20
KFragmentNumRequired[4] = 30
KFragmentNumRequired[5] = 50

--品阶等级上限
KHeroMaxLevelForTier = {10, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260}
--英雄品质升级所需材料数量
KHeroQualityUpMaterial = {5, 50, 500, 5000, 50000, 500000}
--英雄品质升级所需金币数量
KHeroQualityUpMoney = {2000, 10000, 50000, 200000, 1000000, 5000000}
--英雄分解获得材料数量
KHeroDecomposeMaterial = {1, 10, 100, 1000,  10000,  100000}
--英雄进阶需要进阶石数量
KHeroTierUpAdvanceExp = {20, 60, 300, 800, 1200, 2400, 3600, 4800, 6000, 10000, 15000, 20000, 30000} 
--英雄升星需要进阶石数量
KHeroStarUpAdvanceExp = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}
--英雄分解返还进阶石数量
KHeroDecomposeAdvanceExp = {0, 35, 105, 245, 525, 1225, 2975, 6475, 12075, 20475}
--英雄分解获得灵魂石数量
KHeroDecomposeSoulStone = {10, 20, 30, 90, 270, 540, 1620, 2160, 0}
--英雄分解获得进阶石数据
KHeroDecomposeAdvanceExpByStar = {2, 5, 10, 30, 90, 180, 540, 720, 0, 0}
--英雄进阶需要金币数量
KHeroTierUpMoney = {1000, 10000, 30000, 60000, 100000, 300000, 500000, 800000, 1000000, 2000000, 3000000, 4000000, 5000000}
--英雄品级属性提升
KHeroPropertyUpByTier = {0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140}
--英雄重置消耗钻石数量
KHeroResetVrmbConsume = {0, 0, 0, 0, 20, 20, 20, 20, 20, 20, 20, 20, 20}
--装备合成所需材料数量
KEquipComposeMaterialNum = 3
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 主角技能槽数量
KRoleSkillSlotNum = 3
--技能最大等级
KRoleSkillMaxLevel = 5
--技能升级需求技能书数量
function get_role_skill_book_req_num( quality, level )
	return math.pow(2, quality)
end
--技能升级需求金币数量
function get_role_skill_money_req_num( quality, level )
	return math.pow(2, quality) * 2000
end

--技能突破需求材料数量
KRoleSkillQualityUpReqMaterial = {0, 1, 10, 100, 250, 500, 500, 500, 500, 500}
--技能突破需求金币数量
KRoleSkillQualityUpReqMoney = {0, 10000, 50000, 100000, 500000, 1000000, 1000000, 1000000, 1000000, 1000000}
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 阵营属性增加
KCampBuff = {}
KCampBuff[1] = {1, 500} --水属性血量增加5%
KCampBuff[2] = {2, 500} --火属性攻击增加5%
KCampBuff[3] = {7, 500} --木属性命中增加5%
KCampBuff[4] = {5, 500} --光属性暴击增加5%
KCampBuff[5] = {9, 500} --暗属性破甲增加5%
function get_camp_buff( camp )
	if camp >= 1 and camp <= 5 then
		return KCampBuff[camp]
	end
	return 0, 0
end
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 随从天赋解锁品阶需求
KHeroTalentUnlockTier = {2, 4, 5}
KMaxHeroTalentNum = 3
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
KMaxBattleHeroNum = 5; --上阵最大随从数量

KStarAddition = {1, 1.1, 1.2, 1.4, 1.6, 2.0, 2.2, 2.4, 2.6};--星级加成 

KSkillPowerbar = 100; --随从能量条满足多少可以放被动技能
KAttackPowerUp = 10; --随从普通攻击一下加多少能量
KBeHitPowerUp = 5; --随从被打一下加多少能量
KKillPowerUp = 20; --击杀对方获得能量

KLeaderPowerUpSpeed = 10; --主角能量自然增长速度单位是每秒这么多
KLeaderPowerUpAttack = 10; --主角普通攻击一下加多少能量
KLeaderPowerUpBeHit = 10; --主角掉血了加多少能量

KBaseHit = 90 -- 基础命中率80%
KBaseCrit = 10 --基础暴击几率10%
KBaseCritDmage = 150 --基础暴击伤害150%
KBaseDodge = 0 -- 基础闪避0
KBaseBreak = 0 -- 基础破甲0
KCampDamageBonus = 130 -- 阵营克制时的增伤倍数

KGuardingRadius = 10 --每个英雄的警觉半径，进入此范围会产生仇恨

KRoleFightingParam = 3000

KRoleInitSkill = {3, 5, 2}

--KNormalMonsterScale = 1; --普通怪放大倍数
--KEliteMonsterScale = 1.5; --精英怪放大倍数
--KBossMonsterScale = 2; --Boss怪放大倍数

--KNormalMonsterAttackRangeOffset = 0; --主角和随从攻击普通怪时的攻击距离补正
--KEliteMonsterAttackRangeOffset = 0.8; --主角和随从攻击精英怪时的攻击距离补正
--KBossMonsterAttackRangeOffset = 1; --主角和随从攻击BOSS怪时的攻击距离补正

function get_hero_atk(base_atk, hero_star, hero_level)
	local base_atk_for_star = base_atk * (KStarAddition[hero_star]) / 100
	local upgrade_atk_for_star = base_atk_for_star * 0.1
	return base_atk_for_star + upgrade_atk_for_star * hero_level
end

function get_hero_def(base_def, hero_star, hero_level)
	local base_def_for_star = base_def * (KStarAddition[hero_star]) / 100
	local upgrade_def_for_star = base_def_for_star * 0.1
	return base_def_for_star + upgrade_def_for_star * hero_level
end
--降低基础血量，确保前期舒畅，血量成长不变
function get_hero_max_hp(base_hp, hero_star, hero_level)
	local base_hp_for_star = base_hp * (KStarAddition[hero_star]) / 100
	local upgrade_hp_for_star = base_hp * (KStarAddition[hero_star]) / 100 * 0.1
	return base_hp_for_star + upgrade_hp_for_star * hero_level
end

--防御免伤换算系数
KDamageReduceParams = {}
KDamageReduceParams[1000] = 0.0001
KDamageReduceParams[4000] = 0.00005
KDamageReduceParams[10000] = 0.00002
KDamageReduceParams[20000] = 0.000008
KDamageReduceParams[40000] = 0.0000025
KDamageReduceParams[100000] = 0.000001
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
--宝石解锁星级
KCrystalUnlockStar = 6

PropertyType_HP = 1;
PropertyType_ATK = 2;
PropertyType_DEF = 3;
PropertyType_Speed = 4;
PropertyType_Crit = 5;
PropertyType_CritDamage = 6;
PropertyType_Hit = 7;
PropertyType_Dodge = 8;
PropertyType_DEFBreak = 9;	

PropertyCost = {}
PropertyCost[PropertyType_HP] = 0.00004
PropertyCost[PropertyType_ATK] = 0.00004
PropertyCost[PropertyType_DEF] = 0.0001
PropertyCost[PropertyType_Speed] = 0.000032
PropertyCost[PropertyType_Crit] = 0.00004
PropertyCost[PropertyType_CritDamage] = 0.0002
PropertyCost[PropertyType_Hit] = 0.00004
PropertyCost[PropertyType_Dodge] = 0.000036
PropertyCost[PropertyType_DEFBreak] = 0.00004


function get_crystal_property( pro_type, cost, proNum )
	return cost * PropertyCost[pro_type] / proNum
end
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
--角色升级奖励钻石
KPlayerLevelUpAwardVrmb = 10
--离线奖励最长时间(秒)
KMaxOfflineAwardTime = 8 * 60 * 60
--预估每拨小怪时间
KSecondPerBattle = 15
--活动副本每日限次
KEventCopyLimitTimes = 2
--挑战塔每日失利限次
KChallengeCopyLimitTimes = 10
--限时任务刷新几率
KLimitTaskRefreshRate = 3.0
--随机奖励刷新几率
KRandomAwardRefreshRate = 3.0

EObject_NULL = 0
EObject_Money = 1
EObject_Exp = 2
EObject_UpgradePoint = 3
EObject_VRmb = 4
EObject_Hero = 5
EObject_Fragment = 6
EObject_Equip = 7
EObject_SkillBook = 8
EObject_MagicDust = 9
EObject_ClassesMaterial = 10
EObject_CampMaterial = 11
EObject_AdvanceExp = 12
EObject_BaseSummonScroll = 13
EObject_HeroicSummonScroll = 14
EObject_BaseMissionScroll = 15
EObject_HeroicMissionScroll = 16
EObject_SoulStone = 17
EObject_MiracleGem = 18
EObject_MiracleShard = 19
EObject_FriendGift = 20
EObject_PVPTicket = 21
EObject_SkillMaterial = 22

--每日任务奖励数量
function get_daily_quest_award_num( player_level, obj_type )
	local num = 0
	if obj_type == EObject_Money then
		num = 1000 * player_level
	--随从经验石
	elseif obj_type == EObject_UpgradePoint then
		num = 500 * player_level
	end
	return num
end

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 商店商品数量
KShopGoodsNum = 8
-- 自动刷新CD
KShopRefreshFreeCD = 24 * 60 * 60
-- 刷新消耗钻石
KShopRefreshConsumeVrmb = {100, 100, 200, 200, 400, 400, 600, 600, 800, 800, 1000}

-- 获得商店刷新物品
EShopPriceType_Money = 1
EShopPriceType_Vrmb = 2
--升级点EObject_UpgradePoint, 碎片EObject_Fragment, 装备EObject_Equip, 技能EObject_Skill, 魔法尘EObject_MagicDust, 
--职业徽章EObject_ClassesMaterial, 阵营精华EObject_CampMaterial, 升阶材料EObject_AdvanceExp, 普通卷轴EObject_BaseSummonScroll, 高级卷轴EObject_HeroicSummonScroll
KObjType = {3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18,21}
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 英雄任务数量
KHeroMissionRefreshNum = 4
KHeroMissionMaxNum = 8
KHeroMissionRefreshVrmb = 10
-- 英雄任务刷新概率
KHeroMissionRate = {2560, 2700, 2320, 1500, 800, 100, 20}
-- 英雄任务刷新最低等级
KHeroMissionReqLevel = {1, 1, 20, 25, 30, 50, 80}
-- 任务时间
KHeroMissionTime = {3600, 3600 * 2, 3600 * 4, 3600 * 6, 3600 * 12, 3600 * 24, 3600 * 48}
-- 立即完成任务消耗钻石
KHeroMissionCompleteVrmb = {2, 5, 10, 20, 40, 60, 80}
-- 任务卷轴随机任务星级
KBasicScrollMissionStar = {1, 4}
KHeroicScrollMissionStar = {4, 7}

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 金币兑换
KAlchemyConsumeVrmb = {0, 20, 50}
function get_alchemy_money( alchemyType, player_level )
	if player_level > 20 then
		return 1000 * player_level * alchemyType
	else
		return 20000 * alchemyType
	end
end
KAlchemyRefreshCD = 3600 * 8
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 灵魂石商店
KSoulShopHeroNumByStar = {0, 0, 4, 0, 4, 0, 0, 0, 0}
KSoulShopRefreshFreeCD = 3600 * 24 * 7
KSoulShopRefreshConsume = 1000
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 修改玩家名称
KChangePlayerNameConsumeVrmb = 200
--非出战随从数量上限
KHeroBagMaxNum = 100
KBuyHeroBagNumEach = 5
KBuyHeroBagMaxTimes = 170
KHeroBagLimited = 1000
function get_buy_hero_bag_vrmb( times )
	return 50 + 5 * times
end

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 职业置换最低星级
KClassesExchangeStarMin = 3
--职业置换所需奇迹碎片
KClassesExchangeMiracleShard = {0, 0, 5, 20, 100, 500, 2000, 5000, 10000}

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
--好友数量上限
KMaxFriendNum = 30
--好友每日赠送爱心上限
KMaxFriendGiftSend = 30
--好友每日收到爱心上限
KMaxFriendGiftReceive = 30
--好友合作CD
KFriendCoopCD = 3600 * 8
--好友合作Loot
function get_friend_coop_loot( player_level )
	local obj_type = 3
	local param1 = 0
	local param2 = 0
	local param3 = 0
	local num = 1000
	
	return {obj_type, param1, param2, param3, num}
end

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- VIP点金增益
KVipAlchemyAddition = {0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 130, 150}
-- VIP离线增益
KVipOfflineMoneyAddition = {0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 130, 150}
KVipOfflineExpAddition = {0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 80, 100}
KVipOfflineUpAddition = {0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 80, 100}
-- VIP活动副本额外次数
KVipEventCopyExtraTimes = {0, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8}
KVipBuyEventCopyExtraTimesVrmb = 50
-- VIP英雄任务上限增加
KVipHeroMissionAddition = {0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 8}
-- 随从天赋每日免费刷新次数
KVipHeroTalentRefreshExtraTimes = {0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 5, 6}
-- 随从背包上限增加
KVipHeroBagAddition = {0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 160, 200}
-- VIP等级忽略免广告
KVipIgnoreAdLevel = 3
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 登录奖励列表数量
KLoginAwardListNum = 2
--登录奖励每个列表中的奖励数量
KLoginAwardNumEveryList = 30

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
--每日PVP免费次数
KPVPBattleFreeTimes = 2
KLadderBattleFreeTimes = 5
--PVP门票价格
KPVPTicketVrmb = 30
--PVP战斗奖励
function random_pvp_battle_award( player_level )
	rate = math.random(10000)
	if rate < 2000 then --百分之20几率，5到20钻石
		return {4, 0, 0, 0, math.random(5, 20)}
	elseif rate < 4000 then --百分之20几率，升级点
		return {3, 0, 0, 0, math.random(player_level * 50, player_level * 100)}
	elseif rate < 5000 then --百分之10几率，进阶石
		local num = 5
		if player_level > 25 then
			num = math.random(math.floor(player_level / 5), math.floor(player_level / 4))		
		end
		return {12, 0, 0, 0, num}
	elseif rate < 6000 then --百分之10几率，英雄碎片
		if player_level < 30 then
			return {6, 1, 0, 3, 1}
		elseif player_level < 80 then
			return {6, 1, 0, 4, 1}
		else
			return {6, 1, 0, 5, 1}
		end
	elseif rate < 7000 and player_level > 10 then --百分之10几率，魔法尘
		return {9, 0, 0, 0, 5}
	else --剩余几率，金币
		return {1, 0, 0, 0, math.random(player_level * 1000, player_level * 2000)}
	end
end
--PVP积分结算
function  pvp_score_clearing( winner_fight,  loser_fight)
	return {10, -10}
end
--PVP排行显示数量
KPVPRankShowNum = 50
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
--系统开放等级
EGameFunction_DailyQuest = 1
EGameFunction_LimitTask = 2
EGameFunction_RandomAward = 3
EGameFunction_LoginAward = 4
EGameFunction_HeroSummon = 5
EGameFunction_HeroDecompose = 6
EGameFunction_EquipCompose = 7
EGameFunction_HeroMisssion = 8
EGameFunction_EventCopy = 9
EGameFunction_Challenge = 10
EGameFunction_Arena = 11
EGameFunction_HeroAdvance = 12
EGameFunction_CampSummon = 13
EGameFunction_Shop = 14
EGameFunction_Friend = 15
EGameFunction_Mail = 16
EGameFunction_IAP = 17
EGameFunction_Alchemy = 18
EGameFunction_Wheel = 19
EGameFunction_Activity = 20
EGameFunction_City = 21
EGameFunction_RookieAward = 22
EGameFunction_Ranking = 23
EGameFunction_Trail = 24
EGameFunction_Guild = 25
EGameFunction_FastBattle = 26
EGameFunction_Pet = 27
EGameFunction_HuntingBoss = 28
EGameFunction_BattleControl = 29
EGameFunction_RookieQuest = 30
EGameFunction_CampSkill = 31
EGameFunction_Chat = 32
EGameFunction_WonderSummon = 33
EGameFunction_MythicalCopy = 34
EGameFunction_RoleArmorUpgrade = 35
EGameFunction_Ladder = 36
EGameFunction_HeroCollege = 37
EGameFunction_IdleBuff = 38
EGameFunction_Technology = 39
EGameFunction_GuildMonster = 40
EGameFunction_HeroBook = 41
EGameFunction_CampCopy = 42
EGameFunction_AdvanceArena = 43

KGameFunctionCopy = {}
KGameFunctionCopy[EGameFunction_BattleControl] = 101	--战斗控制
KGameFunctionCopy[EGameFunction_RookieAward] = 102		--新手奖励
KGameFunctionCopy[EGameFunction_Mail] = 104				--邮箱
KGameFunctionCopy[EGameFunction_DailyQuest] = 104		--每日任务
KGameFunctionCopy[EGameFunction_LoginAward] = 104		--签到
KGameFunctionCopy[EGameFunction_City] = 108				--主城
KGameFunctionCopy[EGameFunction_HeroSummon] = 108		--酒馆
KGameFunctionCopy[EGameFunction_IAP] = 108				--充值商城
KGameFunctionCopy[EGameFunction_RookieQuest] = 108		--新手任务
KGameFunctionCopy[EGameFunction_CampSkill] = 108		--阵营技能
KGameFunctionCopy[EGameFunction_Friend] = 204			--好友
KGameFunctionCopy[EGameFunction_HeroBook] = 205         --图鉴
KGameFunctionCopy[EGameFunction_Alchemy] = 208			--炼金
KGameFunctionCopy[EGameFunction_HeroDecompose] = 210	--融魂祭坛
KGameFunctionCopy[EGameFunction_HeroAdvance] = 212		--升星
KGameFunctionCopy[EGameFunction_RandomAward] = 212		--随机广告
KGameFunctionCopy[EGameFunction_Activity] = 212  		--循环活动
KGameFunctionCopy[EGameFunction_Chat] = 212				--聊天
KGameFunctionCopy[EGameFunction_FastBattle] = 302		--快速战斗
KGameFunctionCopy[EGameFunction_Guild] = 305			--公会
KGameFunctionCopy[EGameFunction_CampSummon] = 305		--英雄巨像
KGameFunctionCopy[EGameFunction_Shop] = 310				--市场
KGameFunctionCopy[EGameFunction_Challenge] = 310		--地牢
KGameFunctionCopy[EGameFunction_EquipCompose] = 315		--铁匠铺
KGameFunctionCopy[EGameFunction_Wheel] = 315			--幸运转盘
KGameFunctionCopy[EGameFunction_Arena] = 405			--竞技场
KGameFunctionCopy[EGameFunction_EventCopy] = 410		--活动副本
KGameFunctionCopy[EGameFunction_HeroMisssion] = 415		--寻宝探险
KGameFunctionCopy[EGameFunction_Ranking] = 420			--排行榜
KGameFunctionCopy[EGameFunction_Technology] = 420       --公会科技
KGameFunctionCopy[EGameFunction_Trail] = 505			--英雄试炼
KGameFunctionCopy[EGameFunction_Ladder] = 515	        --天梯竞技
KGameFunctionCopy[EGameFunction_GuildMonster] = 520     --公会BOSS
KGameFunctionCopy[EGameFunction_HeroCollege] = 525      --英雄学院
KGameFunctionCopy[EGameFunction_RoleArmorUpgrade] = 610	--盔甲锻造
KGameFunctionCopy[EGameFunction_MythicalCopy] = 620		--秘境副本
KGameFunctionCopy[EGameFunction_HuntingBoss] = 715		--狩猎boss
KGameFunctionCopy[EGameFunction_Pet] = 735				--宠物系统
KGameFunctionCopy[EGameFunction_AdvanceArena] = 840     --高级竞技场
KGameFunctionCopy[EGameFunction_CampCopy] = 945         --阵营副本
KGameFunctionCopy[EGameFunction_WonderSummon] = 1050	--奇迹召唤
KGameFunctionCopy[EGameFunction_IdleBuff] = 50000       --挂机BUFF
KGameFunctionCopy[EGameFunction_LimitTask] = 50000		--限时任务
--可预览功能
KGameFunctionShow = {EGameFunction_HeroSummon, EGameFunction_HeroBook, EGameFunction_Guild, EGameFunction_Challenge, EGameFunction_EquipCompose,
					EGameFunction_Arena, EGameFunction_EventCopy, EGameFunction_HeroMisssion, EGameFunction_Ranking, EGameFunction_Trail, EGameFunction_Ladder, EGameFunction_HeroCollege,
					EGameFunction_RoleArmorUpgrade, EGameFunction_MythicalCopy, EGameFunction_HuntingBoss, EGameFunction_Pet, EGameFunction_CampCopy, EGameFunction_AdvanceArena}
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
--每日广告领取钻石次数
KAdAwardTimes = 5
KAdAwardVrmb = 20
--新手签到持续时间
KRookieCheckInTime = 15 * 24 * 60 * 60
--新手礼包持续时间
KRookiePackTime = 7 * 24 * 60 * 60
--新手礼包需要的累计充值金额 [人民币,VIP等级]，海外版本按VIP等级走
KStarterPackRmb = {6,0}
KStarterPackRmb1 = {30,1}
KStarterPackRmb2 = {100,3}

--新手任务持续时间
KRookieQuestTime = 7 * 24 * 60 * 60
--新手任务奖励
KRookieQuestReqNum = 30
KRookieQuestAwardVip = 300
KRookieQuestAwardObj = {18, 0, 0, 0, 2} --2个宝珠


-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 轮盘抽奖几率
KNormalWheelRate = {}
KNormalWheelRate[1] = 4000 --金币
KNormalWheelRate[2] = 2000 --升级点
KNormalWheelRate[3] = 1000 --魔法石
KNormalWheelRate[4] = 1500 --进阶点
KNormalWheelRate[5] = 800 --低级装备
KNormalWheelRate[6] = 200  --高级装备
KNormalWheelRate[7] = 450  --4星碎片
KNormalWheelRate[8] = 50    --5星碎片

KAdvancedWheelRate = {}
KAdvancedWheelRate[1] = 4000 --金币
KAdvancedWheelRate[2] = 2000 --高抽
KAdvancedWheelRate[3] = 1000 --奇迹宝石
KAdvancedWheelRate[4] = 1000 --4星阵营碎片
KAdvancedWheelRate[5] = 1000 --4星职业碎片
KAdvancedWheelRate[6] = 400  --奇迹碎片
KAdvancedWheelRate[7] = 400  --高级寻宝券
KAdvancedWheelRate[8] = 200  --5星碎片

--转盘10次消耗筹码
KWheelTenTimesConsumeChip = 10
KWheelTenTimesConsumeChipVip = 8
--转盘10次需求等级
KWheelTenTimesReqLevel = 80
--转盘10次折扣需求VIP
KWheelTenTimesReqVip = 2
--高级转盘需求等级
KAdvancedWheelReqLevel = 60
--高级转盘需求VIP
KAdvancedWheelReqVip = 1
--转盘刷新消耗钻石
KWheelRefreshConsumeVrmb = 50
--转盘免费刷新CD
KWheelRefreshFreeCD = 8 * 60 * 60
--转盘强制刷新间隔
KWheelForceRefreshDuration = 24 * 60 * 60
--购买筹码消耗钻石
KNormalChipVrmb = 50
--转盘一次给幸运币数量
KLuckyCoinNumOnce = 10

--幸运商店商品数量
KLuckyShopGoodsNum = 8
--幸运商店刷新消耗幸运币
KLuckyShopRefreshConsume = 100
--幸运商店刷新CD
KLuckyShopFreeRefreshCD = 24 * 60 * 60

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 自动技能施放需求等级
KAutoSkillReqLevel = 40
-- 自动技能施放需求VIP等级
KAutoSkillReqVip = 10
-- 技能品质战力参数
KSkillFightingParam = {0, 2, 6, 9, 13, 16}

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 新手阶段抽卡范围
KFirst3StarHero = {3033402, 3032400}
KSecond4StarHero = {3043600}
KFirst4StarHero = {5051401,5052500,5053500}
KFirst5StarHero = {5051200,5051202,5051301,5052202,5052301,5052401,5053201,5053502,5053601}

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 随机奖励时限
KRandomAwardTimeLimit = 60 * 10
-- 限时任务BOSS战力标准
KLimitTaskBossFighting = {0.8, 0.9, 1.1}
-- 挂机宝箱红点显示时间间隔
KIdleRewardRPTime = 60 * 15
-- 商城免费钻石CD
KFreeVrmbCD = 4 * 60 * 60
-- 商城免费钻石数量 
KFreeVrmbNum = 20

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 聊天屏蔽列表最大数量
KChatBlockMaxNum = 30
-- 合成英雄资源最高等级
KSoldierMaxLevel = 10
-- 合成英雄格子数量
KSoldierGridNum = 12
-- 合成英雄积累数量
KSoldierMaxNum = 10
-- 每几秒可生成一个1级资源
KSoldierDuration = 5
-- 飞龙DPS占比
KSoldierDpsPct = {0.2, 0.15, 0.1}

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 主角普通攻击主要目标伤害系数(需要除100)
KMainVictimOffset = 100
-- 主角普通攻击溅射目标伤害系数
KOtherVictimOffset = 0
-- 主角普通攻击溅射目标范围
KOtherVictimRadius = 0

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Boss刷新最短距离
KBossShortestDistance = 40

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 点点点技能内置CD 
KSkillTapTapCD = 0.3
-- 点点点技能对小怪的伤害百分比
KSkillTapTapDamageIdle = 0.1
-- 点点点技能对BOSS伤害占主角攻击的百分比
KSkillTapTapDamageBoss = 0.3
-- 点点点技能最大能量
KSkillTapTapMaxPower = 200
KSkillTapTapPowerOnce = 10
KSkillTapTapPowerRecover = 40
KSkillTapTapPowerRecoverAuto = 10
-- 点点点技能距离
KSkillTapTapDistance = 20
-- 点点点技能多长时间不点才开始恢复能量
KSkillTapTapPowerRecoverCD = 0
-- 点点点技能ID
KSkillTapTapID = 101
-- 点点点技能音效
KSkillTapTapSound = "火球飞行"
-- 点点点技能特效
KSkillTapTapParticle = "上帝技能粒子/火球"
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 随从的多少属性转化到主角身上
KHeroPropertyToRole = 0.12
-- 排行榜刷新时间（单位秒）
KUpdateRankDuration = 300
-- 离线时副本进度自动推进间隔（单位秒）
KCopyProgressAutoDuration = 30

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 试炼商店刷新间隔
KTrailShopRefreshCD = 72 * 60 * 60
KTrailShopRefreshConsumeVrmb = 1000
-- 公会商店刷新间隔
KGuildShopRefreshCD = 168 * 60 * 60
KGuildShopRefreshConsumeVrmb = 1000
-- 试炼重置间隔
KTrailResetCD = 48 * 60 * 60
-- 试炼道具恢复生命值百分比
KTrailItemHPRecoverPct = 50
-- 试炼道具消耗
KTrailItemConsumeHP = 5
KTrailItemConsumeReborn = 5
-- 公会BOSS多少拨出一次宝箱
KGuildBossCheckKillNumReq = 10
-- 公会BOSS战限时
KGuildBossTimeLimit = 150
-- 公会boss挑战次数 vip等级(作为下标)对应挑战次数
KGuildBossVipTimes = {2,2,2,2,3,3,3,4,4,4,4,5,5,5}

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 获取n小时的离线奖励
KFastBattleTime = 1 * 60 * 60
-- VIP每日使用次数和消耗钻石
KFastBattleVipTimes = {2,3,4,4,5,5,6,6,7,8,9,10,11,12}
KFastBattleVrmb = {0,50,100,100,150,150,200,300,300,300,300,300,300}
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 新月卡对应静态表productID
KSuperMonthProductID = "com.ltgames.android.idk.supermonth"
-- 新月卡每日奖励(按顺序无限往下加) obj.ObjType obj.Param1 obj.Param2 obj.Param3 obj.Num
KSuperMonthAwards = {23,0,0,0,2,6,1,0,5,2}

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 宠物最高等级
KPetMaxLevel = {30,60,90,120}
-- 宠物技能最大等级
KPetSkillMaxLevel = 30
-- 宠物每秒增加能量
KPetSkillPowerTime =10

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- 狩猎HuntingBoss vip等级(作为下标)对应挑战次数
KHuntingBossVipTimes = {2,2,2,3,3,4,4,4,5,5,5,6,7,8}
-- HuntingBoss每次奖励的掉落概率/100
KHuntingBossBattleP = {40,30,20,10}
-- obj.ObjType obj.Param1 obj.Param2 obj.Param3 obj.Num 5项一组对应KHuntingBossBattleP的概率
KHuntingBossBattleV = {1,0,0,0,10000,7,0,0,0,1,9,0,0,0,30,4,0,0,0,5}
-- HuntingBoss BossID
KHuntingBossID = {2,3,4}
--巨龙BOSS显示装备掉落
KHuntingBossEquipNormal = {29, 17, 18, 19, 20}
KHuntingBossEquipHard = {37, 25, 26, 27, 28}
KHuntingBossEquipTorment = {45, 37, 38, 39, 40}
KHuntingBossEquipNightmare = {53, 37, 38, 39, 40}
--巨龙BOSS战斗时长
KHuntingBossTimeLimit = 60
--从创建角色到开始功勋的时间
KLoopQuestsMoneyStart = 0
--功勋周期
KLoopQuestsMoneyCD = 3600 * 24 * 42
--功勋BattlePass对应ProductId
KLoopQuestsProductId = "com.ltgames.android.idk.questbp"
--从创建角色到开始功勋的时间
KLoopQuests2MoneyStart = 3600 * 24 * 2
--功勋周期
KLoopQuests2MoneyCD = 3600 * 24 * 40
--功勋BattlePass对应ProductId
KLoopQuests2ProductId = "com.ltgames.android.idk.questtp"
--新手特惠礼包存在的时长，从创建角色开始多少秒
KNewPlayerPayTime = 3600 * 24 * 7
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
--通用BOSS战限时
KNormalBossTimeLimit = 60 

--试炼关卡掉落金币和经验
function get_trail_stage_award( player_level, stage, obj_type )
	local num = 0
	if obj_type == EObject_Money then
		num = player_level * 40 * (1 + (stage -1) * 0.02)
	elseif obj_type == EObject_UpgradePoint then
		num = player_level * 30 * (1 + (stage -1) * 0.02)
	end
	return num
end

--战斗加速解锁关卡
KBattleSpeedUpUnlockCopy = 108
--战斗加速解锁VIP
KBattleSpeedUpUnlockVipLevel = 3
--战斗3倍速解锁关卡
KBattleSpeedUpX3UnlockCopy = 525

--抽卡阶段奖励的金币、经验和进阶石数量
function get_summon_score_award( player_level, obj_type) 
	local num = 0
	if obj_type == EObject_Money then
		num = player_level * 10000
	elseif obj_type == EObject_UpgradePoint then
		num = player_level * 5000
	elseif obj_type == EObject_AdvanceExp then
		num = player_level * 10
	end
	return num
end

--竞技场活动积分
KArenaActivityScore = {3,1,2}

--英雄图鉴奖励钻石数量 
function get_hero_book_award( hero_static_id )
	local i = math.floor(hero_static_id / 1000000)
	local num = 0
	if i > 3 then
		num = 100
	elseif i == 3 then
		num = 50
	end
	return num
end
--奇迹召唤保底次数(光暗70，其它50)
KWonderSummonL = 50
KWonderSummonH = 70
KWonderSummonCostOne = 500
KWonderSummonCostTen = 5000
--主角升星需求
KRoleHeroMaxStar = 11
KRoleHeroStarUpReqHeroStar = {5,5,5,5,6,7,8,9,10,11,12}
KRoleHeroStarUpReqHeroLevel = {20,40,60,80,100,120,140,160,180,200,220}
KRoleHeroStarUpReqRoleLevel = {20,40,60,80,100,115,135,150,170,190,210}
KRoleHeroStarUpReqCopy = {315,525,735,945,10150,10350,10550,10750,10950,20150,20350}
KRoleHeroStarUpReqChallenge = {0,30,50,80,100,150,180,200,250,300,350}
KRoleHeroStarUpReqMoney = {100000,300000,500000,800000,1500000,2000000,2500000,3000000,5000000,7500000,10000000}
--主角盔甲解锁关卡
KRoleHeroArmorUnlockCopy = {0, 312, 630, 840, 1050}
--秘境副本 MythicalCopy大关解锁等级
KMythicalCopyUnlockLevel = {525, 630, 735, 840, 945, 1050, 10150, 10250, 10350, 10450, 10550, 10650, 10750, 10850, 10950, 11050}
--天梯竞技守卫匹配
function get_ladder_guard( rank )
	local copy = 945
	if rank >= 4 and rank <= 6 then
		copy = math.random(936, 940)
	elseif rank >= 7 and rank <= 10 then
		copy = math.random(931, 935)
	elseif rank >= 11 and rank <= 20 then
		copy = math.random(926, 930)
	elseif rank >= 21 and rank <= 30 then
		copy = math.random(921, 925)
	elseif rank >= 31 and rank <= 40 then
		copy = math.random(916, 920)
	elseif rank >= 41 and rank <= 50 then
		copy = math.random(911, 915)
	elseif rank >= 51 and rank <= 70 then
		copy = math.random(906, 910)
	elseif rank >= 71 and rank <= 90 then
		copy = math.random(901, 905)
	elseif rank >= 91 and rank <= 110 then
		copy = math.random(836, 840)
	elseif rank >= 111 and rank <= 140 then
		copy = math.random(831, 835)
	elseif rank >= 141 and rank <= 170 then
		copy = math.random(826, 830)
	elseif rank >= 171 and rank <= 200 then
		copy = math.random(821, 825)
	elseif rank >= 201 and rank <= 250 then
		copy = math.random(816, 820)
	elseif rank >= 251 and rank <= 300 then
		copy = math.random(811, 815)
	elseif rank >= 301 and rank <= 350 then
		copy = math.random(806, 810)
	elseif rank >= 351 and rank <= 400 then
		copy = math.random(801, 805)
	elseif rank >= 401 and rank <= 500 then
		copy = math.random(731, 735)
	elseif rank >= 501 and rank <= 600 then
		copy = math.random(721, 730)
	elseif rank >= 601 and rank <= 700 then
		copy = math.random(711, 720)
	elseif rank >= 701 and rank <= 800 then
		copy = math.random(701, 710)
	elseif rank >= 801 and rank <= 1000 then
		copy = math.random(621, 630)
	elseif rank >= 1001 and rank <= 1500 then
		copy = math.random(611, 620)
	elseif rank >= 1501 and rank <= 2000 then
		copy = math.random(601, 610)
	elseif rank >= 2001 and rank <= 2500 then
		copy = math.random(511, 525)
	elseif rank >= 2501 and rank <= 3000 then
		copy = math.random(501, 510)
	elseif rank >= 3001 and rank <= 4000 then
		copy = math.random(411, 420)
	elseif rank >= 4001 then
		copy = math.random(401, 410)
	end
	return copy
end
--英雄学院
--格子最大数量
KCollegeBlockMaxNum = 100
--格子冷却CD
KCollegeBlockCD = 0
--格子解锁需求符文水晶
function get_college_money_consume( index )
	return (index - 1) * 100
end
--连续签到重置时间=30天
KAccumulatedCheckInDuration = 30
--新手10连解锁关卡
KStarterSummonTenUnlockCopy = 302
--新手10连活动持续时间
KStarterSummonTenDuration = 7 * 3600 * 24
--心愿抽卡VIP解锁等级
KWonderSummonUnlockVipLevel = 5
--5星英雄分解需求通关
K5StarHeroDecomposeReqCopy = 1030
--5星英雄分解需求VIP
K5StarHeroDecomposeReqVipLevel = 5
--挂机BUFF最大使用次数
KIdleBuffMaxTimes = 5
--挂机BUFF最大层数
KIdleBuffMaxStack = 12
--挂机BUFF每层增加属性
EHeroPropertyType_NULL = 0
EHeroPropertyType_HP = 1
EHeroPropertyType_ATK = 2
EHeroPropertyType_DEF = 3
EHeroPropertyType_Speed = 4
EHeroPropertyType_Crit = 5
EHeroPropertyType_CritDamage = 6
EHeroPropertyType_Hit = 7
EHeroPropertyType_Dodge = 8
EHeroPropertyType_DEFBreak = 9
EHeroPropertyType_DamageReduce = 10
EHeroPropertyType_SkillEffect = 11
EHeroPropertyType_CampDamage = 12
EHeroPropertyType_HealEffect = 13

KIdleBuffProperty = {}
KIdleBuffProperty[EHeroPropertyType_HP] = 1
KIdleBuffProperty[EHeroPropertyType_ATK] = 1
--新手天天充值持续天数
KDailyRechargeDuration = 7 * 3600 * 24
--学院钻石解锁消耗
KCollegeUnlockBlockVrmb = 500
--活动排行榜开关
KActivityRankClose = 0
--公会科技重置需求钻石
KTechnologyResetVrmb = 100
--公会科技重置返回金币百分比
KTechnologyResetMoneyReturn = 50
---------------------------------公会副本 GuildMonster-------------------------------
--持续天数
KGuildMonsterDuration = 7 * 3600 * 24
--挑战次数和价格
KGuildMonsterBattlePrice = {0,50,50,50,50}
--捐献获得的次元石
KGuildMonsterContribution = {10000,20000,50000}
--捐献的花费 3个参数都为0
KGuildMonsterContributionType = {1,4,4}
KGuildMonsterContributionNum = {50000,50,100}
--buff次数和价格
KGuildMonsterBuffPrice = {30,30,30,30,30,30,30,30,30,30}
--buff提升的攻击力%
KGuildMonsterBuffAdd = {20,40,60,80,100,120,140,160,180,200}
--每次购买持续时间增加2小时
KGuildMonsterBuffTimeOne = 2 * 3600
--上限24小时
KGuildMonsterBuffTimeMax = 24 * 3600
--单独买时间的秒数和价格
KGuildMonsterBuffTime = {1 * 24 * 3600, 7 * 24 * 3600}
KGuildMonsterBuffTimePrice = {300, 2100}
--boss关数
KGuildMonsterBossNum = 9
--升级的难度系数%
KGuildMonsterDifficultyNum = 2
--公会职位人数限制，职位等级为下标
KGuildPositionNum = {9999,9999,5,2,1}
--阵营副本挑战次数
KCampCopyTimesMax = 20

--终身卡productID
KLifeLongCardProductID = "com.ltgames.android.idk.lifelong"
--终身卡离线奖励时间
KMaxOfflineAwardTimeLifeLongCard = 12 * 60 * 60
--终身卡解锁关卡
KLifeLongCardUnlockCopy = 420
--英雄回退钻石消耗
KHeroReturnBackConsumeVrmb = {0, 0, 0, 0, 0, 0, 0, 500, 1000, 2000, 3000, 4000, 5000, 5000}
--英雄回退数量
function get_hero_return_back_ret(star, camp)
	local selfNum = 0
	local resourceNum = 0
	local resourceID = 0
	if camp >= 4 then
		if star == 13 then
			selfNum = 11
		elseif star == 12 then
			selfNum = 9
		elseif star == 11 then
			selfNum = 7
		elseif star == 10 then
			selfNum = 5
		elseif star == 9 then
			selfNum = 4
		elseif star == 8 then
			selfNum = 3
		elseif star == 7 then
			selfNum = 2
		end
	else
		if star == 13 then
			selfNum = 8
			resourceNum = 20
		elseif star == 12 then
			selfNum = 5
			resourceNum = 20
		elseif star == 11 then
			selfNum = 4
			resourceNum = 20
		elseif star == 10 then
			selfNum = 2
			resourceNum = 20
		elseif star == 9 then
			selfNum = 2
			resourceNum = 12
		elseif star == 8 then
			selfNum = 2
			resourceNum = 4
		elseif star == 7 then
			selfNum = 1
			resourceNum = 4
		end
		if camp == 1 then
			resourceID = 3051202
		elseif camp == 2 then
			resourceID = 3052601
		elseif camp == 3 then
			resourceID = 3053501
		end
	end

	return {selfNum, resourceNum, resourceID}
end

--神器碎片需求
KArtifactFragmentNumReq = {}
KArtifactFragmentNumReq[1] = 5
KArtifactFragmentNumReq[2] = 20
KArtifactFragmentNumReq[3] = 30
KArtifactFragmentNumReq[4] = 40
KArtifactFragmentNumReq[5] = 50
KArtifactFragmentNumReq[6] = 60
KArtifactFragmentNumReq[7] = 80
--神器升级金币需求
KArtifactQualityUpMoneyReq = {}
KArtifactQualityUpMoneyReq[1] = 50000
KArtifactQualityUpMoneyReq[2] = 100000
KArtifactQualityUpMoneyReq[3] = 500000
KArtifactQualityUpMoneyReq[4] = 1000000
KArtifactQualityUpMoneyReq[5] = 5000000
KArtifactQualityUpMoneyReq[6] = 10000000
KArtifactQualityUpMoneyReq[7] = 50000000
--高级竞技场点赞金币奖励
KAdvPraiseAwardMoney = 10000

--礼品码兑换需求等级
KGiftCodeReqLevel = 25