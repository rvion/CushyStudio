import { ProjectL } from 'src/models/Project'

import React from 'react'

export const projectContext = React.createContext<ProjectL | null>(null)

export const useProject = (): ProjectL => {
    const project = React.useContext(projectContext)
    if (project == null) throw new Error('missing project in context')
    return project
}
