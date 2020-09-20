import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { DATA_API } from '../../utils/api/api';

// actions
import { loadingAction } from '../../actions/loading-actions';

import './css/dataset-profile.css';

class Dataset extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataset: undefined,
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
        this.setState({ dataset, name: dataset.name, model: dataset.model });
        this.props.loadingAction(false, "");
      })
      .catch(err => {
        this.props.loadingAction(false, "");
      })
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  getFinishRate = (total, finished) => {
    if(finished > 0 && total > 0)
      return (finished * 100) / total;
    return 0;
  }

  displayDatasetsTable = (dataset) => {
    return(
      <table className="u-full-width">
        <thead>
          <tr>
            <th># doc.</th>
            <th># doc. entrainés</th>
            <th># doc. test</th>
            <th># doc. prêts</th>
            <th># labels</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{dataset.docs.length}</td>
            <td>{dataset.trained.length}</td>
            <td>{dataset.test.length}</td>
            <td>{dataset.ready.length}</td>
            <td>{dataset.labels.length}</td>
          </tr>
        </tbody>
      </table>
    )
  }

  displayProfile = (dataset) => {
    return(
      <div>
        <div className="profile-nav">
          <Link className="profile-nav-link" to={`/annotation/${dataset._id}`}>Annotation</Link>
          <Link className="profile-nav-link" to={`/donnees/${dataset._id}/stats`}>Stats</Link>
          <Link className="profile-nav-link" to={`/donnees/${dataset._id}/stats`}>Documents</Link>
          <Link className="profile-nav-link" to={`/donnees/${dataset._id}/test`}>Test</Link>
        </div>
        <div className="row">
          <div className="ten columns">
            <label htmlFor="model" className="profile-header-label">Modèle:</label>
            <h5 id="model" className="profile-header-info">{dataset.model}</h5>
          </div>
          <div className="two columns">
            <label className="profile-header-label">Complétion:</label>
            <h5 className="profile-header-info right">{`${this.getFinishRate(dataset.docs.length, (dataset.trained.length + dataset.test.length)).toFixed(0)} %`}</h5>
          </div>
        </div>
        <div>
          {this.displayDatasetsTable(dataset)}
        </div>
      </div>
    );
  }

  render() {
    const { dataset } = this.state;

    return(
      <div className="container profile-container">
        {dataset && this.displayProfile(dataset)}
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

export default connect(mapStateToProps, mapDispatchToProps) (Dataset);