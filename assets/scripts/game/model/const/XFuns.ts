//通用函数类
export class XFuns{

    //数值转化
    public static FormatNumber(num:number):string
    {
        if(num < 10000)
            return num.toString();
        else if (num < 100000)
            return (num/1000).toFixed(1) + "K";
        else if (num < 10000000)
            return (num / 1000).toFixed() + "K";
        else if (num < 100000000)
            return (num / 1000000).toFixed(1) + "M";
        else if (num < 10000000000)
            return (num / 1000000).toFixed() + "M";
        else if (num < 100000000000)
            return (num / 1000000000).toFixed(1) + "B";
        else if (num < 1000000000000)
            return (num / 1000000000).toFixed() + "B";
        else
            return num.toString();
    }
}