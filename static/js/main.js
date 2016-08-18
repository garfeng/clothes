
Bitmap.loadByImage = function(img) {
    var bitmap = new Bitmap();
    bitmap._image = img;
    bitmap._url = "";
    bitmap._isLoading = true;
    bitmap.width = img.naturalWidth;
    bitmap.height = img.naturalHeight;
    bitmap._image.onload = Bitmap.prototype._onLoad.bind(bitmap);
    bitmap._image.onerror = Bitmap.prototype._onError.bind(bitmap);
    return bitmap;
};


Sprite.prototype.spriteOne = function(width = this.width,height = this.height) {

    //console.log(renderTexture)
    var img = this.generateImage();

    //renderTexture.render(this);
   // var img = renderTexture.getImage();

    var bitmap = Bitmap.loadByImage(img);
    var sprite = new Sprite(bitmap);
    return sprite;
};

Sprite.prototype.generateImage = function(width = this.width,height = this.height) {
    if(!this.rendererFor){
        this.rendererFor = PIXI.autoDetectRenderer(this.width,this.height,{transparent:true});
    }
    if(!this.renderTextureFor){
        this.renderTextureFor = new PIXI.RenderTexture.create(this.width, this.height);
    }
    this.rendererFor.render(this,this.renderTextureFor);
    var img = this.rendererFor.extract.image(this.renderTextureFor);
    img.naturalWidth = width;
    img.naturalHeight = height;
    return img;
};



var NUM_X = 3;
var NUM_Y = 4;

class Model{
    constructor(id){
        var bitmap1 = ImageManager.loadBitmap("images/model/",`${id}_1`);
        this.clothes = new Sprite(bitmap1);
        var bitmap2 = ImageManager.loadBitmap("images/model/",`${id}_2`);
        this.sleeve = new Sprite(bitmap2);
        var bitmap3 = ImageManager.loadBitmap("static/img/","light");
        //this.overlay = new Sprite(bitmap1);
        //this.overlay.blendMode = PIXI.BLEND_MODES.OVERLAY;

        //this.statur = new Sprite(bitmap1);
        //this.statur.opacity = 0;

        this.lighter = new Sprite(bitmap3); 
        this.lighter.blendMode = PIXI.BLEND_MODES.LIGHTEN;
        this.lighter.opacity = 60;

        this.mid = id;

        
//        this.icon.src = `images/model/${id}_icon.png`;
    }

    loadIcon(){
        var bitmapIcon = ImageManager.loadBitmap("images/model/",`${this.mid}_1`);
        var spriteIcon = new Sprite(bitmapIcon);
        spriteIcon.setFrame(32,0,32,bitmapIcon.height/NUM_Y);
        this.icon = spriteIcon.generateImage(32,bitmapIcon.height/NUM_Y);
        this.icon.width = 32;
        this.icon.height = bitmapIcon.height/NUM_Y;
        this.icon.id = `model_${this.mid}`;
        this.icon.mid = this.mid;
        this.icon.onclick = function(){
            setModel(this.mid);
        }
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
        //this.statur.opacity = this.getCenter(value);
    }
}

class Pattern{
    constructor(id){
        this.clothes = new Sprite();
        this.clothesList = [];
        this.sleeveList = [];
        this.sleeve = new Sprite();
        
       

        //this.icon = new Image();
        //this.icon.src = `images/pattern/${id}_icon.png`;
        this.pid = id;

        this.moveX = [0,0,0,0];

        this.setup();
    }

    loadIcon(){
        var bitmapIcon = this.loadClothesBitmap(this.pid)
        var spriteIcon = new Sprite(bitmapIcon);
        spriteIcon.setFrame(0,0,32,bitmapIcon.height);
        this.icon = spriteIcon.generateImage(32,bitmapIcon.height);

        this.icon.id = `pattern_${this.pid}`;
        this.icon.pid = this.pid;
        this.icon.onclick = function(){
            setPattern(this.pid);
        }
    }

    setup(hue = 0){
        this.clothesBitmap = this.loadClothesBitmap(this.pid,hue);
        this.fillList("clothes",this.clothesBitmap);
       
        this.sleeveBitmap = this.loadSleeveBitmap(this.pid,hue);
        this.fillList("sleeve",this.sleeveBitmap);
        this.resetPos();
    }

    loadClothesBitmap(id,hue = 0){
        var bitmap = ImageManager.loadBitmap("images/pattern/",`${id}_1`,hue);
        return bitmap;
    }

    loadSleeveBitmap(id,hue = 0){
        var bitmap = ImageManager.loadBitmap("images/pattern/",`${id}_2`,hue);
        return bitmap;
    }

    fillList(id,bitmap){
        var parent = this[`${id}List`];
        var container = this[`${id}`];
        var p = this;
        container.removeChildren();
        for(var j = 0;j<NUM_Y;j++){
            for(var i = 0;i<NUM_X;i++){
                parent[j*NUM_X+i] = new Sprite(bitmap);
                parent[j*NUM_X+i].blendMode=PIXI.BLEND_MODES.COLOR_DODGE;
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
                    let x = 0;
                    let y = 0;
                    let wid = 0;
                    let hei = 0;
                    if(j<=2){
                        x = 0;
                    } else {
                        x = width;
                    }

                    if (i == 1) {
                        y = 0;
                    }else {
                        y = -1;
                    }

                    parent[j*NUM_X + i].setFrame(x,y,width,height);
                    parent[j*NUM_X + i].x = i*width;
                    parent[j*NUM_X + i].y = j*height;
                }
            }
        })
    }

    move(j,px = null){
        var set = false;
        if(px == null){
            set = true;
            px = this.moveX[j];
        } else {
            this.moveX[j] += px;
        }
        for(var i=0;i<NUM_X;i++){
            var n = j*NUM_X+i;
            this.clothesList[n].x += px;
            this.sleeveList[n].x += px;
        }
    }

    resetPos(){
        for(var j = 0;j<NUM_Y;j++){
            this.move(j);
        }
    }

    changeHue(value){
        this.setup(value);
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
        this.clothes.width = m.clothes.bitmap.width
        this.clothes.height = m.clothes.bitmap.height;


        this.sleeve2 = new Sprite();
        this.sleeve2.addChild(m.sleeve);
        this.sleeve2.addChild(p.sleeve);
        this.sleeve2.width = m.sleeve.bitmap.width
        this.sleeve2.height = m.sleeve.bitmap.height;

        this.sleeve = this.sleeve2.spriteOne();


        this.overlay = new Sprite();
        //this.overlay.addChild(m.overlay);
       // this.overlay.addChild(m.statur);
        this.overlay.addChild(m.lighter);

        this.width = this.clothes.width
        this.height = this.clothes.height



        this.addChild(this.clothes);
        this.addChild(this.sleeve);
        this.addChild(this.overlay);
    }

    updateSleeve(){
        this.removeChild(this.sleeve);
        this.removeChild(this.overlay);
        this.sleeve = this.sleeve2.spriteOne();
        this.addChild(this.sleeve);
        this.addChild(this.overlay);
    }

    move(j,px){
        this.pattern.move(j,px);

    }

    changeHue(value){
        this.pattern.changeHue(value);
        this.updateSleeve();
    }

    changeLight(value){
        this.model.changeLight(value);
    }

    changeStatu(value){
        this.model.changeStatu(value);
    }
}



var $model = {};
var $pattern = {};
var $loadOk = false;
var $listener = [];

var $mid = "a";
var $pid = "p";

var $c ;
var $p ;
var $r ;

var $cActive;
var $pActive;
var $rActive;

var width;
var height;

var $rendererActive;
var $rendererSilence;
var $renderTexture;
var $rendererSilence4x4
var $renderTexture4x4;


var index = 0;
var bh = 1;
var frame = 0;

var $operating = false;

//PIXI.autoDetectRenderer(96, 192, { transparent: true });

function resetOperate(){
    $("#result_operate").children("div").css({
        "height":height/NUM_Y+"px",
        "line-height":height/NUM_Y+"px"
    })
}

function createANewClothes(model = $mid,pattern = $pid){

    $("#model_list").children("img").removeClass("active");
    $(`#model_${model}`).addClass("active");
    $("#pattern_list").children("img").removeClass("active");
    $(`#pattern_${pattern}`).addClass("active");
    Hue.setValue(0);
    Bright.setValue(128);

    $c = $model[model];

    width = $c.clothes.bitmap.width;
    height = $c.clothes.bitmap.height;
    $rendererSilence = PIXI.autoDetectRenderer(width, height, { transparent: true });
    $rendererActive = PIXI.autoDetectRenderer(width/NUM_X, height, { transparent: true });
    $renderTexture = new PIXI.RenderTexture.create(width,height);
    $rendererSilence4x4 = PIXI.autoDetectRenderer(width/NUM_X*4, height, { transparent: true });
    $renderTexture4x4 = new PIXI.RenderTexture.create(width/NUM_X*4,height);

    resetOperate();

    $("#result_show").empty();
    $("#result_show").append($rendererSilence.view);
    $("#result_show").append($rendererActive.view);


    $p = $pattern[pattern];
    $r = new Combine($c,$p);
    $rendererSilence.render($r);
    


    
    $cActive = new Model(model);
    $pActive = new Pattern(pattern);
    $rActive = new Combine($cActive,$pActive);
    $rendererActive.render($r);

    changeBright();



    //console.log($("#result_show").children())


}

function startAnimation(){
    requestAnimationFrame(startAnimation);

    if (frame == 10 && !$operating) {
        $r.position.x = 0;
        $rendererSilence.render($r);
    }

    if(frame<20){
        frame ++;
    } else {
        //$rendererSilence.render($r);

        index += bh;
        if(index == 2){
            bh = -1;
        }
        if(index == 0){
            bh = 1;
        }

        if(!$operating){
            $r.position.x = - index * width/NUM_X;
            frame = 0;
            $rendererActive.render($r);
        } else {
            $r.position.x = 0;
            frame = 0;
            //$rendererSilence.render($r);
        }
        //$r.setFrame(index*width/NUM_X,0,width/NUM_X,height);
    }
}
/*
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
    */
var readIn;

function loadAllData(){
    $.get("data/data.json",function(data,status){
        
        if (typeof(data) == "string") {
            readIn = eval("("+data+")");
        } else {
            readIn = data;
        }
        loadModel(readIn["model"]);
        loadPattern(readIn["pattern"]);
        waitForLoad();
    });
    $listener.push(function(){
        enableOperation();
        createANewClothes("a","p");
        //renderer.render($r);
        startAnimation();

    });
}

function enableOperation(){
    for(var i in $model){
        $model[i].loadIcon();
        $("#model_list").append($model[i].icon);
    }
    for(var i in $pattern){
        $pattern[i].loadIcon();
        $("#pattern_list").append($pattern[i].icon);
    }
    $(".choies-list").children("img").addClass("img-thumbnail");
    $("#overlay").fadeOut("slow");
}

function setModel(i){
    $mid = i;
    createANewClothes();
}

function setPattern(i){
    $pid = i;
    createANewClothes();
}

function loadModel(dIn){
    dIn.forEach(function(key){
        $model[key] = new Model(key);
    })
}

function loadPattern(dIn){
    dIn.forEach(function(key){
        $pattern[key] = new Pattern(key);
    })
}

function loadOkCallBack(){
    while ($listener.length > 0){
        var func = $listener.pop();
        func();
    }
}

function loadAllHueOfPattern(){
    for(var i in $pattern){
        for(var hue = 0;hue<=360;hue++){
            ImageManager.loadBitmap("images/pattern/",`${i}_1`,hue);
            ImageManager.loadBitmap("images/pattern/",`${i}_2`,hue);
        }
    }
}

function waitForLoad(){
    if (ImageManager.isReady()) {
        //renderer.render(sp2);
        $loadOk = true;
        loadOkCallBack();
    } else {
        setTimeout(()=>{waitForLoad()},1000);
    }
}

loadAllData();

function update(){
    $operating = true;
    $r.position.x = 0;
    $rendererSilence.render($r);
    $operating = false;
}


function pullPos(line,px){
    $operating = true;
    $r.move(line,px);
    update();
    $operating = false;
}


function changeHue(){
    $operating = true;
    $r.changeHue(Hue.getValue());
    update();
    $operating = false;
    $listener.push(function(){
        update();
    })
    waitForLoad();
}

function changeBright(){
    $operating = true;
    $r.changeLight(Bright.getValue());
    update();
    $operating = false;
}

var Hue = $('#hue').slider().on('change', changeHue).data('slider');
var Bright = $('#bright').slider().on('change', changeBright).data('slider');

var $downloadNum = 1;

function download(){
    $operating = true;
    update();
    $rendererSilence.render($r,$renderTexture);
    var img = $rendererSilence.extract.image($renderTexture);
    pushForDownload(img);
    update();
    $operating = false;
}

function download4x4(){
    $operating = true;
    update();
    $r.position.x = 0;
    var r2 = $r.spriteOne();
    var r3 = $r.spriteOne();
    
    r2.setFrame(width/NUM_X,0,width/NUM_X,height);

    var res = new Sprite();
    res.addChild(r2);

    r3.position.x = width/NUM_X;
    res.addChild(r3);

    setTimeout(function(){
        $rendererSilence4x4.render(res,$renderTexture4x4);
        setTimeout(function(){
            var img = $rendererSilence4x4.extract.image($renderTexture4x4);
            pushForDownload(img);
            update();
            $operating = false;
        },100)
    },100);
    

   
}

function pushForDownload(img){
    $("#file").attr("href",img.src);
    $("#file").attr("download",`\$clothes_${$downloadNum}.png`);
    $("#file")[0].click();
    $downloadNum ++;
}


function preLoadAllData(id){
    id.children("i").addClass("icon-spin ");
    
    id.addClass("disabled");
    loadAllHueOfPattern();
    waitForPreLoad(function(){
        id.removeClass("btn-default");
        id.addClass("btn-success");
        id.html("加载完毕");
        setTimeout(function(){
            id.remove();
        },3000);
    });
}


function waitForPreLoad(callback){
    if (ImageManager.isReady()) {
        //renderer.render(sp2);
        callback();
    } else {
        setTimeout(()=>{waitForPreLoad(callback)},100);
    }
}