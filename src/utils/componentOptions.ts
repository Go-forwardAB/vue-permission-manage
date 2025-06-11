import { Component } from 'vue'

export interface PageComponentInfo {
    path: string
    component: string
    name: string
}

const modules = import.meta.glob<{ default: Component }>(
    '/src/views/**/*.vue',
    {
        eager: true,
    },
)

export function getComponentList(): PageComponentInfo[] {
    return Object.entries(modules)
        .filter(
            ([path]) =>
                !path.includes('/components/') &&
                !path.includes('/utils/') &&
                !path.includes('Login') &&
                !path.includes('NotFound'),
        )
        .map(([path, data]) => {
            const component = path.replace(/^\/src\/views\//, '')
            const name = data.default.name || generateNameFromPath(component)
            const routePath = generateRoutePath(component).toLocaleLowerCase()
            return {
                component,
                name,
                path: routePath,
            }
        })
}

function generateNameFromPath(path: string): string {
    return path
        .replace(/\.vue$/, '')
        .split('/')
        .join('-')
}

function generateRoutePath(path: string): string {
    return !path.includes('Home')
        ? '/' + path.replace(/\.vue$/, '').replace(/\/index$/, '')
        : '/'
}
