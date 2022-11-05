import { Node, NodeType } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'
import { nanoid } from 'nanoid'
import { PID } from '../../constants'

const isTargetNodeOfType = (node: Node, type: NodeType) => node.type === type
const isNodeHasAttribute = (node: Node, attrName: string) => Boolean(node.attrs && node.attrs.attrName)

export const createPlugin = (uuidGenerator = nanoid) => {
  return new Plugin({
    appendTransaction: (transactions, prevState, nextState) => {
      // console.log('#@#appendTransaction transactions', transactions)
      // console.log('#@#appendTransaction prevState', prevState)
      // console.log('#@#appendTransaction nextState', nextState)
      const tr = nextState.tr
      let modified = false
      if (transactions.some((transaction) => transaction.docChanged)) {
        // Adds a unique id to a node
        nextState.doc.descendants((node, pos) => {
          const { paragraph } = nextState.schema.nodes
          if (isTargetNodeOfType(node, paragraph) && !isNodeHasAttribute(node, 'id')) {
            const attrs = node.attrs
            if (!attrs.id) {
              tr.setNodeMarkup(pos, undefined, { ...attrs, id: uuidGenerator() })
              modified = true
            }
          }
        })
      }

      return modified ? tr : null
    },
  })
}
