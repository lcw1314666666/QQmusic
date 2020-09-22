$(function (){

    
    var $audio = $("audio");
    var player = new Player($audio);
    var progress;
    var voiceProgress;
    var lyric;

     //获取歌曲数据，添加Dom元素
     var music = musicList;
     var str = JSON.stringify(music);
     var musicObj = JSON.parse(str);
     player.musicList = musicObj;
     // console.log(musicObj);
    initMusicLyric(musicObj[0]);

     $.each(musicObj, function (index, music){
        //  console.log(music);
         //初始化第一首音乐的信息
         initMusicInfo(musicObj[0]);
         //初始化歌词信息
         // console.log(musicObj);

         var $item = createMusicList(index, music);
 
         $(".center_list").append($item);
     })
 
     //生成音乐列表结构函数
     function createMusicList(index, music){
         var $item = '<ul>'+
                         '<li class="list_check "><i class="checked"></i></li>'+
                         '<li class="list_num">' + (index + 1 )+ '</li>'+
                         '<li class="list_name">'+ music.name +
                             '<div class="menu">'+
                                 '<a href="javascript:;" class="play"></a>'+
                                 '<a href="javascript:;"></a>'+
                                 '<a href="javascript:;"></a>'+
                                 '<a href="javascript:;"></a>'+
                             '</div>'+
                         '</li>'+
                         '<li class="list_singer">'+ music.singer + '</li>'+
                         '<li class="list_time">'+
                             '<span class="time">' + music.time + '</span>'+
                                 '<a href="javascript:;" class="del"></a>'+
                         '</li>'+
                     '</ul>';
                    //  console.log(index);
                     var $item = $($item);
                    //  console.log($item);
                     $item.get(0).index = index;
                     $item.get(0).music = music;
                     return $item;
    }

    /**
     * 初始化歌曲信息函数
     */
    function initMusicInfo(musiclist){
        //获取到需要初始化的元素
        var $musicImage = $(".song_info_img img"),
            $songName = $(".song_name"),
            $musicSinger = $('.song_singer'),
            $musicAlbum = $(".song_Album"),
            $musicName = $(".progress_musicName"),
            $musicSingerName = $(".progress_singerName");
            $currTime = $(".currTime"),
            $tatTime = $(".tatTime"),
            $background = $(".mask");
        //初始化元素
        $musicImage.attr("src", musiclist.cover);
        $musicSinger.text(musiclist.singer);
        $musicAlbum.text(musiclist.album);
        // console.log($songName);
        // console.log($musicName, $musicSingerName);
        // console.log(musiclist.name, musiclist.singer);
        $musicName.text(musiclist.name);
        $songName.text(musiclist.name);
        $musicSingerName.text(musiclist.singer);
        $currTime.text("00:00");
        $tatTime.text(musiclist.time);
        // console.log(" + musiclist.cover + ");
        $background.css("background", "url('"+ musiclist.cover+"')")
    }

    /**
     * 初始化歌词信息
     */
    function initMusicLyric(path){
        // console.log(path.link_lrc);
        lyric = new Lyric(path.link_lrc);
        var $lyricContent = $(".song_info_text");
        $lyricContent.html("");
        lyric.musicLyric(function (data){
            // console.log(123);
            $.each(lyric.lyrics, function (index, value){
                var $item = $('<a class="">'+ value +'</a>');
                $lyricContent.append($item);

            })

        });
    }


    /**
     * 初始化进度条
     */
    initProgress();
    function initProgress(){
            // 进度条
            var $progress_bottom = $(".progress_bottom");
            var $progress_bottom_line = $(".progress_bottom_line");
            var $progress_bottom_bar = $(".progress_bottom_bar");
            // console.log($progress_bottom, $progress_bottom_line, $progress_bottom_bar);
            progress = new Progress($progress_bottom, $progress_bottom_line, $progress_bottom_bar);
            progress.progressClick(function (value){
                player.musicSeekTo(value);
            });
            progress.progressMove(function (value){
                player.musicSeekTo(value);
            });

            // 声音进度条同步
            var $volumeBottom = $(".volume_progess");
            var $volumeLine = $(".volume_progess_line");
            var $volumeBar = $(".volume_progess_bar");
            // console.log($progress_bottom, $progress_bottom_line, $progress_bottom_bar);
            voiceProgress = new Progress($volumeBottom, $volumeLine, $volumeBar);
            voiceProgress.progressClick(function (value){
                player.musicVolumeSeekTo(value);
            });
            voiceProgress.progressMove(function (value){
                player.musicVolumeSeekTo(value);
            });
    }

    /***
     * 事件绑定
     */
     bindEvents();
     function bindEvents(){
         //给按钮添加点击事件
            $('body').delegate(".menu>a:nth-child(1)", "click", function(){
                var $item = $(this).parents(".center_list ul");


                // console.log($item.get(0).index);
                // console.log($item.get(0).music);
                //当音乐播放时插入gif动图
                $(this).toggleClass("btnOnclick");

                
                $item.siblings().find(".list_num").removeClass("list_num1");
                $item.find(".list_num").toggleClass("list_num1");


                // 音乐播放
                player.playMusic($item.get(0).index, $item.get(0).music);


                //切换页面
                initMusicInfo($item.get(0).music);
                //切换歌词
                initMusicLyric($item.get(0).music);

                
                //底部播放菜单内容
                //  console.log($item.get(0).index);
                

                //当一首歌播放时不会有第二首歌再播放
                $item.siblings().find(".menu>a:nth-child(1)").removeClass("btnOnclick");
                
                

                //同步播放按钮  好难啊
                var play = $item.find(".menu>a:nth-child(1)").hasClass("btnOnclick");
                if(play){
                    //当前子菜单已选中
                    
                    $('.footer_in .stop').addClass("Stop1");
                    //让文字不高亮
                    $item.siblings().find(".list_name").css({
                        opacity: 0.5
                    });
                    //让文字高亮
                    $item.find(".list_name").css({
                        opacity: 1,
                        color: "#fff"
                    });
                }else{ 
                    //当前子菜单没有选中                        
                    $('.footer_in .stop').removeClass("Stop1");
                    // 让文字不高亮
                    $item.find(".list_name").css({
                        opacity: 0.5,
                    });
                    
                }
            })


            //监听底部播放按钮点击
            // console.log($(".stop"));
            $(".footer_in .stop").click(function (){
                
                //底部播放暂停按钮切换
                //判断是否有stop1属性
                // console.log($(this).hasClass("stop1"));
                if($(this).hasClass("Stop1")){
                    // 有stop1属性
                    $(this).removeClass("Stop1");
                }else{
                    $(this).addClass("Stop1");
                }
                // $(this).toggleClass("stop1");
               //判断是否播放过音乐
               if(player.currentIndex == -1){
                   //之前没播放过就播放第一首
                //    console.log($(".center_list ul").eq(1));
                   $(".center_list ul").eq(1).find(".play").trigger("click");
               }else{
                   //之前播放过，哪个就播放哪个
                   $(".center_list ul").eq(player.currentIndex + 1).find(".play").trigger("click");
               } 
            })
            //监听底部上一首按钮点击
            $(".pre").click(function (){
                
                $(".center_list ul").eq(player.preIndex()).find(".play").trigger("click");
            })
            //监听底部下一首按钮点击
            $(".next").click(function (){
                // console.log(123);
                // console.log(player.nextIndex());
                $(".center_list ul").eq(player.nextIndex() + 1).find(".play").trigger("click");
            })

            // 监听删除按钮的点击事件
            $("body").delegate(".del", "click", function (){
                //找到当前播放列表
                var $item = $(this).parents(".center_list ul");
                // 当前播放列表删除
                $item.remove();
                // 把数组中已删除的音乐删除
                player.clearMusic($item.get(0).index);
                // 重新加载每个列表的序号
                $(".center_list ul").each(function (index, ele){
                    // 拿到每个元素对应的序号
                    ele.index = index;
                    // 给每个列表元素添加序号
                    $(ele).find(".list_num").text(index + 1);
                    
                })
                //当被删除音乐正在播放时，自动播放下一首
                console.log(player.currentIndex, $item.get(0).index);
                // console.log($(".footer_in .next"));
                if(player.currentIndex == $item.get(0).index){
                    
                    // $(".footer_in .next").trigger("click");
                }
            })

            //底部播放暂停按钮切换
            $('.footer_in .stop').click(function (){
                $(this).toggleClass("stop1");
            })


            //监听列表移入事件

            $('body').delegate(".center_list ul", "mouseenter", function (){
                $(this).find(".menu").stop().fadeIn(100);
                $(this).find(".del").stop().fadeIn(100);
                $(this).find(".list_time span").text("")
            })
            $('body').delegate(".center_list ul", "mouseleave", function (){
                $(this).find(".menu").stop().fadeOut(100);
                $(this).find(".del").stop().fadeOut(100);
                $(this).find(".list_time span").text("03:22");
            })

            
            //监听check点击事件

            $('body').delegate(".list_check>i", "click", function (){
                $(this).toggleClass("list_checked");
                $(this).toggleClass("checked");
            })

            
            //底部按钮点击事件
            // $(".loop").click(function (){
            //     $(this).attr("class", "loop1");
            // })
            $("body").delegate(".loop", "click", function (){
                $(this).attr("class", "loop1");
            })

            $("body").delegate(".loop1", "click", function (){
                $(this).attr("class", "loop2");
            })
            $("body").delegate(".loop2", "click", function (){
                $(this).attr("class", "loop3");
            })
            $("body").delegate(".loop3", "click", function (){
                $(this).attr("class", "loop")
            })
            
            // live按钮切换
            $(".live").click(function (){
                $(this).toggleClass("live1");
            })
            //纯净模式切换
            $(".pure").click(function (){
                $(this).toggleClass("pure1");
            })

            /**
             * 监听音乐播放事件
             */
            // console.log($audio);
            // console.log(player.$audio);

            player.musicTimeUpDate(function (stopTime, startTime, currTime){
                //动态改变当前音乐播放时间
                $(".currTime").text(currTime);
                //进度条同步
                var value = startTime / stopTime * 100;
                progress.setProgress(value);
                var index = lyric.currentIndex(startTime);
                // console.log(index);
                $(".song_info_text a").removeClass("song_text_green");
                $(".song_info_text a").eq(index).addClass("song_text_green");

                $(".song_info_text").css({
                    top: (-index + 2) * 25 + "px"
                })

            })
            

            /**
             * 监听音量按钮=点击事件
             */
            $(".volume_lb").click(function (){
                // console.log(123);
                $(this).toggleClass("volume_lb1");
                if($(this).hasClass("volume_lb1")){
                    //没有声音
                    player.musicVolumeSeekTo(0);
                }else{
                    //有声音
                    player.musicVolumeSeekTo(0.5);
                    // volumeProgress.setProgress(50);
                }
            })

            
     }

            
            




    //ajax调用后台数据
    

    //给a标签添加标题
    $('.menu>a:nth-child(1)').attr("title", "播放");
    $('.menu>a:nth-child(2)').attr("title", "添加");
    $('.menu>a:nth-child(3)').attr("title", "下载");
    $('.menu>a:nth-child(4)').attr("title", "转发");
    $(".list_time>a").attr("title", "删除");

   
    
    //滚动条
    $(".center_list").mCustomScrollbar();

    
})