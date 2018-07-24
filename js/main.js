require.config({
  baseUrl: "js",
  paths: {
    "jquery": "jquery-1.12.4.min",
    "template": "template-web",
    "swiper": "swiper-4.3.3.min"
  }
})

require(['jquery', 'template', 'swiper'], function ($, template, Swiper) {
  $(function () {

    //加载数据函数
    function loadData(type) {
      $.ajax({
        url: "http://czdm.ittun.com/api/gethometab/" + type,
        type: "get",
        dataType: "json",
        success: function (obj) {
          var html = template("tpl", {
            list: obj
          });
          $('.container').html(html);
        }
      })
    }

    $(document).ajaxStart(function () {
      $('#loading').show();
    });
    $(document).ajaxStop(function () {
      $('#loading').hide();
    });
    //加载轮播图数据
    $.ajax({
      url: "http://czdm.ittun.com/api/getlunbo",
      type: "get",
      dataType: "json",
      success: function (obj) {
        var html = template('tplBanner', {
          list: obj
        });
        // console.log(html);
        $('.swiper-wrapper').html(html);
        var mySwiper = new Swiper('.swiper-container', {
          // direction: 'vertical',
          loop: true,
          autoplay: true,
          // 如果需要分页器
          pagination: {
            el: '.swiper-pagination',
          },

          // 如果需要前进后退按钮
          // navigation: {
          //   nextEl: '.swiper-button-next',
          //   prevEl: '.swiper-button-prev',
          // },

          // 如果需要滚动条
          // scrollbar: {
          //   el: '.swiper-scrollbar',
          // },
        })
      }
    })
    //加载第一页数据
    loadData(1);

    //注册滚动事件
    $(window).on("scroll", function () {
      var y = $(this).scrollTop();
      // console.log(y);
      if (y > 182) {
        $('.tab').addClass('fixed');
        $('.container').css({
          marginTop: 48
        });
      } else {
        $('.tab').removeClass('fixed');
        $('.container').css({
          marginTop: 0
        });
      }

    });
    //动态创建tab栏
    var tabArr = ['新增连载', '新增完结', '推荐连载', '推荐完结'];
    var tabStr = '';
    tabArr.forEach((ele, index) => {

      if (index == 0) {
        tabStr += '<a class="activeTab" href="javascript:">' + ele + "</a>" + "<span>|</span>";
      } else {
        tabStr += '<a href="javascript:">' + ele + "</a>" + "<span>|</span>";
      }

    });
    // console.log(tabStr);
    tabStr = tabStr.slice(0, -14);
    // console.log(tabStr);
    $('.tab').html(tabStr);

    //遍历tab栏添加点击事件
    $('.tab a').each(function (index, ele) {
      $(this).on("click", function () {
        $(this).addClass("activeTab").siblings().removeClass("activeTab");
        loadData(index + 1);
      })
    });

    //封装滑入函数
    function slideOut() {
      $('.main,.header').animate({
        left: 220
      }, 300);
      $('html').css({
        overflow: 'hidden'
      });
      $('.main .bg').show();
      $('.nav').animate({
        left: 0
      }, 300);
    }
    //封装滑出函数
    function slideIn() {
      $('.main,.header').animate({
        left: 0
      }, 300, function () {
        $('.main .bg').hide();
        $('html').css({
          overflow: 'auto'
        });
      });
      $('.nav').animate({
        left: -220
      }, 300);
    }
    //给slide按钮添加点击事件
    $('.slide').click(function () {

      // console.log($('.main').css('left'));
      // alert( $('.main').css('left'));
      if ($('.main').css('left') == '0px') {
        slideOut();
      } else if ($('.main').css('left') != '0px') {
        slideIn();
      }
    })

    //注册滑动事件
    $("body").on("touchstart", function (e) {

      startX = e.originalEvent.changedTouches[0].pageX,
        startY = e.originalEvent.changedTouches[0].pageY;
    });
    $("body").on("touchend", function (e) {

      moveEndX = e.originalEvent.changedTouches[0].pageX,
        moveEndY = e.originalEvent.changedTouches[0].pageY,
        X = moveEndX - startX,
        Y = moveEndY - startY;
      //左滑
      // console.log(moveEndX);
      // console.log(X);
      // console.log(Y);

      //当开始触摸位置小于100px.触发滑入事件
      if (startX < 100 && X > 0 && $('.main').css('left') == '0px') {
        slideOut();
      }
      //滑入后才能触发滑出事件
      else if (X < 0 && $('.main').css('left') != '0px') {
        slideIn();

      }
    });
  })

})