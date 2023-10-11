action('2023-10-08-bb-workflow.json', {
    author: 'notworking',
    ui: (ui) => ({
        'Text Multiline_text': ui.string({ default: ' , (pregnant):1.2, 9 months, big belly,' }) /* STRING */,
        ControlNetLoader_control_net_name: ui.enum({
            default: 'control_openpose-fp16.safetensors',
            enumName: 'Enum_ControlNetLoader_control_net_name',
        }) /* Enum_ControlNetLoader_control_net_name */,
        'Text Multiline_text_1': ui.string({ default: 'female, futa, male\nadult, teen' }) /* STRING */,
        Text_Text: ui.string({ default: 'female,' }) /* STRING */,
        Text_Text_1: ui.string({ default: 'Elf,' }) /* STRING */,
        'Logic Boolean_boolean_number': ui.number({ default: 0 }) /* INT */,
        'Logic Boolean_boolean_number_1': ui.number({ default: 0 }) /* INT */,
        'Text box_Text': ui.string({
            default:
                'options   Ma Fe Fu\n\n0,0 Female\n1,0 Male\nx,1 Futa\n\n1: TitsS  o  x  x\n2: AssS   o  x  x\n3: PenisS x  o  x\n',
        }) /* STRING */,
        Text_Text_2: ui.string({ default: 'male,' }) /* STRING */,
        Text_Text_3: ui.string({ default: 'female,' }) /* STRING */,
        Text_Text_4: ui.string({ default: 'futa,' }) /* STRING */,
        'Random Number_number_type': ui.enum({
            default: 'integer',
            enumName: 'Enum_Constant_Number_number_type',
        }) /* Enum_Constant_Number_number_type */,
        'Random Number_minimum': ui.number({ default: 2 }) /* FLOAT */,
        'Random Number_maximum': ui.number({ default: 12 }) /* FLOAT */,
        'Random Number_seed': ui.number({ default: 591919907495794 }) /* INT */,
        'Random Number_number_type_1': ui.enum({
            default: 'integer',
            enumName: 'Enum_Constant_Number_number_type',
        }) /* Enum_Constant_Number_number_type */,
        'Random Number_minimum_1': ui.number({ default: 2 }) /* FLOAT */,
        'Random Number_maximum_1': ui.number({ default: 10 }) /* FLOAT */,
        'Random Number_seed_1': ui.number({ default: 88816323765752 }) /* INT */,
        'Text Concatenate_linebreak_addition': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Text Find and Replace_find': ui.string({ default: ',' }) /* STRING */,
        'Text Find and Replace_replace': ui.string({ default: '/' }) /* STRING */,
        'Text box_Text_1': ui.string({ default: 'fairy ears, pointy ears, (fairy wing):1.2' }) /* STRING */,
        'Text box_Text_2': ui.string({ default: 'elf ears, pointy ears, body and face same skin color, ' }) /* STRING */,
        'Text box_Text_3': ui.string({
            default:
                '(loli:1.3), (child:1.3), face different color then body, animal ears, cat ears, fox ears, dog ears,  super long hair, long hair, transparent clothes,',
        }) /* STRING */,
        'Text box_Text_4': ui.string({
            default:
                'nsfw, blur,k detailed background, body part obscure, worst quality,  cropped, under saturation, oversaturation, thick lips, overexposure, heels, shoes, sneakers, 2girls, big lips, showing back, showing butt, back to viewer, holding clothes, multiple arms, multiple hands,  Deformed, blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, blurry, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, mutated hands and fingers, out of frame, cowboy clothes, cowboy hat, cowboy theme, hands, 2 navels,',
        }) /* STRING */,
        'Text Concatenate_linebreak_addition_1': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Text box_Text_5': ui.string({ default: ' casual clothes, sfw, ' }) /* STRING */,
        'Text box_Text_6': ui.string({
            default:
                'detail eyes, detail face, sharp body, sharp outline, white background, simple background, masterpiece, best quality, detailed, character lighting, character portrait body, detailed eyes, detailed body, full body, ',
        }) /* STRING */,
        'Text box_Text_7': ui.string({ default: ' , (pregnant):1.2 9 months, big belly,' }) /* STRING */,
        Text_Text_5: ui.string({ default: '(clothes):1.2' }) /* STRING */,
        'Logic Boolean_boolean_number_2': ui.number({ default: 0 }) /* INT */,
        'Logic Boolean_boolean_number_3': ui.number({ default: 0 }) /* INT */,
        'Logic Boolean_boolean_number_4': ui.number({ default: 0 }) /* INT */,
        ControlNetLoader_control_net_name_1: ui.enum({
            default: 'control_v11p_sd15_softedge_fp16.safetensors',
            enumName: 'Enum_ControlNetLoader_control_net_name',
        }) /* Enum_ControlNetLoader_control_net_name */,
        'Constant Number_number_type': ui.enum({
            default: 'float',
            enumName: 'Enum_Constant_Number_number_type',
        }) /* Enum_Constant_Number_number_type */,
        'Constant Number_number': ui.number({ default: 1 }) /* FLOAT */,
        'Constant Number_number_type_1': ui.enum({
            default: 'float',
            enumName: 'Enum_Constant_Number_number_type',
        }) /* Enum_Constant_Number_number_type */,
        'Constant Number_number_1': ui.number({ default: 1.5 }) /* FLOAT */,
        'Constant Number_number_type_2': ui.enum({
            default: 'integer',
            enumName: 'Enum_Constant_Number_number_type',
        }) /* Enum_Constant_Number_number_type */,
        'Constant Number_number_2': ui.number({ default: 16 }) /* FLOAT */,
        'Constant Number_number_type_3': ui.enum({
            default: 'float',
            enumName: 'Enum_Constant_Number_number_type',
        }) /* Enum_Constant_Number_number_type */,
        'Constant Number_number_3': ui.number({ default: 128 }) /* FLOAT */,
        'Constant Number_number_type_4': ui.enum({
            default: 'integer',
            enumName: 'Enum_Constant_Number_number_type',
        }) /* Enum_Constant_Number_number_type */,
        'Constant Number_number_4': ui.number({ default: 256 }) /* FLOAT */,
        Text_Text_6: ui.string({ default: 'male,' }) /* STRING */,
        'Text Compare_mode': ui.enum({ default: 'similarity', enumName: 'Enum_Text_Compare_mode' }) /* Enum_Text_Compare_mode */,
        'Text Compare_tolerance': ui.number({ default: 0 }) /* FLOAT */,
        Text_Text_7: ui.string({ default: 'futa,' }) /* STRING */,
        'Text Compare_mode_1': ui.enum({
            default: 'similarity',
            enumName: 'Enum_Text_Compare_mode',
        }) /* Enum_Text_Compare_mode */,
        'Text Compare_tolerance_1': ui.number({ default: 0 }) /* FLOAT */,
        'Text Compare_mode_2': ui.enum({
            default: 'similarity',
            enumName: 'Enum_Text_Compare_mode',
        }) /* Enum_Text_Compare_mode */,
        'Text Compare_tolerance_2': ui.number({ default: 0 }) /* FLOAT */,
        Text_Text_8: ui.string({ default: '0' }) /* STRING */,
        'Text Compare_mode_3': ui.enum({
            default: 'similarity',
            enumName: 'Enum_Text_Compare_mode',
        }) /* Enum_Text_Compare_mode */,
        'Text Compare_tolerance_3': ui.number({ default: 0 }) /* FLOAT */,
        Integer_Value: ui.number({ default: 85 }) /* FLOAT */,
        Float_Value: ui.number({ default: 0.8 }) /* FLOAT */,
        'ttN seed_seed': ui.number({ default: 868746008624207 }) /* INT */,
        SAMLoader_model_name: ui.enum({
            default: 'sam_vit_b_01ec64.pth',
            enumName: 'Enum_SAMLoader_model_name',
        }) /* Enum_SAMLoader_model_name */,
        SAMLoader_device_mode: ui.enum({
            default: 'AUTO',
            enumName: 'Enum_SAMLoader_device_mode',
        }) /* Enum_SAMLoader_device_mode */,
        'Text Find and Replace_find_1': ui.string({ default: '' }) /* STRING */,
        'Text Find and Replace_replace_1': ui.string({ default: '' }) /* STRING */,
        'Evaluate Strings_python_expression': ui.string({ default: 'a + b + ", " + a + c + ", "' }) /* STRING */,
        'Evaluate Strings_print_to_console': ui.enum({
            default: 'False',
            enumName: 'Enum_ttN_xyPlot_output_individuals',
        }) /* Enum_ttN_xyPlot_output_individuals */,
        'Evaluate Strings_b': ui.stringOpt({ default: ' face structure' }) /* STRING */,
        'Evaluate Strings_c': ui.stringOpt({ default: ' body structure' }) /* STRING */,
        'Text Concatenate_linebreak_addition_2': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Text box_Text_8': ui.string({
            default:
                "var humanoid_races_array = ['Human','Elf','Dark Elf','Tribal Elf','Orc','Ogre','Giant','Gnome','Goblin','Kobold','Demon','Dragonkin']\n\nvar uncommon_races_array = ['Fairy','Seraph','Dryad','Lamia','Harpy','Arachna','Nereid','Scylla','Lizardfolk','Avali']\n\nvar beast_races_array = ['Centaur','Taurus','Gnoll','Beastkin Cat','Beastkin Fox','Beastkin Wolf','Beastkin Bunny','Beastkin Tanuki','Halfkin Cat','Halfkin Fox','Halfkin Wolf','Halfkin Bunny','Halfkin Tanuki','Beastkin Mouse','Halfkin Mouse','Beastkin Squirrel','Halfkin Squirrel','Beastkin Otter','Halfkin Otter','Beastkin Bird','Halfkin Bird',]\n\nvar magic_races_array = ['Slime']",
        }) /* STRING */,
        Text_Text_9: ui.string({ default: 'female,' }) /* STRING */,
        'Text Compare_mode_4': ui.enum({
            default: 'similarity',
            enumName: 'Enum_Text_Compare_mode',
        }) /* Enum_Text_Compare_mode */,
        'Text Compare_tolerance_4': ui.number({ default: 0 }) /* FLOAT */,
        Text_Text_10: ui.string({ default: '' }) /* STRING */,
        'Text Concatenate_linebreak_addition_3': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Text Concatenate_linebreak_addition_4': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        Integer_Value_1: ui.number({ default: 512 }) /* FLOAT */,
        Integer_Value_2: ui.number({ default: 768 }) /* FLOAT */,
        EmptyLatentImage_batch_size: ui.number({ default: 1 }) /* INT */,
        LatentUpscaleBy_upscale_method: ui.enum({
            default: 'bilinear',
            enumName: 'Enum_LatentUpscale_upscale_method',
        }) /* Enum_LatentUpscale_upscale_method */,
        'Get latent size_original': ui.enum({
            default: false,
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Int debug print_Prefix': ui.string({ default: 'plok' }) /* STRING */,
        VAELoader_vae_name: ui.enum({
            default: 'kl-f8-anime2.ckpt',
            enumName: 'Enum_VAELoader_vae_name',
        }) /* Enum_VAELoader_vae_name */,
        'Constant Number_number_type_5': ui.enum({
            default: 'float',
            enumName: 'Enum_Constant_Number_number_type',
        }) /* Enum_Constant_Number_number_type */,
        'Constant Number_number_5': ui.number({ default: 1 }) /* FLOAT */,
        ControlNetLoader_control_net_name_2: ui.enum({
            default: 'control_v11u_sd15_tile.pth',
            enumName: 'Enum_ControlNetLoader_control_net_name',
        }) /* Enum_ControlNetLoader_control_net_name */,
        UltralyticsDetectorProvider_model_name: ui.enum({
            default: 'bbox/face_yolov8m.pt',
            enumName: 'Enum_UltralyticsDetectorProvider_model_name',
        }) /* Enum_UltralyticsDetectorProvider_model_name */,
        CLIPSetLastLayer_stop_at_clip_layer: ui.number({ default: -1 }) /* INT */,
        'ttN textDebug_print_to_console': ui.enum({
            default: false,
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'ttN textDebug_console_title': ui.string({ default: '' }) /* STRING */,
        'ttN textDebug_execute': ui.enum({
            default: 'Always',
            enumName: 'Enum_ttN_textDebug_execute',
        }) /* Enum_ttN_textDebug_execute */,
        'ttN textDebug_print_to_console_1': ui.enum({
            default: false,
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'ttN textDebug_console_title_1': ui.string({ default: '' }) /* STRING */,
        'ttN textDebug_execute_1': ui.enum({
            default: 'Always',
            enumName: 'Enum_ttN_textDebug_execute',
        }) /* Enum_ttN_textDebug_execute */,
        'ttN textDebug_print_to_console_2': ui.enum({
            default: false,
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'ttN textDebug_console_title_2': ui.string({ default: '' }) /* STRING */,
        'ttN textDebug_execute_2': ui.enum({
            default: 'Always',
            enumName: 'Enum_ttN_textDebug_execute',
        }) /* Enum_ttN_textDebug_execute */,
        'ttN textDebug_print_to_console_3': ui.enum({
            default: false,
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'ttN textDebug_console_title_3': ui.string({ default: '' }) /* STRING */,
        'ttN textDebug_execute_3': ui.enum({
            default: 'Always',
            enumName: 'Enum_ttN_textDebug_execute',
        }) /* Enum_ttN_textDebug_execute */,
        'ttN textDebug_print_to_console_4': ui.enum({
            default: false,
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'ttN textDebug_console_title_4': ui.string({ default: '' }) /* STRING */,
        'ttN textDebug_execute_4': ui.enum({
            default: 'Always',
            enumName: 'Enum_ttN_textDebug_execute',
        }) /* Enum_ttN_textDebug_execute */,
        CheckpointLoaderSimple_ckpt_name: ui.enum({
            default: 'revAnimated_v122.safetensors',
            enumName: 'Enum_CheckpointLoaderSimple_ckpt_name',
        }) /* Enum_CheckpointLoaderSimple_ckpt_name */,
        'LoraLoader|pysssss_lora_name': ui.enum({
            default: null,
            enumName: 'Enum_LoraLoader_lora_name',
        }) /* Enum_LoraLoader_lora_name */,
        'LoraLoader|pysssss_strength_model': ui.number({ default: 1 }) /* FLOAT */,
        'LoraLoader|pysssss_strength_clip': ui.number({ default: 1 }) /* FLOAT */,
        LoraLoader_lora_name: ui.enum({ default: null, enumName: 'Enum_LoraLoader_lora_name' }) /* Enum_LoraLoader_lora_name */,
        LoraLoader_strength_model: ui.number({ default: 0.52 }) /* FLOAT */,
        LoraLoader_strength_clip: ui.number({ default: 0.6 }) /* FLOAT */,
        'Logic Boolean_boolean_number_5': ui.number({ default: 0 }) /* INT */,
        FreeU_b1: ui.number({ default: 1.1 }) /* FLOAT */,
        FreeU_b2: ui.number({ default: 1.2 }) /* FLOAT */,
        FreeU_s1: ui.number({ default: 0.9 }) /* FLOAT */,
        FreeU_s2: ui.number({ default: 0.2 }) /* FLOAT */,
        'Text box_Text_9': ui.string({
            default: ' (wearing a Grass Green Velvet bust-enhancing bra and tanga):1.2  ',
        }) /* STRING */,
        'Text Concatenate_linebreak_addition_5': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Text Concatenate_linebreak_addition_6': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'ttN textDebug_print_to_console_5': ui.enum({
            default: false,
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'ttN textDebug_console_title_5': ui.string({ default: '' }) /* STRING */,
        'ttN textDebug_execute_5': ui.enum({
            default: 'Always',
            enumName: 'Enum_ttN_textDebug_execute',
        }) /* Enum_ttN_textDebug_execute */,
        CLIPTextEncode_text: ui.string({ default: 'sfw, casual clothes, medium breasts' }) /* STRING */,
        LoadImage_image: ui.image({ default: 'upload (102).png' }) /* Enum_LoadImage_image */,
        'Image Resize_mode': ui.enum({
            default: 'rescale',
            enumName: 'Enum_CR_Upscale_Image_mode',
        }) /* Enum_CR_Upscale_Image_mode */,
        'Image Resize_supersample': ui.enum({
            default: 'true',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Resize_resampling': ui.enum({
            default: 'lanczos',
            enumName: 'Enum_CR_Upscale_Image_resampling_method',
        }) /* Enum_CR_Upscale_Image_resampling_method */,
        'Image Resize_resize_width': ui.number({ default: 1024 }) /* INT */,
        'Image Resize_resize_height': ui.number({ default: 1536 }) /* INT */,
        'Image Blank_red': ui.number({ default: 0 }) /* INT */,
        'Image Blank_green': ui.number({ default: 0 }) /* INT */,
        'Image Blank_blue': ui.number({ default: 0 }) /* INT */,
        'Image Paste Crop by Location_crop_blending': ui.number({ default: 0.25 }) /* FLOAT */,
        'Image Paste Crop by Location_crop_sharpening': ui.number({ default: 0 }) /* INT */,
        ControlNetApply_strength: ui.number({ default: 0.8999999999999999 }) /* FLOAT */,
        ControlNetApplyAdvanced_strength: ui.number({ default: 1.53 }) /* FLOAT */,
        ControlNetApplyAdvanced_start_percent: ui.number({ default: 0 }) /* FLOAT */,
        ControlNetApplyAdvanced_end_percent: ui.number({ default: 1 }) /* FLOAT */,
        KSampler_steps: ui.number({ default: 'randomize' }) /* INT */,
        KSampler_cfg: ui.number({ default: 20 }) /* FLOAT */,
        KSampler_sampler_name: ui.enum({ default: 7, enumName: 'Enum_KSampler_sampler_name' }) /* Enum_KSampler_sampler_name */,
        KSampler_scheduler: ui.enum({
            default: 'euler_ancestral',
            enumName: 'Enum_KSampler_scheduler',
        }) /* Enum_KSampler_scheduler */,
        KSampler_denoise: ui.number({ default: 'karras' }) /* FLOAT */,
        KSampler_seed: ui.number({ default: 777355846434126 }) /* INT */,
        ScribblePreprocessor_resolution: ui.numberOpt({ default: 512 }) /* INT */,
        PiDiNetPreprocessor_safe: ui.enum({
            default: 'enable',
            enumName: 'Enum_KSamplerAdvanced_add_noise',
        }) /* Enum_KSamplerAdvanced_add_noise */,
        PiDiNetPreprocessor_resolution: ui.numberOpt({ default: 512 }) /* INT */,
        'Image Paste Crop_crop_blending': ui.number({ default: 0.05 }) /* FLOAT */,
        'Image Paste Crop_crop_sharpening': ui.number({ default: 0 }) /* INT */,
        ControlNetApplyAdvanced_strength_1: ui.number({ default: 0.8999999999999999 }) /* FLOAT */,
        ControlNetApplyAdvanced_start_percent_1: ui.number({ default: 0 }) /* FLOAT */,
        ControlNetApplyAdvanced_end_percent_1: ui.number({ default: 1 }) /* FLOAT */,
        ControlNetApplyAdvanced_strength_2: ui.number({ default: 0.8999999999999999 }) /* FLOAT */,
        ControlNetApplyAdvanced_start_percent_2: ui.number({ default: 0 }) /* FLOAT */,
        ControlNetApplyAdvanced_end_percent_2: ui.number({ default: 1 }) /* FLOAT */,
        AnimeLineArtPreprocessor_resolution: ui.numberOpt({ default: 512 }) /* INT */,
        Manga2Anime_LineArt_Preprocessor_resolution: ui.numberOpt({ default: 512 }) /* INT */,
        KSampler_steps_1: ui.number({ default: 'randomize' }) /* INT */,
        KSampler_cfg_1: ui.number({ default: 20 }) /* FLOAT */,
        KSampler_sampler_name_1: ui.enum({ default: 7, enumName: 'Enum_KSampler_sampler_name' }) /* Enum_KSampler_sampler_name */,
        KSampler_scheduler_1: ui.enum({
            default: 'euler_ancestral',
            enumName: 'Enum_KSampler_scheduler',
        }) /* Enum_KSampler_scheduler */,
        KSampler_denoise_1: ui.number({ default: 'karras' }) /* FLOAT */,
        KSampler_seed_1: ui.number({ default: 777355846434126 }) /* INT */,
        ColorPreprocessor_resolution: ui.numberOpt({ default: 512 }) /* INT */,
        ControlNetApplyAdvanced_strength_3: ui.number({ default: 0.8 }) /* FLOAT */,
        ControlNetApplyAdvanced_start_percent_3: ui.number({ default: 0 }) /* FLOAT */,
        ControlNetApplyAdvanced_end_percent_3: ui.number({ default: 1 }) /* FLOAT */,
        ControlNetApplyAdvanced_strength_4: ui.number({ default: 0.8 }) /* FLOAT */,
        ControlNetApplyAdvanced_start_percent_4: ui.number({ default: 0 }) /* FLOAT */,
        ControlNetApplyAdvanced_end_percent_4: ui.number({ default: 1 }) /* FLOAT */,
        KSampler_steps_2: ui.number({ default: 'randomize' }) /* INT */,
        KSampler_cfg_2: ui.number({ default: 20 }) /* FLOAT */,
        KSampler_sampler_name_2: ui.enum({ default: 7, enumName: 'Enum_KSampler_sampler_name' }) /* Enum_KSampler_sampler_name */,
        KSampler_scheduler_2: ui.enum({
            default: 'euler_ancestral',
            enumName: 'Enum_KSampler_scheduler',
        }) /* Enum_KSampler_scheduler */,
        KSampler_denoise_2: ui.number({ default: 'karras' }) /* FLOAT */,
        KSampler_seed_2: ui.number({ default: 777355846434126 }) /* INT */,
        ControlNetApplyAdvanced_strength_5: ui.number({ default: 0.8999999999999999 }) /* FLOAT */,
        ControlNetApplyAdvanced_start_percent_5: ui.number({ default: 0 }) /* FLOAT */,
        ControlNetApplyAdvanced_end_percent_5: ui.number({ default: 1 }) /* FLOAT */,
        ControlNetApplyAdvanced_strength_6: ui.number({ default: 0.8 }) /* FLOAT */,
        ControlNetApplyAdvanced_start_percent_6: ui.number({ default: 0 }) /* FLOAT */,
        ControlNetApplyAdvanced_end_percent_6: ui.number({ default: 1 }) /* FLOAT */,
        KSampler_steps_3: ui.number({ default: 'randomize' }) /* INT */,
        KSampler_cfg_3: ui.number({ default: 20 }) /* FLOAT */,
        KSampler_sampler_name_3: ui.enum({ default: 7, enumName: 'Enum_KSampler_sampler_name' }) /* Enum_KSampler_sampler_name */,
        KSampler_scheduler_3: ui.enum({
            default: 'euler_ancestral',
            enumName: 'Enum_KSampler_scheduler',
        }) /* Enum_KSampler_scheduler */,
        KSampler_denoise_3: ui.number({ default: 'karras' }) /* FLOAT */,
        KSampler_seed_3: ui.number({ default: 777355846434126 }) /* INT */,
        FaceDetailer_guide_size: ui.number({ default: 256 }) /* FLOAT */,
        FaceDetailer_guide_size_for: ui.boolean({ default: true }) /* BOOLEAN */,
        FaceDetailer_max_size: ui.number({ default: 768 }) /* FLOAT */,
        FaceDetailer_steps: ui.number({ default: 'randomize' }) /* INT */,
        FaceDetailer_cfg: ui.number({ default: 20 }) /* FLOAT */,
        FaceDetailer_sampler_name: ui.enum({
            default: 8,
            enumName: 'Enum_KSampler_sampler_name',
        }) /* Enum_KSampler_sampler_name */,
        FaceDetailer_scheduler: ui.enum({
            default: 'euler_ancestral',
            enumName: 'Enum_KSampler_scheduler',
        }) /* Enum_KSampler_scheduler */,
        FaceDetailer_feather: ui.number({ default: 0.52 }) /* INT */,
        FaceDetailer_noise_mask: ui.boolean({ default: 5 }) /* BOOLEAN */,
        FaceDetailer_force_inpaint: ui.boolean({ default: true }) /* BOOLEAN */,
        FaceDetailer_bbox_threshold: ui.number({ default: true }) /* FLOAT */,
        FaceDetailer_bbox_dilation: ui.number({ default: 0.5 }) /* INT */,
        FaceDetailer_bbox_crop_factor: ui.number({ default: 10 }) /* FLOAT */,
        FaceDetailer_sam_detection_hint: ui.enum({
            default: 3,
            enumName: 'Enum_SAMDetectorCombined_detection_hint',
        }) /* Enum_SAMDetectorCombined_detection_hint */,
        FaceDetailer_sam_dilation: ui.number({ default: 'center-1' }) /* INT */,
        FaceDetailer_sam_threshold: ui.number({ default: 0 }) /* FLOAT */,
        FaceDetailer_sam_bbox_expansion: ui.number({ default: 0.93 }) /* INT */,
        FaceDetailer_sam_mask_hint_threshold: ui.number({ default: 0 }) /* FLOAT */,
        FaceDetailer_sam_mask_hint_use_negative: ui.enum({
            default: 0.7,
            enumName: 'Enum_SAMDetectorCombined_mask_hint_use_negative',
        }) /* Enum_SAMDetectorCombined_mask_hint_use_negative */,
        FaceDetailer_drop_size: ui.number({ default: 'False' }) /* INT */,
        FaceDetailer_wildcard: ui.string({ default: 10 }) /* STRING */,
        FaceDetailer_detailer_hook: undefined /* DETAILER_HOOK */,
        FaceDetailer_denoise: ui.number({ default: 0.52 }) /* FLOAT */,
        FaceDetailerPipe_guide_size: ui.number({ default: 256 }) /* FLOAT */,
        FaceDetailerPipe_guide_size_for: ui.boolean({ default: true }) /* BOOLEAN */,
        FaceDetailerPipe_max_size: ui.number({ default: 768 }) /* FLOAT */,
        FaceDetailerPipe_steps: ui.number({ default: 'randomize' }) /* INT */,
        FaceDetailerPipe_cfg: ui.number({ default: 20 }) /* FLOAT */,
        FaceDetailerPipe_sampler_name: ui.enum({
            default: 8,
            enumName: 'Enum_KSampler_sampler_name',
        }) /* Enum_KSampler_sampler_name */,
        FaceDetailerPipe_scheduler: ui.enum({
            default: 'euler_ancestral',
            enumName: 'Enum_KSampler_scheduler',
        }) /* Enum_KSampler_scheduler */,
        FaceDetailerPipe_feather: ui.number({ default: 0.52 }) /* INT */,
        FaceDetailerPipe_noise_mask: ui.boolean({ default: 5 }) /* BOOLEAN */,
        FaceDetailerPipe_force_inpaint: ui.boolean({ default: true }) /* BOOLEAN */,
        FaceDetailerPipe_bbox_threshold: ui.number({ default: false }) /* FLOAT */,
        FaceDetailerPipe_bbox_dilation: ui.number({ default: 0.5 }) /* INT */,
        FaceDetailerPipe_bbox_crop_factor: ui.number({ default: 10 }) /* FLOAT */,
        FaceDetailerPipe_sam_detection_hint: ui.enum({
            default: 3,
            enumName: 'Enum_SAMDetectorCombined_detection_hint',
        }) /* Enum_SAMDetectorCombined_detection_hint */,
        FaceDetailerPipe_sam_dilation: ui.number({ default: 'center-1' }) /* INT */,
        FaceDetailerPipe_sam_threshold: ui.number({ default: 0 }) /* FLOAT */,
        FaceDetailerPipe_sam_bbox_expansion: ui.number({ default: 0.93 }) /* INT */,
        FaceDetailerPipe_sam_mask_hint_threshold: ui.number({ default: 0 }) /* FLOAT */,
        FaceDetailerPipe_sam_mask_hint_use_negative: ui.enum({
            default: 0.7,
            enumName: 'Enum_SAMDetectorCombined_mask_hint_use_negative',
        }) /* Enum_SAMDetectorCombined_mask_hint_use_negative */,
        FaceDetailerPipe_drop_size: ui.number({ default: 'False' }) /* INT */,
        FaceDetailerPipe_refiner_ratio: ui.number({ default: 10 }) /* FLOAT */,
        FaceDetailerPipe_denoise: ui.number({ default: 0.52 }) /* FLOAT */,
        'Image Rembg (Remove Background)_transparency': ui.boolean({ default: true }) /* BOOLEAN */,
        'Image Rembg (Remove Background)_model': ui.enum({
            default: 'isnet-anime',
            enumName: 'Enum_Image_Rembg_$1Remove_Background$2_model',
        }) /* Enum_Image_Rembg_$1Remove_Background$2_model */,
        'Image Rembg (Remove Background)_post_processing': ui.boolean({ default: false }) /* BOOLEAN */,
        'Image Rembg (Remove Background)_only_mask': ui.boolean({ default: false }) /* BOOLEAN */,
        'Image Rembg (Remove Background)_alpha_matting': ui.boolean({ default: false }) /* BOOLEAN */,
        'Image Rembg (Remove Background)_alpha_matting_foreground_threshold': ui.number({ default: 240 }) /* INT */,
        'Image Rembg (Remove Background)_alpha_matting_background_threshold': ui.number({ default: 10 }) /* INT */,
        'Image Rembg (Remove Background)_alpha_matting_erode_size': ui.number({ default: 10 }) /* INT */,
        'Image Rembg (Remove Background)_background_color': ui.enum({
            default: 'none',
            enumName: 'Enum_Image_Rembg_$1Remove_Background$2_background_color',
        }) /* Enum_Image_Rembg_$1Remove_Background$2_background_color */,
        FaceDetailerPipe_guide_size_1: ui.number({ default: 256 }) /* FLOAT */,
        FaceDetailerPipe_guide_size_for_1: ui.boolean({ default: true }) /* BOOLEAN */,
        FaceDetailerPipe_max_size_1: ui.number({ default: 768 }) /* FLOAT */,
        FaceDetailerPipe_steps_1: ui.number({ default: 'randomize' }) /* INT */,
        FaceDetailerPipe_cfg_1: ui.number({ default: 20 }) /* FLOAT */,
        FaceDetailerPipe_sampler_name_1: ui.enum({
            default: 8,
            enumName: 'Enum_KSampler_sampler_name',
        }) /* Enum_KSampler_sampler_name */,
        FaceDetailerPipe_scheduler_1: ui.enum({
            default: 'euler_ancestral',
            enumName: 'Enum_KSampler_scheduler',
        }) /* Enum_KSampler_scheduler */,
        FaceDetailerPipe_feather_1: ui.number({ default: 0.52 }) /* INT */,
        FaceDetailerPipe_noise_mask_1: ui.boolean({ default: 5 }) /* BOOLEAN */,
        FaceDetailerPipe_force_inpaint_1: ui.boolean({ default: true }) /* BOOLEAN */,
        FaceDetailerPipe_bbox_threshold_1: ui.number({ default: false }) /* FLOAT */,
        FaceDetailerPipe_bbox_dilation_1: ui.number({ default: 0.5 }) /* INT */,
        FaceDetailerPipe_bbox_crop_factor_1: ui.number({ default: 10 }) /* FLOAT */,
        FaceDetailerPipe_sam_detection_hint_1: ui.enum({
            default: 3,
            enumName: 'Enum_SAMDetectorCombined_detection_hint',
        }) /* Enum_SAMDetectorCombined_detection_hint */,
        FaceDetailerPipe_sam_dilation_1: ui.number({ default: 'center-1' }) /* INT */,
        FaceDetailerPipe_sam_threshold_1: ui.number({ default: 0 }) /* FLOAT */,
        FaceDetailerPipe_sam_bbox_expansion_1: ui.number({ default: 0.93 }) /* INT */,
        FaceDetailerPipe_sam_mask_hint_threshold_1: ui.number({ default: 0 }) /* FLOAT */,
        FaceDetailerPipe_sam_mask_hint_use_negative_1: ui.enum({
            default: 0.7,
            enumName: 'Enum_SAMDetectorCombined_mask_hint_use_negative',
        }) /* Enum_SAMDetectorCombined_mask_hint_use_negative */,
        FaceDetailerPipe_drop_size_1: ui.number({ default: 'False' }) /* INT */,
        FaceDetailerPipe_refiner_ratio_1: ui.number({ default: 10 }) /* FLOAT */,
        FaceDetailerPipe_denoise_1: ui.number({ default: 0.52 }) /* FLOAT */,
        FaceDetailerPipe_guide_size_2: ui.number({ default: 256 }) /* FLOAT */,
        FaceDetailerPipe_guide_size_for_2: ui.boolean({ default: true }) /* BOOLEAN */,
        FaceDetailerPipe_max_size_2: ui.number({ default: 768 }) /* FLOAT */,
        FaceDetailerPipe_steps_2: ui.number({ default: 'randomize' }) /* INT */,
        FaceDetailerPipe_cfg_2: ui.number({ default: 20 }) /* FLOAT */,
        FaceDetailerPipe_sampler_name_2: ui.enum({
            default: 8,
            enumName: 'Enum_KSampler_sampler_name',
        }) /* Enum_KSampler_sampler_name */,
        FaceDetailerPipe_scheduler_2: ui.enum({
            default: 'euler_ancestral',
            enumName: 'Enum_KSampler_scheduler',
        }) /* Enum_KSampler_scheduler */,
        FaceDetailerPipe_feather_2: ui.number({ default: 0.52 }) /* INT */,
        FaceDetailerPipe_noise_mask_2: ui.boolean({ default: 5 }) /* BOOLEAN */,
        FaceDetailerPipe_force_inpaint_2: ui.boolean({ default: true }) /* BOOLEAN */,
        FaceDetailerPipe_bbox_threshold_2: ui.number({ default: false }) /* FLOAT */,
        FaceDetailerPipe_bbox_dilation_2: ui.number({ default: 0.5 }) /* INT */,
        FaceDetailerPipe_bbox_crop_factor_2: ui.number({ default: 10 }) /* FLOAT */,
        FaceDetailerPipe_sam_detection_hint_2: ui.enum({
            default: 3,
            enumName: 'Enum_SAMDetectorCombined_detection_hint',
        }) /* Enum_SAMDetectorCombined_detection_hint */,
        FaceDetailerPipe_sam_dilation_2: ui.number({ default: 'center-1' }) /* INT */,
        FaceDetailerPipe_sam_threshold_2: ui.number({ default: 0 }) /* FLOAT */,
        FaceDetailerPipe_sam_bbox_expansion_2: ui.number({ default: 0.93 }) /* INT */,
        FaceDetailerPipe_sam_mask_hint_threshold_2: ui.number({ default: 0 }) /* FLOAT */,
        FaceDetailerPipe_sam_mask_hint_use_negative_2: ui.enum({
            default: 0.7,
            enumName: 'Enum_SAMDetectorCombined_mask_hint_use_negative',
        }) /* Enum_SAMDetectorCombined_mask_hint_use_negative */,
        FaceDetailerPipe_drop_size_2: ui.number({ default: 'False' }) /* INT */,
        FaceDetailerPipe_refiner_ratio_2: ui.number({ default: 10 }) /* FLOAT */,
        FaceDetailerPipe_denoise_2: ui.number({ default: 0.52 }) /* FLOAT */,
        'Image Rembg (Remove Background)_transparency_1': ui.boolean({ default: true }) /* BOOLEAN */,
        'Image Rembg (Remove Background)_model_1': ui.enum({
            default: 'isnet-anime',
            enumName: 'Enum_Image_Rembg_$1Remove_Background$2_model',
        }) /* Enum_Image_Rembg_$1Remove_Background$2_model */,
        'Image Rembg (Remove Background)_post_processing_1': ui.boolean({ default: false }) /* BOOLEAN */,
        'Image Rembg (Remove Background)_only_mask_1': ui.boolean({ default: false }) /* BOOLEAN */,
        'Image Rembg (Remove Background)_alpha_matting_1': ui.boolean({ default: false }) /* BOOLEAN */,
        'Image Rembg (Remove Background)_alpha_matting_foreground_threshold_1': ui.number({ default: 240 }) /* INT */,
        'Image Rembg (Remove Background)_alpha_matting_background_threshold_1': ui.number({ default: 10 }) /* INT */,
        'Image Rembg (Remove Background)_alpha_matting_erode_size_1': ui.number({ default: 10 }) /* INT */,
        'Image Rembg (Remove Background)_background_color_1': ui.enum({
            default: 'none',
            enumName: 'Enum_Image_Rembg_$1Remove_Background$2_background_color',
        }) /* Enum_Image_Rembg_$1Remove_Background$2_background_color */,
        'Image Rembg (Remove Background)_transparency_2': ui.boolean({ default: true }) /* BOOLEAN */,
        'Image Rembg (Remove Background)_model_2': ui.enum({
            default: 'isnet-anime',
            enumName: 'Enum_Image_Rembg_$1Remove_Background$2_model',
        }) /* Enum_Image_Rembg_$1Remove_Background$2_model */,
        'Image Rembg (Remove Background)_post_processing_2': ui.boolean({ default: false }) /* BOOLEAN */,
        'Image Rembg (Remove Background)_only_mask_2': ui.boolean({ default: false }) /* BOOLEAN */,
        'Image Rembg (Remove Background)_alpha_matting_2': ui.boolean({ default: false }) /* BOOLEAN */,
        'Image Rembg (Remove Background)_alpha_matting_foreground_threshold_2': ui.number({ default: 240 }) /* INT */,
        'Image Rembg (Remove Background)_alpha_matting_background_threshold_2': ui.number({ default: 10 }) /* INT */,
        'Image Rembg (Remove Background)_alpha_matting_erode_size_2': ui.number({ default: 10 }) /* INT */,
        'Image Rembg (Remove Background)_background_color_2': ui.enum({
            default: 'none',
            enumName: 'Enum_Image_Rembg_$1Remove_Background$2_background_color',
        }) /* Enum_Image_Rembg_$1Remove_Background$2_background_color */,
        'Image Rembg (Remove Background)_transparency_3': ui.boolean({ default: true }) /* BOOLEAN */,
        'Image Rembg (Remove Background)_model_3': ui.enum({
            default: 'isnet-anime',
            enumName: 'Enum_Image_Rembg_$1Remove_Background$2_model',
        }) /* Enum_Image_Rembg_$1Remove_Background$2_model */,
        'Image Rembg (Remove Background)_post_processing_3': ui.boolean({ default: false }) /* BOOLEAN */,
        'Image Rembg (Remove Background)_only_mask_3': ui.boolean({ default: false }) /* BOOLEAN */,
        'Image Rembg (Remove Background)_alpha_matting_3': ui.boolean({ default: false }) /* BOOLEAN */,
        'Image Rembg (Remove Background)_alpha_matting_foreground_threshold_3': ui.number({ default: 240 }) /* INT */,
        'Image Rembg (Remove Background)_alpha_matting_background_threshold_3': ui.number({ default: 10 }) /* INT */,
        'Image Rembg (Remove Background)_alpha_matting_erode_size_3': ui.number({ default: 10 }) /* INT */,
        'Image Rembg (Remove Background)_background_color_3': ui.enum({
            default: 'none',
            enumName: 'Enum_Image_Rembg_$1Remove_Background$2_background_color',
        }) /* Enum_Image_Rembg_$1Remove_Background$2_background_color */,
        SaveImage_filename_prefix: ui.string({ default: 'ComfyUI' }) /* STRING */,
        String_value: ui.string({ default: 'wow' }) /* STRING */,
        'Image Save_output_path': ui.string({ default: '[time(%Y-%m-%d)]' }) /* STRING */,
        'Image Save_filename_delimiter': ui.string({ default: '_' }) /* STRING */,
        'Image Save_filename_number_padding': ui.number({ default: 4 }) /* INT */,
        'Image Save_filename_number_start': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_extension': ui.enum({
            default: 'webp',
            enumName: 'Enum_Image_Save_extension',
        }) /* Enum_Image_Save_extension */,
        'Image Save_lossless_webp': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_overwrite_mode': ui.enum({
            default: 'false',
            enumName: 'Enum_Image_Save_overwrite_mode',
        }) /* Enum_Image_Save_overwrite_mode */,
        'Image Save_show_history': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_show_history_by_prefix': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_embed_workflow': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_show_previews': ui.enum({
            default: 'true',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_output_path_1': ui.string({ default: '[time(%Y-%m-%d)]' }) /* STRING */,
        'Image Save_filename_delimiter_1': ui.string({ default: '_' }) /* STRING */,
        'Image Save_filename_number_padding_1': ui.number({ default: 4 }) /* INT */,
        'Image Save_filename_number_start_1': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_extension_1': ui.enum({
            default: 'webp',
            enumName: 'Enum_Image_Save_extension',
        }) /* Enum_Image_Save_extension */,
        'Image Save_lossless_webp_1': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_overwrite_mode_1': ui.enum({
            default: 'false',
            enumName: 'Enum_Image_Save_overwrite_mode',
        }) /* Enum_Image_Save_overwrite_mode */,
        'Image Save_show_history_1': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_show_history_by_prefix_1': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_embed_workflow_1': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_show_previews_1': ui.enum({
            default: 'true',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_output_path_2': ui.string({ default: '[time(%Y-%m-%d)]' }) /* STRING */,
        'Image Save_filename_delimiter_2': ui.string({ default: '_' }) /* STRING */,
        'Image Save_filename_number_padding_2': ui.number({ default: 4 }) /* INT */,
        'Image Save_filename_number_start_2': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_extension_2': ui.enum({
            default: 'webp',
            enumName: 'Enum_Image_Save_extension',
        }) /* Enum_Image_Save_extension */,
        'Image Save_lossless_webp_2': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_overwrite_mode_2': ui.enum({
            default: 'false',
            enumName: 'Enum_Image_Save_overwrite_mode',
        }) /* Enum_Image_Save_overwrite_mode */,
        'Image Save_show_history_2': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_show_history_by_prefix_2': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_embed_workflow_2': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_show_previews_2': ui.enum({
            default: 'true',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_output_path_3': ui.string({ default: '[time(%Y-%m-%d)]' }) /* STRING */,
        'Image Save_filename_delimiter_3': ui.string({ default: '_' }) /* STRING */,
        'Image Save_filename_number_padding_3': ui.number({ default: 4 }) /* INT */,
        'Image Save_filename_number_start_3': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_extension_3': ui.enum({
            default: 'webp',
            enumName: 'Enum_Image_Save_extension',
        }) /* Enum_Image_Save_extension */,
        'Image Save_lossless_webp_3': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_overwrite_mode_3': ui.enum({
            default: 'false',
            enumName: 'Enum_Image_Save_overwrite_mode',
        }) /* Enum_Image_Save_overwrite_mode */,
        'Image Save_show_history_3': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_show_history_by_prefix_3': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_embed_workflow_3': ui.enum({
            default: 'false',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
        'Image Save_show_previews_3': ui.enum({
            default: 'true',
            enumName: 'Enum_ImageDrawRectangleRounded_top_left_corner',
        }) /* Enum_ImageDrawRectangleRounded_top_left_corner */,
    }),

    run: async (flow, p) => {
        const graph = flow.nodes
        const text_Multiline = graph.Text_Multiline({ text: p['Text Multiline_text'] })
        const controlNet = graph.ControlNetLoader({ control_net_name: p.ControlNetLoader_control_net_name })
        const text_Multiline_1 = graph.Text_Multiline({ text: p['Text Multiline_text_1'] })
        const text = graph.Text({ Text: p.Text_Text })
        const text_1 = graph.Text({ Text: p.Text_Text_1 })
        const logic_Boolean = graph.Logic_Boolean({ boolean_number: p['Logic Boolean_boolean_number'] })
        const logic_Boolean_1 = graph.Logic_Boolean({ boolean_number: p['Logic Boolean_boolean_number_1'] })
        const text_box = graph.Text_box({ Text: p['Text box_Text'] })
        const text_2 = graph.Text({ Text: p.Text_Text_2 })
        const text_3 = graph.Text({ Text: p.Text_Text_3 })
        const text_4 = graph.Text({ Text: p.Text_Text_4 })
        const random_Number = graph.Random_Number({
            number_type: p['Random Number_number_type'],
            minimum: p['Random Number_minimum'],
            maximum: p['Random Number_maximum'],
            seed: p['Random Number_seed'],
        })
        const random_Number_1 = graph.Random_Number({
            number_type: p['Random Number_number_type_1'],
            minimum: p['Random Number_minimum_1'],
            maximum: p['Random Number_maximum_1'],
            seed: p['Random Number_seed_1'],
        })
        const text_Input_Switch = graph.Text_Input_Switch({
            text_a: text_2.STRING,
            text_b: text_3.STRING,
            boolean_number: random_Number_1.NUMBER,
        })
        const text_Input_Switch_1 = graph.Text_Input_Switch({
            text_a: text_4.STRING,
            text_b: text_Input_Switch.STRING,
            boolean_number: random_Number.NUMBER,
        })
        const text_Concatenate = graph.Text_Concatenate({
            linebreak_addition: p['Text Concatenate_linebreak_addition'],
            text_a: text_1.STRING,
            text_b: text_Input_Switch_1.STRING,
        })
        const text_Find_and_Replace = graph.Text_Find_and_Replace({
            find: p['Text Find and Replace_find'],
            replace: p['Text Find and Replace_replace'],
            text: text_Concatenate.STRING,
        })
        const text_box_1 = graph.Text_box({ Text: p['Text box_Text_1'] })
        const text_box_2 = graph.Text_box({ Text: p['Text box_Text_2'] })
        const text_box_3 = graph.Text_box({ Text: p['Text box_Text_3'] })
        const text_box_4 = graph.Text_box({ Text: p['Text box_Text_4'] })
        const text_Concatenate_1 = graph.Text_Concatenate({
            linebreak_addition: p['Text Concatenate_linebreak_addition_1'],
            text_a: text_box_3.STRING,
            text_b: text_box_4.STRING,
        })
        const text_box_5 = graph.Text_box({ Text: p['Text box_Text_5'] })
        const text_box_6 = graph.Text_box({ Text: p['Text box_Text_6'] })
        const text_box_7 = graph.Text_box({ Text: p['Text box_Text_7'] })
        const text_5 = graph.Text({ Text: p.Text_Text_5 })
        const logic_Boolean_2 = graph.Logic_Boolean({ boolean_number: p['Logic Boolean_boolean_number_2'] })
        const logic_Boolean_3 = graph.Logic_Boolean({ boolean_number: p['Logic Boolean_boolean_number_3'] })
        const logic_Boolean_4 = graph.Logic_Boolean({ boolean_number: p['Logic Boolean_boolean_number_4'] })
        const controlNet_1 = graph.ControlNetLoader({ control_net_name: p.ControlNetLoader_control_net_name_1 })
        const constant_Number = graph.Constant_Number({
            number_type: p['Constant Number_number_type'],
            number: p['Constant Number_number'],
        })
        const constant_Number_1 = graph.Constant_Number({
            number_type: p['Constant Number_number_type_1'],
            number: p['Constant Number_number_1'],
        })
        const number_Input_Switch = graph.Number_Input_Switch({
            number_a: constant_Number_1.NUMBER,
            number_b: constant_Number.NUMBER,
            boolean_number: logic_Boolean_4.NUMBER,
        })
        const constant_Number_2 = graph.Constant_Number({
            number_type: p['Constant Number_number_type_2'],
            number: p['Constant Number_number_2'],
        })
        const cR_Integer_Multiple = graph.CR_Integer_Multiple({
            multiple: number_Input_Switch.FLOAT,
            integer: constant_Number_2.INT,
        })
        const constant_Number_3 = graph.Constant_Number({
            number_type: p['Constant Number_number_type_3'],
            number: p['Constant Number_number_3'],
        })
        const cR_Integer_Multiple_1 = graph.CR_Integer_Multiple({
            multiple: number_Input_Switch.FLOAT,
            integer: constant_Number_3.INT,
        })
        const constant_Number_4 = graph.Constant_Number({
            number_type: p['Constant Number_number_type_4'],
            number: p['Constant Number_number_4'],
        })
        const sum = graph.Sum({ Value_A: constant_Number_2.FLOAT, Value_B: constant_Number_4.FLOAT })
        const sum_1 = graph.Sum({ Value_A: constant_Number_4.FLOAT, Value_B: constant_Number_3.FLOAT })
        const ttN_float = graph.ttN_float({ float: sum.FLOAT })
        const cR_Integer_Multiple_2 = graph.CR_Integer_Multiple({ multiple: number_Input_Switch.FLOAT, integer: ttN_float.int })
        const ttN_float_1 = graph.ttN_float({ float: sum_1.FLOAT })
        const cR_Integer_Multiple_3 = graph.CR_Integer_Multiple({ multiple: number_Input_Switch.FLOAT, integer: ttN_float_1.int })
        const text_6 = graph.Text({ Text: p.Text_Text_6 })
        const text_Compare = graph.Text_Compare({
            mode: p['Text Compare_mode'],
            tolerance: p['Text Compare_tolerance'],
            text_a: text_6.STRING,
            text_b: text_Input_Switch_1.STRING,
        })
        const number_to_String = graph.Number_to_String({ number: text_Compare.BOOL_NUMBER })
        const text_7 = graph.Text({ Text: p.Text_Text_7 })
        const text_Compare_1 = graph.Text_Compare({
            mode: p['Text Compare_mode_1'],
            tolerance: p['Text Compare_tolerance_1'],
            text_a: text_Input_Switch_1.STRING,
            text_b: text_7.STRING,
        })
        const number_to_String_1 = graph.Number_to_String({ number: text_Compare_1.BOOL_NUMBER })
        const text_Compare_2 = graph.Text_Compare({
            mode: p['Text Compare_mode_2'],
            tolerance: p['Text Compare_tolerance_2'],
            text_a: number_to_String.STRING,
            text_b: number_to_String_1.STRING,
        })
        const number_to_String_2 = graph.Number_to_String({ number: text_Compare_2.BOOL_NUMBER })
        const text_8 = graph.Text({ Text: p.Text_Text_8 })
        const text_Compare_3 = graph.Text_Compare({
            mode: p['Text Compare_mode_3'],
            tolerance: p['Text Compare_tolerance_3'],
            text_a: number_to_String_2.STRING,
            text_b: text_8.STRING,
        })
        const number_to_String_3 = graph.Number_to_String({ number: text_Compare_3.BOOL_NUMBER })
        const integer = graph.Integer({ Value: p.Integer_Value })
        const float = graph.Float({ Value: p.Float_Value })
        const number_to_Float = graph.Number_to_Float({ number: constant_Number_1.NUMBER })
        const ttN_seed = graph.ttN_seed({ seed: p['ttN seed_seed'] })
        const sAM = graph.SAMLoader({ model_name: p.SAMLoader_model_name, device_mode: p.SAMLoader_device_mode })
        const text_Find_and_Replace_1 = graph.Text_Find_and_Replace({
            find: p['Text Find and Replace_find_1'],
            replace: p['Text Find and Replace_replace_1'],
            text: text_Input_Switch_1.STRING,
        })
        const evaluate_Strings = graph.Evaluate_Strings({
            python_expression: p['Evaluate Strings_python_expression'],
            print_to_console: p['Evaluate Strings_print_to_console'],
            b: p['Evaluate Strings_b'],
            c: p['Evaluate Strings_c'],
            a: text_Find_and_Replace_1.result_text,
        })
        const text_Concatenate_2 = graph.Text_Concatenate({
            linebreak_addition: p['Text Concatenate_linebreak_addition_2'],
            text_a: text_box_6.STRING,
            text_b: text_box_2.STRING,
            text_c: evaluate_Strings.STRING,
        })
        const text_box_8 = graph.Text_box({ Text: p['Text box_Text_8'] })
        const text_9 = graph.Text({ Text: p.Text_Text_9 })
        const text_Compare_4 = graph.Text_Compare({
            mode: p['Text Compare_mode_4'],
            tolerance: p['Text Compare_tolerance_4'],
            text_a: text_Input_Switch_1.STRING,
            text_b: text_9.STRING,
        })
        const text_10 = graph.Text({ Text: p.Text_Text_10 })
        const text_Input_Switch_2 = graph.Text_Input_Switch({
            text_a: text_10.STRING,
            text_b: text_10.STRING,
            boolean_number: text_Compare_4.BOOL_NUMBER,
        })
        const text_Concatenate_3 = graph.Text_Concatenate({
            linebreak_addition: p['Text Concatenate_linebreak_addition_3'],
            text_a: text_Input_Switch_2.STRING,
            text_b: text_5.STRING,
        })
        const text_Concatenate_4 = graph.Text_Concatenate({
            linebreak_addition: p['Text Concatenate_linebreak_addition_4'],
            text_a: text_Concatenate_2.STRING,
            text_b: text_box_5.STRING,
            text_c: text_Concatenate_3.STRING,
        })
        const integer_1 = graph.Integer({ Value: p.Integer_Value_1 })
        const integer_2 = graph.Integer({ Value: p.Integer_Value_2 })
        const emptyLatent = graph.EmptyLatentImage({
            batch_size: p.EmptyLatentImage_batch_size,
            width: integer_1.INT,
            height: integer_2.INT,
        })
        const latentUpscaleBy = graph.LatentUpscaleBy({
            upscale_method: p.LatentUpscaleBy_upscale_method,
            samples: emptyLatent.LATENT,
            scale_by: number_to_Float.FLOAT,
        })
        const latent_Input_Switch = graph.Latent_Input_Switch({
            latent_a: latentUpscaleBy.LATENT,
            latent_b: emptyLatent.LATENT,
            boolean_number: logic_Boolean_4.NUMBER,
        })
        const get_latent_size = graph.Get_latent_size({
            original: p['Get latent size_original'],
            latent: latent_Input_Switch.LATENT,
        })
        const int_debug_print = graph.Int_debug_print({ Prefix: p['Int debug print_Prefix'], Value: get_latent_size.INT_1 })
        const vAE = graph.VAELoader({ vae_name: p.VAELoader_vae_name })
        const constant_Number_5 = graph.Constant_Number({
            number_type: p['Constant Number_number_type_5'],
            number: p['Constant Number_number_5'],
        })
        const number_Input_Switch_1 = graph.Number_Input_Switch({
            number_a: constant_Number_1.NUMBER,
            number_b: constant_Number_5.NUMBER,
            boolean_number: logic_Boolean_4.NUMBER,
        })
        const controlNet_2 = graph.ControlNetLoader({ control_net_name: p.ControlNetLoader_control_net_name_2 })
        const ultralyticsDetectorProvider = graph.UltralyticsDetectorProvider({
            model_name: p.UltralyticsDetectorProvider_model_name,
        })
        const cLIPSetLastLayer = graph.CLIPSetLastLayer({ stop_at_clip_layer: p.CLIPSetLastLayer_stop_at_clip_layer })
        const display_Int_$1rgthree$2 = graph.Display_Int_$1rgthree$2({ input: cR_Integer_Multiple_2.INT })
        const display_Int_$1rgthree$2_1 = graph.Display_Int_$1rgthree$2({ input: cR_Integer_Multiple_3.INT })
        const display_Int_$1rgthree$2_2 = graph.Display_Int_$1rgthree$2({ input: cR_Integer_Multiple_1.INT })
        const display_Int_$1rgthree$2_3 = graph.Display_Int_$1rgthree$2({ input: cR_Integer_Multiple.INT })
        const display_Any_$1rgthree$2 = graph.Display_Any_$1rgthree$2({ source: random_Number.FLOAT })
        const display_Any_$1rgthree$2_1 = graph.Display_Any_$1rgthree$2({ source: random_Number_1.FLOAT })
        const display_Any_$1rgthree$2_2 = graph.Display_Any_$1rgthree$2({ source: text_Compare_1.BOOL_NUMBER })
        const display_Any_$1rgthree$2_3 = graph.Display_Any_$1rgthree$2({ source: text_Compare.BOOL_NUMBER })
        const display_Any_$1rgthree$2_4 = graph.Display_Any_$1rgthree$2({ source: text_Input_Switch_1.STRING })
        const showText$8pysssss = graph.ShowText$8pysssss({ text: evaluate_Strings.STRING })
        const ttN_textDebug = graph.ttN_textDebug({
            print_to_console: p['ttN textDebug_print_to_console'],
            console_title: p['ttN textDebug_console_title'],
            execute: p['ttN textDebug_execute'],
            text: text_Concatenate_4.STRING,
        })
        const ttN_textDebug_1 = graph.ttN_textDebug({
            print_to_console: p['ttN textDebug_print_to_console_1'],
            console_title: p['ttN textDebug_console_title_1'],
            execute: p['ttN textDebug_execute_1'],
            text: text_Input_Switch_1.STRING,
        })
        const ttN_textDebug_2 = graph.ttN_textDebug({
            print_to_console: p['ttN textDebug_print_to_console_2'],
            console_title: p['ttN textDebug_console_title_2'],
            execute: p['ttN textDebug_execute_2'],
            text: number_to_String_2.STRING,
        })
        const ttN_textDebug_3 = graph.ttN_textDebug({
            print_to_console: p['ttN textDebug_print_to_console_3'],
            console_title: p['ttN textDebug_console_title_3'],
            execute: p['ttN textDebug_execute_3'],
            text: number_to_String_3.STRING,
        })
        const ttN_textDebug_4 = graph.ttN_textDebug({
            print_to_console: p['ttN textDebug_print_to_console_4'],
            console_title: p['ttN textDebug_console_title_4'],
            execute: p['ttN textDebug_execute_4'],
            text: text_Concatenate_2.STRING,
        })
        const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: p.CheckpointLoaderSimple_ckpt_name })
        const model_Input_Switch = graph.Model_Input_Switch({
            model_a: ckpt.MODEL,
            model_b: ckpt.MODEL,
            boolean_number: text_Compare_3.BOOL_NUMBER,
        })
        const cLIP_Input_Switch = graph.CLIP_Input_Switch({
            clip_a: ckpt.CLIP,
            clip_b: ckpt.CLIP,
            boolean_number: logic_Boolean_4.NUMBER,
        })
        const text_to_Conditioning = graph.Text_to_Conditioning({ clip: cLIP_Input_Switch.CLIP, text: text_Concatenate_1.STRING })
        const text_to_Conditioning_1 = graph.Text_to_Conditioning({
            clip: cLIP_Input_Switch.CLIP,
            text: text_Concatenate_1.STRING,
        })
        const text_to_Conditioning_2 = graph.Text_to_Conditioning({
            clip: cLIP_Input_Switch.CLIP,
            text: text_Concatenate_1.STRING,
        })
        const text_to_Conditioning_3 = graph.Text_to_Conditioning({
            clip: cLIP_Input_Switch.CLIP,
            text: text_Concatenate_4.STRING,
        })
        const loraLoader$8pysssss = graph.LoraLoader$8pysssss({
            lora_name: p['LoraLoader|pysssss_lora_name'],
            strength_model: p['LoraLoader|pysssss_strength_model'],
            strength_clip: p['LoraLoader|pysssss_strength_clip'],
            model: ckpt.MODEL,
            clip: ckpt.CLIP,
        })
        const lora = graph.LoraLoader({
            lora_name: p.LoraLoader_lora_name,
            strength_model: p.LoraLoader_strength_model,
            strength_clip: p.LoraLoader_strength_clip,
            model: loraLoader$8pysssss.MODEL,
            clip: loraLoader$8pysssss.CLIP,
        })
        const logic_Boolean_5 = graph.Logic_Boolean({ boolean_number: p['Logic Boolean_boolean_number_5'] })
        const vAE_Input_Switch = graph.VAE_Input_Switch({
            vae_a: ckpt.VAE,
            vae_b: vAE.VAE,
            boolean_number: logic_Boolean_5.NUMBER,
        })
        const debugInput = graph.DebugInput({ input: vAE_Input_Switch.VAE })
        const freeU = graph.FreeU({
            b1: p.FreeU_b1,
            b2: p.FreeU_b2,
            s1: p.FreeU_s1,
            s2: p.FreeU_s2,
            model: model_Input_Switch.MODEL,
        })
        const text_box_9 = graph.Text_box({ Text: p['Text box_Text_9'] })
        const text_Concatenate_5 = graph.Text_Concatenate({
            linebreak_addition: p['Text Concatenate_linebreak_addition_5'],
            text_a: text_Concatenate_2.STRING,
            text_b: text_box_7.STRING,
            text_c: text_box_9.STRING,
        })
        const text_to_Conditioning_4 = graph.Text_to_Conditioning({
            clip: cLIP_Input_Switch.CLIP,
            text: text_Concatenate_5.STRING,
        })
        const text_Concatenate_6 = graph.Text_Concatenate({
            linebreak_addition: p['Text Concatenate_linebreak_addition_6'],
            text_a: text_Concatenate_2.STRING,
            text_b: text_box_9.STRING,
        })
        const text_to_Conditioning_5 = graph.Text_to_Conditioning({
            clip: cLIP_Input_Switch.CLIP,
            text: text_Concatenate_6.STRING,
        })
        const ttN_textDebug_5 = graph.ttN_textDebug({
            print_to_console: p['ttN textDebug_print_to_console_5'],
            console_title: p['ttN textDebug_console_title_5'],
            execute: p['ttN textDebug_execute_5'],
            text: text_Concatenate_6.STRING,
        })
        const showText$8pysssss_1 = graph.ShowText$8pysssss({ text: text_box_9.STRING })
        const cLIPTextEncode = graph.CLIPTextEncode({ text: p.CLIPTextEncode_text, clip: cLIP_Input_Switch.CLIP })
        const conditioningCombine = graph.ConditioningCombine({
            conditioning_1: cLIPTextEncode.CONDITIONING,
            conditioning_2: text_to_Conditioning_3.CONDITIONING,
        })
        const conditioningCombine_1 = graph.ConditioningCombine({
            conditioning_1: cLIPTextEncode.CONDITIONING,
            conditioning_2: text_to_Conditioning_4.CONDITIONING,
        })
        const conditioningCombine_2 = graph.ConditioningCombine({
            conditioning_1: cLIPTextEncode.CONDITIONING,
            conditioning_2: text_to_Conditioning_5.CONDITIONING,
        })
        const load = graph.LoadImage({ image: await flow.loadImageAnswerAsEnum(p.LoadImage_image) })
        const image_Resize = graph.Image_Resize({
            mode: p['Image Resize_mode'],
            supersample: p['Image Resize_supersample'],
            resampling: p['Image Resize_resampling'],
            resize_width: p['Image Resize_resize_width'],
            resize_height: p['Image Resize_resize_height'],
            image: load.IMAGE,
            rescale_factor: number_Input_Switch_1.FLOAT,
        })
        const preview = graph.PreviewImage({ images: image_Resize.IMAGE })
        const image_Size_to_Number = graph.Image_Size_to_Number({ image: image_Resize.IMAGE })
        const image_Blank = graph.Image_Blank({
            red: p['Image Blank_red'],
            green: p['Image Blank_green'],
            blue: p['Image Blank_blue'],
            width: image_Size_to_Number.width_int,
            height: image_Size_to_Number.height_int,
        })
        const image_Crop_Location = graph.Image_Crop_Location({
            image: image_Resize.IMAGE,
            top: cR_Integer_Multiple.INT,
            left: cR_Integer_Multiple_1.INT,
            right: cR_Integer_Multiple_3.INT,
            bottom: cR_Integer_Multiple_2.INT,
        })
        const image_Paste_Crop_by_Location = graph.Image_Paste_Crop_by_Location({
            crop_blending: p['Image Paste Crop by Location_crop_blending'],
            crop_sharpening: p['Image Paste Crop by Location_crop_sharpening'],
            image: image_Blank.IMAGE,
            crop_image: image_Crop_Location.IMAGE,
            top: cR_Integer_Multiple.INT,
            left: cR_Integer_Multiple_1.INT,
            right: cR_Integer_Multiple_3.INT,
            bottom: cR_Integer_Multiple_2.INT,
        })
        const controlNetApply = graph.ControlNetApply({
            strength: p.ControlNetApply_strength,
            conditioning: conditioningCombine.CONDITIONING,
            control_net: controlNet.CONTROL_NET,
            image: image_Paste_Crop_by_Location.IMAGE,
        })
        const preview_1 = graph.PreviewImage({ images: image_Paste_Crop_by_Location.IMAGE })
        const controlNetApplyAdvanced = graph.ControlNetApplyAdvanced({
            strength: p.ControlNetApplyAdvanced_strength,
            start_percent: p.ControlNetApplyAdvanced_start_percent,
            end_percent: p.ControlNetApplyAdvanced_end_percent,
            positive: conditioningCombine_2.CONDITIONING,
            negative: text_to_Conditioning_1.CONDITIONING,
            control_net: controlNet.CONTROL_NET,
            image: image_Paste_Crop_by_Location.IMAGE,
        })
        const kSampler = graph.KSampler({
            steps: p.KSampler_steps,
            cfg: p.KSampler_cfg,
            sampler_name: p.KSampler_sampler_name,
            scheduler: p.KSampler_scheduler,
            denoise: p.KSampler_denoise,
            model: freeU.MODEL,
            positive: controlNetApplyAdvanced.positive,
            negative: controlNetApplyAdvanced.negative,
            latent_image: latent_Input_Switch.LATENT,
            seed: p.KSampler_seed,
        })
        const vAEDecode = graph.VAEDecode({ samples: kSampler.LATENT, vae: vAE_Input_Switch.VAE })
        const scribblePreprocessor = graph.ScribblePreprocessor({
            resolution: p.ScribblePreprocessor_resolution,
            image: vAEDecode.IMAGE,
        })
        const piDiNetPreprocessor = graph.PiDiNetPreprocessor({
            safe: p.PiDiNetPreprocessor_safe,
            resolution: p.PiDiNetPreprocessor_resolution,
            image: vAEDecode.IMAGE,
        })
        const preview_2 = graph.PreviewImage({ images: piDiNetPreprocessor.IMAGE })
        const image_Crop_Location_1 = graph.Image_Crop_Location({
            image: piDiNetPreprocessor.IMAGE,
            top: cR_Integer_Multiple.INT,
            left: cR_Integer_Multiple_1.INT,
            right: cR_Integer_Multiple_3.INT,
            bottom: cR_Integer_Multiple_2.INT,
        })
        const image_Paste_Crop = graph.Image_Paste_Crop({
            crop_blending: p['Image Paste Crop_crop_blending'],
            crop_sharpening: p['Image Paste Crop_crop_sharpening'],
            image: image_Blank.IMAGE,
            crop_image: image_Crop_Location_1.IMAGE,
            crop_data: image_Crop_Location_1.CROP_DATA,
        })
        const controlNetApplyAdvanced_1 = graph.ControlNetApplyAdvanced({
            strength: p.ControlNetApplyAdvanced_strength_1,
            start_percent: p.ControlNetApplyAdvanced_start_percent_1,
            end_percent: p.ControlNetApplyAdvanced_end_percent_1,
            positive: conditioningCombine.CONDITIONING,
            negative: text_to_Conditioning_2.CONDITIONING,
            control_net: controlNet_1.CONTROL_NET,
            image: image_Paste_Crop.IMAGE,
        })
        const controlNetApplyAdvanced_2 = graph.ControlNetApplyAdvanced({
            strength: p.ControlNetApplyAdvanced_strength_2,
            start_percent: p.ControlNetApplyAdvanced_start_percent_2,
            end_percent: p.ControlNetApplyAdvanced_end_percent_2,
            positive: conditioningCombine_1.CONDITIONING,
            negative: text_to_Conditioning.CONDITIONING,
            control_net: controlNet_1.CONTROL_NET,
            image: image_Paste_Crop.IMAGE,
        })
        const preview_3 = graph.PreviewImage({ images: image_Paste_Crop.IMAGE })
        const preview_4 = graph.PreviewImage({ images: image_Crop_Location_1.IMAGE })
        const preview_5 = graph.PreviewImage({ images: vAEDecode.IMAGE })
        const animeLineArtPreprocessor = graph.AnimeLineArtPreprocessor({
            resolution: p.AnimeLineArtPreprocessor_resolution,
            image: vAEDecode.IMAGE,
        })
        const preview_6 = graph.PreviewImage({ images: animeLineArtPreprocessor.IMAGE })
        const manga2Anime_LineArt_Preprocessor = graph.Manga2Anime_LineArt_Preprocessor({
            resolution: p.Manga2Anime_LineArt_Preprocessor_resolution,
            image: vAEDecode.IMAGE,
        })
        const preview_7 = graph.PreviewImage({ images: manga2Anime_LineArt_Preprocessor.IMAGE })
        const kSampler_1 = graph.KSampler({
            steps: p.KSampler_steps_1,
            cfg: p.KSampler_cfg_1,
            sampler_name: p.KSampler_sampler_name_1,
            scheduler: p.KSampler_scheduler_1,
            denoise: p.KSampler_denoise_1,
            model: freeU.MODEL,
            positive: controlNetApplyAdvanced_2.positive,
            negative: controlNetApplyAdvanced_2.negative,
            latent_image: kSampler.LATENT,
            seed: p.KSampler_seed_1,
        })
        const vAEDecode_1 = graph.VAEDecode({ samples: kSampler_1.LATENT, vae: vAE_Input_Switch.VAE })
        const preview_8 = graph.PreviewImage({ images: vAEDecode_1.IMAGE })
        const colorPreprocessor = graph.ColorPreprocessor({
            resolution: p.ColorPreprocessor_resolution,
            image: vAEDecode_1.IMAGE,
        })
        const preview_9 = graph.PreviewImage({ images: colorPreprocessor.IMAGE })
        const controlNetApplyAdvanced_3 = graph.ControlNetApplyAdvanced({
            strength: p.ControlNetApplyAdvanced_strength_3,
            start_percent: p.ControlNetApplyAdvanced_start_percent_3,
            end_percent: p.ControlNetApplyAdvanced_end_percent_3,
            positive: controlNetApplyAdvanced_2.positive,
            negative: controlNetApplyAdvanced_2.negative,
            control_net: controlNet_2.CONTROL_NET,
            image: colorPreprocessor.IMAGE,
        })
        const controlNetApplyAdvanced_4 = graph.ControlNetApplyAdvanced({
            strength: p.ControlNetApplyAdvanced_strength_4,
            start_percent: p.ControlNetApplyAdvanced_start_percent_4,
            end_percent: p.ControlNetApplyAdvanced_end_percent_4,
            positive: controlNetApplyAdvanced_1.positive,
            negative: controlNetApplyAdvanced_1.negative,
            control_net: controlNet_2.CONTROL_NET,
            image: colorPreprocessor.IMAGE,
        })
        const preview_10 = graph.PreviewImage({ images: vAEDecode_1.IMAGE })
        const kSampler_2 = graph.KSampler({
            steps: p.KSampler_steps_2,
            cfg: p.KSampler_cfg_2,
            sampler_name: p.KSampler_sampler_name_2,
            scheduler: p.KSampler_scheduler_2,
            denoise: p.KSampler_denoise_2,
            model: freeU.MODEL,
            positive: controlNetApplyAdvanced_4.positive,
            negative: controlNetApplyAdvanced_4.negative,
            latent_image: kSampler.LATENT,
            seed: p.KSampler_seed_2,
        })
        const vAEDecode_2 = graph.VAEDecode({ samples: kSampler_2.LATENT, vae: vAE_Input_Switch.VAE })
        const preview_11 = graph.PreviewImage({ images: vAEDecode_2.IMAGE })
        const preview_12 = graph.PreviewImage({ images: vAEDecode_2.IMAGE })
        const controlNetApplyAdvanced_5 = graph.ControlNetApplyAdvanced({
            strength: p.ControlNetApplyAdvanced_strength_5,
            start_percent: p.ControlNetApplyAdvanced_start_percent_5,
            end_percent: p.ControlNetApplyAdvanced_end_percent_5,
            positive: controlNetApplyAdvanced.positive,
            negative: controlNetApplyAdvanced.negative,
            control_net: controlNet_1.CONTROL_NET,
            image: image_Paste_Crop.IMAGE,
        })
        const controlNetApplyAdvanced_6 = graph.ControlNetApplyAdvanced({
            strength: p.ControlNetApplyAdvanced_strength_6,
            start_percent: p.ControlNetApplyAdvanced_start_percent_6,
            end_percent: p.ControlNetApplyAdvanced_end_percent_6,
            positive: controlNetApplyAdvanced_5.positive,
            negative: controlNetApplyAdvanced_5.negative,
            control_net: controlNet_2.CONTROL_NET,
            image: colorPreprocessor.IMAGE,
        })
        const kSampler_3 = graph.KSampler({
            steps: p.KSampler_steps_3,
            cfg: p.KSampler_cfg_3,
            sampler_name: p.KSampler_sampler_name_3,
            scheduler: p.KSampler_scheduler_3,
            denoise: p.KSampler_denoise_3,
            model: freeU.MODEL,
            positive: controlNetApplyAdvanced_6.positive,
            negative: controlNetApplyAdvanced_6.negative,
            latent_image: kSampler.LATENT,
            seed: p.KSampler_seed_3,
        })
        const vAEDecode_3 = graph.VAEDecode({ samples: kSampler_3.LATENT, vae: vAE_Input_Switch.VAE })
        const preview_13 = graph.PreviewImage({ images: vAEDecode_3.IMAGE })
        const image_Crop_Location_2 = graph.Image_Crop_Location({
            image: vAEDecode_3.IMAGE,
            top: cR_Integer_Multiple.INT,
            left: cR_Integer_Multiple_1.INT,
            right: cR_Integer_Multiple_3.INT,
            bottom: cR_Integer_Multiple_2.INT,
        })
        const preview_14 = graph.PreviewImage({ images: image_Crop_Location_2.IMAGE })
        const faceDetailer = graph.FaceDetailer({
            guide_size: p.FaceDetailer_guide_size,
            guide_size_for: p.FaceDetailer_guide_size_for,
            max_size: p.FaceDetailer_max_size,
            steps: p.FaceDetailer_steps,
            cfg: p.FaceDetailer_cfg,
            sampler_name: p.FaceDetailer_sampler_name,
            scheduler: p.FaceDetailer_scheduler,
            feather: p.FaceDetailer_feather,
            noise_mask: p.FaceDetailer_noise_mask,
            force_inpaint: p.FaceDetailer_force_inpaint,
            bbox_threshold: p.FaceDetailer_bbox_threshold,
            bbox_dilation: p.FaceDetailer_bbox_dilation,
            bbox_crop_factor: p.FaceDetailer_bbox_crop_factor,
            sam_detection_hint: p.FaceDetailer_sam_detection_hint,
            sam_dilation: p.FaceDetailer_sam_dilation,
            sam_threshold: p.FaceDetailer_sam_threshold,
            sam_bbox_expansion: p.FaceDetailer_sam_bbox_expansion,
            sam_mask_hint_threshold: p.FaceDetailer_sam_mask_hint_threshold,
            sam_mask_hint_use_negative: p.FaceDetailer_sam_mask_hint_use_negative,
            drop_size: p.FaceDetailer_drop_size,
            wildcard: p.FaceDetailer_wildcard,
            detailer_hook: p.FaceDetailer_detailer_hook,
            image: vAEDecode_3.IMAGE,
            model: freeU.MODEL,
            clip: cLIP_Input_Switch.CLIP,
            vae: vAE_Input_Switch.VAE,
            positive: conditioningCombine_2.CONDITIONING,
            negative: text_to_Conditioning_1.CONDITIONING,
            bbox_detector: ultralyticsDetectorProvider.BBOX_DETECTOR,
            sam_model_opt: sAM.SAM_MODEL,
            seed: ttN_seed.seed,
            denoise: p.FaceDetailer_denoise,
        })
        const faceDetailerPipe = graph.FaceDetailerPipe({
            guide_size: p.FaceDetailerPipe_guide_size,
            guide_size_for: p.FaceDetailerPipe_guide_size_for,
            max_size: p.FaceDetailerPipe_max_size,
            steps: p.FaceDetailerPipe_steps,
            cfg: p.FaceDetailerPipe_cfg,
            sampler_name: p.FaceDetailerPipe_sampler_name,
            scheduler: p.FaceDetailerPipe_scheduler,
            feather: p.FaceDetailerPipe_feather,
            noise_mask: p.FaceDetailerPipe_noise_mask,
            force_inpaint: p.FaceDetailerPipe_force_inpaint,
            bbox_threshold: p.FaceDetailerPipe_bbox_threshold,
            bbox_dilation: p.FaceDetailerPipe_bbox_dilation,
            bbox_crop_factor: p.FaceDetailerPipe_bbox_crop_factor,
            sam_detection_hint: p.FaceDetailerPipe_sam_detection_hint,
            sam_dilation: p.FaceDetailerPipe_sam_dilation,
            sam_threshold: p.FaceDetailerPipe_sam_threshold,
            sam_bbox_expansion: p.FaceDetailerPipe_sam_bbox_expansion,
            sam_mask_hint_threshold: p.FaceDetailerPipe_sam_mask_hint_threshold,
            sam_mask_hint_use_negative: p.FaceDetailerPipe_sam_mask_hint_use_negative,
            drop_size: p.FaceDetailerPipe_drop_size,
            refiner_ratio: p.FaceDetailerPipe_refiner_ratio,
            image: image_Crop_Location_2.IMAGE,
            detailer_pipe: faceDetailer.detailer_pipe,
            seed: ttN_seed.seed,
            denoise: p.FaceDetailerPipe_denoise,
        })
        const image_Rembg_$1Remove_Background$2 = graph.Image_Rembg_$1Remove_Background$2({
            transparency: p['Image Rembg (Remove Background)_transparency'],
            model: p['Image Rembg (Remove Background)_model'],
            post_processing: p['Image Rembg (Remove Background)_post_processing'],
            only_mask: p['Image Rembg (Remove Background)_only_mask'],
            alpha_matting: p['Image Rembg (Remove Background)_alpha_matting'],
            alpha_matting_foreground_threshold: p['Image Rembg (Remove Background)_alpha_matting_foreground_threshold'],
            alpha_matting_background_threshold: p['Image Rembg (Remove Background)_alpha_matting_background_threshold'],
            alpha_matting_erode_size: p['Image Rembg (Remove Background)_alpha_matting_erode_size'],
            background_color: p['Image Rembg (Remove Background)_background_color'],
            images: faceDetailerPipe.image,
        })
        const preview_15 = graph.PreviewImage({ images: image_Rembg_$1Remove_Background$2.images })
        const faceDetailerPipe_1 = graph.FaceDetailerPipe({
            guide_size: p.FaceDetailerPipe_guide_size_1,
            guide_size_for: p.FaceDetailerPipe_guide_size_for_1,
            max_size: p.FaceDetailerPipe_max_size_1,
            steps: p.FaceDetailerPipe_steps_1,
            cfg: p.FaceDetailerPipe_cfg_1,
            sampler_name: p.FaceDetailerPipe_sampler_name_1,
            scheduler: p.FaceDetailerPipe_scheduler_1,
            feather: p.FaceDetailerPipe_feather_1,
            noise_mask: p.FaceDetailerPipe_noise_mask_1,
            force_inpaint: p.FaceDetailerPipe_force_inpaint_1,
            bbox_threshold: p.FaceDetailerPipe_bbox_threshold_1,
            bbox_dilation: p.FaceDetailerPipe_bbox_dilation_1,
            bbox_crop_factor: p.FaceDetailerPipe_bbox_crop_factor_1,
            sam_detection_hint: p.FaceDetailerPipe_sam_detection_hint_1,
            sam_dilation: p.FaceDetailerPipe_sam_dilation_1,
            sam_threshold: p.FaceDetailerPipe_sam_threshold_1,
            sam_bbox_expansion: p.FaceDetailerPipe_sam_bbox_expansion_1,
            sam_mask_hint_threshold: p.FaceDetailerPipe_sam_mask_hint_threshold_1,
            sam_mask_hint_use_negative: p.FaceDetailerPipe_sam_mask_hint_use_negative_1,
            drop_size: p.FaceDetailerPipe_drop_size_1,
            refiner_ratio: p.FaceDetailerPipe_refiner_ratio_1,
            image: vAEDecode_1.IMAGE,
            detailer_pipe: faceDetailer.detailer_pipe,
            seed: ttN_seed.seed,
            denoise: p.FaceDetailerPipe_denoise_1,
        })
        const faceDetailerPipe_2 = graph.FaceDetailerPipe({
            guide_size: p.FaceDetailerPipe_guide_size_2,
            guide_size_for: p.FaceDetailerPipe_guide_size_for_2,
            max_size: p.FaceDetailerPipe_max_size_2,
            steps: p.FaceDetailerPipe_steps_2,
            cfg: p.FaceDetailerPipe_cfg_2,
            sampler_name: p.FaceDetailerPipe_sampler_name_2,
            scheduler: p.FaceDetailerPipe_scheduler_2,
            feather: p.FaceDetailerPipe_feather_2,
            noise_mask: p.FaceDetailerPipe_noise_mask_2,
            force_inpaint: p.FaceDetailerPipe_force_inpaint_2,
            bbox_threshold: p.FaceDetailerPipe_bbox_threshold_2,
            bbox_dilation: p.FaceDetailerPipe_bbox_dilation_2,
            bbox_crop_factor: p.FaceDetailerPipe_bbox_crop_factor_2,
            sam_detection_hint: p.FaceDetailerPipe_sam_detection_hint_2,
            sam_dilation: p.FaceDetailerPipe_sam_dilation_2,
            sam_threshold: p.FaceDetailerPipe_sam_threshold_2,
            sam_bbox_expansion: p.FaceDetailerPipe_sam_bbox_expansion_2,
            sam_mask_hint_threshold: p.FaceDetailerPipe_sam_mask_hint_threshold_2,
            sam_mask_hint_use_negative: p.FaceDetailerPipe_sam_mask_hint_use_negative_2,
            drop_size: p.FaceDetailerPipe_drop_size_2,
            refiner_ratio: p.FaceDetailerPipe_refiner_ratio_2,
            image: vAEDecode_2.IMAGE,
            detailer_pipe: faceDetailerPipe_1.detailer_pipe,
            seed: ttN_seed.seed,
            denoise: p.FaceDetailerPipe_denoise_2,
        })
        const image_Rembg_$1Remove_Background$2_1 = graph.Image_Rembg_$1Remove_Background$2({
            transparency: p['Image Rembg (Remove Background)_transparency_1'],
            model: p['Image Rembg (Remove Background)_model_1'],
            post_processing: p['Image Rembg (Remove Background)_post_processing_1'],
            only_mask: p['Image Rembg (Remove Background)_only_mask_1'],
            alpha_matting: p['Image Rembg (Remove Background)_alpha_matting_1'],
            alpha_matting_foreground_threshold: p['Image Rembg (Remove Background)_alpha_matting_foreground_threshold_1'],
            alpha_matting_background_threshold: p['Image Rembg (Remove Background)_alpha_matting_background_threshold_1'],
            alpha_matting_erode_size: p['Image Rembg (Remove Background)_alpha_matting_erode_size_1'],
            background_color: p['Image Rembg (Remove Background)_background_color_1'],
            images: faceDetailerPipe_2.image,
        })
        const preview_16 = graph.PreviewImage({ images: image_Rembg_$1Remove_Background$2_1.images })
        const image_Rembg_$1Remove_Background$2_2 = graph.Image_Rembg_$1Remove_Background$2({
            transparency: p['Image Rembg (Remove Background)_transparency_2'],
            model: p['Image Rembg (Remove Background)_model_2'],
            post_processing: p['Image Rembg (Remove Background)_post_processing_2'],
            only_mask: p['Image Rembg (Remove Background)_only_mask_2'],
            alpha_matting: p['Image Rembg (Remove Background)_alpha_matting_2'],
            alpha_matting_foreground_threshold: p['Image Rembg (Remove Background)_alpha_matting_foreground_threshold_2'],
            alpha_matting_background_threshold: p['Image Rembg (Remove Background)_alpha_matting_background_threshold_2'],
            alpha_matting_erode_size: p['Image Rembg (Remove Background)_alpha_matting_erode_size_2'],
            background_color: p['Image Rembg (Remove Background)_background_color_2'],
            images: faceDetailerPipe_1.image,
        })
        const preview_17 = graph.PreviewImage({ images: image_Rembg_$1Remove_Background$2_2.images })
        const image_Rembg_$1Remove_Background$2_3 = graph.Image_Rembg_$1Remove_Background$2({
            transparency: p['Image Rembg (Remove Background)_transparency_3'],
            model: p['Image Rembg (Remove Background)_model_3'],
            post_processing: p['Image Rembg (Remove Background)_post_processing_3'],
            only_mask: p['Image Rembg (Remove Background)_only_mask_3'],
            alpha_matting: p['Image Rembg (Remove Background)_alpha_matting_3'],
            alpha_matting_foreground_threshold: p['Image Rembg (Remove Background)_alpha_matting_foreground_threshold_3'],
            alpha_matting_background_threshold: p['Image Rembg (Remove Background)_alpha_matting_background_threshold_3'],
            alpha_matting_erode_size: p['Image Rembg (Remove Background)_alpha_matting_erode_size_3'],
            background_color: p['Image Rembg (Remove Background)_background_color_3'],
            images: faceDetailer.image,
        })
        const preview_18 = graph.PreviewImage({ images: image_Rembg_$1Remove_Background$2_3.images })
        const save = graph.SaveImage({
            filename_prefix: p.SaveImage_filename_prefix,
            images: image_Rembg_$1Remove_Background$2_3.images,
        })
        const preview_19 = graph.PreviewImage({ images: vAEDecode_3.IMAGE })
        const string = graph.String({ value: p.String_value })
        const image_Save = graph.Image_Save({
            output_path: p['Image Save_output_path'],
            filename_delimiter: p['Image Save_filename_delimiter'],
            filename_number_padding: p['Image Save_filename_number_padding'],
            filename_number_start: p['Image Save_filename_number_start'],
            extension: p['Image Save_extension'],
            lossless_webp: p['Image Save_lossless_webp'],
            overwrite_mode: p['Image Save_overwrite_mode'],
            show_history: p['Image Save_show_history'],
            show_history_by_prefix: p['Image Save_show_history_by_prefix'],
            embed_workflow: p['Image Save_embed_workflow'],
            show_previews: p['Image Save_show_previews'],
            images: image_Rembg_$1Remove_Background$2.images,
            filename_prefix: string.STRING,
            quality: integer.INT,
        })
        const image_Save_1 = graph.Image_Save({
            output_path: p['Image Save_output_path_1'],
            filename_delimiter: p['Image Save_filename_delimiter_1'],
            filename_number_padding: p['Image Save_filename_number_padding_1'],
            filename_number_start: p['Image Save_filename_number_start_1'],
            extension: p['Image Save_extension_1'],
            lossless_webp: p['Image Save_lossless_webp_1'],
            overwrite_mode: p['Image Save_overwrite_mode_1'],
            show_history: p['Image Save_show_history_1'],
            show_history_by_prefix: p['Image Save_show_history_by_prefix_1'],
            embed_workflow: p['Image Save_embed_workflow_1'],
            show_previews: p['Image Save_show_previews_1'],
            images: image_Rembg_$1Remove_Background$2_3.images,
            filename_prefix: string.STRING,
            quality: integer.INT,
        })
        const image_Save_2 = graph.Image_Save({
            output_path: p['Image Save_output_path_2'],
            filename_delimiter: p['Image Save_filename_delimiter_2'],
            filename_number_padding: p['Image Save_filename_number_padding_2'],
            filename_number_start: p['Image Save_filename_number_start_2'],
            extension: p['Image Save_extension_2'],
            lossless_webp: p['Image Save_lossless_webp_2'],
            overwrite_mode: p['Image Save_overwrite_mode_2'],
            show_history: p['Image Save_show_history_2'],
            show_history_by_prefix: p['Image Save_show_history_by_prefix_2'],
            embed_workflow: p['Image Save_embed_workflow_2'],
            show_previews: p['Image Save_show_previews_2'],
            images: image_Rembg_$1Remove_Background$2_2.images,
            filename_prefix: string.STRING,
            quality: integer.INT,
        })
        const image_Save_3 = graph.Image_Save({
            output_path: p['Image Save_output_path_3'],
            filename_delimiter: p['Image Save_filename_delimiter_3'],
            filename_number_padding: p['Image Save_filename_number_padding_3'],
            filename_number_start: p['Image Save_filename_number_start_3'],
            extension: p['Image Save_extension_3'],
            lossless_webp: p['Image Save_lossless_webp_3'],
            overwrite_mode: p['Image Save_overwrite_mode_3'],
            show_history: p['Image Save_show_history_3'],
            show_history_by_prefix: p['Image Save_show_history_by_prefix_3'],
            embed_workflow: p['Image Save_embed_workflow_3'],
            show_previews: p['Image Save_show_previews_3'],
            images: image_Rembg_$1Remove_Background$2_1.images,
            filename_prefix: string.STRING,
            quality: integer.INT,
        })
        await flow.PROMPT()
    },
})
