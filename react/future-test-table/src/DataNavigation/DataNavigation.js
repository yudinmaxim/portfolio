import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6

import DataTable from '../DataTable/DataTable';
import Loader from '../Loader/Loader';
import UserDetail from '../UserDetail/UserDetail';
import Filter from '../Filter/Filter';
import ModalWindow from '../ModalWindow/ModalWindow';
import Pagination from '../Pagination/Pagonation';

const ASC_SYMBOL = '↑';
const DESC_SYMBOL = '↓';

const PAGINATION_LIMIT = 50;

class DataNavigation extends Component {
  state = {
    isLoading: true,            // флаг загрузки данных/приложения
    allData: [],                // все считанные данные (архивная копия оных)
    data: [],                   // рабочие данные (отфильтрованные)
    sort: {                     // параметры сортировки данных
      sign: ASC_SYMBOL,         // направление/отображения типа сортировки
      field: 'id',              // поле сортировки (по умолчанию id)
      lastField: '',            // последнее сортированное поле - сохраняем направление сортировки для каждого поля
    },
    row: null,                  // выбранная строка - для отображения данных из таблицы
    pagination: {               // параметры для постраничного отражения данных
      start: 0,                 // начальный инджекс
      limit: PAGINATION_LIMIT,  // предельная длина нс транице
    }
  }

  static propTypes = {
    dataType: PropTypes.string
  }

  static defaultProps = {
    dataType: 'http://ya.ru'
  }

  // при обновлении компонента проверяем изменение пропсов
  // обновляем по неоходимости данные
  async componentDidUpdate(prevProps) {
    console.log(`Update Data From Server`);
    if (this.props.dataType !== prevProps.dataType) {
      // если при обновлении изменились важные нам пропсы - работаем

      // установим индикатор загрузки данных
      this.setState({
        isLoading: true,
      });

      const data = await this.getDataFromServer(this.props.dataType);

      this.setState({
        isLoading: false,
        allData: data,
        data: data,
        pagination: {
          start: this.state.pagination.start,
          limit: this.state.pagination.limit,
        },
      });
    }
  }
  // системная функция React - зарезервированное название
  async componentDidMount() {
    console.log(`Get Data From Server`);

    const data = await this.getDataFromServer(this.props.dataType);

    this.setState({
      isLoading: false,
      allData: data,
      data: data,
      pagination: {
        start: this.state.pagination.start,
        limit: this.state.pagination.limit,
      },
    });
  };


  async getDataFromServer(URL) {
    // качаем данные
    const response = await fetch(URL);
    // парсим данные и сразу же сортируем их по столбцу "по-умолчанию"
    const data = (await response.json()).sort((a, b) => {
      if (a[this.state.sort.field] > b[this.state.sort.field]) {
        return this.state.sort.sign === ASC_SYMBOL ? 1 : -1;
      }
      if (a[this.state.sort.field] < b[this.state.sort.field]) {
        return this.state.sort.sign === ASC_SYMBOL ? -1 : 1;
      }
      return 0;
    });

    return data;
  }

  // функция фильтрации данных: ищет вохдение строки с учетом регистра символов
  // fields - массив полей по которым проводм поиск
  // value - искомая строка
  filterInputData(data, value, fields) {

    // снижаем время отработки, если искомая строка нулевая или не вводилась совсем
    if (value === undefined || value.length === 0) return data;

    return data.filter((item) => {
      let correct = 0;  // счетчик совпадений

      // для каждого поля, по которому идёт фильтрация
      // проверяем его наличие в данных
      // если поле есть - обрбабатываем его фильтром
      fields.forEach((field) => {
        if (item[field] !== undefined) { // фильтруемое поле присутствует в данных
          // корректируем тип данных в поле - привоим к строке
          const val = (typeof item[field] === typeof 123) ? String(item[field]) : item[field];
          // если в выбранном поле данных имеется кусок искомой строки - увеличиваем счетик
          // если строки нет ни в одном фильтуемом поле - данные игнорируем
          correct += (val.indexOf(value) > -1) ? 1 : 0;
        }
      });

      return correct > 0;
    });
  };

  // функция отработки комнады на сортировку
  // привязывается к заголовку таблицы 
  onSort = (sortField) => {
    // создаём копии массивов: рабочего и полного
    const cloneData = this.state.data.concat();
    const allDataClone = this.state.allData.concat();

    // определим поле, по которому сортируем
    const lastField = this.state.sort.field;

    // функция определения направления сортировки
    // не очень элегантное решение, но быстро и работает
    // 
    const sortType = (lastField) => {
      // если сортируем по тому же полю, что и предыдущий раз
      if (lastField === sortField) {
        return this.state.sort.sign === ASC_SYMBOL ? DESC_SYMBOL : ASC_SYMBOL;
      } else {
        return ASC_SYMBOL;
      }
    };

    // СОРТРУЕМ ДАННЫЕ РАБОЧЕГО МАССИВА
    cloneData.sort((a, b) => {
      if (a[sortField] > b[sortField]) {
        return sortType(lastField) === ASC_SYMBOL ? 1 : -1;
      }
      if (a[sortField] < b[sortField]) {
        return sortType(lastField) === ASC_SYMBOL ? -1 : 1;
      }
      return 0;
    });

    // сортируем данные исходного массива
    // этопозволяет сохраниить сортировку при отмене/изменении фильтра
    allDataClone.sort((a, b) => {
      if (a[sortField] > b[sortField]) {
        return sortType(lastField) === ASC_SYMBOL ? 1 : -1;
      }
      if (a[sortField] < b[sortField]) {
        return sortType(lastField) === ASC_SYMBOL ? -1 : 1;
      }
      return 0;
    });

    this.setState({
      allData: allDataClone,
      data: cloneData,
      sort: {
        sign: sortType(lastField),
        field: sortField,
        lastField: lastField
      },
    });
  };

  // отработка выделения строки в таблице
  onRowSelect = row => (
    this.setState({ row })
  );

  // отрабатываем нажатие на кнопку "найти"
  filterSubmit = (event) => {
    event.preventDefault();

    // запускаем фильтрацию данных
    // за основу всегда берём исходный массив
    const data = this.filterInputData(this.state.allData,
        this.state.value,                                    // что мы ищем
        ["id", "firstName", "lastName", "email", "phone"]   // где мы ищем
    );

    this.setState({
      data: data,
      pagination: {
        start: 0,
        limit: PAGINATION_LIMIT,
      },
    });
  };

  // по каждому изменению обновляем состояние компонента
  filterChange = (event) => {
    event.preventDefault();

    // используем для работы фильтрар по кнопке "Найти"
    this.setState({ value: event.target.value });
  };

  // получаем данныые из диалогового окна ввода
  dataWorker(dataRow) {
    console.log('App.js => dataWorker \n');

    // копируем оба текущих массива данных
    const data = this.state.data.concat();
    const allData = this.state.allData.concat();

    // если в общем массиве имеется запись с таким же ID - выдаём ошибку
    // это предотвращает ошибку ввода данных
    if (allData.filter((item) => { return String(item.id) === dataRow.id }).length > 0) {
      alert(`ОШИБКА - запись с ID (${dataRow.id}) уже существует!`);
      return;
    }
    // добавляем ПЕРВЫЙ элемент в каждый массив
    data.unshift(dataRow);
    allData.unshift(dataRow);

    this.setState({
      data,
      allData,
    });
  }

  // следующий лист пагинации
  nextList() {

    //нам неоходим ТЕКуЩИЙ массив данных
    const copyAllData = this.state.data.concat();

    const limitValue = this.state.pagination.limit;

    // следующий лист отображает то, что выходит за пределы теукщего листа
    // по тому сдвигаем метку начала на размер листа
    const startIndex = this.state.pagination.start + limitValue;
    const isCanListNext = ((startIndex) < copyAllData.length) ? true : false;

    this.setState({
      //  data: isCanListNext ? copyAllData.slice(startIndex, endIndex) : this.state.data,
      pagination: {
        start: isCanListNext ? startIndex : startIndex - limitValue,
        limit: limitValue,
      }
    });
  }

  // предыдущий лист
  prevList() {

    const limitValue = this.state.pagination.limit;

    const startIndex = (this.state.pagination.start - limitValue) > (-1) ? (this.state.pagination.start - limitValue) : 0;

    this.setState({
      pagination: {
        start: startIndex,
        limit: limitValue,
      }
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center pt-2 pb-2">
          {<Filter
            filterSubmit={this.filterSubmit}

            filterChange={this.filterChange}
          />}
        </div>
        <div className="row justify-content-center pt-2 pb-2">
          {
            <ModalWindow
              title='Желаете добавить запись в таблицу?'
              dataWorker={(data) => this.dataWorker(data)}
            />
          }

        </div>
        <div className="row justify-content-center pt-2 pb-2">
          <Pagination
            prev={() => this.prevList()}
            curr={this.state.pagination.start}
            onPage={this.state.pagination.limit}
            totalPages={this.state.data.length}
            next={() => this.nextList()}
          />
        </div>
        <div className="row">
          {
            this.state.isLoading
              ? <Loader />
              : <DataTable
                data={this.state.data.slice(this.state.pagination.start, this.state.pagination.start + this.state.pagination.limit)}
                onSort={this.onSort}
                sort={this.state.sort.sign}
                sortField={this.state.sort.field}
                onRowSelect={this.onRowSelect}
              />
          }
        </div>
        <div className="row">
          {/*<Pagination />*/}
        </div>
        <div className="row">
          {
            this.state.row ? <UserDetail person={this.state.row} /> : null
          }
        </div>
      </div>
    );
  }
}


export default DataNavigation;
