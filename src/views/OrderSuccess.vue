<template>
    <div>
      <header-com>  </header-com>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li class="cur"><span>Make</span> payment</li>
            <li class="cur"><span>Order</span> confirmation</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>Congratulations! <br>Your order is under processing!</h3>
            <p>
              <span>Order ID：{{orderId}}}</span>
              <span>Order total：{{orderTotal | currency('$')}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <router-link class="btn btn--m" to='/cart'>Cart List</router-link>
              </div>
              <div class="btn-r-wrap">
                <router-link class="btn btn--m" to="/goods">Goods List</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer-com>  </footer-com>
    </div>
</template>
<script>
    import axios from 'axios'
    import HeaderCom from '@/components/HeaderCom'
    import FooterCom from '@/components/FooterCom'
    import Modal from '@/components/Modal'
    export default{
        components:{
            HeaderCom,
            FooterCom,
            Modal
        },
        data(){
            return{
                orderId:'',
                orderTotal: ''  
            }
        },
        mounted(){
            this.getOrderInfo();
        },
        methods:{
            getOrderInfo(){
              var orderId = this.$route.query.orderId;
              axios.get('/users/orderDetail',{
                params:{
                  orderId: orderId
                }
              }).then((res)=>{
                if(res.data.resultCode === '0'){
                   this.orderId = res.data.result.orderId;
                   this.orderTotal = res.data.result.orderTotal;
                }
              })
            }
        }
    }
</script>
