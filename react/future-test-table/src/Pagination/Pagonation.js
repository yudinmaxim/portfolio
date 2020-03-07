import React from 'react';
import './Pagination.css';

export default (props) =>
    <>
        <div className="col-4 text-left">
            <button onClick={props.prev} className="btn btn-primary ">Предыдущая</button>
        </div>
        <div className="col-4 text-center">
            <p className="">
                {props.curr} - {props.curr + props.onPage} из {props.totalPages}
            </p>
        </div>
        <div className="col-4 text-right">
            <button onClick={props.next} className="btn btn-primary ">Следующая</button>
        </div>
    </>