import type { Menu } from './Menu'

/** Menu MANAGER Centralize every single menu definition */
class MenuManager {
    menus: Menu<any>[] = []
    registerMenu = (menu: Menu<any>): number => this.menus.push(menu)
    getMenuById = (id: string): Menu<any> | undefined => this.menus.find((op) => op.def.id === id)
}

export const menuManager = new MenuManager()
