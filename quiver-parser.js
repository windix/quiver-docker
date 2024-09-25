const fs = require('fs').promises
const path = require('path')

// const baseDir = '../lib'

if (process.argv.length !== 3) {
  console.error(`Usage: node ${path.basename(process.argv[1])} <base-dir>`)
  process.exit(1)
}

const baseDir = process.argv[2]

const notebooks = [
  {
    name: 'Inbox',
    uuid: 'Inbox',
  },
]

const convertToISOString = ts => new Date(ts * 1000).toISOString()

const readAndParseJson = async (filename) => {
  const content = await fs.readFile(path.join(baseDir, filename), 'utf-8')
  return JSON.parse(content)
}

const getNote = async (notebookName, notebookUuid, noteDirName) => {
  const path = `${notebookUuid}.qvnotebook/${noteDirName}`

  const meta = await readAndParseJson(`${path}/meta.json`)
  const content = await readAndParseJson(`${path}/content.json`)

  return {
    uuid: meta.uuid,
    title: meta.title,
    contents: content.cells.map((cell) => cell.data).join('\\n\\n'),
    notebook: notebookName,
    created_at: convertToISOString(meta.created_at),
    updated_at: convertToISOString(meta.updated_at),
  }
}

const parseNotes = async (notebookName, notebookUuid) => {
  const allFiles = await fs.readdir(
    path.join(baseDir, `${notebookUuid}.qvnotebook`)
  )
  const noteDirs = allFiles.filter((filename) => filename.endsWith('.qvnote'))

  const notes = await Promise.all(
    noteDirs.map((noteDir) => getNote(notebookName, notebookUuid, noteDir))
  )

  return notes
}

const parseNotebooks = async (parentName, children) => {
  for await ({ uuid: notebookUuid, children: childrenNotebook } of children) {
    const { name } = await readAndParseJson(
      `${notebookUuid}.qvnotebook/meta.json`
    )

    const nameWithParent = [parentName, name].join(' > ')
    notebooks.push({
      name: nameWithParent,
      uuid: notebookUuid,
    })

    if (childrenNotebook) {
      await parseNotebooks(nameWithParent, childrenNotebook)
    }
  }
}

const main = async () => {
  const root = await readAndParseJson('meta.json')
  await parseNotebooks('', root.children)

  const notes = (
    await Promise.all(
      notebooks.map(({ name, uuid }) => {
        return parseNotes(name, uuid)
      })
    )
  ).flat()

  console.log(JSON.stringify(notes, null, 2))
}

main()
