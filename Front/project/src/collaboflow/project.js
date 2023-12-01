import React from 'react';


class Project extends React.Component{
    constructor(props) {
        super(props);
    
        this.state = {
          userProjects: [],
          projectId:[],
          selectedProject: JSON.parse(localStorage.getItem('selectedProjectName')) || '',
          selectedProjectId: JSON.parse(localStorage.getItem('selectedProjectId')) || '',
          userId: JSON.parse(localStorage.getItem('userId')) || '',
          showInviteModal:false,
          emails:[],
          teamMembers:[],
          emailInputs: [{ id: 1, value: '' }],
        };
      }
      handleEmailInputChange = (id, value) => {
        this.setState((prevState) => ({
          emailInputs: prevState.emailInputs.map((input) =>
            input.id === id ? { ...input, value } : input
          ),
        }));
      };
    
      addEmailInput = () => {
        this.setState((prevState) => ({
          emailInputs: [...prevState.emailInputs, { id: prevState.emailInputs.length + 1, value: '' }],
        }));
      };
    
      removeEmailInput = (id) => {
        this.setState((prevState) => ({
          emailInputs: prevState.emailInputs.filter((input) => input.id !== id),
        }));
      };

      componentDidMount(){
        this.viewTeamMembers();
      }

      viewTeamMembers = async () => {
        try {
          const selectedProjectId = this.state.selectedProjectId;
          const response = await fetch(`http://localhost:3000/project/manage/?projectId=${encodeURIComponent(selectedProjectId)}`);
          const data = await response.json();
    
          console.log('viewData : ',data)
          if (Array.isArray(data)) {
            const teamMembers = data.map((item) => item.name);
            this.setState({ teamMembers });
          } else if (data && typeof data === 'object' && data.name) {
            this.setState({ teamMembers: [data.name] });
          } else {
            console.error('Invalid data format:', data);
          }
        }
        catch (error) {
          console.error('Error:', error);
        }
        console.log('teamMembers: ',this.state.teamMembers);
      };

    inviteTeamMembers = async () => {
    try {
      const { selectedProjectId, emailInputs } = this.state;
      const emails = emailInputs.map((input) => input.value);

            const response = await fetch(`http://localhost:3000/project/${encodeURIComponent(selectedProjectId)}/team`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ emails: emails }),
            });
        
            if (!response.ok) {
              throw new Error('Failed');
            }
        
            const data = await response.json();
        
            this.setState(
                {
                  emails: [],
                  showInviteModal: false,
                  emailInputs: [{ id: 1, value: '' }], // Reset email inputs after inviting
                },
                () => {
                  
                }
            );
        
          } catch (error) {
            console.error('Error: ', error);
          }
          this.viewTeamMembers();
      }

      openModal = () => {
        this.setState({ openModal: true });
      };
    
      closeModal = () => {
        this.setState({ openModal: false });
      };
    
    render(){
        const selectedProject = this.state.selectedProject

        return(
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>선택한 프로젝트</h1>
                </div>

                <section className="section">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{selectedProject}</h5>
                                    <ul className="list-group">
                                    {this.state.teamMembers && this.state.teamMembers.map((teamMember, index) => (
                                        <li key={index} className="list-group-item">
                                            {teamMember}
                                            {console.log(teamMember)}
                                        </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="col-auto">
                        <button type="button" 
                            className="btn btn-success"
                            data-bs-toggle="modal"
                            data-bs-target="#newModal"
                            onclick={this.openModal}>
                          프로젝트 팀원 초대 테스트
                        </button>
                        </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="modal fade" id="newModal" tabIndex="-1" aria-labelledby="newModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="newModalLabel">
                            팀원 초대
                            </h5>
                            <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={this.closeModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form>
                            {this.state.emailInputs.map((input) => (
                                <div key={input.id} className="mb-3">
                                <label>
                                    팀원 이메일:{' '}
                                    <input
                                    type="text"
                                    name={`email-${input.id}`}
                                    className="rounded-input"
                                    value={input.value}
                                    onChange={(e) => this.handleEmailInputChange(input.id, e.target.value)}
                                    />
                                    <button type="button" className="btn btn-danger" onClick={() => this.removeEmailInput(input.id)}>
                                    삭제
                                    </button>
                                </label>
                                </div>
                            ))}
                            <button type="button" className="btn btn-primary" onClick={this.addEmailInput}>
                                추가
                            </button>
                            </form>
                        </div>
                            <div className="modal-footer">
                                <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={this.closeModal}
                                >
                                닫기
                                </button>
                                <button
                                type="button"
                                className="btn btn-primary"
                                onClick={this.inviteTeamMembers}
                                data-bs-dismiss="modal"
                                >
                                추가
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        )
    }
}
export default Project;