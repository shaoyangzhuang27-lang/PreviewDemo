
import { _decorator, Component, BatchingUtility } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BattleGround')
export class BattleGround extends Component {

    onLoad() {
        // BatchingUtility.batchStaticModel(this.node, this.node);
    }

}
