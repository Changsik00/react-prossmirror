import React, { useEffect } from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser } from 'prosemirror-model'
import { addListNodes } from 'prosemirror-schema-list'
import { schema } from './prosemirror/schema-basic'
import { exampleSetup } from './prosemirror/setup'
import applyDevTools from 'prosemirror-dev-tools'

import './App.css'
import './Prosemirror.css'

function App() {
  useEffect(() => {
    const mySchema = new Schema({
      nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
      marks: schema.spec.marks,
    })

    const view = new EditorView(document.querySelector('#editor'), {
      state: EditorState.create({
        doc: DOMParser.fromSchema(mySchema).parse(document.querySelector('#content') as Node),
        plugins: exampleSetup({ schema: mySchema }),
      }),
      dispatchTransaction(transaction) {
        console.log('Document size went from', transaction.before.content.size, 'to', transaction.doc.content.size)
        console.log('transaction', transaction)
        let newState = view.state.apply(transaction)
        view.updateState(newState)
      },
    })

    applyDevTools(view)
  }, [])

  return (
    <div className='App'>
      <div style={{ padding: 16 }}>
        <div id='editor'></div>
        <div id='content'></div>
      </div>
    </div>
  )
}

export default App
