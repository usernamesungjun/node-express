import React from 'react';
import { PencilSquare,TrashFill } from 'react-bootstrap-icons';


class Work extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: localStorage.getItem('userId'),
      selectedProjectId: localStorage.getItem('selectedProjectId'),
      tasks: [],
      newTask: {
        workTitle: '',
        workState:'2',
      },
      isModalOpen: false, // Add the state for modal visibility
      recentMentions: [],
      newMention:'',
      editingMentionId: null,
    };
  }
  componentDidMount() {
    this.fetchData();
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
      console.log('newTask',newTask,'projectId: ',selectedProjectId);
      const response = await fetch(`http://localhost:3000/project/work?projectId=${encodeURIComponent(selectedProjectId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newTask, projectId: selectedProjectId }),
        
      });
      console.log(response.body);
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      const data = await response.json();
      console.log('Task added successfully:', data);
      this.setState((prevState) => ({
        tasks: [...prevState.tasks, data],
        newTask: {
          workTitle: '',
          workState: '',
        },
        isModalOpen: false,
      }));
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

  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
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
    } catch (error) {
      console.error('Error modifying mention:', error);
    }
  };

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
                  {tasks.map((task) => (
                    <div className="accordion-item" key={task.workId}>
                      <h2 className="accordion-header" id={`heading${task.workId}`}>
                        <button
                          className="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${task.workId}`}
                          aria-expanded={task.workId === 1}
                          aria-controls={`collapse${task.workId}`}
                        >
                          {task.workTitle}
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
                              <div className="col-sm-9  d-flex">
                              <input
                                  type="text"
                                  className="form-control flex-grow-1 me-3"
                                  id="rgistMention"
                                  value={this.state.newMention}  // Bind the value to newMention state
                                  onChange={this.handleMentionChange}  // Add onChange handler
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
        </section>
        {/* 새로운 UI 엘리먼트 (오른쪽에 배치) */}
          <div className="recentmention">
            <h5>최근 멘션</h5>
            {this.state.recentMentions.map((mention, index) => (
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
