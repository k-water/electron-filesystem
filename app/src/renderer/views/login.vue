<template>
  <section class="login-wrap">
    <Form ref='form' class="login-form">
      <h3>系统登录</h3>
      <div class="fields">
        <Form-item prop="account" style="margin-bottom: 0">
          <Input
            class="field"
            v-model="login.account"
            placeholder="账号" 
            width="320px"
          >
          </Input>
        </Form-item>
        
        <Form-item prop="password" style="margin-bottom: 0">
          <Input
            class="field"
            v-model="login.password"
            type="password" 
            placeholder="密码" 
            width="320px"  
            @keyup.native.enter="check"
          >
          </Input>
        </Form-item>
        <Checkbox-group v-model="remember" class="save-account">
          <Checkbox label="remember">记住账号</Checkbox>
        </Checkbox-group>
      </div>
      <div class="submit">
        <Button
          long
          @click.native="check"
          type="primary"
          :loading="loading"
        >
          {{ loading ? '登录中' : '登录' }}
        </Button>
      </div>
    </Form>
    <canvas id="J_loginBackground"></canvas>
  </section>
</template>

<script>
  import { render } from '../config/canvas'
  export default {
    data () {
      return {
        login: {
          account: '',
          password: ''
        },
        remember: [],
        loading: false
      }
    },
    methods: {
      render: render,
      check () {
        if (this.login.account === '') {
          return this.$Notice.error({
            title: '用户名不能为空',
            duration: 2
          })
        }
        if (this.login.password === '') {
          return this.$Notice.error({
            title: '密码不能为空',
            duration: 2
          })
        } else if (this.login.password.length < 6) {
          return this.$Notice.error({
            title: '密码不能少于6个字符',
            duration: 2
          })
        } else {
          this.loading = true
          if (
            this.login.account !== localStorage.getItem('username') ||
            this.login.password !== localStorage.getItem('password')
          ) {
            this.loading = false
            return this.$Notice.error({
              title: '用户名或密码错误',
              duration: 2
            })
          } else {
            this.loading = false
            setTimeout(() => {
              this.$Notice.success({
                title: '登录成功',
                duration: 2
              })
            }, 1000)
            this.$router.push({
              name: 'index'
            })
          }
        }
      }
    },
    watch: {
      '$route' () {
        if (this.$route.name === 'login') {
          this.render()
        }
      }
    },
    created () {
    },
    mounted () {
      this.render()
    }
  }
</script>

<style lang="less" scoped>
  .login-wrap {
    position: fixed;
    z-index: 0;
    top: 0;
    left: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    background: #111;
    canvas {
      width: 100%;
      height: 100%;
      position: absolute;
    }
  }
  .login-form {
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    padding: 16px 20px 0;
    width: 360px;
    height: 252px;
    font-size: 14px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 12px;
    box-shadow: 2px 2px 32px 1px rgba(0, 0, 0, .45);
    opacity: .75;
    h3 {
      margin-top: 0;
      margin-bottom: 0;
      padding: 12px 0;
      font-weight: normal;
      font-size: 22px;
      text-align: center;
    }
    .field {
      display: block;
      margin: 0 auto;
      padding: 6px 0;
    }
    .submit {
      padding: 12px 0;
    }
  }
</style>
