import React, { useState , Component } from 'react';
import Logoimg from "./CollaboFlow-remove.png";
import 'bootstrap/dist/css/bootstrap.css';
class Header extends React.Component {
  
  
  goToLoginPage = () => {
    window.location.href = '/login';
  };

  constructor(props) {
    super(props);

    this.state = {
      showProjectDropdown: false,
      loggedIn: true,
      selectedProject: '',
      userProjects: [],
      showNewProjectModal: false,//test
      newProjectData: {
        projectName: '',
        emailList: '',
      },//test
    };
  }
  handleShowNewProjectModal = () => {
    this.setState({
      showNewProjectModal: true,
    });
  };

  handleCloseNewProjectModal = () => {
    this.setState({
      showNewProjectModal: false,
    });
  };

  handleNewProjectDataChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newProjectData: {
        ...prevState.newProjectData,
        [name]: value,
      },
    }));
  };
  handleSaveProjectData = () => {
    const { newProjectData } = this.state;
    
    // 이곳에서 newProjectData를 사용하여 데이터를 저장하고 처리할 수 있습니다.
    console.log('New Project Data:', newProjectData);
  
    // 모달을 닫습니다.
    this.handleCloseNewProjectModal();
  };
  
  handleProjectDropdown = () => {
    this.setState((prevState) => ({
      showProjectDropdown: !prevState.showProjectDropdown,
    }));
  };

  componentDidMount() {
    // 서버에서 선택된 프로젝트와 사용자의 프로젝트 목록 데이터 가져오기

    this.setState({
      selectedProject: '창의융합종합설계', // 선택된 프로젝트 이름
      userProjects: ['디자인패턴', '컴퓨터비전', '다른 프로젝트 이름들'], // 사용자의 프로젝트 목록
    });
  }
  // 프로젝트를 선택할 때 실행되는 핸들러
  handleProjectSelect = (projectName) => {
    this.setState({
      selectedProject: projectName,
      showProjectDropdown: false, // 프로젝트 선택 후 드롭다운 숨김
    });
  };

  //선택한 프로젝트로 이동
  moveToAnotherProject = (projectName)=>{
    this.setState({
      //추가필요
    });
  };

  render() {
    const { selectedProject, userProjects } = this.state;

    const projectDropdownClass = this.state.showProjectDropdown ? "project-dropdown show" : "project-dropdown";

    return (
      <header id="header" className="header">
        <div className="d-flex justify-content-between align-items-center">
          <div className="logo">
            <img src={Logoimg} alt="logo" className="logo-img" />
            <span className="logo-span">CollaboFlow</span>
          </div>
          <div className='search-bar'>
            <span className="selected-project" onClick={this.handleProjectDropdown} >{selectedProject}</span>
          </div>
          <button
            className="project-plus-btn"
            class="project-plus-btn btn btn-light btn-sm"
            onClick={this.handleProjectDropdown}
          >+</button>
        </div>
        <div className={projectDropdownClass}>
          <ul>
            {userProjects.map((projectName, index) => (
              <li key={index} onClick={this.moveToAnotherProject}>{projectName}</li>
            ))}
            <button
            type="button"
            className="create-project"
            class="btn btn-light btn-default"
            onClick={this.handleShowNewProjectModal}
          >
            프로젝트 생성
          </button>
          </ul>
        </div>
        {this.state.showNewProjectModal && (
          <div className="new-project-modal">
            <div className="new-project-content">
              <p>프로젝트 이름:</p>
              <input
                type="text"
                name="projectName"
                value={this.state.newProjectData.projectName}
                onChange={this.handleNewProjectDataChange}
              />
              <p>초대할 팀원의 e-Mail (쉼표로 구분):</p>
              <input
                type="text"
                name="emailList"
                value={this.state.newProjectData.emailList}
                onChange={this.handleNewProjectDataChange}
              />
              <div className="modal-btns">
                <button type="button" class="btn btn-danger" onClick={this.handleCloseNewProjectModal}>닫기</button>
                <button type="button" class="btn btn-info" onClick={this.handleSaveProjectData}>저장</button>
              </div>
            </div>
          </div>
        )}
        <div className="header-right">
          {this.state.loggedIn ? (
            <button type="button" className='logout' class="btn btn-danger" onClick={this.goToLoginPage}>Logout</button>
          ) : (
            <button type="button" className='login' class="btn btn-info" onClick={this.goToLoginPage}>Login</button>
          )}
          <button type="button" className='mypage' class="btn btn-primary" >Mypage</button>
        </div>
      </header>
    );
  }
}

export default Header;
