export class XMsgExt{
    // public static  KLanguegeTypeUI:string = "UI";
    
    public static GetHeroPropertyStaticID(hbu:Msg.HeroBookUnit){
        return hbu.heroBookId / 1000000 * 100 + hbu.level;
    }
}