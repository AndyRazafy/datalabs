import spacy
import warnings
import random
import os
import datetime as dt
from spacy.util import minibatch, compounding
from spacy.gold import GoldParse
from spacy.scorer import Scorer
from stats import make_stat
import sys
from collections import defaultdict

def load_model(name):
  dir = './models/' + name
  nlp = spacy.load(dir)
  return nlp

def save_model(nlp, name):
  dir = './models/' + name
  nlp.to_disk(dir)

def create_blank_model(name):
  nlp = spacy.blank("fr")
  save_model(nlp, name)

def remove_model(name):
  dir = './models/' + name
  os.remove(dir)

def load_train_data(data):
  TRAIN_DATA = []

  for item in data:
    ents = []
    for ent in item['ents']:
      ents.append((ent['start'], ent['end'], ent['label']))
    TRAIN_DATA.append((item['text'], {'entities': ents}))

  return TRAIN_DATA

def update_model(name, train_data, n_iter):
  nlp = load_model(name)

  isNew = False

  if "ner" not in nlp.pipe_names:
    ner = nlp.create_pipe("ner")
    nlp.add_pipe(ner, last=True)
    isNew = True
  else:
    ner = nlp.get_pipe("ner")

  # add labels
  for _, annotations in train_data:
    for ent in annotations.get("entities"):
      ner.add_label(ent[2])

  # get names of other pipes to disable them during training
  pipe_exceptions = ["ner", "trf_wordpiecer", "trf_tok2vec"]
  other_pipes = [pipe for pipe in nlp.pipe_names if pipe not in pipe_exceptions]

  stats = []
  
  # only train NER
  with nlp.disable_pipes(*other_pipes), warnings.catch_warnings():
    # show warnings for misaligned entity spans once
    warnings.filterwarnings("once", category=UserWarning, module='spacy')

    if isNew is True:
      nlp.begin_training()

    for itn in range(n_iter):
      losses = {}
      # batch up the examples using spaCy's minibatch
      batches = minibatch(train_data, size=compounding(4.0, 32.0, 1.001))
      for batch in batches:
        texts, annotations = zip(*batch)
        nlp.update(
          texts,  # batch of texts
          annotations,  # batch of annotations
          drop=0.5,  # dropout - make it harder to memorise data
          losses=losses,
        )

      #print("Losses", losses)
      now = dt.datetime.now()
      stat = make_stat(losses, str(now))
      stats.append(stat)

  save_model(nlp, name)

  return stats

def predict_model(nlp, input):
  doc = nlp(input)
  return doc

def evaluate(model, examples):
  scorer = Scorer()
  for input_, annot in examples:
    doc_gold_text = model.make_doc(input_)
    gold = GoldParse(doc_gold_text, entities=annot.get("entities"))
    pred_value = model(input_)
    scorer.score(pred_value, gold)
  return scorer.scores

def confidence(nlp, doc):
  beams = nlp.entity.beam_parse([ doc ], beam_width = 16, beam_density = 0.0001)

  entity_scores = defaultdict(float)
  for beam in beams:
    for score, ents in nlp.entity.moves.get_beam_parses(beam):
      for start, end, label in ents:
        entity_scores[(start, end, label)] += score

  threshold = 0.1
  value = 0
  length = 0

  for key in entity_scores:
    score = entity_scores[key]
    if(score > threshold): 
      value += score
      length += 1

  if(length > 0):
    value /= length
  return value