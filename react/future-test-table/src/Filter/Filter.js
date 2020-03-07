import React from 'react';

function Filter(props) {
    
    return (
        <form className="form-inline " onSubmit={props.filterSubmit}>
            <input className="form-control" type="text" placeholder="Строка поиска" onChange={props.filterChange} />
            <button className="btn btn-primary " type="submit">Найти</button>
        </form>
    );
};


export default Filter;