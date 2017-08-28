<template>
    <div>
         <div class="md-modal md-msg md-modal-transition md-show" v-show="mdShow">
              <div class="md-modal-inner">
                <div class="md-top">
                  <div class="md-title"></div>
                  <button class="md-close" @click="closeModal">Close</button>
                </div>
                <div class="md-content">
                  <div class="confirm-tips">
                      <slot name="message">    </slot>
                     
                  </div>
                  <div class="btn-wrap">
                    <slot name="btnGroup" >  </slot>
                  </div>
                </div>
              </div>
            </div>
            <div class="md-overlay" v-show="mdShow" @click="closeModal"></div>
    </div>
</template>
<script>

    export default {
        name: 'header',
        props: ['mdShow'],
        data(){
            return {
              
            }
        },
        methods:{
          closeModal(){
            this.$emit('close');
          }
        }
      
         
    }
</script>
<style>
.logo-con{
  width: 200px;
  height: 56px;
}
</style>