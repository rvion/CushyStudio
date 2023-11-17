import { makeAutoObservable } from 'mobx'
import { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { Widget_size } from 'src/controls/Widget'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'
import { Addon, Joined } from 'src/rsuite/shims'

export const WigetSizeUI = observer(function WigetSizeUI_(p: { req: Widget_size }) {
    const uist = useMemo(() => new ResolutionState(), [])

    return (
        <div className='flex items-center flex-wrap space-x-2'>
            <Joined>
                <Addon>W</Addon>
                <InputNumberUI
                    //
                    mode='int'
                    size
                    tw='join-item'
                    value={uist.width}
                    onValueChange={(next) => uist.setWidth(next)}
                    hideSlider
                />
            </Joined>
            <Joined>
                <Addon>H</Addon>
                <InputNumberUI
                    //
                    tw='join-item'
                    mode='int'
                    value={uist.height}
                    onValueChange={(next) => uist.setHeight(next)}
                    hideSlider
                />
            </Joined>
            {/* {JSON.stringify(uist.width)}x{JSON.stringify(uist.height)} */}
            <Joined>
                <button
                    type='button'
                    tw={['btn btn-xs join-item btn-outline', uist.desiredModelType === 'xl' && 'btn-active']}
                    onClick={() => uist.setModelType('xl')}
                >
                    XL
                </button>
                <button
                    type='button'
                    tw={['btn btn-xs join-item btn-outline', uist.desiredModelType === '1.5' && 'btn-active']}
                    onClick={() => uist.setModelType('1.5')}
                >
                    1.5
                </button>
            </Joined>
            <Joined>
                <button
                    type='button'
                    tw={['btn btn-xs join-item btn-outline', uist.desiredAspectRatio === '1:1' && 'btn-active']}
                    onClick={() => uist.setAspectRatio('1:1')}
                >
                    1:1
                </button>
                <button
                    type='button'
                    tw={['btn btn-xs join-item btn-outline', uist.desiredAspectRatio === '16:9' && 'btn-active']}
                    onClick={() => uist.setAspectRatio('16:9')}
                >
                    16:9
                </button>
                <button
                    type='button'
                    tw={['btn btn-xs join-item btn-outline', uist.desiredAspectRatio === 'custom' && 'btn-active']}
                    onClick={() => uist.setAspectRatio('custom')}
                >
                    ?
                </button>
            </Joined>
            {/* <select value={uist.desiredAspectRatio} onChange={(e) => uist.setAspectRatio(e.target.value as AspectRatio)}>
                <option value='1:1'>1:1</option>
                <option value='16:9'>16:9</option>
                <option value='4:3'>4:3</option>
                <option value='3:2'>3:2</option>
                <option value='custom'>Custom</option>
            </select> */}
        </div>
    )
})

type ModelType = 'xl' | '1.5' | 'custom'
type AspectRatio = '1:1' | '16:9' | '4:3' | '3:2' | 'custom'
class ResolutionState {
    private idealSizeforModelType = (model: ModelType | string) => {
        if (model === 'xl') return { width: 1024, height: 1024 }
        if (model === '2.0') return { width: 768, height: 768 }
        if (model === '2.1') return { width: 768, height: 768 }
        if (model === '1.5') return { width: 512, height: 512 }
        if (model === '1.4') return { width: 512, height: 512 }
        return { width: this.width, height: this.height }
    }
    width: number = 1920
    height: number = 1080
    desiredModelType: ModelType = 'xl'
    desiredAspectRatio: AspectRatio = '16:9'

    constructor() {
        makeAutoObservable(this)
    }

    setWidth(width: number) {
        this.width = width
        if (this.desiredAspectRatio !== 'custom') {
            this.updateHeightBasedOnAspectRatio()
        }
    }

    setHeight(height: number) {
        this.height = height
        if (this.desiredAspectRatio !== 'custom') {
            this.updateWidthBasedOnAspectRatio()
        }
    }

    get realAspectRatio() {
        return this.width / this.height
    }
    setModelType(modelType: ModelType) {
        this.desiredModelType = modelType
        // const currentAspect = this.width / this.height
        const itgt = this.idealSizeforModelType(modelType)
        const diagPrev = Math.sqrt(this.width ** 2 + this.height ** 2)
        const diagNext = Math.sqrt(itgt.width ** 2 + itgt.height ** 2)
        const factor = diagNext / diagPrev
        console.log({ modelType, idealTarget: itgt, avg: diagPrev, avg2: diagNext, factor })
        this.width = Math.round(this.width * factor)
        this.height = Math.round(this.height * factor)
        console.log(`final is w=${this.width} x h=${this.height}`)
        console.log(`fixed avg is ${Math.sqrt(this.width ** 2 + this.height ** 2)}`)
    }

    setAspectRatio(aspectRatio: AspectRatio) {
        this.desiredAspectRatio = aspectRatio
        if (aspectRatio !== 'custom') this.updateWidthBasedOnAspectRatio()
        this.setModelType(this.desiredModelType)
    }

    private updateHeightBasedOnAspectRatio() {
        const [widthRatio, heightRatio] = this.desiredAspectRatio.split(':').map(Number)
        this.height = Math.round(this.width * (heightRatio / widthRatio))
    }

    private updateWidthBasedOnAspectRatio() {
        const [widthRatio, heightRatio] = this.desiredAspectRatio.split(':').map(Number)
        this.width = Math.round(this.height * (widthRatio / heightRatio))
    }
}
