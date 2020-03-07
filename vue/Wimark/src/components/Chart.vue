<template>
    <div>
        <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
    name: "Chart",
    components: { apexchart: VueApexCharts },
    props: {
        data: Array
    },
    data: function() {
        return {
            // параметры графика вывода данных
            series: [
                {
                    name: "RSSI",
                    data: this.data
                }
            ],
            chartOptions: {
                chart: {
                    height: 350,
                    type: "line",
                    zoom: {
                        enabled: true
                    }
                },
                xaxis: {
                    type: "numeric",
                    labels: {
                        formatter: function(value) {
                            // переводим время в универсальное для подписи строки координат
                            const date = new Date(value);

                            const hours = date.getUTCHours();
                            const minutes = date.getUTCMinutes();
                            const seconds = date.getUTCSeconds();
                            const milliseconds = date.getUTCMilliseconds();

                            return `${hours}:${minutes}:${seconds}'${milliseconds}`; // The formatter function overrides format property
                        }
                    }
                },
                tooltip: {
                    x: {
                        formatter: function(val) {
                            return new Date(val);
                        }
                    }
                }
            }
        };
    }
};
</script>