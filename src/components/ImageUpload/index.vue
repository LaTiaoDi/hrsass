<template>
  <div>
    <el-upload list-type="picture-card"
               :on-change='add'
               action='#'
               :http-request='upload'
               :limit='1'
               :file-list='fileList'
               :before-upload='beforeUpload'
               :on-remove='remove'
               :on-preview="handlePictureCardPreview"
               :class="{disabled:fileComputed}">
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent"
                 style="width: 180px"
                 :percentage="percent" />
    <el-dialog title="图片"
               :visible.sync="showDialog">
      <img :src="imgUrl"
           style="width:100%"
           alt="">
    </el-dialog>
  </div>
</template>

<script>
import Cos from 'cos-js-sdk-v5' //腾讯云sdk
const cos = new Cos({
  SecretId: 'AKIDGOMSPCdaEj4Gk4pEMZcVEnCRXBvbYReg',
  SecretKey: 'PITluthLqBMzRjroARcelwyWobK8lEbj'
})
export default {
  name: 'imageUp',
  data() {
    return {
      showDialog: false,
      imgUrl:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi1.sinaimg.cn%2FIT%2F2010%2F0419%2F201041993511.jpg&refer=http%3A%2F%2Fi1.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621305463&t=71b782fc80279e78c035a35b0eba1c2e',

      fileList: [],
      percent: 0, // 进度条百分比
      showPercent: false //进度条显示与隐藏
    }
  },
  methods: {
    handlePictureCardPreview() {
      this.showDialog = true
    },
    remove(file, fileList) {
      this.fileList = fileList
    },
    //状态会改变两次
    add(file, fileList) {
      this.fileList = fileList.map((item) => item)

      // if (this.fileList.some((item) => item.uid === file.id)) {
      //   debugger
      //   this.fileList.push(file)
      // }
    },
    beforeUpload(file) {
      this.showPercent = true
      //上传图片前钩子
      console.log(file)
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error(
          '图片格式只能是image/jpeg, image/gif, image/bmp, image/png'
        )
        return false
      }
      // 判断文件格式
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('文件大小不能大于5M')
        return false
      }
      //判断文件size
      //   已经确定当前上传的就是当前的这个file了
      this.currentFileUid = file.uid
      return true
    },
    upload(params) {
      // 自定义上传动作 有个参数 有个file对象，是我们需要上传到腾讯云服务器的内容
      cos.putObject(
        {
          Bucket: 'latiaodi-1305645414' /* 必须 */,
          Region: 'ap-nanjing' /* 存储桶所在地域，必须字段 */,
          Key: params.file.name /* 必须 */,
          StorageClass: 'STANDARD',
          Body: params.file, // 上传文件对象
          onProgress: (progressData) => {
            this.percent = (progressData.percent - 0) * 100
            if (this.percent > 99) {
              this.showPercent = false
            }
          }
        },
        (err, data) => {
          //回调函数
          console.log(err || data)
          // data中有一个statusCode === 200 的时候说明上传成功
          if (!err && data.statusCode === 200) {
            //   此时说明文件上传成功  要获取成功的返回地址
            // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
            // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
            // 需要知道当前上传成功的是哪一张图片
            this.fileList = this.fileList.map((item) => {
              // 去找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
                // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
              }
              return item
            })
            // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图
          }
        }
      )
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>