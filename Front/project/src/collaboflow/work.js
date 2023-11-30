import React from 'react';
import { Justify, PencilSquare,TrashFill } from 'react-bootstrap-icons';


class Work extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: JSON.parse(localStorage.getItem('userId')),
      selectedProjectId: JSON.parse(localStorage.getItem('selectedProjectId'))||'',
      tasks: [],
      newTask: {
        workTitle: '',
        workState:'',
      },
      isModalOpen: false,
      isUpdateModal:false,
      recentMentions: [],
      newMention:'',
      editingMentionId: null,
      changedWorkState:'',
      selectedWorkId:null,
    };
  }
  componentDidMount() {
    this.fetchData();
    console.log('처음 데이터',this.state.tasks)
  }
  
  fetchData = async () => {
    await this.fetchRecentMentions();
    await this.fetchWorks();
  }
  
  fetchWorks = async () => {
    try {
      const selectedProjectId = this.state.selectedProjectId;
      const response = await fetch(`http://localhost:3000/project/works?projectId=${encodeURIComponent(selectedProjectId)}`);
      const data = await response.json();
      console.log('id:', this.state.selectedProjectId);
      console.log('Fetched data:', data);
      this.setState((prevState) => ({
        tasks:data,
      }));
    } catch (error) {
      console.error('Error fetching works:', error);
    }
  }

  fetchRecentMentions = async () => {
    try {
      const selectedProjectId = this.state.selectedProjectId;
      const response = await fetch(`http://localhost:3000/project/work/metion?projectId=${encodeURIComponent(selectedProjectId)}`);
      const data = await response.json();

      this.setState({ recentMentions: data });
    } catch (error) {
      console.error('Error fetching recent mentions:', error);
    }
  };

  handleAddTask = async () => {
    try {
      const { newTask, selectedProjectId } = this.state;
  
      const response = await fetch(`http://localhost:3000/project/work?projectId=${encodeURIComponent(selectedProjectId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newTask, projectId: selectedProjectId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
  
      const data = await response.json();
  
      this.setState((prevState) => ({
        tasks: [...prevState.tasks, data],
        newTask: {
          workTitle: '',
          workState: '',
        },
        isModalOpen: false,
      }), () => {
        this.fetchData();
      });
  
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
  
    this.setState((prevState) => ({
      newTask: {
        ...prevState.newTask,
        [name]: value,
      },
    }));
  };
  handleUpdateChange = (e) => {
    const { name, value } = e.target;
  
    this.setState({
      changedWorkState: value,
    });
  };

  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  openUpdateModal = (workId) => {
    this.setState({ isUpdateModal: true ,selectedWorkId : workId});
    
  };

  closeupdateModal = () => {
    this.setState({ isUpdateModal: false });
  };


  handleMentionChange = (e) => {
    this.setState({ newMention: e.target.value });
  };

  registMention = async (workId) => {
    try {
      const { newMention, userId } = this.state;
  
      const response = await fetch(`http://localhost:3000/project/work/mention?projectId=${encodeURIComponent(workId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents: newMention, userId, workId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to register mention');
      }
  
      const data = await response.json();
      console.log('Mention registered successfully:', data);
      this.fetchData();
    } catch (error) {
      console.error('Error registering mention:', error);
    }
  };

  deleteMention = async (mentionId) => {
    try {
      const response = await fetch(`http://localhost:3000/project/work/mention/${encodeURIComponent(mentionId)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete Mention');
      }

    } catch (error) {
      console.error('Error delete mention:', error);
    }
    this.fetchData();
  };

  modifyMention = (mentionId) => {
    // Set the editingMentionId when PencilSquare is clicked
    this.setState({ editingMentionId: mentionId });
  
    // You can also pre-fill the newMention with the existing content if needed
    const editingMention = this.state.tasks
      .flatMap((task) => task.mentions)
      .find((mention) => mention.mentionId === mentionId);
  
    if (editingMention) {
      this.setState({ newMention: editingMention.content });
    }
  };
  
  handleEditComplete = async () => {
    try {
      const { newMention, editingMentionId } = this.state;
  
      if (!editingMentionId) {
        // If editingMentionId is not set, do nothing
        return;
      }
  
      // Update the mention content
      const response = await fetch(`http://localhost:3000/project/work/mention/${encodeURIComponent(editingMentionId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents: newMention }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to modify mention');
      }
  
      // Fetch the updated data and update the state
      await this.fetchWorks();
  
      // Clear the editing state after the operation
      this.setState({ editingMentionId: null, newMention: '' });
      this.fetchData();
    } catch (error) {
      console.error('Error modifying mention:', error);
    }
  };
  handleWorkDelete = async (workId) =>{
    try {
      const response = await fetch(`http://localhost:3000/project/work/${encodeURIComponent(workId)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete Mention');
      }

    } catch (error) {
      console.error('Error delete mention:', error);
    }
    this.fetchData();
  }

  handleUpdateWorkState = async () =>{
    const {changedWorkState, selectedWorkId} = this.state;
    try {
      const response = await fetch(`http://localhost:3000/project/work/${encodeURIComponent(selectedWorkId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({ workId:selectedWorkId, workState:changedWorkState}),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update workState');
      }
      
    } catch (error) {
      console.error('Error update workState:', error);
    }
    this.fetchData();
  }

  render() {
    const { tasks, newTask, isModalOpen } = this.state;
    const { selectedProject } = this.props;

    return (
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>
            작업{' '}
            
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              onClick={this.openModal}
            >
              작업 추가
            </button>
          </h1>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-xl-7">
              <div className="card">
                <div className="card-body">
                  <div className="accordion" id="accordionExample">
                  {Array.isArray(tasks) && tasks.map((task) => (
                    <div className="accordion-item" key={task.workId}>
                      <h2 className="accordion-header" id={`heading${task.workId}`}>
                      <button
                          className="accordion-button d-flex justify-content-between align-items-center"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${task.workId}`}
                          aria-expanded={task.workId === 1}
                          aria-controls={`collapse${task.workId}`}
                        >
                          <span>{task.workTitle}</span>
                          <span className="d-flex">
                            {task.workState === '1' && (
                              <button type="button" className="badge rounded-pill bg-secondary ms-3">
                                진행 예정
                              </button>
                            )}
                            {task.workState === '2' && (
                              <button type="button" className="badge rounded-pill bg-info text-dark ms-3">
                                진행 중
                              </button>
                            )}
                            {task.workState === '3' && (
                              <button type="button" className="badge rounded-pill bg-success ms-3">
                                완료
                              </button>
                            )}
                          </span>
                        </button>
                      </h2>
                      <div
                        id={`collapse${task.workId}`}
                        className={`accordion-collapse collapse ${task.workId === 1 ? 'show' : ''}`}
                        aria-labelledby={`heading${task.workId}`}
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          {task.mentions && task.mentions.length > 0 ? (
                            <div>
                              {task.mentions.map((mention, index) => (
                                <div key={index}>
                                  <h5 className="mentionUserName">{mention.name}</h5>
                                  <span className="mentionDate">{mention.registerDate}</span>
                                  <br />
                                  <span className="mentionContent">{mention.content}</span>
                                  <TrashFill
                                   onClick={() => this.deleteMention(mention.mentionId)}
                                  />
                                  <PencilSquare
                                  onClick={() => this.modifyMention(mention.mentionId)}
                                  />
                                </div>
                                
                              ))}
                              
                            </div>
                            
                          ) : (
                            <div/>
                          )}
                          
                          <div className="row mb-5">
                              <label htmlFor="rgistMention" className="col-sm-3 col-form-label">멘션 추가</label>
                              <div className="col-sm-9  d-flex ">
                              <input
                                  type="text"
                                  className="form-control flex-grow-1 me-3"
                                  id="rgistMention"
                                  value={this.state.newMention}  
                                  onChange={this.handleMentionChange}  
                                />
                                <button type="submit" className="btn btn-primary" onClick={() => this.registMention(task.workId)}>등록</button>
                                
                              </div>
                              
                            </div>
                            {this.state.editingMentionId && (
                              <div className="row mb-5">
                                <div className="col-sm-9 d-flex">
                                  <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={this.handleEditComplete}
                                  >
                                    수정 완료
                                  </button>
                                </div>
                              </div>
                            )}
                            <button
                                className="btn btn-success ml-auto"
                                style={{ height: '50px', width: '100px', marginBottom: '5px' }}
                                data-bs-toggle="modal"
                                data-bs-target="#updateModal" 
                                onClick={() => this.openUpdateModal(task.workId)}
                              >
                                상태 변경
                              </button>
                              <button
                                className="btn btn-danger ml-auto"
                                style={{ height: '50px', width: '100px', marginBottom: '5px' }}
                                onClick={()=>this.handleWorkDelete(task.workId)}
                              >
                                작업 삭제
                              </button>  
                        </div>
                        
                      </div>
                  </div>
                ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal */}
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    새 작업 추가
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
                  <label>
                    작업 이름:{' '}
                    <input
                      type="text"
                      name="workTitle"
                      value={newTask.workTitle}
                      onChange={this.handleInputChange}
                      className="rounded-input"
                    />
                  </label>
                  <label>
                    작업 상태:{' '}
                    <label>
                      <input
                        type="radio"
                        name="workState"
                        value="1"
                        checked={newTask.workState === '1'}
                        onChange={this.handleInputChange}
                      />
                      진행 예정{'  '}
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="workState"
                        value="2"
                        checked={newTask.workState === '2'}
                        onChange={this.handleInputChange}
                      />
                      진행 중{'  '}
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="workState"
                        value="3"
                        checked={newTask.workState === '3'}
                        onChange={this.handleInputChange}
                      />
                      완료
                    </label>
                  </label>
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
                    onClick={this.handleAddTask}
                    data-bs-dismiss="modal"
                  >
                    추가
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* 작업 수정 모달*/}
          <div
              className="modal fade"
              id="updateModal"
              tabIndex="-1"
              aria-labelledby="updateModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="updateModalLabel">
                      작업 상태 수정
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={this.closeupdateModal}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <label>
                        작업 상태:{' '}
                        <label>
                          <input
                            type="radio"
                            name="changedWorkState"
                            value="1"
                            checked={this.state.changedWorkState === '1'}
                            onChange={this.handleUpdateChange}
                          />
                          진행 예정{'  '}
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="changedWorkState"
                            value="2"
                            checked={this.state.changedWorkState === '2'}
                            onChange={this.handleUpdateChange}
                          />
                          진행 중{'  '}
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="changedWorkState"
                            value="3"
                            checked={this.state.changedWorkState === '3'}
                            onChange={this.handleUpdateChange}
                          />
                          완료
                        </label>
                      </label>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      onClick={this.closeupdateModal}
                    >
                      닫기
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={this.handleUpdateWorkState}
                      data-bs-dismiss="modal"
                    >
                      수정
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </section>
        {/* 새로운 UI 엘리먼트 (오른쪽에 배치) */}
          <div className="recentmention">
            <h5>최근 멘션</h5>
            {Array.isArray(this.state.recentMentions) && this.state.recentMentions.map((mention, index) => (
                <div key={index} className="card">
                  <div className="card-body">
                    <label className="labelContainer">
                      <h5 className="mentionUserName">{mention.name}</h5>
                      <span className="workName">{mention.workTitle}{' '}</span>
                      <span className="mentionDate">{mention.registerDate}</span>
                      <br />
                      <span className="mentionContent">{mention.content}</span>
                    </label>
                  </div>
                </div>
              ))}
          </div>
          {/* 새로운 UI 엘리먼트 (오른쪽에 배치) */}
      </main>
    );
  }
}

export default Work;
