function main() {
    (function () {
        'use strict';

        $(".dropdown-menu").on('click', 'li a', function () {
            $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
            $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
        });

        $('a.page-scroll').click(function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top - 40
                    }, 900);
                    return false;
                }
            }
        });
        $(window).bind('scroll', function () {
            var navHeight = $(window).height() - 100;
            if ($(window).scrollTop() > navHeight) {
                $('.navbar-default').addClass('on');
            } else {
                $('.navbar-default').removeClass('on');
            }
        });
        $('body').scrollspy({
            target: '.navbar-default',
            offset: 80
        });
    }());
}

//Scraping e print delle locandine in homepage =================================================
var arrayFilm = [];
var arrayCarousel = [];
var mySwiper;

function asyncOpenPage(url, isSerieTv, section, mostPopular, nextPage) {
    return new Promise(function (resolve, reject) {
        try {
            section += "SliderContainer";
            openPage(url, isSerieTv, section, mostPopular, nextPage, resolve);
        } catch (e) {
            console.error(e);
            resolve();
        }
    });
}

function openPage(url, isSerieTv, section, mostPopular, nextPage, callback) {
    /*if (localStorage.getItem(url) != undefined &&
        localStorage.getItem(url).split('|')[0] > new Date().getTime()) {
        
        arrayFilm = openFromCache(url);
        printPage(isSerieTv, section);
    }
    else {*/

    if (!mostPopular)
        scrapePage(url, isSerieTv, section, nextPage, callback);
    else
        scrapeMostPopular(url, isSerieTv, section, callback);
    //}

}


//Apre una pagina del canale
function scrapePage(url, isSerieTv, section, nextPage, callback) {
    get(url, function (response) {
        parsePage(response, url, isSerieTv, section, nextPage, callback);
    }, function (er) {
        callback();
        console.error(er);
    });
}

function scrapeMostPopular(url, isSerieTv, section, callback) {
    get(url, function (response) {
        parseMostPopular(response, url, isSerieTv, section, callback);
    }, function (er) {
        console.error(er);
    });
}

function addSection(sectionId, name) {
    var html = '<div id="' + sectionId + '" class="fascia"><h1 class="sliderTitle ' + sectionId + 'Title">' + name + '</h1>' +
    '<div  class="paddingUpDown40">' +
        '<div class="container">'+
            '<div class="row">'+
                '<div class="col-md-12" id="' + sectionId + 'Slider">' +
                    '<div class="swiper-container ' + sectionId + 'SliderContainer" style="width: 100%;">' +
                        '<div id="' + sectionId + 'SliderContainer" class="swiper-wrapper "></div>' +
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+
   '</div></div>';

    $('#sliderFasce').append(html);
    return sectionId;
}

function printPage(isSerieTv, section, nextPage, callback) {
    $('#loadingSearch').addClass('hidden');

    var htmlFilm;

    //Rimuovo il pulsante pagina successiva
    $('.nextPage' + section).remove();

    for (var i = 0; i < arrayFilm.length; i++) {
        if (arrayFilm[i].url != undefined)
            htmlFilm = "<div  class=\"swiper-slide\" ><img class='posterImg' src='" + arrayFilm[i].img + "' tabindex=\"0\" onclick=\"openMovie('" + arrayFilm[i].url + "','" + arrayFilm[i].title.trim().replaceAll("'", "\\'") + "','" + arrayFilm[i].img + "'," + arrayFilm[i].isSerieTv + ")\"></div>";
        else
            htmlFilm = "";
        if (i == arrayFilm.length - 1 && typeof arrayFilm[i] == "string")
            htmlFilm = "<div class=\"swiper-slide text-center nextPage" + section + "\" tabindex=\"0\" onclick=\"nextPage('" + arrayFilm[i] + "'," + isSerieTv + ",'" + section + "')\"><img class='posterImg arrow' src='img/arrow-right.png'></div>";
        $("#" + section).html($("#" + section).html() + htmlFilm);
    }

    //Pusho nel carousel un oggetto random tra quelli nell'array
    try {
        if (arrayFilm[0].carousel != "false") {
            pushRandomItemInCarousel(isSerieTv);
        }
    } catch (e) {
        console.error(e);
    }


    if (nextPage) {
        initializeSliderPoster(section);
    }
    if (callback) {   
        return callback();
    }

}

function pushRandomItemInCarousel(isSerie) {
    var obj = arrayFilm[Math.floor(Math.random() * arrayFilm.length - 1) + 1];
    searchMovieInfo(obj, isSerie, true);
}

function fillCarousel() {
    for (var i = 0; i < arrayCarousel.length; i++) {
        var isSerie = arrayCarousel[i].results[0].name != undefined;
        var title = isSerie ? arrayCarousel[i].results[0].name : arrayCarousel[i].results[0].title;
        var item = "<div data-p=\"225.00\"  style=\"display: none;\">" +
            '<img data-u="image" src="' + selectBackgroundSize() + arrayCarousel[i].results[0].backdrop_path + '"/>' +
             "<img  onclick=\"openMovie('" + arrayCarousel[i].info.url + "','" + arrayCarousel[i].info.title.trim() + "','" + arrayCarousel[i].info.img + "', " + isSerie + ")\" style=\"position: absolute;top: 26%;left: 55%;\" src=\"img/play_button.png\" />" +
            '<div id="carouselPoster" class="sfumato" style="height: 100%; padding-top: 6% ; padding: 55px;">' +
                  '<img class="carouselImg" src="https://image.tmdb.org/t/p/w500' + arrayCarousel[i].results[0].poster_path + '">' +
             '</div>' +
        '</div>';

        $('#carouselItems').append(item);
    }
    if (arrayCarousel.length == 0)
        $("#homeContainer").addClass('paddingTopSection');
    try {
        initializeSlider();

        if ($(window).width() > 768) {
            var options = { $AutoPlay: true, $ArrowKeyNavigation: 0, $Idle: 3000 };
            var jssor_slider1 = new $JssorSlider$('jssor_1', options);
        }
        $('#tf-home').removeClass('hidden');
    } catch (e) {
        console.error("FAILED INIT CAROUSEL");
        console.error(e);
    }
    
    
    $('#loading').addClass('hidden');
    $('.tf-menu').removeClass('hidden');
    $('#tf-menu').removeClass('hidden');


}

var slidersHomeArray = new Array();
function initializeSliderPoster(section) {
    if ($('.' + section)[0].swiper)
        $('.' + section)[0].swiper.destroy();

    mySwiper = new Swiper('.' + section, {
        slidesPerView: Math.floor(slidePerView),
        spaceBetween: 30,
        freeMode: true,
        //keyboardControl: true
    });
    slidersHomeArray.push(mySwiper);
}



//Apre la pagina principale di un film o serie
function getVideoLink(url, isSerieTv) {
    $('#loading').removeClass("hidden");
    get(url, function (response) {
        parseMoviePage(response, url, isSerieTv);
    }, function (er) {
        console.error(er);
        $('#loading').addClass("hidden");
    });
}




main();


//INIZIALIZZAZIONE DELLA VIEW
$(window).on("load", function () {

    initView();
});


function initView() {
    $(document).keypress(function (e) {
        if (e.which == 13) {
            if (window.cordova) {
                Keyboard.hide();
                StatusBar.hide();
            }
        }
    });
    FastClick.attach(document.body);
    $('img').imageReloader();

    //Eventi per navigazione tramite tastiera/telecomando
    $(document).keydown(
        function (e) {
            buttonMode = true;

            if (!navOpened)
                $("#mySidenav").addClass('hidden');

            if (e.keyCode == 13) {
                $(":focus").click();
                if($(":focus").context.activeElement.id)
                    $('.dropdown-toggle').dropdown('toggle');

                if (!$('.swal2-select').is(":visible"))
                    $('.swal2-modal').focus();
            }
            if (e.keyCode == 37) {
                $.emulateTab(-1);
                $('.swal2-input, .swal2-confirm, .swal2-cancel').attr("tabindex", "3");
            }
            if (e.keyCode == 39) {
                $.emulateTab();
                $('.swal2-input, .swal2-confirm, .swal2-cancel').attr("tabindex", "3");
            }
            if (e.keyCode == 40) {
                //giu
            }
            if (e.keyCode == 38) {
                //su
                //$(':focus').parent().parent().id
            }

            var buttonHtml = "\
                a:focus, i:focus, select:focus, input:focus {\
                    outline: none !important;\
                    -webkit-box-shadow:inset 0px 0px 0px 2px orange !important;\
                    -moz-box-shadow:inset 0px 0px 0px 2px orange !important;\
                    box-shadow:inset 0px 0px 0px 2px orange !important;\
                }\
                img:focus, button:focus, div:focus {\
                    outline: none !important;\
                    border: 2px solid orange !important;\
                }";

            if ($("#focus").html() != buttonHtml)
                $("#focus").html(buttonHtml);
        }
    );

    $(document).mousedown(function () {
        buttonMode = false;
        $("#mySidenav").removeClass('hidden');

        var touchHtml = "\
            a:focus, i:focus, select:focus, input:focus, div:focus {\
                outline: none !important;\
                -webkit-box-shadow:none !important;\
                -moz-box-shadow:none !important;\
                box-shadow:none !important;\
            }\
            img:focus, button:focus {\
                outline: none !important;\
                border: none !important;\
            }";

        if ($("#focus").html() != touchHtml)
            $("#focus").html(touchHtml);
    });


    if ($('#channelName').html() == "") {
        $('#loading').addClass('hidden');
        $('.tf-menu').removeClass('hidden');
        $('#tf-menu').removeClass('hidden');
    }


}


var cineblog = false;







