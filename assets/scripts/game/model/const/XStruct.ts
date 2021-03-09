declare global {
    // DO NOT EDIT! This is a generated file. Edit the JSDoc in src/*.js instead and run 'npm run types'.
   
    // interface lineup_item_info {
    //     title?: (string|null); 
    //     roleArmor?: (number|null);
    //     coreHeroName?: (string|null);
    //     heorIdList?:(number[]|null);
    //     analysisDetail?:(string|null);
    // }

   /** Namespace Config. */
   export namespace XStruct {
   
       /** Properties of an achievement. */
       interface Ilineup_item_info {
   
           /** achievement records */
           records?: (XStruct.lineup_item_info.IRecord[]|null);

       }
   
       /** Represents an achievement. */
       class lineup_item_info implements Ilineup_item_info {
   
           /**
            * Constructs a new achievement.
            * @param [p] Properties to set
            */
           constructor(p?: XStruct.Ilineup_item_info);
           /** achievement records. */
           public records: XStruct.lineup_item_info.IRecord[];
       }
   
       namespace lineup_item_info {
           /** Properties of a Record. */
           interface IRecord {
                title?: (string|null); 
                roleArmor?: (number|null);
                coreHeroName?: (string|null);
                heorIdList?:(number[]|null);
                analysisDetail?:(string|null);
           }
   
           /** Represents a Record. */
           class Record implements IRecord {
               constructor(p?: XStruct.lineup_item_info.IRecord);
                title : string; 
                roleArmor : number;
                coreHeroName : string;
                heorIdList : number[];
                analysisDetail :string;
           }
       }
   
   
   }
}
   export {}