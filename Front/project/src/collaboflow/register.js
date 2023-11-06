import React from 'react';
import { Link , Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      loginId: '',
      email: '',
      pw: '',
    };
  }

  goToLoginPage = () => {
    window.location.href = '/login';
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();

  // 서버로 데이터 보내기
  fetch('http://localhost:3000/register', {
    method: 'POST', // 또는 다른 HTTP 메서드 (GET, PUT, DELETE 등)
    headers: {
      'Content-Type': 'application/json', // 전송 데이터 타입에 따라 변경
    },
    body: JSON.stringify(this.state), // 데이터를 JSON 문자열로 변환하여 보냄
  })
    .then((response) => {
      if (response.ok) {
        console.log(response.body);
        return response.json();
      } else {
        // 서버 응답이 실패한 경우 처리
        throw new Error('Network response was not ok');
      }
    })
    .then((data) => {
      // 서버로부터 받은 데이터(data)를 처리
      console.log(data);
      // 여기에서 다른 작업을 수행할 수 있습니다.
    })
    .catch((error) => {
      // 오류 처리
      console.error('There was a problem with the fetch operation:', error);
    });e.preventDefault();
  };

  render() {
    return (
      <main>
        <div className="container">
          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                  <div className="d-flex justify-content-center py-4">
                    <a href="index.html" className="logo d-flex align-items-center w-auto">
                      <img src="assets/img/logo.png" alt="" />
                      <span className="d-none d-lg-block">CollboFlow</span>
                    </a>
                  </div>
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="pt-4 pb-2">
                        <h5 className="card-title text-center pb-0 fs-4">Create an Account</h5>
                        <p className="text-center small">Enter your personal details to create an account</p>
                      </div>
                      <form className="row g-3 needs-validation" noValidate onSubmit={this.handleSubmit}>
                        <div className="col-12">
                          <label htmlFor="yourName" className="form-label">
                            Your Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            id="yourName"
                            required
                            onChange={this.handleInputChange} // 입력 필드 값 변경 처리 추가
                          />
                          <div className="invalid-feedback">Please, enter your name!</div>
                        </div>
                        <div className="col-12">
                          <label htmlFor="yourEmail" className="form-label">
                            Your Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            id="yourEmail"
                            required
                            onChange={this.handleInputChange} // 입력 필드 값 변경 처리 추가
                          />
                          <div className="invalid-feedback">Please enter a valid email address!</div>
                        </div>
                        <div className="col-12">
                          <label htmlFor="yourID" className="form-label">
                            ID
                          </label>
                          <div className="input-group has-validation">
                            <span className="input-group-text" id="inputGroupPrepend"></span>
                            <input
                              type="text"
                              name="userID"
                              className="form-control"
                              id="yourID"
                              required
                              onChange={this.handleInputChange} // 입력 필드 값 변경 처리 추가
                            />
                            <div className="invalid-feedback">Please choose an ID.</div>
                          </div>
                        </div>
                        <div className="col-12">
                          <label htmlFor="yourPassword" className="form-label">
                            Password
                          </label>
                          <input
                            type="password"
                            name="password"
                            className="form-control"
                            id="yourPassword"
                            required
                            onChange={this.handleInputChange} // 입력 필드 값 변경 처리 추가
                          />
                          <div className="invalid-feedback">Please enter your password!</div>
                        </div>
                        <div className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              name="terms"
                              type="checkbox"
                              value=""
                              id="acceptTerms"
                              required
                            />
                            <label className="form-check-label" htmlFor="acceptTerms">
                              I agree and accept the <a href="#">terms and conditions</a>
                            </label>
                            <div className="invalid-feedback">You must agree before submitting.</div>
                          </div>
                        </div>
                        <div className="col-12">
                          <button className="btn btn-primary w-100" type="submit" onClick={this.handleSubmit}>
                            Create Account
                          </button>
                        </div>
                        <div className="col-12">
                          <p className="small mb-0">
                            Already have an account?{' '}
                            <button type="button" class="btn btn-link" onClick={this.goToLoginPage}>
                              Log in
                            </button>
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
  }
}

export default Register;

