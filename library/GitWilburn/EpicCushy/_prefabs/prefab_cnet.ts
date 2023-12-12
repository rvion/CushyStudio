import type { Runtime, Widget_bool, Widget_enum, Widget_float, Widget_group, Widget_groupOpt, Widget_group_output, Widget_image, Widget_int } from 'src'
import type { FormBuilder } from 'src/controls/FormBuilder'
import { OutputFor } from 'library/CushyStudio/default/_prefabs'
import { ui_preprocessor_OpenPose, run_preprocessor_OpenPose } from './_preprocessors/pose_OpenPose';
import { ImageAnswer } from 'src/controls/misc/InfoAnswer'

// CNET -----------------------------------------------------------
export const ui_cnet = (form: FormBuilder) => {    
    return form.group({
        label: 'Control Net',
        items: () => ({
            cnet_model_name: form.enum({
                enumName: 'Enum_ControlNetLoader_control_net_name',
                default: 'control_v11p_sd15_canny.pth',
                group: 'Controlnet',
                label: 'Model',
            }),
            strength: form.float({default:1,min:0,max:2,step:0.1}),
            preprocessor: form.groupOpt({
                label:'Preprocessor',
                items: () => ({
                    cnet_preprocessor: ui_preprocessor_OpenPose(form),
                })
            }),
            
            image: form.image({ }),
        }),
    })
}

// RUN -----------------------------------------------------------
export const run_cnet = async (p:{
    //
    flow: Runtime,
    opts: OutputFor<typeof ui_cnet>,
    positive: _CONDITIONING
}) => {
    const graph = p.flow.nodes

    // CNET APPLY
    let cnetApply: ControlNetApply = graph.ControlNetApply({conditioning: p.positive, control_net: graph.ControlNetLoader({control_net_name:p.opts.cnet_model_name}),
                    image: (p.opts.preprocessor)
                    ?await(run_preprocessor_OpenPose({flow:p.flow,opts:p.opts.preprocessor.cnet_preprocessor,original_image:p.opts.image}))
                    :await p.flow.loadImageAnswer(p.opts.image),
                    strength: p.opts.strength,})    
   
    let positive:_CONDITIONING = cnetApply._CONDITIONING
    return { positive }
}
