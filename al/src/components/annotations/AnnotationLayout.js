import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { DATA_API, TRAIN_API, CONFIG } from '../../utils/api/api';

import { addEntityToDocAndUpdateDocs, deleteEntityOfDocAndUpdateDocs, deleteAllEntitiesOfDocAndUpdateDocs,
  getReadyDocsFromDocs, excludeFromDocs, pushReadyDocsToArray, replaceEntityAndConfidenceOfDocsPredicted,
  sortPredictionByConfidenceAfterPrediction, updateConfidenceOfDocsAfterTraining } from './functions/document-func';

// actions
import { loadingAction } from '../../actions/loading-actions';

import DocCard from './DocCard';
import Labels from './Labels';

import './css/annotation.css';

class AnnotationLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selection: {
        str: '',
        start: 0,
        end: 0
      },
      dataset: undefined,
      docs: [],
      labels: [],
      ready: [],
      trained: [],
      test: [],
      pageNumber: 1,
      pageSize: 5
    }
  }

  componentDidMount = () => {
    this.initData();
  }

  initData = () => {
    const { id } = this.props.match.params;
    this.props.loadingAction(true, "Chargement des données...");
    axios.get(`${DATA_API}/datasets/${id}`)
      .then(res => {
        const dataset = res.data;
        const docs = dataset.docs || [];
        const labels = dataset.labels || [];
        const ready = dataset.ready || [];
        const trained = dataset.trained || [];
        const test = dataset.test || [];
        this.setState({ dataset, docs, labels, ready, trained, test });
        this.props.loadingAction(false, "");
      })
      .catch(err => {
        this.props.loadingAction(false, "");
      })
  }

  loadDocs = () => {
    const { id } = this.props.match.params;
    this.props.loadingAction(true, "Chargement des documents...");
    axios.get(`${DATA_API}/datasets/${id}/docs`)
      .then(res => {
        const docs = res.data;
        this.setState({ docs });
        this.props.loadingAction(false, "");
      })
      .catch(err => {
        this.props.loadingAction(false, "");
      })
  }

  loadLabels = () => {
    const { id } = this.props.match.params;
    this.props.loadingAction(true, "Chargement des labels...");
    axios.get(`${DATA_API}/datasets/${id}/labels`)
      .then(res => {
        const labels = res.data;
        this.setState({ labels });
        this.props.loadingAction(false, "");
      })
      .catch(err => {
        this.props.loadingAction(false, "");
      })
  }

  loadReady = () => {
    const { id } = this.props.match.params;
    this.props.loadingAction(true, "Chargement des données...");
    axios.get(`${DATA_API}/datasets/${id}/ready`)
      .then(res => {
        const ready = res.data;
        this.setState({ ready });
        this.props.loadingAction(false, "");
      })
      .catch(err => {
        this.props.loadingAction(false, "");
      })
  }

  loadTrained = () => {
    const { id } = this.props.match.params;
    this.props.loadingAction(true, "Chargement des données...");
    axios.get(`${DATA_API}/datasets/${id}/trained`)
      .then(res => {
        const trained = res.data;
        this.setState({ trained });
        this.props.loadingAction(false, "");
      })
      .catch(err => {
        this.props.loadingAction(false, "");
      })
  }

  loadTest = () => {
    const { id } = this.props.match.params;
    this.props.loadingAction(true, "Chargement des données...");
    axios.get(`${DATA_API}/datasets/${id}/test`)
      .then(res => {
        const test = res.data;
        this.setState({ test });
        this.props.loadingAction(false, "");
      })
      .catch(err => {
        this.props.loadingAction(false, "");
      })
  }

  save = () => {
    this.saveDocs();
    this.saveReady();
  }

  saveDocs = () => {
    const { id } = this.props.match.params;
    const { docs } = this.state;
    const newDocs = { docs: docs };

    this.props.loadingAction(true, "Sauvegarde des documents...");
    axios.put(`${DATA_API}/datasets/${id}/docs`, newDocs, CONFIG)
      .then(() => {
        this.loadDocs();
      })
      .catch(err => {
        this.props.loadingAction(false, "");
      })
  }

  saveReady = () => {
    const { id } = this.props.match.params;
    const { ready } = this.state;
    const newReady = { ready: ready };

    this.props.loadingAction(true, "Sauvegarde...");
    axios.put(`${DATA_API}/datasets/${id}/ready`, newReady, CONFIG)
      .then(() => {
        this.loadReady();
      })
      .catch(err => {
        this.props.loadingAction(false, "");
      })
  }

  addLabel = (newName) => {
    const { id } = this.props.match.params;
    const newLabel = { label: [{ name: newName }]};

    this.props.loadingAction(true, "Ajout en cours...");
    axios.put(`${DATA_API}/datasets/${id}/labels`, newLabel, CONFIG)
      .then((res) => {
        this.loadLabels();
      })
      .catch(err => {
        this.props.loadingAction(false, "");
      })
  }

  updateTrained = () => {
    const { ready } = this.state;
    if(ready.length !== 0) {
      const { id } = this.props.match.params;
      let { trained } = this.state;
      const data = { trained: pushReadyDocsToArray(trained, ready) };
      
      this.props.loadingAction(true, "Modification en cours...");
      axios.put(`${DATA_API}/datasets/${id}/trained`, data, CONFIG)
        .then((res) => {
          this.loadTrained();
        })
        .catch(err => {
          this.props.loadingAction(false, "");
        })
    }
  }

  updateTest = () => {
    const { ready } = this.state;
    if(ready.length !== 0) {
      const { id } = this.props.match.params;
      let { test } = this.state;
      const data = { test: pushReadyDocsToArray(test, ready) };
      
      this.props.loadingAction(true, "Modification en cours...");
      axios.put(`${DATA_API}/datasets/${id}/test`, data, CONFIG)
        .then((res) => {
          const ready = [];
          this.setState({ pageNumber: 1,  ready });
          this.loadTest();
          this.save();
        })
        .catch(err => {
          this.props.loadingAction(false, "");
        })
    }
  }

  train = () => {
    const { ready } = this.state;
    if(ready.length > 0) {
      let docs = getReadyDocsFromDocs(this.state.docs, ready);
      const data = { model: this.state.dataset.model, data: docs };
      
      this.props.loadingAction(true, "Entrainement en cours...");
      axios.post(`${TRAIN_API}/update`, data, CONFIG)
        .then((res) => {
          updateConfidenceOfDocsAfterTraining(docs);
          this.updateTrained();
          const ready = [];
          this.setState({ pageNumber: 1,  ready });
          this.save();
        })
        .catch(err => {
          this.props.loadingAction(false, "");
        })
    }
  }

  predict = () => {
    let docs = excludeFromDocs(this.state.docs, this.state.trained);

    if(docs.length > 0) {
      const data = { model: this.state.dataset.model, data: docs };

      this.props.loadingAction(true, "Prédiction...");
      axios.post(`${TRAIN_API}/predict`, data, CONFIG)
        .then((res) => {
          const docs = replaceEntityAndConfidenceOfDocsPredicted(this.state.docs, res.data);
          this.setState({ docs });
          this.props.loadingAction(false, "");
        })
        .catch(err => {
          this.props.loadingAction(false, "");
        })
    }
  }

  addEntity = (label) => {
    const { selection } = this.state;
    if(label && label.name && selection.docId) {

      const newEntity = {
        start: selection.start,
        end: selection.end,
        label: label.name
      };

      const newDocs = addEntityToDocAndUpdateDocs(this.state.docs, selection.docId, newEntity);
      this.setState({ docs: newDocs });
    }
  }

  deleteEntity = (docId, entity) => {
    if(docId && entity) {
      const newDocs = deleteEntityOfDocAndUpdateDocs(this.state.docs, docId, entity);
      this.setState({ docs: newDocs });
    }
  }

  deleteAllEntitiesOfDocs = (docId) => {
    if(docId) {
      const newDocs = deleteAllEntitiesOfDocAndUpdateDocs(this.state.docs, docId);
      this.setState({ docs: newDocs });
    }
  }

  updateReady = (docId) => {
    let { ready } = this.state;

    if(ready.includes(docId)) {
      let index = ready.indexOf(docId);
      ready.splice(index, 1);
    }
    else {
      ready.push(docId);
    }
    this.setState({ ready });
  }

  updateSelection = (newSelection) => {
    if(newSelection && newSelection.docId) {
      this.setState({ selection: newSelection });
    }
  }

  changePageSize = (e) => {
    this.setState({ pageSize: Number(e.target.value) });
  }

  getNumberOfPages = (docsCount, pageSize) => {
    const nbrOfPages = Math.ceil(docsCount / pageSize);
    return nbrOfPages;
  }

  previousPage = () => {
    const { pageNumber } = this.state;
    const expectedPageNumber = pageNumber - 1;

    if(expectedPageNumber > 0)
      this.setState({ pageNumber: expectedPageNumber });
  }

  nextPage = (length) => {
    const { pageNumber, pageSize } = this.state;
    const expectedPageNumber = pageNumber + 1;
    const numberOfPages = this.getNumberOfPages(length, pageSize);

    if(expectedPageNumber <= numberOfPages)
      this.setState({ pageNumber: expectedPageNumber });
  }

  paginate = (array, size, number) => {
    if(array.length > 0) {
      let newArray = [];
      let i = (number - 1) * size;
      let len = (number * size);
      while(i < len) {
        if(array[i]) {
          newArray.push(array[i]);
        }
        i++;
      }

      return newArray;
    }
    return array;
  }

  filterDocs = (docs) => {
    const { trained, test } = this.state;
    let filteredDocs = excludeFromDocs(docs, trained);
    filteredDocs = excludeFromDocs(filteredDocs, test);
    return filteredDocs;
  }

  displaySettingDiv = (docsToDisplay) => {
    const ids = docsToDisplay.map(d => d._id);
    const numberOfPages = this.getNumberOfPages(docsToDisplay.length, this.state.pageSize) || 1;
    const { selection, pageNumber, pageSize, ready } = this.state;

    return(
      <div className="setting-div">
        <div className="row">
          <div className="six columns setting-info-div">
            <span className="setting-info-span">{`${pageNumber} / ${numberOfPages} pages`}</span>
            <span className="setting-info-span setting-info-select">
              <select onChange={(e) => this.changePageSize(e)} value={pageSize}>
                <option value="1">1</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
              {' '}par page
            </span>
            {' | '}<span className="setting-info-span">{`${ready.length} doc. prêt(s)`}</span>
          </div>
          <div className="six columns setting-btn-div">
            <button className="setting-btn" onClick={() => this.save()}>
              <svg width="1.3em" height="1.3em" viewBox="0 0 16 16" className="bi bi-cloud-upload-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0zm-.5 14.5V11h1v3.5a.5.5 0 0 1-1 0z"/>
              </svg>
            </button>
            {' | '}
            <button className="setting-btn" onClick={() => this.train()}>
              <svg width="1.3em" height="1.3em" viewBox="0 0 16 16" className="bi bi-cpu-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.5.5a.5.5 0 0 0-1 0V2A2.5 2.5 0 0 0 2 4.5H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2A2.5 2.5 0 0 0 4.5 14v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14a2.5 2.5 0 0 0 2.5-2.5h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14A2.5 2.5 0 0 0 11.5 2V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5zm1 4.5A1.5 1.5 0 0 0 5 6.5v3A1.5 1.5 0 0 0 6.5 11h3A1.5 1.5 0 0 0 11 9.5v-3A1.5 1.5 0 0 0 9.5 5h-3zm0 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
              </svg>
            </button>
            <button className="setting-btn" onClick={() => this.predict()}>
              <svg width="1.3em" height="1.3em" viewBox="0 0 16 16" className="bi bi-lightning-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
              </svg>
            </button>
            <button className="setting-btn" onClick={() => this.updateTest()}>
              <svg width="1.3em" height="1.3em" viewBox="0 0 16 16" className="bi bi-bookmark-check-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 0a2 2 0 0 0-2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4zm6.854 5.854a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
              </svg>
            </button>
            {' | '}
            <button className="setting-btn" onClick={() => this.deleteAllEntitiesOfDoc([selection.docId])}>
              <svg width="1.3em" height="1.3em" viewBox="0 0 16 16" className="bi bi-file-earmark-x-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M2 2a2 2 0 0 1 2-2h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm7.5 1.5v-2l3 3h-2a1 1 0 0 1-1-1zM6.854 7.146a.5.5 0 1 0-.708.708L7.293 9l-1.147 1.146a.5.5 0 0 0 .708.708L8 9.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 9l1.147-1.146a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146z"/>
              </svg>
            </button>
            <button className="setting-btn" onClick={() => this.deleteAllEntitiesOfDocs(ids)}>
              <svg width="1.3em" height="1.3em" viewBox="0 0 16 16" className="bi bi-x-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.146-3.146a.5.5 0 0 0-.708-.708L8 7.293 4.854 4.146a.5.5 0 1 0-.708.708L7.293 8l-3.147 3.146a.5.5 0 0 0 .708.708L8 8.707l3.146 3.147a.5.5 0 0 0 .708-.708L8.707 8l3.147-3.146z"/>
              </svg>
            </button>
            <button className="setting-btn" onClick={() => this.previousPage()}>
              <svg width="1.3em" height="1.3em" viewBox="0 0 16 16" className="bi bi-skip-backward-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M.5 3.5A.5.5 0 0 0 0 4v8a.5.5 0 0 0 1 0V4a.5.5 0 0 0-.5-.5z"/>
                <path d="M.904 8.697l6.363 3.692c.54.313 1.233-.066 1.233-.697V4.308c0-.63-.692-1.01-1.233-.696L.904 7.304a.802.802 0 0 0 0 1.393z"/>
                <path d="M8.404 8.697l6.363 3.692c.54.313 1.233-.066 1.233-.697V4.308c0-.63-.693-1.01-1.233-.696L8.404 7.304a.802.802 0 0 0 0 1.393z"/>
              </svg>
            </button>
            <button className="setting-btn" onClick={() => this.nextPage(docsToDisplay.length)}>
              <svg width="1.3em" height="1.3em" viewBox="0 0 16 16" className="bi bi-skip-forward-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.596 8.697l-6.363 3.692C.693 12.702 0 12.322 0 11.692V4.308c0-.63.693-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                <path d="M15.096 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.693-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  displayBackToDatasetProfileLink = (dataset) => {
    return(
      <div className="row" style={{ padding: 5 }}>
        <span>
          <svg style={{ verticalAlign: "middle" }} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-left-short" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M7.854 4.646a.5.5 0 0 1 0 .708L5.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0z"/>
            <path fillRule="evenodd" d="M4.5 8a.5.5 0 0 1 .5-.5h6.5a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/>
          </svg>
        </span>
        <Link to={`/donnees/${dataset._id}`}>{dataset.model}</Link>
      </div>
    )
  }

  render() {
    const { dataset, docs, labels, ready, pageNumber, pageSize } = this.state;
    const docsToDisplay = this.filterDocs(docs);
    const paginatedDocs = this.paginate(docsToDisplay, pageSize, pageNumber);
    paginatedDocs.sort((a, b) => (a.confidence - b.confidence));

    return(
      <div style={{position: "relative"}}>
        {dataset && this.displayBackToDatasetProfileLink(dataset)}
        <div className="annotation-fixed-header">
          <Labels dataset={this.state.dataset} labels={labels} addLabel={this.addLabel} addEntity={this.addEntity} />
          {this.displaySettingDiv(docsToDisplay)}
        </div>
        <DocCard 
          dataset={dataset} 
          docs={paginatedDocs}
          updateSelection={this.updateSelection}
          ready={ready}
          deleteEntity={this.deleteEntity}
          updateReady={this.updateReady} />
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

export default connect(mapStateToProps, mapDispatchToProps) (AnnotationLayout);