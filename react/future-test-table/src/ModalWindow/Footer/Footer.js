import React from 'react';
/*  {/*
this.addDisable
  ? <button onClick={() => this.addElement()} disabled className="btn btn-primary " id="add" type="button">Добавить в таблицу</button>
  : <button onClick={() => this.addElement()} className="btn btn-primary " id="add" type="button">Добавить в таблицу</button>
/}*/
function Footer(props) {
    return (
        <footer className="modal-footer">

            {
                props.addDisable
                    ? <button onClick={props.addElement.bind(null, 'add')} disabled className="btn btn-primary " id="add" type="button">Добавить в таблицу</button>
                    : <button onClick={props.addElement.bind(null, 'add')} className="btn btn-primary " id="add" type="button">Добавить в таблицу</button>
            }
            <button onClick={props.closeModal.bind(null, 'close')} className="btn btn-primary " id="close" type="button">Отмена</button>
        </footer>
    );
}
export default Footer;