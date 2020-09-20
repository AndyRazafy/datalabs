import React from 'react';

import Modal from 'react-modal';

import './css/label.css';

const customStyles = {
  content : {
    top                   : '25%',
    left                  : '33%',
    width                 : '30%',
    height                : 'fit-content'
  }
};

Modal.setAppElement('#root');
class Labels extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newName: '',
      createLabelModalIsOpen: false
    }
  }

  setNewName = (e) => {
    this.setState({ newName: e.target.value.trim() });
  }

  handleCreateLabelModal = () => {
    this.setState((oldState) => ({
      createLabelModalIsOpen: !oldState.createLabelModalIsOpen
     }));
  }

  nameAlreadyExists = () => {
    const { labels } = this.props;
    const newName = this.state.newName;

    for(let label in labels) {
      if(labels[label].name && labels[label].name.toLowerCase() === newName.toLowerCase())
        return true;
    }
    return false;
  }

  inputsAreEmpty = () => {
    const newName = this.state.newName;
    return (newName === '');
  }

  createLabel = () => {
    this.props.addLabel(this.state.newName);
    this.setState({ newName: '' })
    this.handleCreateLabelModal();
  }

  displayCreateLabelModal = () => {
    return(
      <Modal style={customStyles} isOpen={this.state.createLabelModalIsOpen} onRequestClose={() => this.handleCreateLabelModal()}>
        <div className="container"> 
          <h3 style={{borderBottom: "2px solid #eee"}}>Ajouter un label</h3>
          <form>
            <div className="row">
              <div className="six columns">
                <label htmlFor="nameInput">Nom</label>
                <input value={this.state.newName} onChange={(e) => this.setNewName(e)} className="u-full-width" style={{ width: 320 }} type="text" placeholder="ex: option" id="nameInput"/>
                <span style={{color: "#f00"}}>{this.nameAlreadyExists() && "Le nom existe déjà!"}</span>
              </div>
            </div>
            <div style={{marginTop: 20, paddingTop: 10, borderTop: "2px solid #eee", textAlign: "right"}}>
              <button type="button" className="button-primary" onClick={() => this.createLabel()} disabled={(this.nameAlreadyExists() || this.inputsAreEmpty()) ? true : false}>Ajouter</button>
            </div>
          </form>
        </div>
      </Modal>
    );
  }

  displayLabels = (labels) => {
    if(labels) {
      return(
        <React.Fragment>
          {labels.map((label, index) => (
            <button key={index} className="button-primary label-btn" onClick={() => this.props.addEntity(label)}>{label.name}</button>
          ))}
        </React.Fragment>
      );
    }
  }

  render() {
    const { dataset, labels } = this.props;
    return(
      <div className="label-div">
        {this.displayCreateLabelModal()}
        <div className="label-list">
          <button className="add-label-btn" onClick={() => this.handleCreateLabelModal()}>
            <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-plus-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4a.5.5 0 0 0-1 0v3.5H4a.5.5 0 0 0 0 1h3.5V12a.5.5 0 0 0 1 0V8.5H12a.5.5 0 0 0 0-1H8.5V4z"/>
            </svg>
          </button>
          {dataset && this.displayLabels(labels)}
        </div>
      </div>
    );
  }
}

export default Labels;
