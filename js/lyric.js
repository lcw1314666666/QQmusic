(function (window){
    function Lyric(path){
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor: Lyric,
        init: function (path){
            this.path = path;
            // console.log(path);
        },
        times: [],
        lyrics: [],
        index : -1,
        musicLyric: function (callBack){
            $this = this;
            $.ajax({
                url: $this.path,
                dataType: "text",
                success: function (data){
                    // console.log($this.parselyric);
                    // console.log(data);
                    $this.parseLyric(data);
                    // console.log(data);
                    callBack(data);
                },
                error: function (e){
                    console.log(e);
                }
            })
        },
        parseLyric: function (data){
            $this = this;
            $this.times = [];
            $this.lyrics = [];
            // console.log(data);
            var array = data.split("\n");
            // console.log(array);
            $.each(array,function (index, value){
                //歌词部分
                var lrc = value.split("]")[1];

                if(lrc.length == 1) return true;
                $this.lyrics.push(lrc);
                // console.log($this.lyrics);

                // console.log(value);
                var timeReg = /\[(\d*:\d*\.\d*)\]/;
                var ese = timeReg.exec(value);//[00:22]
                // console.log(ese);
                if(ese == null) return true;
                var ese2 = ese[1];//00:22
                // console.log(ese2);
                var res = ese2.split(":");
                // console.log(res);
                var min = parseInt(res[0]) * 60;
                var sec = parseFloat(parseFloat(res[1]).toFixed(2));
                // console.log(min, sec);
                var time = min + sec;
                // console.log(time);
                $this.times.push(time);
                // console.log($this.times);
                // if($this.times.length == 100) return;
                // console.log($this.times.length);
            })
            // console.log($this.lyrics);
            // console.log($this.times);

        },
        currentIndex: function (currTime){

            if(currTime >= this.times[0]){
                this.index ++;
                this.times.shift();
                console.log(this.times[0]);
            }
            // console.log(this.index);
            if(this.index < 0) return;
            return this.index;
        }

        
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
}(window))