import net from "net"
import os from "os"
import axios from "axios";
import { softWareConfigData } from '@/setup/softwareConfig';
axios.defaults.timeout = 60000;
const virtualMacPrefix = new Set([
    '00:05:69', // vmware1
    '00:0c:29', // vmware2
    '00:50:56', // vmware3
    '00:1c:14', // vmware
    '00:1c:42', // parallels1
    '02:00:4c', // Microsoft Loopback Adapter (微软回环网卡)
    '00:03:ff', // microsoft virtual pc
    '00:0f:4b', // virtual iron 4
    '00:16:3e', // red hat xen , oracle vm , xen source, novell xen
    '08:00:27', // virtualbox
    '0a:00:27',
    '00:15:5d',
]);


function isMac(mac: string) {
    return /^([\da-f]{1,2}[:-]){5}([\da-f]{1,2})$/i.test(mac);
}

function formatMac(mac: string) {
    return String(mac).trim().toLowerCase().replace(/-/g, ':');
}

function isVirtualMac(mac: string) {
    return isMac(mac) && virtualMacPrefix.has(formatMac(mac).slice(0, 8));
}


//获取IP地址
export const getLanIpAddress = function () {
    const ifaces = os.networkInterfaces();
    for (const dev in ifaces) {
        const iface = ifaces[dev] as Array<os.NetworkInterfaceInfo>;
        for (let i = 0; i < iface.length; i++) {
            const { family, address, internal, mac } = iface[i]
            if (family === 'IPv4' && address !== '127.0.0.1' && !internal && !isVirtualMac(mac)) {
                return address
            }
        }
    }
    return '127.0.0.1';
}

export const getWanIpAddress = function (): Promise<string> {
    return new Promise((resolve) => {
        axios.get(softWareConfigData.serverWanIpWebsite as string).then((res) => {
            resolve(res.data);
        });
    });
}


// 检测端口是否被占用
export const portIsOccupied = function (port: number): Promise<boolean> {
    return new Promise((resolve) => {
        // 创建服务并监听该端口
        const server = net.createServer().listen(port)
        server.on('listening', function () { // 执行这块代码说明端口未被占用
            server.close() // 关闭服务
            console.log('The port【' + port + '】 is available.') // 控制台输出信息
            resolve(true)
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        server.on('error', function (err: any) {
            if (err.code === 'EADDRINUSE') { // 端口已经被使用
                console.error('The port【' + port + '】 is occupied, please change other port.')
            }
            server.close()
            resolve(false)
        })
    });
}