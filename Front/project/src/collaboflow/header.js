import React, {useState} from 'react';
import { Button, Modal } from 'react-bootstrap';
import CreateProjectModal from './CreateProjectModal';
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
      showCreateProjectModal: false,
      loggedIn: false,
      selectedProject: '', // 선택된 프로젝트 이름
      userProjects: [], // 사용자의 프로젝트 목록
    };
  }

  handleProjectDropdown = () => {
    this.setState((prevState) => ({
      showProjectDropdown: !prevState.showProjectDropdown,
    }));
  };

  handleShowCreateProjectModal = () => {
    this.setState({ showCreateProjectModal: true });
  };

  handleCloseCreateProjectModal = () => {
    this.setState({ showCreateProjectModal: false });
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
            onClick={this.handleShowCreateProjectModal} // 모달 열기
          >
            프로젝트 생성
          </button>
          </ul>
        </div>
        {/* CreateProjectModal을 렌더링하고 필요한 상태와 핸들러를 전달 */}
        {this.state.showCreateProjectModal && (
          <CreateProjectModal
            show={this.state.showCreateProjectModal}
            onHide={this.handleCloseCreateProjectModal}
          />
        )}
        <div className="header-right">
          {this.state.loggedIn ? (
            <button type="button" className='logout' class="btn btn-danger">Logout</button>
          ) : (
            <button type="button" className='login' class="btn btn-info" onClick={this.goToLoginPage}>Login</button>
          )}
          <button type="button" className='mypage' class="btn btn-primary">Mypage</button>
        </div>
      </header>
    );
  }
}

export default Header;
