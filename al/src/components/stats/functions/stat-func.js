export function getLabelsCounts(labels, docs) {
  let counts = [];

  let i = 0;
  while (i < labels.length) {
    counts.push(0);
    i++;
  }

  for(let doc of docs) {
    for(let ent of doc.ents) {
      const index = labels.indexOf(ent.label);
      counts[index] = counts[index] + 1;
    }
  }

  return counts;
}

export function getLabelEvalutation(evaluation, labels, scoreLabel) {
  let scores = [];

  for(let label of labels) {
    scores.push(evaluation['ents_per_type'][label][scoreLabel].toFixed(2));
  }

  return scores;
}

export function getTestDocs(docs, test) {
  let newDocs = [];

  for(let d in docs) {
    for(let r in test) {
      if(test[r] === docs[d]._id) {
        newDocs.push(docs[d]);
        break;
      }
    }
  }

  return newDocs;
}

export function generateRGBA(number) {
  let rgbas = [];
  let i = 0;

  while(i < number) {
    rgbas.push(randomColor(10));
    i++;
  }

  return rgbas;
}

function randomColor(brightness){
  function randomChannel(brightness){
    var r = 255-brightness;
    var n = 0|((Math.random() * r) + brightness);
    var s = n.toString(16);
    return (s.length===1) ? '0'+s : s;
  }
  return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}