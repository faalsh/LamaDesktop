import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'

PouchDB.plugin(PouchDBFind)

const db = new PouchDB('test')

window.db = db

function registerListenter () {
  db.changes({
    since: 'now',
    live: true
  }).on('change', () => {
    db.allDocs({include_docs:true}).then( result => {
      console.log(result.rows);
    })
  } )

}

registerListenter()

function add(text) {
  const board = {
    _id: Date.now().toString(),
    boardTitle: text
  }

  db.put(board).then(() => {
    console.log('inserted '+text);
  })
}


window.add = add
