/*
 * @Description: 通用函数类
 * @Author: xxx
 * @Date: 2021-03-08 10:30:05
 * @LastEditTime: 2021-04-07 20:02:06
 */
import { resources, Node, Sprite, SpriteFrame, Layers, Component } from "cc";
import { ResMgr } from "../../control/ResMgr";
export class XFuns {

    /**
     * @description: 数值转化成带K,M等单位的字符串
     * @param num 传入数值
     */
    public static FormatNumber(num: number): string {
        if (num < 10000)
            return num.toString();
        else if (num < 100000)
            return (num / 1000).toFixed(1) + "K";
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

    /**
     * @description: 代码创建图片SpriteFrame
     * @param imgPath resources目录下资源路径 eg."ui/features/heropromotion/ico_hero_tier/spriteFrame"
     * @param parent 父节点
     * @param spriteName 图片名字
     * @param callBack 回调函数
     */
    public static CreateSprite(imgPath: string, parent: Node, spriteName: string = "sp", callBack: Function | null = null) {
        ResMgr.getInstance().loadSpriteFrame(imgPath, (err, spriteFrame) => {
            if (!err && spriteFrame) {
                let node = new Node(spriteName);
                const sprite = node.addComponent(Sprite);
                sprite.spriteFrame = spriteFrame;
                node.layer = Layers.Enum.UI_2D; //设置显示层级!
                parent.addChild(node);

                if (callBack) {
                    callBack();
                }
            }else{                
                console.log("XFuns CreateSprite _resourceLoad ---------imgPath=",imgPath," err=", err)
            }
        });
    }

    /**
     * @description: 资源替换SpriteFrame
     * @param imgPath resources目录下资源路径 eg."ui/features/heropromotion/ico_hero_tier/spriteFrame"
     * @param sp 图片节点
     * @param callBack 回调函数
     */
    public static ReplaceSpriteFrame(imgPath: string, sp: Sprite, callBack: Function | null = null) {
        ResMgr.getInstance().loadSpriteFrame(imgPath, (err, spriteFrame) => {
            if (!err && spriteFrame) {
                sp.spriteFrame = spriteFrame;
                if (callBack) {
                    callBack();
                }
            }else{
                console.log("XFuns CreateSprite _resourceLoad ---------imgPath=",imgPath," err=", err)
            }
        });
    }

}