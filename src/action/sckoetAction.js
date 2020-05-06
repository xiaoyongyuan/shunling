import { SOCKET } from "./type";
export const postReducer=()=>dispatch=>{
    if ("WebSocket" in window) {
        // 打开一个 web socket
        var ws = new WebSocket("ws://"+window.g.websocket+"/api/websocket/1");
        ws.onopen = function () {
            ws.send("0");
        };
        ws.onmessage = function (evt) {

            var received_msg = evt.data;
            if(received_msg!=="连接成功"){
                dispatch({
                    type:SOCKET,
                    payload:received_msg
                });
            }
        };
        ws.onclose = function () {
            // 关闭 websocket
            console.log("连接已关闭...");
        };
    }
};
export const setpoliceList = data => ({ //添加tab
    type: 'SET_POLICELIST',
    policeList: data
});



