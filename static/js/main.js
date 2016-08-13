
class GF_Clothes {
    constructor(model, pattern) {
        this.numX = 3;
        this.numY = 4;
        this.modelId = model;
        this.patternId = pattern;
        this.renders = {};
        this.renderTextures = {};
        this.stages = {};
        this.animations = [];
        this.listMap = ["clothes", "sleeve"];
        this.caches = {};
        this.bounds = null;
        this.frame = 0;
        this.bh = 1;
        this.index = 0;

        this.readGroup(this.modelId, "model");
        this.readGroup(this.patternId, "pattern");
        this.waitForLoad(() => {
            this.setup();
        });
    }


    waitForLoad(callback) {
        var loadAll = true;

        for (var i in this.caches) {
            if (!this.caches[i]["loaded"]) {
                loadAll = false;
                break;
            }
        }


        if (!loadAll) {
            setTimeout(() => {
                this.waitForLoad(callback);
            }, 1000);
        } else {

            callback();
        }
    }


    setup() {
        this.setBlendMode();

        this.paint("clothes")
        this.paint("sleeve")
        this.combine();
        this.show();
    }


    combine() {

        this.result = new PIXI.Sprite();
        this.result.addChild(this["clothes"]);
        this.result.addChild(this["sleeve"]);

    }



    show() {
        this.containerS = PIXI.autoDetectRenderer(this.bounds["width"], this.bounds["height"], { transparent: true });
        $("#hh").append(this.containerS.view);


        this.containerS.render(this.result);

        this.containerDownload = new PIXI.RenderTexture(this.containerS,this.bounds["width"] , this.bounds["height"]);

        this.containerDownload.render(this.result);


        this.containerActive = PIXI.autoDetectRenderer(this.bounds["width"] / this.numX, this.bounds["height"], { transparent: true });

        $("#hh").append(this.containerActive.view);


        this.containerActive.render(this.result);






    }

    readGroup(id, rootPath = "model") {
        this[rootPath] = {};
        var rootPath2 = `images/${rootPath}`;
        let list = [`${rootPath2}/${id}_1.png`, `${rootPath2}/${id}_2.png`];

        for (var i in list) {
            var tmp = new Image();
            tmp.loaded = false;
            tmp.src = list[i];
            tmp.srcid = i;
            this.caches[list[i]] = tmp
            var p = this;
            tmp.onload = function () {
                this.loaded = true;
                var base = new PIXI.BaseTexture(this);
                var text = new PIXI.Texture(base);
                p[rootPath][p.listMap[this.srcid]] = new PIXI.Sprite(text);
                if (rootPath == "model") {
                    p.bounds = {
                        "width": this.naturalWidth,
                        "height": this.naturalHeight
                    }
                }
            }
        }
    }

    setBlendMode() {
        for (var i in this.pattern) {
            var data = this.pattern[i];
            data.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        }
    }


    paint(name) {

        var renderer = PIXI.autoDetectRenderer(this.bounds["width"], this.bounds["height"], { transparent: true });

        //var stage = new PIXI.Container();
        var sp = new PIXI.Sprite();


        sp.addChild(this.model[name]);

        var tmpListPattern = [];

        var smX = this.bounds["width"] / this.numX;
        var smY = this.bounds["height"] / this.numY;


        for (var y = 0; y < this.numY; y++) {
            for (var x = 0; x < this.numX; x++) {
                tmpListPattern[y * this.numX + x] = new PIXI.Sprite(this.pattern[name].texture.clone());
                if (y <= 2) {
                    tmpListPattern[y * this.numX + x].texture.frame = new PIXI.Rectangle(0, 0, smX, smY);
                } else {
                    tmpListPattern[y * this.numX + x].texture.frame = new PIXI.Rectangle(smX, 0, smX, smY);
                }
                tmpListPattern[y * this.numX + x].position.x = x * smX;
                tmpListPattern[y * this.numX + x].position.y = y * smY;
                tmpListPattern[y * this.numX + x].blendMode = PIXI.BLEND_MODES.MULTIPLY;
                sp.addChild(tmpListPattern[y * this.numX + x]);
            }
        }

        //console.log(this.pattern[name]);

        // this.pattern[name].texture.frame = new PIXI.Rectangle(0,0,32,48)

        // sp.addChild(this.pattern[name]);

        this.renders[name] = renderer;
        this.stages[name] = sp;

        this.renders[name].render(this.stages[name]);


        var renderTexture = new PIXI.RenderTexture(renderer, this.bounds["width"], this.bounds["height"]);
        this.renderTextures[name] = renderTexture;

        this.renderTextures[name].render(this.stages[name]);

        var tmpImg = renderTexture.getImage();

        var tmpBase = new PIXI.BaseTexture(tmpImg);
        var tmpText = new PIXI.Texture(tmpBase);

        this[name] = new PIXI.Sprite(tmpText);



        //renderer.render(stage);

        this.animations.push(() => {
            //this.renders[name].render(this.stages[name]);
            //this[name] = this.renders[name]
        });
    }


}

//var hher = new GF_Clothes("a", "p");

//animate();

function animate() {
    requestAnimationFrame(animate);
    if (hher.frame < 20) {
        hher.frame++;
    } else {

        //renderer2.render(s5);
        hher.index += hher.bh;

        if (hher.index == 2) {
            hher.bh = -1;
        }
        if (hher.index == 0) {
            hher.bh = 1;
        }
        hher.result.position.x = - hher.index * 32;
        // s6.position.x = - index * 32;
        hher.frame = 0;
    }

    hher.containerActive.render(hher.result);
}


function download() {
    fileData = hher.containerDownload.getBase64();
    $("#file").attr("href", fileData);
    $("#file")[0].click();

}

var bitmap = ImageManager.loadBitmap("images/pattern/","p_1",100);
var sp2 = new Sprite(bitmap);


/*
var base = new PIXI.BaseTexture(bitmap._image);
var text = new PIXI.Texture(base);
var test = new PIXI.Sprite(text);
*/
var renderer = PIXI.autoDetectRenderer(128, 192, { transparent: true });
$("#hh").append(renderer.view);
//sp2.setFrame(0,0,32,20);
/*
function waitForLoad(){
    console.log(ImageManager.isReady());
    if (ImageManager.isReady()) {
        console.log("dddd")
        renderer.render(sp2);
    } else {
        console.log("check")
        setTimeout(()=>{waitForLoad()},1000);
    }
}
*/
bitmap.addLoadListener(function(){
        renderer.render(sp2);
        bitmap.rotateHue(200);
        sp2.blendMode = Graphics.BLEND_MULTIPLY
        renderer.render(sp2);
        console.log(bitmap.width)

})

//waitForLoad();

var NUM_X = 3;
var NUM_Y = 4;

class Model{
    constructor(id){
        var bitmap1 = ImageManager.loadBitmap("images/model/",`${id}_1`);
        this.clothes = new Sprite(bitmap1);
        var bitmap2 = ImageManager.loadBitmap("images/model/",`${id}_2`);
        this.sleeve = new Sprite(bitmap2);
        var bitmap3 = ImageManager.loadBitmap("images/model/",`${id}_3`);
        //this.overlay = new Sprite(bitmap1);
        //this.overlay.blendMode = PIXI.BLEND_MODES.OVERLAY;

        //this.statur = new Sprite(bitmap1);
        //this.statur.opacity = 0;

        this.lighter = new Sprite(bitmap3); 
        this.lighter.blendMode = PIXI.BLEND_MODES.LIGHTEN;
        this.lighter.opacity = 60;

    }

    getCenter(value){
        if (value > 255) {
            return 255;
        } else if(value<0){
            return 0;
        } else {
            return value;
        }
    }

    changeLight(value){
        this.lighter.opacity = this.getCenter(value);
    }

    changeStatu(value){
        this.statur.opacity = this.getCenter(value);
    }
}

class Pattern{
    constructor(id){
        var bitmap1 = ImageManager.loadBitmap("images/pattern/",`${id}_1`);
        this.clothesBitmap = bitmap1;
        this.clothes = new Sprite();
        this.clothesList = [];

        this.fillList("clothes",bitmap1);
        var bitmap2 = ImageManager.loadBitmap("images/pattern/",`${id}_2`);
        this.sleeveBitmap = bitmap2;

        this.sleeveList = [];
        this.sleeve = new Sprite();
        this.fillList("sleeve",bitmap2);
    }

    fillList(id,bitmap){
        var parent = this[`${id}List`];
        var container = this[`${id}`];
        for(var j = 0;j<NUM_Y;j++){
            for(var i = 0;i<NUM_X;i++){
                parent[j*NUM_X+i] = new Sprite(bitmap);
                parent[j*NUM_X+i].blendMode=Graphics.BLEND_MULTIPLY;
                container.addChild(parent[j*NUM_X+i]);
            }
        }
        bitmap.addLoadListener(function(){
            var width = bitmap.width/2;
            var height = bitmap.height;
            for(var j = 0;j<NUM_Y;j++){
                for(var i = 0;i<NUM_X;i++){
                    //parent[j*NUM_X+i] = new Sprite(bitmap1);
                    //this.clothes.addChild(parent[j*NUM_X+i]);
                    if(j<=2){
                        parent[j*NUM_X + i].setFrame(0,0,width,height);
                    } else {
                        parent[j*NUM_X + i].setFrame(width,0,width,height);
                    }
                    parent[j*NUM_X + i].x = i*width;
                    parent[j*NUM_X + i].y = j*height;
                }
            }
        })
    }

    move(j,px){
        for(var i=0;i<NUM_X;i++){
            var n = j*NUM_X+i;
            this.clothesList[n].x += px;
            this.sleeveList[n].x += px;
        }
    }

    changeHue(value){
        if(value>360){
            value -= 360;
            this.changeHue(value);
        } else if(value<0){
            value += 360
            this.changeHue(value);
        } else{
        this.clothesBitmap.rotateHue(value);
        this.sleeveBitmap.rotateHue(value);
        }
    }
}

class Combine extends Sprite {
    constructor(m,p){
        super();
        this.model = m;
        this.pattern = p;
        this.clothes = new Sprite();
        this.clothes.addChild(m.clothes);
        this.clothes.addChild(p.clothes);

        this.sleeve = new Sprite();
        this.sleeve.addChild(m.sleeve);
        this.sleeve.addChild(p.sleeve);

        this.overlay = new Sprite();
        //this.overlay.addChild(m.overlay);
       // this.overlay.addChild(m.statur);
        this.overlay.addChild(m.lighter);


        this.addChild(this.clothes);
        this.addChild(this.sleeve);
        this.addChild(this.overlay);
    }

    move(j,px){
        this.pattern.move(j,px);
    }

    changeHue(value){
        this.pattern.changeHue(value);
    }

    changeLight(value){
        this.model.changeLight(value);
    }

    changeStatu(value){
        this.model.changeStatu(value);
    }
}

var c = new Model("a");
var p = new Pattern("h");
var r = new Combine(c,p);
var hue = 0;
function show(){
    r.move(1,1);
    //hue+=20;
   // r.changeHue(hue+=20);
    r.changeLight(hue+=20);
   // r.changeStatu(hue);
}

var index = 0;
var bh = 1;
var frame = 0;

renderer.render(r);
animate2();




function animate2(){
    requestAnimationFrame(animate2);
    // render the container
    if (frame < 20) {
        frame++;
    } else {

        index += bh;

        if (index == 2) {
            bh = -1;
        }
        if (index == 0) {
            bh = 1;
        }
        //background.position.x = - index * 32;
        //bunny.position.x = - index * 32;
        //r.x = - index * 32;
        frame = 0;
        renderer.render(r);

    }

}