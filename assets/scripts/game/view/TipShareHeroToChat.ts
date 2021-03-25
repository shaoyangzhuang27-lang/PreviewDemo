/*
 * @Description: 分享到聊天频道Tip
 * @Author: 徐涛
 * @Date: 2021-03-25 19:29:47
 * @LastEditTime: 2021-03-25 20:54:19
 */
import { _decorator, Node, Label, Vec3 } from 'cc';
import { MsgMgr } from '../control/MsgMgr';
import { HeroData } from '../model/datas/HeroData';
import { GameModel } from '../model/GameModel';
import { ValueMgr } from '../model/ValueMgr';
import { TipBase } from './TipBase';
const { ccclass, property } = _decorator;

@ccclass('TipShareHeroToChat')
export class TipShareHeroToChat extends TipBase {
    @property({ type: Label, displayName: "Lab世界" })
    public lab_world: Label = null as unknown as Label;

    @property({ type: Label, displayName: "Lab公会" })
    public lab_guild: Label = null as unknown as Label;

    @property({ type: Node, displayName: "世界按钮" })
    public btn_world: Node | null = null;

    @property({ type: Node, displayName: "公会按钮" })
    public btn_guild: Node | null = null;

    private _heroData: HeroData = null as unknown as HeroData;

    start() {
        super.start();

        this.lab_world.string = ValueMgr.getInstance().getLanguageString("UI_WordChat");
        this.lab_guild.string = ValueMgr.getInstance().getLanguageString("UI_GuildChat");

        this.btn_world?.on(Node.EventType.TOUCH_END, this._onBtnClick, this);
        this.btn_guild?.on(Node.EventType.TOUCH_END, this._onBtnClick, this);
    }

    private _onBtnClick(event: any) {
        console.log(" HeroPromotion _buttonBtnClick: " + event.target?._name)

        switch (event.target) {
            case this.btn_world:
                this._onBtnCallFun(Msg.TChatChannelType.EChatChannelType_World);
                break;
            case this.btn_guild:
                this._onBtnCallFun(Msg.TChatChannelType.EChatChannelType_Guild);
                break;
            default:
                break;
        }
    }

    /**
     * @description: 设置分享的英雄数据
     * @param {HeroData} heroData
     */
    public setHeroData(heroData: HeroData) {
        this._heroData = heroData;
    }

    private _onBtnCallFun(channelType: Msg.TChatChannelType) {
        if (this._heroData == null)
            return;
        if (this._heroData.isRoleHero())
            return;
        if (channelType == Msg.TChatChannelType.EChatChannelType_Guild) {
            let playerInfo = GameModel.getInstance().getPlayerModel().getPlayerInfo();
            if (playerInfo.guildID == 0)//|| GuildManager.instance.guildSelf.GuildId == 0)
            {

                console.log(ValueMgr.getInstance().getLanguageString("UI_NoGuild"));
                // TipsMgr.instance.ShowTips(LanguageManager.instance.GetString("UI_NoGuild"));
                return;
            }
        }

        let heroStaticId = this._heroData.getStaticID();
        let heroName = ValueMgr.getInstance().getLanguageString(this._heroData.record.name);
        let heroTier = this._heroData.tier;
        let heroLevel = this._heroData.level;
        let content = "<a href=" + heroStaticId.toString() + "-" + heroTier + "-" + heroLevel.toString() + ">" + "[" + heroName + "]" + "</a>";
        //<a href=5064600-4-71>[Brewmaster]</a>                :格式 //chat.InputContent(content);

        MsgMgr.getInstance().getMsgFormation().requestChat(content, channelType);

        //分享成功tips
        console.log(ValueMgr.getInstance().getLanguageString("UI_Share"));
        // TipsMgr.instance.ShowTips(LanguageManager.instance.GetString("UI_Share"));

        // 关闭自己
        this.node.destroy();
    }

    /**
     * @description: 重写基类TipBase的方法调整位置
     * @param {Vec3} pos
     * @param {number} align
     * @param {boolean} isViewPos
     */
    public setWinPos(pos: Vec3, align: number = 0, isViewPos: boolean = true) {
        // let posOld =new Vec3(pos);
        super.setWinPos(pos, align, isViewPos);
        let newPos = this.window.getPosition();
        if (newPos.x < 0) {
            newPos.x += 50;
        }
        else if (newPos.x > 0) {
            newPos.x -= 50;
        }
        // newPos.x= posOld.x;

        // newPos.y += 20;
        this.window.setPosition(newPos);
    }
}
