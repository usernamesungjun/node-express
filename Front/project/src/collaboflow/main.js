import React from 'react';
import {Routes, Route} from "react-router-dom";

const Main = () => {
  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Alerts</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="index.html">Home</a></li>
            <li className="breadcrumb-item">Components</li>
            <li className="breadcrumb-item active">Alerts</li>
          </ol>
        </nav>
      </div>

      <section className="section">
        <div className="row">
          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Default</h5>

                <div className="alert alert-primary alert-dismissible fade show" role="alert">
                  A simple primary alert—check it out!
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>

                {/* Add more alert components here */}
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h5 className="card-title">With Icon</h5>

                <div className="alert alert-primary alert-dismissible fade show" role="alert">
                  <i className="bi bi-star me-1"></i>
                  A simple primary alert with icon—check it out!
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>

                {/* Add more alert components with icons here */}
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Outlined</h5>

                <div className="alert border-primary alert-dismissible fade show" role="alert">
                  A simple primary outlined alert—check it out!
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>

                {/* Add more outlined alert components here */}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Default Solid Color</h5>

                <div className="alert alert-primary bg-primary text-light border-0 alert-dismissible fade show" role="alert">
                  A simple primary alert with solid color—check it out!
                  <button type="button" className="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>

                {/* Add more solid color alert components here */}
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h5 className="card-title">With Heading & Separator</h5>

                <div className="alert alert-primary alert-dismissible fade show" role="alert">
                  <h4 className="alert-heading">Primary Heading</h4>
                  <p>Et suscipit deserunt earum itaque dignissimos recusandae dolorem qui. Molestiae rerum perferendis laborum. Occaecati illo at laboriosam rem molestiae sint.</p>
                  <hr />
                  <p className="mb-0">Temporibus quis et qui aspernatur laboriosam sit eveniet qui sunt.</p>
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>

                {/* Add more alert components with headings and separators here */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Main;
