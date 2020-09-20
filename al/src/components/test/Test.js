import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { DATA_API, TRAIN_API, CONFIG } from '../../utils/api/api';

// actions
import { loadingAction } from '../../actions/loading-actions';

class Test extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataset: undefined,
      result: undefined
    }

    this.textArea = React.createRef();
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
        this.setState({ dataset });
        this.props.loadingAction(false, "");
      })
      .catch(err => {
        this.props.loadingAction(false, "");
      })
  }

  predict = () => {
    if(this.textArea.current.value.length > 0) {
      const { dataset } = this.state;
      
      const docs = [{ text: this.textArea.current.value, ents: [], confidence: 0 }];
      const data = { model: dataset.model, data: docs };

      this.props.loadingAction(true, "Prédiction...");
      axios.post(`${TRAIN_API}/predict`, data, CONFIG)
        .then((res) => {
          this.setState({ result: res.data });
          this.props.loadingAction(false, "");
        })
        .catch(err => {
          this.props.loadingAction(false, "");
        })
    }
  }

  displayMark = (text, entity) => {
    return(
      <span key={entity.start} onSelect={(e) => this.preventEvent(e)}>
        <mark key={entity.start} className="mark">
          {text} 
          <span className="mark-label">
            {entity.label}
          </span>
        </mark>
      </span>
    );
  }

  displayText = (text, startIndex) => {
    return(
      <span key={startIndex} startindex={startIndex}>
        {text}
      </span>
    );
  }

  isStartOfEntity = (index, ents) => {
    for(let i in ents) {
      if(ents[i].start === index)
        return ents[i];
    }
    return undefined;
  }

  displayEntities = (doc) => {
    if(doc) {
      let tokens = [];
      let len = doc.text.length;
      let index = 0;
      let ent = undefined;
      let temp = '';
      let start = 0;

      while(index < len) {
        ent = this.isStartOfEntity(index, doc.ents);

        if(ent) {
          if(temp) {
            tokens.push(this.displayText(temp, start));
            temp = '';
          }
          tokens.push(this.displayMark(doc.text.substring(ent.start, ent.end), ent));
          start = ent.end;
          index = (ent.end - 1);
        }
        else
          temp += doc.text[index];

        index++;
      }

      if(temp)
        tokens.push(this.displayText(temp, doc._id, start));

      return tokens;
    }
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
    const { dataset, result } = this.state;

    return(
      <div style={{position: "relative"}}>
        {dataset && this.displayBackToDatasetProfileLink(dataset)}
        <div className="row">
          <div className="five columns">
            <div className="eleven columns">
              <label style={{ borderBottom: "1px solid #000" }}>Text</label>
              <textarea ref={this.textArea} className="u-full-width"></textarea>
            </div>
          </div>
          <div className="two columns" style={{ margin: 0 }}>
            <button className="button-primary" onClick={() => this.predict()}>
              <svg width="1.3em" height="1.3em" viewBox="0 0 16 16" className="bi bi-lightning-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
              </svg>
            </button>
          </div>
          <div className="five columns" style={{ margin: 0 }}>
            <label style={{ borderBottom: "1px solid #000" }}>Résultat</label>
            <p>
              {result && this.displayEntities(result[0])}
            </p>
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

export default connect(mapStateToProps, mapDispatchToProps) (Test);