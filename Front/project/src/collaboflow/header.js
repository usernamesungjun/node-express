import React, { useState , Component } from 'react';
import Logoimg from "./CollaboFlow-remove.png";
import 'bootstrap/dist/css/bootstrap.css';
import { ArrowDownCircleFill } from 'react-bootstrap-icons';
class Header extends React.Component {
  
  
  goToLoginPage = () => {
    window.location.href = '/login';
    localStorage.clear();
  };
  goToMyPage = () => {
    window.location.href = '/mypage';
  };
  goToWorkPage = () => {
    window.location.href = '/project/works';
  };

  constructor(props) {
    super(props);

    this.state = {
      showProjectDropdown: false,
      loggedIn: true,
      userProjects: [],
      projectId:[],
      selectedProject: '',
      selectedProjectId: JSON.parse(localStorage.getItem('selectedProjectId')) || '',
      userId: JSON.parse(localStorage.getItem('userId')) || '',//로그인된 유저ID 가져오기
      showNewProjectModal: false,
      newProjectData: {
        projectName: '',
        teamMembers: '',
        personnel: 1,
      },
      selectedProjectName:localStorage.getItem('selectedProjectName'),
    };
  }
  
goToProjectPage= () => {
  window.location.href = '/project';
};

inviteTeam = async () => {
  try {
    const selectedProjectId = this.state.selectedProjectId;

    // Use the correct URL and fix the typo in 'emails'
    const response = await fetch(`http://localhost:3000/project/${encodeURIComponent(selectedProjectId)}/team`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emails: this.state.emails }), // Fix the typo here
    });

    if (!response.ok) {
      throw new Error('Failed to Invite');
    }
    // Clear emails and fetch data after a successful invite
    this.clearEmails();
    this.fetchData();
  } catch (error) {
    console.error('Error Invite:', error);
  }
};

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
  
    // 로컬 스토리지에서 토큰을 가져옵니다.
    const token = JSON.parse(localStorage.getItem('jwt'));
  
    //팀원 수 설정
    //const teamMembersCount = newProjectData.teamMembers.length + 1; // 1은 자신을 나타냅니다.
    // 서버로 전송할 데이터 준비
    const dataToSend = {
      projectName: newProjectData.projectName,
      teamMembers: '',
      personnel: 1,
    };
  
    // POST 요청을 보내는 옵션 설정
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // 토큰을 헤더에 추가
      },
      body: JSON.stringify(dataToSend),
    };
  
    // 서버 엔드포인트 URL 설정
    const serverEndpoint = 'http://localhost:3000/project';
  
    fetch(serverEndpoint, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('서버 응답:', data);
        // 필요한 처리를 추가하세요.
      })
      .catch((error) => {
        console.error('서버 요청 에러:', error);
      });
    this.handleCloseNewProjectModal();
  };
  
  
  
  handleProjectDropdown = () => {
    this.setState((prevState) => ({
      showProjectDropdown: !prevState.showProjectDropdown,
    }));
  };
  userProjectLoading(){
    const userId = this.state.userId; // userId 가져오기

    const url = `http://localhost:3000/projects?userId=${encodeURIComponent(userId)}`

    const storedProjectId = JSON.parse(localStorage.getItem('selectedProjectId')) || '';
    const storedProjectName = JSON.parse(localStorage.getItem('selectedProjectName')) || '';
      fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('네트워크 응답이 올바르지 않습니다');
        }
        return response.json();
      })
      .then((data) => {
        const projectId = data.map((project) => project.projectId);
        
        // 가져온 데이터로 userProjects 상태를 업데이트
        this.setState({
          userProjects: data,
          selectedProject: storedProjectName || data[0].projectName ||'none',
          projectId: projectId,
          selectedProjectId: storedProjectId || projectId[0] ||'',
          loading: false,
          selectedProjectName:storedProjectName || '',
        },
        ()=>{
          localStorage.setItem('selectedProjectId', JSON.stringify(this.state.selectedProjectId));
          localStorage.setItem('selectedProjectName', JSON.stringify(this.state.selectedProject));
        });
        
      })
      .catch((error) => {
        // console.error('에러:', error);
        this.setState({ loading: false });
      });
  }
  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    await this.userProjectLoading();
  }

  // 프로젝트를 선택할 때 실행되는 핸들러
  handleProjectSelect = (project) => {
    // Update state
    this.setState({
      selectedProject: project.projectName,
      selectedProjectId: project.projectId,
      showProjectDropdown: false,
    }, () => {
      // 선택한 프로젝트로 seletedProjectId 변경
      localStorage.setItem('selectedProjectId', JSON.stringify(this.state.selectedProjectId));
      localStorage.setItem('selectedProjectName', JSON.stringify(this.state.selectedProject));
      this.goToWorkPage();
    });
  };

  render() {
    const { selectedProject, userProjects , loading, selectedProjectName } = this.state;
    const projectDropdownClass = this.state.showProjectDropdown ? "project-dropdown show" : "project-dropdown";

    if (loading) {
      return <div>Loading...</div>; // 로딩 중일 때 로딩 메시지 표시
    }
    return (
      <header id="header" className="header">
        <div className="d-flex justify-content-between align-items-center">
          <div className="logo">
            <img src={Logoimg} alt="logo" className="logo-img" />
            <span className="logo-span">CollaboFlow</span>
          </div>
          <div className='search-bar'>
            <span className="selected-project" onClick={this.handleProjectDropdown} >{selectedProjectName}</span>
          </div>
          <ArrowDownCircleFill
            className="project-plus-btn"
            size={25}
            onClick={this.handleProjectDropdown}
          >+</ArrowDownCircleFill>
        </div>
        <div className={projectDropdownClass}>
          <ul>
          {userProjects.map((project, index) => (
            <li key={index} onClick={() => this.handleProjectSelect(project)}>{project.projectName}</li>
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
              <p>프로젝트 이름</p>
              <input
                type="text"
                name="projectName"
                value={this.state.newProjectData.projectName}
                onChange={this.handleNewProjectDataChange}
              />
              <div className="modal-btns">
                <button type="button" class="btn btn-danger" onClick={this.handleCloseNewProjectModal}>닫기</button>
                <button type="button" class="btn btn-info" onClick={this.handleSaveProjectData}>생성</button>
              </div>
            </div>
          </div>
        )}
        <div className="header-right">
        <button type="button" className="btn btn-primary" onClick={this.goToProjectPage}>프로젝트 관리</button>
          {this.state.loggedIn ? (
            <button type="button" className='logout' class="btn btn-danger" onClick={this.goToLoginPage}>Logout</button>
          ) : (
            <button type="button" className='login' class="btn btn-info" onClick={this.goToLoginPage}>Login</button>
          )}
          <button type="button" className='mypage' class="btn btn-primary" onClick={this.goToMyPage}>Mypage</button>
        </div>
      </header>
    );
  }
}

export default Header;
