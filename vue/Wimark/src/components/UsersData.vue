<template>
    <div class="table">
        <tablerender :userInfo="userInfo" :isBusy="isBusy" @rowselected="onRowSelected" />

        <b-modal ref="graph-modal" hide-footer>
            <template v-slot:modal-title>
                {{ selected && selected.first_name }} {{ selected && selected.last_name }} WiFi
            </template>

            <mychart :data="mychart"></mychart>
        </b-modal>
    </div>
</template>

<script>
import axios from "axios";
import mychart from "./Chart";
import tablerender from "./TableRender";

const API_URL = "https://rssi.wmrk.tk/";

// используемый сервер API не поддеривает кросдоменные запросы
// использование сторонних компонентов не принесло результата
// потому используем прослойку в виде сервиса от хероку
const WORK_API = `https://cors-anywhere.herokuapp.com/${API_URL}`;

export default {
    name: "UsersData",
    components: { mychart, tablerender },
    data: function() {
        return {
             // выделенная строка таблицы
            selected: [],
            // флаг занятости таблицы, для отображения процесса загрузки данных
            isBusy: false,
            // общий массив данных пользователя
            userInfo: [],
            // данные для отрисовки графика
            mychart: []
        };
    },
    methods: {
        showModal() {
            this.$refs["graph-modal"].show();
        },

        onRowSelected(items) {
            this.selected = items[0];

            // получаем данные сигнала выбранного элемента
            if (items.length > 0 && items[0].signals) {
                const signals = items[0].signals;
                this.mychart = [];
                // отсортируем данные сигнала по временной шкале
                signals.sort((a, b) => {
                    if (a.ts > b.ts) return 1;
                    if (a.ts == b.ts) return 0;
                    if (a.ts < b.ts) return -1;
                });
                // создаём массивы данных сигнала для вывода в графике
                // одновременно производим нормализацию значений для лучшей визуализации на графиках
                signals.forEach(signal => {
                    this.mychart.push([signal.ts, signal.rssi]);
                    //this.chartOptions.xaxis.categories.push(new Date(signal.ts));
                });

                this.showModal();
            } else {
                console.log(
                    `Parsing data ERROR: onRowSelected(item) => signals not find in item data`
                );
            }
        }
    },

    async mounted() {
        this.isBusy = true;

        try {
            const apiData = (await axios.get(WORK_API)).data;
            this.isBusy = false;
            this.userInfo = apiData && Object.values(apiData);
        } catch (error) {
            console.log(`mounted() => ${error}`);
        }
    }
};
</script>