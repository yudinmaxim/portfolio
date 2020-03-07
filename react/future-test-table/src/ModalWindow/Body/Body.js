import React from 'react';

export default (props) =>
    <div className="modal-body">
        <table className="table">
            <thead>
                <tr>
                    <th>
                        ID
                    </th>
                    <th>
                        First Name
                    </th>
                    <th>
                        Last Name
                    </th>
                    <th>
                        E-mail
                    </th>
                    <th>
                        Phone
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input className="form-control" type="text" placeholder="ID" name="id" onChange={props.changeInputData} /></td>
                    <td><input className="form-control" type="text" placeholder="First Name" name="firstName" onChange={props.changeInputData} /></td>
                    <td><input className="form-control" type="text" placeholder="Last Name" name="lastName" onChange={props.changeInputData} /></td>
                    <td><input className="form-control" type="text" placeholder="E-mail" name="email" onChange={props.changeInputData} /></td>
                    <td><input className="form-control" type="text" placeholder="Phone" name="phone" onChange={props.changeInputData} /></td>
                </tr>
            </tbody>
        </table>
    </div>