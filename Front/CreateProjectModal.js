import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

function CreateProjectModal({ show, onHide }) {
  const [projectName, setProjectName] = useState('');
  const [emailList, setEmailList] = useState('');

  const handleCloseModal = () => {
    setProjectName(''); // 모달이 닫힐 때 입력값 초기화
    setEmailList('');   // 모달이 닫힐 때 입력값 초기화
    onHide();
  };

  const handleSaveProject = () => {
    // 입력값을 사용하여 새 프로젝트를 생성하거나 저장하는 로직을 구현
    // 필요한 API 호출 등을 수행
    // 모달 닫기
    handleCloseModal();
  };

  return (
    <Modal show={show} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>프로젝트 생성</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label htmlFor="projectName" className="form-label">
              프로젝트 이름:
            </label>
            <input
              type="text"
              className="form-control"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="emailList" className="form-label">
              초대할 팀원 이메일 명단 (쉼표로 구분):
            </label>
            <input
              type="text"
              className="form-control"
              id="emailList"
              value={emailList}
              onChange={(e) => setEmailList(e.target.value)}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          닫기
        </Button>
        <Button variant="primary" onClick={handleSaveProject}>
          저장
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateProjectModal;
