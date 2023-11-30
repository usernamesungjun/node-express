import React, { useEffect } from 'react';

class Document extends React.Component{
  
  render(){
    return(<main id="main" className="main">
    <div className="pagetitle">
      <h1>문서</h1>
      
    </div>

    <section className="section">
      <div className="row">

        <div className="col-xl-10">

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">New Document</h5>
              <textarea className="tinymce-editor" style={{ width: '100%', height: '300px' }} >
              </textarea>
            </div>
            <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                  >
                    OK
                  </button>
                </div>
          </div>

        </div>
      </div>
    </section>
  </main>
  );};
}

export default Document;
