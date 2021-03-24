
import { _decorator, Component, BatchingUtility } from 'cc';
const { ccclass } = _decorator;

@ccclass('BattleGround')
export class BattleGround extends Component {
    onLoad() {
        BatchingUtility.batchStaticModel(this.node, this.node);
    }

    onDestroy() {
        BatchingUtility.unbatchStaticModel(this.node, this.node);
    }

}
