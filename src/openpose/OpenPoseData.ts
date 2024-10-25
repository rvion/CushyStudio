export type OpenPoseData = {
   version: number
   people: OpenPosePerson[]
}

export type OpenPosePerson = {
   pose_keypoints_2d: number[]
   face_keypoints_2d: number[]
   hand_left_keypoints_2d: number[]
   hand_right_keypoints_2d: number[]
   pose_keypoints_3d: number[]
   face_keypoints_3d: number[]
   hand_left_keypoints_3d: number[]
   hand_right_keypoints_3d: number[]
}

export class OpenPosePersonExt {
   constructor(public readonly person: OpenPosePerson) {
      // makeAutoObservable(this)
   }
}
