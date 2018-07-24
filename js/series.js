require.config({
  baseUrl: "js",
  paths: {
    "jquery": "jquery-1.12.4.min",
    "template": "template-web"
  }
})

require(['jquery','template'],function ($,template) { 
  $(function () {
  //加载数据函数
  var urlStr = location.href;
  // console.log(urlStr);
  var name = urlStr.split("?")[1];
  // console.log(name);
  var url, title;
  if (name == "episode") {
    url = "http://czdm.ittun.com/api/getlianzai";
    title = "连载动漫";

  } else if (name == "topic") {
    url = "http://czdm.ittun.com/api/gettopics";
    title = "专题列表";
  }

  function loadData() {
    $.ajax({
      url: url,
      type: "get",
      dataType: "json",
      success: function (obj) {
        // console.log(obj);
        // console.log(1);
        
        var objStr = JSON.stringify(obj);
        localStorage.setItem('localObj', objStr);
        obj = JSON.parse(localStorage.getItem('localObj'));

        var arr = obj.slice(0, 10);
        // console.log(arr);

        var html = template(name + "Tpl", {
          list: arr
        });
        // console.log(html);
        $('.header .title').html(title);
        $('.container ul').html(html);
      }
    })
  }

  loadData();

  // $('.more').on('click', function () {
  //   num++;
  //   var localObj = JSON.parse(localStorage.getItem('localObj'));

  //   var localArr = localObj.slice(0, 10 * num);
  //   // console.log(arr);
  //   var html = template(name + "Tpl", {
  //     list: localArr
  //   });
  //   // console.log(html);
  //   $('.header .title').html(title);
  //   $('.container ul').html(html);
  // })

  function loadMore() {
    var num = 1;
    $(window).scroll(function () {
      var scrollT = document.documentElement.scrollTop || document.body.scrollTop; //滚动条的垂直偏移
      var scrollH = document.documentElement.scrollHeight || document.body.scrollHeight; //元素的整体高度
      var clientH = document.documentElement.clientHeight || document.body.clientHeight; //元素的可见高度
      if (scrollT == scrollH - clientH) {
        num++;
        var localObj = JSON.parse(localStorage.getItem('localObj'));
    
        var localArr = localObj.slice(0, 10 * num);
        // console.log(arr);
        var html = template(name + "Tpl", {
          list: localArr
        });
        // console.log(html);
        $('.header .title').html(title);
        $('.container ul').html(html);
        // console.log(localArr);
        // console.log(localObj);
        // console.log(localArr.length == localObj.length);
         
        if (localArr.length == localObj.length) {
          $('.more').hide();
        }
      }
    })
  }
  
  loadMore();
})
})



