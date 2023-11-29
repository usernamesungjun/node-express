import React from 'react';

class Work extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProjectId: localStorage.getItem('selectedProjectId'),
      tasks: [],
      newTask: {
        title: '',
        content: '',
        taskState:'',
      },
      isModalOpen: false, // Add the state for modal visibility
      recentMentions: [
        {
          userName: '김상진',
          mentionDate: '2023-11-02',
          workName: '요구명세서 작성',
          mentionContent: '요구명세서 수정을 수정했습니다.',
        },
        {
          userName: '이치영',
          mentionDate: '2023-11-01',
          workName: '요구명세서 작성',
          mentionContent: '요구명세서 수정했습니다.',
        },
      ],
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

      console.log('workdata:', data);
      console.log('select project:', selectedProjectId);
    } catch (error) {
      console.error('Error fetching works:', error);
    }
  }

  fetchRecentMentions = async () => {
    try {
      const response = await fetch('');
      const data = await response.json();

      this.setState({ recentMentions: data });
    } catch (error) {
      console.error('Error fetching recent mentions:', error);
    }
  };

  handleAddTask = async () => {
    try {
      const { newTask, selectedProjectId } = this.state;
  
      const response = await fetch('http://localhost:3000/project/works', {
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
          title: '',
          content: '',
          taskState: '',
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
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <div className="accordion" id="accordionExample">
                  {tasks.map((task) => (
                     console.log(task.mentions),
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
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div>멘션이 없습니다.</div>
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
                        name="title"
                        value={newTask.title}
                        onChange={this.handleInputChange}
                        className="rounded-input"
                      />
                    </label>
                    <label>
                      작업 내용:{' '}
                      <input
                        type="text"
                        name="content"
                        value={newTask.content}
                        onChange={this.handleInputChange}
                        className="rounded-input"
                      />
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
                    <h5 className="mentionUserName">{mention.userName}</h5>
                    <span className="workName">{mention.workName}{' '}</span>
                    <span className="mentionDate">{mention.mentionDate}</span>
                    <br />
                    <span className="mentionContent">{mention.mentionContent}</span>
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
