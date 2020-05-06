/*
 * 参数：[socketOpen|socketClose|socketMessage|socketError] = func，[socket连接成功时触发|连接关闭|发送消息|连接错误]
 * timeout：连接超时时间
 * @type {module.webSocket}
 */
export default class webSocket {
  constructor(param = {}) {
    this.param = param;
    this.reconnectCount = 0;
    this.socket = null;
    this.taskRemindInterval = null;
    this.isSucces = true;
  }
  connection = () => {
    let { socketUrl, timeout = 0 } = this.param;
    if ("WebSocket" in window) {
      this.socket = new WebSocket(socketUrl);
    } else {
      alert("您的浏览器不支持webSocket");
    }

    this.socket.onopen = this.onopen;
    this.socket.onmessage = this.onmessage;
    this.socket.onclose = this.onclose;
    this.socket.onerror = this.onerror;
    this.socket.sendMessage = this.sendMessage;
    this.socket.closeSocket = this.closeSocket;
    // 检测返回的状态码 如果socket.readyState不等于1则连接失败，关闭连接
    if (timeout) {
      let time = setTimeout(() => {
        if (this.socket && this.socket.readyState !== 1) {
          this.socket.close();
        }
        clearInterval(time);
      }, timeout);
    }
  };
  // 连接成功触发
  onopen = () => {
    let { socketOpen } = this.param;
    this.isSucces = false; //连接成功将标识符改为false
    socketOpen && socketOpen();
  };
  // 后端向前端推得数据
  onmessage = msg => {
    let { socketMessage } = this.param;
    socketMessage && socketMessage(msg);
  };
  // 关闭连接触发
  onclose = e => {
    this.isSucces = true; //关闭将标识符改为true
    let { socketClose } = this.param;
    socketClose && socketClose(e);
    // 根据后端返回的状态码做操作
    // 我的项目是当前页面打开两个或者以上，就把当前以打开的socket关闭
    // 否则就20秒重连一次，直到重连成功为止
    if (e.code == "4500") {
      this.socket.close();
    } else {
      this.taskRemindInterval = setInterval(() => {
        if (this.isSucces) {
          this.connection();
        } else {
          clearInterval(this.taskRemindInterval);
        }
      }, 20000);
    }
  };
  onerror = e => {
    // socket连接报错触发
    let { socketError } = this.param;
    this.socket = null;
    socketError && socketError(e);
  };
  sendMessage = value => {
    // 向后端发送数据
    if (this.socket) {
      this.socket.send(JSON.stringify(value));
    }
  };
}
