import React from 'react';

class Work extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      newTask: {
        title: '',
        content: '',
      },
      isModalOpen: false, // Add the state for modal visibility
    };
  }

  handleAddTask = () => {
    const { tasks, newTask } = this.state;
    const updatedTasks = [...tasks, { ...newTask, id: tasks.length + 1 }];

    this.setState({
      tasks: updatedTasks,
      newTask: {
        title: '',
        content: '',
      },
      isModalOpen: false, // Close the modal after adding a task
    });
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
                      <div className="accordion-item" key={task.id}>
                        <h2 className="accordion-header" id={`heading${task.id}`}>
                          <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${task.id}`}
                            aria-expanded={task.id === 1}
                            aria-controls={`collapse${task.id}`}
                          >
                            {task.title}
                          </button>
                        </h2>
                        <div
                          id={`collapse${task.id}`}
                          className={`accordion-collapse collapse ${
                            task.id === 1 ? 'show' : ''
                          }`}
                          aria-labelledby={`heading${task.id}`}
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body">
                            <strong>{task.title}</strong> {task.content}
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
      </main>
    );
  }
}

export default Work;
