import { Node, NodeType } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'
import { v4 as uuid4 } from 'uuid'
import { PID } from '../../constants'
// import { uuid } from 'uuidv4'

const isTargetNodeOfType = (node: Node, type: NodeType) => node.type === type
const isNodeHasAttribute = (node: Node, attrName: string) => Boolean(node.attrs && node.attrs[attrName])
const attrName = PID

export const createPlugin = (uuidGenerator = uuid4) => {
  return new Plugin({
    appendTransaction: (transactions, prevState, nextState) => {
      const tr = nextState.tr
      let modified = false
      if (transactions.some((transaction) => transaction.docChanged)) {
        // Adds a unique id to a node
        nextState.doc.descendants((node, pos) => {
          const { paragraph } = nextState.schema.nodes
          if (isTargetNodeOfType(node, paragraph) && !isNodeHasAttribute(node, attrName)) {
            const attrs = node.attrs
            tr.setNodeMarkup(pos, undefined, { ...attrs, [attrName]: uuidGenerator() })
            modified = true
          }
        })
      }

      return modified ? tr : null
    },
  })
}
