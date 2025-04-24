export enum FieldEvent {
   TrackAsCreated = 'tct.trackAsCreated',
   TrackAsUpdated = 'tct.trackAsUpdated',
   TrackAsDeleted = 'tct.trackAsDeleted',

   /** all CommitUpdate are executed before all CommitUpdate2 */
   CommitUpdate = 'tct.commit',
   CommitUpdate2 = 'tct.commit2',

   All = 'all',

   // todo: remove
   TrackAsCreatedOrUpdated = 'tct.trackAsCreated+Updated',
}

export type FieldEvent_ = FieldEvent | `${FieldEvent}`
