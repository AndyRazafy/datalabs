export function nameAlreadyExist(datasets, newName) {
  for(let d in datasets) {
    if(datasets[d].name === newName)
      return true;
  }
  return false;
}

export function modelAlreadyExist(datasets, newModel) {
  for(let d in datasets) {
    if(datasets[d].model === newModel)
      return true;
  }
  return false;
}

export function Dataset(model, docs, labels, ready, trained, test) {
  const dataset = {
    model: model,
    docs: docs,
    labels: labels,
    ready: ready,
    trained: trained,
    test: test
  };

  return dataset;
}

export function importDataToTextareaFromFile(file, textarea) {
  const reader = new FileReader();
  reader.onloadend = function (e) {
    textarea.value = reader.result;
  }
  reader.readAsText(file);
}

export function shuffle(array) {
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array;
}

export function textToDoc(text) {
  const doc = {
    text: text,
    ents: [],
    confidence: 0
  }

  return doc;
}