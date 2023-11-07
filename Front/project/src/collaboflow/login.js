import React from 'react';
import { Link , Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

class Login extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loginId: '',
      pw: '',
    };
  }

    goToRegisterPage = () => {
        window.location.href = '/register';
      };
      handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
      };
    
      handleLogin = (e) => {
        e.preventDefault();
    
        const { loginId, pw } = this.state;
    
        // 서버로 로그인 데이터 보내기
        fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ loginId, pw }),
        })
          .then((response) => {
            if (response.ok) {
              console.log(response.body);
              return response.json();
              // 다른 작업 수행 또는 페이지 이동
            } else {
              throw new Error('Network response was not ok');
              // 오류 처리
            }
          })
          .then((data) => {
            localStorage.setItem('jwt', data.token); //토큰 가져오기
            alert("Log in Success!"); // Display an alert here
            window.location.href = '/work'; // 로그인 성공 시 work 페이지로 이동
            // Handle the data or perform other tasks
          })
          .catch((error) => {
            // 오류 처리
            console.error('There was a problem with the fetch operation:', error);
          });e.preventDefault();
      };

  render(){
    return (
    <main>
      <div className="container">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div className="d-flex justify-content-center py-4">
                  <a className="logo d-flex align-items-center w-auto">
                    <img src="assets/img/logo.png" alt="" />
                    <span className="d-none d-lg-block">CollboFlow</span>
                  </a>
                </div>
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="pt-4 pb-2">
                      <h5 className="card-title text-center pb-0 fs-4">Login</h5>
                      <p className="text-center small">Enter your ID & password to login</p>
                    </div>
                    <form className="row g-3 needs-validation" noValidate>
                    <div className="col-12">
                          <label htmlFor="yourID" className="form-label">
                            ID
                          </label>
                          <div className="input-group has-validation">
                            <span className="input-group-text" id="inputGroupPrepend"></span>
                            <input
                              type="text"
                              name="loginId"
                              className="form-control"
                              id="yourID"
                              required
                              onChange={this.handleInputChange}
                            />
                            <div className="invalid-feedback">Please enter your ID.</div>
                          </div>
                        </div>
                        <div className="col-12">
                          <label htmlFor="yourPassword" className="form-label">
                            Password
                          </label>
                          <input
                            type="password"
                            name="pw"
                            className="form-control"
                            id="yourPassword"
                            required
                            onChange={this.handleInputChange}
                          />
                          <div className="invalid-feedback">Please enter your password!</div>
                        </div>
                        <div className="col-12">
                          <button className="btn btn-primary w-100" type="submit" onClick={this.handleLogin}> 
                            Login
                          </button>
                        </div>
                         {/* <div className="form-check">
                          <input className="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe" />
                          <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                        </div> */}
                      <div className="col-12">
                        <p className="small mb-0">Don't have an account?{'  '}
                        <button type="button" class="btn btn-link" onClick={this.goToRegisterPage}>Create an account</button>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}};

export default Login;
