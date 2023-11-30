import React, { useEffect } from "react";
import yorkie from 'yorkie-js-sdk';

class Document extends React.Component {
  constructor(props) {
    super(props);
    this.editorRef = React.createRef();
    this.state = {
      yorkieName: null,
      doc: null,
      client: null
    };
  }

  async componentDidMount() {
    const client = new yorkie.Client('https://api.yorkie.dev', {
      apiKey: 'cli78fbprhcevnm8qp8g' // Your API Key here
    });
    await client.activate();

    const doc = new yorkie.Document(`document-${this.state.yorkieName}`); // 문서 이름 변경
    await client.attach(doc);

    doc.subscribe((event) => {
      if (event.type === 'remote-change') {
        this.editorRef.current.value = doc.getRoot().text;
      }
    });

    this.editorRef.current.addEventListener('input', () => {
      doc.update((root) => {
        root.text = this.editorRef.current.value;
      });
    });

    doc.update((root) => {
      if (root.text) {
        this.editorRef.current.value = root.text;
      } else {
        root.text = 'Edit me.';
      }
    });
  }

  async componentWillUnmount() {
    // Detach the document and deactivate the client
    if (this.state.doc) {
      await this.state.client.detach(this.state.doc);
    }
    if (this.state.client) {
      await this.state.client.deactivate();
    }

    // Reset the state
    this.setState({ doc: null, client: null });
  }

  render() {
    return (
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>문서</h1>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-xl-10">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">New Document</h5>
                  <textarea
                    className="tinymce-editor"
                    ref={this.editorRef}
                    style={{ width: "100%", height: "300px" }}
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary">
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default Document;
