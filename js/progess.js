(function (window){
    function Progress($progress_bottom, $progress_bottom_line, $progress_bottom_bar){
        return new Progress.prototype.init($progress_bottom, $progress_bottom_line, $progress_bottom_bar);
    }
    Progress.prototype = {
        constructor: Progress,
        init: function ($progress_bottom, $progress_bottom_line, $progress_bottom_bar){
            // console.log($progress_bottom, $progress_bottom_line, progress_bottom_bar);
            this.$progressBottom = $progress_bottom;
            this.$progressLine = $progress_bottom_line;
            this.$progressBar = $progress_bottom_bar;
            // console.log(this.$progressBottom, this.$progressLine, this.$progressBar);
            // console.log(this);
        },
        isMove: false,
        progressClick: function (callBack){
            var $this = this;
            $this.$progressBottom.click(function (event){
                //获取滚动条到窗口的距离
                var normalLeft = $(this).offset().left;
                //获取鼠标到窗口的距离
                var eventLeft = event.pageX;
                var lineLeft = eventLeft -normalLeft;
                $this.$progressLine.css("width", lineLeft + "px");
                $this.$progressBar.css("left", lineLeft + "px");
                //获取进度条的比例
                var value = lineLeft / $(this).width();
                // console.log(value);
                callBack(value);
            })
        },
        progressMove: function (callBack){
            //获取滚动条到窗口的距离
            var normalLeft = this.$progressBottom.offset().left;
            var currentLeft;
            // console.log(this);
            var $this = this;            
            //给小圆点绑定书包落下事件
            $this.$progressBar.mousedown(function (){
                $this.isMove = true;
                var setLeft = $this.progressBottom;
                
                //在文档上添加鼠标移动事件
                $(document).mousemove(function (event){
                    var eventLeft = event.pageX;
                    
                    var lineLeft = eventLeft -normalLeft;
                    currentLeft = lineLeft;
                    // console.log(eventLeft, normalLeft);
                    console.log(currentLeft);
                    if(currentLeft < 0 || currentLeft > setLeft) return;
                        $this.$progressLine.css("width", currentLeft + "px");
                        $this.$progressBar.css("left", currentLeft + "px");
                    
                })
                //取消文档上的鼠标移动事件
                $(document).mouseup(function (){
                    $(document).off("mousemove");
                    $this.isMove= false;
                    //获取进度条的比例
                    console.log(currentLeft, $this.$progressBottom.width());
                    var value = currentLeft / $this.$progressBottom.width();
                    callBack(value);

                })
                
            })
            
        },
        setProgress: function (value){
            if(this.isMove) return;
            if(value < 0 || value > 100) return;
            this.$progressLine.css({
                "width" : value + "%"
            })
            this.$progressBar.css({
                "left": value + "%"
            })
        }
        
        
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
}(window))