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

       namespace hero_icon_info {
           /** Properties of a Record. */
           interface IRecord {
               camp?: (string|null);
               star?: (number|null);
               level?:(number|null);
               frame?:(string|null);
               img?:(string|null);
           }
           /** Represents a Record. */
           class Record implements IRecord {
               constructor(p?: XStruct.hero_icon_info.IRecord);
               camp : string;
               star : number;
               level : number;
               frame :string;
               img : string;
           }
       }
   }
}
   export {}