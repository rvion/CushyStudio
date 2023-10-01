export type ConfigFile = {
    /** e.g.
     * - true
     *   => will use https:// for POST requests
     *   => will use wss:// for websocket connections
     * - false
     *   => will use http:// for POST requests
     *   => will use ws:// for websocket connections
     * */
    useHttps: boolean
    /** e.g.
     * @example localhost
     * @example 192.168.0.19
     * */
    comfyHost: string
    /** e.g.
     * @example 8188
     * */
    comfyPort: number

    /** defaults to 48px */
    galleryImageSize?: number

    /** defaults to 5 */
    checkUpdateEveryMinutes?: number
}
