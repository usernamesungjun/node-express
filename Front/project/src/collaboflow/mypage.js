import React from 'react';

class Mypage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentPassword:"",
            changedPassword:"",
            userId: localStorage.getItem('userId'),
        }
    }
    handlePasswordChange = (event) => {
        this.setState({ changedPassword: event.target.value });
      };
    
      handleFormSubmit = (event) => {
        event.preventDefault();
    
        // Add your fetch logic here to update the password
        // using this.state.changedPassword and this.state.userId
        // Example:
        fetch('your-api-endpoint', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: this.state.userId,
            newPassword: this.state.changedPassword,
          }),
        })
          .then(response => response.json())
          .then(data => {
            // Handle success or error
          })
          .catch(error => {
            // Handle error
          });
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
                            <label htmlFor="inputText" className="col-sm-2 col-form-label">Name</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="inputText" readOnly />
                            </div>
                            </div>
                            <div className="row mb-3">
                            <label htmlFor="inputEmail" className="col-sm-2 col-form-label">Email</label>
                            <div className="col-sm-10">
                                <input type="email" className="form-control" id="inputEmail" readOnly/>
                            </div>
                            </div>
                            <div className="row mb-3">
                              {/* Adjusted grid system for password fields */}
                              <label htmlFor="inputPassword" className="col-sm-3 col-form-label">현재 비밀번호</label>
                              <div className="col-sm-8">
                              <input
                                    type="password"
                                    className="form-control"
                                    id="inputPassword"
                                    //onChange={}
                                    />
                              </div>
                            </div>
                            <div className="row mb-3">
                              <label htmlFor="inputPassword" className="col-sm-3 col-form-label">새 비밀번호</label>
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
                                    <button type="submit" className="btn btn-primary">수정</button>
                                </div>
                                <div className="col-auto">
                                    <button type="submit" className="btn btn-secondary">취소</button>
                                </div>
                            </div>
                        </form>
    
                    </div>
                  </div>
                  <div className="col-auto">
                        <button type="submit" className="btn btn-danger">회원 탈퇴</button>
                    </div>
                </div>
            </div>
            </section>
          </main>
        );
      }
    }

export default Mypage;