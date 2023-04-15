// import { observer } from 'mobx-react-lite'
// import { Button, ButtonToolbar, Form, Modal } from 'rsuite'
// import { useWorkspace } from '../ui/WorkspaceContext'

// export const NewProjectModalUI = observer(function NewProjectModalUI_(p: { children: React.ReactElement }) {
//     const workspace = useWorkspace()
//     const wizard = workspace.wizard
//     // const wizard = useMemo(() => new ProjectCreationWizard(workspace), [])

//     // const [open, setOpen] = useState(false)

//     return (
//         <Modal open={wizard.open}>
//             <Modal.Header>
//                 {/* <Modal.Title>{p.children}</Modal.Title> */}
//                 <Modal.Title>
//                     <h3>Create new project</h3>
//                 </Modal.Title>
//             </Modal.Header>
//             {/* <DialogTrigger disableButtonEnhancement> */}
//             {/* <Button icon={<I.Add24Regular />}>Create project</Button> */}
//             {/* </DialogTrigger> */}
//             <Modal.Body>
//                 <Form>
//                     <Form.Group controlId='name'>
//                         <Form.ControlLabel>Username</Form.ControlLabel>
//                         <Form.Control
//                             autoFocus
//                             value={wizard.name}
//                             onChange={(ev) => (wizard.name = ev.target.value)}
//                             name='name'
//                         />
//                         <Form.HelpText>
//                             Project will be created in{' '}
//                             <span className='highlighted'>
//                                 {'<workspace>'}/{wizard.workspaceRelativePath}
//                             </span>
//                         </Form.HelpText>
//                     </Form.Group>
//                     {/* <Input autoFocus value={wizard.name} onChange={(ev) => (wizard.name = ev.target.value)} /> */}
//                 </Form>
//             </Modal.Body>
//             <Modal.Footer>
//                 <ButtonToolbar>
//                     <Button onClick={wizard.create} appearance='primary'>
//                         Create
//                     </Button>
//                     <Button>Cancel</Button>
//                 </ButtonToolbar>
//             </Modal.Footer>
//         </Modal>
//     )
// })
