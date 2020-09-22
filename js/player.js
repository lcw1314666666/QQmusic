(function (window){
    function Player($audio){
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor: Player,
        musicList: [],
        init: function ($audio){
            this.$audio = $audio;
            // console.log(this.$audio);
            this.audio = $audio.get(0);
            // console.log(this.$audio);
        },
        currentIndex: -1,
        playMusic: function (index, music){
            // console.log(this.$audio);
            //判断是否是同一首音乐
            if(this.currentIndex == index){
                //判断有没有播放
                if(this.audio.paused){
                    // 没有播放
                    this.audio.play();
                }else{
                    // 播放了
                    this.audio.pause();
                }
            }else{
                this.$audio.attr("src", music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        preIndex: function (){
            var index = this.currentIndex;
            if(index < 1){
                index = this.musicList.length;
            }
            return index;
        },
        nextIndex: function (){
            var index = this.currentIndex + 1;
            if(index > this.musicList.length - 1){
                index = 1;
            }
            return index;
        },
        clearMusic: function (index){
            this.musicList.splice(index, 1);

            //如果删除的音乐在正在播放的音乐的前面
            if(index < this.currentIndex){
                this.currentIndex = this.currentIndex - 1;
            }
        },
        musicTimeUpDate: function (callBack){
            var $this = this;
            this.$audio.on("timeupdate", function (){
                // 正在播放音乐
                // console.log(player.getMusicDuration(), player.getMusicCurrentTime());
                // 获取音乐总时长
                var stopTime = $this.audio.duration;
                //获取音乐当前时长
                var startTime = $this.audio.currentTime;
                //格式化音乐当前时长，并定义变量接收
                var currTime = $this.fromCurrTime(stopTime, startTime);
                //格式化音乐总时长，并顶一变量接收
                var endTime = $this.fromEndTime(stopTime);
                // console.log(endTime);
                
                callBack(stopTime, startTime, currTime);
            })
        },
        fromCurrTime: function (stop, start){
            var endMin = parseInt(stop / 60);
            var endSec = parseInt(stop % 60);
            if(endMin < 10){
                endMin = "0" + endMin;
            }
            if(endSec < 10){
                endSec = "0" + endSec;
            }
            var startMin = parseInt(start / 60);
            var startSec = parseInt(start % 60);
            if(startMin < 10){
                startMin = "0" + startMin;
            }
            if(startSec < 10){
                startSec = "0" + startSec;
            }
            // console.log(startMin + ":" + startSec + "/" + endMin + ":" + endSec);
            return (startMin + ":" + startSec);
        },
        fromEndTime: function (stop){
            var endMin = parseInt(stop / 60);
            var endSec = parseInt(stop % 60);
            if(endMin < 10){
                endMin = "0" + endMin;
            }
            if(endSec < 10){
                endSec = "0" + endSec;
            }
            return (endMin+ ":" +endSec);
        },
        musicSeekTo: function (value){
            // console.log(this.audio.currentTime, this.audio.duration);
            // console.log(value);
            if(isNaN(value)) return;
            if(value < 0 || value > 1) return;
            // console.log(this.audio.duration);
            if(value >= 0 && value <= 1){
                this.audio.currentTime = this.audio.duration * value;
            }
            
        },
        musicVolumeSeekTo: function (value){
            if(isNaN(value)) return;
            if(value < 0 || value > 1) return;
            this.audio.volume = value;
        }
        
    }
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
}(window))