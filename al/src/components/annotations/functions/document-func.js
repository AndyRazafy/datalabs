export function addEntityToDocAndUpdateDocs(docs, docId, entity) {
  let newDocs = [];

  for(let d in docs) {
    newDocs.push(docs[d]);
    if(docs[d]._id === docId) {
      newDocs[d].ents.push(entity);
    }
  }

  return newDocs;
}

export function deleteEntityOfDocAndUpdateDocs(docs, docId, entity) {
  let newDocs = [];
  let index = 0;

  for(let d in docs) {
    newDocs.push(docs[d]);
    if(docs[d]._id === docId) {
      index = d;
    }
  }

  let doc = newDocs[index];

  for(let e in doc.ents) {
    if((doc.ents[e].start === entity.start) && (doc.ents[e].end === entity.end && doc.ents[e].label.toLowerCase() === entity.label.toLowerCase())) {
      doc.ents.splice(e, 1);
    }
  }

  return newDocs;
}

export function deleteAllEntitiesOfDocAndUpdateDocs(docs, ids) {
  let newDocs = [];

  for(let doc of docs) {
    for(let id of ids) {
      if(doc._id === id) {
        doc.ents = [];
        break;
      }
    }
    newDocs.push(doc);
  }

  return newDocs;
}

export function deleteLastEntityOfDocAndUpdateDocs(docs, docId) {
  let newDocs = [];
  let index = 0;

  for(let d in docs) {
    newDocs.push(docs[d]);
    if(docs[d]._id === docId) {
      index = d;
    }
  }

  let doc = newDocs[index];
  doc.ents.pop();

  return newDocs;
}

export function excludeFromDocs(docs, trained) {
  let newDocs = [];

  for(let d in docs) {
    if(trained.includes(docs[d]._id)) {
      continue;
    }
    else {
      newDocs.push(docs[d]);
    }
  }

  return newDocs;
}

export function getReadyDocsFromDocs(docs, ready) {
  let newDocs = [];

  for(let d in docs) {
    for(let r in ready) {
      if(ready[r] === docs[d]._id) {
        newDocs.push(docs[d]);
        break;
      }
    }
  }

  return newDocs;
}

export function pushReadyDocsToArray(trained, ready) {
  let newTrained = [];

  for(let t in trained) {
    newTrained.push(trained[t]);
  }

  for(let r in ready) {
    newTrained.push(ready[r]);
  }

  return newTrained;
}

export function replaceEntityAndConfidenceOfDocsPredicted(docs, predicted) {
  let newDocs = [...docs];

  for(let d in newDocs) {
    for(let p in predicted) {
      if(newDocs[d]._id === predicted[p]._id) {
        newDocs[d].ents = predicted[p].ents;
        newDocs[d].confidence = predicted[p].confidence;
        break;
      }
    }
  }

  return newDocs;
}

export function reduceEntityToTextStartEnd(docs) {
  let newDocs = [];

  for(let d in docs) {
    let ents = [];
    for(let e in docs[d].ents) {
      let entity = {
        start: docs[d].ents[e].start,
        end: docs[d].ents[e].end,
        label: docs[d].ents[e].label.toUpperCase()
      };
      ents.push(entity);
    }
    let doc = {
      text: docs[d].text,
      ents: ents
    }
    newDocs.push(doc);
  }
  
  return newDocs;
}

export function sortPredictionByConfidenceAfterPrediction(docs, confidence) {  
  let i = 0;
  while(i < docs.length) {
    docs[i].confidence = confidence[i];
    i++;
  }

  docs.sort((a, b) => (a - b))

  return docs;
}

export function updateConfidenceOfDocsAfterTraining(docs) {
  for(let doc of docs) {
    doc.confidence = 1;
  }
}