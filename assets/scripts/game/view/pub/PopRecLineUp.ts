import { _decorator,Label, resources, instantiate, ScrollView } from 'cc';
const { ccclass, property } = _decorator;
import { PopBase } from '../../../core/control/PopBase';
import { GameModel } from '../../model/GameModel';
import { PubRecLineUpItem } from './PubRecLineUpItem';


@ccclass('PopRecLineUp')
export class PopRecLineUp extends PopBase {

    @property({type: Label})
    public lab_title:Label = null as unknown as Label;

    @property({type :  ScrollView})
    public scroll_lineup_view:ScrollView = null as unknown as ScrollView;
    
    onLoad () {
        super.onLoad();
        GameModel.getInstance().getHeroPubModel().initRecLineUpInfos();
        this.initLineUpView();
    }

    public initLineUpView()
    {
        if(this.scroll_lineup_view.content)
        {
            this.scroll_lineup_view.content.removeAllChildren()
        }
        resources.load('prefabs_ui/main/pub_reclineup_item', (err:any,res:any)=>{
            for (var i = 0 ; i < GameModel.getInstance().getHeroPubModel().nLineUpCounts; i++) {
                let reclineup_item = instantiate( res );
                let script = reclineup_item.getComponent(PubRecLineUpItem);
                script.setViewDetaiLabelContent(GameModel.getInstance().getHeroPubModel().getRecLineUpItemInfoByIndex(i));
                this.scroll_lineup_view.content?.addChild(reclineup_item);
            }
        });
    }
    //设置标题
    public setTitle(title:string){
        if(this.lab_title)
            this.lab_title.string = title
    }

}

