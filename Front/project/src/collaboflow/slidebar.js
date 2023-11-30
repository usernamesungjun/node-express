import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class Sidebar extends React.Component {
  goToWorkPage = () => {
    window.location.href = '/project/works';
  };
  goToMeetingRoomPage = () => {
    window.location.href = '/project/meeting';
  };
  goToDocumentPage = () => {
    window.location.href = '/project/document';
  };
  goToSchedulePage = () => {
    window.location.href = '/project/schedule';
  };
  render(){
  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <a className="nav-link collapsed" onClick={this.goToWorkPage} >
            <i className="bi bi-grid"></i>
            <span>작업</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" onClick={this.goToMeetingRoomPage}>
            <i className="bi bi-menu-button-wide"></i><span>회의실</span><i className="bi bi-chevron-down ms-auto"></i>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#forms-nav" data-bs-toggle="collapse" onClick={this.goToDocumentPage}>
            <i className="bi bi-journal-text"></i><span>문서함</span><i className="bi bi-chevron-down ms-auto"></i>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#tables-nav" data-bs-toggle="collapse" onClick={this.goToSchedulePage}>
            <i className="bi bi-layout-text-window-reverse"></i><span>일정</span><i className="bi bi-chevron-down ms-auto"></i>
          </a>
        </li>
        
        <li className="nav-heading">Pages</li>
        
        <li className="nav-item">
          <a className="nav-link collapsed" href="pages-error-404.html">
            <i className="bi bi-dash-circle"></i>
            <span>Error 404</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link collapsed" href="pages-blank.html">
            <i className="bi bi-file-earmark"></i>
            <span>Blank</span>
          </a>
        </li>
      </ul>
    </aside>
  );
}}

export default Sidebar;
