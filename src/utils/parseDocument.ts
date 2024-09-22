import { type Document as EarthstarDocument } from '@earthstar/earthstar'
import capitalizeFirstLetter from './capitalizeFirstLetter'

export interface Document extends EarthstarDocument {
  title: string
  description: string
  humanPath: string | undefined
}

const decoder = new TextDecoder()

async function parseDocument (document: EarthstarDocument): Promise<Document> {
  const content = decoder.decode(await document.payload?.bytes()).split('\n')
  const title = capitalizeFirstLetter(
    content.at(0)?.replace('# ', '') ?? ''
  )
  content.shift()
  const description = content.join('\n')
  const humanPath = document.path.format('ascii')

  return {
    ...document,
    title,
    description,
    humanPath
  }
}

export default parseDocument
