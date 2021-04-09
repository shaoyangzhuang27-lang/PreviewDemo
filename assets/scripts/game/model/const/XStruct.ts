declare global {
    // DO NOT EDIT! This is a generated file. Edit the JSDoc in src/*.js instead and run 'npm run types'.
   /** Namespace XStruct. */
export namespace XStruct {
    //酒馆推荐阵容信息
       namespace lineup_item_info {
           /** Properties of a Record. */
           interface IRecord {
                title?: (string|null); 
                coreHeroName?: (string|null);
                heorIdList?:(number[]|null);
                analysisDetail?:(string|null);
           }
           /** Represents a Record. */
           class Record implements IRecord {
               constructor(p?: XStruct.lineup_item_info.IRecord);
                title : string; 
                coreHeroName : string;
                heorIdList : number[];
                analysisDetail :string;
           }
       }

       //英雄icon信息
       namespace hero_icon_info {
           /** Properties of a Record. */
           interface IRecord {
               camp?: (string|null);
               star?: (number|null);
               level?:(number|null);
               frame?:(string|null);
               icon?:(string|null);
           }
           /** Represents a Record. */
           class Record implements IRecord {
               constructor(p?: XStruct.hero_icon_info.IRecord);
               camp : string;
               star : number;
               level : number;
               frame :string;
               icon : string;
           }
       }

       //碎片合成弹窗信息
       namespace fragment_synthesis_info {
           /** Properties of a Record. */
           interface IRecord {
               frame?:(string|null);
               camp?: (string|null);
               star?: (number|null);
               quality?:(string|null);
               icon?:(string|null);
               type : (number|null);
               maxNum :(number|null);
               curNum : (number|null);
               heroName : (string|null);
               campName : (string|null);
               classesName : (string|null);
               bg?: (string|null);
               param : (number | null);
               occupation : (string | null);
           }
           /** Represents a Record. */
           class Record implements IRecord {
               constructor(p?: XStruct.fragment_synthesis_info.IRecord);
               frame :string;
               camp : string;
               star : number;
               quality : string;
               icon : string;
               type : number;
               maxNum : number;
               curNum : number;
               heroName : string;
               campName : string;
               classesName:string;
               bg : string;
               param : number;
               occupation : string;

           }
       }


        //获取物品信息
        //   {
        //     /*属性值必填   
        //     *没有用到的属性值默认手动填写 string设置"" number设置 0
        //     */  
        //     nType 物品类型
        //     nLevel 物品等级
        //     nPropId 物品ID
        //     nPropQuality 物品品质
        //     num 物品数量
        //   }
          namespace prop_info {
            /** Properties of a Record. */
            interface IRecord {
                nType ?:(number|null);
                nLevel?: (number | null);
                nPropId ?: (number | null);
                nPropQuality?:(number|null);
                num?:(number|null);
           }
           /** Represents a Record. */
           class Record implements IRecord {
               constructor(p?: XStruct.prop_info.IRecord);
               nType :number;
               nPropId : number;
               nLevel : number;
               nPropQuality : number;
               num :number;
           }
        }

        //通用类型一弹窗信息
        //   {
        //     /*属性值必填   
        //     *没有用到的属性值默认手动填写 string设置"" number设置 0 boolean设置为false
        //     */  
        //     title 标题
        //     content 文本内容
        //     mode 底部按钮样式0,1
        //     isRichLabeMode 文本内容是否是富文本
        //     isChangeBtnSpriteFrame 是否修改按钮SpriteFrame
        //     submitContent   submit按钮文本内容
        //     cancelContent   mode为1 按钮文本内容
        //   }
        namespace common_one_info {
            /** Properties of a Record. */
            interface IRecord {
                title?:(string | null);
                content?:(string | null);
                mode?:(number | null);
                isRichLabMode?:(boolean | null);
                isChangeBtnSpriteFrame?:(boolean | null);
                submitContent?:(string | null);
                cancelContent?:(string | null);
           }
           /** Represents a Record. */
           class Record implements IRecord {
               constructor(p?: XStruct.common_one_info.IRecord);
               title : string;
               content : string;
               mode : number ;
               isRichLabMode : boolean;
               isChangeBtnSpriteFrame : boolean;
               submitContent:string ;
               cancelContent:string ;
           }
        }
   }
export namespace XMsg {
    //次数属性枚举-有可能不全，不全自己手动增加属性枚举值
        enum TimesType
        {
            TRefreshHeroTalentTimes = 1,    //免费随从刷新天赋次数
            TChallengeFailedTimes = 2,      //挑战塔失败次数
            TBoughtBagTimes = 3,            //购买背包容量次数
            TSummonScore = 4,               //召唤积分
            TAdAwardTimes = 5,              //广告奖励领取次数
            THeroComposeTimes = 6,          //合成英雄次数
            TFastBattleTimes = 7,           //今日已经快速战斗的次数
            THuntingBossTimes = 8,          //记录每日挑战的次数,从零开始增加 每日重置
            TWonderTimes = 9,               //奇迹召唤次数
            TAccumulatedCheckInTimes = 10   //累积签到次数
        }
    }       
}
export {}