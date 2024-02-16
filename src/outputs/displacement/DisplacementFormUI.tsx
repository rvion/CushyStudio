import { observer } from 'mobx-react-lite'
import { FormUI } from 'src/controls/FormUI'
import { useSt } from 'src/state/stateContext'

export const DisplacementFooUI = observer(function DisplacementFooUI_(p: {
    /* state: DisplacementState */
}) {
    // const state =
    const st = useSt()
    return (
        <div>
            <FormUI form={st.displacementConf} />
            {/* <FieldAndLabelInlineUI label='Points'>
                <Toggle checked={state.usePoints} onChange={(e) => (state.usePoints = e.target.checked)} />
            </FieldAndLabelInlineUI> */}
            {/* <FieldAndLabelInlineUI label='displacement'>
                <InputNumberUI
                    mode='float'
                    style={{ width: '5rem' }}
                    step={0.01}
                    min={0}
                    max={5}
                    value={state.displacementScale}
                    onValueChange={(next) => {
                        state.displacementScale = next
                    }}
                />
            </FieldAndLabelInlineUI>
            <FieldAndLabelInlineUI label='cutout'>
                <InputNumberUI
                    mode='float'
                    style={{ width: '5rem' }}
                    min={0}
                    max={1}
                    step={0.01}
                    value={state.cutout}
                    onValueChange={(next) => {
                        state.cutout = next
                    }}
                />
            </FieldAndLabelInlineUI>
            <FieldAndLabelInlineUI label='light'>
                <Slider
                    style={{ width: '5rem' }}
                    min={0}
                    max={8}
                    value={state.ambientLightIntensity}
                    onChange={(ev) => {
                        const next = parseFloatNoRoundingErr(ev.target.value)
                        state.ambientLightIntensity = next
                    }}
                />
            </FieldAndLabelInlineUI>
            <FieldAndLabelInlineUI label='light color'>
                <Input
                    tw='join-item input-xs'
                    type='color'
                    style={{ width: '5rem' }}
                    value={state.ambientLightColor}
                    onChange={(ev) => {
                        const next = ev.target.value
                        const hex = typeof next === 'string' ? parseInt(next.replace('#', ''), 16) : next
                        state.ambientLightColor = hex
                    }}
                />
            </FieldAndLabelInlineUI>
            <FieldAndLabelInlineUI label='Symmetric Model'>
                <Toggle checked={state.isSymmetric} onChange={(e) => (state.isSymmetric = e.target.checked)} />
            </FieldAndLabelInlineUI>
            <FieldAndLabelInlineUI label='Screenshot'>
                <Button onClick={() => state.takeScreenshot(st)}>Take Screenshot</Button>
            </FieldAndLabelInlineUI> */}
        </div>
    )
})
