import React from 'react';

class DashBoard extends React.component{

    constructor(props) {
        super(props);
    
        this.state = {
          userId: JSON.parse(localStorage.getItem('userId')) || '',
          selectedProjectId: JSON.parse(localStorage.getItem('selectedProjectId')) || '',
          selectedProjectName:JSON.parse(localStorage.getItem('selectedProjectName')) || '',
          isModalOpen: false,

        };
      }

    render(){
        return(
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Data Tables</h1>
                    <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item">Tables</li>
                        <li className="breadcrumb-item active">Data</li>
                    </ol>
                    </nav>
                </div>

            <section className="section">
                <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Datatables</h5>
                        <p>
                        Add lightweight datatables to your project with using the{' '}
                        <a href="https://github.com/fiduswriter/Simple-DataTables" target="_blank" rel="noopener noreferrer">
                            Simple DataTables
                        </a>{' '}
                        library. Just add <code>.datatable</code> class name to any table you wish to convert to a datatable
                        </p>

                        {/* Table with stripped rows */}
                        <table className="table datatable">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Position</th>
                            <th scope="col">Age</th>
                            <th scope="col">Start Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <th scope="row">1</th>
                            <td>Brandon Jacob</td>
                            <td>Designer</td>
                            <td>28</td>
                            <td>2016-05-25</td>
                            </tr>
                            <tr>
                            <th scope="row">2</th>
                            <td>Bridie Kessler</td>
                            <td>Developer</td>
                            <td>35</td>
                            <td>2014-12-05</td>
                            </tr>
                            <tr>
                            <th scope="row">3</th>
                            <td>Ashleigh Langosh</td>
                            <td>Finance</td>
                            <td>45</td>
                            <td>2011-08-12</td>
                            </tr>
                            <tr>
                            <th scope="row">4</th>
                            <td>Angus Grady</td>
                            <td>HR</td>
                            <td>34</td>
                            <td>2012-06-11</td>
                            </tr>
                            <tr>
                            <th scope="row">5</th>
                            <td>Raheem Lehner</td>
                            <td>Dynamic Division Officer</td>
                            <td>47</td>
                            <td>2011-04-19</td>
                            </tr>
                        </tbody>
                        </table>
                        {/* End Table with stripped rows */}
                    </div>
                    </div>
                </div>
                </div>
            </section>
            </main>
        )
    }
}
export default DashBoard;
