import type { PanelCaptioningProps } from './PanelCaptioningUI'

import { Panel, type PanelHeader } from '../../router/Panel'
import { PanelCaptioningUI } from './PanelCaptioningUI'

/** This is the Captioning Panel
 *    Structure:
 *       - filename.png
 *       - filename.txt
 *    - Caption images, using filename.txt
 *
 *    This tool should make it so handling datasets is decently easy in a non-destructive way
 *       - Captioning
 *       - Cropping images
 *       - Export modifications to a separate folder for non-destructive editing
 *
 *    A lot of the info should be stored in the file as a JSON
 *       - Export Path
 *       - Information about cropping and potentially regional-captioning in the future
 */

export const PanelCaptioning = new Panel({
   name: 'Captioning',
   widget: (): React.FC<PanelCaptioningProps> => PanelCaptioningUI,
   header: (p: PanelCaptioningProps): PanelHeader => ({ title: 'Captioning' }),
   def: (): PanelCaptioningProps => ({
      //
      activeImage: { index: -1, filePath: '', captions: [] as string[] },
      activeCaption: { index: -1, text: '' },
      activeGlobalCaption: { index: -1, text: '' },
      activeDirectory: { path: '', files: [] },
      selected: new Set(),
      folderPath: '',
      exportPath: '',
      floatingCaption: '',
      floatingGlobalCaption: '',
   }),
   icon: 'mdiImageText',
   category: 'tools',
})
