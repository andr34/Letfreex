﻿function speedvideoExtract(id, success, error, download) {
    var page = "http://speedvideo.net/" + id;
    $.ajax({
        url: page,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:18.0) Gecko/20100101 Firefox/18.0");
        },
        success: function (response) {
            console.log(response);
            try {
                var content = response;

                if (page.indexOf("embed") > -1) {
                    try {
                        extractLink(response);
                    } catch (e) {
                        error(e);
                    }
                } else {
                    var fname = content.split("fname\" value=\"")[1].split("\"")[0];
                    var hash = content.split("hash\" value=\"")[1].split("\"")[0];

                    doPostRequest(id, fname, hash);
                }


            } catch (ex) {
                error(ex);
            }
        },
        error: function (e) {
            error(e);
        }
    });
    
    function doPostRequest(id, fname, hash) {
        $.ajax({
            url: "http://speedvideo.net/" + id,
            type: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:18.0) Gecko/20100101 Firefox/18.0");
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            data:{
                op: "download1",
                usr_login: "",
                id: id,
                fname: fname,
                referer: "",
                hash: hash,
                imhuman: "Proceed+to+video"
            },
            success: function (response) {
                console.log(response);
                try {
                    extractLink(response);
                } catch (e) {
                    error(e);
                }
            },
            error: function (e) {
                error(e);
            }
        });
    }

    function extractLink(input) {
        var data = input.split('jwplayer.key=')[1].split('jQuery')[0];
        data = data.split("<script type='text/javascript'>")[1];
        var base = parseInt(data.split('= ')[1].split(';')[0]);

        var url = "";
        try {
            url = input.split("linkfile = '")[1].split("'")[0];
        } catch (e) {
            var linkEncoded = input.split('file: base64_decode("')[1].split('"')[0];

            var url = base64_decode(linkEncoded, base);

            url = url.replace("speedvideo.net/getvideo///", "");
            try {
                url = url.split(".mp4")[0] + ".mp4";
            } catch (e) {
                url = url.split(".flv")[0] + ".flv";
            }
        }

        //var linkEncoded = input.split('file: base64_decode("')[1].split('"')[0];

        //var url = base64_decode(linkEncoded, base);

        //url = url.replace("speedvideo.net/getvideo///", "");
        //try {
        //    url = url.split(".mp4")[0] + ".mp4";
        //} catch (e) {
        //    url = url.split(".flv")[0] + ".flv";
        //}
        
        //success(url.replace(".mp4", ".flv"), download);
        success(url, download);
    }

    //DECODE FUNCTIONS
    var _0x77de = ["\x73\x75\x62\x73\x74\x72", "\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4A\x4B\x4C\x4D\x4E\x4F\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5A\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6A\x6B\x6C\x6D\x6E\x6F\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7A\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2B\x2F\x3D", "", "\x63\x68\x61\x72\x41\x74", "\x69\x6E\x64\x65\x78\x4F\x66", "\x66\x72\x6F\x6D\x43\x68\x61\x72\x43\x6F\x64\x65", "\x6C\x65\x6E\x67\x74\x68", "\x6A\x6F\x69\x6E", "\x72\x65\x70\x6C\x61\x63\x65"]; function base64_decode(_0x4e6bx2, _0x4e6bx3) { var _0x4e6bx4 = _0x4e6bx2[_0x77de[0]](0, _0x4e6bx3); var _0x4e6bx5 = _0x4e6bx2[_0x77de[0]](_0x4e6bx3 + 10); _0x4e6bx2 = _0x4e6bx4 + _0x4e6bx5; var _0x4e6bx6 = _0x77de[1]; var _0x4e6bx7, _0x4e6bx8, _0x4e6bx9, _0x4e6bxa, _0x4e6bxb, _0x4e6bxc, _0x4e6bxd, _0x4e6bxe, _0x4e6bxf = 0, _0x4e6bx10 = 0, _0x4e6bx11 = _0x77de[2], _0x4e6bx12 = []; if (!_0x4e6bx2) { return _0x4e6bx2; }; _0x4e6bx2 += _0x77de[2]; do { _0x4e6bxa = _0x4e6bx6[_0x77de[4]](_0x4e6bx2[_0x77de[3]](_0x4e6bxf++)); _0x4e6bxb = _0x4e6bx6[_0x77de[4]](_0x4e6bx2[_0x77de[3]](_0x4e6bxf++)); _0x4e6bxc = _0x4e6bx6[_0x77de[4]](_0x4e6bx2[_0x77de[3]](_0x4e6bxf++)); _0x4e6bxd = _0x4e6bx6[_0x77de[4]](_0x4e6bx2[_0x77de[3]](_0x4e6bxf++)); _0x4e6bxe = _0x4e6bxa << 18 | _0x4e6bxb << 12 | _0x4e6bxc << 6 | _0x4e6bxd; _0x4e6bx7 = _0x4e6bxe >> 16 & 0xff; _0x4e6bx8 = _0x4e6bxe >> 8 & 0xff; _0x4e6bx9 = _0x4e6bxe & 0xff; if (_0x4e6bxc == 64) { _0x4e6bx12[_0x4e6bx10++] = String[_0x77de[5]](_0x4e6bx7); } else { if (_0x4e6bxd == 64) { _0x4e6bx12[_0x4e6bx10++] = String[_0x77de[5]](_0x4e6bx7, _0x4e6bx8); } else { _0x4e6bx12[_0x4e6bx10++] = String[_0x77de[5]](_0x4e6bx7, _0x4e6bx8, _0x4e6bx9); }; }; } while (_0x4e6bxf < _0x4e6bx2[_0x77de[6]]);; _0x4e6bx11 = _0x4e6bx12[_0x77de[7]](_0x77de[2]); return decodeURIComponent(escape(_0x4e6bx11[_0x77de[8]](/\0+$/, _0x77de[2]))); };

}

function removeLinkOfflineSpeedvideo(id, link) {
    $.ajax({
        url: "http://speedvideo.net/" + id,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:18.0) Gecko/20100101 Firefox/18.0");
        },
        success: function (response) {
            if (response.indexOf("File Not Found") != -1) {
                link.remove()
                if ($('div[host]:visible').length == 0) {
                    $("#modalContentId").html(nessunLinkDisponibile);
                }
            }
        },
        error: function (e) {
            console.error(e);
        }
    });
}