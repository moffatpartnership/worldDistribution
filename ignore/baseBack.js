// startup vars
var appHeight = 1350,
    appWidth = 1140;

// startup utils
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame  ||
        window.mozRequestAnimationFrame     ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

// wrapper for our "classes", "methods" and "objects"
window.Viewer = {};

//wdloader
(function(){

    var mapItems, image;

    function Loader() {

    }

    Loader.prototype.loadData = function() {

        // stuff
        dataload = false;
        image = new Image();
        image.src = "img/worldDistributionR1bS145.svg";
        image.onload = parseData();

        // preloader graphics
        var prossElement = document.createElement('div'),
            dialogElement = document.createElement('div'),
            spinElement = document.createElement('div'),
            paraElement = document.createElement('p'),
            textItem = document.createTextNode("Loading mapItems…");

        prossElement.setAttribute('id', "Processing");
        prossElement.setAttribute('Style', "height:" + appHeight + "px; width:" + appWidth + "px;");
        dialogElement.setAttribute('class','dialog');
        spinElement.setAttribute('class','spinner-container');

        paraElement.appendChild(textItem);
        dialogElement.appendChild(paraElement);
        dialogElement.appendChild(spinElement);
        prossElement.appendChild(dialogElement);
        document.getElementById("canvasContainer").appendChild(prossElement);
        $('#Processing').show();
    };

    function parseData() {

        mapItems = new createjs.Bitmap(image);

        dataload = true;
    }

    Loader.prototype.loadStatus = function() {

        return dataload
    };

    Loader.prototype.returnData = function() {

        allData = {
            drawItems:mapItems
        };
        return allData
    };

    Viewer.Loader = Loader;

})();

// artboard
(function(){

    // zoom params
    var zoomRatio = 1, xReg = 3000, yReg = 850, xOffset = 0, yOffset = 0;
    var plotContainer = new createjs.Container();

    // data
    var mapData;

    // interaction
    var interactionObject;

    //haplogroup
    var currentHaplogroup;

    function Artboard(){

        interactionObject = {
            state:0,
            data:"Nil"
        };
    }

    Artboard.prototype.setAssets = function () {


    };

    Artboard.prototype.dataLoad = function (data){

        mapData  = data.drawItems;
        plotContainer.addChild(mapData);

    };

    Artboard.prototype.loadMap = function (displayObject){

        plotContainer.regX = xReg;
        plotContainer.regY = yReg;
        //plotContainer.x = xOffset;
        //plotContainer.y = yOffset;
        displayObject.addChild(plotContainer);

    };

    Artboard.prototype.zoom = function (user){

        zoomRatio = user.zoomValue;

    };

    Artboard.prototype.draw = function (displayObject){

        // area to add stuff ----->

        plotContainer.scaleX = plotContainer.scaleY = zoomRatio;

        //plotContainer.x = newxPos*zoomRatio;
        //plotContainer.y = newYpos*zoomRatio;


        // <------ area to add stuff
    };

    Artboard.prototype.interaction = function(){

        return interactionObject
    };

    Artboard.prototype.resetInteraction = function(){

        interactionObject.state = 0;
        interactionObject.data = "Nil";
    };

    Artboard.prototype.move = function(displayObject){

        if(Viewer.controls.left) { displayObject.x -= 3 }
        if(Viewer.controls.up) {  displayObject.y -= 3 }
        if(Viewer.controls.right) {  displayObject.x += 3 }
        if(Viewer.controls.down) {  displayObject.y += 3 }
    };

    Viewer.Artboard = Artboard;

})();

// dashboard
(function(){

    var user, userStage, YDistroData, mtDistroData;

    function Dashboard() {

        user = {
            zoomValue:1,
            haplogroup:0,
            type:"y"
        };

        var userCanvas = document.createElement( 'canvas');
        userCanvas.width = 1140;
        userCanvas.height = 45;
        userStage = new createjs.Stage(userCanvas);
        document.getElementById("canvasContainer").appendChild(userCanvas);
        //$('#canvasContainer').append(userCanvas);
    }

    Dashboard.prototype.controlData = function(data) {

        //YDistroData = data.yDistroArray;
        //mtDistroData = data.mtDistroData;
    };

    Dashboard.prototype.draw = function() {

        var background = new createjs.Container(),
            bar = new createjs.Shape(),
            feedback = new createjs.Text("");

        //inButton = new createjs.Shape(),
        //outButton = new createjs.Shape();
        userStage.addChild(background);

        bar.graphics.beginFill("#F2F2F2").drawRect(0,0,appWidth,45);
        bar.graphics.beginStroke("#666666").drawRect(0,0,appWidth,45);
        background.addChild(bar);

        feedback.x = 500;
        feedback.y = 12;
        background.addChild(feedback);

        var imSlidback = new Image();
        imSlidback.src = "img/sliderBackground.png";
        imSlidback.onload = handleLoad;

        var xoffset = 75,
            lowLimit = 111,
            highLimit = 373;

        function handleLoad() {

            var sliderBar = new createjs.Bitmap(imSlidback);
            sliderBar.x = xoffset;
            sliderBar.y = 8;
            background.addChild(sliderBar);

            var slider = new Image();
            slider.src = "img/slider.png";
            slider.onload = handleLoad2;

            function handleLoad2() {
                var sliderImg = new createjs.Bitmap(slider);
                sliderImg.x = xoffset + 168;
                sliderImg.y = 5;

                background.addChild(sliderImg);
                userStage.update();

                sliderImg.onPress = function(evt) {

                    evt.onMouseMove = function(evt) {

                        if (evt.stageX > lowLimit && evt.stageX < highLimit) {
                            // move slider
                            sliderImg.x = evt.stageX;

                            // calculate zoom value
                            var tempZoomValue = (evt.stageX - 243)/140 + 1;
                            feedback.text = "Current zoomValue is " + tempZoomValue;
                            if (tempZoomValue > 0) { user.zoomValue = tempZoomValue } else { user.zoomValue = 0}

                            // update stage
                            userStage.update();
                        }
                    }
                }
            }
        }


    };

    Dashboard.prototype.userFeedback = function() {

        return user
    };

    Viewer.Dashboard = Dashboard;

})();

// highlight
(function(){

    var state,
        dataObject;
        //data = [];

    function Highlight() {

        state = 0;
    }

    Highlight.prototype.toggle = function(interactionObject) {

        state = interactionObject.state;
        dataObject = interactionObject.data;
    };

    Highlight.prototype.draw = function(displayObject) {

        if (state) {


        }
    };

    Highlight.prototype.currentState = function() {

        return state
    };

    Viewer.Highlight = Highlight;

})();

// renderer
(function(){

    var stats, canvas, stage, view, artboardContainer, controlDisplay, highlight, highlightContainer, loader, loadStatus;

    Viewer.loadInit = function(){

        stats = new Stats();
        $('.block').prepend(stats.domElement);

        // prepare the view
        view = new Viewer.Artboard(appWidth,appHeight);

        // prepare the dashboard
        controlDisplay = new Viewer.Dashboard();

        // wdloader init
        loader = new Viewer.Loader();
        loadStatus = false;
        loader.loadData();

        loaderLoop();
    };

    function init() {

        // prepare our canvas
        canvas = document.createElement( 'canvas' );
        stage = new createjs.Stage(canvas);
        //stage.enableMouseOver(20);

        canvas.width = appWidth;
        canvas.height = appHeight;
        $('#canvasContainer').append(canvas);

        // prepare our viewer
        var viewerRect = new createjs.Shape();
        viewerRect.graphics.drawRect(0, 0, 1140, 900);
        stage.addChild(viewerRect);

        // mouse drag background
        var backGripper = new createjs.Shape();
        backGripper.graphics.beginFill("#F5F5F5");
        backGripper.graphics.drawRect(-appWidth, -appHeight, appWidth*2, appHeight*2);
        stage.addChild(backGripper);

        // container for wdimages etc
        artboardContainer = new createjs.Container();
        stage.addChild(artboardContainer);
        //artboardContainer.mask = viewerRect;

        // handler for background mouse drag
        backGripper.onPress = function(evt) {

            var o = evt.target;
            o.offset = {x:o.x-evt.stageX, y:o.y-evt.stageY};

            evt.onMouseMove = function(event) {

                artboardContainer.x = event.stageX + o.offset.x;
                artboardContainer.y = event.stageY+ o.offset.y;

                backGripper.x = event.stageX + o.offset.x;
                backGripper.y = event.stageY+ o.offset.y;
            }
        };

        // controller area
        controlDisplay.draw();

        // highlight area
        highlight = new Viewer.Highlight();

        // container for highlight wdimages etc
        highlightContainer = new createjs.Container();
        stage.addChild(highlightContainer);

        // loadinitialMap
        view.loadMap(artboardContainer);

        Viewer.start();
    }

    function loadRequest() {

        var loadFinished = loader.loadStatus();
        if (loadFinished) {
            loadStatus = true;
            var data = loader.returnData();
            view.setAssets();
            view.dataLoad(data);
            controlDisplay.controlData(data);
            removeLoader()
        }

        //wdloader.draw()
    }

    function removeLoader() {

        $('#Processing').remove();

        init();
    }

    function frameRender() {

        stats.begin();

        //artboardContainer.removeAllChildren();
        highlightContainer.removeAllChildren();

        view.draw(artboardContainer);
        view.move(artboardContainer);
        view.zoom(controlDisplay.userFeedback());

        var reset = view.interaction();
        if (reset.state) { highlight.toggle(view.interaction()) }
        highlight.draw(highlightContainer);

        var state = highlight.currentState();
        if (state) {view.resetInteraction()}

        // update everything
        stage.update();

        stats.end();
    }

    // wdloader loop
    var loaderLoop = function(){

        requestAnimFrame(loaderLoop);
        if (!loadStatus) { loadRequest() }
    };

    // viewer Loop
    var viewerLoop = function(){

        requestAnimFrame(viewerLoop);
        frameRender();
    };

    // viewer startup
    Viewer.start = function(){

        viewerLoop();
    };

})();

// controls
Viewer.controls = {
    left:false,
    up:false,
    right:false,
    down:false,
    in:false
};

window.addEventListener("keydown", function(e){

    switch(e.keyCode)
    {
        case 37: // left arrow
            Viewer.controls.left = true;
            break;
        case 38: // up arrow
            Viewer.controls.up = true;
            break;
        case 39: // right arrow
            Viewer.controls.right = true;
            break;
        case 40: // down arrow
            Viewer.controls.down = true;
            break;
    }
}, false);

window.addEventListener("keyup", function(e){
    switch(e.keyCode)
    {
        case 37: // left arrow
            Viewer.controls.left = false;
            break;
        case 38: // up arrow
            Viewer.controls.up = false;
            break;
        case 39: // right arrow
            Viewer.controls.right = false;
            break;
        case 40: // down arrow
            Viewer.controls.down = false;
            break;
    }
}, false);

//Init
Viewer.loadInit();

// utils

//sorts array by key
/*function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var
            x = a[key],
            y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}*/
