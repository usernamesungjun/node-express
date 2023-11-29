import React from 'react';

class Mypage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userEmail:"",
            userName:"",
            equalPassword:"",
            changedPassword:"",
            userId: localStorage.getItem('userId'),
        }
    }
    componentDidMount() {
      const userId = this.state.userId; // userId 가져오기
  
      const url = `http://localhost:3000/myPage?userId=${encodeURIComponent(userId)}`
  
        fetch(url)
        
        .then((response) => {
          if (!response.ok) {
            throw new Error('네트워크 응답이 올바르지 않습니다');
          }
          return response.json();
        })
        .then((data) => {
          this.setState({
            userName: data.name,
            userEmail:data.email,
          });
          console.log(data)
          console.log('email:',this.state)
        })
        .catch((error) => {
          console.error('에러:', error);
        });
    }
    handleEqualPasswordChange = (event) => {
      this.setState({ equalPassword: event.target.value });
    };

    handlePasswordChange = (event) => {
        this.setState({ changedPassword: event.target.value });
    };
    
      handleFormSubmit = (event) => {
        event.preventDefault();
        const userId = this.state.userId;
        const equalPassword = this.state.equalPassword;
        const changedPassword = this.state.changedPassword;

        if(equalPassword==changedPassword){
  
          fetch(`http://localhost:3000/myPage?userId=${encodeURIComponent(userId)}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: this.state.userId,
              pw: this.state.changedPassword,
            }),
          })
            .catch(error => {
            });
          }
          else{
            alert("입력한 비밀번호가 다릅니다");
          }
      };

    render() {
        return (
        <main id="main" className="main">
            <div className="pagetitle">
              <h1></h1>
              <nav>
                <ol className="breadcrumb">
                  
                </ol>
              </nav>
            </div>
            {/* End Page Title */}
            <section className="section">
              <div className="row">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">회원 정보 수정</h5>
                      {/* Floating Labels Form */}
                        <form>
                        <div className="row mb-3">
                            <label  className="col-sm-2 col-form-label">Name</label>
                            <div className="col-sm-10">
                                <div type="text" className="form-control" readOnly>{this.state.userName}</div>
                            </div>
                            </div>
                            <div className="row mb-3">
                            <label className="col-sm-2 col-form-label">Email</label>
                            <div className="col-sm-10">
                                <div  className="form-control" readOnly>{this.state.userEmail}</div>
                            </div>
                            </div>
                            <div className="row mb-3">
                              {/* Adjusted grid system for password fields */}
                              <label htmlFor="inputPassword" className="col-sm-3 col-form-label">새 비밀번호</label>
                              <div className="col-sm-8">
                              <input
                                    type="password"
                                    className="form-control"
                                    id="inputPassword"
                                    onChange={this.handleEqualPasswordChange}
                                    />
                              </div>
                            </div>
                            <div className="row mb-3">
                              <label htmlFor="inputPassword" className="col-sm-3 col-form-label">비밀번호 확인</label>
                              <div className="col-sm-8">
                                    <input
                                    type="password"
                                    className="form-control"
                                    id="inputPassword"
                                    onChange={this.handlePasswordChange}
                                    />
                                </div>
                            </div>
                            
                            <div className="row justify-content-center">
                                <div className="col-auto">
                                    <button type="submit" className="btn btn-primary" onClick={this.handleFormSubmit}>수정</button>
                                </div>
                                <div className="col-auto">
                                    <button type="submit" className="btn btn-secondary">취소</button>
                                </div>
                            </div>
                        </form>
    
                    </div>
                  </div>
                  {/* <div className="col-auto">
                        <button type="submit" className="btn btn-danger">회원 탈퇴</button>
                    </div> */}
                </div>
            </div>
            </section>
          </main>
        );
      }
    }

export default Mypage;