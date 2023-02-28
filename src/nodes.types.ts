// deno-lint-ignore-file
interface RootObject {
  KSampler: KSampler;
  CheckpointLoader: CheckpointLoader;
  CLIPTextEncode: CLIPTextEncode;
  VAEDecode: VAEDecode;
  VAEEncode: VAEEncode;
  VAEEncodeForInpaint: VAEEncodeForInpaint;
  VAELoader: VAELoader;
  EmptyLatentImage: EmptyLatentImage;
  LatentUpscale: LatentUpscale;
  SaveImage: SaveImage;
  LoadImage: LoadImage;
  LoadImageMask: LoadImageMask;
  ImageScale: ImageScale;
  ImageInvert: ImageInvert;
  ConditioningCombine: ConditioningCombine;
  ConditioningSetArea: ConditioningSetArea;
  KSamplerAdvanced: KSamplerAdvanced;
  SetLatentNoiseMask: SetLatentNoiseMask;
  LatentComposite: LatentComposite;
  LatentRotate: LatentRotate;
  LatentFlip: LatentFlip;
  LatentCrop: LatentCrop;
  LoraLoader: LoraLoader;
  CLIPLoader: CLIPLoader;
  ControlNetApply: ControlNetApply;
  ControlNetLoader: ControlNetLoader;
  DiffControlNetLoader: DiffControlNetLoader;
  T2IAdapterLoader: T2IAdapterLoader;
  VAEDecodeTiled: VAEDecode;
}
interface T2IAdapterLoader {
  input: Input28;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input28 {
  required: Required28;
}
interface Required28 {
  t2i_adapter_name: any[][];
}
interface DiffControlNetLoader {
  input: Input27;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input27 {
  required: Required27;
}
interface Required27 {
  model: string[];
  control_net_name: string[][];
}
interface ControlNetLoader {
  input: Input26;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input26 {
  required: Required26;
}
interface Required26 {
  control_net_name: string[][];
}
interface ControlNetApply {
  input: Input25;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input25 {
  required: Required25;
}
interface Required25 {
  conditioning: string[];
  control_net: string[];
  image: string[];
  strength: (Denoise | string)[];
}
interface CLIPLoader {
  input: Input24;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input24 {
  required: Required24;
}
interface Required24 {
  clip_name: any[][];
  stop_at_clip_layer: (Denoise | string)[];
}
interface LoraLoader {
  input: Input23;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input23 {
  required: Required23;
}
interface Required23 {
  model: string[];
  clip: string[];
  lora_name: string[][];
  strength_model: (Denoise | string)[];
  strength_clip: (Denoise | string)[];
}
interface LatentCrop {
  input: Input22;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input22 {
  required: Required22;
}
interface Required22 {
  samples: string[];
  width: (Denoise | string)[];
  height: (Denoise | string)[];
  x: (Denoise | string)[];
  y: (Denoise | string)[];
}
interface LatentFlip {
  input: Input21;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input21 {
  required: Required21;
}
interface Required21 {
  samples: string[];
  flip_method: string[][];
}
interface LatentRotate {
  input: Input20;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input20 {
  required: Required20;
}
interface Required20 {
  samples: string[];
  rotation: string[][];
}
interface LatentComposite {
  input: Input19;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input19 {
  required: Required19;
}
interface Required19 {
  samples_to: string[];
  samples_from: string[];
  x: (Denoise | string)[];
  y: (Denoise | string)[];
  feather: (Denoise | string)[];
}
interface SetLatentNoiseMask {
  input: Input18;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input18 {
  required: Required18;
}
interface Required18 {
  samples: string[];
  mask: string[];
}
interface KSamplerAdvanced {
  input: Input17;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input17 {
  required: Required17;
}
interface Required17 {
  model: string[];
  add_noise: string[][];
  noise_seed: (Seed | string)[];
  steps: (Seed | string)[];
  cfg: (Seed | string)[];
  sampler_name: string[][];
  scheduler: string[][];
  positive: string[];
  negative: string[];
  latent_image: string[];
  start_at_step: (Seed | string)[];
  end_at_step: (Seed | string)[];
  return_with_leftover_noise: string[][];
}
interface ConditioningSetArea {
  input: Input16;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input16 {
  required: Required16;
}
interface Required16 {
  conditioning: string[];
  width: (Denoise | string)[];
  height: (Denoise | string)[];
  x: (Denoise | string)[];
  y: (Denoise | string)[];
  strength: (Denoise | string)[];
}
interface ConditioningCombine {
  input: Input15;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input15 {
  required: Required15;
}
interface Required15 {
  conditioning_1: string[];
  conditioning_2: string[];
}
interface ImageInvert {
  input: Input14;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input14 {
  required: Required14;
}
interface Required14 {
  image: string[];
}
interface ImageScale {
  input: Input13;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input13 {
  required: Required13;
}
interface Required13 {
  image: string[];
  upscale_method: string[][];
  width: (Denoise | string)[];
  height: (Denoise | string)[];
  crop: string[][];
}
interface LoadImageMask {
  input: Input12;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input12 {
  required: Required12;
}
interface Required12 {
  image: string[][];
  channel: string[][];
}
interface LoadImage {
  input: Input11;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input11 {
  required: Required11;
}
interface Required11 {
  image: string[][];
}
interface SaveImage {
  input: Input10;
  output: any[];
  name: string;
  description: string;
  category: string;
}
interface Input10 {
  required: Required10;
  hidden: Hidden;
}
interface Hidden {
  prompt: string;
  extra_pnginfo: string;
}
interface Required10 {
  images: string[];
  filename_prefix: (Filenameprefix | string)[];
}
interface Filenameprefix {
  default: string;
}
interface LatentUpscale {
  input: Input9;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input9 {
  required: Required9;
}
interface Required9 {
  samples: string[];
  upscale_method: string[][];
  width: (Denoise | string)[];
  height: (Denoise | string)[];
  crop: string[][];
}
interface EmptyLatentImage {
  input: Input8;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input8 {
  required: Required8;
}
interface Required8 {
  width: (Denoise | string)[];
  height: (Denoise | string)[];
  batch_size: (Seed | string)[];
}
interface VAELoader {
  input: Input7;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input7 {
  required: Required7;
}
interface Required7 {
  vae_name: string[][];
}
interface VAEEncodeForInpaint {
  input: Input6;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input6 {
  required: Required6;
}
interface Required6 {
  pixels: string[];
  vae: string[];
  mask: string[];
}
interface VAEEncode {
  input: Input5;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input5 {
  required: Required5;
}
interface Required5 {
  pixels: string[];
  vae: string[];
}
interface VAEDecode {
  input: Input4;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input4 {
  required: Required4;
}
interface Required4 {
  samples: string[];
  vae: string[];
}
interface CLIPTextEncode {
  input: Input3;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input3 {
  required: Required3;
}
interface Required3 {
  text: (Text | string)[];
  clip: string[];
}
interface Text {
  multiline: boolean;
  dynamic_prompt: boolean;
}
interface CheckpointLoader {
  input: Input2;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input2 {
  required: Required2;
}
interface Required2 {
  config_name: string[][];
  ckpt_name: string[][];
}
interface KSampler {
  input: Input;
  output: string[];
  name: string;
  description: string;
  category: string;
}
interface Input {
  required: Required;
}
interface Required {
  model: string[];
  seed: (Seed | string)[];
  steps: (Seed | string)[];
  cfg: (Seed | string)[];
  sampler_name: string[][];
  scheduler: string[][];
  positive: string[];
  negative: string[];
  latent_image: string[];
  denoise: (Denoise | string)[];
}
interface Denoise {
  default: number;
  min: number;
  max: number;
  step: number;
}
interface Seed {
  default: number;
  min: number;
  max: number;
}