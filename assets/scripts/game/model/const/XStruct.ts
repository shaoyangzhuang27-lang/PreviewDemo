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

           }
       }


          //升星塔获取物品信息
          namespace starup_prop_info {
            /** Properties of a Record. */
            interface IRecord {
            //    camp?: (string|null);
            //    star?: (number|null);
            //    level?:(number|null);
            //    frame?:(string|null);
            //    icon?:(string|null);
            //    bg?:(string|null);
                nType ?:(number|null);
                nLevel?: (number | null);
                nPropId ?: (number | null);
                nPropQuality?:(number|null);
                num?:(number|null);
           }
           /** Represents a Record. */
           class Record implements IRecord {
               constructor(p?: XStruct.starup_prop_info.IRecord);
            //    camp : string;
            //    star : number;
            //    level : number;
            //    frame :string;
            //    icon : string;
            //    bg : string;
               nType :number;
               nPropId : number;
               nLevel : number;
               nPropQuality : number;
               num :number;
           }
        }




       //自测数据
       namespace test_info {
           /** Properties of a Record. */
           interface IRecord {
               fragmentType?:(number|null);
               param?: (number|null);
               star :(number|null);
               num : (number|null);
           }
           /** Represents a Record. */
           class Record implements IRecord {
               constructor(p?: XStruct.test_info.IRecord);
               fragmentType :number;
               param : number;
               star : number;
               num : number;
           }
       }
   }
}
   export {}