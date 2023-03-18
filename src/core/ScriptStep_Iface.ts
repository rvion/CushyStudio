/** every ExecutionStep class must implements this interface  */
export interface ScriptStep_Iface<Result> {
    /** name of the step */
    name: string

    /** promise to await if you need to wait until the step is finished */
    finished: Promise<Result>
}
