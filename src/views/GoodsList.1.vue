<template>
    <div>
      <header-com></header-com>
    
      <nav-bread ><span>Goods</span></nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" @click="setSortBy" class="price" :class="{'sort-up':sortFlag}">
              Price 
              <svg class="icon icon-arrow-short">
                <use  xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-short"></use>
              </svg>
            </a>
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
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                 
                </ul>
                <div v-infinite-scroll="loadMore" infiniter-scroll-disabled="busy" infiniter-scroll-distance="1">
                  <img src="../assets/loading-spinning-bubbles.svg" v-show="loading" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal :mdShow="mdShow" v-on:close="closeModal">
        <p slot="message">
          <span>请先登录，否则无法加入购物车 </span>
        </p>
        <div slot="btnGroup">
          <a href="javascript:;" @click="mdShowCart = false" class="btn btn--m">关闭</a>
        </div>
      </Modal>
       <Modal :mdShow="mdShowCart" v-on:close="closeModal">
        <p slot="message">
           <svg class="icon-status-ok">
            <use  xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成功 </span>
          </p>
        <div slot="btnGroup">
          
          <a href="javascript:;" @click="mdShowCart = false" class="btn btn--m">继续购物</a>
          <router-link class="btn btn--m" to="/cart">查看购物车</router-link>
        </div>
      </Modal>
      <div class="md-overlay" v-show="overlayFlag" @click="closePop"></div>
      <footer-com></footer-com>
    </div>
</template>
<script>
    import axios from 'axios'
    import HeaderCom from '@/components/HeaderCom'
    import FooterCom from '@/components/FooterCom'
    import NavBread from '@/components/NavBread'
    import Modal from '@/components/Modal'
    export default{
        components:{
          HeaderCom,
          FooterCom,
          NavBread,
          Modal
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
                sortFlag: true,
                page: 1,
                pageSize: 8,
                busy: false,
                priceFilterOnj:{},
                loading: true,
                mdShow: false,
                mdShowCart: false
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
                sort: this.sortFlag ? 1 : -1,
                priceFilter: this.priceFilterOnj 
               }
               this.loading = true;
               axios.get('/goods/list',{
                params: param
              }).then(res=>{
                this.loading = false;
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
           
              }) 
            },
            showFilterPop(){
              this.filterBy = true;
              this.overlayFlag = true;
            },
            closePop(){
              this.filterBy = false;
              this.overlayFlag = false;
              this.mdShowCart = false;
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
              
              this.sortFlag = !this.sortFlag;
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
             
            },
            addCart(productId){
               
               axios.post('/goods/addCart',{productId:productId}).then((res)=>{
                  //console.log(res.data.resultMessage);
                  if(res.data.resultCode === '0'){
                    this.mdShowCart = true;
                    /*this.$message({
                        message: res.data.resultMessage,
                        type: 'warning'
                    });*/
                  }else{
                    this.mdShow = true;
                  }
                   
               })
            },
            closeModal(){
              this.mdShow = false;
              this.mdShowCart = false;
            } 
        }
    }
</script>
