import React from 'react';

import './css/doc-card.css';

class DocCard extends React.Component {
  constructor(props) {
    super(props);
  }

  editSelection = () => {
    const selectionObj = (window.getSelection && window.getSelection());
    const selectionStr = selectionObj.toString();
    const anchorNode = selectionObj.anchorNode;
    const focusNode = selectionObj.focusNode;
    const anchorOffset = selectionObj.anchorOffset;
    const focusOffset = selectionObj.focusOffset;

    const position = anchorNode.compareDocumentPosition(focusNode);
    let forward = false;

    if(position === 0 && selectionObj.focusNode.parentElement.attributes['docid'] && selectionObj.focusNode.parentElement.attributes['startindex']) {
      forward = (focusOffset - anchorOffset) > 0;

      const docId = selectionObj.focusNode.parentElement.attributes['docid'].value;
      const startIndex = Number(selectionObj.focusNode.parentElement.attributes['startindex'].value)
      const selectionStart = forward ? (startIndex + anchorOffset) : (startIndex + focusOffset);
      const selectionEnd = selectionStart + selectionStr.length;

      let selection = { 
        docId,
        str: selectionStr,
        start: selectionStart,
        end: selectionEnd,
      }

      this.props.updateSelection(selection);
    }
  }

  displayMark = (text, entity, docId) => {
    return(
      <span key={entity.start} onSelect={(e) => this.preventEvent(e)}>
        <mark key={entity.start} className="mark">
          {text} 
          <span className="mark-label">
            {entity.label}
          </span>
          <span className="delete-mark-btn" onClick={() => this.props.deleteEntity(docId, entity)}>
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.146-3.146a.5.5 0 0 0-.708-.708L8 7.293 4.854 4.146a.5.5 0 1 0-.708.708L7.293 8l-3.147 3.146a.5.5 0 0 0 .708.708L8 8.707l3.146 3.147a.5.5 0 0 0 .708-.708L8.707 8l3.147-3.146z"/>
            </svg>
          </span>
        </mark>
      </span>
    );
  }

  displayText = (text, docId, startIndex) => {
    return(
      <span key={startIndex} docid={docId} startindex={startIndex}>
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
            tokens.push(this.displayText(temp, doc._id, start));
            temp = '';
          }
          tokens.push(this.displayMark(doc.text.substring(ent.start, ent.end), ent, doc._id));
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

  isReadyClassName = (docId) => {
    if(this.props.ready && this.props.ready.includes(docId))
      return "document doc-ready";
    else
      return "document";
  }

  displayDocs = (docs) => {
    if(docs.length > 0) {
      return(
        <div>
          {docs.map((item, index) => (
            <div key={index} className={`row ${this.isReadyClassName(item._id)}`}>
              <div className="eleven columns">
                <p className="text-container" contentEditable={true} suppressContentEditableWarning={true} spellCheck={false} onInput={(e) => this.inputHandle(e)} onSelect={() => this.editSelection()} onDragOver={(e) => this.preventEvent(e)} onKeyDown={(e) => this.preventEvent(e)}>
                  {this.displayEntities(item)}
                </p>
              </div>
              <div className="one columns check-ready">
                <input type="checkbox"  checked={this.props.ready.includes(item._id) ? true : false} onChange={() => this.props.updateReady(item._id)} />
              </div>
            </div>
          ))}
        </div>
      );
    }
    else {
      return(
        <div className="doc-empty-content-container">
          <p>0 documents à annoter</p>
        </div>
      );
    }
  }

  preventEvent = (event) => {
    event.preventDefault();
  }

  render() {
    const { docs } = this.props;

    return(
      <div className="doc-div">
        <div className="doc-div-body">
          {docs && this.displayDocs(docs)}
        </div>
      </div>
    );
  }
}

export default DocCard;