import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { DATA_API, CONFIG } from '../../utils/api/api';

// actions
import { loadingAction } from '../../actions/loading-actions';

import './css/datasets.css';

class Datasets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datasets: []
    }
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

  deleteDataset = (datasetId) => {
    this.props.loadingAction(true, "Suppression...");
    axios.delete(`${DATA_API}/datasets/${datasetId}`, CONFIG)
      .then(res => {
        this.loadData();
      })
      .catch(err => {
        this.props.loadingAction(false, "");
      })
  }

  getFinishRate = (total, finished) => {
    if(finished > 0 && total > 0)
      return (finished * 100) / total;
    return 0;
  }

  displayDatasetsTable = (datasetsArray) => {
    if(datasetsArray === undefined || datasetsArray.length === 0) {
      return(
        <div className="dts-empty-content-container">
          <p>0 modèles</p>
        </div>
      );
    }
    else {
      return(
        <table className="u-full-width">
          <thead>
            <tr>
              <th>Modèle</th>
              <th># labels</th>
              <th># doc.</th>
              <th># doc. test</th>
              <th># doc. entrainés</th>
              <th># doc. prêts</th>
              <th>Complétion</th>
              <th>Stats</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {datasetsArray.map((item, index) => (
              <tr key={index}>
                <td><Link to={`/donnees/${item._id}`}>{item.model}</Link></td>
                <td>{item.labels.length}</td>
                <td>{item.docs.length}</td>
                <td>{item.test.length}</td>
                <td>{item.trained.length}</td>
                <td>{item.ready.length}</td>
                <td>{`${this.getFinishRate(item.docs.length, (item.trained.length + item.test.length)).toFixed(0)} %`}</td>
                <td><Link to={`/donnees/${item._id}/stats`}>stats</Link></td>
                <td>
                  <div className="remove-btn" onClick={() => this.deleteDataset(item._id)}>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
                    </svg>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
  }

  render() {
    const { datasets} = this.state;

    return(
      <div className="dts-container">
        <Link to="/donnees/ajout" className="button-primary">
          Ajouter
        </Link>
        <br/>
        {`${datasets.length} modèle(s) trouvé(s)`}
        <div className="dts-content">
          {this.displayDatasetsTable(datasets)}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Datasets);