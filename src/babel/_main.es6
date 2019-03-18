function test (cb) {
  console.log('test')
  cb()
}

test(() => {
  console.log('callback')
})
