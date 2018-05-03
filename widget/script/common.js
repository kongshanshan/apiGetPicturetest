var headerHeight = 48;
//打开新窗口
function plumOpenCommonWin(path, title,text) {
  var text=text||'';
    // extra = extra || {};
    var url = api.winName == 'root' && !api.frameName ? './html/win-common.html' : './win-common.html';

    // var win_name	= ("useWinName" in extra) && extra["useWinName"] ? extra["useWinName"] : 'win-' + path + '-header';
    api.openWin({
        name: path,
        url: url,
        pageParam: {
            path: path,
            title: title,
            text:text,
                // extra : extra
        }
    });
}

// 调取图片无剪裁
function plumSelectPicture(callback) {
    var sourceType
    api.actionSheet({
        cancelTitle: '取消',
        buttons: ['拍照', '从相册选择'],
        style: {
            fontNormalColor: '#ff7b17'
        }
    }, function(ret, err) {
        if (ret.buttonIndex == 3) {
            return
        }
        sourceType = 'library';
        if (ret.buttonIndex == 1) {
            sourceType = 'camera';
        }
        api.getPicture({
            sourceType: sourceType,
            encodingType: 'jpg',
            mediaValue: 'pic',
            destinationType: 'base64',
            allowEdit: false,
            quality: 90,
            targetWidth: 600,
            saveToPhotoAlbum: false
        }, function(ret, err) {
            if (ret && ret.data) {
                callback(ret.data)
            } else {
            }
        });
    });
}
//图片上传
function plumUploadImageType(path, type, callback) {
    api.ajax({
        // url : commonUrl + 'map=api_index_img_upload_shop&type='+type,
        url: '../test.json',
        method: 'post',
        timeout: 30,
        dataType: 'json',
        data: {
            files: {
                image: path
            }
        }
    }, function(ret, err) {
        callback('http://img.zcool.cn/community/010f87596f13e6a8012193a363df45.jpg@1280w_1l_2o_100sh.jpg')
        if (ret && ret.ec == 200) {
            callback(ret.data.img);

        } else {
            // plumNetworkFail(false);
        }
    });
}
//倒计时
var waittime = 60;

function reget(btn) {
    if (waittime === 0) {
        btn.removeAttribute("disabled");
        btn.innerHTML = "获取验证码";
        btn.style.color = "#ff7b17";
        btn.style.backgroundColor = "#fff";
        // $api.dom('#get-code').data('send',1);
        $api.attr($api.dom('#get-code'), 'data-send', 1);
        waittime = 60;

    } else {
        btn.setAttribute('disabled', true);
        $api.attr($api.dom('#get-code'), 'data-send', 2);
        btn.innerHTML = waittime + 's后重试';
        btn.style.color = "#cfcfcf";
        btn.style.backgroundColor = "#f1eeee";
        waittime--;
        setTimeout(function() {
            reget(btn);
        }, 1000)
    }
}
//toast show
function toastShow(msg){
  api.toast({
		msg : msg,
		duration : 2000,
		location : 'bottom'
	});
}
//网页加载进度等待弹框
function plumPageLoadShow() {
	api.showProgress({
		style : 'default',
		animationType : 'fade',
		title : '加载中',
		text : '请稍候',
		modal : false
	});
}
//分页加载数据
function getMessByPage(){
  api.setRefreshHeaderInfo({
  		visible : true,
  		bgColor : '#F4F5F7',
  		textColor : '#878787',
  		textDown : '下拉刷新...',
  		textUp : '松开刷新...',
  		showTime : true
  	}, function(ret, err) {
  		hasMore = true;
  		loadShowHide(false,'');
      //关闭刷新状态，关闭进度提示
				api.refreshHeaderLoadDone();

  		currPage = 0;
  		carAddPage = false;
  		//重置为0
  		// fetchList(currPage,2);
  	});

  	//上拉加载
  	api.addEventListener({
  		name : 'scrolltobottom',
  		extra : {
  			threshold : 0
  		}
  	}, function(ret, err) {
      //////////hasMore测试
      hasMore=true;
  	    if (hasMore) {
  	         loadShowHide(false, '');
  	         if(api.connectionType != "none"){
  	            // fetchList(++currPage, 2);
  	         }
    	}
  	});
  	// fetchList(currPage,2);
}
function loadShowHide(type,msg) {
	var type = type ? true : false;
	var load = $api.dom('#loading');
	if (type) {
		// load.show();
    $api.css(load, 'display:block');

	} else {
		// load.hide();
    $api.css(load, 'display:none');
    // $api.html($api.dom('.loadResult'), msg);
    $api.html($api.dom('.loadResult'), "数据加载完毕");

	}
}
/*
 * 网络请求错误时的页面提示
 * @param boolean frame 默认为true，加载错误页面提示
 */
function plumNetworkFail(frame, winName, frameName) {
	frame = frame ? true : false;
	var msg;
	if (api.connectionType == "none") {
		msg = '网络连接失败，请检查网络设置';
	} else {
		msg = '服务器连接失败，请重试';
	}
	if (frame) {
		var extra = {
			'winName' : winName,
			'frmName' : frameName
		};
		api.openWin({
			name : 'frame-no-network',
			url : './frame-no-network.html',
			pageParam : {
				extra : extra
			},
			animation : {
				type : "none"
			}
		});
	}
	api.toast({
		msg : msg,
		duration : 2000,
		location : 'bottom'
	});
}
//tab切换
function tabSwitch(cls,activeCls){
  var tab = new auiTab({
      element:document.getElementById("tab"),
      index:1,
      repeatClick:false
  },function(ret){
    var group=$api.domAll('.'+cls);
    var index=ret.index;
    for(var i=1,length=group.length;i<=length;i++){
      if(group[i]==group[index]){
          $api.addCls(group[i-1], activeCls);
      }else{
        $api.removeCls(group[i-1], activeCls)
      }
    }
  });
}

  // 手机号正则验证
  // @param {Object} phone

function plumIsPhone(phone) {
	var pattern = /1\d{10}/;
	return pattern.test(phone);
}
