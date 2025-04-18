interface Options {
    /** server 酱推送功能的启用，false 或者 server 酱的token */
    withServerChan?: false | string;
    /** bark 推送功能的启用，false 或者 bark 的 URL */
    withBark?: false | string;
    /** 消息推送功能的启用，false 或者 message-pusher 的 WebHook URL */
    withMessagePusher?: false | string;
}
declare function doAttendanceForAccount(token: string, options: Options): Promise<void>;

export { doAttendanceForAccount };
