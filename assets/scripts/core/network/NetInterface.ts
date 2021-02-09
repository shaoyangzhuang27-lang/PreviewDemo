
/*
*   网络相关接口定义
*/

export type NetData = (string | ArrayBufferLike | Blob | ArrayBufferView | ArrayBuffer);
export type NetCallFunc = (cmd: number, data: any) => void;

// 回调对象
export interface CallbackObject {
    target: any,                // 回调对象，不为null时调用target.callback(xxx)
    callback: NetCallFunc,      // 回调函数
}

// 请求对象
export interface RequestObject {
    buffer: NetData,            // 请求的Buffer
    rspCmd: number,             // 等待响应指令
    rspObject: CallbackObject,  // 等待响应的回调对象
}

// 协议辅助接口
export interface IProtocolHelper {
    setProtocolMap(protocolMap:Map<number,string>):void;
    getHeadlen(): number;                   // 返回包头长度
    getHearbeat(): NetData;                 // 返回一个心跳包
    getPackageLen(msg: NetData): number;    // 返回整个包的长度
    checkPackage(msg: NetData): boolean;    // 检查包数据是否合法
    getPackageId(msg: NetData): number;     // 返回包的id或协议类型
    getPackage(msg:NetData): NetData;
}

// 默认字符串协议对象
export class DefStringProtocol implements IProtocolHelper {

    setProtocolMap(protocolMap:Map<number,string>):void{

    }
    getHeadlen(): number {
        return 0;
    }
    getHearbeat(): NetData {
        return "";
    }
    getPackageLen(msg: NetData): number
    {
        return msg.toString().length;
    }
    checkPackage(msg: NetData): boolean {
        return true;
    }
    getPackageId(msg: NetData): number {

        return 0;
    }
    getPackage(msg:NetData): NetData {
        return "";
    }
}

// 默认字符串协议对象
export class SupperProtocol implements IProtocolHelper {
    private protocolMap:Map<number,any>|null = null;
    constructor(protocolMap:Map<number,any>|null = null) {
        this.setProtocolMap(protocolMap);
    }
    setProtocolMap(protocolMap:Map<number,any>|null = null):void{
        this.protocolMap = protocolMap
    }
    getHeadlen(): number {
        return 2;
    }
    getHearbeat(): NetData {
        const buffer_hearbeat = new ArrayBuffer(2);
        const dv_all = new DataView(buffer_hearbeat)
        dv_all.setUint16(0,33,true);
        return buffer_hearbeat;
    }
    getPackageLen(msg: ArrayBuffer): number
    {
        return msg.toString().length - this.getHeadlen();
    }
    checkPackage(msg: ArrayBuffer): boolean {
        return true;
    }
    getPackageId(msg: ArrayBuffer): number {
        const dv_all = new DataView(msg)
        let id = dv_all.getInt16(0,true);
        return id;
    }
    getPackage(msg:ArrayBuffer): NetData{
        const dv_all = new DataView(msg)
        let id:number = dv_all.getInt16(0,true);
        const buffer_data = new ArrayBuffer(dv_all.byteLength - this.getHeadlen());
        const dv_data = new DataView(buffer_data)
        for (var i = 0; i < dv_data.byteLength; i++) {
            dv_data.setInt8(i,dv_all.getInt8(this.getHeadlen() + i));
        }
        let uData = new Uint8Array(dv_data.buffer);
        if(this.protocolMap && this.protocolMap.get(id)){
            let msgData = this.protocolMap.get(id).decode(uData);
            
            if(id != 34){
                console.log("NetInterface respone id:"+id);
                console.log(msgData);
            }
            return msgData;
        }else{
            return uData;
        }
    }
}
// Socket接口
export interface ISocket {
    onConnected: (event) => void;           // 连接回调
    onMessage: (msg: NetData) => void;      // 消息回调
    onError: (event) => void;               // 错误回调
    onClosed: (event) => void;              // 关闭回调
    
    connect(options: any);                  // 连接接口
    send(buffer: NetData);                  // 数据发送接口
    close(code?: number, reason?: string);  // 关闭接口
}

// 网络提示接口
export interface INetworkTips {
    connectTips(isShow: boolean): void;
    reconnectTips(isShow: boolean): void;
    requestTips(isShow: boolean): void;
    connectCloseTips():void;
}
