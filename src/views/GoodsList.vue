<template>
    <div>
      <Headercom></Headercom>
    
      <nav-bread ><span>Goods</span></nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" @click="setSortBy" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" :class="{'filterby-show': filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)"  :class="{'cur':priceChecked === 'all'}" @click="setPriceChecked('all')">All</a></dd>

                <dd v-for="(price, index) in priceFilter" :key="index"  >
                  <a href="javascript:void(0)" @click="setPriceChecked(index)" :class="{'cur': priceChecked===index}">{{price.startPrice}} - {{price.endPrice}}</a>
                </dd>
               
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodList" :key="index"> 
                    <div class="pic">
                      <a href="#"><img v-lazy="'static/'+item.productImage " alt=""></a>
                    </div>
                    <div class="main" >
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m">加入购物车</a>
                      </div>
                    </div>
                  </li>
                 
                </ul>
                <div v-infinite-scroll="loadMore" infiniter-scroll-disabled="busy" infiniter-scroll-distance="1">...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overlayFlag" @click="closePop"></div>
      <Footercom></Footercom>
    </div>
</template>
<script>
    import axios from 'axios'
    import Headercom from '@/components/Headercom'
    import Footercom from '@/components/Footercom'
     import NavBread from '@/components/NavBread'
    export default{
        components:{
          Headercom,
          Footercom,
          NavBread
        },   
        data(){
            return {
                goodList:[],
                priceFilter:[{
                  startPrice: '0',
                  endPrice: '100' 
                },{
                  startPrice: '100',
                  endPrice: '500'
                },{
                  startPrice:'500',
                  endPrice: '1000'
                },{
                  startPrice:'1000',
                  endPrice:'2000'
                }],
                priceChecked: 'all',
                filterBy: false,
                overlayFlag: false,
                sortFlog: true,
                page: 1,
                pageSize: 8,
                busy: false,
                priceFilterOnj:{}
            }
        },
        mounted(){
          this.getData();
        },
        methods:{
            getData(flag){
               let param = {
                page: this.page,
                pageSize: this.pageSize,
                sort: this.sortFlog ? 1 : -1,
                priceFilter: this.priceFilterOnj 
               }
               axios.get('/goods',{
                params: param
              }).then(res=>{
                if(flag){
                  if(res.data.length < this.pageSize){
                    this.busy = true;
                  }else{
                    this.busy = false;
                  }
                  this.goodList = this.goodList.concat(res.data)
                  
                }else{
                  this.goodList = res.data;
                }
                console.log( this.goodList)
              }) 
            },
            showFilterPop(){
              this.filterBy = true;
              this.overlayFlag = true;
            },
            closePop(){
              this.filterBy = false;
              this.overlayFlag = false;
            },
            setPriceChecked(index){
              this.priceChecked = index;
              this.closePop();
              this.priceFilterOnj = {
   
              };
              if(this.priceChecked !== 'all' ){
                 let item = this.priceFilter[index];
                 this.priceFilterOnj = {
                    startPrice: item.startPrice,
                    endPrice: item.endPrice
                };
              }
              this.page = 1;
              console.log(this.priceFilterOnj)
              this.getData();
            },
             
            setSortBy(){
              
              this.sortFlog = !this.sortFlog;
              this.page = 1;
              this.getData();
            },
            loadMore(){
            
              setTimeout(()=>{
                this.page++;
                this.busy = true;
                this.getData(true);
              },500)
            },
            getPriceFilter(item){
             
            } 
        }
    }
</script>
