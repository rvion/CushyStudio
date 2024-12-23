import type { MenuTemplate } from './MenuTemplate'

/**
 * Menu MANAGER
 * singleton that aims to holds all menu definitions
 */
class MenuManager {
   menuTemplates: MenuTemplate<any>[] = []
   registerMenuTemplate = (menu: MenuTemplate<any>): number => this.menuTemplates.push(menu)
   getMenuById = (id: string): MenuTemplate<any> | undefined =>
      this.menuTemplates.find((op) => op.def.id === id)
}

export const menuManager = new MenuManager()
