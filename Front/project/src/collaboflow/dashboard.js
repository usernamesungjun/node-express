import React from 'react';

class DashBoard extends React.Component{
    constructor(props) {
        super(props);
    
        this.state = {
          userId: JSON.parse(localStorage.getItem('userId')) || '',
          selectedProjectId: JSON.parse(localStorage.getItem('selectedProjectId')) || '',
          selectedProjectName:JSON.parse(localStorage.getItem('selectedProjectName')) || '',
          isModalOpen: false,
          newDocName:'',
          documents:[],
        };
        
      }
      openModal = () => {
        this.setState({ isModalOpen: true });
      };
    
      closeModal = () => {
        this.setState({ isModalOpen: false });
      };
      handleDocNameChange = (e) => {
        this.setState({ newDocName: e.target.value });
      };

      handleCreateDocument= async () => {
        try {
          const { newDocName, selectedProjectId } = this.state;
      
          const response = await fetch(`http://localhost:3000/project/create-document`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ projectId: selectedProjectId, documentName: newDocName }),
          });
          console.log(response)
          this.setState({newDocName:''})

          if (!response.ok) {
            throw new Error('Failed to add task');
          }
      
          const data = await response.json();
      
        } catch (error) {
          console.error('Error:', error);
        }
    }

    viewDocument = async () => {
        try {
          const selectedProjectId = this.state.selectedProjectId;
          const response = await fetch(`http://localhost:3000/project/document?projectId=${encodeURIComponent(selectedProjectId)}`);
          const data = await response.json();
    
          this.setState({documents:data});
        } catch (error) {
          console.error('Error fetching recent mentions:', error);
        }
        console.log('doc',this.state.documents)
      };

      componentDidMount(){
        this.viewDocument();
      }
      moveToDoc = (documentId) => {
        localStorage.setItem('selectedDocumentId', JSON.stringify(documentId));
        window.location.href = '/project/document';
      };
      

    render(){
        const selectedProjectName = this.state.selectedProjectName;

        return(
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>{selectedProjectName}
                            {'  '}<button type="button" 
                                        className="btn btn-success"
                                        data-bs-toggle="modal"
                                        data-bs-target="#docModal"
                                        onclick={this.openModal}>
                                    새 문서
                                    </button>
                    </h1>
                </div>

            <section className="section">
                <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">문서 목록</h5>
                        
                        <table className="table datatable">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">문서 명</th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                    <th scope="col">작성일</th>
                                </tr>
                            </thead>
                        <tbody>
                        {this.state.documents.map((document, index) => (
                            <tr key={index}>
                            <th scope="row">{document.documentId}</th>
                            <td onClick={() => this.moveToDoc(document.documentId)}>{document.documentName}</td>
                            <td>{' '}</td>
                            <td>{' '}</td>
                            <td>{document.registerDate}</td>
                            </tr>
                        ))}
                        </tbody>
                        </table>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            <div className="modal fade" id="docModal" tabIndex="-1" aria-labelledby="docModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="docModalLabel">
                            새 문서 생성
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.closeModal}></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <label>
                                    문서 이름:{' '}
                                    <input
                                    type="text"
                                    name="docName"
                                    value={this.state.newDocName}
                                    onChange={this.handleDocNameChange}
                                    className="rounded-input"
                                    />
                                </label>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={this.closeModal}>
                            닫기
                            </button>
                            <button type="button" className="btn btn-success" onClick={this.handleCreateDocument} data-bs-dismiss="modal">
                            생성
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        )
    }
}
export default DashBoard;
