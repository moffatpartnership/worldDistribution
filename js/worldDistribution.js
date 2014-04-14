// startup vars
var wdappHeight = 756,
    wdappWidth = 1104,
    wdimages = [],
    wdloader;

// wrapper
window.WDViewer = {};

//wdloader
(function(){

    var allData, mapItems, keyItems, dataload, src;

    function Loader() {

    }

    Loader.prototype.loadData = function() {

        var storygroupid = document.getElementById("canvasWorldDistribution").getAttribute("data-haplogroup-id");

        $.getJSON('https://api.moffpart.com/api/1/databases/sdnacontent/collections/c2WorldDistribution?q={"storygroupid":"'+ storygroupid +'"}&apiKey=50e55b5fe4b00738efa04da0&callback=?', function(ret) {

            mapItems = ret[0].mapItems;
            keyItems = ret[0].keyItems;
            src = ret[0].src;

            var manifest = [
                {src:src, id:"image1"}
            ];

            wdloader = new createjs.LoadQueue(false);
            wdloader.addEventListener("fileload", handleFileLoad);
            wdloader.addEventListener("complete", handleComplete);
            wdloader.loadManifest(manifest);

            function handleFileLoad(event) {
                wdimages.push(event.item);
            }

            function handleComplete(event) {

                parseData();
            }
        });

        // preloader graphics
        var prossElement = document.createElement('div'),
            dialogElement = document.createElement('div'),
            spinElement = document.createElement('div'),
            paraElement = document.createElement('p'),
            textItem = document.createTextNode("Loading mapItems…");

        prossElement.setAttribute('id', "Processing");
        prossElement.setAttribute('Style', "height:" + wdappHeight + "px; width:" + wdappWidth + "px;");
        dialogElement.setAttribute('class','dialog');
        spinElement.setAttribute('class','spinner-container');

        paraElement.appendChild(textItem);
        dialogElement.appendChild(paraElement);
        prossElement.appendChild(dialogElement);
        document.getElementById("canvasWorldDistribution").appendChild(prossElement);
        $('#Processing').show();
    };

    function parseData() {

        dataload = true;
    }

    Loader.prototype.loadStatus = function() {

        return dataload
    };

    Loader.prototype.returnData = function() {

        allData = {
            mapItems:mapItems,
            keyItems:keyItems
        };

        return allData
    };

    WDViewer.Loader = Loader;

})();

// artboard
(function(){

    // data
    var keyItems, interactionObject;

    // zoom params
    var zoomRatio, xReg, yReg, xpos, ypos, newt;

    function Artboard(){

        interactionObject = {
            state:"inactive",
            data:"Nil"
        };

    }

    Artboard.prototype.dataLoad = function (data){

        zoomRatio = data.mapItems.zoomInit;
        xReg = data.mapItems.xReg;
        yReg = data.mapItems.yReg;

        keyItems = data.keyItems;

        newt = new createjs.Bitmap(wdimages[0].src);
    };

    Artboard.prototype.zoom = function (user){

        zoomRatio = user.zoomValue;
        xpos = user.mapX;
        ypos = user.mapY;
        xReg = user.xReg;
        yReg = user.yReg;

        //xpos = xReg = mapX;
        //ypos = yReg = mapY;
    };

    Artboard.prototype.background = function (displayObject){

        // area to add stuff ----->



        // <------ area to add stuff

        displayObject.updateCache("source-overlay");
    };

    Artboard.prototype.redraw = function (displayObject){

        // area to add stuff ----->

        var background = new createjs.Container();
        background.x = xpos + wdappWidth/2;
        background.y = ypos + wdappHeight/2;
        background.regX = xReg + wdappWidth/2;
        background.regY = yReg + wdappHeight/2;
        background.scaleX = background.scaleY = zoomRatio;
        displayObject.addChild(background);


        background.addChild(newt);

        // <------ area to add stuff
    };

    Artboard.prototype.eventlayer = function (displayObject){

        // area to add stuff ----->

        var keyBackground = new createjs.Container();
        displayObject.addChild(keyBackground);

        var KeyTitle = new createjs.Text("Percentage of ancestral populations","13px Petrona","#333");
        KeyTitle.x = 20;
        KeyTitle.y = wdappHeight-72;
        keyBackground.addChild(KeyTitle);

        var keySqaurexpos = 20,
            textcolor = "#333",
            textoffset = 6;

        var inter = keyItems.interval;

        for (var i = 0; i < keyItems.numBlocks; i++) {

            var keyShape = new createjs.Shape();
            keyShape.graphics.beginFill(keyItems.colors[i]).drawRect(keySqaurexpos,wdappHeight-50,16,32);
            keyBackground.addChild(keyShape);

            if (i > 4) {textoffset = 2; textcolor = "#FFF"}

            if (i % 5 == 0) {
                var keyValue = new createjs.Text(i*inter,"12px Petrona",textcolor);
                keyValue.x = keySqaurexpos + textoffset;
                keyValue.y = wdappHeight-40;
                keyBackground.addChild(keyValue);
            }

            keySqaurexpos += 18;
        }

        var dataYpos = 28,
            dataLength = keyItems.data.length;

        var dataShape = new createjs.Shape();
        dataShape.graphics.setStrokeStyle(1).beginStroke("#FFF").drawRect(26,26,186,(dataLength*18));
        dataShape.graphics.beginStroke("#BBB").beginFill("#FFF").drawRect(20,20,198,(dataLength*18)+12);
        dataShape.alpha = 0.75;
        keyBackground.addChild(dataShape);

        for (var j = 0; j < dataLength; j++) {

            var countryName = new createjs.Text(keyItems.data[j].country,"14px Petrona","#333");
            countryName.x = 28;
            countryName.y = dataYpos;
            keyBackground.addChild(countryName);

            var percent = new createjs.Text(keyItems.data[j].percentage + "%","14px Petrona","#333");
            percent.x = 196;
            percent.y = dataYpos;
            percent.textAlign = "center";
            keyBackground.addChild(percent);

            dataYpos += 18;
        }

        // <------ area to add stuff

        displayObject.updateCache("source-overlay");
    };

    Artboard.prototype.interaction = function(){

        return interactionObject
    };

    Artboard.prototype.resetInteraction = function(){

        interactionObject.state = 0;
        interactionObject.data = "Nil";
    };

    WDViewer.Artboard = Artboard;

})();

// dashboard
(function(){

    var user, zoomSliderY = 140, zoomInit;

    function Dashboard() {

        user = {
            zoomValue:1,
            mapX:0,
            mapY:0,
            xReg:0,
            yReg:0
        };
    }

    Dashboard.prototype.controlData = function(data) {

        zoomInit = user.zoomValue = data.mapItems.zoomInit;
        user.xReg = data.mapItems.xReg;
        user.yReg = data.mapItems.yReg;
    };

    Dashboard.prototype.background = function(displayObject) {

        // area to add stuff ----->

        var sliderContainer = new createjs.Container();
        displayObject.addChild(sliderContainer);

        var sliderShape = new createjs.Shape();
        sliderShape.graphics.setStrokeStyle(1).beginStroke("#FFF").drawRect(wdappWidth - 54,25,38,218);
        sliderShape.graphics.beginStroke("#BBB").beginFill("#FFF").drawRect(wdappWidth - 58,21,46,226);
        sliderShape.alpha = 0.5;
        sliderContainer.addChild(sliderShape);

        var zoomText = new createjs.Text("zoom","13px Petrona","#444");
        zoomText.x = wdappWidth -50;
        zoomText.y = 24;
        sliderContainer.addChild(zoomText);

        var zoomSliderbase = new createjs.Shape();
        zoomSliderbase.graphics.beginFill("#A6A6A6").drawRoundRect(wdappWidth - 40,40,9,200,9);
        zoomSliderbase.graphics.beginLinearGradientFill(["#CCC","#FFF"], [0,.3], wdappWidth - 40, 40, wdappWidth - 20, 40).drawRoundRect(wdappWidth - 38,42,5,196,9);
        sliderContainer.addChild(zoomSliderbase);

        // <------ area to add stuff

        displayObject.updateCache("source-overlay");
    };

    Dashboard.prototype.redraw = function(displayObject) {

        // area to add stuff ----->

        var sliderContainer = new createjs.Container();
        displayObject.addChild(sliderContainer);

        // zoom slider
        var zoomSlider = new createjs.Container();
        zoomSlider.x = 0.5;
        zoomSlider.y = 0.5;
            sliderContainer.addChild(zoomSlider);

        var zoomSliderGrip = new createjs.Shape();
        zoomSliderGrip.graphics.beginLinearGradientFill(["#575756","#878787"], [0,.8], wdappWidth - 24, zoomSliderY-20, wdappWidth - 44, zoomSliderY).drawCircle(wdappWidth - 35.5,zoomSliderY,10);
        zoomSliderGrip.shadow = new createjs.Shadow("#aaa", 1, 1, 3);
        zoomSlider.addChild(zoomSliderGrip);

        var lowLimit = 52,
            highLimit = 228;

        zoomSlider.on("pressmove", function(evt) {
            if (evt.stageY > lowLimit && evt.stageY < highLimit) {

                zoomSliderY = evt.stageY;
                user.zoomValue = evt.stageY/140*zoomInit;

            }
        });

        // <------ area to add stuff
    };

    Dashboard.prototype.eventlayer = function (displayObject){

        // area to add stuff ----->

        // pan base
        var panSliderbase = new createjs.Shape();
        //panSliderbase.graphics.beginFill("#A6A6A6");
        //panSliderbase.graphics.drawRect(0,0,6958,3430);
        panSliderbase.regX = user.xReg;
        panSliderbase.regY = user.yReg;
        panSliderbase.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#E78038").drawRect(0,0,6958,3430));
        //panSliderbase.alpha = 0.5;
        displayObject.addChild(panSliderbase);

        var xdif, ydif, o;

        panSliderbase.on("mousedown", function(evt) {

            o = evt.target;
            o.offset = {x:o.x-evt.stageX, y:o.y-evt.stageY};

        });

        panSliderbase.on("pressmove", function(evt) {

            user.mapX = evt.stageX + o.offset.x;
            user.mapY = evt.stageY + o.offset.y;
            panSliderbase.x = evt.stageX + o.offset.x;
            panSliderbase.y = evt.stageY + o.offset.y;
            //user.xReg = evt.stageX + o.offset.x;
            //user.yReg = evt.stageY+ o.offset.y;

        });

        // <------ area to add stuff

        displayObject.updateCache("source-overlay");

    };

    Dashboard.prototype.userFeedback = function() {

        return user;
    };

    WDViewer.Dashboard = Dashboard;

})();

// renderer
(function(){

    var stats, canvas, stage, view, control, highlight,
        artboard, artboardBackground, artboardRedraw, artboardEventArea,
        dashboardRedraw, dashboardBackground, dashboardEventArea,
        loader, loadStatus;

    WDViewer.loadInit = function(){

        /*stats = new Stats();
        $('.block').prepend(stats.domElement);*/

        // prepare the view
        view = new WDViewer.Artboard(wdappWidth,wdappHeight);

        // prepare the dashboard
        control = new WDViewer.Dashboard();

        // wdloader init
        loader = new WDViewer.Loader();
        loadStatus = false;
        loader.loadData();

        TweenMax.ticker.addEventListener("tick", loadRequest);
    };

    function init() {

        // prepare our canvas
        canvas = document.createElement( 'canvas' );
        canvas.width = wdappWidth;
        canvas.height = wdappHeight;
        document.getElementById("canvasWorldDistribution").appendChild(canvas);

        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);

        // artboard
        artboard = new createjs.Container();
        //artboard.y = 20;
        stage.addChild(artboard);

        artboardBackground = new createjs.Container();
        artboardBackground.cache(0, 0, wdappWidth, wdappHeight);
        artboard.addChild(artboardBackground);
        view.background(artboardBackground);

        artboardRedraw = new createjs.Container();
        artboard.addChild(artboardRedraw);

        artboardEventArea = new createjs.Container();
        artboardEventArea.cache(0, 0, wdappWidth, wdappHeight);
        artboard.addChild(artboardEventArea);
        view.eventlayer(artboardEventArea);

        // dashboard
        dashboardBackground = new createjs.Container();
        dashboardBackground.cache(0, 0, wdappWidth, wdappHeight);
        stage.addChild(dashboardBackground);
        control.background(dashboardBackground);

        dashboardEventArea = new createjs.Container();
        dashboardEventArea.cache(0, 0, wdappWidth, wdappHeight);
        stage.addChild(dashboardEventArea);
        control.eventlayer(dashboardEventArea);

        dashboardRedraw  = new createjs.Container();
        stage.addChild(dashboardRedraw);

        TweenMax.ticker.addEventListener("tick", frameRender);

    }

    function loadRequest(event) {

        var loadFinished = loader.loadStatus();
        if (loadFinished) {
            loadStatus = true;
            var data = loader.returnData();
            view.dataLoad(data);
            control.controlData(data);
            removeLoader()
        }
    }

    function removeLoader() {

        $('#Processing').remove();
        TweenMax.ticker.removeEventListener("tick", loadRequest);
        init();
    }

    function frameRender(event) {

        //stats.begin();

        artboardRedraw.removeAllChildren();
        dashboardRedraw.removeAllChildren();

        view.redraw(artboardRedraw);
        control.redraw(dashboardRedraw);

        var viewData = view.interaction();

        view.zoom(control.userFeedback());

        // update stage
        stage.update();

        //stats.end();
    }

})();

//Init
WDViewer.loadInit();