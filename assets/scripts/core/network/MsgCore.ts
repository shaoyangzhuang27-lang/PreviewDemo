
//网络相关
import { WebSock } from "./WebSock";
import { NetManager } from "./NetManager";
import { NetNode } from "./NetNode";
import { DefStringProtocol, NetData, INetworkTips,IProtocolHelper,SupperProtocol, NetCallFunc } from "./NetInterface";
import { PopCore } from "../control/PopCore";

// import {NotifyManager} from "./NotifyManager";
// import {Msg} from "./proto";

export class MsgCore{


    public initLoginServer(){
    }
    
    public connectLoginServer(ip:string | null = null,channelId: number = 0){
        // NetManager.getInstance().connect({ url: "ws://192.168.15.132:17183" });//开启连接
        // NetManager.getInstance().connect({ url: "ws://echo.websocket.org" });//开启连接
        // NetManager.getInstance().connect({ url: "ws://121.40.165.18:8800" });//开启连接
        // NetManager.getInstance().close();//关闭连接
    }

    protected getMsgMap(arr:Array<Map<number,any> | null>){
        let msgMap:Map<number,any> = new Map<number,any>();
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            element?.forEach((value:any, key:number) => {
                msgMap.set(key,value[0]);
            });
        }
        return msgMap;
    }

    
    public sendData(msgId:number,buffer_data:any, channelId: number = 0){
        // console.log("request id:"+msgId);
        // console.log(buffer_data);
        let buffer_all = this.encodeMessage(msgId,buffer_data)
        let isRight = NetManager.getInstance().send(buffer_all,false, channelId);//发送信息
        if(!isRight){
            this.connectLoginServer(null,channelId);
        }
    }
    public encodeMessage(id:number,buffer_data:any){
        let offsetLen = 2
        const buffer_all = new ArrayBuffer(buffer_data.byteLength + offsetLen);
        const dv_all = new DataView(buffer_all)
        dv_all.setUint16(0,id,true);
        for (var i = 0; i < buffer_data.length; i++) {
            dv_all.setInt8(i+offsetLen,buffer_data[i]);
        }
        return buffer_all;
    }
    



}