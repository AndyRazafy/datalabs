import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { DATA_API, TRAIN_API, CONFIG } from '../../utils/api/api';

import { Bar } from 'react-chartjs-2';

// actions
import { loadingAction } from '../../actions/loading-actions';

import { getLabelsCounts, getLabelEvalutation, getTestDocs, generateRGBA } from './functions/stat-func';

import './css/stat.css';

class Stats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataset: undefined,
      evaluation: undefined,
    }
  }

  componentDidMount = () => {
    this.initData();
  }

  initData = () => {
    const { id } = this.props.match.params;
    this.props.loadingAction(true, "Chargement...");
    axios.get(`${DATA_API}/datasets/${id}`)
      .then(res => {
        const dataset = res.data;
        this.evaluate(dataset);
        this.setState({ dataset });
        this.props.loadingAction(false, "");
      })
      .catch(err => {
        this.props.loadingAction(false, "");
      })
  }

  evaluate = (dataset) => {
    const testDocs = getTestDocs(dataset.docs, dataset.test);
    const data = { model: dataset.model, data: testDocs };

    this.props.loadingAction(true, "Evaluation...");
    axios.post(`${TRAIN_API}/evaluate`, data, CONFIG)
      .then(res => {
        const evaluation = res.data;
        this.setState({ evaluation });
        this.props.loadingAction(false, "");
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

  displayLabelCountsChart = (dataset) => {
    if(dataset) {
      const { labels, docs } = dataset;
      const labelNames = labels.map(l => l.name);
      const data = getLabelsCounts(labelNames, docs);
      //const backgroundColor = generateRGBA(labelNames.length);

      const chartData = {
        labels: labelNames,
        datasets: [
          {
            label: 'Occurence',
            data,
            barThickness: 20,
            backgroundColor: "rgba(104, 131, 186, 1)"
          }
        ]
      };

      return(
        <Bar data={chartData}
          options={{
            scales: {
            yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }}}
        />
      );
    }
  }

  displayLabelEvaluationChart = (dataset, evaluation) => {
    if(dataset.test.length > 0 && dataset.trained.length > 0) {
      const { labels } = dataset;
      const labelNames = labels.map(l => l.name);

      const chartData = {
        labels: labelNames,
        datasets: [
          {
            label: "Precision",
            backgroundColor: "rgba(55, 57, 58, 1)",
            barThickness: 20,
            data: getLabelEvalutation(evaluation, labelNames, "p")
          },
          {
            label: "Recall",
            backgroundColor: "rgba(119, 182, 234, 1)",
            barThickness: 20,
            data: getLabelEvalutation(evaluation, labelNames, "r")
          },
          {
            label: "F-score",
            backgroundColor: "rgba(214, 230, 129, 1)",
            barThickness: 20,
            data: getLabelEvalutation(evaluation, labelNames, "f")
          }
         ]
      };

      return(
        <Bar data={chartData}
          options={{
            scales: {
            yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }}}
        />
      );
    }
  }

  displayDatasetInfo = (dataset) => {
    return(
      <div>
        <ul>
          <li>{`Modèle: ${dataset.model}`}</li>
          <li>{`label(s): ${dataset.labels.length}`}</li>
          <li>{`doc(s): ${dataset.docs.length}`}</li>
          <li>{`complétion: ${this.getFinishRate(dataset.docs.length, (dataset.trained.length + dataset.test.length)).toFixed(0)}%`}</li>
        </ul>
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
    const { dataset, evaluation } = this.state;
    return(
      <div>
        {dataset && this.displayBackToDatasetProfileLink(dataset)}
        <div className="container">
          <div className="chart">
            {dataset && this.displayDatasetInfo(dataset)}
            {dataset && this.displayLabelCountsChart(dataset)}
          </div>
          <div className="chart">
            {dataset && this.displayDatasetInfo(dataset)}
            {dataset && evaluation && this.displayLabelEvaluationChart(dataset, evaluation)}
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Stats);