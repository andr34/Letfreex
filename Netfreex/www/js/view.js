//Apre la pagina di un film o serie tv
function openMovie(url,titolo, img, isSerieTv) {
    var obj = {
        title: titolo,
        url: url,
        img: img
    }

    changeTab(0);
    titolo = unescape(titolo);
    $('#homeContainer').addClass('hidden');
    $('#searchContainer').addClass('hidden');
    $('#favouritesContainer').addClass('hidden');
    $('#viewMovieContainer').removeClass('hidden');

    //Setto bottone preferiti
    if (isInFavourites(url))
        $('#addToFavourites').html('<div tabindex="0" onclick="removeFromFavourites(\'' + url + '\', \'' + titolo + '\',\'' + img + '\',\'' + isSerieTv + '\' )"><i class="fa fa-star colorOrange"></i> Rimuovi dai preferiti</div>');
    else
        $('#addToFavourites').html('<div tabindex="0" onclick="addToFavourites(\'' + url + '\', \'' + titolo + '\',\'' + img + '\',\'' + isSerieTv + '\')"><i class="fa fa-star-o colorOrange"></i> Aggiungi ai preferiti</div>');


    getVideoLink(url, isSerieTv);

    $('#movieDetails').css('height', $(window).height() + 'px');
    $('#movieDetails').css('width', $(window).width() + 'px');
    $('#sfumato').css('height', $(window).height() + 'px');
    $('#boxInfoContainer').css('height', $(window).height() + 'px');
    $('#viewButtons').css('width', $(window).width() + 'px');

    console.log(titolo);
    if (localStorage.getItem(titolo) != undefined)
        fillPageWithMovieDetails(JSON.parse(localStorage.getItem(titolo)), isSerieTv, obj, true);
    else
        searchMovieInfo(obj, isSerieTv);
}

var nessunLinkDisponibile = "<span class='marginTop10'>Nessun link disponibile, prova su un altro canale.</span>";

function removeLinkOffline(video) {
    var arrayHost = $('div[host]:visible'); //video.find('[host]');

    for (var i = 0; i < arrayHost.length; i++) {

        var host = arrayHost[i].innerHTML.split("openVideo('")[1].split("'")[0];
        var id = arrayHost[i].innerHTML.split("','")[1].split("'")[0];

        if (host == 'vidlox')
            removeLinkOfflineVidLox(id, arrayHost[i]);
        else if (host == 'speedvideo')
            removeLinkOfflineSpeedvideo(id, arrayHost[i]);
        else if (host == 'nowvideo')
            removeLinkOfflineNowvideo(id, arrayHost[i]);
        else if (host == 'vidto')
            removeLinkOfflineVidTo(id, arrayHost[i]);
        else if (host == 'rapidvideo')
            removeLinkOfflineRapidvideo(id, arrayHost[i]);
        else if (host == 'rapidvideocom')
            removeLinkOfflineRapidvideoCom(id, arrayHost[i]);
        else if (host == 'flashx')
            removeLinkOfflineFlashX(id, arrayHost[i]);
        else if (host == 'openload')
            removeLinkOfflineOpenload(id, arrayHost[i]);
        else if (host == 'streaminto')
            removeLinkOfflineStreaminTo(id, arrayHost[i]);
        else if (host == 'megahd')
            removeLinkOfflineMegahd(id, arrayHost[i]);
        else if (host == 'fastvideo')
            removeLinkOfflineFastvideo(id, arrayHost[i]);
    }

    

}

function showCastTutorial() {
    var html = "<p>Cliccando sull'icona trasmetti, poi riprodurre i video con un player alternativo tra quelli installati sul tuo dispositivo.</p>"
        + "<p>Puoi anche trasmettere il video a <span class=\"colorWhite\">Chromecast</span> o <span class=\"colorWhite\">SmartTv</span>!<br>" +
        "Ti basta aprire il video con un'app di casting come, ad esempio, <a href='https://play.google.com/store/apps/details?id=com.instantbits.cast.webvideo&hl=it'>Web Video Caster</a></p>";

    swal({
        title: '<img class="castIcon" src="img/cast.png">Trasmetti',
        html: html,
        background: 'rgba(0, 0, 0, 1)',
        padding: 30,
        showConfirmButton: false,
        showCloseButton: true
    });
    localStorage.castTutorialBlock = "true";
}

function showDownloadTutorial() {
    var html = "<p>Cliccando sull'icona download, puoi scaricare il video sul tuo dispositivo per guardarlo offline.</p>"
    + "<p>Per scaricarlo, ti basta aprirlo con un browser, oppure (<span class='colorWhite'>consigliato</span>) con un download manager come <a href='https://play.google.com/store/apps/details?id=com.dv.adm'>Advanced Download Manager</a>, grazie al quale aumenterai anche la velocita' del download.</p>";

    swal({
        title: '<i class="fa fa-download colorOrange"></i>Download',
        html: html,
        background: 'rgba(0, 0, 0, 1)',
        padding: 30,
        showConfirmButton: false,
        showCloseButton: true
    });
    localStorage.downloadTutorialBlock = "true";
}

function chooseHost(video) {
    //Salto il popup se host � seriehdme
    if (video.find('[host]').html().indexOf("seriehdme") > -1) {
        video.find('.fa-download').click();
        return;
    }
        

    //Altrimenti faccio scegliere host
    localStorage.currentEpisode = video.attr("info");

    console.log(video);
    var text = "<br>Non vuoi usare il player integrato? Clicca sul tasto <img class=\"castIcon\" src=\"img/cast.png\"> e riproduci con il tuo player preferito.";
    swal({
        title: 'Guarda su',
        html: video.clone().find('[host]').removeClass('hidden'),
        background: 'rgba(0, 0, 0, 1)',
        padding: 30,
        showConfirmButton: false
    });

    if (window.cordova && device.platform == "iOS") {
        //Nascondo pulsanti che non servono
        $('.fa-download').addClass("fa-link");
        $('.fa-link').removeClass("fa-download");
        $('.castIcon').addClass("hidden");
    }
    $('#modalContentId').append(text);

    

    if (window.cordova)
        removeLinkOffline(video);
}

var download = false;
//Estrae il video di film/serie tv
function openVideo(host, url, download) {
    host = host.split('|');
    if (host[0] != 'seriehdme') {
        if (download == 2 && localStorage.castTutorialBlock != "true") {
            return showCastTutorial();
        }
        if (download == 1 && localStorage.downloadTutorialBlock != "true") {
            if (window.cordova && device.platform == "Android")
                return showDownloadTutorial();
        }
    }
    
    swal.closeModal();
    $('#loading').removeClass('hidden');

    setTimeout(function () {
        console.log(url);
        

        //Redirect link criptati
        if (host[0] == 'swzz') {
            extractLinkSwzz(url, host[1], download);
        }      
        else if (host[0] == 'vcrypt') {
            extractVcrypt(url, host[1], download);
        }else if (host[0] == 'seriehdme') {
            scrapeEpisodio(url, host[1]);
        }
        //Link in chiaro
        else if (host[0] == 'vidlox')
            vidloxExtract(url, success, error, download);
        else if (host[0] == 'speedvideo')
            speedvideoExtract(url, success, error, download);
        else if (host[0] == 'nowvideo')
            nowvideoExtract(url, success, error, download);
        else if (host[0] == 'vidto')
            vidtoExtract(url, success, error, download);
        else if (host[0] == 'rapidvideo')
            rapidvideoExtract(url, success, error, download);
        else if (host[0] == 'rapidvideocom')
            rapidvideocomExtract(url, success, error, download);
        else if (host[0] == 'flashx')
            flashxExtract(url, success, error, download);
        else if (host[0] == 'openload')
            openloadExtract(url, success, error, download);
        else if (host[0] == 'streaminto')
            streamintoExtract(url, success, error, download);
        else if (host[0] == 'megahd')
            megahdExtract(url, success, error, download);
        else if (host[0] == 'fastvideo')
            fastvideoExtract(url, success, error, download);

    }, 100);
}

function hideLoadingiOs() {
    $('#loading').addClass("hidden");
}


//Riproduce il video
var success = function (url, download) {
    retry = true;
    console.log(url);
    if (window.cordova && device.platform == "iOS") {
        //PLAYER INTEGRATO
        if (download == 0 && url.indexOf('.flv') == -1)
            playWithOurPlayer(url);
        //BROWSER
        else {
            window.open(url, "_system");
        }
    } else {

        //PLAYER INTEGRATO
        if (download == 0 && url.indexOf('.flv') == -1)
            playWithOurPlayer(url);
        //DOWNLOAD
        else if (download == 1) {
            window.open(url, "_system");
        }
        //PLAYER ESTERNO
        else if (download == 2 || url.indexOf('.flv') > -1) {
            VideoPlayer.play(url);
            markAsSeen();
        }
    }
    $('#loading').addClass("hidden");
    
}

var error = function (ex) {
    $('#loading').addClass('hidden');
    console.log(ex);
    swal({
        title: "Il link e' offline",
        type: "error",
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: false,
        background: 'rgba(0, 0, 0, 1)'
    });
}

