<template>
    <div class="product product_horizontal">
        <span class="product_code">Код: {{ parseInt(unit.code) }}</span>
        <div class="product_status_tooltip_container">
            <span class="product_status">Наличие</span>
        </div>
        <div class="product_photo">
            <a href="#" class="url--link product__link">
                <img v-bind:src="getUnitImgUrl(unit)" />
            </a>
        </div>
        <div class="product_description">
            <a href="#" class="product__link">{{ unit.title }}</a>
        </div>
        <div class="product_tags hidden-sm">
            <p>Могут понадобиться:</p>
            <AssocProducts 
              v-for="product in AssocProductList"
              :name="product"
              :key="product.length" />
        </div>
        <div class="product_units">
            <div class="unit--wrapper">
                <div class="unit--select unit--active">
                    <p class="ng-binding" id="select-metr">За м. кв.</p>
                </div>
                <div class="unit--select">
                    <p class="ng-binding" id="select-unit">За упаковку</p>
                </div>
            </div>
        </div>
        <p class="product_price_club_card">
            <span class="product_price_club_card_text">
                По карте
                <br />клуба
            </span>
            <span class="goldPrice">{{ getUnitGoldPrice(unit, priceFormat) }}</span>
            <span class="rouble__i black__i">
                <svg
                    version="1.0"
                    id="rouble__b"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0"
                    y="0"
                    width="30px"
                    height="22px"
                    viewBox="0 0 50 50"
                    enable-background="new 0 0 50 50"
                    xml:space="preserve"
                >
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#rouble_black" />
                </svg>
            </span>
        </p>
        <p class="product_price_default">
            <span class="retailPrice">{{ getUnitPrice(unit, priceFormat) }}</span>
            <span class="rouble__i black__i">
                <svg
                    version="1.0"
                    id="rouble__g"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0"
                    y="0"
                    width="30px"
                    height="22px"
                    viewBox="0 0 50 50"
                    enable-background="new 0 0 50 50"
                    xml:space="preserve"
                >
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#rouble_gray" />
                </svg>
            </span>
        </p>
        <div class="product_price_points">
            <p class="ng-binding">Можно купить за 231,75 балла</p>
        </div>
        <div class="list--unit-padd"></div>
        <div class="list--unit-desc">
            <div class="unit--info">
                <div class="unit--desc-i"></div>
                <div class="unit--desc-t">
                    <p>
                        <span class="ng-binding">Продается упаковками:</span>
                        <span class="unit--infoInn">1 упак. = {{ unit.unitRatioAlt }} м. кв.</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="product__wrapper">
            <div class="product_count_wrapper">
                <div class="stepper">
                    <input class="product__count stepper-input" type="text" value="1" />
                    <span class="stepper-arrow up"></span>
                    <span class="stepper-arrow down"></span>
                </div>
            </div>
            <span
                class="btn btn_cart"
                data-url="/cart/"
                data-product-id="9bf0afd7-5190-11e5-b9a9-00259036a192"
            >
                <svg class="ic ic_cart">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart" />
                </svg>
                <span class="ng-binding" :data-product-id="unit.productId">В корзину</span>
            </span>
        </div>
    </div>
</template>

<script>
import AssocProducts from "./AssocProducts";

const PRICE_FORMAT = {
    unitFull: 1,
    unitFullAlt: 2
};

export default {
    name: "Unit",
    components: {
      AssocProducts,
    },

    props: {
        unit: Object
    },

    data: function() {
        return {
            priceFormat: PRICE_FORMAT.unitFull
        };
    },

    computed: {
    // геттер вычисляемого значения
    AssocProductList: function () {
      
      const productArray = this.unit.assocProducts.split(";");
    const productList = productArray.map((item, i) => {return (i < productArray.length - 2) ? `${item.trim()}, ` : `${item.trim()}`});

      return productList;
    }
  },

    methods: {
        getUnitImgUrl: function(unit) {
            return `http:${unit.primaryImageUrl}`; //.substring(0, unit.primaryImageUrl.lenght - 4)}_220x220_1.jpg`;
        },
        getUnitAssocProducts: function(unit) {
            const productArray = unit.assocProducts.split(";");
            const productList = productArray.map((item, i) => {
                return i < productArray.length - 2
                    ? `${item.trim()},`
                    : `${item.trim()}`;
            });
            const productString = productList.reduce((str, item) => {
                if (item.length > 2)
                    return str.concat(`<a href="#" class="url--link">
                                    ${item.replace("\n", "")}
                                </a>\n`);
                // в конце перенос строки для красоты :)
                else return str;
            }, "");

            return productString;
        },
        getUnitGoldPrice: function(unit, priceFormat) {
            return priceFormat === PRICE_FORMAT.unitFull
                ? unit.priceGold
                : unit.priceGoldAlt;
        },
        // получаем вариант текущей цены
        getUnitPrice: function(unit, priceFormat) {
            return priceFormat === PRICE_FORMAT.unitFull
                ? unit.priceRetail
                : unit.priceRetailAlt;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
