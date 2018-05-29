<template>
  <div>
    <headerTitle :titleText="title"></headerTitle>

    <div id="allmap"
         style="
                width: 100%;
                height:600px;
                overflow:hidden;">
    </div>
    <!--container end-->
  </div>
</template>
<script>
  import BMap from 'BMap'
  import headerTitle from "../components/header/title.vue"

  export default {
    components: {
      BMap,
      headerTitle
    },
    data: () => ({
      title: '请选择你当前位置'
    }),
    created () {
      this.loadMap();
    },
    mounted () {
      this.ready()
    },
    methods: {
      loadMap: function () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position)=> {
            this.ready(position.coords.latitude, position.coords.longitude)
          }, ()=> {

            this.$alert("浏览器无法定位，请自行输入！");
            this.$router.push({path: '/sendOrder'})
          });
        }
        else {
          this.$alert("该浏览器不支持获取地理位置。");
        }
      },
      ready: function (lan, lon) {
        var map = new BMap.Map("allmap");
        map.enableScrollWheelZoom();
        var ggPoint = new BMap.Point(lon, lan);
        var convertor = new BMap.Convertor();
        var pointArr = [];
        pointArr.push(ggPoint);
        let that = this;
        convertor.translate(pointArr, 1, 5, (data)=> {
          if (data.status === 0) {
            var marker = new BMap.Marker(data.points[0]);
            map.addOverlay(marker);
            var label = new BMap.Label("手机当前定位", {offset: new BMap.Size(20, -10)});
            marker.setLabel(label); //添加百度label
            map.setCenter(data.points[0]);
            var geoc = new BMap.Geocoder();
            map.addEventListener("click", (e)=> {

              map.clearOverlays();
              var pt = e.point;
              var mOption = {
                poiRadius: 50,           //半径为1000米内的POI,默认100米
                numPois: 3                //列举出50个POI,默认10个
              };
              geoc.getLocation(pt, (rs)=> {
                var allPois = rs.surroundingPois;       //获取全部POI（该点半径为100米内有6个POI点）
                let a = '';
                let i = allPois.length - 1;
                a = allPois[i].title ;
                that.$confirm({
                  title: '确认地点',
                  content: a,
                  yesText: '确定'
                })
                  .then(()=>{
                  //点击确定进行回调
                    window.sessionStorage.setItem('goAddress',a);
                    that.$router.push({path:'/SendOrder'})
                  });
                map.addOverlay(new BMap.Marker(allPois[i].point));
//                }
              }, mOption);

              var circle = new BMap.Circle(pt, 50, {
                fillColor: "orange",
                strokeWeight: 1,
                fillOpacity: 0.3,
                strokeOpacity: 0.3
              });
              map.addOverlay(circle);

            });
          }
        })
        var point = new BMap.Point(lon, lan);
        map.centerAndZoom(point, 17);


      }
    }
  }
</script>
<style>
  /* 去掉地图左下角的百度LOGO */
  .anchorBL {
    display: none
  }
</style>
