// @ts-nocheck
import { CustomView_Model } from '../_views/View_3d_MTL_OBJ'

app({
    metadata: {
        name: '3d model from single image',
    },
    ui: (ui) => ({
        img: ui.image({}),
    }),

    run: async (run, ui) => {
        const graph = run.nodes
        const triplane_Gaussian_Transformers = graph.$$5BComfy3D$$5D_Load_Triplane_Gaussian_Transformers({
            model_name: 'model_lvis_rel.ckpt',
        })
        const image = await ui.img.loadInWorkflow()
        const mask = graph.InvertMask({ mask: image })
        const preview_3DGS = graph.$$5BComfy3D$$5D_Preview_3DGS({ gs_file_path: '' })
        const triplane_Gaussian_Transformers1 = graph.$$5BComfy3D$$5D_Triplane_Gaussian_Transformers({
            cam_dist: 1.9000000000000001,
            reference_image: image,
            reference_mask: mask,
            tgs_model: triplane_Gaussian_Transformers,
        })
        const switch_3DGS_Axis = graph.$$5BComfy3D$$5D_Switch_3DGS_Axis({
            axis_x_to: '-y',
            axis_y_to: '+z',
            axis_z_to: '-x',
            gs_ply: triplane_Gaussian_Transformers1,
        })
        const BASE_NAME = `MeshTest\\3DGS_Picacho` + Date.now()
        const save_3DGS = graph.$$5BComfy3D$$5D_Save_3DGS({ save_path: BASE_NAME + '.ply', gs_ply: switch_3DGS_Axis })
        const preview_3DMesh = graph.$$5BComfy3D$$5D_Preview_3DMesh({ mesh_file_path: '' })
        const impactFloat = graph.ImpactFloat({ value: 49.1 })
        const switch_3DGS_Axis1 = graph.$$5BComfy3D$$5D_Switch_3DGS_Axis({
            axis_x_to: '+x',
            axis_y_to: '-y',
            axis_z_to: '-z',
            gs_ply: switch_3DGS_Axis,
        })
        const convert_3DGS_to_Mesh_with_NeRF_and_Marching_Cubes =
            graph.$$5BComfy3D$$5D_Convert_3DGS_to_Mesh_with_NeRF_and_Marching_Cubes({
                gs_config: 'big',
                force_cuda_rast: false,
                gs_ply: switch_3DGS_Axis1,
            })
        const save_3D_Mesh = graph.$$5BComfy3D$$5D_Save_3D_Mesh({
            save_path: BASE_NAME + '.obj',
            mesh: convert_3DGS_to_Mesh_with_NeRF_and_Marching_Cubes,
        })
        await run.PROMPT()

        // http://192.168.1.19:8188/extensions/ComfyUI-3D-Pack/html/viewfile?filepath=C%3A%5CUsers%5Cuser%5CDownloads%5Ccomfy_FULL%5CComfyUI%5Coutput%5CMeshTest%2F3DMesh_Picacho_albedo.png
        const urlToFile = (suffix: string) => {
            const path = run.Hosts.main.data.absolutePathToComfyUI + '\\output\\' + suffix
            const pathEncoded = encodeURIComponent(path)
            const url = run.Hosts.main.getServerHostHTTP() + '/extensions/ComfyUI-3D-Pack/html/viewfile?filepath=' + pathEncoded
            return url
        }

        const url1 = urlToFile(BASE_NAME + `.obj`)
        run.output_Markdown(`Download the 3D mesh [here](${url1})\n-  ${url1}`)
        const url2 = urlToFile(BASE_NAME + `_albedo.png`)
        run.output_Markdown(`Download the image [here](${url2})\n-  ${url2}\n![image](${url2})`)
        const url3 = urlToFile(BASE_NAME + `.mtl`)
        run.output_Markdown(`Download the mtl: ${url3}`)

        run.output_custom({
            params: { url1, url2, url3 },
            view: CustomView_Model,
        })
    },
})
