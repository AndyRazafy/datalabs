from flask import Flask, request
from process import load_model, predict_model, load_train_data, update_model, create_blank_model, remove_model, evaluate, confidence
from flask_cors import CORS
from stats import StatEncoder
import json

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'NLP is cool'

@app.route('/create', methods=['POST'])
def create():
    input = request.get_json(force=True)
    modelName = str(input.get('model'))
    create_blank_model(modelName)

    return json.dumps({ "success": 1 })

@app.route('/update', methods=['POST'])
def update():
    input = request.get_json(force=True)
    modelName = str(input.get('model'))
    data = input.get('data')

    trainData = load_train_data(data)

    stats = update_model(modelName, trainData, 25)

    return json.dumps(stats, indent=4, cls=StatEncoder)

@app.route('/predict', methods=['POST'])
def predict():
    input = request.get_json(force=True)
    modelName = str(input.get('model'))
    data = input.get('data')

    nlp = load_model(modelName)

    for item in data:
        doc = predict_model(nlp, str(item['text']))
        conf = confidence(nlp, doc)
        item['confidence'] = conf
        ents = []
        for ent in doc.ents:
            ents.append({ "start": ent.start_char, "end": ent.end_char, "label": ent.label_})
        item['ents'] = ents
    
    return json.dumps(data)

@app.route('/evaluate', methods=['POST'])
def evalutate_model():
    input = request.get_json(force=True)
    modelName = str(input.get('model'))
    data = input.get('data')

    nlp = load_model(modelName)
    testData = load_train_data(data)

    scores = evaluate(nlp, testData)
    
    return json.dumps(scores)

@app.route('/delete', methods=['POST'])
def delete():
    input = request.get_json(force=True)
    modelName = str(input.get('model'))

    remove_model(modelName)

    return json.dumps({ "success": 1 })