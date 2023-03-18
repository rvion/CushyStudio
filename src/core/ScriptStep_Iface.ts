/** every ExecutionStep class must implements this interface  */
export interface ScriptStep_Iface {
    /** name of the step */
    name: string

    /** promise to await if you need to wait until the step is finished */
    finished: Promise<this>
}
