import md5 from 'js-md5'
// import fetch from './fetch'
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// 分片上传
/*
* 分片上传函数 支持多个文件
* @param options
* options.file 表示源文件
* options.pieceSize 表示需要分片的大小 默认是5m
* options.chunkUrl 分片上传的后端地址
* options.fileUrl 整个文件的上传地址
* progress 进度回调
* success 成功回调
* error 失败回调
*
*/
export const uploadByPieces = ({ photoType, files, chunkUrl, fileUrl, progressUrl, pieceSize = 5, progress, success, error }) => {
  if (!files || !files.length) return
  // 上传过程中用到的变量
  const fileList = [] // 总文件列表
  let progressNum = 1 // 进度
  let successAllCount = 0 // 上传成功的片数
  // let currentAllChunk = 0 // 当前上传的片数索引
  let AllChunk = 0 // 所有文件的chunk数之和
  let AllFileSize = 0 // 所有文件size
  // 获取md5
  const readFileMD5 = (files) => {
    // 读取每个文件的md5
    files.map((file, index) => {
      const fileRederInstance = new FileReader()
      fileRederInstance.readAsBinaryString(file)
      fileRederInstance.addEventListener('load', e => {
        const fileBolb = e.target.result
        const fileMD5 = md5(fileBolb)
        if (!fileList.some((arr) => arr.md5 === fileMD5)) {
          fileList.push({ md5: fileMD5, name: file.name, file })
          AllFileSize = AllFileSize + file.size
        }
        if (index === files.length - 1) readChunkMD5(fileList)
      }, false)
    })
  }
  const getChunkInfo = (file, currentChunk, chunkSize) => {
    const start = currentChunk * chunkSize
    const end = Math.min(file.size, start + chunkSize)
    const chunk = file.slice(start, end)
    return { start, end, chunk }
  }
  // 针对每个文件进行chunk处理
  const readChunkMD5 = (fileList) => {
    fileList.map((currentFile, fileIndex) => {
      const chunkSize = pieceSize * 1024 * 1024 // 5MB一片
      const chunkCount = Math.ceil(currentFile.file.size / chunkSize) // 总片数
      AllChunk = AllChunk + chunkCount // 计算全局chunk数
      // let fileSize = currentFile.file.size // 文件大小
      // 针对单个文件进行chunk上传
      // for (var i = 0; i < chunkCount; i++) {
      const { chunk } = getChunkInfo(currentFile.file, 0, chunkSize)
      const chunkFR = new FileReader()
      chunkFR.readAsBinaryString(chunk)
      // chunkFR.addEventListener('load', e => {
      //   let chunkBolb = e.target.result
      //   let chunkMD5 = md5(chunkBolb)
      //   // this.readingFile = false
      //   uploadChunk(currentFile, { chunkMD5, chunk, currentChunk: i, chunkCount }, fileIndex)
      // }, false)
      progressFun()
      uploadChunk(currentFile, { chunk, currentChunk: 0, chunkCount, chunkSize }, fileIndex)
      // }
    })
  }
  // 更新进度
  const progressFun = () => {
    progressNum = Math.ceil(successAllCount / AllChunk * 100)
    progress(progressNum, '上传中:')
  }

  const GetUploadPhotoProcess = () => {
    const getProgress = () => {
      axios({ // 合并文件
        method: 'post',
        url: progressUrl,
        headers: {
          'X-Token': getToken()
        }
      }).then(res => {
        console.log(res.data);

        if (res.data.Bs === '1') {
          // uploadFile(currentFile)
          progressNum = Math.ceil(res.data.Rows.ImportedNum / res.data.Rows.Number * 100)
          progress(progressNum, '导入中:', res.data.Rows.Result)
          if (res.data.Rows.ImportState === 0) {
            clearInterval(timer)
            success && success(res)
          }
        } else {
          clearInterval(timer)
        }
      }).catch(e => {
        error && error(e)
      })
    }
    const timer = setInterval(getProgress, 1000)
  }

  // 对分片已经处理完毕的文件进行上传
  const uploadFile = (currentFile) => {
    console.log(currentFile);

    // let makeFileForm = new FormData()
    // makeFileForm.append('Guid', currentFile.md5)
    // makeFileForm.append('FileName', currentFile.name)
    // makeFileForm.append('PhotoType', 'CollectPhoto')
    const makeFileForm = {
      Guid: currentFile.md5,
      FileName: currentFile.name,
      PhotoType: photoType
    }
    axios({ // 合并文件
      method: 'post',
      url: fileUrl,
      data: makeFileForm,
      headers: {
        'X-Token': getToken()
      }
    }).then(res => {
      progressFun()
      res.file_name = currentFile.name
      if (res.data.Bs === '1') {
        // uploadFile(currentFile)
        GetUploadPhotoProcess()
      }
    }).catch(e => {
      error && error(e)
    })
  }
  const uploadChunk = (currentFile, chunkInfo, fileIndex) => {
    console.log(currentFile, chunkInfo, fileIndex);
    const chunkCount = chunkInfo.chunkCount;
    const fetchForm = new FormData()
    // fetchForm.append('file_name', currentFile.name)
    // fetchForm.append('md5', currentFile.fileMD5)
    // fetchForm.append('data', chunkInfo.chunk)
    // fetchForm.append('chunks', chunkInfo.chunkCount)
    // fetchForm.append('chunk_index', chunkInfo.currentChunk)
    // fetchForm.append('chunk_md5', chunkInfo.chunkMD5)
    fetchForm.append('Guid', currentFile.md5)
    fetchForm.append('data', chunkInfo.chunk)
    fetchForm.append('Index', chunkInfo.currentChunk)
    fetchForm.append('PhotoType', photoType)
    axios({
      method: 'post',
      url: chunkUrl,
      data: fetchForm,
      headers: {
        'X-Token': getToken()
      }
    }).then(res => {
      console.log(res);

      if (res.data.Bs === '1') {
        progressFun()
        // currentAllChunk++
        console.log(chunkInfo.currentChunk, chunkCount);
        if (chunkInfo.currentChunk < chunkInfo.chunkCount - 1) {
          successAllCount++

          chunkInfo.currentChunk++

          const { chunk } = getChunkInfo(currentFile.file, chunkInfo.currentChunk, chunkInfo.chunkSize)
          const chunkFR = new FileReader()
          chunkFR.readAsBinaryString(chunk)
          console.log(chunk);

          uploadChunk(currentFile, { chunk, currentChunk: chunkInfo.currentChunk, chunkCount, chunkSize: chunkInfo.chunkSize }, fileIndex)
        } else {
          // 当总数大于等于分片个数的时候
          if (chunkInfo.currentChunk >= chunkInfo.chunkCount - 1) {
            uploadFile(currentFile, fileIndex)
          }
        }
      } else if (res.data.Bs === '-1') {
        MessageBox.confirm(res.data.Msg, '登出确认', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
    }).catch((e) => {
      error && error(e)
    })
  }
  readFileMD5(files) // 开始执行代码
}
