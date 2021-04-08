/* 游戏组件:碎片合成
* @author 郭刚
* @version 1.0.0,2021.3.13
*/
import { _decorator, Component, Node,Label,Button, instantiate,Prefab,UITransform,Vec3,Size,resources } from 'cc';
import { PopBase } from '../../../../core/control/PopBase';
import { XConsts } from '../../../model/const/XConsts';
import { ElementHeroFragment } from './ElementHeroFragment';
import { TableName, ValueMgr } from "../../../model/ValueMgr";
import { PopMgr } from '../../../control/PopMgr';
import { ResMgr } from '../../../control/ResMgr';
import { MsgMgr } from '../../../control/MsgMgr';
import { NotifyMgr } from '../../../control/NotifyMgr';
const { ccclass, property } = _decorator;

@ccclass('PopFragmentSynthesis')
export class PopFragmentSynthesis extends PopBase {


    @property({type: Label})
    public lab_title = null as unknown as Label;

    @property({type: Label})
    public lab_fragment_title = null as unknown as Label;

    @property({type: Label})
    public lab_fragment_tips = null as unknown as Label;

    @property({type: Label})
    public lab_ban_sell = null as unknown as Label;

    @property({type: Label})
    public lab_num = null as unknown as Label;

    @property({type: Node})
    public btn_add = null as unknown as Node;

    @property({type: Node})
    public btn_reduce = null as unknown as Node;

    @property({type: Node})
    public btn_info = null as unknown as Node;

    @property({type: Node})
    public btn_summon = null as unknown as Node;

    @property({type: Node})
    public btn_submit = null as unknown as Node;
    
    // @property({type: LabelComponent})
    // public lab_content:LabelComponent | null = null;

    @property({type: Node})
    public node_hero_fragment = null as unknown as Node;

    @property({type: Node})
    public node_summon_counts = null as unknown as Node;


    //最大合成个数
    private _nMaxSysthesisCounts : number = 0;

    //当前显示的值
    private _nCurSysthesisCounts : number = 0;


    private _isWonderSummonShow : boolean = false;
    // private _submitCallFun:Function | null = null;


    private _fragmentSysthesisInfo : XStruct.fragment_synthesis_info.IRecord = {
        frame :"",
        camp : "",
        star : 0,
        quality : "",
        icon : "",
        type : 0,
        maxNum : 0,
        curNum : 0,
        heroName : "",
        campName : "",
        classesName : "",
        bg : "",
        param : 0
    }  

    public setIsWonderSummonShow(bState : boolean)
    {
        this._isWonderSummonShow = bState ;
    }

    public set FragmentSysthesisInfo(data : XStruct.fragment_synthesis_info.IRecord)
    {
        this._fragmentSysthesisInfo = data;
        this.initUI();
        this.addNotifyHandle()
    }

    public initUI()
    {

        ResMgr.getInstance().loadPrefab('prefabs_ui/features/bag/element_herofragment', (err: Error | null, res: Prefab | null)=>{
                let fragment_item = instantiate( res as Prefab );
                let script = fragment_item.getComponent(ElementHeroFragment) as ElementHeroFragment;
                fragment_item.scale = new Vec3(0.7,0.7,1);
                let subWidget = fragment_item.getComponent(UITransform) as UITransform;
                subWidget.contentSize = new Size(105,126);
                script.setFragmentInfo(this._fragmentSysthesisInfo,this._isWonderSummonShow);
                this.node_hero_fragment?.addChild(fragment_item);
        },"PopFragmentSynthesis");


        //let labtitle = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.UI_FRAGMENT) as Config.language_ui.Record;
        this.lab_title.string = ValueMgr.getInstance().getLanguageString(XConsts.UI_FRAGMENT);

        //let labbansell = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.UI_NOTFORSALE) as Config.language_ui.Record;
        this.lab_ban_sell.string = ValueMgr.getInstance().getLanguageString(XConsts.UI_NOTFORSALE);

        this.initLabelFromBtn(this.btn_submit,XConsts.UI_FRAGMENTUSE);
        this.initLabelFromBtn(this.btn_info,XConsts.UI_INFO);
        this.initLabelFromBtn(this.btn_summon,XConsts.UI_FRAGMENTUSE);  

        var content = ""
        if(this._fragmentSysthesisInfo.campName)
        {
            //var capName = ValueMgr.getInstance().getItemByField(TableName.language_ui,this._fragmentSysthesisInfo.campName) as Config.language_ui.Record;
            content = ValueMgr.getInstance().getLanguageString(this._fragmentSysthesisInfo.campName);
        }

        if(this._fragmentSysthesisInfo.heroName)
        {
            //var heroName = ValueMgr.getInstance().getItemByField(TableName.language_data,this._fragmentSysthesisInfo.heroName) as Config.language_data.Record;
            content = ValueMgr.getInstance().getLanguageString(this._fragmentSysthesisInfo.heroName);
        }

        if(this._fragmentSysthesisInfo.classesName)
        {
            //var classesName = ValueMgr.getInstance().getItemByField(TableName.language_ui,this._fragmentSysthesisInfo.classesName) as Config.language_ui.Record;
            content = ValueMgr.getInstance().getLanguageString(this._fragmentSysthesisInfo.classesName);
        }


        if(this._isWonderSummonShow)
        {
            this._ininWonderSummonFragemt(this._fragmentSysthesisInfo.type,this._fragmentSysthesisInfo.star,this._fragmentSysthesisInfo.maxNum,content);
        }
        else
        {
            this.initFragmentNameAndDesc(this._fragmentSysthesisInfo.type,this._fragmentSysthesisInfo.star,this._fragmentSysthesisInfo.maxNum,content);

            this.initUIState();

            this.lab_num.string = String(this._nCurSysthesisCounts);
        }
    }


    public initLabelFromBtn(obj : any, content : string)
    {
        var lab = obj.getChildByName("lab");
        var labComponet = lab && lab.getComponent(Label);
        if(labComponet)
        {
            //var labinfo = ValueMgr.getInstance().getItemByField(TableName.language_ui,content) as Config.language_ui.Record;
            labComponet.string = ValueMgr.getInstance().getLanguageString(content);
            //console.log("zzzzzz",labinfo.cn)
        }
    }


    public initUIState()
    {
        if(this._fragmentSysthesisInfo.curNum &&  this._fragmentSysthesisInfo.maxNum)
        {
            if(this._fragmentSysthesisInfo.curNum < this._fragmentSysthesisInfo.maxNum)
            {
                this.node_summon_counts.active = false;
                if(this._fragmentSysthesisInfo.type == Msg.TFragmentType.EFragmentType_Hero)
                {
                    this.initLabelFromBtn(this.btn_submit,XConsts.UI_INFO);
                    this.btn_info.active = false;
                    this.btn_summon.active = false;
                    this.lab_ban_sell.node.active =false;
                }
                else
                {
                    this.btn_submit.active = false;
                    this.btn_info.active = false;
                    this.btn_summon.active = false;
                }
            }
            else{
                this.lab_fragment_tips.node.active = false;
                this.lab_ban_sell.node.active =false;
                if(this._fragmentSysthesisInfo.type == Msg.TFragmentType.EFragmentType_Hero)
                {
                    this.btn_submit.active = false;
                }
                else
                {
                    this.btn_info.active = false;
                    this.btn_summon.active = false;
                }
                this._nMaxSysthesisCounts = Math.floor(this._fragmentSysthesisInfo.curNum / this._fragmentSysthesisInfo.maxNum);
                this._nCurSysthesisCounts = this._nMaxSysthesisCounts;
            }
        }
    }

    public initFragmentNameAndDesc(nType : number | null,nStar : number | null | undefined, nCounts : number | null|undefined, content : string)
    {
        let strFragmentName = "";
        let strFragmentDesc = "";

        let strName = "";
        let strDesc = "";

        var callFunc = (value : string) => {
            var content = ValueMgr.getInstance().getItemByField(TableName.language_ui,value) as Config.language_ui.Record;
            return content.cn;
        };
        switch(nType)
        {
            case Msg.TFragmentType.EFragmentType_Random :
                strName = callFunc(XConsts.UI_FRAGMENTNAME);
                strDesc = callFunc(XConsts.UI_FRAGMENTDESC);
                strFragmentName = strName.replace("{0}",String(nStar));
                strDesc = strDesc.replace("{0}",String(nCounts));
                strFragmentDesc = strDesc.replace("{1}",String(nStar));
                break;
            case Msg.TFragmentType.EFragmentType_CampRandom :
                strName = callFunc(XConsts.UI_FRAGMENTCAMPNAME);
                strDesc = callFunc(XConsts.UI_FRAGMENTCAMPDESC);
                strName = strName.replace("{0}",String(nStar));
                strFragmentName = strName.replace("{1}",String(content));
                strDesc = strDesc.replace("{0}",String(nCounts));
                strDesc = strDesc.replace("{1}",String(nStar));
                strFragmentDesc = strDesc.replace("{2}",content);
                break;
            case Msg.TFragmentType.EFragmentType_ClassesRandom :
                strName = callFunc(XConsts.UI_FRAGMENTCLASSESNAME);
                strDesc = callFunc(XConsts.UI_FRAGMENTCLASSESDESC);
                strName = strName.replace("{0}",String(nStar));
                strFragmentName = strName.replace("{1}",String(content));
                strDesc = strDesc.replace("{0}",String(nCounts));
                strDesc = strDesc.replace("{1}",String(nStar));
                strFragmentDesc = strDesc.replace("{2}",content);
                break;
            case Msg.TFragmentType.EFragmentType_Hero :
                strName = callFunc(XConsts.UI_FRAGMENTHERONAME);
                strDesc = callFunc(XConsts.UI_FRAGMENTHERODESC);
                strName = strName.replace("{0}",String(nStar));
                strFragmentName = strName.replace("{1}",content);
                strDesc = strDesc.replace("{0}",String(nCounts));
                strDesc = strDesc.replace("{1}",String(nStar));
                strFragmentDesc = strDesc.replace("{2}",content);
                break;
        }
        this.lab_fragment_title.string = strFragmentName;
        this.lab_fragment_tips.string = strFragmentDesc;
    }

    start()
    {
        super.start();
        this.btn_add.on(Node.EventType.TOUCH_END, this._onBtnAddClick, this);
        this.btn_reduce.on(Node.EventType.TOUCH_END, this._onBtnReduceClick, this);
        this.btn_summon.on(Node.EventType.TOUCH_END,this._onBtnSummonClick,this);
        this.btn_submit.on(Node.EventType.TOUCH_END,this._onBtnSubmitClick,this);

    }


    private _onBtnSummonClick(event : any)
    {
        if(this._nCurSysthesisCounts > 0)
        {
            this.requsetFragmentSysthensis();
        }
    }

    private _onBtnSubmitClick(event : any)
    {
        if(this._nCurSysthesisCounts > 0)
        {
            this.requsetFragmentSysthensis();
        }
    }
    private _onBtnAddClick(event : any)
    {
        this._nCurSysthesisCounts++;
        if(this._nCurSysthesisCounts >= this._nMaxSysthesisCounts)
        {
            this._nCurSysthesisCounts = this._nMaxSysthesisCounts;
        }
        this.lab_num.string = String(this._nCurSysthesisCounts);
    }
    

    private _onBtnReduceClick(event : any)
    {
        this._nCurSysthesisCounts--;
        if(this._nCurSysthesisCounts <= 1)
        {
            this._nCurSysthesisCounts = 1;
        }
        this.lab_num.string = String(this._nCurSysthesisCounts);
    }
    
    private _ininWonderSummonFragemt(nType : number | null,nStar : number | null | undefined, nCounts : number | null|undefined, content : string)
    {
        let strFragmentName = "";
        let strFragmentDesc = "";

        let strName = "";
        let strDesc = "";

        var callFunc = (value : string) => {
            return ValueMgr.getInstance().getLanguageString(value);
        };


        switch(nType)
        {
            case Msg.TFragmentType.EFragmentType_Random :
                strName = callFunc(XConsts.UI_FRAGMENTNAME);
                strDesc = callFunc(XConsts.UI_FRAGMENTDESC);
                strFragmentName = strName.replace("{0}",String(nStar));
                strDesc = strDesc.replace("{0}",String(nCounts));
                strFragmentDesc = strDesc.replace("{1}",String(nStar));
                break;
            case Msg.TFragmentType.EFragmentType_CampRandom :
                strName = callFunc(XConsts.UI_FRAGMENTCAMPNAME);
                strDesc = callFunc(XConsts.UI_FRAGMENTCAMPDESC);
                strName = strName.replace("{0}",String(nStar));
                strFragmentName = strName.replace("{1}",String(content));
                strDesc = strDesc.replace("{0}",String(nCounts));
                strDesc = strDesc.replace("{1}",String(nStar));
                strFragmentDesc = strDesc.replace("{2}",content);
                break;
        }

        this.lab_fragment_title.string = strFragmentName;
        this.lab_fragment_tips.string = strFragmentDesc;
        this.btn_submit.active = false;
        this.btn_info.active = false;
        this.btn_summon.active = false;
        this.node_summon_counts.active = false;
    }


    public addNotifyHandle()
    {
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_bag_fragment_synthesis,this.notifyFragmentSynthesisHandle,this);
    }

    public removeNotifyHandle()
    {
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_bag_fragment_synthesis,this.notifyFragmentSynthesisHandle,this);
    }

    public notifyFragmentSynthesisHandle ( msgData: Msg.UseFragmentA){
        console.log("UseFragmentA",msgData)
        if (msgData.err == Msg.TErrorCode.ERR_OK) {
           PopMgr.getInstance().deleteWindow();
           PopMgr.getInstance().popFramgentsynthesisResult(msgData);
           console.log("ffffffffffffff0", msgData.consumeNum )
           console.log("ffffffffffffff1", msgData.fragmentType )
           console.log("ffffffffffffff2", msgData.star )
        }
        else
        {
            //此处消息错误处理 
        }
    }


    public requsetFragmentSysthensis()
    {
        let useFragmentR : Msg.UseFragmentR = {
            fragmentType : this._fragmentSysthesisInfo.type ? this._fragmentSysthesisInfo.type : 0,
            param : 0,
            star : 0,
            heroNum : 0
        }
        if(this._fragmentSysthesisInfo.type == Msg.TFragmentType.EFragmentType_Random)
        {
            useFragmentR.star = this._fragmentSysthesisInfo.star ? this._fragmentSysthesisInfo.star : 0;
        }
        else if(this._fragmentSysthesisInfo.type == Msg.TFragmentType.EFragmentType_CampRandom)
        {
            useFragmentR.param = this._fragmentSysthesisInfo.param ? this._fragmentSysthesisInfo.param : 0;
            useFragmentR.star = this._fragmentSysthesisInfo.star ? this._fragmentSysthesisInfo.star : 0;
        }
        else if(this._fragmentSysthesisInfo.type == Msg.TFragmentType.EFragmentType_ClassesRandom)
        {
            useFragmentR.param = this._fragmentSysthesisInfo.param ? this._fragmentSysthesisInfo.param : 0;
            useFragmentR.star = this._fragmentSysthesisInfo.star ? this._fragmentSysthesisInfo.star : 0;
        }
        else if(this._fragmentSysthesisInfo.type == Msg.TFragmentType.EFragmentType_Hero)
        {
            useFragmentR.param = this._fragmentSysthesisInfo.param ? this._fragmentSysthesisInfo.param : 0;
        }
        // if(this._fragmentSysthesisInfo.maxNum)
        // {
        //     useFragmentR.heroNum = this._nCurSysthesisCounts * this._fragmentSysthesisInfo.maxNum;
        // }
       
        useFragmentR.heroNum = this._nCurSysthesisCounts;
        console.log("requestUseFragmentR data  ",useFragmentR);
        MsgMgr.getInstance().getMsgBag().requestUseFragmentR(useFragmentR);
    }
    onDestroy()
    {
        this.removeNotifyHandle();
    }

}
