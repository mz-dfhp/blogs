import process from 'node:process'
import { resolve } from 'node:path'
import { readdirSync,renameSync } from 'node:fs'

/**
 * @description 修改page下所有的文件名改成小写
 */
function handleFileRename() {
    const pagePath = resolve(process.cwd(), 'page')
    const files = readdirSync(pagePath)
    files.forEach(item => {
        const oldPath = resolve(pagePath, item)
        const sonFiles = readdirSync(oldPath)
        sonFiles.forEach(sonItem => {
            const oldSonPath = resolve(oldPath, sonItem)
            const newSonPath = resolve(oldPath, sonItem.toLowerCase())
            renameSync(oldSonPath, newSonPath)
        })
    });
}

handleFileRename()