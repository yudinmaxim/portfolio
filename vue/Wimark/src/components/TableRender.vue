<template>
    <div class="table">
        <b-table
            ref="data-table"
            selectable
            :busy.sync="isBusy"
            :items="userInfo"
            :fields="fields"
            @row-selected="onRowSelected"
            responsive="sm"
        >
            <template v-slot:table-busy>
                <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                </div>
                <div class="text-center text-danger my-2">
                    <strong>Загружаю данные...</strong>
                </div>
            </template>
        </b-table>
    </div>
</template>

<script>
export default {
    name: "TableRender",
    props: {
        userInfo: Array,
        // флаг занятости таблицы, для отображения процесса загрузки данных
        isBusy: Boolean
    },
    data: function() {
        return {
            fields: [
                {
                    key: "first_name",
                    label: "Имя",
                    sortable: true
                },
                {
                    key: "last_name",
                    label: "Фамилия",
                    sortable: true
                },
                {
                    key: "mac",
                    label: "MAC-адрес",
                    sortable: true
                },
                {
                    key: "phone",
                    label: "Телефон",
                    sortable: true
                }
            ],

            // выделенная строка таблицы
            selected: []
        };
    },
    methods: {
        onRowSelected(items) {
            if (items.length) {
                this.selected = items;
                this.$emit("rowselected", items);
                this.$refs["data-table"].clearSelected();
            }
        }
    }
};
</script>