export class XMsgExt{
    // public static  KLanguegeTypeUI:string = "UI";
    
    public static GetHeroPropertyStaticID(hbu:Msg.HeroBookUnit){
        return hbu.heroBookId / 1000000 * 100 + hbu.level;
    }

    public static GetCurMaxLevel(hbu:Msg.HeroBookUnit){
        return hbu.curTopStar;
    }
    public static IsCanLevelUp(hbu:Msg.HeroBookUnit){
        return hbu.level < hbu.curTopStar;
    }
    public static GetMaxLevel(hbu:Msg.HeroBookUnit){
        let maxLevel:number = 1;
        if (Number((hbu.heroBookId / 1000000).toFixed()) == 2)
            maxLevel = 2;
        else if (Number((hbu.heroBookId / 1000000).toFixed()) == 3)
            maxLevel = 8;
        else if (Number((hbu.heroBookId / 1000000).toFixed()) == 5)
            maxLevel = 13;
        return maxLevel;
    }
}