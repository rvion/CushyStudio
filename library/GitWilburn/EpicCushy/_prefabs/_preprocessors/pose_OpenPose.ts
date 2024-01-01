import type { Runtime } from 'src'
import type { FormBuilder } from 'src/controls/FormBuilder'
import { OutputFor } from 'library/CushyStudio/default/_prefabs'
import { ImageAnswer } from 'src/controls/misc/InfoAnswer'

export const ui_preprocessor_OpenPose = (form: FormBuilder) => {
    return form.group({
        items: () => ({
            detect_body: form.bool({ default: true }),
            detect_face: form.bool({ default: true }),
            detect_hand: form.bool({ default: true }),
            resolution: form.int({ default: 512, min:512, max:1024, step:512 }),

            //todo:add support for auto-modifying the resolution based on other form selections
            //todo:add support for auto-cropping            
        })
    })
}

// RUN -----------------------------------------------------------
export const run_preprocessor_OpenPose = async (p:{
    //
    flow: Runtime,
    opts: OutputFor<typeof ui_preprocessor_OpenPose>,
    original_image: ImageAnswer
}) => {
    const graph = p.flow.nodes

    let return_image: IMAGE
    return_image = graph.OpenposePreprocessor({ image: await p.flow.loadImageAnswer(p.original_image), 
        detect_body: (p.opts.detect_body)?"enable":"disable", 
        detect_face: (p.opts.detect_face)?"enable":"disable", 
        detect_hand: (p.opts.detect_hand)?"enable":"disable",
        resolution:p.opts.resolution})._IMAGE    
    
    return return_image
}