import { observer } from 'mobx-react-lite'
import { Form, Radio, RadioGroup } from 'rsuite'
import { Requestable_size } from 'src/controls/InfoRequest'
import { AspectRatio, SDModelType } from 'src/controls/misc/InfoAnswer'

export const WigetSizeUI = observer(function WigetSizeUI_(p: { req: Requestable_size }) {
    return (
        <div>
            <Form.Group controlId='radioList'>
                <RadioGroup name='radioList' inline>
                    <Radio value='A'>Item A</Radio>
                    <Radio value='B'>Item B</Radio>
                    <Radio value='C'>Item C</Radio>
                    <Radio value='D' disabled>
                        Item D
                    </Radio>
                </RadioGroup>
                <RadioGroup name='radioList' inline>
                    <Radio value='A'>Item A</Radio>
                    <Radio value='B'>Item B</Radio>
                    <Radio value='C'>Item C</Radio>
                    <Radio value='D' disabled>
                        Item D
                    </Radio>
                </RadioGroup>
                <div>width: TODO</div>
                <div>height: TODO</div>
            </Form.Group>
        </div>
    )
})

const getSizeFromRatio = (
    //
    model: SDModelType,
    ratio: AspectRatio,
): { width: number; height: number } => {
    let base: number = 512
    if (model === 'SD2.1 768') {
        base = 768
    } else if (model === 'SDXL 1024') {
        base = 1024
    }

    const [widthRatioStr, heightRatioStr] = ratio.split(':')
    let widthRatio: number = parseInt(widthRatioStr)
    let heightRatio: number = parseInt(heightRatioStr)

    // Uncomment if you want to log these values.
    // console.log(`widthRatio: ${widthRatio}, heightRatio: ${heightRatio}`);

    const maxRatio: number = Math.max(widthRatio, heightRatio)
    const minRatio: number = Math.min(widthRatio, heightRatio)

    // Uncomment if you want to log this value.
    // console.log(`minRatio: ${minRatio}`);

    const baseUnit: number = 64
    let width: number = (base / minRatio) * widthRatio
    let height: number = (base / minRatio) * heightRatio

    const maxLimit: number = base * 2

    if (maxRatio > 10) {
        width = baseUnit * widthRatio
        height = baseUnit * heightRatio
    }

    if (width > maxLimit || height > maxLimit) {
        width = width / 2
        height = height / 2
    }

    width = Math.floor(width)
    height = Math.floor(height)
    return { width, height }
}
