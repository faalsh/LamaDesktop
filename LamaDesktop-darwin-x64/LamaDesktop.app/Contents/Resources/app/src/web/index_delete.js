import PouchDB from 'PouchDB'


const db = new PouchDB('test')

window.db = db

const remoteCouch = false

db.changes({
  since: 'now',
  live: true
}).on('change', show)


function add(text) {
  const record = {
    _id: Date.now,
    title: text
  }

  db.put(record,(err,result) => {
    if(!err) {
      console.log('inserted '+text)
    }
  })
}

// add('fahad')
// add('mohammed')

function show(){
  db.allDocs({include_docs: true}, (err,doc) => {
    console.log(doc.rows);
  })
}
