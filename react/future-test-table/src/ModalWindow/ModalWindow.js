import React from 'react';
import PropTypes from 'prop-types'; // ES6

import './ModalWindow.css';

import Header from "./Header/Header";
import Body from "./Body/Body";
import Footer from "./Footer/Footer";

class ModalWindow extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        dataWorker: PropTypes.func
      }
    
      static defaultProps = {
        title: 'Добавление данных в таблицу',
        dataWorker: () => console.log('dataWorker must be function')
      }

    constructor(props) {
        super(props);

        // данные ввода модального окна
        this.data = {
            id: undefined,
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: {
                streetAddress: '',
                city: '',
                state: '',
                zip: ''
            },
            description: '',
        };

        this.state = {
            addDisable: true,   // активатор кнопки добавления записи
            modal: {
                value: false,
            },
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.addElement = this.addElement.bind(this);
        this.changeInputData = this.changeInputData.bind(this);
    }

    openModal() {
        console.log('Modal Component Open Hi self');

        this.setState(
            {
                modal: {
                    value: true,
                },
            }
        );
    }

    closeModal() {
        //    this.modal.close();
        this.setState(
            {
                modal: {
                    display: { display: 'none' },
                    value: false,
                },
            }
        );
    }

    // вызываем родительскую функцию оббработки данных
    // для передачи данных родителю
    addElement() {
        
        // поскольку data обновляет автоматически по вводу
        // достаточно просто добавить её в состояние компонента
        this.props.dataWorker(this.data);

        this.closeModal();
    }

    // по изменению каждого поля обновляем соответствующее значение буфера
    changeInputData(event) {
        let disabled = 0;   // счетчик активации кнопки "Добавить"

        // пишем значение в то поле данных
        // в котором происходят изменения
        this.data[event.target.name] = event.target.value;

        event.preventDefault();

        // подсчитываем число изменившихся полей
        for (let key in this.data) {
            if (this.data[key] !== undefined && this.data[key].length > 0) disabled++;
        }

        // всего у нас 5 полей, если изменились все 5 - данные можно добавлять
        // активируем кнопку "Добавить"
        if (disabled === 5) {
            this.setState({
                addDisable: false,
            });
        } else { // это необходимо для деактивации кнопки, если данные изменились
            this.setState({
                addDisable: true,
            });
        }
    }

    render() {

        return (
            <div >
                <button onClick={() => this.openModal()} className="btn btn-primary ">Добавить элемент таблицы</button>

                {this.state.modal.value
                    ? <div>
                        <div className="modal-window">
                                {<Header title={this.props.title} />}
                                {<Body changeInputData={this.changeInputData} />}
                                {<Footer
                                    addDisable={this.state.addDisable}
                                    addElement={this.addElement}
                                    closeModal={this.closeModal}
                                />}
                        </div>
                        <div className="bg" onClick={e => this.closeModal(e)} />
                    </div>
                    :
                    <div></div>
                }
            </div>
        );
    }
}

export default ModalWindow;