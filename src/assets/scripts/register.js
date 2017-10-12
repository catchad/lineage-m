var apiKey = $("#apikey").val();
var ww = window.innerWidth;
var wh = window.innerHeight;
var isAjaxing = false;

var textAnimateTimer = 0;
var app = new PIXI.Application(ww, wh, { forceCanvas: true, backgroundColor: 0x000000, view: document.getElementById('mapCanvas') });
var activePages = {};
var container = new PIXI.Container();
var mapWidth = 2048; // 1280
var mapHeight = 1024; // 640
var animSpeed = 0.075; // 角色動畫速度
var chatSpeed = 960; // 文字出現的速度 60=1秒 //原本480
var mapScrollSpeed = 10; // 滾輪移動地圖速度, 數字越小越快
var arrowMapSpeed = 50; // 箭頭移動地圖速度, 數字越小越快
var mapDistance = Math.sqrt(Math.pow(mapWidth / 2, 2) + Math.pow(mapHeight / 2, 2));
var angle = angleBetween({ x: 0, y: 0 }, { x: mapWidth / 2, y: -mapHeight / 2 });
var mapPosition = mapDistance / 2;

var totalPage;
var totalCount;
var registerCharacter;
var isDraging = false;
var dragMapPosition = 0;
var dragPosition = { x: 0, y: 0 };
var mapNum = 13; // 地圖數量13行 (39張)
var frontNum = 2; // 地圖有2行 (6張) 不加入迴圈
var pageMapNum = 4; // 一頁4行地圖 (12張)
(ww > 1920) && (pageMapNum = 5);
(ww <= 1920 && ww > 1024) && (pageMapNum = 3);
(ww <= 1024) && (pageMapNum = 2);
var characterNum = 16; // 每張地圖上人物8行 (24個)
var pageSize = pageMapNum * 3 * characterNum;
var cameraOffset = { x: 0, y: 0 };
ww < 1024 ? cameraOffset.y = 120 : cameraOffset.y = 50;
ww < 1024 ? cameraOffset.x = 60 : cameraOffset.x = 0;
var isMoveActive = false;
var moveDirection = 0;
var editData = {};
var fakeData = [];
var fakeText = ['賣+10屠龍刀 密我出價 鳥價不回', '賣帳號 99等女妖 密我', '老公我兵單來了 >"<', '幹好lag = =', '靠邀 超多人...', '我要下線了 881', '8口口口口D', '媽我上電視了 ^0^', '徵婆 會養 會疼 要真心 ^^', '收月卡70w 無限收 意密 ^^', '阿貴代練工作室 3天99等 有興趣請密', '血盟【天上人間】收人 歡迎新手 有老手會帶', '貴大師 死白目 搶怪開紅 見一次殺一次'];
for (var i = 0; i < 76727; i++) {
    fakeData.push({ memo: fakeText[Math.floor(Math.random() * fakeText.length)], userwear: (Math.floor(Math.random() * 16) + 1), guid: i });
}

var dropUserID;
var loader = new PIXI.loaders.Loader();
var options = {crossOrigin: ''};
loader.add('mapf1', 'https://tw.hicdn.beanfun.com/beanfun/GamaWWW/LineageM/Event_E20170921/assets/images/register/map/f1.png', options);
loader.add('mapf2', 'https://tw.hicdn.beanfun.com/beanfun/GamaWWW/LineageM/Event_E20170921/assets/images/register/map/f2.png', options);
loader.add('mapf3', 'https://tw.hicdn.beanfun.com/beanfun/GamaWWW/LineageM/Event_E20170921/assets/images/register/map/f3.png', options);
loader.add('edit', 'https://tw.hicdn.beanfun.com/beanfun/GamaWWW/LineageM/Event_E20170921/assets/images/register/edit.png', options);
loader.add('close', 'https://tw.hicdn.beanfun.com/beanfun/GamaWWW/LineageM/Event_E20170921/assets/images/register/close.png', options);
loader.add('fbshare', 'https://tw.hicdn.beanfun.com/beanfun/GamaWWW/LineageM/Event_E20170921/assets/images/register/fb.png', options);
loader.add('anim1', 'assets/images/register/animate/anim1.json', options);
loader.add('anim2', 'assets/images/register/animate/anim2.json', options);
loader.add('anim3', 'assets/images/register/animate/anim3.json', options);
loader.add('anim4', 'assets/images/register/animate/anim4.json', options);
// loader.add('anim5', 'assets/images/register/animate/anim5.json', options);
loader.add('anim6', 'assets/images/register/animate/anim6.json', options);
for (var i = 1; i <= 39; i++) {
    loader.add('map' + i, 'https://tw.hicdn.beanfun.com/beanfun/GamaWWW/LineageM/Event_E20170921/assets/images/register/map/' + i + '.png', options);
}

for (var i = 1; i <= 16; i++) {
    loader.add('character' + i, 'https://tw.hicdn.beanfun.com/beanfun/GamaWWW/LineageM/Event_E20170921/assets/images/register/character/' + i + '.png', options)
}

loader.on("progress", loadProgressHandler);

function loadProgressHandler(loader) {
    $(".loadprogress").html(parseInt(loader.progress) + "%");
}

loader.load(function (loader, resources) {

    container.pivot.set(0.5, 0.5);
    app.stage.addChild(container);
    var mapContainer = new PIXI.Container();
    container.addChild(mapContainer);
    var mapEndContainer = new PIXI.Container();
    container.addChild(mapEndContainer);
    var registerContainer = new PIXI.Container();
    container.addChild(registerContainer);
    var characterContainer = new PIXI.Container();
    container.addChild(characterContainer);
    var characterTextContainer = new PIXI.Container();
    container.addChild(characterTextContainer);
    var uiContainer = new PIXI.Container();
    container.addChild(uiContainer);



    // mapPosition = mapDistance/2;
    var p = getPoint(angle, mapPosition);
    container.x = window.innerWidth / 2 + p.x + cameraOffset.x;
    container.y = window.innerHeight / 2 + p.y + cameraOffset.y;

    var style = new PIXI.TextStyle({
        fontFamily: '微軟正黑體',
        fontSize: 16,
        fill: ['#ffffff'], // gradient
        stroke: '#000000',
        strokeThickness: 3
    });

    addMap(0);
    addMap(1);
    addMapFront();

    function addMapFront() {
        var rowCenter = { x: mapWidth / 2 * -1, y: -mapHeight / 2 * -1 };
        // var pageCenter = {x: mapWidth/2*(page-1)*mapNum, y: -mapHeight/2*(page-1)*mapNum };

        var map = new PIXI.Sprite(resources['mapf2'].texture);
        map.anchor.set(0.5);
        map.x = -mapWidth / 2;
        map.y = mapHeight / 2;
        map.width += 1;
        map.height += 1;
        container.addChild(map);

        var map2 = new PIXI.Sprite(resources['mapf1'].texture);
        map2.anchor.set(0.5);
        map2.x = rowCenter.x + mapWidth / 2;
        map2.y = rowCenter.y + mapHeight / 2;
        map2.width += 1;
        map2.height += 1;
        container.addChild(map2);

        var map3 = new PIXI.Sprite(resources['mapf3'].texture);
        map3.anchor.set(0.5);
        map3.x = rowCenter.x - mapWidth / 2;
        map3.y = rowCenter.y - mapHeight / 2;
        map3.width += 1;
        map3.height += 1;
        container.addChild(map3);
    }
    function addMapEnd() {
        page = totalPage + 1;
        var pageMapContainer = new PIXI.Container();
        var pageCharacterContainer = new PIXI.Container();
        var pageTextContainer = new PIXI.Container();

        for (var i = 0; i < pageMapNum; i++) {

            var rowCenter = { x: mapWidth / 2 * i, y: -mapHeight / 2 * i };
            var pageCenter = { x: mapWidth / 2 * page * pageMapNum, y: -mapHeight / 2 * page * pageMapNum };

            var m1 = ((page * pageMapNum * 3) + (i * 3)) + 1;
            var m2 = ((page * pageMapNum * 3) + (i * 3 + 1)) + 1;
            var m3 = ((page * pageMapNum * 3) + (i * 3 + 2)) + 1;

            if (m1 > mapNum * 3) m1 = Math.round((((page - mapNum / pageMapNum) * pageMapNum * 3) + (i * 3)) % (mapNum * 3 - frontNum * 3) + 1 + frontNum * 3);
            if (m2 > mapNum * 3) m2 = Math.round((((page - mapNum / pageMapNum) * pageMapNum * 3) + (i * 3 + 1)) % (mapNum * 3 - frontNum * 3) + 1 + frontNum * 3);
            if (m3 > mapNum * 3) m3 = Math.round((((page - mapNum / pageMapNum) * pageMapNum * 3) + (i * 3 + 2)) % (mapNum * 3 - frontNum * 3) + 1 + frontNum * 3);

            var map = new PIXI.Sprite(resources['map' + m2].texture);
            map.anchor.set(0.5);
            map.x = pageCenter.x + rowCenter.x;
            map.y = pageCenter.y + rowCenter.y;
            map.width += 1;
            map.height += 1;
            mapEndContainer.addChild(map);

            var map2 = new PIXI.Sprite(resources['map' + m1].texture);
            map2.anchor.set(0.5);
            map2.x = pageCenter.x + rowCenter.x + mapWidth / 2;
            map2.y = pageCenter.y + rowCenter.y + mapHeight / 2;
            map2.width += 1;
            map2.height += 1;
            mapEndContainer.addChild(map2);

            var map3 = new PIXI.Sprite(resources['map' + m3].texture);
            map3.anchor.set(0.5);
            map3.x = pageCenter.x + rowCenter.x - mapWidth / 2;
            map3.y = pageCenter.y + rowCenter.y - mapHeight / 2;
            map3.width += 1;
            map3.height += 1;
            mapEndContainer.addChild(map3);

        }

    }

    function addMap(page, completeFn) {
        if (page < 0 || page > totalPage) {
            if (completeFn !== undefined) {
                completeFn();
            }
            return;
        }

        activePages[page] = {};
        var characterData = [];

        $.ajax({
            url: setting.getdataAPIurl,
            type: 'POST',
            contentType: 'application/json; charset=UTF-8',
            dataType: 'json',
            data: JSON.stringify({ pagecount: pageSize, page: page })
        })
        .always(function (response) {

            if (response.data == undefined) {
                // 測試用
                for (var i = page * pageSize; i < (page * pageSize) + pageSize; i++) {
                    if (fakeData[i] !== undefined) characterData.push(fakeData[i]);
                }
                if (totalPage == undefined) {
                    // firsttime
                    totalPage = Math.ceil(fakeData.length / pageSize) - 1;
                    totalCount = fakeData.length;
                    addMapEnd();
                }

            } else {
                // 正式用
                if (response.code == "0000") {
                    characterData = response.data.data;
                    if (totalPage == undefined) {
                        totalPage = response.data.totalpage || 0;
                        totalCount = response.data.totalcount || 0;
                        addMapEnd();
                    }
                } else {
                    alertText(response.message);
                }
            }
            if (characterData.length == 0 || characterData == undefined) {
                if (completeFn !== undefined) completeFn();
                return;
            }
            updatePixi(page);
            if (completeFn !== undefined) {
                completeFn();
            }
        });



        function updatePixi(page) {
            var pageMapContainer = new PIXI.Container();
            var pageCharacterContainer = new PIXI.Container();
            var pageTextContainer = new PIXI.Container();
            var pageAnimContainer = new PIXI.Container();

            // console.log("---------------");
            for (var i = 0; i < pageMapNum; i++) {

                var rowCenter = { x: mapWidth / 2 * i, y: -mapHeight / 2 * i };
                var pageCenter = { x: mapWidth / 2 * page * pageMapNum, y: -mapHeight / 2 * page * pageMapNum };

                var m1 = ((page * pageMapNum * 3) + (i * 3)) + 1;
                var m2 = ((page * pageMapNum * 3) + (i * 3 + 1)) + 1;
                var m3 = ((page * pageMapNum * 3) + (i * 3 + 2)) + 1;

                if (m1 > mapNum * 3) m1 = Math.round((((page - mapNum / pageMapNum) * pageMapNum * 3) + (i * 3)) % (mapNum * 3 - frontNum * 3) + 1 + frontNum * 3);
                if (m2 > mapNum * 3) m2 = Math.round((((page - mapNum / pageMapNum) * pageMapNum * 3) + (i * 3 + 1)) % (mapNum * 3 - frontNum * 3) + 1 + frontNum * 3);
                if (m3 > mapNum * 3) m3 = Math.round((((page - mapNum / pageMapNum) * pageMapNum * 3) + (i * 3 + 2)) % (mapNum * 3 - frontNum * 3) + 1 + frontNum * 3);
                // console.log(m1, m2, m3);

                var map = new PIXI.Sprite(resources['map' + m2].texture);
                map.anchor.set(0.5);
                map.x = pageCenter.x + rowCenter.x;
                map.y = pageCenter.y + rowCenter.y;
                map.width += 1;
                map.height += 1;
                pageMapContainer.addChild(map);

                var map2 = new PIXI.Sprite(resources['map' + m1].texture);
                map2.anchor.set(0.5);
                map2.x = pageCenter.x + rowCenter.x + mapWidth / 2;
                map2.y = pageCenter.y + rowCenter.y + mapHeight / 2;
                map2.width += 1;
                map2.height += 1;
                pageMapContainer.addChild(map2);

                var map3 = new PIXI.Sprite(resources['map' + m3].texture);
                map3.anchor.set(0.5);
                map3.x = pageCenter.x + rowCenter.x - mapWidth / 2;
                map3.y = pageCenter.y + rowCenter.y - mapHeight / 2;
                map3.width += 1;
                map3.height += 1;
                pageMapContainer.addChild(map3);

                if (ww > 414) {
                    if (m2 == 8) {
                        var anim1 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim1']));
                        anim1.x = map.x + 100;
                        anim1.y = map.y + 100;
                        anim1.anchor.set(0.5);
                        anim1.animationSpeed = animSpeed;
                        anim1.play();
                        pageAnimContainer.addChild(anim1);

                        var anim4 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim4']));
                        anim4.x = map.x - 200;
                        anim4.y = map.y - 200;
                        anim4.anchor.set(0.5);
                        anim4.animationSpeed = animSpeed;
                        anim4.play();
                        pageAnimContainer.addChild(anim4);

                        var anim6 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim6']));
                        anim6.x = map.x + 200;
                        anim6.y = map.y - 500;
                        anim6.anchor.set(0.5);
                        anim6.animationSpeed = animSpeed;
                        anim6.play();
                        pageAnimContainer.addChild(anim6);

                    }

                    if (m2 == 11) {
                        var anim1 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim1']));
                        anim1.x = map.x;
                        anim1.y = map.y - 350;
                        anim1.anchor.set(0.5);
                        anim1.animationSpeed = animSpeed;
                        anim1.play();
                        pageAnimContainer.addChild(anim1);

                        var anim4 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim4']));
                        anim4.x = map.x - 200;
                        anim4.y = map.y + 250;
                        anim4.anchor.set(0.5);
                        anim4.animationSpeed = animSpeed;
                        anim4.play();
                        pageAnimContainer.addChild(anim4);

                        var anim6 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim6']));
                        anim6.x = map.x + 700;
                        anim6.y = map.y - 200;
                        anim6.anchor.set(0.5);
                        anim6.animationSpeed = animSpeed;
                        anim6.play();
                        pageAnimContainer.addChild(anim6);

                    }

                    if (m2 == 14) {
                        var anim2 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim2']));
                        anim2.x = map.x;
                        anim2.y = map.y - 350;
                        anim2.anchor.set(0.5);
                        anim2.animationSpeed = animSpeed;
                        anim2.play();
                        pageAnimContainer.addChild(anim2);

                        var anim3 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim3']));
                        anim3.x = map.x - 300;
                        anim3.y = map.y - 200;
                        anim3.anchor.set(0.5);
                        anim3.animationSpeed = animSpeed;
                        anim3.play();
                        pageAnimContainer.addChild(anim3);

                        var anim4 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim4']));
                        anim4.x = map.x + 300;
                        anim4.y = map.y + 100;
                        anim4.anchor.set(0.5);
                        anim4.animationSpeed = animSpeed;
                        anim4.play();
                        pageAnimContainer.addChild(anim4);

                    }

                    if (m2 == 17) {
                        var anim1 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim1']));
                        anim1.x = map.x - 350;
                        anim1.y = map.y - 350;
                        anim1.anchor.set(0.5);
                        anim1.animationSpeed = animSpeed;
                        anim1.play();
                        pageAnimContainer.addChild(anim1);

                        var anim2 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim2']));
                        anim2.x = map.x - 150;
                        anim2.y = map.y - 550;
                        anim2.anchor.set(0.5);
                        anim2.animationSpeed = animSpeed;
                        anim2.play();
                        pageAnimContainer.addChild(anim2);

                        var anim4 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim4']));
                        anim4.x = map.x + 550;
                        anim4.y = map.y + 100;
                        anim4.anchor.set(0.5);
                        anim4.animationSpeed = animSpeed;
                        anim4.play();
                        pageAnimContainer.addChild(anim4);
                    }

                    if (m2 == 20) {
                        var anim1 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim1']));
                        anim1.x = map.x - 400;
                        anim1.y = map.y - 300;
                        anim1.anchor.set(0.5);
                        anim1.animationSpeed = animSpeed;
                        anim1.play();
                        pageAnimContainer.addChild(anim1);
                    }

                    if (m2 == 23) {
                        var anim3 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim3']));
                        anim3.x = map.x + 320;
                        anim3.y = map.y + 220;
                        anim3.anchor.set(0.5);
                        anim3.animationSpeed = animSpeed;
                        anim3.play();
                        pageAnimContainer.addChild(anim3);
                    }

                    if (m2 == 26) {
                        var anim1 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim1']));
                        anim1.x = map.x + 250;
                        anim1.y = map.y + 150;
                        anim1.anchor.set(0.5);
                        anim1.animationSpeed = animSpeed;
                        anim1.play();
                        pageAnimContainer.addChild(anim1);

                        var anim2 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim2']));
                        anim2.x = map.x + 50;
                        anim2.y = map.y + 250;
                        anim2.anchor.set(0.5);
                        anim2.animationSpeed = animSpeed;
                        anim2.play();
                        pageAnimContainer.addChild(anim2);

                        var anim4 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim4']));
                        anim4.x = map.x - 700;
                        anim4.y = map.y - 50;
                        anim4.anchor.set(0.5);
                        anim4.animationSpeed = animSpeed;
                        anim4.play();
                        pageAnimContainer.addChild(anim4);
                    }

                    if (m2 == 29) {
                        var anim1 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim1']));
                        anim1.x = map.x + 250;
                        anim1.y = map.y + 50;
                        anim1.anchor.set(0.5);
                        anim1.animationSpeed = animSpeed;
                        anim1.play();
                        pageAnimContainer.addChild(anim1);

                        var anim2 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim2']));
                        anim2.x = map.x - 730;
                        anim2.y = map.y - 80;
                        anim2.anchor.set(0.5);
                        anim2.animationSpeed = animSpeed;
                        anim2.play();
                        pageAnimContainer.addChild(anim2);

                        var anim4 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim4']));
                        anim4.x = map.x + 50;
                        anim4.y = map.y + 150;
                        anim4.anchor.set(0.5);
                        anim4.animationSpeed = animSpeed;
                        anim4.play();
                        pageAnimContainer.addChild(anim4);
                    }

                    if (m2 == 32) {
                        var anim3 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim3']));
                        anim3.x = map.x;
                        anim3.y = map.y - 420;
                        anim3.anchor.set(0.5);
                        anim3.animationSpeed = animSpeed;
                        anim3.play();
                        pageAnimContainer.addChild(anim3);
                    }

                    if (m2 == 35) {
                        var anim1 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim1']));
                        anim1.x = map.x + 250;
                        anim1.y = map.y;
                        anim1.anchor.set(0.5);
                        anim1.animationSpeed = animSpeed;
                        anim1.play();
                        pageAnimContainer.addChild(anim1);

                        var anim2 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim2']));
                        anim2.x = map.x - 630;
                        anim2.y = map.y - 80;
                        anim2.anchor.set(0.5);
                        anim2.animationSpeed = animSpeed;
                        anim2.play();
                        pageAnimContainer.addChild(anim2);
                    }

                    if (m2 == 38) {
                        var anim1 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim1']));
                        anim1.x = map.x - 150;
                        anim1.y = map.y - 350;
                        anim1.anchor.set(0.5);
                        anim1.animationSpeed = animSpeed;
                        anim1.play();
                        pageAnimContainer.addChild(anim1);

                        var anim2 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim2']));
                        anim2.x = map.x - 250;
                        anim2.y = map.y - 200;
                        anim2.anchor.set(0.5);
                        anim2.animationSpeed = animSpeed;
                        anim2.play();
                        pageAnimContainer.addChild(anim2);

                        var anim4 = new PIXI.extras.AnimatedSprite(getAnimTextureArr(resources['anim4']));
                        anim4.x = map.x - 550;
                        anim4.y = map.y - 150;
                        anim4.anchor.set(0.5);
                        anim4.animationSpeed = animSpeed;
                        anim4.play();
                        pageAnimContainer.addChild(anim4);
                    }
                }


                for (var j = 0; j < characterNum; j++) {
                    var id = (i * characterNum * 3) + (j * 3);
                    var r = j * mapDistance / characterNum + (mapDistance / characterNum / 2) - mapDistance / 2;
                    var characterCenter = getPoint(angle, r);
                    characterCenter.x -= 20;
                    characterCenter.y -= 20;

                    for (var k = 0; k < 3; k++) {
                        if (characterData[id + k] !== undefined) {
                            // console.log(characterData[id + k].guid + " " + dropUserID);
                            if (characterData[id + k].guid != dropUserID) {
                                var newCharacter = new PIXI.Sprite(resources['character' + characterData[id + k].userwear].texture);
                                newCharacter.anchor.set(0.5, 1);
                                newCharacter.zIndex = id + k;

                                if (k == 0) {
                                    var p = getPoint(-angle + Math.PI, 80);
                                    newCharacter.x = pageCenter.x + rowCenter.x + characterCenter.x + p.x;
                                    newCharacter.y = pageCenter.y + rowCenter.y + characterCenter.y + p.y;
                                }
                                if (k == 1) {
                                    newCharacter.x = pageCenter.x + rowCenter.x + characterCenter.x;
                                    newCharacter.y = pageCenter.y + rowCenter.y + characterCenter.y;
                                }
                                if (k == 2) {
                                    var p = getPoint(-angle, 80);
                                    newCharacter.x = pageCenter.x + rowCenter.x + characterCenter.x + p.x;
                                    newCharacter.y = pageCenter.y + rowCenter.y + characterCenter.y + p.y;
                                }

                                newCharacter.scale.set(0.9, 0.9);
                                newCharacter.data = { guid: characterData[id + k].guid, memo: characterData[id + k].memo };
                                pageCharacterContainer.addChild(newCharacter);

                                var text = new PIXI.Text(characterData[id + k].memo, style);
                                text.zIndex = id + k;
                                text.x = newCharacter.x;
                                text.y = newCharacter.y - 120;
                                text.anchor.set(0.5, 0.5);
                                text.alpha = 0;
                                text.data = { fixedPosition: { x: text.x, y: text.y }, time: Math.floor(Math.random() * chatSpeed) };
                                pageTextContainer.addChild(text);
                            } else {
                                dropUserID = undefined;
                            }
                        }
                    }
                }
            }

            //角色z-index排序
            pageCharacterContainer.children.sort(function (b, a) {
                a.zIndex = a.zIndex || 0;
                b.zIndex = b.zIndex || 0;
                return a.zIndex - b.zIndex;
            });
            pageTextContainer.children.sort(function (b, a) {
                a.zIndex = a.zIndex || 0;
                b.zIndex = b.zIndex || 0;
                return a.zIndex - b.zIndex;
            });

            mapContainer.addChild(pageMapContainer);
            characterContainer.addChild(pageCharacterContainer);
            characterContainer.addChild(pageAnimContainer);
            characterTextContainer.addChild(pageTextContainer);
            activePages[page] = { content: [pageMapContainer, pageCharacterContainer, pageTextContainer, pageAnimContainer] }
        }
    }

    // var textAnimateTarget = [];
    app.ticker.add(function (delta) {
        textAnimateTimer++;
        for (var key in activePages) {
            if (activePages[key].content == undefined) continue;
            for (var i = 0; i < activePages[key].content[2].children.length; i++) {
                var target = activePages[key].content[2].children[i];
                if (target.data.time == textAnimateTimer) {
                    TweenMax.fromTo(target, 0.5, { y: target.data.fixedPosition.y + 30, alpha: 0 }, { y: target.data.fixedPosition.y, alpha: 1, immediateRender: false });
                    TweenMax.fromTo(target, 0.5, { y: target.data.fixedPosition.y, alpha: 1 }, { y: target.data.fixedPosition.y + 30, alpha: 0, delay: 2, immediateRender: false });
                }
            }
        }

        if (registerCharacter !== undefined) {
            var target = registerCharacter.text;
            if (target.data.time == textAnimateTimer) {
                TweenMax.fromTo(target, 0.5, { y: target.data.fixedPosition.y + 30, alpha: 0 }, { y: target.data.fixedPosition.y, alpha: 1, immediateRender: false });
                TweenMax.fromTo(target, 0.5, { y: target.data.fixedPosition.y, alpha: 1 }, { y: target.data.fixedPosition.y + 30, alpha: 0, delay: 2, immediateRender: false });

            }
        }
        if (textAnimateTimer == chatSpeed) textAnimateTimer = 0;


        if (isMoveActive) {
            if (totalCount == undefined) return;
            if (moveDirection == 1) {
                mapPosition -= mapDistance / arrowMapSpeed; //60 30
            } else {
                mapPosition += mapDistance / arrowMapSpeed;
            }
            mapPosition = Math.max(Math.min(mapPosition, mapDistance / 2), getCharacterMapPosition(totalCount) - 200);
            updateCamera();
        }
    });
    function characterClick(event) {

    }
    function removeMap(page) {
        if (page < 0 && page > totalPage) return;
        for (var i = 0; i < activePages[page].content[2].children.length; i++) {
            TweenMax.killTweensOf(activePages[page].content[2].children[i]);
        }
        for (var i = 0; i < activePages[page].content.length; i++) {
            activePages[page].content[i].destroy({ children: true });
        }
        delete activePages[page];
    }


    $("#mapCanvas").on('mousewheel', function (event) {
        if (totalCount == undefined) return;

        if (event.deltaY > 0) {
            mapPosition -= mapDistance / mapScrollSpeed;
        } else {
            mapPosition += mapDistance / mapScrollSpeed;
        }
        mapPosition = Math.max(Math.min(mapPosition, mapDistance / 2), getCharacterMapPosition(totalCount) - 200);
        updateCamera();
    });

    function updateCamera(parameter) {
        if (parameter == undefined) parameter = {};
        if (parameter.speed == undefined) parameter.speed = 0.5;
        // parameter.targetID
        // parameter.completeFn
        // parameter.speed
        if (parameter.targetID !== undefined) {
            mapPosition = getCharacterMapPosition(parameter.targetID);
        }
        // var a = Math.floor(-mapPosition+mapDistance/2);
        // var b = Math.floor(mapDistance*pageMapNum);
        // var c = Math.floor(a/b);

        var currentPage = Math.floor(Math.floor(-mapPosition + mapDistance / 2) / Math.floor(mapDistance * pageMapNum));
        //console.log(currentPage);

        if (activePages[currentPage] == undefined) {
            if (parameter !== undefined) {
                addMap(currentPage, parameter.completeFn);
            } else {
                addMap(currentPage);
            }
        } else {
            if (parameter.completeFn !== undefined) {
                parameter.completeFn();
            }
        }
        if (activePages[currentPage + 1] == undefined) {
            addMap(currentPage + 1);
        }
        if (activePages[currentPage - 1] == undefined) {
            addMap(currentPage - 1);
        }
        for (var key in activePages) {
            if (Number(key) !== currentPage && Number(key) !== currentPage + 1 && Number(key) !== Math.max(currentPage - 1, 0)) {
                removeMap(key);
            }
        }

        if (ww < 1024) {
            container.scale.set(0.7, 0.7);
            if (activePages[key] && activePages[key].content) {
                for (var i = 0; i < activePages[key].content[2].children.length; i++) {
                    var target = activePages[key].content[2].children[i];
                    target.style.fontSize = "22px";
                }
            }
        } else {
            container.scale.set(1, 1);
            if (activePages[key] && activePages[key].content) {
                for (var i = 0; i < activePages[key].content[2].children.length; i++) {
                    var target = activePages[key].content[2].children[i];
                    target.style.fontSize = "16px";
                }
            }
        }

        var p = getPoint(angle, mapPosition);
        if (parameter.noTween == true) {

            if (parameter.targetID !== undefined) {
                var p1 = getPoint(angle, mapPosition - 1000);
                container.x = (window.innerWidth / 2 + p1.x + cameraOffset.x) * container.scale.x;
                container.y = (window.innerHeight / 2 + p1.y + cameraOffset.y) * container.scale.x;
                var p2 = getPoint(angle, mapPosition);
                TweenMax.to(container, 1.5, { x: (window.innerWidth / 2 + p2.x + cameraOffset.x) * container.scale.x, y: (window.innerHeight / 2 + p2.y + cameraOffset.y) * container.scale.x });
            } else {
                container.x = (window.innerWidth / 2 + p.x + cameraOffset.x) * container.scale.x;
                container.y = (window.innerHeight / 2 + p.y + cameraOffset.y) * container.scale.x;
            }
        } else {
            TweenMax.to(container, parameter.speed, { x: (window.innerWidth / 2 + p.x + cameraOffset.x) * container.scale.x, y: (window.innerHeight / 2 + p.y + cameraOffset.y) * container.scale.x });
        }

        if (uiContainer.children.length > 0) {
            var uiPosition = -distanceBetween({ x: uiContainer.children[2].x, y: uiContainer.children[2].y }, { x: 0, y: 0 });
            var d = Math.abs(mapPosition - uiPosition);
            if (d > 1500) {
                removeEditMemoUI();
            }
        }
    }

    $("#info .search .icon").on('click', function (event) {
        if (isAjaxing) return;
        isAjaxing = true;
        $.ajax({
            url: setting.getdataAPIurl,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify({ pagecount: 1, location: $("#searchLocation").val(), phone: $("#searchPhone").val() })
        })
        .always(function (response) {
            isAjaxing = false;
            if (response.data == undefined) {
                // 測試用
                var guid = 100;
                updateCamera({
                    targetID: guid, noTween: true, completeFn: function () {
                        addEditMemoUI(guid);
                    }
                })
            } else {
                // 正式用
                if (response.code == "0000") {
                    if (response.data.data.length !== 0) {
                        totalCount = response.data.totalcount;
                        updateCamera({
                            targetID: response.data.data[0].guid, noTween: true, completeFn: function () {
                                addEditMemoUI(response.data.data[0].guid);
                            }
                        })
                    } else {
                        alertText("查無資料");
                    }
                } else {
                    alertText(response.message);
                }
            }
        });
    });

    function addEditMemoUI(guid) {
        if (uiContainer.children.length > 0) {
            removeEditMemoUI();
        }
        var character;
        var characterText;
        if (guid == totalCount) {
            character = registerCharacter.character;
            characterText = registerCharacter.text;
        } else {
            for (var key in activePages) {
                if (activePages[key].content == undefined) continue;
                for (var i = 0; i < activePages[key].content[1].children.length; i++) {
                    // console.log( activePages[key].content[1].children[i].data.guid );
                    if (activePages[key].content[1].children[i].data.guid == guid) {
                        character = activePages[key].content[1].children[i];
                        characterText = activePages[key].content[2].children[i];
                        //console.log(guid);
                        //console.log(characterText.text);
                        break;
                    }
                }
            }
        }
        
        characterText.visible = false;
        editData.memo = characterText.text;
        editData.phone = $("#searchPhone").val();
        editData.location = $("#searchLocation").val();
        editData.textObject = characterText;
        editData.characterObject = character;

        var textPadding = 10;
        var boxPaddingWidth = 30;
        var boxPaddingHeight = 20;
        var text = new PIXI.Text(character.data.memo, style);
        var editBtn = new PIXI.Sprite(resources['edit'].texture);
        var closeBtn = new PIXI.Sprite(resources['close'].texture);
        var fbshareBtn = new PIXI.Sprite(resources['fbshare'].texture);

        fbshareBtn.x = character.x - editBtn.width / 2 - closeBtn.width / 2 - text.width / 2 - textPadding / 2 - 3;
        fbshareBtn.y = character.y - 120;
        fbshareBtn.anchor.set(0.5, 0.5);
        fbshareBtn.interactive = true;
        fbshareBtn.buttonMode = true;
        fbshareBtn.on('pointerdown', fbShareClick);

        text.x = fbshareBtn.x + fbshareBtn.width / 2 + textPadding / 2 + text.width / 2;
        text.y = character.y - 120;
        text.anchor.set(0.5, 0.5);

        editBtn.x = text.x + text.width / 2 + textPadding / 2 + editBtn.width / 2;
        editBtn.y = character.y - 120;
        editBtn.anchor.set(0.5, 0.5);
        editBtn.interactive = true;
        editBtn.buttonMode = true;
        editBtn.on('pointerdown', editBtnClick);

        closeBtn.x = editBtn.x + editBtn.width / 2 + textPadding / 2 + closeBtn.width / 2;
        closeBtn.y = character.y - 120;
        closeBtn.anchor.set(0.5, 0.5);
        closeBtn.interactive = true;
        closeBtn.buttonMode = true;
        closeBtn.on('pointerdown', removeEditMemoUI);

        var graphics = new PIXI.Graphics();
        var textBoxWidth = text.width + editBtn.width + closeBtn.width + fbshareBtn.width + textPadding + boxPaddingWidth;
        var textBoxHeight = text.height + boxPaddingHeight;
        // graphics.anchor.set(0.5, 0.5);
        graphics.lineStyle(2, 0xCCCCCC, 1);
        graphics.beginFill(0x000000, 0.5);
        graphics.drawRoundedRect(-textBoxWidth / 2, -textBoxHeight / 2, textBoxWidth, textBoxHeight, 7);
        graphics.endFill();
        graphics.x = character.x;
        graphics.y = character.y - 120;

        uiContainer.addChild(graphics);
        uiContainer.addChild(text);
        uiContainer.addChild(editBtn);
        uiContainer.addChild(closeBtn);
        uiContainer.addChild(fbshareBtn);
        TweenMax.fromTo(uiContainer, 0.5, { alpha: 0, y: 50 }, { alpha: 1, y: 0 });
    }

    function removeEditMemoUI() {
        // if( uiContainer.children.length > 0 ) {
        //     remove();
        // } else {

        // }
        // uiContainer.getChildAt(3).off('pointerdown');
        // TweenMax.to(uiContainer, 0.5, {alpha:0, y:50, onComplete:remove});

        // function remove() {
        uiContainer.removeChildren();
        for (var key in activePages) {
            if (activePages[key].content == undefined) continue;
            for (var i = 0; i < activePages[key].content[2].children.length; i++) {
                activePages[key].content[2].children[i].visible = true;
            }
        }
        // }


    }

    function getCharacterMapPosition(id) {
        // id是玩家編號, 0是第一個
        var page = Math.floor(id / pageSize);
        var characterID = id % pageSize;
        // var lastCharacterNum = totalCount%pageSize; //殘數
        var rowNum = Math.floor(characterID / (characterNum * 3));
        var characterRowNum = Math.floor((characterID % (characterNum * 3)) / 3);
        var r = characterRowNum * mapDistance / characterNum + (mapDistance / characterNum / 2) - mapDistance / 2;
        var characterCenter = getPoint(angle, r);
        characterCenter.x -= 20;
        characterCenter.y -= 20;

        var rowCenter = { x: mapWidth / 2 * rowNum, y: -mapHeight / 2 * rowNum };
        var pageCenter = { x: mapWidth / 2 * page * pageMapNum, y: -mapHeight / 2 * page * pageMapNum };

        var lastCharacterCenter = { x: rowCenter.x + pageCenter.x + characterCenter.x, y: rowCenter.y + pageCenter.y + characterCenter.y };
        var position = -distanceBetween(lastCharacterCenter, { x: 0, y: 0 });
        if (id < (characterNum * 3) / 2) position *= -1;
       // console.log("pos:" + position);
        return position;

    }

    // $(".search").on("click", function() {
    //     // updateCamera({targetID: totalCount, noTween:true, completeFn:function(){
    //     //     var fakeee = {memo:"喔喔喔", userwear:1, guid:totalCount+10};
    //     //     dropUser(fakeee);
    //     // }})
    //     var id = prompt("id");
    //     id = parseInt(id);
    //     updateCamera({targetID: id, noTween:true, completeFn:function(){
    //         dropUser({memo: $("#formMemo").val(), userwear: '7', guid:id});
    //         console.log(totalCount);
    //     }})

    // })

    function dropUser(parameter) {
        // parameter.memo
        // parameter.userwear
        // parameter.guid
        var page = Math.floor(parameter.guid / pageSize);
        var lastCharacterNum = totalCount % pageSize; //殘數
        var lastRowNum = Math.floor(lastCharacterNum / (characterNum * 3));
        var lastCharacterRowNum = Math.floor((lastCharacterNum % (characterNum * 3)) / 3)

        // 最後一個排隊者, 位在行中第幾個, 0 = 第三個, 1 = 第一個, 2 = 第三個
        var lastPosition = (lastCharacterNum % (characterNum * 3)) % 3;
        var r = lastCharacterRowNum * mapDistance / characterNum + (mapDistance / characterNum / 2) - mapDistance / 2;
        var characterCenter = getPoint(angle, r);
        characterCenter.x -= 20;
        characterCenter.y -= 20;
        var rowCenter = { x: mapWidth / 2 * lastRowNum, y: -mapHeight / 2 * lastRowNum };
        var pageCenter = { x: mapWidth / 2 * page * pageMapNum, y: -mapHeight / 2 * page * pageMapNum };

        var lastCharacterCenter = { x: rowCenter.x + pageCenter.x + characterCenter.x, y: rowCenter.y + pageCenter.y + characterCenter.y };
        mapPosition = -distanceBetween(lastCharacterCenter, { x: 0, y: 0 });

        // var newCharacter;
        var r = (lastCharacterRowNum) * mapDistance / characterNum + (mapDistance / characterNum / 2) - mapDistance / 2;
        var characterCenter = getPoint(angle, r);
        characterCenter.x -= 20;
        characterCenter.y -= 20;

        var newCharacter = new PIXI.Sprite(resources['character' + parameter.userwear].texture);
        newCharacter.anchor.set(0.5, 1);

        if (lastPosition == 0) {
            var p = getPoint(-angle + Math.PI, 80);
            newCharacter.x = pageCenter.x + rowCenter.x + characterCenter.x + p.x;
            newCharacter.y = pageCenter.y + rowCenter.y + characterCenter.y + p.y;
        }

        if (lastPosition == 1) {
            newCharacter.x = pageCenter.x + rowCenter.x + characterCenter.x;
            newCharacter.y = pageCenter.y + rowCenter.y + characterCenter.y;
        }

        if (lastPosition == 2) {
            var p = getPoint(-angle, 80);
            newCharacter.x = pageCenter.x + rowCenter.x + characterCenter.x + p.x;
            newCharacter.y = pageCenter.y + rowCenter.y + characterCenter.y + p.y;
        }

        newCharacter.anchor.set(0.5, 1);
        newCharacter.scale.set(0.9, 0.9);
        newCharacter.on('pointerdown', characterClick);
        newCharacter.data = { guid: parameter.guid, memo: parameter.memo };
        registerContainer.addChild(newCharacter);

        var text = new PIXI.Text(parameter.memo, style);
        text.x = newCharacter.x;
        text.y = newCharacter.y - 120;
        text.anchor.set(0.5, 0.5);
        text.alpha = 0;
        text.data = { fixedPosition: { x: text.x, y: text.y }, time: (textAnimateTimer + 120) % chatSpeed };
        registerContainer.addChild(text);

        TweenMax.from(newCharacter, 1, { y: "-=150", alpha: 0, ease: Bounce.easeOut, delay: 1.5 });
        registerCharacter = { character: newCharacter, text: text };
    }

    function fbShareClick() {
        window.open("http://www.facebook.com/sharer/sharer.php?u=https://event.beanfun.com/LineageM/E20170921/register.aspx", "_blank");
    }

    function editBtnClick() {
        // alertText("edit!");
        $("#edit").addClass('active');
        $("#editMemo").val(editData.memo);
    }


    $("#editBtn").on('click', function (event) {
        if (isAjaxing) return;
        isAjaxing = true;

        var data = {
            location: editData.location,
            phone: editData.phone,
            memo: $("#editMemo").val()
        }
        $.ajax({
            url: setting.writetodayAPIurl,
            type: 'POST',
            contentType: 'application/json; charset=UTF-8',
            headers: {
                apikey: $("#apikey").val()
            },
            dataType: 'json',
            data: JSON.stringify(data)
        })
        .always(function (response) {
            isAjaxing = false;
            if (response.data == undefined) {
                // 測試
                editData.characterObject.data.memo = $("#editMemo").val();
                editData.textObject.text = $("#editMemo").val();
                TweenMax.killTweensOf(editData.textObject.text);
                editData.textObject.data.time = (textAnimateTimer + 30) % chatSpeed;
                $("#edit").removeClass('active');
                removeEditMemoUI();
                isDraging = false;
            } else {
                // 正式
                if (response.code == "0000") {
                    editData.characterObject.data.memo = $("#editMemo").val();
                    editData.textObject.text = $("#editMemo").val();
                    TweenMax.killTweensOf(editData.textObject);
                    editData.textObject.data.time = (textAnimateTimer + 30) % chatSpeed;
                    $("#edit").removeClass('active');
                    removeEditMemoUI();
                    alertText("修改完成!");
                    isDraging = false;
                } else {
                    alertText(response.message)
                }

            }

        });
    });

    $("#registerSendBtn").on('click', function (event) {
        if (isAjaxing) return;

        if (!$("#ruleCheckbox").prop("checked")) {
            alertText("請同意隱私權政策");
            return;
        }

        var data = {
            location: $("#formLocation").val(),
            phone: $("#formPhone").val(),
            memo: $("#formMemo").val(),
            pagecount: pageSize
        }
        if ($("#formLocation").val() == "TW") {
            if (!/((?=(09))[0-9]{10})$/g.test(String(data.phone))) {
                if (!/((?=(9))[0-9]{9})$/g.test(String(data.phone))) {
                    alertText("手機號碼格式不正確");
                    return;
                }
            }
        } else if ($("#formLocation").val() == "HK") {
            if (!/([0-9]{8})$/g.test(String(data.phone))) {
                alertText("手機號碼格式不正確");
                return;
            }
        } else {
            if (!/([0-9]{8})$/g.test(String(data.phone))) {
                alertText("手機號碼格式不正確");
                return;
            }
        }


        if (data.memo.length > 10) {
            alertText("留言字數超過限制(10字)");
            return;
        }

        if (data.memo.length == 0) {
            alertText("請輸入留言");
            return;
        }
        if (checkCookie()) {
            grecaptcha.execute();
            return;
        } else {
            window.formSubmitAjax(data);
        }

    });

    window.formSubmitAjax = function (data) {
        isAjaxing = true;
        $.ajax({
            url: setting.lineupAPIurl,
            type: 'POST',
            headers: {
                apikey: $("#apikey").val()
            },
            contentType: 'application/json; charset=UTF-8',
            dataType: 'json',
            data: JSON.stringify(data)
        })
        .always(function (response) {
            isAjaxing = false;

            if (response.data == undefined) {
                $("#form").removeClass("active");
                $("#registerBtn").removeClass("btn--active");
                updateCamera({
                    targetID: totalCount, noTween: true, completeFn: function () {
                        dropUser({ memo: $("#formMemo").val(), userwear: '7', guid: totalCount });
                    }
                })
            } else {
                if (response.code == "0000") {
                    $("#form").removeClass("active");
                    $("#registerBtn").removeClass("btn--active");
                    dropUserID = response.data.data[0].guid;
                    updateCamera({
                        targetID: response.data.data[0].guid, noTween: true, completeFn: function () {
                            dropUser({ memo: response.data.data[0].memo, userwear: response.data.data[0].userwear, guid: response.data.data[0].guid });
                        }
                    })
                } else {
                    if (response.code == "9995") {
                        alertText("請勿輸入不雅詞句！");
                        $("#formMemo").val("");
                        // $("#form").removeClass("active");
                        // $("#registerBtn").removeClass("btn--active");                 
                        // $("#searchPhone").val($("#formPhone").val());
                        // $("#searchLocation").val($("#formLocation").val());
                        // $("#info .search .icon").trigger('click');
                    } else {
                        alertText(response.message);
                    }

                }
            }
        });
    }



    // 箭頭移動地圖
    $(".arrow").on('touchstart mousedown', function (event) {
        isMoveActive = true;
        if ($(this).hasClass('left')) {
            moveDirection = 0;
        } else {
            moveDirection = 1;
        }
    });

    $(".arrow").on('touchend mouseup mouseleave', function (event) {
        isMoveActive = false;
    });

    $('.arrow').on('dragstart mousemove touchmove', function (event) { event.preventDefault(); });


    // 拖曳地圖
    $("#mapCanvas").on('mousedown touchstart', function (event) {
        isDraging = true;
        event.touches ? dragPosition = { x: event.touches[0].pageX, y: event.touches[0].pageY } : dragPosition = { x: event.pageX, y: event.pageY };
        dragMapPosition = mapPosition;
    });

    $("#mapCanvas").on('mouseup touchend', function (event) {
        isDraging = false;
    });

    $("#mapCanvas").on('mousemove touchmove', function (event) {
        if (!isDraging) return;
        var nowPosition;
        var value;
        event.touches ? nowPosition = { x: event.touches[0].pageX, y: event.touches[0].pageY } : nowPosition = { x: event.pageX, y: event.pageY };
        dragPosition.x > nowPosition.x ? value = -distanceBetween(dragPosition, nowPosition) : value = distanceBetween(dragPosition, nowPosition);
        mapPosition = Math.max(Math.min(dragMapPosition + value, mapDistance / 2), getCharacterMapPosition(totalCount) - 200);
        updateCamera({ noTween: true });
    });

    resizeHandler();
    $(window).on('resize', resizeHandler);

    function resizeHandler() {
        ww = window.innerWidth;
        wh = window.innerHeight;
        ww < 1024 ? cameraOffset.y = 300 : cameraOffset.y = 50;
        ww < 1024 ? cameraOffset.x = 60 : cameraOffset.x = 0;
        app.renderer.resize(ww, wh);
        updateCamera();
    }

    setTimeout(loadComplete, 1000);
    function loadComplete() {
        $(".loading").removeClass("loading--active");
        mapPosition -= 1000;
        updateCamera({ noTween: true });
        mapPosition += 1000;
        updateCamera({ speed: 2 });
    }
});


function distanceBetween(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}
function angleBetween(point1, point2) {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
}
function getPoint(theta, r) {
    var x = (r * Math.sin(theta));
    var y = (r * Math.cos(theta));
    return { x: x, y: y };
}
function getAnimTextureArr(target) {
    var arr = [];
    for (var key in target.textures) {
        arr.push(target.textures[key]);
    }
    return arr;
}

function ready() {
    $("#form").addClass("active");
    $("#registerBtn").on('click', function (event) {
        $("#form").addClass("active");
    });
    $(".ruleBtn").on('click', function (event) {
        $("#rule").addClass("active");
    });
    $(".ruleBtn").on('click', function (event) {
        $("#rule").addClass("active");
    });
    $(".treasureBtn").on("click", function () {
        $("#treasureInfo").addClass("active");
    })
    $(".lightbox .close").on('click', function (event) {
        $(this).parents(".lightbox").removeClass("active");
        isDraging = false;
    });
    // checkCookie();
}

function setCookie(c_name, value, expireSec) {
    var exdate = new Date();
    exdate.setSeconds(exdate.getSeconds() + expireSec);
    // console.log(c_name+ "=" +value+((expireSec==null) ? "" : ";expires="+exdate.toGMTString()));
    document.cookie = c_name + "=" + escape(value) + ((expireSec == null) ? "" : ";expires=" + exdate.toGMTString());
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
    }
    return "";
}

function checkCookie() {
    var time = getCookie('time');
    if (time != null && time != "") {
        return true;
    }
    else {
        var exdate = new Date();
        setCookie("time", exdate.toGMTString(), 20);
        return false;
    }
}

function formSubmit() {
   // console.log("!!");
    var data = {
        location: $("#formLocation").val(),
        phone: $("#formPhone").val(),
        memo: $("#formMemo").val(),
        pagecount: pageSize
    }
    window.formSubmitAjax(data);
}

ready();