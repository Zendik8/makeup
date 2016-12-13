function include(url){document.write('<script type="text/javascript" src="'+url+'"></script>')}

//------ base included scripts -------//
    include('js/jquery.mousewheel.min.js');
    include('js/jquery.easing.1.3.js');
//------------------------------------//
    include('js/spin.min.js');
    include('js/jquery.touchSwipe.min.js');
    include('js/galleryPrototype5.js');

    if(FJSCore.mobile){
        //------ photoswipe scripts -------//
        include('js/klass.min.js');
        include('js/code.photoswipe.jquery-3.0.5.js'); 
    }

    var
        isSplash = true
    ,   viewState = 0
    ,   currMenuItem = 0
    ,   parsedArray = []
    ,   alignArray = []
    ,   newMinHeight = 0
    ,   defaultMinHeight = 0
    ,   menuDelay = 0
    ,   contentDelay = 0
    ,   primaryDelay = 0
    ;

$(function(){
    if(FJSCore.mobile){
        $('body').css({"min-height":"inherit"});

        $('#mobile-navigation > option').eq(1).remove();
        $('#mobile-navigation > option').eq(1).attr({"value":"mobilefolioPage.html"});
        $('h1 > a').attr({"href":"mobilefolioPage.html"});
        FJSCore.defState="mobilefolioPage.html";
    }

    defaultMinHeight = $('body').css('min-height');
    

    var opts1 = {
        lines: 11, 
        length: 0, 
        width: 12, 
        radius: 24, 
        corners: 1, 
        rotate: 0, 
        direction: 1, 
        color: '#fff', 
        speed: 1.6, 
        trail: 60, 
        shadow: false, 
        hwaccel: false, 
        className: 'spinner', 
        zIndex: 2e9, 
        top: 'auto', 
        left: 'auto' 
    };
    var opts2 = {
        lines: 9, 
        length: 0, 
        width: 14, 
        radius: 20, 
        corners: 1, 
        rotate: 0, 
        direction: 1, 
        color: '#fff', 
        speed: 1.6, 
        trail: 60, 
        shadow: true, 
        hwaccel: false, 
        className: 'spinner', 
        zIndex: 2e9, 
        top: 'auto', 
        left: 'auto' 
    };
    
    webSiteSpinner = new Spinner(opts1).spin($('#webSiteLoader > span')[0]);
    ajaxSpinner = new Spinner(opts2).spin($('#ajax-overlay > div')[0]);

    $('#content_pages') 
        .on('show','>*',function(e,d){
            
            switch (viewState){
                case 0:
                    showhideSplash('hide');
                    contentDelay = 1000;
                break;
                case 1:
                    showhideGallery('hide');
                    contentDelay = 1000;
                break;
                case 2:
                    contentDelay = 0;
                break;
            }

            viewState = 2;
            $.when(d.elements)
                .then(function(){
                    d.curr.addClass('_active');
                    d.curr.css({display:'block', left: -$(window).width()})

                    setTimeout(function(){ $(window).trigger('resize'); }, 200)
                    
                    d.curr.stop().delay(contentDelay)
                        .animate({
                            left: 0
                        }, 1000, "easeOutExpo", function(){
                            //$(window).trigger('resize');
                        })
                })          
        })
        .on('hide','>*',function(e,d){ 
        $(this).removeClass('_active');  
            $(this)
                .stop()
                .animate({
                    left: $(window).width()
                }, 800, "easeInCubic", function(){
                    $(this).css({display:'none'});
                })
        })
        ///////////////////////////   category_pages   /////////////////////////////////////////
        $('#category_pages')
            .on('show','>*',function(e,d){
                viewState = 1;
                showhideSplash('hide');
                setTimeout(function(){
                    showhideGallery('show');
                }, 500);
                
                $.when(d.elements)
                    .then(function(){
                        parsedArray = [];
                        alignArray = [];
                        $('ul > li',d.curr).each(
                            function(){
                                parsedArray.push($(this).attr('data-preview'));
                                alignArray.push($(this).attr('data-align'));
                            }
                        )
                        $('#galleryPrototype5').trigger('reBuild', {'name':$("[data-categoty]", d.curr).attr('data-categoty'), 'urlArray':parsedArray, 'alignArray':alignArray});
                    })          
            })
            .on('hide','>*',function(e,d){})

            $(FJSCore).on('changeState',function(){
                if(FJSCore.state==""){
                    if(viewState==1){
                        showhideGallery('hide');
                    }
                    viewState = 0;
                    setTimeout(function(){
                        showhideSplash('show');
                    } , 500);
                }
            }
        )

        FJSCore.modules.responsiveContainer({
            elementsSelector: '#content_pages > div'
        ,   activePageSelector: '._active'
        ,   affectSelectors: 'header, footer'
        });

        

        ////////////////////////////////////////////////////////////////////////
        $(document)
            .on('show','#mobile-content>*',function(e,d){
                $('.closeBtn').attr({"href":"mobilefolioPage.html"});                   
                $(".folioList > li").click(
                    function(){
                        var instance = $(".photoSwipe1 a", this).photoSwipe()
                        instance.show(0);
                    }
                )
            })              
            .on('hide','#mobile-content>*',function(e,d){}) 

        $(window).on('resize', onResize);	

        $(".currYear").text((new Date).getFullYear());
})
/*---------------------- end ready -------------------------------*/

function showhideSplash(state){
            switch(state){
                case 'show':
                    $(window).trigger('resize');
                    $('.splashHolder > ul > li').each(
                        function(){
                            menuDelay = $(this).index()*50;
                            $(this).delay(menuDelay).animate({opacity:1, top:0}, 500);
                        }
                    )
                break;
                case 'hide':
                    $('.splashHolder > ul > li').each(
                        function(){
                            menuDelay = $(this).index()*50;
                            $(this).delay(menuDelay).animate({opacity:0, top:40}, 500);
                        }
                    )
                break;
            }
        }

        function showhideGallery(state){
            switch(state){
                case 'show':
                    
                    $('.galleryHolder').css({display:'block', left:-$(window).width(), 'z-index':3}).animate({left:0}, 800, "easeOutExpo");
                    $(window).trigger('resize');
                break;
                case 'hide':
                    $('.galleryHolder').animate({left: $(window).width()}, 500, "easeInCubic", function(){ $(this).css({display:'none', 'z-index':1}); });
                break;
            }   
        }

/*---------------------- events ----------------------------------*/
function onResize(e){

    if(!FJSCore.mobile){
        switch(viewState){
            case 0:
                $('body').trigger('updateDeltaHeight', $('.splashHolder').height().toString());
            break;
            case 1:
                $('body').trigger('updateDeltaHeight', $('.galleryHolder').height().toString());
            break;
            case 2:
                $('body').trigger('updateDeltaHeight', '0');
            break;
        }
    }
}

$(window).load(function(){  
    $("#webSiteLoader").fadeOut(500, 0, function(){
        $("#webSiteLoader").remove();
    });
    


    function primaryShow(){
        primaryDelay = 600;
        $('header h1').css({top:-300}).stop().delay(primaryDelay).animate({top:0}, 800, "easeOutExpo");

        setTimeout(function(){
            $('#mainNav').addClass('showed');
        }, primaryDelay+=100);


        setTimeout(function(){
            $('.splashHolder').addClass('showed');
        }, primaryDelay+=300);

        primaryDelay-=200;
        $('#mainNav ul li').each(
            function(index){
                $(this).css({top:-100}).stop().delay(primaryDelay+(index*100)).animate({top:0}, 700, "easeOutCubic"); 
            }
        )

        $('footer .followList').css({left: 600}).stop().delay(primaryDelay+=200).animate({left: 0}, 800, "easeOutExpo");
        $('footer .copyright').css({left: 600}).stop().delay(primaryDelay+=200).animate({left: 0}, 800, "easeOutExpo");
    }
    
    if(!FJSCore.mobile){
        primaryShow();

        $("#galleryPrototype5").galleryPrototype5({});

        $('#mainHolder .closeItem').html('menu');
        $('#mainHolder .closeItem').on("click", function(){
            $('header h1 a').click();
        })

    }else{
        //----- mobile scripts ------//
        $('#mobile-header>*').wrapAll('<div class="container"></div>');
        $('#mobile-footer>*').wrapAll('<div class="container"></div>');
    }
});


