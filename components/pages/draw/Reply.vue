<template>
  <div class="reply-list" v-loading="loading">
    <div class="reply-item row" v-for="(item,index) in list" :key="index">
      <div class="col-3 head">
        <nuxt-link :to="`/user/${item.answerer.id}`">
          <img :src="$img.head(item.answerer.head,'small50')">
        </nuxt-link>
      </div>
      <div class="col-27 desc">
        <p class="name">
          <nuxt-link :to="`/user/${item.answerer.id}`">
            {{item.answerer.name}}
          </nuxt-link>
          <span style="font-weight: normal;color: #BBB">回复</span>
          <nuxt-link :to="`/user/${item.critic.id}`">
            {{item.critic.name}}
          </nuxt-link>
        </p>
        <p class="time">{{item.createDate}}</p>
        <p class="content">
          {{item.content}}
        </p>
        <p class="tool">
          <a @click="item.isShowReplyInput = !item.isShowReplyInput"><i class="icon s-bianji"></i>{{item.isShowReplyInput?'收起':'回复'}}</a>
        </p>
        <div class="row send-reply-box" v-if="item.isShowReplyInput">
          <div class="col-23">
            <input type="text" title="input" class="input block" placeholder="请输入评论"
                   v-model="replyForm[item.id].content">
          </div>
          <div class="col-3 center">
            <a class="icon s-laugh"></a>
          </div>
          <div class="col-4 center">
            <button class="btn block" @click="send(item)" :disabled="replyForm[item.id].content===''">发送</button>
          </div>
        </div>
      </div>
    </div>
    <p class="is-not" v-if="!loading&&!list.length">
      <img src="../../../assets/image/default/not.png">
    </p>
  </div>
</template>

<script>
  import {mapActions} from "vuex"
  import {ReplyForm} from "../../../assets/js/model/base";

  export default {
    componentName: "Reply",
    props: {
      commentId: String,
      drawId: String,
      authorId: String,
      criticId: String
    },
    data() {
      return {
        loading: false,
        list: [],
        replyForm: {},
      }
    },
    mounted() {
      this.listAll()
    },
    methods: {
      ...mapActions("reply", ["ASaveReply", "AList"]),
      async listAll() {
        this.loading = true;
        let result = await this.AList({commentId: this.commentId});
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.replyForm = {};
        this.list = result.data.map(item => {
          this.$set(this.replyForm, item.id, new ReplyForm(this.commentId, this.drawId, this.authorId));
          return Object.assign(item, {isShowReplyInput: false})
        });
        this.loading = false;
      },
      // async sendReply(form) {
      //   let result = await this.ASaveReply(form);
      //   if (result.status !== 200) {
      //     this.$notify({message: result.message});
      //   }
      // },
      async send(item) {
        this.replyForm[item.id].criticId = item.answerer.id;
        let result = await this.ASaveReply(this.replyForm[item.id]);
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        item.isShowReplyInput = false;
        this.listAll();
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  .send-reply-box {
    padding-bottom: 8px;
    > div {
      line-height: 35px;
    }
    .icon {
      font-size: 25px;
      color: darken(@font-color, -35%);
    }
  }

  .reply-list {
    min-height: 130px;
    padding-top: 8px;
    .reply-item {
      padding: 10px 0 0;
      border-top: 1px solid darken(@border-color, -7%);
      .head {
        img {
          border-radius: 50%;
        }
      }
      .desc {
        line-height: 25px;
        .name {
          font-weight: bold;
          .icon {
            margin-left: 10px;
            &.s-xingbie-nv {
              color: @female-color;
            }
            &.s-xingbie-nan {
              color: @male-color;
            }
          }
        }
        .time {
          color: darken(@font-color, -30%);
        }
        .tool {
          user-select: none;
          a {
            user-select: none;
            width: 100px;
            display: inline-block;
            color: @theme-color;
            font-size: @default-font-size;
            margin-right: 15px;
            i {
              display: inline-block;
              color: @theme-color;
              margin-right: 3px;
            }
          }
        }
      }
    }
    .is-not {
      line-height: 130px;
      font-size: @default-font-size;
      color: darken(@font-color, -20%);
      .center();
    }
  }
</style>
