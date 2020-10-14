import request from './request';

//get请求方式
export function gets(url, data) {
  return request.get(url, {
    params: data
  })
}

//post 请求方式
export function posts(url, data) {
  return request.post(url, data)
}

//当前城市请求地址接口
//   export function ajaxCityGuess(type) {
//       return gets(`/v1/cities?type=${type}`)
//     }

export function ajaxCityGuess(type) {
  return gets(`/v1/cities?type=${type}`)
}
// export function ajaxCityHot() {
//     return gets("/v1/cities?type=hot")
//   }
//   export function ajaxCityGroup() {
//     return gets("/v1/cities?type=group")
//   }
export let users = data => gets('/users', data)