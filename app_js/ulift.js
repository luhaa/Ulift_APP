angular.module('UliftApp',['ionic'])
    .config(function ($stateProvider,$urlRouterProvider,$ionicConfigProvider) {
        $stateProvider
            .state('advertise',{
                url:'/advertise',
                templateUrl:'tpl/advertise.html',
                controller:'advertiseCtrl'
            })
            .state('start',{
                url:'/start',
                templateUrl:'tpl/start.html',
                controller:'startCtrl'
            })
            .state('index',{
                url:'/index',
                templateUrl:'tpl/index.html',
                controller:'indexCtrl'
            })
            .state('list',{
                url:'/list',
                templateUrl:'tpl/list.html',
                controller:'listCtrl'
            })
            .state('detail',{
                url:'/detail/:did',
                templateUrl:'tpl/detail.html',
                controller:'detailCtrl'
            })
        $urlRouterProvider.otherwise('start');
    })
    .controller('parentCtrl',['$scope','$http','$state','$ionicModal','$window',function ($scope,$http,$state,$ionicModal,$window) {

        //跳转方法
        $scope.jump=function (desState,arg) {
            $state.go(desState,arg)
        };

        //弹出城市选择框
        $scope.selectedCity ='北京';
        $ionicModal.fromTemplateUrl('m_city.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.cityModal = modal;
        });
        $scope.openModal = function() {
            $scope.cityModal.show();
        };
        $scope.closeModal = function() {
            $scope.cityModal.hide();
        };
        $scope.selectCity = function(data) {
            //得到所选择的城市
            $scope.selectedCity =data;
            $scope.cityModal.hide();
        };


        //获取房源数据  因为反复调用多次 所以在这里封装起来
        $scope.getHouseData=function (postData) {
            $http({
                method:'POST',
                url:'php/zf_list.php',
                headers:{'content-type':'application/x-www-form-urlencode; charset=utf-8'},
                data:str,
            }).success(function (req) {
                console.log(req);
                $scope.houseData=req.data;
            })
        }

        //实现页面后退功能
        $scope.goBack=function () {
            $window.history.back();
        }
    }])
    .controller('startCtrl',['$scope','$http',function ($scope,$http) {

    }])
    .controller('advertiseCtrl',['$scope','$http','$interval','$timeout',function ($scope,$http,$interval,$timeout) {
        $scope.imgArray=['images/slider_banner01.jpeg',
            'images/slider_banner02.jpeg',
            'images/slider_banner03.jpeg'];

        $scope.num=10;
        $interval(function () {
            $scope.num--;
        },1000);
        $timeout(function () {
            $scope.$parent.jump('index')
        },10000)

    }])
    .controller('indexCtrl',['$scope','$http','$timeout','$ionicScrollDelegate',function ($scope,$http,$timeout,$ionicScrollDelegate) {
        //实现功能区的切换
        $scope.currentIndex=2;
        $scope.changeFunTab=function (n) {
            $scope.currentIndex=n;
        }

        //实现页面加载时,新闻数据的显示
        $scope.pageNum=1;
        $scope.hasMore=true;
        $http.get('php/news_list.php?pageNum='+$scope.pageNum).success(function (result) {
            $scope.newsData=result.data;
        });

        //上拉加载更多
        $scope.loadMoreNews=function () {

            $timeout(function () {//放在定时器中有个缓2秒的效果

                $scope.pageNum++;
                $http.get('php/news_list.php?pageNum='+$scope.pageNum).success(function (result) {
                    if($scope.pageNum==result.pageCount){
                        $scope.hasMore=false;
                    }
                    $scope.newsData=$scope.newsData.concat(result.data);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });

            },2000);
        };

        //滚动到,显示header
        $scope.showHeader=false;
        $scope.getPosition=function () {
            //知道当前滚动的位置
            var n=$ionicScrollDelegate.getScrollPosition().top;
            if(n<=100){
                $scope.showHeader=false;
            }else{
                $scope.showHeader=true;
                $scope.$apply();//轮训机制 保证实时响应
            }

        }


}])
    .controller('listCtrl',['$scope','$http','$jsonOperate',function ($scope,$http,$jsonOperate) {
        var postData={ //第一次获取 第一页 不限 不限  (这个传输的数据根据选择的不同是变化的)
            pageNum:1,
            areaId:0,
            subAreaId:0,
            priceMin:0,
            priceMax:20000,
            sizeMin:0,
            sizeMax:20000,
            houseType:0,
            leaseWay:0
        };

        var str=$jsonOperate.getParmas(postData);
        $http({
            method:'POST',
            url:'php/zf_list.php',
            headers:{'content-type':'application/x-www-form-urlencode; charset=utf-8'},
            data:str,
        }).success(function (req) {
            console.log(req);
            $scope.houseData=req.data;
        });
        
        //切换显示页面
        $scope.showList=true;
        $scope.houseArray=[];
        $scope.changeShowType=function () {
            $scope.showList=!$scope.showList;

            //修改显示de 数据格式 houseData-->houseArray(将一维数组转成二维数组)
            for(var i=0;i<$scope.houseData.length/2;i++){
                $scope.houseArray[i]=[];
                for(var j=0;j<2;j++){
                    $scope.houseArray[i][j]=$scope.houseData[2*i+j]
                }
            }
        }
        
        

        /*$scope.getMoreData=function () {
            postData.pageNum++;
        }*/
}])
    .controller('detailCtrl',['$scope','$http','$stateParams',function ($scope,$http,$stateParams) {
        //根据传递过来的houseID,获取数据
        $scope.houseId=$stateParams.did;

        $http.get('').success(function () {

            /*显示百度地图*/
            var address='深圳宝安';
            var map=new BMap.Map('house_map');
            var gdocoder=new BWap.Geocoder().getPointer(address);


            //绘制价格走势图
            var data=[];
            new Chart();
        })
    }])
    .service('$jsonOperate',function () {
        //把json对象转换为键值对的string返回
        this.getParmas=function (obj) {
            var result='';
            for(var p in obj){
                result+=p+'='+obj[p]+'&'
            }
            //去掉多余的'&'
            result=result.substring(0,result.length-1);
            return result;
        };
    })
