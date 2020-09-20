import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';

import { DATA_API, TRAIN_API, CONFIG } from '../../utils/api/api';
import { nameAlreadyExist, modelAlreadyExist, Dataset, importDataToTextareaFromFile, shuffle, textToDoc } from './functions/create-dataset';

// actions
import { loadingAction } from '../../actions/loading-actions';

import './css/create-dataset.css';

class CreateDataset extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datasets: []
    }

    this.newModel = React.createRef();
    this.file = React.createRef();
    this.docs = React.createRef();
    this.shuffle = React.createRef();
  }

  componentDidMount = () => {
    this.loadData();
  }

  loadData = () => {
    this.props.loadingAction(true, "Chargement des données...");
    axios.get(`${DATA_API}/datasets`)
      .then(res => {
        this.setState({ datasets: res.data });
        this.props.loadingAction(false, "");
      })
      .catch(err => {
        this.props.loadingAction(false, "");
      })
  }

  createModelRequest = (model) => {
    this.props.loadingAction(true, "Création du modèle...");
      axios.post(`${TRAIN_API}/create`, model, CONFIG)
        .then(res => {
          this.props.loadingAction(false, "");
        })
        .catch(err => {
          this.props.loadingAction(false, "");
        })
  }

  createDatasetRequest = (newDataset) => {
    this.props.loadingAction(true, "Ajout en cours...");
      axios.post(`${DATA_API}/datasets`, newDataset, CONFIG)
        .then(res => {
          const model = { model: newDataset.model };
          this.createModelRequest(model);
          this.props.history.push('/donnees');
        })
        .catch(err => {
          this.props.loadingAction(false, "");
        })
  }

  createDataset = () => {
    const newModel = this.newModel.current.value.trim();
    let docs = this.docs.current.value.split('\n');
    const onShuffle = this.shuffle.current.checked;

    if(newModel && !modelAlreadyExist(this.state.datasets, newModel)) {
      let newDocs = [];

      for(let i in docs) {
        newDocs.push(textToDoc(docs[i]));
      }
      
      if(onShuffle)
        newDocs = shuffle(newDocs);

      const labels = [];
      const ready = [];
      const trained = [];
      const test = [];
      const newDataset = Dataset(newModel, newDocs, labels, ready, trained, test);

      this.createDatasetRequest(newDataset);
    }
  }

  onChangeFile = (e) => {
    importDataToTextareaFromFile(this.file.current.files[0], this.docs.current);
  }

  displayCreateDatasetForm = () => {
    return(
      <form>
        <h1 className="form-title">Ajout de modèle</h1>
        <div className="row">
          <div className="six columns">
            <label htmlFor="exampleModelInput">Modèle</label>
            <input ref={this.newModel} className="u-full-width" type="text" placeholder="ex: nom_prenom_modele" id="exampleModelInput" required={true}/>
          </div>
        </div>
        <div className="row Row">
          <div className="six columns">
            <label htmlFor="exampleFileInput">Données</label>
            <input ref={this.file} onChange={(e) => this.onChangeFile(e)} className="u-full-width" type="file" id="exampleFileInput" required={true}/>
          </div>
        </div>
        <div className="row Row">
          <label htmlFor="exampleMessage">Aperçu</label>
          <textarea ref={this.docs} className="u-full-width" id="exampleMessage" readOnly={true}></textarea>
        </div>
        <div className="row Row">
          <label className="example-send-yourself-copy">
            <input ref={this.shuffle} type="checkbox"/>
            <span className="label-body">Mélanger les documents</span>
          </label>
        </div>
        <div className="row Row" style={{ textAlign: "right" }}>
          <Link to="/donnees" className="button">
            Annuler
          </Link>{' '}
          <button type="button" className="button-primary" onClick={() => this.createDataset()}>Ajouter</button>
        </div>
      </form>
    );
  }

  render() {
    const { datasets} = this.state;

    return(
      <div className="container create-dataset-container">
        {this.displayCreateDatasetForm(datasets)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadingAction: (value, message) => dispatch(loadingAction(value, message)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateDataset));