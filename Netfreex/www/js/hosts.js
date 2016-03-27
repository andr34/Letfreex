//Gestione host serie tv =======================================================================
var serieTvHosts = ['swzz|nowvideo', 'nowvideo',  'rapidvideo', 'flashx'];

var serieTvRegexHosts = [
    //Nowvideo redirect swzz (cineblog)
    '([0-9]{1,3}(?:[^0-9A-Za-z]|&#[0-9]{4};)[0-9]{1,3}).*xyz\/link\/([a-z0-9A-Z]+)[^<]*Nowvideo',

    //Nowvideo
    '([0-9]{1,3}(?:[^0-9A-Za-z]|&#[0-9]{4};)[0-9]{1,3}).*www.nowvideo.*/video/([a-z0-9A-Z]+)[^<]*Nowvideo',

    //Rapidvideo
    '([0-9]{1,3}x[0-9]{1,3}).*http:\/\/www.rapidvideo.org/([a-z0-9A-Z\/._-]+)/.*?Rapidvideo',

    //FlashX
    '([0-9]{1,3}(?:[^0-9A-Za-z]|&#[0-9]{4};)[0-9]{1,3}).*http:\/\/.*\/([a-z0-9A-Z]+)[^<]*Flashx'
];


//Gestione host film (LINK UNICO)===============================================================
var movieHostsOneLink = ['swzz|nowvideo', 'nowvideo', 'rapidvideo', 'flashx'];

var movieRegexHostsOneLink = [
    //Nowvideo redirect swzz (cineblog)
    'xyz/link/([a-z0-9A-Z]*)/" target="_blank">Nowvideo',

    //Nowvideo
    'nowvideo.../video/([0-9a-zA-Z]*)',

    //Rapidvideo
    'rapidvideo.org/([0-9a-zA-Z]*)/',

    //Flashx
    'flashx.tv/([0-9a-zA-Z]*).html'
];


//Gestione host film (LINK IN PIU' PARTI)========================================================
var movieHostsManyLink = ['swzz|nowvideo', 'flashx', 'nowvideo'];

var movieRegexHostsManyLink = [
    //Nowvideo redirect swzz (cineblog)
    'Nowvideo: .*xyz/link/([a-z0-9A-Z]*)/" target="_blank">(.. Tempo)</a>.*xyz/link/([a-z0-9A-Z]*)/" target="_blank">(.. Tempo)</a>(?:xyz/link/([a-z0-9A-Z]*)/" target="_blank">(.. Tempo)</a>)?',

    //Flashx
    'Flashx: .*flashx.tv/([a-z0-9A-Z]*).html" target="_blank">(.. Tempo)</a>.*flashx.tv/([a-z0-9A-Z]*).html" target="_blank">(.. Tempo)</a>(?:flashx.tv/([a-z0-9A-Z]*).html" target="_blank">(.. Tempo)</a>)?',

    //Nowvideo (italiafilm)
    'Nowvideo .*nowvideo....?/video/([a-z0-9A-Z]*)" target="_blank">(Parte .).*nowvideo....?/video/([a-z0-9A-Z]*)" target="_blank">(Parte .)(?:.*nowvideo....?/video/([a-z0-9A-Z]*)" target="_blank">(Parte .)</a>)?'
];


//Paginazione link ===============================================================================

function manageMovieLinks(html) {
    var count;
    var link;

    //Link in pi� parti  
    for (var i = 0; i < movieHostsManyLink.length; i++) {
        count = 0;
        link = "";
        var patt = new RegExp(movieRegexHostsManyLink[i], 'gi');

        var host = movieHostsManyLink[i].split('|')[1];
        if (!host)
            host = movieHostsManyLink[i];

        while (res = patt.exec(html)) {
            count++;
            console.log('trovato ' + res[1]);
            console.log(res);

            link += "<div class=\"hidden marginBottom10\" host onclick=\"openVideo('" + movieHostsManyLink[i] + "','" + res[1] + "')\"><img class=\"poster play\" src=\"img/host/" + host + ".png\" /><p>" + res[2] + "</p></div>";
            link += "<div class=\"hidden marginBottom10\" host onclick=\"openVideo('" + movieHostsManyLink[i] + "','" + res[3] + "')\"><img class=\"poster play\" src=\"img/host/" + host + ".png\" /><p>" + res[4] + "</p></div>";

            if (res[5])
                link += "<div class=\"hidden marginBottom10\" host onclick=\"openVideo('" + movieHostsManyLink[i] + "','" + res[5] + "')\"><img class=\"poster play\" src=\"img/host/" + host + ".png\" /><p>" + res[6] + "</p></div>";

        }

        if (count > 0) {
            var head = "<div class=\"guarda hidden\"  >" +
                            "<img class=\"poster play\" onclick=\"chooseHost($(this).parent())\" src=\"img/play_button.png\" />";
            $('#playButton').html($('#playButton').html() + head + link + "</div>");
        }
    }


    //Link singolo

    count = 0;
    link = "";
    for (var i = 0; i < movieHostsOneLink.length; i++) {
        var patt = new RegExp(movieRegexHostsOneLink[i], 'gi');

        var host = movieHostsOneLink[i].split('|')[1];
        if (!host)
            host = movieHostsOneLink[i];

        while (res = patt.exec(html)) {
            console.log('trovato ' + res[1]);

            //Se il link non l'ho gi� inserito prima, nei link multipli

            if ($('#playButton').html().indexOf(res[1]) == -1) {
                count++;
                link += "<div class=\"hidden marginBottom10\" host onclick=\"openVideo('" + movieHostsOneLink[i] + "','" + res[1] + "')\"><img width=\"200\" src=\"img/host/" + host + ".png\"></div>";
            }
        }
    }

    if (count > 0) {
        var head = "<div class=\"guarda hidden\"  >" +
                        "<img class=\"poster play\" onclick=\"chooseHost($(this).parent())\" src=\"img/play_button.png\" />";
        $('#playButton').html($('#playButton').html() + head + link + "</div>");
    }




}

function manageSerieTvLinks(html, regexStagione) {
    var link = "";
    var listaLink = {};
    var currentStagioneLingua = "";

    for (var i = 0; i < serieTvHosts.length; i++) {
        var patt = new RegExp('(?:' + serieTvRegexHosts[i] + '|' + regexStagione + ')', 'gi');

        while (res = patt.exec(html)) {
            var resUpper = res[0].toUpperCase().trim().replace(/<(?:.|\n)*?>/gm, '').replaceAll("<", "");

            //Se resUpper � nel formato STAGIONE X ITA/SUB-ITA, vuol dire che sta iniziando una nuova stagione
            if (new RegExp('(STAGIONE.*ITA)').test(resUpper)) {

                currentStagioneLingua = resUpper.replace('STAGIONE ', '').replace(/[^A-Z]/g, '');
                continue;
            }

            //res[1] = Stagione episodio
            //res[2] = id link
            console.log('trovato ' + res[1] + " - " + res[2]);

            if (res[1] == undefined)
                debugger


            var singleEpisode = {
                stagioneEpisodio: res[1],
                id: res[2],
                host: serieTvHosts[i]
            }
            var seasonNum = res[1].split(/(?:[^0-9A-Za-z\.]+|&#[0-9]{4};)|x/)[0];

            //Se la stagione inizia con 0, lo tolgo per non creare problemi
            if (seasonNum[0] == "0")
                seasonNum = seasonNum.substr(1, seasonNum.length);

            var label = "STAGIONE " + seasonNum + " - " + currentStagioneLingua;

            if (!listaLink[label])
                listaLink[label] = [];

            listaLink[label].push(singleEpisode);
        }
    }

    try {
        listaLink = sortStagioni(listaLink);
    } catch (e) {
        console.log(listaLink);
    }


    var firstSeason = true;

    //Ordino gli episodi in ogni stagione
    for (var stagione in listaLink) {
        listaLink[stagione].value = listaLink[stagione].value.sort(sortBy('stagioneEpisodio'));

        var stagioneId = listaLink[stagione].key.replaceAll(" ", "_").replaceAll("STAGIONE", "");

        if (!firstSeason)
            link += "</div><div id=\"stagione" + stagioneId + "\" class=\"season hidden\">";
        else {
            link += "<div id=\"stagione" + stagioneId + "\"class=\"season\">";
            firstSeason = false;
        }

        var stagioneNumero;
        var episodioNumero;
        var previousEpisodio = "";
        for (var j = 0; j < listaLink[stagione].value.length; j++) {
            if (listaLink[stagione].value[j].stagioneEpisodio != previousEpisodio) {

                //Preparo la divisione in stagioni 
                var seasonEpisodeRegex = "([0-9]{1,3})(?:[^0-9A-Za-z\.]+|&#[0-9]{4};|x)([0-9]{1,3}).*";
                var seasonEpisodePattern = new RegExp(seasonEpisodeRegex, 'gi');

                while (response = seasonEpisodePattern.exec(listaLink[stagione].value[j].stagioneEpisodio)) {
                    //Se la stagione inizia con 0, lo tolgo per non creare problemi
                    if (response[1][0] == "0")
                        response[1] = response[1].substr(1, response[1].length);

                    stagioneNumero = response[1];
                    episodioNumero = response[2];
                }

                if (previousEpisodio != "")
                    link += "</div>";

                previousEpisodio = listaLink[stagione].value[j].stagioneEpisodio;

                link += "<div info=\"" + stagioneNumero + "x" + episodioNumero + "\" class=\"guarda col-md-4 col-xs-12 hidden\" >" +
                            //"<div tabindex=\"0\" onclick=\"openVideo('" +listaLink[stagione].value[j].host+ "','" + listaLink[stagione].value[j].id + "')\">" +
                            "<div tabindex=\"0\" onclick=\"chooseHost($(this).parent())\">" +
                                "<div class=\"playContainer\" style=\"background-position: center;background-repeat: no-repeat;\">" +
                                      "<img class=\"playSeries\" src=\"img/playSeries.png\" />" +
                                "</div><h4>" + stagioneNumero + "x" + episodioNumero + "</h4>" +
                            "</div>";
            }

            var hostImg = listaLink[stagione].value[j].host.split("|")[1] ? listaLink[stagione].value[j].host.split("|")[1] : listaLink[stagione].value[j].host;
            link += "<div class=\"hidden marginBottom10\" host onclick=\"openVideo('" + listaLink[stagione].value[j].host + "','" + listaLink[stagione].value[j].id + "')\"><img width=\"200\" src=\"img/host/" + hostImg + ".png\"></div>";
        }
        link += "</div>";
    }
    if (link != "") {
        link += "</div>";

        //Mostro i link
        $('#playButton').html(link);
        getEpisodesInfo();
    } else {
        link = "<i class='fa fa-warning fa-2x'></i><br>Nessun link disponibile su questo canale. Prova su un altro.";
        $('#playButton').html(link);
    }

    $('.guarda').removeClass('hidden');
    $('#loadingLink').addClass('hidden');
    $('#playButton').removeClass('hidden');
    $('#playButton').addClass('backgroundBlack');

}