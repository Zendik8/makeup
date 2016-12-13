(function($){
 $.fn.galleryPrototype5=function(o){ 
        
    var options = {
        ///destination: $('body')
    }
    $.extend(options, o); 
    
    var 
        _this = $(this)
    ,   _window = $(window)
    ,   _document = $(document)
    ,   currIndex = 0
    ,   ImgIdCounter = 0
    ,   previewArray = []
    ,   alignArray = []
    ,   nameCategory
    ,   itemsLength = 0
    ,   isPreviewLoading = false
    ,   isPreviewAnimate = false
    ;

    var
        fullPreviewHolder
    ,   primaryFullImage
    ,   secondaryFullImage
    ,   fullPreviewLoader
    ,   mainPagination
    ,   mainHolder
    ;

///////////////////////////// INIT /////////////////////////////////////////////////////////
    init();
    function init(){
        //  main Holder build
        _this.append("<div id='mainHolder'><div class='title'><span></span></div><div class='controlHolder'></div><div class='closeItem'></div></div>");
        mainHolder = $('#mainHolder');

        //  fullpreview Holder build
        _this.append("<div id='fullPreviewHolder'><div class='primaryFullImage'><img src='' alt=''></div><div class='secondaryFullImage'><img src='' alt=''></div><div class='fullPreviewLoader'></div></div>");
        fullPreviewHolder = $('#fullPreviewHolder');
        primaryFullImage = $('#fullPreviewHolder > .primaryFullImage');
        secondaryFullImage = $('#fullPreviewHolder > .secondaryFullImage');
        fullPreviewLoader = $('#fullPreviewHolder > .fullPreviewLoader');

        //  fullpreview pagination build
        $('.controlHolder', mainHolder).append("<div id='mainPagination'><ul></ul></div>");
        mainPagination = $('#mainPagination');

        _this.on("reBuild",
            function(e,d){
                setBuilder(d);
            }
        )

        addEventsFunction();        
    }
    //------------------------- set Builder -----------------------------//
    function setBuilder(dataObj){ 
        currIndex = 0;
        ImgIdCounter = 0;
        
        nameCategory = dataObj.name;
        _this.attr({"class":nameCategory});
        $(".title span", mainHolder).html(nameCategory);

        previewArray = [];
        previewArray = dataObj.urlArray;

        alignArray = [];
        alignArray = dataObj.alignArray;

        itemLength = previewArray.length;

        $(">ul", mainPagination).empty();
        for (var i = 0; i < itemLength; i++) {
            $(">ul", mainPagination).append("<li><span></span></li>");
        };

        addEventsPagination();

        fullImageSwitcher(0, true);
    }
  
    //////////////////////////    addEvents    /////////////////////////////////////////////
    function addEventsPagination(){
        $(">ul >li", mainPagination).on("click",
            function(){
                if((!isPreviewLoading) && (!isPreviewAnimate) && ($(this).index() !== ImgIdCounter)){
                    ImgIdCounter = $(this).index();
                    fullImageSwitcher(ImgIdCounter, true);
                }
            }
        )
    }
    function addEventsFunction(){
        //--------------- controls events ----------------------//
        $('.prevButton', fullPreviewHolder).on('click',
            function(){
                prevSwither();
            }
        )
        $('.nextButton', fullPreviewHolder).on('click',
            function(){
                nextSwither();
            }
        )

        //--------------- keyboard events ----------------------//
        _window.on("keydown",
            function(eventObject){
                switch (eventObject.keyCode){
                    case 37:
                        prevSwither();
                    break
                    case 39:
                        nextSwither();
                    break
                }
            }
        )
        //------------------ touch events -------------//
        if(device.mobile() || device.tablet()){
            fullPreviewHolder.swipe({
                swipeLeft:function(event, direction, distance, duration, fingerCount) {
                    nextSwither();
                },
                swipeRight:function(event, direction, distance, duration, fingerCount) {
                    prevSwither();
                }
            });
        }
        //------------------ window resize event -------------//
        $(window).on("resize",
            function(){
                mainResizeFunction();
            }
        )
    }
    //-----------------------------------------------------------------
    function prevSwither(){
        if(!isPreviewLoading && !isPreviewAnimate){
            if(ImgIdCounter > 0){
                ImgIdCounter--;
            }else{
                ImgIdCounter = itemLength-1;
            }

            fullImageSwitcher(ImgIdCounter, true);  
        }   
    }
    function nextSwither(){
        if(!isPreviewLoading && !isPreviewAnimate){
            if(ImgIdCounter < itemLength-1){
                ImgIdCounter++;
            }else{
                ImgIdCounter = 0;
            }

            fullImageSwitcher(ImgIdCounter, true);
        }
    }
    //------------------------- main Swither ----------------------------//
    function fullImageSwitcher(currIndex, isFirst){
        $(">ul >li", mainPagination).removeClass('active');
        $(">ul >li", mainPagination).eq(currIndex).addClass('active');
        if(isFirst){
            primaryFullImage.addClass('animateState');
        }
        $('> img', primaryFullImage).css({width:'auto', height:'auto'});
        $('> img', primaryFullImage).attr('src','').attr('src', previewArray[currIndex]);
        isPreviewLoading = true;
        isPreviewAnimate = true;
        fullPreviewLoader.css({display:'block'});
        $('> img', primaryFullImage).on('load', function(){ 
            isPreviewLoading = false;
            fullPreviewLoader.css({display:'none'});
            $(this).off('load');
            $('> img', primaryFullImage).attr({"class":alignArray[currIndex]}); 

            primaryFullImage.removeClass('animateState');
            secondaryFullImage.addClass('animateState');
            mainResizeFunction();
            setTimeout(
                function(){
                    secondaryFullImage.removeClass('animateState');
                    $('> img', secondaryFullImage).css({width:'auto', height:'auto'});
                    $('> img', secondaryFullImage).attr('src', previewArray[currIndex]);
                    $('> img', secondaryFullImage).attr({"class":alignArray[currIndex]}); 
                    mainResizeFunction();
                    isPreviewAnimate = false;
                }, 700
            )
        });
    }
    /*----------------------------------------------------------------------*/
    //----------------------------------------------------//
    function objectResize(obj, container, type){
        var 
            prevImgWidth = 0
        ,   prevImgHeight = 0
        ,   imageRatio
        ,   windowRatio
        ,   newImgWidth
        ,   newImgHeight
        ,   newImgTop
        ,   newImgLeft
        ,   screenWidth
        ,   screenHeight
        ,   alignIMG = 'default'
        ;

        alignIMG = obj.attr("class");
        //alignIMG = 'top_left';
        
        prevImgWidth = obj.width();
        prevImgHeight = obj.height();

        imageRatio = prevImgHeight/prevImgWidth;
        containerRatio = container.height()/container.width();

        switch(type){
            case 'fill':
                if(containerRatio > imageRatio){
                    newImgHeight = container.height();
                    newImgWidth = "auto";
                }else{
                    newImgWidth = container.width();
                    newImgHeight = "auto";
                }
                obj.css({width: newImgWidth, height: newImgHeight});

                screenWidth = container.width();
                screenHeight = container.height();
                imgWidth = obj.width();
                imgHeight = obj.height();

                switch(alignIMG){
                    case "top":
                        newImgLeft=-(imgWidth-screenWidth)*.5;
                        newImgTop=0;
                    break;
                    case "bottom":
                        newImgLeft=-(imgWidth-screenWidth)*.5;
                        newImgTop=-(imgHeight-screenHeight);
                    break;
                    case "right":
                        newImgLeft=-(imgWidth-screenWidth);
                        newImgTop=-(imgHeight-screenHeight)*.5;
                    break;
                    case "left":
                        newImgLeft=0;
                        newImgTop=-(imgHeight-screenHeight)*.5;
                    break;
                    case "top_left":
                        newImgLeft=0;
                        newImgTop=0;
                    break;
                    case "top_right":
                        newImgLeft=-(imgWidth-screenWidth);
                        newImgTop=0;
                    break;
                    case "bottom_right":
                        newImgLeft=-(imgWidth-screenWidth);
                        newImgTop=-(imgHeight-screenHeight);
                    break;
                    case "bottom_left":
                        newImgLeft=0;
                        newImgTop=-(imgHeight-screenHeight);
                    break;
                    default:
                        newImgLeft=-(imgWidth-screenWidth)*.5;
                        newImgTop= -(imgHeight-screenHeight)*.5;
                    }
            break;
            case 'fit':
                if(containerRatio > imageRatio){
                    newImgWidth = container.width();
                    newImgHeight = (prevImgHeight*container.width())/prevImgWidth;
                    newImgTop = container.height()/2 - newImgHeight/2;
                    newImgLeft = 0; 
                }else{
                    newImgWidth = (prevImgWidth*container.height())/prevImgHeight;
                    newImgHeight = container.height();
                    newImgTop = 0;
                    newImgLeft = container.width()/2 - newImgWidth/2;  
                }
                obj.css({width: newImgWidth, height: newImgHeight});
            break;
        }

        

        obj.css({top: newImgTop, left: newImgLeft});
    }
    //------------------- main window resize function -------------------//
    function mainResizeFunction(){
        objectResize($('> img', primaryFullImage), fullPreviewHolder, "fill");
        objectResize($('> img', secondaryFullImage), fullPreviewHolder, "fill");
    }
    //end window resizefunction

////////////////////////////////////////////////////////////////////////////////////////////              
    }
})(jQuery)