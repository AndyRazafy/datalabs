import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// components
import NavBar from './components/navs/NavBar';
import Datasets from './components/datasets/Datasets';
import Dataset from './components/datasets/Dataset';
import CreateDataset from './components/datasets/CreateDataset';
import AnnotationLayout from './components/annotations/AnnotationLayout';
import Stats from './components/stats/Stats';
import Test from './components/test/Test';
import Loading from './components/loading/Loading';
import Message from './components/message/Message';

import './css/App.css';
import './css/skeleton.css';
import './css/normalize.css';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <Router>
          <div className="container">
            <NavBar />
            {this.props.loading && <Loading message={this.props.loadingMessage} />}
            <Switch>
              <Route path="/donnees/ajout" component={CreateDataset} />
              <Route path="/donnees/:id/stats" component={Stats} />
              <Route path="/donnees/:id/test" component={Test} />
              <Route path="/donnees/:id" component={Dataset} />
              <Route path="/annotation/:id" component={AnnotationLayout} />
              <Route exact path={["/", "/donnees"]} component={Datasets} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading.loading,
    loadingMessage: state.loading.loadingMessage
  };
};

export default connect(mapStateToProps)(App);
